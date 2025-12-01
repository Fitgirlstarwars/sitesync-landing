# Phase 1.2: Building Manager Knowledge Platform

> Detailed implementation specification for the building manager knowledge and community system
> Status: Design Phase
> Priority: HIGH - Enables building-side network effects

---

## Overview

The Building Manager Knowledge Platform provides non-technical building managers with:
1. **Educational content** to understand their equipment and contracts
2. **AI-powered tools** to interpret reports and evaluate quotes
3. **Community forums** to share experiences with peers
4. **Benchmarking data** to understand if they're getting fair value
5. **Contractor insights** based on verified platform data

---

## Strategic Value

```
WHY THIS MATTERS FOR SITESYNC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BUILDING MANAGERS ARE THE PAYING CUSTOMERS
├── They pay the $29/month subscription
├── They choose which contractors to use
├── They influence contractor adoption ("use SiteSync or lose the contract")
└── They are the key to B2B sales and expansion

EDUCATED MANAGERS = BETTER OUTCOMES
├── Understand what good service looks like
├── Ask better questions of contractors
├── Make informed decisions about maintenance
├── Appreciate the value SiteSync provides
└── Become advocates and referrers

MANAGER COMMUNITY = NETWORK EFFECTS
├── Managers recommend SiteSync to peer managers
├── Property management companies standardize on platform
├── Industry associations partner with SiteSync
└── Enterprise deals emerge from individual adoption
```

---

## User Stories

### As a Building Manager:

1. **US-M001:** I want to understand what a service report means without technical jargon
2. **US-M002:** I want to know if a repair quote is reasonable for the work described
3. **US-M003:** I want to compare my maintenance costs to similar buildings
4. **US-M004:** I want to learn what questions to ask contractors
5. **US-M005:** I want to understand compliance requirements for my jurisdiction
6. **US-M006:** I want to connect with other managers of similar properties
7. **US-M007:** I want to see how other managers handled contractor transitions
8. **US-M008:** I want alerts when compliance deadlines are approaching
9. **US-M009:** I want to evaluate contractor performance objectively
10. **US-M010:** I want to understand my Building Health Score components

### As a Portfolio Manager:

11. **US-M011:** I want to compare performance across my buildings
12. **US-M012:** I want to identify which buildings need attention
13. **US-M013:** I want to standardize contractor evaluation across portfolio
14. **US-M014:** I want consolidated reporting for ownership/board

### As a Strata Manager:

15. **US-M015:** I want templates for communicating maintenance to owners
16. **US-M016:** I want to justify maintenance spending to strata committees
17. **US-M017:** I want comparison data for AGM presentations

---

## Feature Breakdown

### 1.2.1 Manager Knowledge Base

#### Content Categories

```
MANAGER KNOWLEDGE BASE STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 UNDERSTANDING YOUR EQUIPMENT
├── 📖 Elevator Basics for Building Managers
│   ├── Types of elevators (traction, hydraulic, MRL)
│   ├── Key components and what they do
│   ├── Common terminology explained
│   └── Expected lifespans and replacement timing
├── 📖 HVAC Systems Overview
├── 📖 Fire Systems Explained
├── 📖 Electrical Systems Basics
└── 📖 Reading Equipment Nameplates

📋 CONTRACTS & PROCUREMENT
├── 📖 Understanding Maintenance Contracts
│   ├── Full maintenance vs. parts & labor
│   ├── What should be included
│   ├── Red flags in contracts
│   └── Negotiation tips
├── 📖 Evaluating Contractor Bids
│   ├── Comparing apples to apples
│   ├── Questions to ask
│   ├── Reference checking
│   └── Price vs. value analysis
├── 📖 Switching Contractors Smoothly
│   ├── Transition checklist
│   ├── Data handover requirements
│   ├── Notice periods
│   └── Avoiding service gaps
└── 📖 Contract Templates & Checklists

📊 READING SERVICE REPORTS
├── 📖 Anatomy of a Service Report
│   ├── What each section means
│   ├── Key things to look for
│   ├── Warning signs
│   └── Questions to ask about findings
├── 📖 Understanding Fault Codes
│   ├── Common codes by manufacturer
│   ├── Severity levels
│   └── When to be concerned
└── 📖 Inspection Reports Explained

💰 BUDGETING & COSTS
├── 📖 Maintenance Budget Planning
│   ├── Annual budget templates
│   ├── Capital vs. operational expenses
│   ├── Reserve fund calculations
│   └── Unexpected cost buffers
├── 📖 Cost Benchmarks by Equipment Type
│   ├── Elevator maintenance costs
│   ├── HVAC maintenance costs
│   ├── Industry averages
│   └── Factors affecting cost
└── 📖 When to Modernize vs. Repair

⚖️ COMPLIANCE & REGULATIONS
├── 📖 Compliance Requirements by State
│   ├── NSW requirements
│   ├── VIC requirements
│   ├── QLD requirements
│   └── [Other jurisdictions]
├── 📖 Inspection Schedules
├── 📖 Record Keeping Requirements
└── 📖 Liability & Insurance Considerations

🚨 EMERGENCY PROCEDURES
├── 📖 Elevator Entrapment Response
├── 📖 Building Emergency Plans
├── 📖 After-Hours Procedures
└── 📖 Incident Documentation

📝 TEMPLATES & TOOLS
├── 📄 Contractor Evaluation Scorecard
├── 📄 Maintenance Budget Template
├── 📄 Tenant Communication Templates
├── 📄 Board/Committee Report Templates
├── 📄 Contract Comparison Checklist
└── 📄 Compliance Tracking Spreadsheet
```

