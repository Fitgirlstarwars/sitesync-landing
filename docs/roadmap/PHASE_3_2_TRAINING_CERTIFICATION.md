# Phase 3.2: Training & Certification Platform

> Detailed implementation specification for the comprehensive learning management and certification tracking system
> Status: Design Phase
> Priority: HIGH - Critical for industry workforce development
> Dependencies: Phase 3.1 (Manufacturer Integration), Phase 1.4 (Document Management)

---

## Overview

The Training & Certification Platform creates a comprehensive learning ecosystem that:

1. **Delivers** training content from manufacturers, SiteSync, and third parties
2. **Tracks** all technician certifications in a unified system
3. **Connects** trade schools and apprenticeship programs with employers
4. **Facilitates** mentorship relationships between experienced and new technicians
5. **Provides** continuing education and professional development paths

---

## User Stories

### As a Technician:

1. **US-TC001:** I want to browse available training courses so I can advance my skills
2. **US-TC002:** I want to track all my certifications in one place so I never miss a renewal
3. **US-TC003:** I want to take online courses on my schedule so I can learn without leaving my route
4. **US-TC004:** I want to earn digital badges so I can showcase my credentials
5. **US-TC005:** I want to find a mentor so I can learn from experienced technicians
6. **US-TC006:** I want to be notified before certifications expire so I can renew on time
7. **US-TC007:** I want my training to count toward certifications so my effort compounds
8. **US-TC008:** I want to see which certifications lead to better jobs so I can plan my career
9. **US-TC009:** I want to mentor newer technicians so I can give back to the trade
10. **US-TC010:** I want to access training materials offline so I can learn on job sites

### As a Trade School Student:

11. **US-TC011:** I want free access to industry resources so I can supplement my education
12. **US-TC012:** I want to track my apprenticeship progress so I know where I stand
13. **US-TC013:** I want to connect with potential employers so I can line up a job after graduation
14. **US-TC014:** I want to see career paths so I understand my options
15. **US-TC015:** I want to find a mentor in my intended specialty so I get real-world guidance

### As a Service Company:

16. **US-TC016:** I want to assign training to my technicians so I maintain compliance
17. **US-TC017:** I want to track my team's certifications so I know our capabilities
18. **US-TC018:** I want to receive alerts for expiring certifications so we stay compliant
19. **US-TC019:** I want to upload my own training content so I can standardize onboarding
20. **US-TC020:** I want to see training ROI so I can justify professional development budgets
21. **US-TC021:** I want to recruit from trade schools so I get a pipeline of qualified candidates

### As a Trade School:

22. **US-TC022:** I want to partner with SiteSync so my students get industry exposure
23. **US-TC023:** I want to track student progress so I can support their development
24. **US-TC024:** I want to connect students with employers so I improve placement rates
25. **US-TC025:** I want access to industry content so I can supplement curriculum
26. **US-TC026:** I want to manage apprenticeship requirements so students complete on time

### As a Building Owner:

27. **US-TC027:** I want to verify technician qualifications so I know I'm getting qualified service
28. **US-TC028:** I want to require certain certifications for my equipment so I maintain standards
29. **US-TC029:** I want to see my contractor's training investment so I assess their commitment

---

## Feature Breakdown

### 3.2.1 Learning Management System (LMS)

#### 3.2.1.1 Course Catalog & Discovery

**API Endpoints:**

```
GET    /api/v1/training/courses                          # Browse courses
GET    /api/v1/training/courses/{id}                     # Get course details
GET    /api/v1/training/courses/{id}/syllabus            # Get course syllabus
GET    /api/v1/training/paths                            # Get learning paths
GET    /api/v1/training/recommendations                  # AI-recommended courses
POST   /api/v1/training/courses/{id}/enroll              # Enroll in course
```

**Course Categories:**

| Category | Description | Typical Duration | Delivery |
|----------|-------------|------------------|----------|
| `manufacturer_equipment` | Equipment-specific training | 4-40 hours | Online/In-person |
| `safety_certification` | Safety-required training | 2-8 hours | Online/In-person |
| `code_compliance` | Building code training | 2-16 hours | Online |
| `soft_skills` | Communication, customer service | 1-4 hours | Online |
| `management` | Leadership, business skills | 4-20 hours | Online/In-person |
| `technology` | Digital tools, software | 1-8 hours | Online |
| `apprenticeship` | Structured apprentice program | 4000+ hours | Blended |
| `continuing_education` | CE credit courses | 1-4 hours | Online |

**Request Schema:**

