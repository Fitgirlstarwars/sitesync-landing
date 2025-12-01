# Phase 1.4: Document Management System

> Detailed implementation specification for the hierarchical document management system
> Status: Design Phase
> Priority: HIGH - Foundation for knowledge and training

---

## Overview

The Document Management System provides:

1. **Centralized Storage** - All documents in one place
2. **Hierarchical Access Control** - Public → Platform → Organization → Role → Individual
3. **Equipment Linking** - Documents tied to specific equipment
4. **AI Processing** - Text extraction, summarization, search indexing
5. **Distribution Tracking** - Know who has accessed what
6. **Version Control** - Track document revisions
7. **Compliance Support** - Required reading acknowledgments

---

## Access Control Hierarchy

```
DOCUMENT VISIBILITY LEVELS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PUBLIC
├── Industry standards (shared by all)
├── Generic safety procedures
├── Manufacturer public documentation
└── Community-contributed guides

PLATFORM (Any SiteSync User)
├── Platform guides
├── General best practices
├── Cross-company knowledge
└── Manufacturer documentation (licensed)

ORGANIZATION (Company Members Only)
├── Company procedures
├── Internal training materials
├── Proprietary documentation
├── Client-specific documents
└── HR/policy documents

ROLE-BASED (Specific Roles in Org)
├── Manager-only documents
├── Technician certifications
├── Admin procedures
└── Sensitive compliance docs

BUILDING-SPECIFIC (Linked to Site)
├── Building-specific procedures
├── Site access information
├── Equipment manuals for that site
└── Compliance certificates

EQUIPMENT-SPECIFIC (Linked to Asset)
├── Equipment manuals
├── Service history documents
├── Wiring diagrams
├── Inspection reports

PRIVATE (Individual User)
├── Personal certifications
├── User-uploaded docs
├── Notes and references
└── Resume/portfolio
```

---

## User Stories

### Document Access

1. **US-D001:** I want to access the manual for the equipment I'm servicing
2. **US-D002:** I want to download safety procedures before starting work
3. **US-D003:** I want to search across all documents I have access to
4. **US-D004:** I want to view documents on my phone while in the field
5. **US-D005:** I want offline access to critical documents

### Document Management

6. **US-D006:** I want to upload company training materials for my team
7. **US-D007:** I want to control who can access sensitive documents
8. **US-D008:** I want to require employees to acknowledge they've read a document
9. **US-D009:** I want to see who has accessed a document
10. **US-D010:** I want to update a document while keeping the history

### Equipment Linking

11. **US-D011:** I want to link manuals to specific equipment
12. **US-D012:** I want all equipment-related docs to appear on the asset page
13. **US-D013:** I want to auto-suggest relevant docs based on equipment type

### AI Features

14. **US-D014:** I want to search document content, not just titles
15. **US-D015:** I want AI to summarize long technical documents
16. **US-D016:** I want to ask questions and get answers from documents

### Compliance

17. **US-D017:** I want to track certificate expiry dates
18. **US-D018:** I want to be notified before documents expire
19. **US-D019:** I want proof that employees read safety documents

---

## Data Model

### Documents Table

