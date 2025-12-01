# Phase 1.1: Technician Knowledge Platform

> Detailed implementation specification for the knowledge contribution and discovery system
> Status: Design Phase
> Priority: HIGH - Foundation for community value

---

## Overview

The Technician Knowledge Platform enables technicians to:
1. **Contribute** solutions, tips, quirks, and procedures they discover
2. **Search** the collective knowledge base when facing problems
3. **Earn recognition** for helping others through their contributions
4. **Grow the platform's value** with every job completed

---

## User Stories

### As a Technician:

1. **US-K001:** I want to share a solution I discovered so other technicians don't waste time on the same problem
2. **US-K002:** I want to search for solutions when I encounter an unfamiliar fault code
3. **US-K003:** I want to see how many people my contributions have helped
4. **US-K004:** I want to choose whether my name is shown on contributions
5. **US-K005:** I want to upvote helpful contributions to reward good content
6. **US-K006:** I want to add context (equipment, fault code) to make solutions findable
7. **US-K007:** I want to update my contribution if I learn something new
8. **US-K008:** I want to attach photos or documents to my contributions
9. **US-K009:** I want to get notifications when someone finds my contribution helpful
10. **US-K010:** I want to see contributions relevant to my current job

### As a Building Manager:

11. **US-K011:** I want to understand common issues with my equipment type
12. **US-K012:** I want to verify my contractor is following best practices

### As an Admin:

13. **US-K013:** I want to moderate inappropriate or incorrect contributions
14. **US-K014:** I want to see analytics on knowledge platform usage
15. **US-K015:** I want to seed the platform with official documentation

---

## Feature Breakdown

### 1.1.1 Knowledge Contribution System

#### 1.1.1.1 Contribution Creation

**API Endpoints:**

```
POST   /api/v1/knowledge/contributions
GET    /api/v1/knowledge/contributions
GET    /api/v1/knowledge/contributions/{id}
PUT    /api/v1/knowledge/contributions/{id}
DELETE /api/v1/knowledge/contributions/{id}
POST   /api/v1/knowledge/contributions/{id}/publish
```

**Contribution Types:**

| Type | Description | Fields | Validation |
|------|-------------|--------|------------|
| `solution` | Complete problem resolution | Full procedure, root cause, parts | Requires fault_code or symptoms |
| `tip` | Quick insight or shortcut | Brief text, context | Min 50 chars |
| `procedure` | Step-by-step process | Numbered steps | Min 3 steps |
| `equipment_quirk` | Known issue with specific equipment | Equipment + behavior | Requires equipment info |
| `safety_note` | Safety-critical information | Risk, mitigation | Priority review |

**Creation Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                  CONTRIBUTION CREATION FLOW                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. TRIGGER                                                      │
│     ├── From work order completion (prompted)                    │
│     ├── From knowledge search (no results found)                 │
│     └── From dedicated "Contribute" button                       │
│                                                                  │
│  2. CONTEXT CAPTURE                                              │
│     ├── Auto-fill equipment info (if from work order)            │
│     ├── Auto-fill fault code (if from work order)                │
│     └── Suggest relevant tags                                    │
│                                                                  │
│  3. CONTENT ENTRY                                                │
│     ├── Title (required, AI-suggested)                           │
│     ├── Content (rich text editor)                               │
│     ├── Contribution type selection                              │
│     ├── Equipment tagging                                        │
│     ├── Fault code linking                                       │
│     └── Media attachments                                        │
│                                                                  │
│  4. ATTRIBUTION CHOICE                                           │
│     ├── Full (name + company) - default                          │
│     ├── Company only                                             │
│     └── Anonymous                                                │
│                                                                  │
│  5. AI ENHANCEMENT (Background)                                  │
│     ├── Grammar/clarity check                                    │
│     ├── Technical accuracy flag                                  │
│     ├── Auto-tagging                                             │
│     ├── Related content linking                                  │
│     ├── Summary generation                                       │
│     └── Embedding creation                                       │
│                                                                  │
│  6. SUBMISSION                                                   │
│     ├── If trusted author → Auto-approve                         │
│     ├── If new author → Pending review                           │
│     └── If safety_note → Priority review queue                   │
│                                                                  │
│  7. POST-PUBLISH                                                 │
│     ├── Index for search                                         │
│     ├── Notify subscribers                                       │
│     └── Update author metrics                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Request Schema:**

