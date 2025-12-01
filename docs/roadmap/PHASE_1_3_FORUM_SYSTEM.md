# Phase 1.3: Multi-Level Forum System

> Detailed implementation specification for the global community forum system
> Status: Design Phase
> Priority: HIGH - Core community engagement feature

---

## Overview

The Multi-Level Forum System creates interconnected communities at multiple levels:

```
FORUM HIERARCHY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GLOBAL (All Users)
├── Cross-industry discussions
├── General best practices
└── Platform announcements

INDUSTRY (By Trade)
├── Elevators & Escalators
├── HVAC
├── Electrical
├── Plumbing
└── Fire Systems

MANUFACTURER-SPECIFIC
├── KONE Forum
├── Otis Forum
├── Schindler Forum
└── [Other manufacturers]

REGIONAL (Geography)
├── By Country
├── By State/Province
└── By City/Metro Area

PROPERTY TYPE (Managers)
├── Commercial
├── Residential/Strata
├── Healthcare
└── [Other types]

ORGANIZATION (Private)
├── Company-only forums
├── Portfolio groups
└── Custom groups

USER TYPE
├── Technician Forums
├── Manager Forums
└── Mixed Forums
```

---

## Strategic Value

```
WHY FORUMS ARE CRITICAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENGAGEMENT & RETENTION
├── Daily reason to return to platform
├── Community belonging
├── Professional identity
└── Knowledge sharing culture

NETWORK EFFECTS
├── More users → More valuable discussions
├── Expertise concentrated on platform
├── Hard to replicate (years of content)
└── Switching cost increases

DATA & INSIGHTS
├── Real problems being faced
├── Product feedback source
├── Feature prioritization input
└── AI training data (anonymized)

ORGANIC GROWTH
├── Members invite colleagues
├── Discussions get shared
├── Industry recognition
└── Word-of-mouth marketing
```

---

## User Stories

### Core Forum Features

1. **US-F001:** I want to post a question when I'm stuck on a problem
2. **US-F002:** I want to search past discussions for solutions
3. **US-F003:** I want to subscribe to topics relevant to my work
4. **US-F004:** I want to be notified when someone replies to my post
5. **US-F005:** I want to mark a reply as the accepted answer
6. **US-F006:** I want to upvote helpful responses
7. **US-F007:** I want to attach images to show what I'm dealing with
8. **US-F008:** I want to tag my question with equipment/fault codes
9. **US-F009:** I want to post anonymously for sensitive topics
10. **US-F010:** I want to follow expert users who give great answers

### Multi-Level Access

11. **US-F011:** I want to discuss privately within my company only
12. **US-F012:** I want to connect with technicians in my region
13. **US-F013:** I want to access manufacturer-specific discussions
14. **US-F014:** I want to participate in my industry's global community
15. **US-F015:** I want to join invite-only professional groups

### Moderation & Trust

16. **US-F016:** I want to report inappropriate content
17. **US-F017:** I want to see verification badges for trusted experts
18. **US-F018:** I want spam and low-quality posts filtered automatically
19. **US-F019:** As a moderator, I want tools to manage my community

### Integration

20. **US-F020:** I want forum discussions linked to equipment/fault codes
21. **US-F021:** I want to convert a helpful discussion into a knowledge article
22. **US-F022:** I want to share a forum post with my team

---

## Data Model

### Forum Categories (Hierarchical)

```python
# Database table: forum_categories (see complete schema)

class ForumCategoryType(str, Enum):
    """Types of forum categories."""
    GLOBAL = "global"            # Everyone
    TRADE = "trade"              # By industry/trade
    MANUFACTURER = "manufacturer" # Equipment brand
    REGION = "region"            # Geographic
    PROPERTY_TYPE = "property_type"  # Building type
    ORGANIZATION = "organization"    # Company private
    USER_TYPE = "user_type"      # Tech vs Manager
    CUSTOM_GROUP = "custom_group"    # Invite-only

class ForumCategory(BaseModel):
    """Forum category definition."""

    id: UUID
    parent_id: UUID | None  # For hierarchy

    # Identity
    name: str
    slug: str
    description: str
    icon: str | None
    color: str | None

    # Type & Scope
    category_type: ForumCategoryType
    scope_value: str | None  # e.g., "elevators", "KONE", "NSW"

    # Access Control
    visibility: str  # 'public', 'authenticated', 'verified', 'members_only'
    required_user_type: str | None  # 'technician', 'manager', None
    required_verification_level: str | None

    # Membership (for private categories)
    requires_membership: bool
    membership_approval: str | None  # 'auto', 'admin', 'invite_only'

    # Settings
    allow_anonymous_posting: bool
    requires_moderation: bool
    auto_lock_after_days: int | None

    # Stats
    member_count: int
    thread_count: int
    post_count: int
    last_activity_at: datetime

    # Display
    display_order: int
    is_featured: bool
    is_active: bool
```