```python
# sitesync_v3/domains/training/contracts.py

from pydantic import BaseModel, Field
from enum import Enum
from uuid import UUID
from datetime import datetime, timedelta

class CourseLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class CourseDeliveryMethod(str, Enum):
    ONLINE_SELF_PACED = "online_self_paced"
    ONLINE_INSTRUCTOR_LED = "online_instructor_led"
    IN_PERSON = "in_person"
    BLENDED = "blended"
    ON_THE_JOB = "on_the_job"

class CourseStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class CourseResponse(BaseModel):
    """Response with course details."""

    id: UUID

    # Basic info
    title: str
    slug: str
    description: str
    short_description: str

    # Provider
    provider_type: str  # 'manufacturer', 'sitesync', 'company', 'trade_school', 'third_party'
    provider_id: UUID | None
    provider_name: str
    provider_logo_url: str | None

    # Classification
    category: str
    subcategory: str | None
    tags: list[str]
    trade: str  # 'elevators', 'hvac', 'electrical', etc.

    # Level & prerequisites
    level: CourseLevel
    prerequisites: list[dict]  # [{"type": "course", "id": "..."}, {"type": "certification", "name": "..."}]

    # Duration & format
    delivery_method: CourseDeliveryMethod
    estimated_hours: float
    module_count: int
    has_video: bool
    has_assessments: bool
    has_practical: bool

    # Equipment focus
    applicable_equipment_types: list[str]
    applicable_manufacturers: list[str]
    applicable_models: list[str]

    # Certification
    leads_to_certification: bool
    certification_id: UUID | None
    certification_name: str | None
    ce_credits: float

    # Pricing
    pricing_model: str  # 'free', 'paid', 'subscription', 'employer_paid'
    price: float | None
    currency: str | None

    # Access
    requires_enrollment: bool
    enrollment_deadline: datetime | None
    max_enrollment: int | None
    available_seats: int | None

    # Scheduling (for instructor-led)
    next_session_date: datetime | None
    session_location: str | None

    # Stats
    enrollment_count: int
    completion_count: int
    average_rating: float | None
    review_count: int

    # User's status
    user_enrolled: bool
    user_progress_percent: float | None
    user_completed: bool
    user_completed_at: datetime | None

    # Metadata
    created_at: datetime
    updated_at: datetime
    published_at: datetime | None

class CourseSyllabus(BaseModel):
    """Course syllabus with modules."""

    course_id: UUID
    course_title: str

    # Learning objectives
    learning_objectives: list[str]

    # Modules
    modules: list[dict]
    # Each module: {
    #     "id": UUID,
    #     "title": str,
    #     "description": str,
    #     "duration_minutes": int,
    #     "order": int,
    #     "content_types": ["video", "text", "quiz", "practical"],
    #     "is_required": bool,
    #     "user_completed": bool
    # }

    # Assessment
    assessments: list[dict]
    # Each assessment: {
    #     "id": UUID,
    #     "title": str,
    #     "type": "quiz" | "exam" | "practical",
    #     "passing_score": int,
    #     "attempts_allowed": int,
    #     "user_attempts": int,
    #     "user_best_score": int | None
    # }

    # Materials
    downloadable_materials: list[dict]
    # Each material: {
    #     "id": UUID,
    #     "title": str,
    #     "file_type": str,
    #     "file_size_bytes": int,
    #     "download_url": str
    # }

class LearningPath(BaseModel):
    """A structured learning path."""

    id: UUID
    title: str
    description: str

    # Path structure
    target_role: str  # 'elevator_technician', 'hvac_specialist', 'building_manager', etc.
    level: str  # 'entry', 'mid', 'senior', 'expert'
    estimated_total_hours: float

    # Courses in path
    courses: list[dict]
    # Each course: {
    #     "course_id": UUID,
    #     "course_title": str,
    #     "order": int,
    #     "is_required": bool,
    #     "user_completed": bool
    # }

    # Outcome
    leads_to_certifications: list[dict]
    career_outcomes: list[str]

    # User progress
    user_started: bool
    user_progress_percent: float
    user_completed_courses: int
    user_remaining_courses: int
```

**Database Schema:**