```python
# sitesync_v3/domains/knowledge/contracts.py

from pydantic import BaseModel, Field
from enum import Enum
from uuid import UUID
from datetime import datetime

class ContributionType(str, Enum):
    SOLUTION = "solution"
    TIP = "tip"
    PROCEDURE = "procedure"
    EQUIPMENT_QUIRK = "equipment_quirk"
    SAFETY_NOTE = "safety_note"

class AttributionType(str, Enum):
    FULL = "full"
    COMPANY = "company"
    ANONYMOUS = "anonymous"

class ContributionCreate(BaseModel):
    """Request to create a new knowledge contribution."""

    # Content
    title: str = Field(..., min_length=10, max_length=255)
    content: str = Field(..., min_length=50)
    contribution_type: ContributionType

    # Context (optional but encouraged)
    equipment_manufacturer: str | None = None
    equipment_model: str | None = None
    equipment_type: str | None = None
    fault_code: str | None = None
    tags: list[str] = []

    # Trade
    trade: str = "elevators"  # 'elevators', 'hvac', etc.

    # Attribution
    attribution_type: AttributionType = AttributionType.FULL

    # Linking (if created from context)
    work_order_id: UUID | None = None
    elevator_id: UUID | None = None

    # Media
    attachment_ids: list[UUID] = []

class ContributionResponse(BaseModel):
    """Response after creating/retrieving a contribution."""

    id: UUID

    # Author (based on attribution)
    author_display_name: str | None  # NULL if anonymous
    author_company: str | None
    author_expertise_score: int | None
    author_id: UUID | None  # NULL if anonymous

    # Content
    title: str
    content: str
    content_html: str  # Rendered markdown
    contribution_type: ContributionType

    # Context
    equipment_manufacturer: str | None
    equipment_model: str | None
    fault_code: str | None
    tags: list[str]
    trade: str

    # Status
    status: str

    # Metrics
    upvotes: int
    downvotes: int
    times_viewed: int
    times_used: int
    technicians_helped: int
    estimated_hours_saved: float

    # AI
    ai_summary: str | None

    # Metadata
    created_at: datetime
    updated_at: datetime

    # Permissions
    can_edit: bool
    can_delete: bool
```

**Service Implementation:**

```python
# sitesync_v3/domains/knowledge/service.py

from uuid import UUID
from datetime import datetime

class KnowledgeService:
    """Service for managing knowledge contributions."""

    def __init__(
        self,
        repository: KnowledgeRepository,
        ai_service: TriforceOrchestrator,
        search_service: SearchService,
        notification_service: NotificationService,
        metrics_service: MetricsService,
    ):
        self.repo = repository
        self.ai = ai_service
        self.search = search_service
        self.notifications = notification_service
        self.metrics = metrics_service

    async def create_contribution(
        self,
        data: ContributionCreate,
        author_id: UUID,
    ) -> ContributionResponse:
        """
        Create a new knowledge contribution.
        """
        # 1. Validate author
        author = await self.repo.get_user_with_profile(author_id)
        if not author:
            raise NotFoundException("User not found")

        # 2. Determine initial status
        status = await self._determine_initial_status(author, data)

        # 3. Create contribution record
        contribution = await self.repo.create_contribution(
            author_id=author_id,
            author_profile_id=author.technician_profile_id,
            organization_id=author.organization_id,
            title=data.title,
            content=data.content,
            contribution_type=data.contribution_type,
            equipment_manufacturer=data.equipment_manufacturer,
            equipment_model=data.equipment_model,
            equipment_type=data.equipment_type,
            fault_code=data.fault_code,
            tags=data.tags,
            trade=data.trade,
            attribution_type=data.attribution_type,
            status=status,
        )

        # 4. Process attachments
        if data.attachment_ids:
            await self.repo.link_attachments(contribution.id, data.attachment_ids)

        # 5. Run AI enhancement (async background task)
        await self._queue_ai_enhancement(contribution.id)

        # 6. If auto-approved, index immediately
        if status == "approved":
            await self._publish_contribution(contribution.id)

        # 7. Emit event
        await self._emit_event("contribution_created", contribution)

        return await self._build_response(contribution, author_id)

    async def _determine_initial_status(
        self,
        author: User,
        data: ContributionCreate,
    ) -> str:
        """
        Determine if contribution needs review or can be auto-approved.
        """
        # Safety notes always need review
        if data.contribution_type == ContributionType.SAFETY_NOTE:
            return "pending_review"

        # Check author trust level
        profile = author.technician_profile
        if profile and profile.contributions_count >= 10:
            # Trusted author - auto-approve
            return "approved"

        # New author or low contribution count
        return "pending_review"

    async def _queue_ai_enhancement(self, contribution_id: UUID) -> None:
        """
        Queue background task for AI enhancement.
        """
        # This runs in background:
        # 1. Generate summary
        # 2. Extract keywords
        # 3. Create embedding
        # 4. Check for duplicates
        # 5. Suggest related content
        # 6. Grammar/quality check
        pass

    async def _publish_contribution(self, contribution_id: UUID) -> None:
        """
        Publish an approved contribution.
        """
        contribution = await self.repo.get_contribution(contribution_id)

        # 1. Update status
        await self.repo.update_contribution(
            contribution_id,
            status="approved",
            published_at=datetime.utcnow(),
        )

        # 2. Index for search
        await self.search.index_contribution(contribution)

        # 3. Notify subscribers (people watching this fault code, etc.)
        await self.notifications.notify_subscribers(
            entity_type="knowledge",
            tags=contribution.tags,
            fault_code=contribution.fault_code,
            equipment_manufacturer=contribution.equipment_manufacturer,
        )

    async def record_usage(
        self,
        contribution_id: UUID,
        user_id: UUID,
        work_order_id: UUID | None = None,
        was_helpful: bool | None = None,
        time_saved_minutes: int | None = None,
    ) -> None:
        """
        Record that a user used this contribution.
        """
        # 1. Record usage
        await self.repo.create_usage_record(
            contribution_id=contribution_id,
            user_id=user_id,
            work_order_id=work_order_id,
            was_helpful=was_helpful,
            time_saved_minutes=time_saved_minutes,
        )

        # 2. Update contribution metrics
        await self.repo.increment_contribution_stats(
            contribution_id=contribution_id,
            times_used=1,
            technicians_helped=1,
            hours_saved=(time_saved_minutes or 0) / 60,
        )

        # 3. Update author metrics
        contribution = await self.repo.get_contribution(contribution_id)
        await self.metrics.update_author_impact(
            author_id=contribution.author_id,
            technicians_helped=1,
            hours_saved=(time_saved_minutes or 0) / 60,
        )

        # 4. Notify author (batched, not every use)
        # "Your contribution 'KONE F505 Fix' helped 5 more technicians this week!"
```