### Predefined Category Structure

```python
# sitesync_v3/domains/forum/seed_data.py

FORUM_CATEGORIES = [
    # Global
    {
        "name": "General Discussion",
        "slug": "general",
        "category_type": "global",
        "description": "General discussions for all SiteSync users",
        "visibility": "authenticated",
        "children": [
            {"name": "Introductions", "slug": "introductions"},
            {"name": "Platform Feedback", "slug": "feedback"},
            {"name": "Announcements", "slug": "announcements", "requires_moderation": True},
        ]
    },

    # Trade-Specific
    {
        "name": "Elevators & Escalators",
        "slug": "elevators",
        "category_type": "trade",
        "scope_value": "elevators",
        "description": "Discussions for lift technicians",
        "required_user_type": "technician",
        "children": [
            {"name": "Troubleshooting", "slug": "elevators-troubleshooting"},
            {"name": "Modernization", "slug": "elevators-modernization"},
            {"name": "Safety & Compliance", "slug": "elevators-safety"},
            {"name": "Tools & Equipment", "slug": "elevators-tools"},
            {"name": "Career & Training", "slug": "elevators-career"},
        ]
    },
    {
        "name": "HVAC",
        "slug": "hvac",
        "category_type": "trade",
        "scope_value": "hvac",
        "description": "Discussions for HVAC technicians",
        "required_user_type": "technician",
    },
    # ... other trades

    # Manufacturer Forums
    {
        "name": "KONE",
        "slug": "kone",
        "category_type": "manufacturer",
        "scope_value": "KONE",
        "description": "KONE-specific discussions",
        "children": [
            {"name": "MonoSpace", "slug": "kone-monospace"},
            {"name": "EcoDisc", "slug": "kone-ecodisc"},
            {"name": "Fault Codes", "slug": "kone-faults"},
        ]
    },
    {
        "name": "Otis",
        "slug": "otis",
        "category_type": "manufacturer",
        "scope_value": "Otis",
    },
    {
        "name": "Schindler",
        "slug": "schindler",
        "category_type": "manufacturer",
        "scope_value": "Schindler",
    },
    # ... other manufacturers

    # Regional
    {
        "name": "Australia",
        "slug": "australia",
        "category_type": "region",
        "scope_value": "AU",
        "children": [
            {"name": "New South Wales", "slug": "nsw", "scope_value": "NSW"},
            {"name": "Victoria", "slug": "vic", "scope_value": "VIC"},
            {"name": "Queensland", "slug": "qld", "scope_value": "QLD"},
            # ... other states
        ]
    },
    {
        "name": "New Zealand",
        "slug": "new-zealand",
        "category_type": "region",
        "scope_value": "NZ",
    },

    # Manager Forums
    {
        "name": "Building Managers",
        "slug": "managers",
        "category_type": "user_type",
        "required_user_type": "manager",
        "children": [
            {"name": "Commercial Buildings", "slug": "managers-commercial"},
            {"name": "Residential & Strata", "slug": "managers-residential"},
            {"name": "Healthcare", "slug": "managers-healthcare"},
            {"name": "Contractor Management", "slug": "managers-contractors"},
            {"name": "Compliance", "slug": "managers-compliance"},
        ]
    },
]
```

### Threads & Posts