```sql
-- Courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic info
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),

    -- Provider
    provider_type VARCHAR(30) NOT NULL,
    provider_id UUID,  -- manufacturer_id, organization_id, or NULL for SiteSync
    provider_name VARCHAR(255) NOT NULL,

    -- Classification
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    tags TEXT[],
    trade VARCHAR(50) NOT NULL DEFAULT 'elevators',

    -- Level
    level VARCHAR(20) NOT NULL DEFAULT 'beginner',
    prerequisites JSONB DEFAULT '[]',

    -- Duration & format
    delivery_method VARCHAR(30) NOT NULL,
    estimated_hours DECIMAL(6, 2),
    has_video BOOLEAN DEFAULT FALSE,
    has_assessments BOOLEAN DEFAULT FALSE,
    has_practical BOOLEAN DEFAULT FALSE,

    -- Equipment
    applicable_equipment_types TEXT[],
    applicable_manufacturers TEXT[],
    applicable_models TEXT[],

    -- Certification
    leads_to_certification BOOLEAN DEFAULT FALSE,
    certification_id UUID REFERENCES certification_programs(id),
    ce_credits DECIMAL(4, 2) DEFAULT 0,

    -- Pricing
    pricing_model VARCHAR(20) NOT NULL DEFAULT 'free',
    price DECIMAL(10, 2),
    currency CHAR(3),

    -- Enrollment
    requires_enrollment BOOLEAN DEFAULT TRUE,
    enrollment_deadline TIMESTAMPTZ,
    max_enrollment INTEGER,

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,

    -- Stats (denormalized for performance)
    enrollment_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2),
    review_count INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),

    CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT valid_level CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert'))
);

-- Course modules
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id),

    -- Module info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,

    -- Duration
    duration_minutes INTEGER,

    -- Content types
    has_video BOOLEAN DEFAULT FALSE,
    has_text BOOLEAN DEFAULT FALSE,
    has_quiz BOOLEAN DEFAULT FALSE,
    has_practical BOOLEAN DEFAULT FALSE,

    -- Requirements
    is_required BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(course_id, order_index)
);

-- Module content items
CREATE TABLE module_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES course_modules(id),

    -- Content info
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(30) NOT NULL,  -- 'video', 'text', 'document', 'interactive'
    order_index INTEGER NOT NULL,

    -- Content storage
    content_text TEXT,  -- For text content
    content_url TEXT,   -- For video/document links
    file_id UUID REFERENCES uploaded_files(id),

    -- Video specifics
    video_duration_seconds INTEGER,
    video_transcript TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(module_id, order_index)
);

-- Course assessments
CREATE TABLE course_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id),
    module_id UUID REFERENCES course_modules(id),  -- NULL if course-level exam

    -- Assessment info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assessment_type VARCHAR(20) NOT NULL,  -- 'quiz', 'exam', 'practical'

    -- Configuration
    question_count INTEGER,
    time_limit_minutes INTEGER,
    passing_score INTEGER DEFAULT 70,
    attempts_allowed INTEGER DEFAULT 3,
    randomize_questions BOOLEAN DEFAULT TRUE,

    -- Proctoring
    requires_proctoring BOOLEAN DEFAULT FALSE,
    proctoring_type VARCHAR(30),  -- 'online', 'in_person'

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_type CHECK (assessment_type IN ('quiz', 'exam', 'practical'))
);

-- User course enrollments
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    course_id UUID NOT NULL REFERENCES courses(id),

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'enrolled',

    -- Progress
    progress_percent DECIMAL(5, 2) DEFAULT 0,
    completed_modules UUID[],
    current_module_id UUID REFERENCES course_modules(id),

    -- Completion
    completed_at TIMESTAMPTZ,
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_id UUID,

    -- Time tracking
    total_time_spent_minutes INTEGER DEFAULT 0,
    last_activity_at TIMESTAMPTZ,

    -- Employer sponsorship
    sponsored_by_organization_id UUID REFERENCES organizations(id),

    -- Metadata
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, course_id),
    CONSTRAINT valid_status CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped'))
);

-- Module completion tracking
CREATE TABLE module_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES course_enrollments(id),
    module_id UUID NOT NULL REFERENCES course_modules(id),

    -- Completion
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    time_spent_minutes INTEGER,

    UNIQUE(enrollment_id, module_id)
);

-- Assessment attempts
CREATE TABLE assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES course_enrollments(id),
    assessment_id UUID NOT NULL REFERENCES course_assessments(id),

    -- Attempt info
    attempt_number INTEGER NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,

    -- Results
    score INTEGER,
    passed BOOLEAN,
    answers JSONB,  -- Stored answers

    -- Proctoring
    proctoring_session_id VARCHAR(255),
    proctoring_flags TEXT[],

    -- Metadata
    time_spent_minutes INTEGER
);

-- Learning paths
CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Path info
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,

    -- Target
    target_role VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL,
    trade VARCHAR(50) NOT NULL DEFAULT 'elevators',

    -- Duration
    estimated_total_hours DECIMAL(6, 2),

    -- Outcome
    leads_to_certifications UUID[],
    career_outcomes TEXT[],

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning path courses
CREATE TABLE learning_path_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path_id UUID NOT NULL REFERENCES learning_paths(id),
    course_id UUID NOT NULL REFERENCES courses(id),

    -- Order
    order_index INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,

    UNIQUE(path_id, course_id),
    UNIQUE(path_id, order_index)
);

-- Indexes
CREATE INDEX idx_courses_provider ON courses(provider_type, provider_id);
CREATE INDEX idx_courses_category ON courses(category, subcategory);
CREATE INDEX idx_courses_trade ON courses(trade);
CREATE INDEX idx_courses_status ON courses(status) WHERE status = 'published';
CREATE INDEX idx_course_modules_course ON course_modules(course_id);
CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_enrollments_status ON course_enrollments(status);
```

#### 3.2.1.2 Video Content Delivery

**Video Platform Requirements:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    VIDEO DELIVERY SYSTEM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CORE FEATURES:                                                  │
│  ├── Adaptive bitrate streaming (HLS/DASH)                       │
│  ├── Multiple quality levels (480p, 720p, 1080p)                 │
│  ├── Offline download capability (mobile)                        │
│  ├── Resume playback from last position                          │
│  ├── Playback speed control (0.5x - 2x)                          │
│  ├── Closed captions/subtitles                                   │
│  ├── Chapter markers                                             │
│  └── Full-screen mode                                            │
│                                                                  │
│  ENGAGEMENT FEATURES:                                            │
│  ├── In-video quizzes (pause for question)                       │
│  ├── Interactive hotspots (click for detail)                     │
│  ├── Notes at timestamps                                         │
│  ├── Bookmarks                                                   │
│  └── Share specific timestamp                                    │
│                                                                  │
│  TRACKING:                                                       │
│  ├── Watch time tracking                                         │
│  ├── Completion percentage                                       │
│  ├── Engagement metrics (pauses, rewinds)                        │
│  └── Quiz answer collection                                      │
│                                                                  │
│  TECHNICAL:                                                      │
│  ├── CDN distribution (global edge)                              │
│  ├── DRM protection (Widevine/FairPlay)                          │
│  ├── Token-based access control                                  │
│  └── Analytics integration                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Video Progress Tracking API:**

```
POST   /api/v1/training/videos/{id}/progress             # Update watch progress
GET    /api/v1/training/videos/{id}/progress             # Get progress
POST   /api/v1/training/videos/{id}/complete             # Mark complete
POST   /api/v1/training/videos/{id}/bookmark             # Add bookmark
GET    /api/v1/training/videos/{id}/bookmarks            # Get bookmarks
POST   /api/v1/training/videos/{id}/notes                # Add note at timestamp
```

#### 3.2.1.3 Assessment Engine

**Assessment Types:**

| Type | Description | Proctoring | Time Limit |
|------|-------------|------------|------------|
| `module_quiz` | End of module knowledge check | None | 10-15 min |
| `course_exam` | Final course assessment | Optional | 60-120 min |
| `certification_exam` | Official certification test | Required | 90-180 min |
| `practical_assessment` | Hands-on skills verification | In-person | Varies |
| `simulation` | Interactive scenario | Optional | 30-60 min |