#### 1.1.1.2 Attribution System

**Implementation:**

```python
# sitesync_v3/domains/knowledge/attribution.py

class AttributionService:
    """Handles contribution attribution logic."""

    def get_display_attribution(
        self,
        contribution: Contribution,
        author: User,
        viewer_id: UUID | None = None,
    ) -> dict:
        """
        Get the display attribution based on author's choice.
        """
        if contribution.attribution_type == AttributionType.ANONYMOUS:
            return {
                "author_display_name": None,
                "author_company": None,
                "author_expertise_score": None,
                "author_id": None,
                "attribution_text": "Community Contributor",
            }

        elif contribution.attribution_type == AttributionType.COMPANY:
            return {
                "author_display_name": None,
                "author_company": author.organization.name if author.organization else None,
                "author_expertise_score": None,
                "author_id": None,
                "attribution_text": f"{author.organization.name} Technician",
            }

        else:  # FULL attribution
            profile = author.technician_profile
            return {
                "author_display_name": author.display_name,
                "author_company": author.organization.name if author.organization else None,
                "author_expertise_score": profile.expertise_score if profile else None,
                "author_id": author.id,
                "attribution_text": f"{author.display_name}, {author.organization.name}",
            }
```

#### 1.1.1.3 AI Enhancement Pipeline

```python
# sitesync_v3/domains/knowledge/ai_enhancement.py

from pydantic import BaseModel

class EnhancementResult(BaseModel):
    """Result of AI enhancement."""
    summary: str
    keywords: list[str]
    embedding: list[float]
    quality_score: float
    suggested_tags: list[str]
    related_contribution_ids: list[UUID]
    grammar_issues: list[str]
    technical_accuracy_flags: list[str]
    duplicate_warning: str | None

class ContributionEnhancer:
    """AI-powered contribution enhancement."""

    def __init__(self, triforce: TriforceOrchestrator):
        self.triforce = triforce

    async def enhance(self, contribution: Contribution) -> EnhancementResult:
        """
        Enhance a contribution with AI.
        """
        # 1. Generate summary
        summary = await self._generate_summary(contribution)

        # 2. Extract keywords
        keywords = await self._extract_keywords(contribution)

        # 3. Create embedding for semantic search
        embedding = await self._create_embedding(contribution)

        # 4. Check quality
        quality_score = await self._assess_quality(contribution)

        # 5. Suggest additional tags
        suggested_tags = await self._suggest_tags(contribution)

        # 6. Find related contributions
        related = await self._find_related(embedding)

        # 7. Check for duplicates
        duplicate_warning = await self._check_duplicates(embedding, contribution)

        # 8. Grammar check
        grammar_issues = await self._check_grammar(contribution.content)

        # 9. Technical accuracy flags
        accuracy_flags = await self._check_technical_accuracy(contribution)

        return EnhancementResult(
            summary=summary,
            keywords=keywords,
            embedding=embedding,
            quality_score=quality_score,
            suggested_tags=suggested_tags,
            related_contribution_ids=related,
            grammar_issues=grammar_issues,
            technical_accuracy_flags=accuracy_flags,
            duplicate_warning=duplicate_warning,
        )

    async def _generate_summary(self, contribution: Contribution) -> str:
        """Generate a 1-2 sentence summary."""
        prompt = f"""
        Summarize this technical contribution in 1-2 sentences:

        Title: {contribution.title}
        Type: {contribution.contribution_type}
        Content: {contribution.content}

        Focus on the key insight or solution.
        """

        result = await self.triforce.quick_query(prompt)
        return result.text

    async def _create_embedding(self, contribution: Contribution) -> list[float]:
        """Create embedding for semantic search."""
        text = f"{contribution.title}\n{contribution.content}"

        # Include context
        if contribution.fault_code:
            text = f"Fault code: {contribution.fault_code}\n{text}"
        if contribution.equipment_manufacturer:
            text = f"Equipment: {contribution.equipment_manufacturer} {contribution.equipment_model or ''}\n{text}"

        return await self.triforce.create_embedding(text)

    async def _check_duplicates(
        self,
        embedding: list[float],
        contribution: Contribution,
    ) -> str | None:
        """Check if this contribution duplicates existing content."""
        # Search for similar contributions
        similar = await self.search.vector_search(
            embedding=embedding,
            limit=5,
            threshold=0.95,  # Very high similarity
        )

        if similar:
            # Filter out same author's contributions
            duplicates = [
                s for s in similar
                if s.author_id != contribution.author_id
            ]

            if duplicates:
                return f"Similar contribution exists: '{duplicates[0].title}'"

        return None
```

