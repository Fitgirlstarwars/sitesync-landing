# SiteSync V3 - AI Learning & Feedback Loops

> **How Triforce Gets Smarter** - Complete specification for AI feedback collection, learning loops, and continuous improvement.

---

## Learning Philosophy

Triforce AI improves through real-world usage:

1. **Learn from Outcomes**: Compare predictions to actual results
2. **Learn from Experts**: Incorporate technician feedback and overrides
3. **Learn Equipment Quirks**: Build equipment-specific knowledge
4. **Never Regress**: Validate improvements before deployment

---

## Feedback Collection Points

### Overview

```
FEEDBACK COLLECTION FLOW
══════════════════════════════════════════════════════════════════

Diagnosis Request
       │
       ▼
┌──────────────────┐
│ Triforce AI      │
│ Generates        │
│ Diagnosis        │
└────────┬─────────┘
         │
         ▼
    ┌─────────────────────────────────────────────────┐
    │           FEEDBACK COLLECTION POINTS             │
    ├─────────────────────────────────────────────────┤
    │                                                  │
    │  1. IMMEDIATE                                    │
    │     └── User accepts/rejects diagnosis           │
    │     └── User overrides with different cause      │
    │     └── User rates confidence appropriateness    │
    │                                                  │
    │  2. DURING WORK                                  │
    │     └── Parts actually used vs suggested         │
    │     └── Time taken vs estimated                  │
    │     └── Additional issues discovered             │
    │                                                  │
    │  3. POST-COMPLETION                              │
    │     └── Resolution confirms/denies diagnosis     │
    │     └── Root cause matches prediction            │
    │     └── Technician rating of AI helpfulness      │
    │                                                  │
    │  4. LONG-TERM                                    │
    │     └── Equipment reliability post-repair        │
    │     └── Callback rate for same issue             │
    │     └── Pattern analysis across diagnoses        │
    │                                                  │
    └─────────────────────────────────────────────────┘

══════════════════════════════════════════════════════════════════
```

### Feedback Point Details

#### Point 1: Immediate Response

Captured when user first receives diagnosis:

| Feedback | Type | Values |
|----------|------|--------|
| Accepted | Boolean | Yes/No |
| Override Cause | Text | If different from prediction |
| Override Confidence | Rating | If AI was over/under confident |
| Skip Reason | Select | "Already knew", "Too slow", "Not relevant" |

```json
{
  "feedback_point": "immediate",
  "diagnosis_id": "uuid",
  "timestamp": "2024-12-01T10:00:00Z",
  "feedback": {
    "accepted": false,
    "override_cause": "Door operator belt worn, not sensor issue",
    "confidence_feedback": "overconfident",
    "skip_reason": null
  }
}
```

#### Point 2: During Work

Captured as technician works:

| Feedback | Type | Derived From |
|----------|------|--------------|
| Parts Match | Percentage | Suggested vs Used |
| Time Accuracy | Percentage | Estimated vs Actual |
| Additional Findings | Text | Notes entered |
| Diagnosis Changed | Boolean | Root cause updated |

```json
{
  "feedback_point": "during_work",
  "diagnosis_id": "uuid",
  "work_order_id": "uuid",
  "timestamp": "2024-12-01T11:30:00Z",
  "feedback": {
    "suggested_parts": ["light_curtain", "door_sensor"],
    "used_parts": ["door_belt", "belt_tensioner"],
    "parts_match_rate": 0.0,
    "estimated_time_minutes": 60,
    "actual_time_minutes": 45,
    "time_accuracy": 0.75,
    "additional_findings": "Belt was frayed, causing intermittent door issues"
  }
}
```

#### Point 3: Post-Completion

Captured at work order completion:

| Feedback | Type | Values |
|----------|------|--------|
| Resolution Match | Boolean | Root cause matched prediction |
| Helpfulness Rating | 1-5 | How helpful was AI |
| Would Use Again | Boolean | For similar issues |
| Improvement Suggestion | Text | Free-form feedback |

```json
{
  "feedback_point": "post_completion",
  "diagnosis_id": "uuid",
  "work_order_id": "uuid",
  "timestamp": "2024-12-01T12:00:00Z",
  "feedback": {
    "resolution_match": false,
    "predicted_cause": "Door sensor malfunction",
    "actual_cause": "Door operator belt worn",
    "helpfulness_rating": 2,
    "would_use_again": true,
    "improvement_suggestion": "Should check mechanical parts before electronics"
  }
}
```