**Question Types:**

```python
class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    MULTI_SELECT = "multi_select"
    TRUE_FALSE = "true_false"
    FILL_BLANK = "fill_blank"
    MATCHING = "matching"
    ORDERING = "ordering"
    SHORT_ANSWER = "short_answer"
    SCENARIO = "scenario"  # Multi-part scenario-based
    IMAGE_HOTSPOT = "image_hotspot"  # Click on diagram

class AssessmentQuestion(BaseModel):
    """A question in an assessment."""

    id: UUID
    assessment_id: UUID

    # Question
    question_type: QuestionType
    question_text: str
    question_html: str | None  # Rich text version
    image_url: str | None

    # Options (for choice questions)
    options: list[dict] | None
    # [{"id": "a", "text": "...", "image_url": null}]

    # Correct answer (stored separately, not returned to user)
    # correct_answer: str | list[str]

    # Scoring
    points: int = 1
    partial_credit: bool = False

    # Metadata
    difficulty: str  # 'easy', 'medium', 'hard'
    topic: str
    explanation: str | None  # Shown after answer

class AssessmentSubmission(BaseModel):
    """User's submission for an assessment."""

    assessment_id: UUID
    attempt_id: UUID
    answers: list[dict]
    # [{"question_id": "...", "answer": "...", "time_spent_seconds": 45}]

class AssessmentResult(BaseModel):
    """Results of an assessment."""

    attempt_id: UUID
    assessment_id: UUID
    assessment_title: str

    # Results
    score: int
    max_score: int
    percentage: float
    passed: bool
    passing_score: int

    # Breakdown
    correct_count: int
    incorrect_count: int
    skipped_count: int

    # Time
    time_taken_minutes: int
    time_limit_minutes: int | None

    # Details (if allowed to show)
    show_correct_answers: bool
    question_results: list[dict] | None
    # [{"question_id": "...", "correct": true, "your_answer": "...", "correct_answer": "...", "explanation": "..."}]

    # Next steps
    can_retake: bool
    retake_available_at: datetime | None
    remaining_attempts: int
```

#### 3.2.1.4 Mobile Learning Support

**Offline Capabilities:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    OFFLINE LEARNING                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DOWNLOADABLE CONTENT:                                           │
│  ├── Course materials (PDF, documents)                           │
│  ├── Video content (quality selection)                           │
│  ├── Quiz questions (for practice)                               │
│  └── Reference materials                                         │
│                                                                  │
│  SYNC BEHAVIOR:                                                  │
│  ├── Download queue management                                   │
│  ├── Background download (WiFi only option)                      │
│  ├── Progress sync when online                                   │
│  ├── Quiz answers queued for submission                          │
│  └── Automatic content updates                                   │
│                                                                  │
│  STORAGE MANAGEMENT:                                             │
│  ├── Storage usage display                                       │
│  ├── Auto-delete completed courses                               │
│  ├── Quality vs. storage tradeoff                                │
│  └── Clear cache option                                          │
│                                                                  │
│  LIMITATIONS:                                                    │
│  ├── Proctored exams: Online only                                │
│  ├── Discussion forums: Online only                              │
│  ├── Interactive simulations: Online only                        │
│  └── Live sessions: Online only                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.2.2 Universal Certification Tracking

#### 3.2.2.1 Certification Registry

**API Endpoints:**

```
GET    /api/v1/certifications/registry                   # Browse all certification types
GET    /api/v1/certifications/registry/{id}              # Get certification details
POST   /api/v1/me/certifications                         # Add certification
GET    /api/v1/me/certifications                         # My certifications
PUT    /api/v1/me/certifications/{id}                    # Update certification
DELETE /api/v1/me/certifications/{id}                    # Remove certification
POST   /api/v1/certifications/verify                     # Verify a certification
GET    /api/v1/users/{id}/certifications                 # User's public certifications
```

**Certification Sources:**

```python
class CertificationSource(str, Enum):
    MANUFACTURER = "manufacturer"           # KONE, Otis, etc.
    SITESYNC = "sitesync"                   # SiteSync courses
    GOVERNMENT = "government"               # State/federal
    INDUSTRY_BODY = "industry_body"         # NAESA, NEIEP, etc.
    TRADE_UNION = "trade_union"             # IUEC, etc.
    THIRD_PARTY = "third_party"             # Private training providers
    EMPLOYER = "employer"                   # Company-specific
    SELF_REPORTED = "self_reported"         # Manual entry

class UniversalCertification(BaseModel):
    """A certification type in the registry."""

    id: UUID

    # Basic info
    name: str
    code: str
    description: str

    # Source
    source: CertificationSource
    issuing_organization: str
    issuing_organization_id: UUID | None  # If in SiteSync

    # Classification
    category: str  # 'equipment', 'safety', 'compliance', 'management'
    trade: str
    level: str

    # Requirements
    prerequisites: list[dict]
    experience_required: str | None
    training_required: str | None
    exam_required: bool

    # Validity
    validity_period_months: int | None
    renewal_requirements: str | None
    continuing_education_required: bool

    # Verification
    can_be_verified: bool
    verification_url: str | None

    # Value
    industry_recognition: str  # 'high', 'medium', 'low'
    typical_salary_impact: str | None

class UserCertificationRecord(BaseModel):
    """User's held certification."""

    id: UUID
    user_id: UUID
    certification_id: UUID

    # Certification info
    certification_name: str
    certification_code: str
    issuing_organization: str

    # Status
    status: str  # 'active', 'expired', 'revoked', 'pending_verification'

    # Dates
    issued_date: date
    expiry_date: date | None
    first_earned_date: date  # For tracking history

    # Proof
    certificate_number: str | None
    certificate_document_id: UUID | None  # Uploaded certificate
    verification_status: str  # 'unverified', 'pending', 'verified', 'failed'
    verified_at: datetime | None

    # Digital badge
    badge_url: str | None
    badge_assertion_url: str | None  # OpenBadges

    # CE tracking
    ce_credits_earned: float
    ce_credits_required: float
    ce_due_date: date | None

    # Source
    earned_through: str  # 'sitesync_course', 'external', 'manual'
    course_id: UUID | None

    # Visibility
    is_public: bool = True

    # Metadata
    created_at: datetime
    updated_at: datetime
```