#### Content Model

```python
# sitesync_v3/domains/manager_knowledge/models.py

class ManagerArticle(BaseModel):
    """Knowledge article for building managers."""

    id: UUID

    # Content
    title: str
    slug: str
    summary: str  # 2-3 sentence overview
    content: str  # Markdown
    content_html: str  # Rendered

    # Classification
    category: str
    subcategory: str | None
    tags: list[str]

    # Audience
    target_roles: list[str]  # ['facility_manager', 'strata_manager', etc.]
    property_types: list[str]  # ['commercial', 'residential', etc.]
    experience_level: str  # 'beginner', 'intermediate', 'advanced'

    # Equipment context
    equipment_types: list[str]  # ['elevator', 'hvac', etc.]

    # Jurisdiction (for compliance content)
    jurisdiction_country: str | None
    jurisdiction_state: str | None

    # Media
    featured_image_url: str | None
    video_url: str | None

    # Related
    related_article_ids: list[UUID]
    related_template_ids: list[UUID]

    # SEO
    meta_description: str

    # Stats
    view_count: int
    helpful_count: int

    # Publishing
    status: str  # 'draft', 'published', 'archived'
    published_at: datetime | None
    author_id: UUID

    # Versioning
    version: int
    last_reviewed_at: datetime
    review_due_at: datetime


class ManagerTemplate(BaseModel):
    """Downloadable template for managers."""

    id: UUID

    # Info
    title: str
    description: str

    # File
    file_type: str  # 'xlsx', 'docx', 'pdf'
    file_url: str
    preview_image_url: str | None

    # Classification
    category: str
    tags: list[str]

    # Stats
    download_count: int

    # Publishing
    status: str
    published_at: datetime | None
```

#### Content Delivery API

```python
# API Endpoints
GET  /api/v1/manager-knowledge/articles
GET  /api/v1/manager-knowledge/articles/{slug}
GET  /api/v1/manager-knowledge/articles/category/{category}
GET  /api/v1/manager-knowledge/search
GET  /api/v1/manager-knowledge/templates
GET  /api/v1/manager-knowledge/templates/{id}/download
POST /api/v1/manager-knowledge/articles/{id}/helpful
GET  /api/v1/manager-knowledge/recommended  # Personalized

# Personalization
class RecommendationEngine:
    """Recommend content based on manager context."""

    async def get_recommendations(
        self,
        user_id: UUID,
    ) -> list[ManagerArticle]:
        """
        Get personalized article recommendations.
        """
        # Get user context
        user = await self.repo.get_user_with_sites(user_id)

        # Factors for recommendation:
        # 1. Equipment types in their buildings
        # 2. Recent activity (what they've viewed)
        # 3. Compliance deadlines approaching
        # 4. Building health issues
        # 5. Their role and experience level

        equipment_types = set()
        for site in user.sites:
            for elevator in site.elevators:
                equipment_types.add('elevator')
                equipment_types.add(elevator.manufacturer.lower())

        # Get articles matching their context
        articles = await self.repo.get_articles_by_relevance(
            equipment_types=list(equipment_types),
            property_types=[s.site_type for s in user.sites],
            jurisdiction=user.sites[0].state if user.sites else None,
            exclude_viewed=True,
            user_id=user_id,
        )

        return articles[:10]
```

---

### 1.2.2 AI-Powered Manager Tools

#### 1.2.2.1 Service Report Interpreter

```
SERVICE REPORT INTERPRETER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MANAGER UPLOADS OR VIEWS A SERVICE REPORT
                    │
                    ▼
           ┌────────────────┐
           │   AI ANALYSIS  │
           └───────┬────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
┌─────────┐  ┌──────────┐  ┌──────────┐
│ SUMMARY │  │ KEY      │  │ ACTIONS  │
│ Plain   │  │ FINDINGS │  │ NEEDED   │
│ English │  │          │  │          │
└─────────┘  └──────────┘  └──────────┘
    │              │              │
    ▼              ▼              ▼
"Your elevator   "Door sensor   "Ask your
service was      showing wear   contractor
routine. Two     (normal for    about door
minor items      age). Safety   sensor
were noted."    check passed."  replacement
                                timeline."
```