#### Point 4: Long-Term

Captured through automated analysis:

| Feedback | Type | Timeframe |
|----------|------|-----------|
| Callback Rate | Percentage | 30/60/90 days |
| Same Issue Recurrence | Boolean | 30/60/90 days |
| Equipment Health Trend | Score | Post-repair |

```json
{
  "feedback_point": "long_term",
  "diagnosis_id": "uuid",
  "work_order_id": "uuid",
  "equipment_id": "uuid",
  "timestamp": "2024-12-31T00:00:00Z",
  "feedback": {
    "callback_within_30_days": false,
    "callback_within_90_days": false,
    "same_issue_recurrence": false,
    "health_score_before": 45,
    "health_score_after": 92,
    "health_improvement": 47
  }
}
```

---

## Feedback Data Model

### DiagnosisFeedback Entity

```sql
CREATE TABLE diagnosis_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    diagnosis_id UUID NOT NULL REFERENCES ai_diagnoses(id),
    work_order_id UUID REFERENCES work_orders(id),
    equipment_id UUID REFERENCES elevators(id),

    -- Feedback point
    feedback_point VARCHAR(50) NOT NULL,
    -- 'immediate', 'during_work', 'post_completion', 'long_term'

    -- Who provided feedback
    feedback_by UUID REFERENCES users(id),
    feedback_by_role VARCHAR(50),

    -- Feedback type
    feedback_type VARCHAR(50) NOT NULL,
    -- 'acceptance', 'override', 'rating', 'accuracy', 'callback'

    -- Core feedback data
    feedback_data JSONB NOT NULL,

    -- Computed metrics
    diagnosis_accuracy DECIMAL(3,2),  -- 0.00-1.00
    parts_accuracy DECIMAL(3,2),
    time_accuracy DECIMAL(3,2),

    -- Processing
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMPTZ,
    processing_notes TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feedback_diagnosis ON diagnosis_feedback(diagnosis_id);
CREATE INDEX idx_feedback_equipment ON diagnosis_feedback(equipment_id);
CREATE INDEX idx_feedback_processed ON diagnosis_feedback(processed) WHERE NOT processed;
CREATE INDEX idx_feedback_type ON diagnosis_feedback(feedback_type);
```

### FeedbackType Enum

```python
class FeedbackType(str, Enum):
    # Immediate feedback
    ACCEPTANCE = "acceptance"           # User accepted diagnosis
    REJECTION = "rejection"             # User rejected diagnosis
    OVERRIDE = "override"               # User provided different cause
    CONFIDENCE_RATING = "confidence"    # AI confidence was off

    # During work feedback
    PARTS_ACCURACY = "parts_accuracy"   # Parts prediction accuracy
    TIME_ACCURACY = "time_accuracy"     # Time estimate accuracy
    ADDITIONAL_FINDING = "finding"      # New information discovered

    # Post-completion feedback
    RESOLUTION_MATCH = "resolution"     # Did resolution match?
    HELPFULNESS = "helpfulness"         # User rating
    IMPROVEMENT = "improvement"         # Suggestion for improvement

    # Long-term feedback
    CALLBACK = "callback"               # Callback occurred
    RECURRENCE = "recurrence"           # Same issue recurred
    HEALTH_CHANGE = "health_change"     # Equipment health changed
```

---

## Learning Loops

### Loop 1: Immediate Learning (Real-Time)

**Trigger**: User accepts/rejects/overrides diagnosis
**Latency**: < 1 minute
**Impact**: Adjusts model weights for similar future queries

```python
async def process_immediate_feedback(feedback: DiagnosisFeedback):
    """Process immediate feedback and adjust weights."""

    diagnosis = await get_diagnosis(feedback.diagnosis_id)

    # Track acceptance rate by model
    for model_response in diagnosis.model_responses:
        model_id = model_response.model
        accepted = feedback.feedback_data.get('accepted', False)

        await update_model_stats(
            model_id=model_id,
            equipment_type=diagnosis.equipment_type,
            fault_category=diagnosis.fault_category,
            accepted=accepted
        )

    # If override provided, add to training queue
    if feedback.feedback_type == FeedbackType.OVERRIDE:
        override_cause = feedback.feedback_data.get('override_cause')
        await add_to_training_queue(
            diagnosis_id=diagnosis.id,
            original_prediction=diagnosis.predicted_cause,
            correct_answer=override_cause,
            context=diagnosis.context
        )
```

### Loop 2: Short-Term Learning (Days)