```python
# Core document model (see full schema in database-schema-complete.md)

class DocumentType(str, Enum):
    """Types of documents."""
    MANUAL = "manual"
    WIRING_DIAGRAM = "wiring_diagram"
    PARTS_CATALOG = "parts_catalog"
    SAFETY_PROCEDURE = "safety_procedure"
    TRAINING_MATERIAL = "training"
    CERTIFICATE = "certificate"
    INSPECTION_REPORT = "inspection_report"
    SERVICE_REPORT = "service_report"
    CONTRACT = "contract"
    POLICY = "policy"
    FORM = "form"
    IMAGE = "image"
    VIDEO = "video"
    OTHER = "other"


class DocumentVisibility(str, Enum):
    """Visibility levels."""
    PUBLIC = "public"
    PLATFORM = "platform"
    ORGANIZATION = "organization"
    ROLE_BASED = "role_based"
    BUILDING = "building"
    EQUIPMENT = "equipment"
    PRIVATE = "private"


class Document(BaseModel):
    """Document entity."""

    id: UUID
    organization_id: UUID | None
    uploaded_by: UUID

    # File Info
    filename: str
    original_filename: str
    file_type: str  # 'pdf', 'docx', 'jpg', etc.
    file_size_bytes: int
    mime_type: str
    storage_path: str
    storage_provider: str  # 's3', 'gcs', etc.

    # Metadata
    title: str
    description: str | None

    # Categorization
    document_type: DocumentType
    category: str | None
    tags: list[str]

    # Trade/Equipment Context
    trade: str | None
    manufacturer: str | None
    equipment_model: str | None
    equipment_type: str | None

    # Linking
    site_id: UUID | None
    elevator_id: UUID | None
    work_order_id: UUID | None

    # Access Control
    visibility: DocumentVisibility
    allowed_roles: list[str] | None  # For role_based
    allowed_user_ids: list[UUID] | None  # For explicit sharing

    # Distribution
    requires_acknowledgment: bool
    expiry_date: date | None
    review_date: date | None

    # AI Processing
    text_extracted: bool
    extracted_text: str | None
    ai_summary: str | None
    ai_keywords: list[str]
    embedding: list[float] | None  # For semantic search

    # Version Control
    version: int
    parent_document_id: UUID | None
    is_current_version: bool

    # Stats
    download_count: int
    view_count: int

    # Timestamps
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None


class DocumentFolder(BaseModel):
    """Folder for organizing documents."""

    id: UUID
    organization_id: UUID
    parent_folder_id: UUID | None

    name: str
    description: str | None

    # Access (inherits from parent unless overridden)
    visibility: DocumentVisibility | None
    allowed_roles: list[str] | None

    # Display
    icon: str | None
    color: str | None
    display_order: int

    created_at: datetime


class DocumentAcknowledgment(BaseModel):
    """Tracking of document acknowledgments."""

    id: UUID
    document_id: UUID
    user_id: UUID
    acknowledged_at: datetime
    ip_address: str | None
    signature_data: str | None  # For e-signatures if needed
```

---

## API Design

### Document CRUD

```
# Basic operations
POST   /api/v1/documents                       # Upload
GET    /api/v1/documents                       # List (with filters)
GET    /api/v1/documents/{id}                  # Get metadata
GET    /api/v1/documents/{id}/download         # Download file
GET    /api/v1/documents/{id}/preview          # Preview (images, first page PDF)
PUT    /api/v1/documents/{id}                  # Update metadata
DELETE /api/v1/documents/{id}                  # Soft delete

# Versions
POST   /api/v1/documents/{id}/versions         # Upload new version
GET    /api/v1/documents/{id}/versions         # List versions

# Acknowledgments
POST   /api/v1/documents/{id}/acknowledge      # Acknowledge reading
GET    /api/v1/documents/{id}/acknowledgments  # List who acknowledged
GET    /api/v1/documents/pending-acknowledgments # Docs I need to read

# Search
GET    /api/v1/documents/search                # Full-text search
POST   /api/v1/documents/ask                   # AI Q&A on documents

# Folders
GET    /api/v1/documents/folders
POST   /api/v1/documents/folders
PUT    /api/v1/documents/folders/{id}
DELETE /api/v1/documents/folders/{id}

# Sharing
POST   /api/v1/documents/{id}/share
DELETE /api/v1/documents/{id}/share/{user_id}

# Equipment linking
GET    /api/v1/elevators/{id}/documents
POST   /api/v1/elevators/{id}/documents/link
DELETE /api/v1/elevators/{id}/documents/{doc_id}/unlink
```

---

## Service Implementation

### Document Upload Service