```python
class ForumThread(BaseModel):
    """Forum discussion thread."""

    id: UUID
    category_id: UUID

    # Author
    author_id: UUID
    author_organization_id: UUID | None
    is_anonymous: bool

    # Content
    title: str
    slug: str
    content: str
    content_html: str

    # Context (optional equipment linking)
    equipment_manufacturer: str | None
    equipment_model: str | None
    fault_code: str | None
    tags: list[str]

    # Status
    status: str  # 'open', 'answered', 'resolved', 'closed', 'locked'
    is_pinned: bool
    is_featured: bool

    # Moderation
    is_approved: bool
    moderation_notes: str | None

    # Engagement
    view_count: int
    reply_count: int
    upvote_count: int
    follower_count: int

    # Answer
    accepted_answer_id: UUID | None

    # Timestamps
    created_at: datetime
    updated_at: datetime
    last_activity_at: datetime
    resolved_at: datetime | None


class ForumPost(BaseModel):
    """Reply/post within a thread."""

    id: UUID
    thread_id: UUID
    parent_post_id: UUID | None  # For nested replies

    # Author
    author_id: UUID
    is_anonymous: bool

    # Content
    content: str
    content_html: str

    # Attachments
    attachment_ids: list[UUID]

    # Status
    is_answer: bool  # Marked as accepted answer
    is_approved: bool

    # Engagement
    upvote_count: int

    # Timestamps
    created_at: datetime
    updated_at: datetime
    edited_at: datetime | None
```

---

## API Design

### Categories

```
GET  /api/v1/forums/categories
GET  /api/v1/forums/categories/{slug}
GET  /api/v1/forums/categories/{slug}/threads
POST /api/v1/forums/categories/{id}/join      # For membership-based
POST /api/v1/forums/categories/{id}/leave
```

### Threads

```
GET    /api/v1/forums/threads
POST   /api/v1/forums/threads
GET    /api/v1/forums/threads/{id}
PUT    /api/v1/forums/threads/{id}
DELETE /api/v1/forums/threads/{id}
POST   /api/v1/forums/threads/{id}/follow
POST   /api/v1/forums/threads/{id}/unfollow
POST   /api/v1/forums/threads/{id}/upvote
POST   /api/v1/forums/threads/{id}/report
```

### Posts

```
GET    /api/v1/forums/threads/{thread_id}/posts
POST   /api/v1/forums/threads/{thread_id}/posts
PUT    /api/v1/forums/posts/{id}
DELETE /api/v1/forums/posts/{id}
POST   /api/v1/forums/posts/{id}/upvote
POST   /api/v1/forums/posts/{id}/accept-answer
POST   /api/v1/forums/posts/{id}/report
```

### Search

```
GET /api/v1/forums/search?q={query}&category={slug}&tags={tags}
```

---

## Service Implementation

### Thread Creation