**Trigger**: Work order completion
**Latency**: 1-7 days
**Impact**: Validates predictions, adjusts confidence calibration

```python
async def process_completion_feedback(work_order: WorkOrder):
    """Process feedback when work order completes."""

    # Get associated diagnosis
    diagnosis = await get_diagnosis_for_work_order(work_order.id)
    if not diagnosis:
        return

    # Compare prediction to resolution
    accuracy = calculate_diagnosis_accuracy(
        predicted_cause=diagnosis.predicted_cause,
        actual_cause=work_order.root_cause,
        predicted_parts=diagnosis.suggested_parts,
        actual_parts=work_order.parts_used
    )

    # Store feedback
    await create_feedback(
        diagnosis_id=diagnosis.id,
        feedback_point='post_completion',
        feedback_type=FeedbackType.RESOLUTION_MATCH,
        feedback_data={
            'predicted_cause': diagnosis.predicted_cause,
            'actual_cause': work_order.root_cause,
            'cause_match': accuracy.cause_match,
            'parts_accuracy': accuracy.parts_accuracy,
            'time_accuracy': accuracy.time_accuracy,
            'overall_accuracy': accuracy.overall
        }
    )

    # Update equipment knowledge
    await update_equipment_knowledge(
        equipment_id=work_order.equipment_id,
        diagnosis=diagnosis,
        resolution=work_order.resolution,
        accuracy=accuracy
    )
```

### Loop 3: Long-Term Learning (Weeks/Months)

**Trigger**: Scheduled analysis, callback events
**Latency**: 30-90 days
**Impact**: Pattern recognition, model retraining decisions

```python
@scheduled(cron="0 2 * * 0")  # Weekly on Sunday 2 AM
async def long_term_learning_analysis():
    """Analyze long-term patterns and outcomes."""

    # Get diagnoses from 30-90 days ago
    diagnoses = await get_diagnoses_in_range(
        from_date=now() - timedelta(days=90),
        to_date=now() - timedelta(days=30)
    )

    for diagnosis in diagnoses:
        work_order = await get_work_order_for_diagnosis(diagnosis.id)
        if not work_order or work_order.status != 'completed':
            continue

        # Check for callbacks
        callbacks = await get_callbacks_for_work_order(
            work_order.id,
            within_days=90
        )

        # Check health trends
        equipment = await get_equipment(work_order.equipment_id)
        health_before = diagnosis.equipment_health_at_diagnosis
        health_after = equipment.health_score

        # Store long-term feedback
        await create_feedback(
            diagnosis_id=diagnosis.id,
            feedback_point='long_term',
            feedback_type=FeedbackType.HEALTH_CHANGE,
            feedback_data={
                'callback_count': len(callbacks),
                'callback_same_issue': any(
                    c.fault_code == work_order.fault_code
                    for c in callbacks
                ),
                'health_before': health_before,
                'health_after': health_after,
                'health_improvement': health_after - health_before
            }
        )

    # Trigger retraining evaluation
    await evaluate_retraining_need()
```

---

## Knowledge Base Growth

### Knowledge Sources

| Source | Type | Example |
|--------|------|---------|
| Work Order Resolutions | Factual | "E15 on KONE MonoSpace usually caused by encoder issue" |
| Technician Overrides | Expert | "Check belt tension before replacing sensor" |
| Manufacturer Docs | Reference | Technical manual procedures |
| Equipment Quirks | Experiential | "Unit 3 at Collins Tower has sensitive door sensor" |

### Knowledge Entry Structure

```json
{
  "id": "uuid",
  "organization_id": null,  // null = platform-wide
  "knowledge_type": "diagnostic_pattern",
  "category": "door_faults",

  "context": {
    "manufacturer": "KONE",
    "models": ["MonoSpace 500", "MonoSpace 700"],
    "fault_codes": ["E15", "E16"],
    "symptoms": ["door not closing", "door reopening repeatedly"]
  },

  "content": {
    "likely_causes": [
      {"cause": "Light curtain obstruction", "probability": 0.35},
      {"cause": "Door operator belt worn", "probability": 0.30},
      {"cause": "Door sensor calibration", "probability": 0.20},
      {"cause": "Interlock misalignment", "probability": 0.15}
    ],
    "diagnostic_steps": [
      "Check for visible obstructions in door path",
      "Inspect light curtain alignment and cleanliness",
      "Check door operator belt tension and condition",
      "Verify door sensor calibration values"
    ],
    "common_parts": ["KM903370G01", "KM50010520"],
    "estimated_time_minutes": 45
  },

  "quality": {
    "confidence": 0.85,
    "usage_count": 234,
    "accuracy_rate": 0.82,
    "last_validated": "2024-12-01T00:00:00Z"
  },

  "source": {
    "type": "learned",  // 'manual', 'learned', 'imported'
    "derived_from": ["diagnosis-uuid-1", "diagnosis-uuid-2"],
    "validated_by": "expert_review"
  },

  "created_at": "2024-06-01T00:00:00Z",
  "updated_at": "2024-12-01T00:00:00Z"
}
```