```python
# sitesync_v3/domains/documents/service.py

class DocumentService:
    """Document management service."""

    def __init__(
        self,
        repository: DocumentRepository,
        storage: StorageService,
        ai_service: TriforceOrchestrator,
        search_service: SearchService,
    ):
        self.repo = repository
        self.storage = storage
        self.ai = ai_service
        self.search = search_service

    async def upload_document(
        self,
        file: UploadFile,
        metadata: DocumentCreate,
        uploader_id: UUID,
    ) -> Document:
        """
        Upload a new document.
        """
        # 1. Validate file
        await self._validate_file(file, metadata)

        # 2. Generate storage path
        storage_path = self._generate_storage_path(
            organization_id=metadata.organization_id,
            document_type=metadata.document_type,
            filename=file.filename,
        )

        # 3. Upload to storage
        await self.storage.upload(
            file=file.file,
            path=storage_path,
            content_type=file.content_type,
        )

        # 4. Create document record
        document = await self.repo.create_document(
            organization_id=metadata.organization_id,
            uploaded_by=uploader_id,
            filename=self._sanitize_filename(file.filename),
            original_filename=file.filename,
            file_type=self._get_file_extension(file.filename),
            file_size_bytes=file.size,
            mime_type=file.content_type,
            storage_path=storage_path,
            storage_provider=self.storage.provider_name,
            title=metadata.title or file.filename,
            description=metadata.description,
            document_type=metadata.document_type,
            category=metadata.category,
            tags=metadata.tags,
            trade=metadata.trade,
            manufacturer=metadata.manufacturer,
            visibility=metadata.visibility,
            allowed_roles=metadata.allowed_roles,
            requires_acknowledgment=metadata.requires_acknowledgment,
            expiry_date=metadata.expiry_date,
        )

        # 5. Link to equipment if specified
        if metadata.elevator_id:
            await self.repo.link_to_elevator(document.id, metadata.elevator_id)
        if metadata.site_id:
            await self.repo.link_to_site(document.id, metadata.site_id)

        # 6. Queue AI processing (async)
        await self._queue_ai_processing(document.id)

        # 7. Emit event
        await self._emit_event("document_uploaded", document)

        return document

    async def _queue_ai_processing(self, document_id: UUID) -> None:
        """
        Queue background AI processing.
        """
        # This runs in background:
        # 1. Extract text from PDF/images
        # 2. Generate summary
        # 3. Extract keywords
        # 4. Create embedding
        # 5. Index for search
        pass

    async def create_new_version(
        self,
        document_id: UUID,
        file: UploadFile,
        change_notes: str | None,
        uploader_id: UUID,
    ) -> Document:
        """
        Upload a new version of an existing document.
        """
        # Get current document
        current = await self.repo.get_document(document_id)
        if not current:
            raise NotFoundException("Document not found")

        # Mark current as not current
        await self.repo.update_document(document_id, is_current_version=False)

        # Upload new version
        new_doc = await self.upload_document(
            file=file,
            metadata=DocumentCreate(
                organization_id=current.organization_id,
                title=current.title,
                description=current.description,
                document_type=current.document_type,
                visibility=current.visibility,
                # ... copy other metadata
            ),
            uploader_id=uploader_id,
        )

        # Link to parent
        await self.repo.update_document(
            new_doc.id,
            parent_document_id=document_id,
            version=current.version + 1,
        )

        # Notify users who have acknowledged previous version
        await self._notify_version_update(document_id, new_doc)

        return new_doc


class DocumentAIProcessor:
    """AI processing for documents."""

    async def process_document(self, document_id: UUID) -> None:
        """
        Process a document with AI.
        """
        document = await self.repo.get_document(document_id)

        # 1. Extract text
        extracted_text = await self._extract_text(document)

        # 2. Generate summary
        summary = await self._generate_summary(extracted_text, document)

        # 3. Extract keywords
        keywords = await self._extract_keywords(extracted_text)

        # 4. Create embedding
        embedding = await self._create_embedding(
            f"{document.title}\n{summary}\n{extracted_text[:5000]}"
        )

        # 5. Update document
        await self.repo.update_document(
            document_id,
            text_extracted=True,
            extracted_text=extracted_text,
            ai_summary=summary,
            ai_keywords=keywords,
            embedding=embedding,
        )

        # 6. Index for search
        await self.search.index_document(document_id)

    async def _extract_text(self, document: Document) -> str:
        """Extract text from document."""

        if document.file_type == 'pdf':
            return await self._extract_pdf_text(document.storage_path)
        elif document.file_type in ['jpg', 'jpeg', 'png']:
            return await self._ocr_image(document.storage_path)
        elif document.file_type in ['doc', 'docx']:
            return await self._extract_word_text(document.storage_path)
        else:
            return ""

    async def _generate_summary(
        self,
        text: str,
        document: Document,
    ) -> str:
        """Generate AI summary of document."""

        if not text or len(text) < 100:
            return ""

        prompt = f"""
        Summarize this technical document in 2-3 paragraphs.
        Focus on:
        1. What this document is about
        2. Key information it contains
        3. When someone would need this document

        Document type: {document.document_type}
        Title: {document.title}

        Content:
        {text[:10000]}
        """

        result = await self.triforce.quick_query(prompt)
        return result.text
```

### Access Control Service