---

### 1.1.2 Knowledge Search & Discovery

#### 1.1.2.1 Search API

```
GET /api/v1/knowledge/search?q={query}
GET /api/v1/knowledge/search/fault-code/{code}
GET /api/v1/knowledge/search/equipment/{manufacturer}/{model}
GET /api/v1/knowledge/suggestions
POST /api/v1/knowledge/ask (AI-synthesized answer)
```

**Search Request:**

```python
class KnowledgeSearchRequest(BaseModel):
    """Search request parameters."""

    # Query
    query: str | None = None

    # Filters
    fault_code: str | None = None
    equipment_manufacturer: str | None = None
    equipment_model: str | None = None
    equipment_type: str | None = None
    contribution_type: ContributionType | None = None
    trade: str | None = None
    tags: list[str] = []

    # Quality filters
    min_quality_score: float | None = None
    min_usage_count: int | None = None
    verified_only: bool = False

    # Pagination
    page: int = 1
    page_size: int = 20

    # Sorting
    sort_by: str = "relevance"  # 'relevance', 'recent', 'popular', 'helpful'
```

**Search Implementation (Hybrid):**

```python
# sitesync_v3/domains/knowledge/search.py

class KnowledgeSearchService:
    """Hybrid search combining vector and keyword search."""

    def __init__(
        self,
        db: AsyncSession,
        embedding_service: EmbeddingService,
    ):
        self.db = db
        self.embeddings = embedding_service

    async def search(
        self,
        request: KnowledgeSearchRequest,
    ) -> KnowledgeSearchResponse:
        """
        Perform hybrid search on knowledge base.
        """
        results = []

        if request.query:
            # Hybrid search: combine vector + keyword
            vector_results = await self._vector_search(request)
            keyword_results = await self._keyword_search(request)

            # Merge and rank
            results = self._merge_results(vector_results, keyword_results)
        else:
            # Filter-based search
            results = await self._filtered_search(request)

        # Apply sorting
        results = self._sort_results(results, request.sort_by)

        # Paginate
        total = len(results)
        start = (request.page - 1) * request.page_size
        end = start + request.page_size
        page_results = results[start:end]

        return KnowledgeSearchResponse(
            results=page_results,
            total=total,
            page=request.page,
            page_size=request.page_size,
            query=request.query,
        )

    async def _vector_search(
        self,
        request: KnowledgeSearchRequest,
    ) -> list[SearchResult]:
        """
        Semantic search using embeddings.
        """
        # Create query embedding
        query_embedding = await self.embeddings.create(request.query)

        # Vector similarity search
        query = """
            SELECT
                kc.*,
                1 - (kc.embedding <=> $1::vector) as similarity
            FROM knowledge_contributions kc
            WHERE
                kc.status = 'approved'
                AND kc.embedding IS NOT NULL
        """

        # Add filters
        params = [query_embedding]
        if request.equipment_manufacturer:
            query += " AND kc.equipment_manufacturer = $" + str(len(params) + 1)
            params.append(request.equipment_manufacturer)

        if request.fault_code:
            query += " AND kc.fault_code = $" + str(len(params) + 1)
            params.append(request.fault_code)

        query += """
            ORDER BY similarity DESC
            LIMIT 50
        """

        rows = await self.db.execute(query, params)
        return [self._row_to_result(row) for row in rows]

    async def _keyword_search(
        self,
        request: KnowledgeSearchRequest,
    ) -> list[SearchResult]:
        """
        Full-text keyword search.
        """
        query = """
            SELECT
                kc.*,
                ts_rank(
                    to_tsvector('english', kc.title || ' ' || kc.content),
                    plainto_tsquery('english', $1)
                ) as rank
            FROM knowledge_contributions kc
            WHERE
                kc.status = 'approved'
                AND to_tsvector('english', kc.title || ' ' || kc.content)
                    @@ plainto_tsquery('english', $1)
            ORDER BY rank DESC
            LIMIT 50
        """

        rows = await self.db.execute(query, [request.query])
        return [self._row_to_result(row) for row in rows]

    def _merge_results(
        self,
        vector_results: list[SearchResult],
        keyword_results: list[SearchResult],
    ) -> list[SearchResult]:
        """
        Merge vector and keyword results with reciprocal rank fusion.
        """
        k = 60  # RRF constant

        # Calculate RRF scores
        scores = {}

        for rank, result in enumerate(vector_results):
            scores[result.id] = scores.get(result.id, 0) + 1 / (k + rank)

        for rank, result in enumerate(keyword_results):
            scores[result.id] = scores.get(result.id, 0) + 1 / (k + rank)

        # Combine results
        all_results = {r.id: r for r in vector_results + keyword_results}

        # Sort by RRF score
        sorted_ids = sorted(scores.keys(), key=lambda x: scores[x], reverse=True)

        return [all_results[id] for id in sorted_ids]
```