### Expert Validation Workflow

```
New Knowledge Candidate
         │
         ▼
┌──────────────────┐
│  Quality Check   │
│  - Confidence    │
│  - Usage count   │
│  - Accuracy      │
└────────┬─────────┘
         │
         ▼
    ┌─────────────────────────────────────┐
    │            PASSES?                   │
    │  confidence > 0.75 AND               │
    │  usage_count > 50 AND                │
    │  accuracy_rate > 0.70                │
    └──────────────┬──────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
        YES                  NO
         │                   │
         ▼                   ▼
┌──────────────────┐  ┌──────────────────┐
│  Auto-Approve    │  │  Expert Review   │
│  (Low Risk)      │  │  Queue           │
└──────────────────┘  └──────────────────┘
         │                   │
         ▼                   ▼
┌──────────────────┐  ┌──────────────────┐
│  Add to Active   │  │  Manual Review   │
│  Knowledge Base  │  │  & Approval      │
└──────────────────┘  └──────────────────┘
```

---

## Model Weight Adjustment

### Per-Model Accuracy Tracking

```python
@dataclass
class ModelPerformance:
    model_id: str
    equipment_type: str
    fault_category: str

    total_predictions: int
    correct_predictions: int
    accuracy_rate: float

    avg_confidence: float
    calibration_error: float  # |confidence - accuracy|

    last_updated: datetime

async def update_model_performance(
    model_id: str,
    equipment_type: str,
    fault_category: str,
    was_correct: bool,
    confidence: float
):
    """Update model performance metrics."""

    # Get or create performance record
    perf = await get_or_create_model_performance(
        model_id, equipment_type, fault_category
    )

    # Update counts
    perf.total_predictions += 1
    if was_correct:
        perf.correct_predictions += 1

    # Recalculate accuracy
    perf.accuracy_rate = perf.correct_predictions / perf.total_predictions

    # Update confidence calibration
    # (How well does confidence predict accuracy?)
    await update_calibration(perf, confidence, was_correct)

    await save_model_performance(perf)
```

### Dynamic Weight Calculation

```python
def calculate_model_weights(
    equipment_type: str,
    fault_category: str
) -> dict[str, float]:
    """Calculate model weights based on performance."""

    performances = get_model_performances(equipment_type, fault_category)

    weights = {}
    total_score = 0

    for perf in performances:
        # Base score from accuracy
        score = perf.accuracy_rate

        # Boost for good calibration (confidence matches accuracy)
        calibration_bonus = max(0, 1 - perf.calibration_error)
        score *= (1 + 0.2 * calibration_bonus)

        # Penalize if too few samples
        if perf.total_predictions < 50:
            score *= (perf.total_predictions / 50)

        weights[perf.model_id] = score
        total_score += score

    # Normalize to sum to 1.0
    for model_id in weights:
        weights[model_id] /= total_score

    return weights

# Example output:
# {
#     "gemini-2.0-pro": 0.40,    # Best for KONE door faults
#     "claude-sonnet": 0.35,      # Good all-around
#     "gpt-4-turbo": 0.25         # Less experience here
# }
```

### Trade-Specific Tuning

```json
{
  "model_weights": {
    "default": {
      "gemini-2.0-pro": 0.34,
      "claude-sonnet": 0.33,
      "gpt-4-turbo": 0.33
    },
    "by_manufacturer": {
      "KONE": {
        "gemini-2.0-pro": 0.45,
        "claude-sonnet": 0.30,
        "gpt-4-turbo": 0.25
      },
      "Otis": {
        "gemini-2.0-pro": 0.30,
        "claude-sonnet": 0.40,
        "gpt-4-turbo": 0.30
      }
    },
    "by_fault_category": {
      "door_faults": {
        "gemini-2.0-pro": 0.40,
        "claude-sonnet": 0.35,
        "gpt-4-turbo": 0.25
      },
      "drive_faults": {
        "gemini-2.0-pro": 0.30,
        "claude-sonnet": 0.35,
        "gpt-4-turbo": 0.35
      }
    }
  }
}
```