```python
# sitesync_v3/domains/documents/access_control.py

class DocumentAccessControl:
    """Manage document access permissions."""

    async def can_access(
        self,
        user_id: UUID,
        document_id: UUID,
    ) -> bool:
        """Check if user can access a document."""

        document = await self.repo.get_document(document_id)
        user = await self.repo.get_user_full(user_id)

        return await self._check_access(user, document)

    async def _check_access(
        self,
        user: User,
        document: Document,
    ) -> bool:
        """Check access based on visibility level."""

        visibility = document.visibility

        # PUBLIC - anyone
        if visibility == DocumentVisibility.PUBLIC:
            return True

        # Must be logged in for all other levels
        if not user:
            return False

        # PLATFORM - any authenticated user
        if visibility == DocumentVisibility.PLATFORM:
            return True

        # ORGANIZATION - same org
        if visibility == DocumentVisibility.ORGANIZATION:
            return user.organization_id == document.organization_id

        # ROLE_BASED - same org + correct role
        if visibility == DocumentVisibility.ROLE_BASED:
            if user.organization_id != document.organization_id:
                return False
            if document.allowed_roles:
                return user.role in document.allowed_roles
            return True

        # BUILDING - has access to the site
        if visibility == DocumentVisibility.BUILDING:
            if not document.site_id:
                return False
            return await self.repo.user_has_site_access(user.id, document.site_id)

        # EQUIPMENT - has access to the equipment
        if visibility == DocumentVisibility.EQUIPMENT:
            if not document.elevator_id:
                return False
            return await self.repo.user_has_elevator_access(user.id, document.elevator_id)

        # PRIVATE - owner only or explicitly shared
        if visibility == DocumentVisibility.PRIVATE:
            if document.uploaded_by == user.id:
                return True
            if document.allowed_user_ids:
                return user.id in document.allowed_user_ids
            return False

        return False

    async def get_accessible_documents(
        self,
        user_id: UUID,
        filters: DocumentFilters,
    ) -> list[Document]:
        """Get all documents user can access."""

        user = await self.repo.get_user_full(user_id)

        # Build access query
        access_conditions = self._build_access_conditions(user)

        return await self.repo.get_documents_with_access(
            access_conditions=access_conditions,
            filters=filters,
        )

    def _build_access_conditions(self, user: User) -> list:
        """Build SQL conditions for access."""

        conditions = [
            # Public documents
            "visibility = 'public'",
            # Platform documents
            "visibility = 'platform'",
        ]

        if user.organization_id:
            # Organization documents
            conditions.append(
                f"(visibility = 'organization' AND organization_id = '{user.organization_id}')"
            )
            # Role-based documents
            conditions.append(
                f"(visibility = 'role_based' AND organization_id = '{user.organization_id}' "
                f"AND (allowed_roles IS NULL OR '{user.role}' = ANY(allowed_roles)))"
            )

        # Private documents owned by user
        conditions.append(f"(visibility = 'private' AND uploaded_by = '{user.id}')")

        # Explicitly shared
        conditions.append(f"'{user.id}' = ANY(allowed_user_ids)")

        return " OR ".join(conditions)
```

### Document Search