```python
# sitesync_v3/domains/manager_tools/report_interpreter.py

class ReportInterpretation(BaseModel):
    """AI interpretation of a service report."""

    # Summary
    overall_summary: str  # 2-3 sentences, plain English
    urgency_level: str  # 'routine', 'attention_needed', 'urgent'

    # Key Findings
    findings: list[Finding]

    # Comparison
    comparison_to_typical: str  # "This is a typical service visit..."

    # Actions
    recommended_actions: list[RecommendedAction]
    questions_to_ask: list[str]

    # Cost Context
    cost_assessment: str | None  # If costs included

    # Follow-up
    next_service_recommendation: str
    compliance_status: str


class Finding(BaseModel):
    """Individual finding from report."""

    item: str
    plain_english: str
    severity: str  # 'info', 'minor', 'moderate', 'serious'
    typical_cost_range: str | None
    timeline_recommendation: str


class ReportInterpreterService:
    """Interpret service reports for managers."""

    async def interpret_report(
        self,
        work_order_id: UUID,
        user_id: UUID,
    ) -> ReportInterpretation:
        """
        Generate manager-friendly interpretation of service report.
        """
        # Get work order with all details
        work_order = await self.repo.get_work_order_full(work_order_id)

        # Get equipment context
        elevator = work_order.elevator

        # Get historical context
        history = await self.repo.get_equipment_history(
            elevator_id=elevator.id,
            limit=10,
        )

        # Build prompt for AI
        prompt = f"""
        You are helping a building manager understand a service report.
        They are NOT technical - explain everything in plain English.

        SERVICE REPORT:
        ---------------
        Date: {work_order.completed_at}
        Type: {work_order.type}
        Equipment: {elevator.manufacturer} {elevator.model}
        Age: {calculate_age(elevator.installation_date)} years

        Work Performed:
        {work_order.resolution_notes}

        Fault Code (if any): {work_order.fault_code}
        Parts Used: {work_order.parts_used}

        EQUIPMENT HISTORY:
        ------------------
        Previous {len(history)} service visits summary...

        TASK:
        -----
        1. Summarize this service visit in 2-3 plain English sentences
        2. List key findings with plain English explanations
        3. Assess urgency (routine / attention needed / urgent)
        4. Recommend actions the manager should take
        5. Suggest questions they might ask the contractor
        6. Compare to typical service for this equipment age
        """

        result = await self.triforce.query(
            prompt=prompt,
            output_schema=ReportInterpretationInternal,
        )

        return self._format_interpretation(result, work_order)

    async def interpret_uploaded_report(
        self,
        document_id: UUID,
        user_id: UUID,
    ) -> ReportInterpretation:
        """
        Interpret an uploaded PDF/image service report.
        """
        # Extract text from document
        document = await self.doc_service.get_document(document_id)
        extracted_text = await self.doc_service.extract_text(document)

        # Use AI to interpret
        prompt = f"""
        A building manager has uploaded a service report.
        Extract the key information and explain it in plain English.

        DOCUMENT CONTENT:
        {extracted_text}

        [Same interpretation task as above...]
        """

        result = await self.triforce.query(prompt=prompt, ...)
        return result
```

#### 1.2.2.2 Quote Analyzer

```python
# sitesync_v3/domains/manager_tools/quote_analyzer.py

class QuoteAnalysis(BaseModel):
    """AI analysis of a contractor quote."""

    # Overall Assessment
    overall_assessment: str  # 'competitive', 'fair', 'high', 'very_high'
    confidence: float

    # Price Analysis
    total_quoted: Decimal
    market_comparison: str  # "This quote is X% above/below typical..."
    price_breakdown_assessment: list[LineItemAnalysis]

    # Scope Analysis
    scope_completeness: str  # 'comprehensive', 'adequate', 'incomplete'
    missing_items: list[str]
    included_extras: list[str]

    # Red Flags
    red_flags: list[str]
    green_flags: list[str]

    # Recommendations
    questions_to_ask: list[str]
    negotiation_points: list[str]

    # Comparison Data
    similar_quotes_range: str  # "$X - $Y for similar work"
    data_points_used: int


class LineItemAnalysis(BaseModel):
    """Analysis of a single line item."""

    description: str
    quoted_price: Decimal
    typical_range: str
    assessment: str  # 'competitive', 'fair', 'high'
    notes: str | None


class QuoteAnalyzerService:
    """Analyze contractor quotes for fairness."""

    async def analyze_quote(
        self,
        quote_data: QuoteInput,
        site_id: UUID,
        user_id: UUID,
    ) -> QuoteAnalysis:
        """
        Analyze a quote against market data.
        """
        # Get site context
        site = await self.repo.get_site_with_equipment(site_id)

        # Get market data for comparison
        market_data = await self._get_market_comparisons(
            work_type=quote_data.work_type,
            equipment_type=quote_data.equipment_type,
            location=site.state,
        )

        # AI analysis
        prompt = f"""
        A building manager received this quote and wants to know if it's fair.

        QUOTE DETAILS:
        --------------
        Work Description: {quote_data.description}
        Total Amount: ${quote_data.total_amount}

        Line Items:
        {self._format_line_items(quote_data.line_items)}

        BUILDING CONTEXT:
        -----------------
        Location: {site.city}, {site.state}
        Building Type: {site.site_type}
        Equipment: {quote_data.equipment_type}

        MARKET DATA:
        ------------
        Similar work in this area typically costs: {market_data.typical_range}
        Based on {market_data.data_points} similar jobs in our database.

        TASK:
        -----
        1. Assess if this quote is competitive, fair, high, or very high
        2. Analyze each line item against typical costs
        3. Identify any red flags (unusual charges, missing items)
        4. Suggest questions the manager should ask
        5. Identify potential negotiation points
        """

        result = await self.triforce.query(
            prompt=prompt,
            output_schema=QuoteAnalysisInternal,
        )

        return self._format_analysis(result, market_data)

    async def _get_market_comparisons(
        self,
        work_type: str,
        equipment_type: str,
        location: str,
    ) -> MarketData:
        """
        Get market comparison data from platform history.
        """
        # Query completed work orders for similar work
        similar_jobs = await self.repo.get_similar_completed_jobs(
            work_type=work_type,
            equipment_type=equipment_type,
            state=location,
            months_back=24,
            limit=100,
        )

        if not similar_jobs:
            # Fall back to broader search or industry averages
            return MarketData(
                typical_range="Unable to determine - insufficient data",
                data_points=0,
                source="industry_average",
            )

        costs = [job.total_cost for job in similar_jobs if job.total_cost]

        return MarketData(
            typical_range=f"${percentile(costs, 25):,.0f} - ${percentile(costs, 75):,.0f}",
            average=mean(costs),
            median=median(costs),
            data_points=len(costs),
            source="platform_data",
        )
```