#### 1.1.2.2 AI-Synthesized Answers

```python
# sitesync_v3/domains/knowledge/ai_answer.py

class AISynthesizedAnswer(BaseModel):
    """AI-generated answer from knowledge base."""

    answer: str
    confidence: float
    sources: list[ContributionSummary]
    related_fault_codes: list[str]
    suggested_parts: list[str]
    estimated_resolution_time: str | None

class KnowledgeAIService:
    """Generate AI answers from knowledge base."""

    async def ask(
        self,
        question: str,
        context: dict | None = None,
    ) -> AISynthesizedAnswer:
        """
        Generate an answer to a technician's question.
        """
        # 1. Search for relevant contributions
        search_results = await self.search.search(
            KnowledgeSearchRequest(
                query=question,
                equipment_manufacturer=context.get("manufacturer"),
                equipment_model=context.get("model"),
                fault_code=context.get("fault_code"),
                page_size=10,
            )
        )

        if not search_results.results:
            return AISynthesizedAnswer(
                answer="I couldn't find relevant information in the knowledge base. "
                       "Consider posting this question in the forum.",
                confidence=0.0,
                sources=[],
                related_fault_codes=[],
                suggested_parts=[],
                estimated_resolution_time=None,
            )

        # 2. Build context from top results
        knowledge_context = self._build_context(search_results.results)

        # 3. Generate synthesized answer using Triforce
        prompt = f"""
        A technician is asking: "{question}"

        Equipment context: {context}

        Relevant knowledge from other technicians:
        {knowledge_context}

        Based on this community knowledge, provide:
        1. A clear, actionable answer
        2. The most common causes (ranked by frequency)
        3. Recommended diagnostic steps
        4. Parts that may be needed
        5. Estimated resolution time

        Be practical and specific. Cite which solution worked for how many technicians.
        """

        result = await self.triforce.query(
            prompt=prompt,
            output_schema=AISynthesizedAnswerInternal,
        )

        return AISynthesizedAnswer(
            answer=result.answer,
            confidence=self._calculate_confidence(search_results.results),
            sources=[self._to_summary(r) for r in search_results.results[:5]],
            related_fault_codes=result.related_fault_codes,
            suggested_parts=result.suggested_parts,
            estimated_resolution_time=result.estimated_time,
        )
```

---

### 1.1.3 Quality & Ranking System

#### 1.1.3.1 Voting System

```python
# API Endpoints
POST   /api/v1/knowledge/contributions/{id}/vote
DELETE /api/v1/knowledge/contributions/{id}/vote

# Implementation
class VotingService:
    """Handle contribution voting."""

    async def vote(
        self,
        contribution_id: UUID,
        user_id: UUID,
        vote_type: str,  # 'up' or 'down'
    ) -> VoteResult:
        """
        Cast or change a vote on a contribution.
        """
        # Check for existing vote
        existing = await self.repo.get_vote(contribution_id, user_id)

        if existing:
            if existing.vote_type == vote_type:
                # Same vote - remove it
                await self.repo.delete_vote(existing.id)
                await self._update_counts(contribution_id, vote_type, -1)
                return VoteResult(action="removed")
            else:
                # Different vote - change it
                await self.repo.update_vote(existing.id, vote_type)
                await self._update_counts(contribution_id, existing.vote_type, -1)
                await self._update_counts(contribution_id, vote_type, +1)
                return VoteResult(action="changed", new_vote=vote_type)
        else:
            # New vote
            await self.repo.create_vote(contribution_id, user_id, vote_type)
            await self._update_counts(contribution_id, vote_type, +1)
            return VoteResult(action="created", new_vote=vote_type)
```