---

## Equipment-Specific Learning

### Known Quirks Accumulation

Equipment develops "quirks" based on repeated observations:

```python
async def update_equipment_quirks(
    equipment_id: UUID,
    observation: str,
    confidence: float
):
    """Add or update equipment-specific quirk."""

    equipment = await get_equipment(equipment_id)

    # Check if similar quirk exists
    existing = find_similar_quirk(equipment.known_quirks, observation)

    if existing:
        # Increase confidence in existing quirk
        existing.occurrences += 1
        existing.confidence = min(0.99, existing.confidence + 0.05)
    else:
        # Add new quirk
        equipment.known_quirks.append({
            "observation": observation,
            "confidence": confidence,
            "occurrences": 1,
            "first_seen": now(),
            "last_seen": now()
        })

    await save_equipment(equipment)
```

### Site-Specific Factors

```json
{
  "equipment_id": "uuid",
  "known_quirks": [
    {
      "observation": "Door B-side sensor requires recalibration every 6 months",
      "confidence": 0.92,
      "occurrences": 4,
      "last_seen": "2024-12-01"
    },
    {
      "observation": "Controller reboot required if fault code E15 persists after clearing",
      "confidence": 0.88,
      "occurrences": 3,
      "last_seen": "2024-11-15"
    }
  ],
  "site_factors": {
    "building_age": "old",
    "power_stability": "fluctuating",
    "traffic_level": "high",
    "environment": "dusty"
  },
  "maintenance_patterns": {
    "common_issues": ["door_sensor", "belt_wear"],
    "avg_issues_per_year": 4.2,
    "preferred_pm_day": "Tuesday"
  }
}
```

---

## Accuracy Metrics & Dashboards

### Core Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| **Overall Accuracy** | Correct diagnoses / Total diagnoses | > 75% |
| **Cause Accuracy** | Correct cause identified / Total | > 70% |
| **Parts Accuracy** | Correct parts suggested / Total parts used | > 60% |
| **Time Accuracy** | Within 20% of actual time | > 70% |
| **Acceptance Rate** | User accepted / Total shown | > 65% |
| **Helpfulness Score** | Avg user rating (1-5) | > 3.5 |
| **Callback Rate** | Callbacks within 30 days | < 10% |

### Accuracy by Dimension

```
ACCURACY BREAKDOWN
──────────────────────────────────────────────────────────────

By Manufacturer                    By Fault Category
────────────────                   ──────────────────
KONE:        82%  ████████░░      Door Faults:    78%  ████████░░
Otis:        76%  ████████░░      Drive Faults:   72%  ███████░░░
Schindler:   71%  ███████░░░      Safety Faults:  85%  █████████░
ThyssenKrupp: 68%  ███████░░░     Controller:     69%  ███████░░░
Other:       65%  ███████░░░      Electrical:     74%  ███████░░░

By Confidence Level                By Model
────────────────────               ────────
High (>80%):   91%  █████████░    Gemini:  78%  ████████░░
Medium (50-80%): 72%  ███████░░░  Claude:  76%  ████████░░
Low (<50%):    58%  ██████░░░░    GPT-4:   74%  ███████░░░

Trend (Last 12 Months)
──────────────────────
        Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
Acc %   68   70   72   71   74   75   76   77   78   79   80   81
        ─────────────────────────────────────────────────────────►
```

### Dashboard for Admins

```
Triforce AI Performance - Last 30 Days
──────────────────────────────────────────────────────────────

Total Diagnoses: 1,234        Accuracy: 78%        Acceptance: 72%

┌─────────────────────────────────────────────────────────────────┐
│                    ACCURACY TREND                                │
│  85% ─┼──────────────────────────────────────────────────       │
│       │                                    ___/\___             │
│  75% ─┼───────────────────────────────___/         \___         │
│       │                    ___/\___/                            │
│  65% ─┼───────────___/\___/                                     │
│       │____/\___/                                               │
│  55% ─┼─────────────────────────────────────────────────────    │
│       Week 1   Week 2   Week 3   Week 4                         │
└─────────────────────────────────────────────────────────────────┘

Top Improvement Opportunities           Recent Model Updates
─────────────────────────────           ────────────────────
1. Hydraulic faults (62% acc)           Dec 1: Weight adjustment
2. Schindler equipment (65%)            Nov 28: New knowledge added
3. Time estimation (68%)                Nov 25: Calibration update

Feedback Summary                        Knowledge Base Growth
─────────────────                       ────────────────────
Accepted: 890 (72%)                     New patterns: +15
Rejected: 156 (13%)                     Updated: +42
Overridden: 188 (15%)                   Validated: +8
```