#### 1.2.2.3 Building Health Explainer

```python
# sitesync_v3/domains/manager_tools/health_explainer.py

class HealthScoreExplanation(BaseModel):
    """Plain-English explanation of Building Health Score."""

    # Overall
    score: int
    grade: str  # 'A', 'B', 'C', 'D', 'F'
    summary: str  # "Your building is in good condition..."

    # Component Breakdown
    components: list[ComponentExplanation]

    # Trend
    trend: str  # 'improving', 'stable', 'declining'
    trend_explanation: str

    # Comparison
    peer_comparison: str  # "Compared to similar buildings..."
    percentile: int

    # Recommendations
    priority_actions: list[PriorityAction]

    # Forecast
    forecast: str  # "If current trends continue..."


class ComponentExplanation(BaseModel):
    """Explanation of a health score component."""

    name: str
    score: int
    weight: str  # "25% of total"
    plain_explanation: str
    status: str  # 'excellent', 'good', 'fair', 'needs_attention', 'critical'
    improvement_tip: str | None


class HealthExplainerService:
    """Explain Building Health Score to managers."""

    async def explain_health_score(
        self,
        site_id: UUID,
        user_id: UUID,
    ) -> HealthScoreExplanation:
        """
        Generate plain-English explanation of health score.
        """
        # Get current score with components
        site = await self.repo.get_site_with_health(site_id)

        # Get historical scores
        history = await self.repo.get_health_history(site_id, months=12)

        # Get peer comparison
        peers = await self.repo.get_peer_buildings(
            site_type=site.site_type,
            state=site.state,
            size_range=(site.floors_count - 5, site.floors_count + 5),
        )

        # Calculate percentile
        percentile = self._calculate_percentile(site.health_score, peers)

        # Determine grade
        grade = self._score_to_grade(site.health_score)

        # Generate explanations
        components = []
        for comp_name, comp_data in site.health_score_components.items():
            components.append(ComponentExplanation(
                name=self._friendly_name(comp_name),
                score=comp_data['score'],
                weight=f"{comp_data['weight']}% of total",
                plain_explanation=self._explain_component(comp_name, comp_data),
                status=self._score_to_status(comp_data['score']),
                improvement_tip=self._get_improvement_tip(comp_name, comp_data),
            ))

        # Determine trend
        trend, trend_explanation = self._analyze_trend(history)

        # Priority actions
        priority_actions = await self._get_priority_actions(site)

        return HealthScoreExplanation(
            score=site.health_score,
            grade=grade,
            summary=self._generate_summary(site, grade, percentile),
            components=components,
            trend=trend,
            trend_explanation=trend_explanation,
            peer_comparison=f"Your building scores better than {percentile}% of similar buildings",
            percentile=percentile,
            priority_actions=priority_actions,
            forecast=self._generate_forecast(site, trend),
        )

    def _explain_component(self, name: str, data: dict) -> str:
        """Generate plain-English explanation for a component."""
        explanations = {
            'equipment_condition': {
                'high': "Your equipment is in excellent condition for its age.",
                'medium': "Your equipment is showing normal wear. Some components may need attention in the coming year.",
                'low': "Several pieces of equipment are showing significant wear and may need repairs or replacement soon.",
            },
            'maintenance_compliance': {
                'high': "All scheduled maintenance is being completed on time.",
                'medium': "Most maintenance is on schedule, but some services have been delayed.",
                'low': "Maintenance is falling behind schedule, which increases breakdown risk.",
            },
            'incident_frequency': {
                'high': "Very few breakdowns or issues - your equipment is reliable.",
                'medium': "Occasional issues occur, which is typical for this equipment age.",
                'low': "Frequent breakdowns are occurring - this needs attention.",
            },
            'first_time_fix_rate': {
                'high': "Issues are being resolved efficiently on the first visit.",
                'medium': "Some issues require multiple visits to resolve.",
                'low': "Many issues require multiple service visits - this may indicate contractor quality issues.",
            },
            'predictive_risk': {
                'high': "No significant issues predicted in the near term.",
                'medium': "Some components may need attention in the next 6-12 months.",
                'low': "Our AI predicts several components may fail soon - proactive maintenance recommended.",
            },
        }

        score = data['score']
        level = 'high' if score >= 80 else 'medium' if score >= 50 else 'low'

        return explanations.get(name, {}).get(level, "Score is being calculated.")
```

---

### 1.2.3 Manager Community & Forums

#### Forum Structure for Managers