```python
# sitesync_v3/domains/documents/search.py

class DocumentSearchService:
    """Full-text and semantic search for documents."""

    async def search(
        self,
        query: str,
        user_id: UUID,
        filters: DocumentSearchFilters,
    ) -> DocumentSearchResult:
        """
        Search documents with access control.
        """
        # Get user's access context
        access_context = await self.access_control.get_access_context(user_id)

        # Hybrid search: keyword + semantic
        if query:
            keyword_results = await self._keyword_search(query, access_context, filters)
            semantic_results = await self._semantic_search(query, access_context, filters)
            results = self._merge_results(keyword_results, semantic_results)
        else:
            # Filter-only search
            results = await self._filter_search(access_context, filters)

        return DocumentSearchResult(
            results=results,
            total=len(results),
            query=query,
        )

    async def _keyword_search(
        self,
        query: str,
        access_context: AccessContext,
        filters: DocumentSearchFilters,
    ) -> list[DocumentSearchHit]:
        """Full-text search in extracted text."""

        sql = """
            SELECT
                d.*,
                ts_rank(
                    to_tsvector('english', COALESCE(d.title, '') || ' ' ||
                               COALESCE(d.extracted_text, '')),
                    plainto_tsquery('english', $1)
                ) as rank,
                ts_headline('english', d.extracted_text,
                           plainto_tsquery('english', $1),
                           'MaxWords=50, MinWords=20') as snippet
            FROM documents d
            WHERE
                ({access_conditions})
                AND d.deleted_at IS NULL
                AND to_tsvector('english', COALESCE(d.title, '') || ' ' ||
                               COALESCE(d.extracted_text, ''))
                    @@ plainto_tsquery('english', $1)
            ORDER BY rank DESC
            LIMIT 50
        """.format(access_conditions=access_context.sql_conditions)

        rows = await self.db.execute(sql, [query])
        return [self._row_to_hit(row) for row in rows]

    async def _semantic_search(
        self,
        query: str,
        access_context: AccessContext,
        filters: DocumentSearchFilters,
    ) -> list[DocumentSearchHit]:
        """Vector similarity search."""

        # Create query embedding
        query_embedding = await self.embeddings.create(query)

        sql = """
            SELECT
                d.*,
                1 - (d.embedding <=> $1::vector) as similarity
            FROM documents d
            WHERE
                ({access_conditions})
                AND d.deleted_at IS NULL
                AND d.embedding IS NOT NULL
            ORDER BY similarity DESC
            LIMIT 50
        """.format(access_conditions=access_context.sql_conditions)

        rows = await self.db.execute(sql, [query_embedding])
        return [self._row_to_hit(row) for row in rows]


class DocumentQAService:
    """AI question-answering over documents."""

    async def ask(
        self,
        question: str,
        user_id: UUID,
        document_ids: list[UUID] | None = None,
    ) -> DocumentAnswer:
        """
        Answer a question using document content.
        """
        # Get relevant documents
        if document_ids:
            # Search within specified documents
            docs = await self.repo.get_documents(document_ids)
            # Verify access
            for doc in docs:
                if not await self.access_control.can_access(user_id, doc.id):
                    raise ForbiddenException(f"Cannot access document {doc.id}")
        else:
            # Search all accessible documents
            search_result = await self.search.search(
                query=question,
                user_id=user_id,
                filters=DocumentSearchFilters(),
            )
            docs = [r.document for r in search_result.results[:10]]

        if not docs:
            return DocumentAnswer(
                answer="I couldn't find any relevant documents to answer your question.",
                confidence=0.0,
                sources=[],
            )

        # Build context from documents
        context = self._build_context(docs)

        # Generate answer
        prompt = f"""
        Answer the following question based on the provided documents.
        Only use information from the documents. If the answer isn't in the documents, say so.

        Question: {question}

        Documents:
        {context}

        Provide:
        1. A clear answer
        2. Which document(s) the answer came from
        3. Relevant quotes if applicable
        """

        result = await self.triforce.query(
            prompt=prompt,
            output_schema=DocumentAnswerInternal,
        )

        return DocumentAnswer(
            answer=result.answer,
            confidence=result.confidence,
            sources=[
                DocumentSource(
                    document_id=doc.id,
                    title=doc.title,
                    relevant_excerpt=result.excerpts.get(str(doc.id)),
                )
                for doc in docs
                if str(doc.id) in result.cited_documents
            ],
        )
```

### Company Document Distribution