**Database Schema:**

```sql
-- Universal certification registry
CREATE TABLE certification_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic info
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,

    -- Source
    source VARCHAR(30) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issuing_organization_id UUID,  -- manufacturer_id or NULL

    -- Classification
    category VARCHAR(50) NOT NULL,
    trade VARCHAR(50) NOT NULL DEFAULT 'elevators',
    level VARCHAR(20),

    -- Requirements
    prerequisites JSONB DEFAULT '[]',
    experience_required TEXT,
    training_required TEXT,
    exam_required BOOLEAN DEFAULT FALSE,

    -- Validity
    validity_period_months INTEGER,
    renewal_requirements TEXT,
    continuing_education_required BOOLEAN DEFAULT FALSE,

    -- Verification
    can_be_verified BOOLEAN DEFAULT FALSE,
    verification_url TEXT,
    verification_api_endpoint TEXT,

    -- Value
    industry_recognition VARCHAR(20),
    typical_salary_impact TEXT,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User certification records
CREATE TABLE user_certification_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    certification_id UUID NOT NULL REFERENCES certification_registry(id),

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active',

    -- Dates
    issued_date DATE NOT NULL,
    expiry_date DATE,
    first_earned_date DATE,

    -- Proof
    certificate_number VARCHAR(255),
    certificate_document_id UUID REFERENCES uploaded_files(id),
    verification_status VARCHAR(20) DEFAULT 'unverified',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(255),

    -- Digital badge
    badge_url TEXT,
    badge_assertion_url TEXT,

    -- CE tracking
    ce_credits_earned DECIMAL(6, 2) DEFAULT 0,
    ce_credits_required DECIMAL(6, 2) DEFAULT 0,
    ce_due_date DATE,

    -- Source
    earned_through VARCHAR(30) NOT NULL DEFAULT 'manual',
    course_enrollment_id UUID REFERENCES course_enrollments(id),

    -- Visibility
    is_public BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_status CHECK (status IN ('active', 'expired', 'revoked', 'pending_verification'))
);

-- CE credit log
CREATE TABLE ce_credit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_certification_id UUID NOT NULL REFERENCES user_certification_records(id),

    -- Credit info
    credits_earned DECIMAL(6, 2) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,  -- 'course', 'webinar', 'conference', 'other'
    activity_id UUID,  -- course_id if from course
    activity_description TEXT,

    -- Date
    activity_date DATE NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),

    -- Verification
    documentation_id UUID REFERENCES uploaded_files(id)
);

-- Indexes
CREATE INDEX idx_cert_registry_source ON certification_registry(source);
CREATE INDEX idx_cert_registry_trade ON certification_registry(trade);
CREATE INDEX idx_user_certs_user ON user_certification_records(user_id);
CREATE INDEX idx_user_certs_status ON user_certification_records(status);
CREATE INDEX idx_user_certs_expiry ON user_certification_records(expiry_date)
    WHERE status = 'active' AND expiry_date IS NOT NULL;
```

#### 3.2.2.2 Expiry Tracking & Notifications

**Notification Schedule:**

```python
EXPIRY_NOTIFICATION_SCHEDULE = {
    "90_days": {
        "channels": ["email"],
        "message_type": "early_warning",
        "include_renewal_info": True
    },
    "60_days": {
        "channels": ["email", "in_app"],
        "message_type": "reminder",
        "include_renewal_info": True
    },
    "30_days": {
        "channels": ["email", "in_app", "push"],
        "message_type": "urgent",
        "include_renewal_info": True
    },
    "14_days": {
        "channels": ["email", "in_app", "push"],
        "message_type": "critical",
        "include_renewal_info": True,
        "cc_employer": True
    },
    "7_days": {
        "channels": ["email", "in_app", "push", "sms"],
        "message_type": "final_warning",
        "include_renewal_info": True,
        "cc_employer": True
    },
    "0_days": {
        "channels": ["email", "in_app"],
        "message_type": "expired",
        "cc_employer": True
    }
}
```

**Batch Renewal API:**

```
POST   /api/v1/me/certifications/bulk-renew              # Initiate bulk renewal
GET    /api/v1/me/certifications/expiring                # Get expiring certs
GET    /api/v1/organizations/{id}/certifications/expiring # Org's expiring certs
POST   /api/v1/certifications/{id}/renew                 # Renew single cert
```

#### 3.2.2.3 Digital Badges (OpenBadges)

**Badge Implementation:**

```python
class DigitalBadge(BaseModel):
    """OpenBadges 3.0 compliant digital badge."""

    # Badge class
    id: HttpUrl
    type: str = "BadgeClass"
    name: str
    description: str
    image: HttpUrl
    criteria: dict  # {"type": "Criteria", "narrative": "..."}

    # Issuer
    issuer: dict  # {"id": "...", "type": "Issuer", "name": "SiteSync"}

    # Tags
    tags: list[str]

class BadgeAssertion(BaseModel):
    """Issued badge assertion."""

    id: HttpUrl
    type: str = "Assertion"
    recipient: dict  # {"type": "email", "identity": "sha256$...", "hashed": true}
    badge: HttpUrl  # Badge class URL
    issuedOn: datetime
    expires: datetime | None
    verification: dict  # {"type": "HostedBadge"}
    evidence: list[dict] | None
```