```
MANAGER FORUM HIERARCHY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 BY PROPERTY TYPE
├── 🏙️ Commercial Office Buildings
│   ├── High-rise (10+ floors)
│   ├── Mid-rise (4-9 floors)
│   └── Low-rise/Campus
├── 🏠 Residential
│   ├── Strata/Apartment Buildings
│   ├── Mixed-Use Developments
│   └── Retirement Living
├── 🏥 Healthcare & Aged Care
├── 🏫 Education
├── 🏪 Retail & Shopping Centers
├── 🏭 Industrial & Warehousing
└── 🏨 Hospitality

📍 BY REGION
├── 🦘 Australia
│   ├── NSW
│   ├── VIC
│   ├── QLD
│   └── [Other states]
├── 🥝 New Zealand
└── 🌏 International

📋 BY TOPIC
├── 💼 Contractor Management
│   ├── Finding Good Contractors
│   ├── Contract Negotiations
│   ├── Performance Issues
│   └── Switching Contractors
├── 💰 Budgeting & Costs
│   ├── Budget Planning
│   ├── Cost Benchmarking
│   ├── Unexpected Expenses
│   └── Capital Works
├── ⚖️ Compliance & Regulations
│   ├── Inspection Requirements
│   ├── Regulatory Changes
│   └── Documentation
├── 🔧 Equipment Decisions
│   ├── Modernization
│   ├── Replacement
│   └── New Installations
└── 🏢 General Management
    ├── Tenant Relations
    ├── Emergency Response
    └── Best Practices

👥 PRIVATE GROUPS
├── [Company Name] Portfolio Managers (private)
├── [Industry Association] Members (verified)
└── [Geographic Area] Managers Group (regional)
```

#### Manager Verification

```python
# sitesync_v3/domains/manager_community/verification.py

class ManagerVerificationService:
    """Verify building manager credentials."""

    VERIFICATION_LEVELS = {
        'basic': {
            'requirements': ['email_verified'],
            'access': ['public_forums', 'articles'],
        },
        'verified': {
            'requirements': ['email_verified', 'organization_linked', 'site_linked'],
            'access': ['all_forums', 'benchmarking', 'peer_comparison'],
        },
        'professional': {
            'requirements': ['verified', 'professional_certification'],
            'access': ['verified + premium_content', 'industry_groups'],
        },
    }

    async def get_verification_level(
        self,
        user_id: UUID,
    ) -> VerificationResult:
        """
        Determine manager's verification level.
        """
        user = await self.repo.get_user_full(user_id)

        checks = {
            'email_verified': user.email_verified,
            'organization_linked': user.organization_id is not None,
            'site_linked': len(user.managed_sites) > 0,
            'professional_certification': await self._check_certifications(user_id),
        }

        # Determine highest level achieved
        level = 'basic'
        if all(checks[r] for r in self.VERIFICATION_LEVELS['verified']['requirements']):
            level = 'verified'
        if all(checks[r] for r in self.VERIFICATION_LEVELS['professional']['requirements']):
            level = 'professional'

        return VerificationResult(
            level=level,
            checks=checks,
            access=self.VERIFICATION_LEVELS[level]['access'],
            upgrade_path=self._get_upgrade_path(level, checks),
        )
```

#### Manager Discussions API

```python
# API Endpoints
GET    /api/v1/manager-community/forums
GET    /api/v1/manager-community/forums/{category_id}/threads
POST   /api/v1/manager-community/threads
GET    /api/v1/manager-community/threads/{id}
POST   /api/v1/manager-community/threads/{id}/replies

# Privacy-conscious sharing
class ManagerThreadCreate(BaseModel):
    """Create a discussion thread."""

    category_id: UUID
    title: str
    content: str

    # Privacy options
    share_building_details: bool = False  # Show building type, size
    share_location: bool = False  # Show city/region
    share_contractor_name: bool = False  # Name the contractor

    # Context (shown based on privacy settings)
    building_type: str | None
    building_size: str | None  # 'small', 'medium', 'large'
    region: str | None

    # Topic
    tags: list[str]
```

---

### 1.2.4 Benchmarking & Comparisons

#### Cost Benchmarking

```python
# sitesync_v3/domains/manager_tools/benchmarking.py

class CostBenchmark(BaseModel):
    """Cost benchmarking results."""

    # Your costs
    your_annual_cost: Decimal
    your_cost_per_sqm: Decimal
    your_cost_per_unit: Decimal  # Per elevator/equipment

    # Comparison
    peer_average: Decimal
    peer_median: Decimal
    peer_range: str  # "$X - $Y"
    your_percentile: int  # You spend more than X% of peers

    # Breakdown
    your_breakdown: dict[str, Decimal]  # By cost category
    peer_breakdown: dict[str, Decimal]

    # Analysis
    assessment: str  # 'below_average', 'average', 'above_average', 'high'
    insights: list[str]
    potential_savings: Decimal | None

    # Data quality
    peer_count: int
    data_freshness: str


class BenchmarkingService:
    """Provide cost and performance benchmarking."""

    async def get_cost_benchmark(
        self,
        site_id: UUID,
        period: str = 'annual',  # 'annual', 'monthly', 'quarterly'
    ) -> CostBenchmark:
        """
        Compare site costs to peer buildings.
        """
        site = await self.repo.get_site_with_costs(site_id)

        # Define peer group
        peers = await self.repo.get_peer_buildings(
            site_type=site.site_type,
            state=site.state,
            floors_range=(site.floors_count - 5, site.floors_count + 5),
            elevator_count_range=(
                len(site.elevators) - 2,
                len(site.elevators) + 2
            ),
        )

        # Get costs for period
        your_costs = await self.repo.get_site_costs(site_id, period)
        peer_costs = await self.repo.get_peer_costs([p.id for p in peers], period)

        # Calculate benchmarks
        peer_values = [p.total_cost for p in peer_costs]

        return CostBenchmark(
            your_annual_cost=your_costs.total,
            your_cost_per_sqm=your_costs.total / site.total_area_sqm if site.total_area_sqm else None,
            your_cost_per_unit=your_costs.total / len(site.elevators),

            peer_average=mean(peer_values),
            peer_median=median(peer_values),
            peer_range=f"${min(peer_values):,.0f} - ${max(peer_values):,.0f}",
            your_percentile=self._calculate_percentile(your_costs.total, peer_values),

            your_breakdown=your_costs.by_category,
            peer_breakdown=self._average_breakdown(peer_costs),

            assessment=self._assess_costs(your_costs.total, peer_values),
            insights=self._generate_insights(your_costs, peer_costs),
            potential_savings=self._calculate_potential_savings(your_costs, peer_values),

            peer_count=len(peers),
            data_freshness="Last 12 months",
        )
```