```python
# sitesync_v3/domains/documents/distribution.py

class DocumentDistributionService:
    """Manage company document distribution and acknowledgments."""

    async def distribute_document(
        self,
        document_id: UUID,
        recipient_config: DistributionConfig,
        distributor_id: UUID,
    ) -> DistributionResult:
        """
        Distribute a document to employees/roles.
        """
        document = await self.repo.get_document(document_id)

        # Determine recipients
        recipients = await self._resolve_recipients(recipient_config)

        # Create distribution record
        distribution = await self.repo.create_distribution(
            document_id=document_id,
            distributed_by=distributor_id,
            recipient_user_ids=[r.id for r in recipients],
            requires_acknowledgment=recipient_config.requires_acknowledgment,
            due_date=recipient_config.acknowledgment_due_date,
        )

        # Notify recipients
        for recipient in recipients:
            await self.notifications.send(
                user_id=recipient.id,
                notification_type="document_assigned",
                title="New document to review",
                message=f"'{document.title}' has been shared with you.",
                link_type="document",
                link_id=document_id,
                requires_action=recipient_config.requires_acknowledgment,
                due_date=recipient_config.acknowledgment_due_date,
            )

        return DistributionResult(
            distribution_id=distribution.id,
            recipients_count=len(recipients),
            acknowledgment_required=recipient_config.requires_acknowledgment,
            due_date=recipient_config.acknowledgment_due_date,
        )

    async def _resolve_recipients(
        self,
        config: DistributionConfig,
    ) -> list[User]:
        """Resolve recipient list from config."""

        recipients = set()

        # By role
        if config.target_roles:
            role_users = await self.repo.get_users_by_roles(
                organization_id=config.organization_id,
                roles=config.target_roles,
            )
            recipients.update(role_users)

        # By team/group
        if config.target_teams:
            team_users = await self.repo.get_users_by_teams(
                organization_id=config.organization_id,
                team_ids=config.target_teams,
            )
            recipients.update(team_users)

        # Specific users
        if config.target_user_ids:
            specific_users = await self.repo.get_users(config.target_user_ids)
            recipients.update(specific_users)

        # All organization members
        if config.all_organization:
            all_users = await self.repo.get_organization_members(
                config.organization_id
            )
            recipients.update(all_users)

        return list(recipients)

    async def get_acknowledgment_status(
        self,
        document_id: UUID,
        organization_id: UUID,
    ) -> AcknowledgmentStatus:
        """Get acknowledgment status for a document."""

        distribution = await self.repo.get_distribution(document_id)
        if not distribution:
            raise NotFoundException("No distribution found")

        acknowledgments = await self.repo.get_acknowledgments(document_id)
        acknowledged_user_ids = {a.user_id for a in acknowledgments}

        pending = [
            uid for uid in distribution.recipient_user_ids
            if uid not in acknowledged_user_ids
        ]

        return AcknowledgmentStatus(
            total_recipients=len(distribution.recipient_user_ids),
            acknowledged_count=len(acknowledgments),
            pending_count=len(pending),
            pending_user_ids=pending,
            completion_rate=len(acknowledgments) / len(distribution.recipient_user_ids) * 100,
            due_date=distribution.due_date,
            is_overdue=distribution.due_date and date.today() > distribution.due_date,
        )

    async def acknowledge_document(
        self,
        document_id: UUID,
        user_id: UUID,
        ip_address: str | None = None,
    ) -> DocumentAcknowledgment:
        """Record user acknowledgment of a document."""

        # Verify user needs to acknowledge
        distribution = await self.repo.get_distribution(document_id)
        if user_id not in distribution.recipient_user_ids:
            raise ValidationException("You are not required to acknowledge this document")

        # Check not already acknowledged
        existing = await self.repo.get_acknowledgment(document_id, user_id)
        if existing:
            raise ValidationException("Already acknowledged")

        # Create acknowledgment
        ack = await self.repo.create_acknowledgment(
            document_id=document_id,
            user_id=user_id,
            ip_address=ip_address,
        )

        # Update distribution stats
        await self._update_distribution_stats(document_id)

        return ack

    async def get_pending_acknowledgments(
        self,
        user_id: UUID,
    ) -> list[PendingDocument]:
        """Get documents user needs to acknowledge."""

        pending = await self.repo.get_pending_acknowledgments(user_id)

        return [
            PendingDocument(
                document=p.document,
                assigned_at=p.assigned_at,
                due_date=p.due_date,
                is_overdue=p.due_date and date.today() > p.due_date,
            )
            for p in pending
        ]
```

---

## Frontend Components

### Document Browser

```tsx
// src/features/documents/components/DocumentBrowser.tsx

export function DocumentBrowser() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const { data: documents } = useDocuments({
    folderId: currentFolder?.id,
    includeSubfolders: false,
  });

  const { data: folders } = useDocumentFolders({
    parentId: currentFolder?.id,
  });

  return (
    <DocumentLayout>
      {/* Toolbar */}
      <Toolbar>
        <Breadcrumbs folder={currentFolder} onNavigate={setCurrentFolder} />
        <SearchBox onSearch={handleSearch} />
        <ViewToggle value={view} onChange={setView} />
        <UploadButton onUpload={handleUpload} />
      </Toolbar>

      {/* Sidebar - Quick Access */}
      <Sidebar>
        <QuickAccess>
          <QuickLink icon="⏰" label="Recent" onClick={() => setFilter('recent')} />
          <QuickLink icon="⭐" label="Starred" onClick={() => setFilter('starred')} />
          <QuickLink icon="📋" label="Need to Read" onClick={() => setFilter('pending_ack')} count={pendingCount} />
          <QuickLink icon="📤" label="Shared by Me" onClick={() => setFilter('shared')} />
        </QuickAccess>

        <FolderTree
          folders={allFolders}
          selected={currentFolder?.id}
          onSelect={setCurrentFolder}
        />

        <StorageUsage used={storageUsed} total={storageTotal} />
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        {/* Folders */}
        {folders?.length > 0 && (
          <Section title="Folders">
            <FolderGrid>
              {folders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onClick={() => setCurrentFolder(folder)}
                />
              ))}
            </FolderGrid>
          </Section>
        )}

        {/* Documents */}
        <Section title="Documents">
          {view === 'grid' ? (
            <DocumentGrid>
              {documents?.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  selected={selectedDocs.includes(doc.id)}
                  onSelect={() => toggleSelect(doc.id)}
                  onOpen={() => openDocument(doc)}
                />
              ))}
            </DocumentGrid>
          ) : (
            <DocumentTable
              documents={documents}
              selected={selectedDocs}
              onSelect={toggleSelect}
              onOpen={openDocument}
            />
          )}
        </Section>
      </MainContent>

      {/* Selection Actions */}
      {selectedDocs.length > 0 && (
        <SelectionToolbar>
          <span>{selectedDocs.length} selected</span>
          <Button onClick={downloadSelected}>Download</Button>
          <Button onClick={shareSelected}>Share</Button>
          <Button onClick={moveSelected}>Move</Button>
          <Button variant="danger" onClick={deleteSelected}>Delete</Button>
        </SelectionToolbar>
      )}
    </DocumentLayout>
  );
}
```