#### 1.1.3.2 Quality Score Calculation

```python
class QualityScorer:
    """Calculate contribution quality scores."""

    def calculate_score(self, contribution: Contribution) -> float:
        """
        Calculate quality score (0-100) based on multiple factors.
        """
        factors = {
            # Engagement (40%)
            "upvote_ratio": self._upvote_ratio_score(contribution) * 0.20,
            "usage_count": self._usage_score(contribution) * 0.20,

            # Content Quality (30%)
            "content_length": self._length_score(contribution) * 0.10,
            "has_context": self._context_score(contribution) * 0.10,
            "has_media": self._media_score(contribution) * 0.10,

            # Author Credibility (20%)
            "author_expertise": self._author_score(contribution) * 0.20,

            # Freshness (10%)
            "recency": self._recency_score(contribution) * 0.10,
        }

        return sum(factors.values())

    def _upvote_ratio_score(self, c: Contribution) -> float:
        """Score based on upvote/downvote ratio."""
        total = c.upvotes + c.downvotes
        if total == 0:
            return 50  # Neutral
        ratio = c.upvotes / total
        return ratio * 100

    def _usage_score(self, c: Contribution) -> float:
        """Score based on how many times used."""
        # Log scale - 1 use = 50, 10 uses = 75, 100 uses = 100
        if c.times_used == 0:
            return 0
        return min(100, 25 * math.log10(c.times_used + 1) + 50)

    def _author_score(self, c: Contribution) -> float:
        """Score based on author's expertise."""
        if not c.author_profile:
            return 50
        return c.author_profile.expertise_score
```

---

### 1.1.4 Recognition & Gamification

#### 1.1.4.1 Contribution Badges

```python
CONTRIBUTION_BADGES = [
    # Volume badges
    Badge(
        id="helper",
        name="Helper",
        description="Shared 10 tips or solutions",
        condition=lambda p: p.contributions_count >= 10,
        icon="💡",
        tier="bronze",
    ),
    Badge(
        id="problem_solver",
        name="Problem Solver",
        description="Shared 25 tips or solutions",
        condition=lambda p: p.contributions_count >= 25,
        icon="💡",
        tier="silver",
    ),
    Badge(
        id="knowledge_keeper",
        name="Knowledge Keeper",
        description="Shared 50 tips or solutions",
        condition=lambda p: p.contributions_count >= 50,
        icon="💡",
        tier="gold",
    ),
    Badge(
        id="wisdom_master",
        name="Wisdom Master",
        description="Shared 100+ tips or solutions",
        condition=lambda p: p.contributions_count >= 100,
        icon="💡",
        tier="platinum",
    ),

    # Impact badges
    Badge(
        id="helper_100",
        name="Helper 100",
        description="Helped 100 technicians",
        condition=lambda p: p.technicians_helped >= 100,
        icon="⭐",
        tier="bronze",
    ),
    Badge(
        id="influencer",
        name="Influencer",
        description="Helped 500 technicians",
        condition=lambda p: p.technicians_helped >= 500,
        icon="⭐",
        tier="silver",
    ),
    Badge(
        id="industry_leader",
        name="Industry Leader",
        description="Helped 1,000 technicians",
        condition=lambda p: p.technicians_helped >= 1000,
        icon="⭐",
        tier="gold",
    ),
    Badge(
        id="legend",
        name="Legend",
        description="Helped 5,000+ technicians",
        condition=lambda p: p.technicians_helped >= 5000,
        icon="⭐",
        tier="platinum",
    ),
]
```

#### 1.1.4.2 Contribution Impact Dashboard

```python
class ContributionImpactService:
    """Track and display contribution impact."""

    async def get_author_impact(self, user_id: UUID) -> AuthorImpact:
        """Get impact summary for a contributor."""

        stats = await self.repo.get_author_stats(user_id)
        contributions = await self.repo.get_author_contributions(user_id)

        # Top contributions
        top_contributions = sorted(
            contributions,
            key=lambda c: c.technicians_helped,
            reverse=True
        )[:5]

        return AuthorImpact(
            total_contributions=stats.contribution_count,
            total_technicians_helped=stats.technicians_helped,
            total_hours_saved=stats.estimated_hours_saved,
            total_upvotes=stats.total_upvotes,

            top_contributions=[
                ContributionImpactSummary(
                    id=c.id,
                    title=c.title,
                    technicians_helped=c.technicians_helped,
                    hours_saved=c.estimated_hours_saved,
                )
                for c in top_contributions
            ],

            badges=[
                badge for badge in CONTRIBUTION_BADGES
                if badge.condition(stats)
            ],

            ranking={
                "percentile": stats.contribution_percentile,
                "rank": stats.contribution_rank,
            },
        )
```