```python
# sitesync_v3/domains/forum/service.py

class ForumService:
    """Forum management service."""

    async def create_thread(
        self,
        data: ThreadCreate,
        author_id: UUID,
    ) -> ForumThread:
        """
        Create a new forum thread.
        """
        # 1. Verify category access
        category = await self.repo.get_category(data.category_id)
        if not await self._can_post_in_category(author_id, category):
            raise ForbiddenException("You don't have access to this forum")

        # 2. Check anonymous posting allowed
        if data.is_anonymous and not category.allow_anonymous_posting:
            raise ValidationException("Anonymous posting not allowed in this forum")

        # 3. Determine moderation status
        needs_moderation = (
            category.requires_moderation or
            await self._is_new_user(author_id) or
            await self._contains_flagged_content(data.content)
        )

        # 4. Create thread
        thread = await self.repo.create_thread(
            category_id=data.category_id,
            author_id=author_id,
            is_anonymous=data.is_anonymous,
            title=data.title,
            slug=self._generate_slug(data.title),
            content=data.content,
            content_html=self._render_markdown(data.content),
            equipment_manufacturer=data.equipment_manufacturer,
            equipment_model=data.equipment_model,
            fault_code=data.fault_code,
            tags=data.tags,
            is_approved=not needs_moderation,
        )

        # 5. Process attachments
        if data.attachment_ids:
            await self._link_attachments(thread.id, data.attachment_ids)

        # 6. Auto-subscribe author
        await self.repo.create_subscription(
            user_id=author_id,
            thread_id=thread.id,
        )

        # 7. Notify category subscribers
        if not needs_moderation:
            await self._notify_category_subscribers(category.id, thread)

        # 8. Index for search
        await self.search.index_thread(thread)

        # 9. Update stats
        await self.repo.increment_category_stats(
            category_id=category.id,
            thread_count=1,
        )

        return thread

    async def _can_post_in_category(
        self,
        user_id: UUID,
        category: ForumCategory,
    ) -> bool:
        """Check if user can post in category."""

        user = await self.repo.get_user_full(user_id)

        # Check visibility
        if category.visibility == "public":
            return True

        if category.visibility == "authenticated":
            return user is not None

        if category.visibility == "verified":
            return user and user.is_verified

        # Check user type requirement
        if category.required_user_type:
            if category.required_user_type == "technician":
                if not user.technician_profile:
                    return False
            elif category.required_user_type == "manager":
                if not user.manager_profile:
                    return False

        # Check membership requirement
        if category.requires_membership:
            return await self.repo.is_category_member(user_id, category.id)

        # Check organization (for org-private forums)
        if category.category_type == ForumCategoryType.ORGANIZATION:
            org_id = UUID(category.scope_value)
            return user.organization_id == org_id

        return True

    async def create_reply(
        self,
        thread_id: UUID,
        data: PostCreate,
        author_id: UUID,
    ) -> ForumPost:
        """Create a reply to a thread."""

        thread = await self.repo.get_thread(thread_id)
        if not thread:
            raise NotFoundException("Thread not found")

        if thread.status in ['closed', 'locked']:
            raise ValidationException("This thread is closed for replies")

        # Create post
        post = await self.repo.create_post(
            thread_id=thread_id,
            author_id=author_id,
            is_anonymous=data.is_anonymous,
            content=data.content,
            content_html=self._render_markdown(data.content),
            parent_post_id=data.parent_post_id,
        )

        # Update thread stats and activity
        await self.repo.update_thread(
            thread_id=thread_id,
            reply_count=thread.reply_count + 1,
            last_activity_at=datetime.utcnow(),
        )

        # Notify thread followers
        await self._notify_thread_followers(thread, post, author_id)

        # Notify mentioned users
        mentioned_users = self._extract_mentions(data.content)
        await self._notify_mentioned(mentioned_users, thread, post)

        return post

    async def accept_answer(
        self,
        post_id: UUID,
        user_id: UUID,
    ) -> ForumPost:
        """Mark a post as the accepted answer."""

        post = await self.repo.get_post(post_id)
        thread = await self.repo.get_thread(post.thread_id)

        # Only thread author can accept
        if thread.author_id != user_id:
            raise ForbiddenException("Only the thread author can accept answers")

        # Unmark previous answer if exists
        if thread.accepted_answer_id:
            await self.repo.update_post(
                thread.accepted_answer_id,
                is_answer=False,
            )

        # Mark new answer
        await self.repo.update_post(post_id, is_answer=True)
        await self.repo.update_thread(
            thread.id,
            accepted_answer_id=post_id,
            status="answered",
            resolved_at=datetime.utcnow(),
        )

        # Reward the answerer
        await self._award_answer_credit(post.author_id)

        # Notify answerer
        await self.notifications.send(
            user_id=post.author_id,
            notification_type="answer_accepted",
            title="Your answer was accepted!",
            message=f"Your answer in '{thread.title}' was marked as the solution.",
            link_type="forum_thread",
            link_id=thread.id,
        )

        return await self.repo.get_post(post_id)
```

### Access Control Service

```python
# sitesync_v3/domains/forum/access_control.py

class ForumAccessControl:
    """Manage forum access at multiple levels."""

    async def get_accessible_categories(
        self,
        user_id: UUID,
    ) -> list[ForumCategory]:
        """Get all categories user can access."""

        user = await self.repo.get_user_full(user_id)

        # Get all active categories
        all_categories = await self.repo.get_all_categories()

        accessible = []
        for category in all_categories:
            if await self._can_access(user, category):
                accessible.append(category)

        return accessible

    async def _can_access(
        self,
        user: User,
        category: ForumCategory,
    ) -> bool:
        """Check if user can access a category."""

        # Public = everyone
        if category.visibility == "public":
            return True

        # Must be logged in
        if not user:
            return False

        # Authentication required
        if category.visibility == "authenticated":
            return True

        # Verification required
        if category.visibility == "verified":
            if not user.is_verified:
                return False

        # User type check
        if category.required_user_type == "technician":
            if not user.technician_profile:
                return False
        elif category.required_user_type == "manager":
            if not user.manager_profile:
                return False

        # Membership check
        if category.requires_membership:
            if not await self.repo.is_member(user.id, category.id):
                return False

        # Organization check (company-private)
        if category.category_type == ForumCategoryType.ORGANIZATION:
            target_org = UUID(category.scope_value)
            if user.organization_id != target_org:
                return False

        return True

    async def create_organization_forum(
        self,
        organization_id: UUID,
        name: str,
        created_by: UUID,
    ) -> ForumCategory:
        """Create a private forum for an organization."""

        org = await self.repo.get_organization(organization_id)

        category = await self.repo.create_category(
            name=f"{org.name} Team",
            slug=f"org-{org.slug}",
            description=f"Private forum for {org.name} team members",
            category_type=ForumCategoryType.ORGANIZATION,
            scope_value=str(organization_id),
            visibility="members_only",
            requires_membership=True,
            membership_approval="auto",  # Org members auto-join
        )

        # Auto-add all org members
        members = await self.repo.get_organization_members(organization_id)
        for member in members:
            await self.repo.add_category_member(category.id, member.id)

        return category
```