### Document Viewer

```tsx
// src/features/documents/components/DocumentViewer.tsx

export function DocumentViewer({ documentId }: { documentId: string }) {
  const { data: document } = useDocument(documentId);
  const { data: versions } = useDocumentVersions(documentId);
  const [showAIPanel, setShowAIPanel] = useState(false);

  if (!document) return <LoadingState />;

  return (
    <ViewerLayout>
      {/* Header */}
      <ViewerHeader>
        <BackButton />
        <DocumentTitle>{document.title}</DocumentTitle>
        <DocumentMeta>
          <TypeBadge type={document.document_type} />
          <FileSize bytes={document.file_size_bytes} />
          <UploadedBy user={document.uploader} date={document.created_at} />
        </DocumentMeta>
        <Actions>
          <DownloadButton document={document} />
          <ShareButton document={document} />
          <AIButton onClick={() => setShowAIPanel(true)} />
          <MoreMenu document={document} />
        </Actions>
      </ViewerHeader>

      {/* Content */}
      <ViewerContent>
        {/* Preview */}
        <PreviewPane>
          {document.file_type === 'pdf' ? (
            <PDFViewer url={document.preview_url} />
          ) : document.file_type.match(/^(jpg|jpeg|png|gif)$/) ? (
            <ImageViewer url={document.preview_url} />
          ) : document.file_type.match(/^(doc|docx)$/) ? (
            <WordViewer url={document.preview_url} />
          ) : (
            <NoPreview>
              <p>Preview not available for this file type</p>
              <DownloadButton document={document} />
            </NoPreview>
          )}
        </PreviewPane>

        {/* Sidebar */}
        <ViewerSidebar>
          {/* Details */}
          <Panel title="Details">
            <DetailRow label="Type" value={document.document_type} />
            <DetailRow label="Category" value={document.category} />
            <DetailRow label="Size" value={formatBytes(document.file_size_bytes)} />
            <DetailRow label="Uploaded" value={formatDate(document.created_at)} />
            <DetailRow label="Modified" value={formatDate(document.updated_at)} />
            <DetailRow label="Downloads" value={document.download_count} />
          </Panel>

          {/* AI Summary */}
          {document.ai_summary && (
            <Panel title="AI Summary">
              <Summary>{document.ai_summary}</Summary>
            </Panel>
          )}

          {/* Tags */}
          <Panel title="Tags">
            <TagList tags={document.tags} editable />
          </Panel>

          {/* Equipment Links */}
          {document.elevator_id && (
            <Panel title="Linked Equipment">
              <EquipmentLink elevatorId={document.elevator_id} />
            </Panel>
          )}

          {/* Versions */}
          {versions?.length > 1 && (
            <Panel title="Versions">
              <VersionList versions={versions} current={document.version} />
            </Panel>
          )}

          {/* Acknowledgment */}
          {document.requires_acknowledgment && (
            <Panel title="Acknowledgment Required">
              <AcknowledgmentStatus documentId={document.id} />
            </Panel>
          )}
        </ViewerSidebar>
      </ViewerContent>

      {/* AI Panel */}
      <AIPanel open={showAIPanel} onClose={() => setShowAIPanel(false)}>
        <DocumentAI documentId={document.id} />
      </AIPanel>
    </ViewerLayout>
  );
}
```

### Document Upload