---

## Frontend Components

### Knowledge Contribution Form

```tsx
// src/features/knowledge/components/ContributionForm.tsx

interface ContributionFormProps {
  workOrderContext?: WorkOrder;
  equipmentContext?: Elevator;
  onSuccess: (contribution: Contribution) => void;
}

export function ContributionForm({
  workOrderContext,
  equipmentContext,
  onSuccess,
}: ContributionFormProps) {
  const [type, setType] = useState<ContributionType>('solution');
  const [attribution, setAttribution] = useState<AttributionType>('full');

  // Auto-fill from context
  const defaultValues = useMemo(() => ({
    equipment_manufacturer: equipmentContext?.manufacturer,
    equipment_model: equipmentContext?.model,
    fault_code: workOrderContext?.fault_code,
    trade: 'elevators',
  }), [workOrderContext, equipmentContext]);

  return (
    <Form onSubmit={handleSubmit}>
      {/* Type Selection */}
      <TypeSelector value={type} onChange={setType} />

      {/* Title */}
      <Input
        label="Title"
        placeholder="e.g., KONE MonoSpace F505 - Humidity False Alarm Fix"
        required
      />

      {/* Content */}
      <RichTextEditor
        label="Your Solution/Tip"
        placeholder="Describe what you learned..."
        minLength={50}
      />

      {/* Equipment Context */}
      <EquipmentSelector
        defaultManufacturer={defaultValues.equipment_manufacturer}
        defaultModel={defaultValues.equipment_model}
      />

      {/* Fault Code */}
      <FaultCodeInput
        defaultValue={defaultValues.fault_code}
        manufacturer={watchedManufacturer}
      />

      {/* Tags */}
      <TagInput suggestions={suggestedTags} />

      {/* Attachments */}
      <FileUpload accept="image/*,application/pdf" multiple />

      {/* Attribution */}
      <AttributionSelector value={attribution} onChange={setAttribution}>
        <Option value="full">
          Show my name and company
          <Hint>Builds your professional reputation</Hint>
        </Option>
        <Option value="company">
          Show company name only
          <Hint>Credit goes to your company</Hint>
        </Option>
        <Option value="anonymous">
          Anonymous contribution
          <Hint>Still counts toward your private stats</Hint>
        </Option>
      </AttributionSelector>

      <SubmitButton>Share with Community</SubmitButton>
    </Form>
  );
}
```

### Knowledge Search Interface

```tsx
// src/features/knowledge/components/KnowledgeSearch.tsx

export function KnowledgeSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});

  const { data, isLoading } = useKnowledgeSearch({ query, ...filters });

  return (
    <div className="knowledge-search">
      {/* Search Bar */}
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search solutions, tips, fault codes..."
        showAIButton
        onAIClick={() => openAIAssistant(query)}
      />

      {/* Quick Filters */}
      <FilterBar>
        <ManufacturerFilter />
        <FaultCodeFilter />
        <TypeFilter />
        <TradeFilter />
      </FilterBar>

      {/* Results */}
      {isLoading ? (
        <LoadingState />
      ) : data?.results.length === 0 ? (
        <EmptyState>
          <p>No results found for "{query}"</p>
          <Button onClick={openContributionForm}>
            Be the first to share a solution
          </Button>
        </EmptyState>
      ) : (
        <ResultsList>
          {data.results.map((contribution) => (
            <ContributionCard
              key={contribution.id}
              contribution={contribution}
              onUse={() => recordUsage(contribution.id)}
            />
          ))}
        </ResultsList>
      )}
    </div>
  );
}
```

### Contribution Card