---

## Retraining Triggers & Process

### When to Retrain

| Trigger | Condition | Action |
|---------|-----------|--------|
| Accuracy Drop | < 70% for 7 days | Alert + evaluate |
| New Equipment | Major new manufacturer | Prioritize learning |
| Model Update | New model version | Re-evaluate weights |
| Feedback Volume | 1000+ new samples | Consider fine-tuning |
| Knowledge Growth | 100+ new patterns | Rebuild embeddings |

### Retraining Process

```
RETRAINING PIPELINE
══════════════════════════════════════════════════════════════════

1. Data Collection
   └── Gather feedback from last 90 days
   └── Extract positive/negative examples
   └── Balance dataset by category

2. Validation Set Creation
   └── Hold out 20% for testing
   └── Ensure coverage across manufacturers
   └── Include edge cases

3. Model Evaluation
   └── Test current model on validation set
   └── Establish baseline metrics

4. Training/Fine-tuning
   └── Prompt engineering improvements
   └── Knowledge base updates
   └── Weight recalibration

5. A/B Testing
   └── Route 10% of traffic to new model
   └── Compare metrics over 7 days

6. Rollout Decision
   └── If improvement > 5%: Full rollout
   └── If neutral: More testing
   └── If worse: Rollback

══════════════════════════════════════════════════════════════════
```

---

## A/B Testing Framework

### Test Configuration

```json
{
  "test_id": "uuid",
  "name": "New weight distribution test",
  "status": "active",
  "created_at": "2024-12-01T00:00:00Z",

  "variants": {
    "control": {
      "allocation": 0.90,
      "config": {
        "model_weights": {
          "gemini-2.0-pro": 0.34,
          "claude-sonnet": 0.33,
          "gpt-4-turbo": 0.33
        }
      }
    },
    "treatment": {
      "allocation": 0.10,
      "config": {
        "model_weights": {
          "gemini-2.0-pro": 0.45,
          "claude-sonnet": 0.35,
          "gpt-4-turbo": 0.20
        }
      }
    }
  },

  "metrics": ["accuracy", "acceptance_rate", "latency_p95"],
  "minimum_samples": 500,
  "duration_days": 14,
  "auto_rollout_threshold": {
    "accuracy_improvement": 0.05,
    "confidence_level": 0.95
  }
}
```

### Test Results Analysis

```python
async def analyze_ab_test(test_id: UUID) -> ABTestResult:
    """Analyze A/B test results."""

    test = await get_ab_test(test_id)
    control_metrics = await get_variant_metrics(test_id, 'control')
    treatment_metrics = await get_variant_metrics(test_id, 'treatment')

    # Statistical significance test
    significance = calculate_significance(
        control_metrics,
        treatment_metrics
    )

    # Decision
    if significance.p_value < 0.05:
        if treatment_metrics.accuracy > control_metrics.accuracy:
            recommendation = "ROLLOUT"
        else:
            recommendation = "ROLLBACK"
    else:
        recommendation = "CONTINUE_TESTING"

    return ABTestResult(
        test_id=test_id,
        control=control_metrics,
        treatment=treatment_metrics,
        significance=significance,
        recommendation=recommendation
    )
```

---

## API Endpoints

### Submit Feedback

```http
POST /api/v1/ai/diagnoses/{diagnosis_id}/feedback
{
  "feedback_point": "immediate",
  "feedback_type": "acceptance",
  "feedback_data": {
    "accepted": true
  }
}
```

### Get Diagnosis Accuracy

```http
GET /api/v1/ai/accuracy?
    from_date=2024-12-01&
    to_date=2024-12-31&
    manufacturer=KONE

Response:
{
  "overall_accuracy": 0.78,
  "by_category": {...},
  "by_model": {...},
  "trends": {...}
}
```

### Get Equipment Learning

```http
GET /api/v1/equipment/{equipment_id}/ai-insights

Response:
{
  "known_quirks": [...],
  "common_issues": [...],
  "diagnosis_history": [...],
  "accuracy_for_equipment": 0.82
}
```

---

**[← Previous: Notification System](17-notification-system.md)** | **[Next: Performance & Caching →](19-performance-caching-strategy.md)**