```tsx
// src/features/documents/components/DocumentUpload.tsx

export function DocumentUpload({ folderId, onComplete }: Props) {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      metadata: {
        title: file.name.replace(/\.[^/.]+$/, ''),
        document_type: guessDocumentType(file.name),
        visibility: 'organization' as DocumentVisibility,
        tags: [],
      },
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  return (
    <UploadDialog>
      {/* Drop Zone */}
      {files.length === 0 && (
        <DropZone onDrop={handleDrop}>
          <UploadIcon />
          <p>Drag files here or click to select</p>
          <FileTypes>PDF, Word, Images, Videos</FileTypes>
        </DropZone>
      )}

      {/* File List with Metadata */}
      {files.length > 0 && (
        <FileList>
          {files.map((item, index) => (
            <FileMetadataForm
              key={index}
              file={item.file}
              metadata={item.metadata}
              onChange={(meta) => updateMetadata(index, meta)}
              onRemove={() => removeFile(index)}
            />
          ))}

          <AddMoreButton onClick={openFilePicker}>
            + Add More Files
          </AddMoreButton>
        </FileList>
      )}

      {/* Batch Settings */}
      {files.length > 1 && (
        <BatchSettings>
          <Checkbox
            label="Apply same visibility to all"
            checked={batchVisibility}
            onChange={setBatchVisibility}
          />
          {batchVisibility && (
            <VisibilitySelect
              value={sharedVisibility}
              onChange={setSharedVisibility}
            />
          )}
        </BatchSettings>
      )}

      {/* Actions */}
      <DialogActions>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button
          variant="primary"
          onClick={handleUpload}
          loading={uploading}
          disabled={files.length === 0}
        >
          Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
        </Button>
      </DialogActions>
    </UploadDialog>
  );
}

function FileMetadataForm({ file, metadata, onChange, onRemove }: Props) {
  return (
    <Card>
      <CardHeader>
        <FileIcon type={file.type} />
        <FileName>{file.name}</FileName>
        <FileSize>{formatBytes(file.size)}</FileSize>
        <RemoveButton onClick={onRemove} />
      </CardHeader>

      <CardBody>
        <FormField label="Title">
          <Input
            value={metadata.title}
            onChange={(e) => onChange({ ...metadata, title: e.target.value })}
          />
        </FormField>

        <FormField label="Document Type">
          <Select
            value={metadata.document_type}
            onChange={(v) => onChange({ ...metadata, document_type: v })}
            options={DOCUMENT_TYPES}
          />
        </FormField>

        <FormField label="Visibility">
          <VisibilitySelect
            value={metadata.visibility}
            onChange={(v) => onChange({ ...metadata, visibility: v })}
          />
        </FormField>

        <FormField label="Tags">
          <TagInput
            value={metadata.tags}
            onChange={(tags) => onChange({ ...metadata, tags })}
            suggestions={suggestedTags}
          />
        </FormField>

        {/* Equipment Linking */}
        <FormField label="Link to Equipment (optional)">
          <EquipmentSearch
            value={metadata.elevator_id}
            onChange={(id) => onChange({ ...metadata, elevator_id: id })}
          />
        </FormField>

        {/* Acknowledgment */}
        <Checkbox
          label="Require acknowledgment"
          checked={metadata.requires_acknowledgment}
          onChange={(checked) => onChange({ ...metadata, requires_acknowledgment: checked })}
        />
      </CardBody>
    </Card>
  );
}
```

---

## Success Metrics

### Phase 1.4 KPIs

| Metric | Target (Month 1) | Target (Month 3) | Target (Month 6) |
|--------|------------------|------------------|------------------|
| Documents uploaded | 1,000 | 10,000 | 50,000 |
| Document searches/day | 100 | 1,000 | 5,000 |
| Search success rate | 70% | 80% | 90% |
| AI Q&A usage | 50/day | 500/day | 2,000/day |
| Acknowledgment completion rate | 80% | 90% | 95% |
| Storage utilization | 100GB | 1TB | 10TB |

---

## Implementation Timeline

### Week 1-2: Core Infrastructure
- [ ] Storage service integration (S3/GCS)
- [ ] Document CRUD APIs
- [ ] Basic upload/download
- [ ] Access control foundation

### Week 3-4: Access Control & Organization
- [ ] Visibility levels implementation
- [ ] Folder system
- [ ] Equipment linking
- [ ] Site/building linking

### Week 5-6: AI Processing
- [ ] Text extraction pipeline
- [ ] Summary generation
- [ ] Embedding creation
- [ ] Search indexing

### Week 7-8: Search & Discovery
- [ ] Full-text search
- [ ] Semantic search
- [ ] AI Q&A feature
- [ ] Filtering and facets

### Week 9-10: Distribution & Polish
- [ ] Acknowledgment system
- [ ] Distribution management
- [ ] Version control
- [ ] Frontend polish

---

*Document Version: 1.0*
*Last Updated: December 2025*