### Real-time Features

```python
# sitesync_v3/domains/forum/realtime.py

class ForumRealtimeService:
    """Real-time forum features using WebSockets."""

    async def on_new_post(self, post: ForumPost, thread: ForumThread):
        """Broadcast new post to thread viewers."""

        # Get users currently viewing this thread
        viewers = await self.presence.get_thread_viewers(thread.id)

        # Broadcast to viewers
        await self.websocket.broadcast(
            channel=f"thread:{thread.id}",
            event="new_post",
            data={
                "post_id": str(post.id),
                "author": await self._get_post_author_display(post),
                "preview": truncate(post.content, 100),
                "created_at": post.created_at.isoformat(),
            },
        )

    async def on_typing(self, thread_id: UUID, user_id: UUID):
        """Broadcast typing indicator."""

        user = await self.repo.get_user(user_id)

        await self.websocket.broadcast(
            channel=f"thread:{thread_id}",
            event="user_typing",
            data={
                "user_id": str(user_id),
                "display_name": user.display_name,
            },
            exclude_user=user_id,
        )

    async def track_presence(self, thread_id: UUID, user_id: UUID):
        """Track user viewing a thread."""
        await self.presence.set_viewing(
            user_id=user_id,
            entity_type="thread",
            entity_id=thread_id,
            ttl=300,  # 5 minutes
        )
```

---

## Moderation System

### Auto-Moderation