---

### 3.2.3 Trade School Integration

#### 3.2.3.1 School Partnership Portal

**API Endpoints:**

```
POST   /api/v1/trade-schools                             # Register school
GET    /api/v1/trade-schools                             # List partner schools
GET    /api/v1/trade-schools/{id}                        # Get school details
PUT    /api/v1/trade-schools/{id}                        # Update school
POST   /api/v1/trade-schools/{id}/students               # Add students
GET    /api/v1/trade-schools/{id}/students               # List students
POST   /api/v1/trade-schools/{id}/instructors            # Add instructors
```

**School Account Features:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRADE SCHOOL PORTAL                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SCHOOL DASHBOARD:                                               │
│  ├── Student roster & progress                                   │
│  ├── Program completion rates                                    │
│  ├── Employer connection metrics                                 │
│  ├── Placement statistics                                        │
│  └── Content usage analytics                                     │
│                                                                  │
│  STUDENT MANAGEMENT:                                             │
│  ├── Bulk student import (CSV)                                   │
│  ├── Individual student creation                                 │
│  ├── Program assignment                                          │
│  ├── Progress tracking                                           │
│  ├── Graduation workflow                                         │
│  └── Account transition (student → professional)                 │
│                                                                  │
│  CURRICULUM TOOLS:                                               │
│  ├── Access SiteSync course library                              │
│  ├── Assign courses to programs                                  │
│  ├── Supplementary material uploads                              │
│  ├── Assessment integration                                      │
│  └── Progress requirements configuration                         │
│                                                                  │
│  EMPLOYER CONNECTIONS:                                           │
│  ├── Employer partnership requests                               │
│  ├── Job posting visibility                                      │
│  ├── Career fair coordination                                    │
│  ├── Apprenticeship matching                                     │
│  └── Graduate placement tracking                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Request Schema:**

```python
class TradeSchoolCreate(BaseModel):
    """Request to register a trade school."""

    # School info
    name: str = Field(..., min_length=3, max_length=255)
    legal_name: str
    description: str

    # Classification
    school_type: str  # 'community_college', 'vocational', 'union_training', 'private'
    programs_offered: list[str]  # ['elevator_mechanic', 'hvac', 'electrical']

    # Accreditation
    accreditation_body: str | None
    accreditation_status: str | None

    # Location
    address: dict
    service_region: list[str]

    # Contact
    main_contact_name: str
    main_contact_email: str
    main_contact_phone: str

    # Web
    website_url: str | None

class TradeSchoolStudent(BaseModel):
    """Student in a trade school program."""

    id: UUID
    user_id: UUID
    school_id: UUID

    # Student info
    student_id_number: str  # School's ID
    email: str
    first_name: str
    last_name: str

    # Program
    program_name: str
    program_start_date: date
    expected_graduation_date: date
    status: str  # 'enrolled', 'on_leave', 'graduated', 'withdrawn'

    # Progress
    credit_hours_completed: int
    credit_hours_required: int
    gpa: float | None

    # SiteSync activity
    courses_completed: int
    certifications_earned: int
    employer_connections: int

    # Placement
    employment_status: str | None  # 'seeking', 'employed', 'not_seeking'
    employer_id: UUID | None
```

#### 3.2.3.2 Apprenticeship Tracking

**Apprenticeship Program Model:**

```python
class ApprenticeshipProgram(BaseModel):
    """Structured apprenticeship program."""

    id: UUID
    name: str
    description: str

    # Sponsoring organization
    sponsor_type: str  # 'union', 'employer', 'school', 'consortium'
    sponsor_id: UUID
    sponsor_name: str

    # Program structure
    duration_years: int
    total_work_hours_required: int  # Typically 8,000
    total_classroom_hours_required: int  # Typically 576+

    # Periods
    periods: list[dict]
    # [{
    #     "period_number": 1,
    #     "name": "Probationary",
    #     "work_hours": 1000,
    #     "classroom_hours": 144,
    #     "skills": ["safety", "basic_tools", "..."],
    #     "wage_percentage": 50
    # }]

    # Certifications earned
    certifications_awarded: list[UUID]

    # Graduation requirements
    graduation_requirements: list[dict]

class ApprenticeProgress(BaseModel):
    """Individual apprentice's progress."""

    id: UUID
    user_id: UUID
    program_id: UUID

    # Status
    status: str  # 'active', 'suspended', 'completed', 'withdrawn'
    current_period: int

    # Hours
    total_work_hours_logged: int
    total_classroom_hours_logged: int
    hours_by_period: dict

    # Skills
    skills_acquired: list[str]
    skills_pending: list[str]

    # Evaluations
    latest_evaluation_date: date | None
    latest_evaluation_score: float | None
    evaluations: list[dict]

    # Supervisor
    current_supervisor_id: UUID | None
    current_supervisor_name: str | None

    # Timeline
    enrolled_date: date
    expected_completion_date: date
    actual_completion_date: date | None
```

**API Endpoints:**

```
GET    /api/v1/apprenticeship/programs                   # List programs
GET    /api/v1/apprenticeship/programs/{id}              # Get program details
POST   /api/v1/apprenticeship/enroll                     # Enroll in program
GET    /api/v1/me/apprenticeship                         # My apprenticeship status
POST   /api/v1/me/apprenticeship/log-hours               # Log work/classroom hours
GET    /api/v1/me/apprenticeship/progress                # Detailed progress
POST   /api/v1/apprenticeship/{id}/evaluate              # Submit evaluation (supervisor)
```