#### Contractor Performance Comparison

```python
class ContractorComparison(BaseModel):
    """Compare contractor performance to platform averages."""

    contractor_name: str

    # Response metrics
    your_contractor_response_time: int  # minutes
    platform_average_response_time: int
    assessment: str

    # Quality metrics
    your_contractor_first_fix_rate: float
    platform_average_first_fix_rate: float

    # Reliability
    your_contractor_callback_rate: float
    platform_average_callback_rate: float

    # Overall
    overall_rating: float  # 1-5
    platform_average_rating: float

    # Ranking
    percentile: int  # Top X% of contractors

    # Trends
    trending: str  # 'improving', 'stable', 'declining'


class ContractorComparisonService:
    """Compare contractor performance objectively."""

    async def compare_contractor(
        self,
        site_id: UUID,
        contractor_id: UUID,
    ) -> ContractorComparison:
        """
        Compare a contractor's performance to platform averages.
        """
        # Get contractor's metrics for this site
        contractor_metrics = await self.repo.get_contractor_metrics(
            contractor_id=contractor_id,
            site_id=site_id,
        )

        # Get platform averages for same equipment/region
        site = await self.repo.get_site(site_id)
        platform_metrics = await self.repo.get_platform_averages(
            state=site.state,
            equipment_types=[e.manufacturer for e in site.elevators],
        )

        return ContractorComparison(
            contractor_name=contractor_metrics.contractor_name,

            your_contractor_response_time=contractor_metrics.avg_response_time,
            platform_average_response_time=platform_metrics.avg_response_time,
            assessment=self._assess_response_time(
                contractor_metrics.avg_response_time,
                platform_metrics.avg_response_time,
            ),

            your_contractor_first_fix_rate=contractor_metrics.first_fix_rate,
            platform_average_first_fix_rate=platform_metrics.first_fix_rate,

            your_contractor_callback_rate=contractor_metrics.callback_rate,
            platform_average_callback_rate=platform_metrics.callback_rate,

            overall_rating=contractor_metrics.rating,
            platform_average_rating=platform_metrics.avg_rating,

            percentile=self._calculate_contractor_percentile(contractor_metrics),
            trending=self._calculate_trend(contractor_id),
        )
```

---

### 1.2.5 Compliance Assistant

```python
# sitesync_v3/domains/manager_tools/compliance_assistant.py

class ComplianceDashboard(BaseModel):
    """Compliance status overview for a manager."""

    # Overall Status
    overall_status: str  # 'compliant', 'attention_needed', 'overdue'
    compliant_count: int
    attention_needed_count: int
    overdue_count: int

    # Upcoming
    upcoming_30_days: list[ComplianceItem]
    upcoming_90_days: list[ComplianceItem]

    # Overdue
    overdue_items: list[ComplianceItem]

    # By Equipment
    by_equipment: list[EquipmentComplianceStatus]

    # Actions Needed
    priority_actions: list[ComplianceAction]


class ComplianceItem(BaseModel):
    """Individual compliance requirement status."""

    id: UUID
    equipment_name: str
    requirement_name: str
    requirement_description: str

    due_date: date
    days_until_due: int

    status: str  # 'compliant', 'due_soon', 'overdue'

    last_completed: date | None
    last_result: str | None

    # Guidance
    what_to_do: str
    estimated_cost: str | None
    typical_duration: str


class ComplianceAssistantService:
    """Help managers stay compliant."""

    async def get_compliance_dashboard(
        self,
        site_id: UUID,
    ) -> ComplianceDashboard:
        """
        Get compliance overview for a site.
        """
        site = await self.repo.get_site_with_equipment(site_id)

        # Get all compliance tracking records
        compliance_records = await self.repo.get_compliance_tracking(site_id)

        # Categorize
        compliant = []
        attention = []
        overdue = []

        today = date.today()

        for record in compliance_records:
            days_until = (record.next_due_date - today).days

            item = ComplianceItem(
                id=record.id,
                equipment_name=record.elevator.unit_number,
                requirement_name=record.requirement.name,
                requirement_description=record.requirement.description,
                due_date=record.next_due_date,
                days_until_due=days_until,
                status=self._determine_status(days_until, record),
                last_completed=record.last_completed_at,
                last_result=record.last_result,
                what_to_do=self._get_guidance(record),
                estimated_cost=self._estimate_cost(record.requirement),
                typical_duration=self._typical_duration(record.requirement),
            )

            if days_until < 0:
                overdue.append(item)
            elif days_until <= 30:
                attention.append(item)
            else:
                compliant.append(item)

        return ComplianceDashboard(
            overall_status=self._overall_status(overdue, attention),
            compliant_count=len(compliant),
            attention_needed_count=len(attention),
            overdue_count=len(overdue),
            upcoming_30_days=sorted(attention, key=lambda x: x.due_date),
            upcoming_90_days=[
                r for r in compliant
                if r.days_until_due <= 90
            ],
            overdue_items=sorted(overdue, key=lambda x: x.due_date),
            by_equipment=self._group_by_equipment(compliance_records),
            priority_actions=self._generate_actions(overdue, attention),
        )

    async def get_requirement_explanation(
        self,
        requirement_id: UUID,
    ) -> RequirementExplanation:
        """
        Get plain-English explanation of a compliance requirement.
        """
        requirement = await self.repo.get_requirement(requirement_id)

        return RequirementExplanation(
            name=requirement.name,
            plain_english=self._explain_requirement(requirement),
            why_required="This is required because...",
            what_happens_if_missed="If this is missed, you may face...",
            typical_process="Typically, this involves...",
            typical_cost=self._estimate_cost(requirement),
            typical_duration=self._typical_duration(requirement),
            how_to_schedule="To schedule this, you can...",
            documentation_needed="You should receive...",
            regulatory_reference=requirement.regulation_code,
        )
```