```python
# sitesync_v3/domains/forum/moderation.py

class AutoModerator:
    """Automatic content moderation."""

    async def check_content(
        self,
        content: str,
        author_id: UUID,
    ) -> ModerationResult:
        """
        Check content for moderation issues.
        """
        issues = []

        # Spam detection
        if await self._is_spam(content):
            issues.append(ModerationIssue(
                type="spam",
                severity="high",
                action="hold",
            ))

        # Profanity filter
        profanity_found = self._check_profanity(content)
        if profanity_found:
            issues.append(ModerationIssue(
                type="profanity",
                severity="medium",
                action="warn",
                details=profanity_found,
            ))

        # Link checking
        suspicious_links = self._check_links(content)
        if suspicious_links:
            issues.append(ModerationIssue(
                type="suspicious_link",
                severity="medium",
                action="hold",
                details=suspicious_links,
            ))

        # AI content check (for complex cases)
        if not issues:
            ai_check = await self._ai_content_check(content)
            if ai_check.flagged:
                issues.append(ModerationIssue(
                    type=ai_check.reason,
                    severity=ai_check.severity,
                    action="review",
                ))

        # Author trust factor
        author_trust = await self._get_author_trust(author_id)
        if author_trust < 0.3:
            # New or low-trust user - extra scrutiny
            for issue in issues:
                if issue.action == "warn":
                    issue.action = "hold"

        return ModerationResult(
            approved=len([i for i in issues if i.action == "hold"]) == 0,
            issues=issues,
            requires_review=any(i.action in ["hold", "review"] for i in issues),
        )

    async def _get_author_trust(self, user_id: UUID) -> float:
        """Calculate author trust score (0-1)."""

        user = await self.repo.get_user_with_history(user_id)

        factors = {
            "account_age_days": min(user.account_age_days / 90, 1.0) * 0.2,
            "verified": 0.2 if user.is_verified else 0,
            "post_count": min(user.post_count / 50, 1.0) * 0.2,
            "accepted_answers": min(user.accepted_answers / 10, 1.0) * 0.2,
            "reports_against": max(0, 0.2 - (user.reports_against * 0.05)),
        }

        return sum(factors.values())


class ModerationQueue:
    """Moderation queue for human review."""

    async def get_queue(
        self,
        moderator_id: UUID,
        category_ids: list[UUID] | None = None,
    ) -> list[ModerationItem]:
        """Get items needing moderation."""

        # Get moderator's categories
        if not category_ids:
            category_ids = await self.repo.get_moderator_categories(moderator_id)

        items = await self.repo.get_pending_moderation(
            category_ids=category_ids,
            limit=50,
        )

        return items

    async def approve(
        self,
        item_id: UUID,
        moderator_id: UUID,
        notes: str | None = None,
    ) -> None:
        """Approve an item."""

        item = await self.repo.get_moderation_item(item_id)

        if item.item_type == "thread":
            await self.repo.update_thread(item.item_id, is_approved=True)
        else:
            await self.repo.update_post(item.item_id, is_approved=True)

        await self.repo.resolve_moderation_item(
            item_id=item_id,
            action="approved",
            moderator_id=moderator_id,
            notes=notes,
        )

    async def reject(
        self,
        item_id: UUID,
        moderator_id: UUID,
        reason: str,
        notify_author: bool = True,
    ) -> None:
        """Reject an item."""

        item = await self.repo.get_moderation_item(item_id)

        if item.item_type == "thread":
            await self.repo.update_thread(item.item_id, status="rejected")
        else:
            await self.repo.update_post(item.item_id, is_approved=False)

        await self.repo.resolve_moderation_item(
            item_id=item_id,
            action="rejected",
            moderator_id=moderator_id,
            notes=reason,
        )

        if notify_author:
            await self.notifications.send(
                user_id=item.author_id,
                notification_type="content_rejected",
                title="Your post was not approved",
                message=f"Reason: {reason}",
            )
```

---

## Expert Recognition System

```python
# sitesync_v3/domains/forum/experts.py

class ExpertRecognitionService:
    """Identify and recognize forum experts."""

    async def calculate_forum_reputation(
        self,
        user_id: UUID,
    ) -> ForumReputation:
        """Calculate user's forum reputation."""

        stats = await self.repo.get_user_forum_stats(user_id)

        # Calculate reputation score
        score = (
            stats.total_posts * 1 +
            stats.upvotes_received * 2 +
            stats.accepted_answers * 10 +
            stats.threads_started * 2 +
            stats.helpful_flags * 5
        )

        # Penalties
        score -= stats.downvotes_received * 1
        score -= stats.reports_upheld * 20

        # Determine level
        level = self._score_to_level(score)

        # Calculate expertise areas
        expertise_areas = await self._calculate_expertise_areas(user_id)

        return ForumReputation(
            score=max(0, score),
            level=level,
            total_posts=stats.total_posts,
            accepted_answers=stats.accepted_answers,
            upvotes_received=stats.upvotes_received,
            expertise_areas=expertise_areas,
            badges=await self._get_forum_badges(user_id, stats),
        )

    def _score_to_level(self, score: int) -> str:
        """Convert reputation score to level."""
        if score >= 5000:
            return "guru"
        elif score >= 2000:
            return "expert"
        elif score >= 500:
            return "contributor"
        elif score >= 100:
            return "member"
        else:
            return "newcomer"

    async def _calculate_expertise_areas(
        self,
        user_id: UUID,
    ) -> list[ExpertiseArea]:
        """Identify user's areas of expertise from forum activity."""

        # Get their accepted answers by tag/manufacturer
        answer_distribution = await self.repo.get_answer_distribution(user_id)

        expertise = []
        for area, count in answer_distribution.items():
            if count >= 5:  # Minimum threshold
                expertise.append(ExpertiseArea(
                    name=area,
                    answer_count=count,
                    confidence=min(count / 20, 1.0),
                ))

        return sorted(expertise, key=lambda x: x.answer_count, reverse=True)[:5]


FORUM_BADGES = [
    Badge(
        id="first_answer",
        name="First Answer",
        description="Had your first answer accepted",
        icon="✅",
    ),
    Badge(
        id="helpful_10",
        name="Helpful",
        description="10 answers accepted",
        icon="🤝",
    ),
    Badge(
        id="helpful_50",
        name="Very Helpful",
        description="50 answers accepted",
        icon="🌟",
    ),
    Badge(
        id="guru",
        name="Forum Guru",
        description="100+ answers accepted",
        icon="🧙",
    ),
    Badge(
        id="popular_post",
        name="Popular Post",
        description="Post received 50+ upvotes",
        icon="🔥",
    ),
    Badge(
        id="quick_responder",
        name="Quick Responder",
        description="First answer within 10 minutes, later accepted",
        icon="⚡",
    ),
]
```