---

### 3.2.4 Mentorship Program

#### 3.2.4.1 Mentor-Mentee Matching

**Matching Algorithm:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    MENTOR MATCHING ALGORITHM                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  INPUT FACTORS:                                                  │
│                                                                  │
│  MENTEE PROFILE:                                                 │
│  ├── Current skill level                                         │
│  ├── Desired specialization                                      │
│  ├── Geographic location                                         │
│  ├── Preferred communication style                               │
│  ├── Availability                                                │
│  └── Goals                                                       │
│                                                                  │
│  MENTOR PROFILE:                                                 │
│  ├── Years of experience                                         │
│  ├── Specializations                                             │
│  ├── Certifications held                                         │
│  ├── Geographic location                                         │
│  ├── Mentoring capacity                                          │
│  ├── Communication preference                                    │
│  ├── Past mentorship ratings                                     │
│  └── Availability                                                │
│                                                                  │
│  MATCHING WEIGHTS:                                               │
│  ├── Specialization match:     30%                               │
│  ├── Geographic proximity:     20%                               │
│  ├── Experience level gap:     15% (2-10 years ideal)            │
│  ├── Availability overlap:     15%                               │
│  ├── Communication style:      10%                               │
│  └── Past success rate:        10%                               │
│                                                                  │
│  OUTPUT:                                                         │
│  ├── Ranked list of potential mentors                            │
│  ├── Match score (0-100)                                         │
│  └── Match explanation                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**API Endpoints:**

```
GET    /api/v1/mentorship/find-mentor                    # Find matching mentors
GET    /api/v1/mentorship/find-mentee                    # Find mentees (for mentors)
POST   /api/v1/mentorship/request                        # Request mentorship
PUT    /api/v1/mentorship/request/{id}/accept            # Accept request
PUT    /api/v1/mentorship/request/{id}/decline           # Decline request
GET    /api/v1/me/mentorship                             # My mentorship relationships
POST   /api/v1/mentorship/{id}/log-session               # Log mentoring session
POST   /api/v1/mentorship/{id}/feedback                  # Provide feedback
POST   /api/v1/mentorship/{id}/complete                  # Complete mentorship
```

**Request Schema:**

```python
class MentorProfile(BaseModel):
    """Mentor's profile for matching."""

    user_id: UUID

    # Experience
    years_experience: int
    specializations: list[str]
    certifications: list[str]
    equipment_expertise: list[str]

    # Mentoring info
    is_accepting_mentees: bool
    max_mentees: int
    current_mentee_count: int

    # Preferences
    preferred_mentee_level: list[str]  # ['apprentice', 'junior', 'mid']
    communication_preferences: list[str]  # ['in_person', 'video', 'phone', 'text']
    availability: dict  # {"hours_per_month": 4, "preferred_times": ["evenings", "weekends"]}

    # Location
    location_city: str
    location_region: str
    willing_to_mentor_remote: bool

    # Track record
    total_mentees: int
    successful_completions: int
    average_rating: float

class MenteeProfile(BaseModel):
    """Mentee's profile for matching."""

    user_id: UUID

    # Current status
    current_level: str  # 'student', 'apprentice', 'junior', 'transitioning'
    years_experience: int
    current_certifications: list[str]

    # Goals
    career_goal: str
    specialization_interest: list[str]
    skills_to_develop: list[str]
    timeline_months: int

    # Preferences
    communication_preferences: list[str]
    availability: dict

    # Location
    location_city: str
    location_region: str
    open_to_remote: bool

class MentorshipRelationship(BaseModel):
    """Active mentorship relationship."""

    id: UUID
    mentor_id: UUID
    mentee_id: UUID

    # Status
    status: str  # 'pending', 'active', 'completed', 'cancelled'

    # Structure
    mentorship_type: str  # 'general', 'certification_prep', 'career_transition', 'skill_specific'
    goals: list[str]
    duration_months: int

    # Progress
    sessions_completed: int
    next_session_scheduled: datetime | None
    milestones_completed: list[str]
    milestones_remaining: list[str]

    # Dates
    started_at: datetime
    expected_end_date: date
    completed_at: datetime | None

class MentoringSession(BaseModel):
    """Record of a mentoring session."""

    id: UUID
    relationship_id: UUID

    # Session details
    session_date: datetime
    duration_minutes: int
    format: str  # 'in_person', 'video', 'phone'
    location: str | None

    # Content
    topics_discussed: list[str]
    skills_practiced: list[str]
    resources_shared: list[str]

    # Notes
    mentor_notes: str | None
    mentee_notes: str | None

    # Follow-up
    action_items: list[dict]
    # [{"assignee": "mentee", "task": "...", "due_date": "..."}]

    # Rating
    mentee_rating: int | None
    mentor_rating: int | None
```

---

### 3.2.5 Company Training Management

#### 3.2.5.1 Training Assignment & Compliance

**API Endpoints:**

```
POST   /api/v1/organizations/{id}/training/assign        # Assign training
GET    /api/v1/organizations/{id}/training/assignments   # List assignments
GET    /api/v1/organizations/{id}/training/compliance    # Compliance dashboard
POST   /api/v1/organizations/{id}/training/requirements  # Set requirements
GET    /api/v1/me/training/assignments                   # My assigned training
```

**Training Assignment Schema:**