---

## Frontend Components

### Manager Dashboard

```tsx
// src/features/manager/components/ManagerDashboard.tsx

export function ManagerDashboard() {
  const { data: sites } = useManagerSites();
  const { data: compliance } = useComplianceSummary();
  const { data: recommendations } = useRecommendedContent();

  return (
    <DashboardLayout>
      {/* Building Health Overview */}
      <Section title="Your Buildings">
        <BuildingHealthGrid sites={sites} />
      </Section>

      {/* Compliance Alerts */}
      {compliance?.attention_needed_count > 0 && (
        <AlertBanner variant="warning">
          <AlertIcon />
          <span>
            {compliance.attention_needed_count} compliance items need attention
          </span>
          <Button variant="link" href="/compliance">
            View Details
          </Button>
        </AlertBanner>
      )}

      {/* Quick Actions */}
      <Section title="Quick Actions">
        <QuickActionGrid>
          <QuickAction
            icon="📄"
            title="Understand a Report"
            description="Get AI help interpreting service reports"
            href="/tools/report-interpreter"
          />
          <QuickAction
            icon="💰"
            title="Analyze a Quote"
            description="Check if a quote is fair"
            href="/tools/quote-analyzer"
          />
          <QuickAction
            icon="📊"
            title="Compare Costs"
            description="Benchmark against similar buildings"
            href="/tools/benchmarking"
          />
          <QuickAction
            icon="🎓"
            title="Learn"
            description="Guides for building managers"
            href="/knowledge"
          />
        </QuickActionGrid>
      </Section>

      {/* Recommended Content */}
      <Section title="Recommended for You">
        <ArticleCarousel articles={recommendations} />
      </Section>

      {/* Recent Activity */}
      <Section title="Recent Activity">
        <ActivityFeed />
      </Section>

      {/* Community Highlights */}
      <Section title="From the Community">
        <CommunityHighlights />
      </Section>
    </DashboardLayout>
  );
}
```

### Report Interpreter Interface

```tsx
// src/features/manager/components/ReportInterpreter.tsx

export function ReportInterpreter() {
  const [selectedReport, setSelectedReport] = useState<WorkOrder | null>(null);
  const [uploadedDoc, setUploadedDoc] = useState<Document | null>(null);

  const { data: interpretation, isLoading } = useReportInterpretation(
    selectedReport?.id || uploadedDoc?.id
  );

  return (
    <PageLayout title="Understand Your Service Reports">
      <Intro>
        <p>
          Not sure what a service report means? Our AI will explain it
          in plain English and highlight what you need to know.
        </p>
      </Intro>

      {/* Selection */}
      <Card>
        <Tabs>
          <Tab label="Recent Reports">
            <RecentReportsList
              onSelect={setSelectedReport}
              selected={selectedReport}
            />
          </Tab>
          <Tab label="Upload Report">
            <FileUpload
              accept=".pdf,.jpg,.png"
              onUpload={setUploadedDoc}
              hint="Upload a PDF or photo of a service report"
            />
          </Tab>
        </Tabs>
      </Card>

      {/* Interpretation */}
      {(selectedReport || uploadedDoc) && (
        <Card>
          {isLoading ? (
            <LoadingState message="Analyzing report..." />
          ) : interpretation ? (
            <InterpretationDisplay interpretation={interpretation} />
          ) : null}
        </Card>
      )}
    </PageLayout>
  );
}

function InterpretationDisplay({ interpretation }: Props) {
  return (
    <div className="interpretation">
      {/* Summary */}
      <Section>
        <UrgencyBadge level={interpretation.urgency_level} />
        <Summary>{interpretation.overall_summary}</Summary>
      </Section>

      {/* Key Findings */}
      <Section title="Key Findings">
        {interpretation.findings.map((finding) => (
          <FindingCard key={finding.item}>
            <SeverityIndicator severity={finding.severity} />
            <div>
              <strong>{finding.item}</strong>
              <p>{finding.plain_english}</p>
              {finding.typical_cost_range && (
                <CostHint>
                  Typical cost: {finding.typical_cost_range}
                </CostHint>
              )}
            </div>
          </FindingCard>
        ))}
      </Section>

      {/* Actions */}
      <Section title="What You Should Do">
        <ActionList>
          {interpretation.recommended_actions.map((action) => (
            <ActionItem key={action.title}>
              <PriorityBadge priority={action.priority} />
              <div>
                <strong>{action.title}</strong>
                <p>{action.description}</p>
              </div>
            </ActionItem>
          ))}
        </ActionList>
      </Section>

      {/* Questions to Ask */}
      <Section title="Questions to Ask Your Contractor">
        <QuestionList>
          {interpretation.questions_to_ask.map((question) => (
            <QuestionItem key={question}>
              <QuestionIcon />
              {question}
              <CopyButton text={question} />
            </QuestionItem>
          ))}
        </QuestionList>
      </Section>
    </div>
  );
}
```