---

## Frontend Components

### Forum Home

```tsx
// src/features/forum/components/ForumHome.tsx

export function ForumHome() {
  const { data: categories } = useForumCategories();
  const { data: recentActivity } = useRecentForumActivity();
  const { user } = useAuth();

  return (
    <ForumLayout>
      {/* Welcome / Search */}
      <ForumHeader>
        <h1>Community Forums</h1>
        <ForumSearch />
      </ForumHeader>

      {/* Quick Access - My Forums */}
      {user && (
        <Section title="Your Forums">
          <ForumGrid>
            {/* Organization Forum */}
            {user.organizationForum && (
              <ForumCard
                icon="🏢"
                category={user.organizationForum}
                badge="Private"
              />
            )}

            {/* Followed Categories */}
            {categories?.followed.map((cat) => (
              <ForumCard key={cat.id} category={cat} />
            ))}
          </ForumGrid>
        </Section>
      )}

      {/* Category Browser */}
      <Section title="Browse Forums">
        <CategoryTree categories={categories?.all} />
      </Section>

      {/* Recent Activity */}
      <Section title="Recent Activity">
        <ActivityFeed items={recentActivity} />
      </Section>

      {/* Trending Threads */}
      <Section title="Trending Discussions">
        <TrendingThreads />
      </Section>

      {/* Top Contributors */}
      <Section title="Top Contributors This Month">
        <ContributorLeaderboard />
      </Section>
    </ForumLayout>
  );
}
```

### Thread View

```tsx
// src/features/forum/components/ThreadView.tsx

export function ThreadView({ threadId }: { threadId: string }) {
  const { data: thread } = useThread(threadId);
  const { data: posts } = useThreadPosts(threadId);
  const { user } = useAuth();

  // Real-time updates
  useThreadSubscription(threadId, {
    onNewPost: (post) => {
      // Add to posts list
    },
    onTyping: (user) => {
      // Show typing indicator
    },
  });

  if (!thread) return <LoadingState />;

  return (
    <ThreadLayout>
      {/* Thread Header */}
      <ThreadHeader>
        <Breadcrumbs category={thread.category} />
        <ThreadTitle>{thread.title}</ThreadTitle>
        <ThreadMeta>
          <AuthorDisplay
            author={thread.author}
            isAnonymous={thread.is_anonymous}
            showReputation
          />
          <TimeAgo date={thread.created_at} />
          <ViewCount count={thread.view_count} />
          <ReplyCount count={thread.reply_count} />
        </ThreadMeta>
        <ThreadTags>
          {thread.equipment_manufacturer && (
            <Tag variant="manufacturer">{thread.equipment_manufacturer}</Tag>
          )}
          {thread.fault_code && (
            <Tag variant="fault">{thread.fault_code}</Tag>
          )}
          {thread.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </ThreadTags>
      </ThreadHeader>

      {/* Original Post */}
      <OriginalPost>
        <RichContent html={thread.content_html} />
        {thread.attachments?.length > 0 && (
          <Attachments items={thread.attachments} />
        )}
        <PostActions>
          <UpvoteButton
            count={thread.upvote_count}
            onUpvote={() => upvoteThread(thread.id)}
          />
          <FollowButton
            isFollowing={thread.isFollowing}
            onToggle={() => toggleFollow(thread.id)}
          />
          <ShareButton thread={thread} />
          <ReportButton onReport={() => reportThread(thread.id)} />
        </PostActions>
      </OriginalPost>

      {/* Status Banner */}
      {thread.status === 'answered' && thread.accepted_answer_id && (
        <AnsweredBanner>
          ✅ This question has an accepted answer
          <JumpToAnswer answerId={thread.accepted_answer_id} />
        </AnsweredBanner>
      )}

      {/* Replies */}
      <RepliesSection>
        <RepliesHeader>
          <h2>{thread.reply_count} Replies</h2>
          <SortSelector options={['oldest', 'newest', 'top']} />
        </RepliesHeader>

        {posts?.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            isAcceptedAnswer={post.id === thread.accepted_answer_id}
            canAcceptAnswer={thread.author_id === user?.id && !thread.accepted_answer_id}
            onAccept={() => acceptAnswer(post.id)}
          />
        ))}
      </RepliesSection>

      {/* Reply Form */}
      {thread.status !== 'locked' && user && (
        <ReplyForm threadId={thread.id} onSubmit={submitReply} />
      )}

      {/* Typing Indicator */}
      <TypingIndicator users={typingUsers} />

      {/* Related Threads */}
      <RelatedThreads threadId={thread.id} />
    </ThreadLayout>
  );
}
```