```tsx
// src/features/knowledge/components/ContributionCard.tsx

export function ContributionCard({ contribution, onUse }: Props) {
  return (
    <Card>
      {/* Header */}
      <CardHeader>
        <Badge variant={contribution.contribution_type}>
          {contribution.contribution_type}
        </Badge>
        <Title>{contribution.title}</Title>
      </CardHeader>

      {/* Meta */}
      <CardMeta>
        {contribution.author_display_name ? (
          <AuthorLink user={contribution.author}>
            <Avatar src={contribution.author.avatar} />
            <span>{contribution.author_display_name}</span>
            {contribution.author_expertise_score && (
              <ExpertiseScore score={contribution.author_expertise_score} />
            )}
          </AuthorLink>
        ) : (
          <span className="anonymous">Community Contributor</span>
        )}
        <TimeAgo date={contribution.created_at} />
      </CardMeta>

      {/* Context Tags */}
      <ContextTags>
        {contribution.equipment_manufacturer && (
          <Tag>{contribution.equipment_manufacturer}</Tag>
        )}
        {contribution.fault_code && (
          <Tag variant="fault">{contribution.fault_code}</Tag>
        )}
        {contribution.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </ContextTags>

      {/* Content Preview */}
      <CardContent>
        {contribution.ai_summary || truncate(contribution.content, 200)}
      </CardContent>

      {/* Impact Stats */}
      <ImpactStats>
        <Stat icon="👥" value={contribution.technicians_helped} label="helped" />
        <Stat icon="⏱️" value={formatHours(contribution.estimated_hours_saved)} label="saved" />
        <Stat icon="👍" value={contribution.upvotes} label="upvotes" />
      </ImpactStats>

      {/* Actions */}
      <CardActions>
        <VoteButtons contribution={contribution} />
        <Button variant="primary" onClick={onUse}>
          This Helped Me
        </Button>
        <Button variant="ghost" onClick={() => openDetail(contribution.id)}>
          View Full
        </Button>
      </CardActions>
    </Card>
  );
}
```

---

## Success Metrics

### Phase 1.1 KPIs

| Metric | Target (Month 1) | Target (Month 3) | Target (Month 6) |
|--------|------------------|------------------|------------------|
| Contributions created | 100 | 1,000 | 5,000 |
| Active contributors | 20 | 100 | 500 |
| Search queries/day | 50 | 500 | 2,000 |
| Search success rate | 60% | 75% | 85% |
| "This helped me" clicks | 200 | 2,000 | 10,000 |
| Average quality score | 60 | 70 | 75 |

### Tracking Implementation

```python
class KnowledgeAnalytics:
    """Track knowledge platform metrics."""

    async def track_search(
        self,
        query: str,
        results_count: int,
        user_id: UUID | None,
        context: dict,
    ) -> None:
        """Track a search event."""
        await self.events.emit(
            event_type="knowledge_search",
            data={
                "query": query,
                "results_count": results_count,
                "user_id": str(user_id) if user_id else None,
                "context": context,
                "timestamp": datetime.utcnow().isoformat(),
            }
        )

    async def track_contribution_view(
        self,
        contribution_id: UUID,
        user_id: UUID | None,
        source: str,  # 'search', 'direct', 'suggested'
    ) -> None:
        """Track contribution view."""
        await self.repo.increment_view_count(contribution_id)
        await self.events.emit(
            event_type="knowledge_view",
            data={
                "contribution_id": str(contribution_id),
                "user_id": str(user_id) if user_id else None,
                "source": source,
            }
        )

    async def get_dashboard_metrics(
        self,
        period_days: int = 30,
    ) -> KnowledgeDashboard:
        """Get dashboard metrics."""
        return KnowledgeDashboard(
            total_contributions=await self.repo.count_contributions(),
            contributions_this_period=await self.repo.count_contributions_since(
                datetime.utcnow() - timedelta(days=period_days)
            ),
            total_searches=await self.events.count("knowledge_search", period_days),
            search_success_rate=await self._calculate_search_success_rate(period_days),
            total_technicians_helped=await self.repo.sum_technicians_helped(),
            total_hours_saved=await self.repo.sum_hours_saved(),
            top_contributors=await self.repo.get_top_contributors(limit=10),
            top_contributions=await self.repo.get_top_contributions(limit=10),
            contribution_types_breakdown=await self.repo.get_type_breakdown(),
        )
```

---

## Implementation Timeline

### Week 1-2: Core Infrastructure
- [ ] Database tables created
- [ ] Repository layer implemented
- [ ] Basic CRUD API endpoints
- [ ] Unit tests for service layer

### Week 3-4: Search & Discovery
- [ ] Hybrid search implementation
- [ ] Embedding generation pipeline
- [ ] Search API endpoints
- [ ] Search result ranking

### Week 5-6: AI Enhancement
- [ ] AI summary generation
- [ ] Auto-tagging
- [ ] Duplicate detection
- [ ] Quality scoring

### Week 7-8: Frontend
- [ ] Contribution form component
- [ ] Search interface
- [ ] Contribution cards
- [ ] Author impact dashboard

### Week 9-10: Polish & Launch
- [ ] Voting system
- [ ] Badge system
- [ ] Analytics dashboard
- [ ] Performance optimization
- [ ] Beta testing

---

*Document Version: 1.0*
*Last Updated: December 2025*