```python
class TrainingAssignment(BaseModel):
    """Assigned training for an employee."""

    id: UUID
    organization_id: UUID

    # Assignment
    course_id: UUID
    course_title: str

    # Target
    assigned_to_user_id: UUID | None  # Specific user
    assigned_to_role: str | None      # All users with role
    assigned_to_team_id: UUID | None  # Specific team

    # Timing
    assigned_at: datetime
    due_date: datetime | None
    is_mandatory: bool

    # Completion requirements
    requires_passing_score: bool
    minimum_score: int | None

    # Status
    status: str  # 'pending', 'in_progress', 'completed', 'overdue', 'exempted'
    completed_at: datetime | None

    # Notifications
    reminder_sent_7_days: bool
    reminder_sent_3_days: bool
    overdue_notification_sent: bool

class ComplianceStatus(BaseModel):
    """Training compliance status for organization."""

    organization_id: UUID

    # Overall metrics
    total_required_trainings: int
    completed_trainings: int
    in_progress_trainings: int
    overdue_trainings: int
    compliance_rate: float

    # By category
    compliance_by_category: dict
    # {"safety": 95.0, "equipment": 88.0, "compliance": 100.0}

    # By team
    compliance_by_team: list[dict]
    # [{"team_id": "...", "team_name": "...", "compliance_rate": 92.0}]

    # At-risk
    employees_with_overdue: list[dict]
    upcoming_due_dates: list[dict]

    # Certifications
    expiring_certifications_30_days: int
    expired_certifications: int
```

#### 3.2.5.2 Custom Content Upload

**Company Content Management:**

```
POST   /api/v1/organizations/{id}/training/content       # Upload content
GET    /api/v1/organizations/{id}/training/content       # List content
PUT    /api/v1/organizations/{id}/training/content/{id}  # Update content
DELETE /api/v1/organizations/{id}/training/content/{id}  # Remove content
POST   /api/v1/organizations/{id}/training/courses       # Create custom course
```

**Custom Course Schema:**

```python
class CompanyCustomCourse(BaseModel):
    """Company-created training course."""

    id: UUID
    organization_id: UUID

    # Course info
    title: str
    description: str
    category: str

    # Content
    modules: list[dict]
    # [{
    #     "title": "...",
    #     "content_type": "video" | "document" | "quiz",
    #     "content_id": UUID,
    #     "duration_minutes": int
    # }]

    # Settings
    is_mandatory: bool
    auto_assign_to_new_employees: bool
    auto_assign_to_roles: list[str]

    # Tracking
    track_completion: bool
    requires_assessment: bool
    passing_score: int | None

    # Distribution
    visibility: str  # 'organization', 'team', 'public'

    # Stats
    enrollment_count: int
    completion_count: int
    average_score: float | None
```

---

## Success Metrics

### Phase 3.2 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Course catalog size | 200+ courses | Unique courses |
| Training completions | 5,000+/month | Monthly completions |
| Certifications tracked | 10,000+ | Active records |
| Trade school partnerships | 10+ | Partner schools |
| Active mentorships | 500+ | Ongoing relationships |
| Company adoption | 100+ | Orgs using training features |
| Mobile learning | 40%+ | Sessions on mobile |
| CE credits issued | 10,000+/year | Annual credits |

### KPIs

1. **Learning Engagement**
   - Course completion rate
   - Average session duration
   - Return user rate
   - Assessment pass rate

2. **Certification Impact**
   - Certification renewal rate
   - New certifications earned
   - Verification requests

3. **Pipeline Development**
   - Students converted to professionals
   - Apprenticeship completion rate
   - Mentorship satisfaction

4. **Business Value**
   - Training revenue
   - Employer adoption rate
   - Premium feature usage

---

## Implementation Notes

### Content Partnership Strategy

| Partner Type | Content | Revenue Model |
|--------------|---------|---------------|
| Manufacturers | Equipment-specific | Revenue share |
| Industry bodies | Safety, compliance | Licensing fee |
| Trade unions | Apprenticeship | Free/partnership |
| Third-party | Specialty skills | Marketplace fee |
| SiteSync | Platform, best practices | Included |

### Technical Infrastructure

```
┌─────────────────────────────────────────────────────────────────┐
│                    LMS TECHNICAL STACK                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  VIDEO:                                                          │
│  ├── Storage: S3 / Cloud Storage                                 │
│  ├── Encoding: AWS MediaConvert / similar                        │
│  ├── CDN: CloudFront / Cloudflare                                │
│  ├── Player: Custom (Video.js based)                             │
│  └── Analytics: Custom + third-party                             │
│                                                                  │
│  CONTENT:                                                        │
│  ├── Documents: S3 with signed URLs                              │
│  ├── Search: PostgreSQL full-text + pgvector                     │
│  ├── Rendering: Markdown + custom components                     │
│  └── Interactive: React-based modules                            │
│                                                                  │
│  ASSESSMENT:                                                     │
│  ├── Question bank: PostgreSQL                                   │
│  ├── Proctoring: Third-party (ProctorU/similar)                  │
│  ├── Grading: Automatic + manual review                          │
│  └── Analytics: Custom scoring engine                            │
│                                                                  │
│  MOBILE:                                                         │
│  ├── Progressive Web App (primary)                               │
│  ├── Native app (future consideration)                           │
│  ├── Offline: Service Workers + IndexedDB                        │
│  └── Sync: Background sync API                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Risk Considerations

1. **Content quality**: Third-party content may vary
   - Mitigation: Review process, ratings, quality standards

2. **Completion fraud**: Users skipping content
   - Mitigation: Engagement tracking, quiz gates, proctoring

3. **Certification fraud**: Fake credentials
   - Mitigation: Verification APIs, blockchain consideration

4. **Mobile limitations**: Complex content on small screens
   - Mitigation: Responsive design, mobile-optimized content

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Owner: SiteSync Product Team*