### Post Card

```tsx
// src/features/forum/components/PostCard.tsx

export function PostCard({
  post,
  isAcceptedAnswer,
  canAcceptAnswer,
  onAccept,
}: PostCardProps) {
  return (
    <Card
      className={cn(
        'post-card',
        isAcceptedAnswer && 'accepted-answer'
      )}
    >
      {/* Accepted Answer Badge */}
      {isAcceptedAnswer && (
        <AcceptedBadge>
          <CheckIcon /> Accepted Answer
        </AcceptedBadge>
      )}

      {/* Author */}
      <PostAuthor>
        <AuthorDisplay
          author={post.author}
          isAnonymous={post.is_anonymous}
          showReputation
          showBadges
        />
      </PostAuthor>

      {/* Content */}
      <PostContent>
        <RichContent html={post.content_html} />
        {post.attachments?.length > 0 && (
          <Attachments items={post.attachments} />
        )}
      </PostContent>

      {/* Footer */}
      <PostFooter>
        <TimeAgo date={post.created_at} />
        {post.edited_at && (
          <EditedIndicator date={post.edited_at} />
        )}
      </PostFooter>

      {/* Actions */}
      <PostActions>
        <UpvoteButton
          count={post.upvote_count}
          onUpvote={() => upvotePost(post.id)}
        />
        <ReplyButton onClick={() => openReplyTo(post.id)} />
        {canAcceptAnswer && (
          <AcceptButton onClick={onAccept}>
            Mark as Answer
          </AcceptButton>
        )}
        <MoreMenu>
          <MenuItem onClick={() => copyLink(post.id)}>Copy Link</MenuItem>
          <MenuItem onClick={() => report(post.id)}>Report</MenuItem>
        </MoreMenu>
      </PostActions>

      {/* Nested Replies */}
      {post.replies?.length > 0 && (
        <NestedReplies>
          {post.replies.map((reply) => (
            <PostCard key={reply.id} post={reply} nested />
          ))}
        </NestedReplies>
      )}
    </Card>
  );
}
```

---

## Success Metrics

### Phase 1.3 KPIs

| Metric | Target (Month 1) | Target (Month 3) | Target (Month 6) |
|--------|------------------|------------------|------------------|
| Active forum users (monthly) | 100 | 500 | 2,000 |
| New threads/week | 50 | 200 | 500 |
| Replies/thread average | 3 | 5 | 7 |
| Answer acceptance rate | 30% | 45% | 60% |
| User retention (return within 7 days) | 40% | 55% | 70% |
| Moderation queue time (avg) | 24hr | 6hr | 2hr |

---

## Implementation Timeline

### Week 1-2: Core Infrastructure
- [ ] Category data model and seed data
- [ ] Thread/post CRUD APIs
- [ ] Basic access control

### Week 3-4: Features
- [ ] Voting system
- [ ] Answer acceptance
- [ ] Subscriptions/notifications
- [ ] Attachments

### Week 5-6: Search & Discovery
- [ ] Full-text search
- [ ] Tag system
- [ ] Related threads

### Week 7-8: Moderation & Trust
- [ ] Auto-moderation
- [ ] Moderation queue
- [ ] Reputation system

### Week 9-10: Polish & Launch
- [ ] Real-time features
- [ ] Mobile optimization
- [ ] Beta testing
- [ ] Content seeding

---

*Document Version: 1.0*
*Last Updated: December 2025*