### Benchmarking Dashboard

```tsx
// src/features/manager/components/BenchmarkingDashboard.tsx

export function BenchmarkingDashboard() {
  const { siteId } = useParams();
  const { data: costBenchmark } = useCostBenchmark(siteId);
  const { data: contractorComparison } = useContractorComparison(siteId);

  return (
    <PageLayout title="How Does Your Building Compare?">
      {/* Cost Comparison */}
      <Section title="Maintenance Costs">
        <BenchmarkCard>
          <YourValue>
            <Label>Your Annual Cost</Label>
            <Value>${costBenchmark?.your_annual_cost.toLocaleString()}</Value>
          </YourValue>

          <ComparisonChart
            yourValue={costBenchmark?.your_annual_cost}
            peerAverage={costBenchmark?.peer_average}
            peerRange={costBenchmark?.peer_range}
          />

          <PercentileIndicator percentile={costBenchmark?.your_percentile}>
            You spend {costBenchmark?.assessment} compared to similar buildings
          </PercentileIndicator>

          <PeerContext>
            Based on {costBenchmark?.peer_count} similar buildings in your area
          </PeerContext>
        </BenchmarkCard>

        {/* Cost Breakdown Comparison */}
        <BreakdownComparison
          yours={costBenchmark?.your_breakdown}
          peers={costBenchmark?.peer_breakdown}
        />

        {/* Insights */}
        <InsightsList insights={costBenchmark?.insights} />
      </Section>

      {/* Contractor Performance */}
      <Section title="Contractor Performance">
        <ContractorCard>
          <ContractorHeader>
            <ContractorName>{contractorComparison?.contractor_name}</ContractorName>
            <OverallRating rating={contractorComparison?.overall_rating} />
          </ContractorHeader>

          <MetricComparison
            metrics={[
              {
                name: 'Response Time',
                yours: contractorComparison?.your_contractor_response_time,
                average: contractorComparison?.platform_average_response_time,
                unit: 'minutes',
                lowerIsBetter: true,
              },
              {
                name: 'First-Time Fix Rate',
                yours: contractorComparison?.your_contractor_first_fix_rate,
                average: contractorComparison?.platform_average_first_fix_rate,
                unit: '%',
                lowerIsBetter: false,
              },
              {
                name: 'Callback Rate',
                yours: contractorComparison?.your_contractor_callback_rate,
                average: contractorComparison?.platform_average_callback_rate,
                unit: '%',
                lowerIsBetter: true,
              },
            ]}
          />

          <PercentileIndicator percentile={contractorComparison?.percentile}>
            Top {100 - contractorComparison?.percentile}% of contractors on the platform
          </PercentileIndicator>
        </ContractorCard>
      </Section>
    </PageLayout>
  );
}
```

---

## Success Metrics

### Phase 1.2 KPIs

| Metric | Target (Month 1) | Target (Month 3) | Target (Month 6) |
|--------|------------------|------------------|------------------|
| Article views | 500 | 5,000 | 20,000 |
| Tool usage (interpreter, analyzer) | 100 | 1,000 | 5,000 |
| Manager forum posts | 20 | 200 | 1,000 |
| Manager verification rate | 50% | 70% | 85% |
| NPS from managers | 30 | 45 | 60 |
| Manager retention (month-over-month) | 80% | 85% | 90% |

---

## Implementation Timeline

### Week 1-2: Knowledge Base Foundation
- [ ] Content management system
- [ ] Article publishing workflow
- [ ] Initial content creation (10 core articles)
- [ ] Template downloads

### Week 3-4: AI Tools
- [ ] Report interpreter implementation
- [ ] Quote analyzer implementation
- [ ] Health score explainer

### Week 5-6: Community
- [ ] Manager forums setup
- [ ] Verification system
- [ ] Privacy controls

### Week 7-8: Benchmarking
- [ ] Cost benchmarking engine
- [ ] Contractor comparison
- [ ] Peer matching algorithm

### Week 9-10: Polish & Launch
- [ ] Compliance assistant
- [ ] Dashboard integration
- [ ] Content expansion (20+ articles)
- [ ] Beta testing with managers

---

*Document Version: 1.0*
*Last Updated: December 2025*
