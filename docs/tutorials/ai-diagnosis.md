# AI Diagnosis Tutorial

> Use Triforce AI for intelligent fault diagnosis

## Overview

SiteSync's Triforce AI analyzes faults using multiple AI models to provide reliable diagnoses. This tutorial shows you how to use AI assistance effectively, override when needed, and help the system learn.

## How Triforce AI Works

```
Your fault report
      ↓
┌─────────────────────────────────────────────────────────────┐
│  JURY (3 AI Models in Parallel)                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Gemini 2.0  │  │   Claude    │  │   GPT-4     │         │
│  │    Pro      │  │   Sonnet    │  │   Turbo     │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              CONSENSUS ENGINE                        │   │
│  │         Weighted voting + confidence scoring         │   │
│  └──────────────────────────┬──────────────────────────┘   │
│                             ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              WITNESS (Validation)                    │   │
│  │   Checks against knowledge base & equipment history  │   │
│  └──────────────────────────┬──────────────────────────┘   │
│                             ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    JUDGE                             │   │
│  │        Final synthesis (Claude Opus 4.5)             │   │
│  └──────────────────────────┬──────────────────────────┘   │
│                             ▼                               │
└─────────────────────────────────────────────────────────────┘
      ↓
Final diagnosis with confidence score
```

**Why multiple models?** No single AI is always right. When three models agree, confidence is high. When they disagree, you're shown alternatives.

---

## Using AI Diagnosis

### Step 1: Describe the Fault

When creating a work order, provide detailed information:

**Good description:**
> "Lift making grinding noise during door operation on Level 3. Started yesterday. No error codes on panel."

**Better with specifics:**
> "KONE lift showing F505 fault code intermittently. Doors hesitate before closing. Humidity has been high this week. Similar to issue we had last summer."

### Step 2: Request Diagnosis

Click **Get AI Diagnosis** or enable auto-diagnosis in settings.

```
┌─────────────────────────────────────────────────────────────┐
│  Create Work Order                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Title: Door hesitating before closing                      │
│                                                             │
│  Description:                                               │
│  KONE lift showing F505 fault code intermittently.          │
│  Doors hesitate 2-3 seconds before closing. High            │
│  humidity this week. Affects all floors.                    │
│                                                             │
│  Fault Code: [F505                    ]                     │
│                                                             │
│  ☑ Request AI Diagnosis                                     │
│                                                             │
│  [ Create Work Order ]                                      │
└─────────────────────────────────────────────────────────────┘
```

### Step 3: Review Results

```
┌─────────────────────────────────────────────────────────────┐
│  🤖 AI Diagnosis                                            │
│                                                             │
│  Confidence: ████████░░ 88%                                 │
│  Agreement:  3/3 models agree                               │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  PRIMARY CAUSE                                              │
│  Door zone sensor misalignment (F505 = door zone fault)     │
│                                                             │
│  SUPPORTING EVIDENCE                                        │
│  • F505 is KONE's door zone sensor fault code               │
│  • Humidity can cause sensor drift on optical sensors       │
│  • Similar issue resolved on this unit 8 months ago         │
│  • Affects all floors = controller-side, not floor-specific │
│                                                             │
│  RECOMMENDED ACTIONS                                        │
│  1. Check door zone sensor alignment (both doors)           │
│  2. Clean sensor lenses (humidity/condensation)             │
│  3. Verify wiring connections at controller                 │
│  4. Check sensor mounting for vibration loosening           │
│                                                             │
│  SUGGESTED PARTS (if needed)                                │
│  □ Door zone sensor (P/N: KM-DZS-001)      $85.00          │
│  □ Sensor mounting bracket (P/N: KM-SMB-01) $25.00         │
│                                                             │
│  Estimated repair time: 30-45 minutes                       │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  📚 Sources:                                                │
│  • KONE Technical Manual KTM-500 (Section 4.3)              │
│  • Work Order WO-2024-000456 (Mar 2024, same unit)          │
│  • KONE Service Bulletin SB-2023-089                        │
│                                                             │
│  [ Accept ]  [ View Alternatives ]  [ Override ]            │
└─────────────────────────────────────────────────────────────┘
```

---

## Confidence Levels

| Score | Meaning | What You See |
|-------|---------|--------------|
| **95%+** | Very confident (unanimous agreement) | Single clear recommendation |
| **80-95%** | Confident (strong consensus) | Primary + minor alternatives |
| **60-80%** | Moderate (partial agreement) | Multiple options, ranked |
| **<60%** | Uncertain (disagreement) | AI asks clarifying questions |

### High Confidence (95%+)

```
┌─────────────────────────────────────────────────────────────┐
│  🤖 AI Diagnosis                                            │
│                                                             │
│  Confidence: ██████████ 97%                                 │
│  Agreement:  3/3 models strongly agree                      │
│                                                             │
│  DIAGNOSIS: Door motor failure (E15 fault)                  │
│                                                             │
│  This is a well-documented failure mode with clear          │
│  diagnostic criteria. All evidence points to motor          │
│  replacement required.                                      │
│                                                             │
│  [ Accept ]                                                  │
└─────────────────────────────────────────────────────────────┘
```

### Moderate Confidence (60-80%)

```
┌─────────────────────────────────────────────────────────────┐
│  🤖 AI Diagnosis                                            │
│                                                             │
│  Confidence: ██████░░░░ 68%                                 │
│  Agreement:  2/3 models agree (1 dissenting)                │
│                                                             │
│  POSSIBLE CAUSES (ranked):                                  │
│                                                             │
│  1. Door operator belt worn (2 models, 68%)                 │
│     └── Matches scraping noise symptom                      │
│                                                             │
│  2. Door roller wear (1 model, 32%)                         │
│     └── Alternative explanation for noise                   │
│                                                             │
│  RECOMMENDATION: Inspect both belt and rollers on-site      │
│                                                             │
│  [ Accept #1 ]  [ Accept #2 ]  [ Investigate Both ]        │
└─────────────────────────────────────────────────────────────┘
```

### Low Confidence (<60%)

```
┌─────────────────────────────────────────────────────────────┐
│  🤔 Need More Information                                   │
│                                                             │
│  Confidence: ████░░░░░░ 42%                                 │
│  Agreement:  3/3 models disagree                            │
│                                                             │
│  The symptoms could indicate multiple issues.               │
│  To improve diagnosis accuracy:                             │
│                                                             │
│  1. Is there a fault code displayed?                        │
│     ○ Yes: ________  ○ No  ○ Not sure                       │
│                                                             │
│  2. Does the issue occur on specific floors?                │
│     ○ All floors  ○ Specific floors: ________               │
│                                                             │
│  3. When did this start?                                    │
│     ○ Suddenly  ○ Gradually  ○ After maintenance            │
│                                                             │
│  4. Any recent changes to the building?                     │
│     ○ Construction  ○ Weather  ○ Power issues  ○ None       │
│                                                             │
│  [ Submit Answers ]  [ Skip - Proceed Without AI ]          │
└─────────────────────────────────────────────────────────────┘
```

---

## Manual Override

Sometimes you know better than the AI. Here's how to override and help the system learn.

### When to Override

- You have firsthand knowledge of this specific equipment
- You've seen this exact problem before with a different cause
- The AI is missing context (recent modifications, known issues)
- Environmental factors AI can't know about

### How to Override

Click **Override** on the diagnosis:

```
┌─────────────────────────────────────────────────────────────┐
│  Override AI Diagnosis                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  AI suggested: Door zone sensor misalignment (88%)          │
│                                                             │
│  Your diagnosis:                                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Controller board moisture damage. Building had         │  │
│  │ flooding last week and machine room was affected.     │  │
│  │ Sensors tested OK - issue is at controller.           │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Why is AI wrong? (helps improve future accuracy)           │
│  ○ Missing context (building conditions, recent events)     │
│  ○ Equipment-specific quirk AI doesn't know                 │
│  ○ Symptom interpretation was incorrect                     │
│  ● Other: [Recent flooding damaged controller   ]          │
│                                                             │
│  ☑ Save this as equipment-specific knowledge               │
│    (AI will consider this for future diagnoses)             │
│                                                             │
│  [ Cancel ]  [ Submit Override ]                            │
└─────────────────────────────────────────────────────────────┘
```

### Override Impact

When you override:
1. Your diagnosis replaces AI suggestion on this work order
2. Feedback is logged for AI training
3. If you check "Save as equipment-specific knowledge," future diagnoses for this equipment will consider your input

---

## Diagnosis History & Patterns

AI learns from your building's history.

### Viewing History

From any asset, click **Diagnosis History**:

```
┌─────────────────────────────────────────────────────────────┐
│  Lift 1 - Diagnosis History                                 │
│  KONE MonoSpace 500 | Collins Place Tower 1                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PATTERN DETECTED                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚠ Door sensor issues spike during high humidity     │   │
│  │                                                      │   │
│  │   Jun 2024: F505 fault (humidity 85%)               │   │
│  │   Jan 2024: F505 fault (humidity 82%)               │   │
│  │   Aug 2023: F505 fault (humidity 89%)               │   │
│  │                                                      │   │
│  │   Recommendation: Consider sensor upgrade or         │   │
│  │   dehumidifier in machine room                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  RECENT DIAGNOSES                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Dec 2024  │ F505 Door zone fault                    │   │
│  │           │ AI: 88% → Actual: Sensor alignment      │   │
│  │           │ Status: ✓ Correct                       │   │
│  ├───────────┼─────────────────────────────────────────┤   │
│  │ Oct 2024  │ E15 Door motor fault                    │   │
│  │           │ AI: 92% → Actual: Motor replaced        │   │
│  │           │ Status: ✓ Correct                       │   │
│  ├───────────┼─────────────────────────────────────────┤   │
│  │ Aug 2024  │ Intermittent stopping                   │   │
│  │           │ AI: 71% → Actual: Overridden (VFD)      │   │
│  │           │ Status: ✗ AI incorrect                  │   │
│  └───────────┴─────────────────────────────────────────┘   │
│                                                             │
│  AI ACCURACY FOR THIS ASSET: 87% (26/30 correct)            │
│                                                             │
│  KNOWN QUIRKS (AI-learned)                                  │
│  • Door B-side sensor requires recalibration every 6 months │
│  • Controller reboot clears E15 if persists after clearing  │
│  • Load weighing reads 5% high - compensation applied       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Cross-Asset Patterns

AI identifies patterns across your portfolio:

```
┌─────────────────────────────────────────────────────────────┐
│  Portfolio Insights - December 2024                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔍 DETECTED PATTERNS                                       │
│                                                             │
│  1. KONE MonoSpace door issues (3 sites)                    │
│     ├── Collins Place T1: F505 (Dec 2)                     │
│     ├── Riverside Towers: F505 (Nov 28)                    │
│     └── Metro Centre: F505 (Dec 1)                         │
│                                                             │
│     Common factor: All installed 2015-2016                  │
│     Recommendation: Schedule preventive door service        │
│                                                             │
│  2. Hydraulic oil temperature warnings (2 sites)            │
│     ├── Parkview: High temp alarm (Nov 30)                 │
│     └── Gateway: High temp alarm (Dec 3)                   │
│                                                             │
│     Common factor: Summer heat wave                         │
│     Recommendation: Check cooling systems                   │
│                                                             │
│  [ View Full Report ]  [ Export ]                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Feedback Loop

Help AI improve by providing feedback after each job.

### Post-Completion Feedback

When completing a work order:

```
┌─────────────────────────────────────────────────────────────┐
│  AI Diagnosis Feedback                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  AI diagnosed: Door zone sensor misalignment (88%)          │
│                                                             │
│  Was the AI diagnosis correct?                              │
│                                                             │
│  ● Yes, exactly right                                       │
│  ○ Partially correct (root cause was right, details off)    │
│  ○ Related but not quite (pointed in right direction)       │
│  ○ No, completely wrong                                     │
│                                                             │
│  What was the actual cause?                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Door zone sensor was misaligned as AI suggested.      │  │
│  │ Realigned and tested OK.                              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Were the suggested parts needed?                           │
│  ☐ Door zone sensor - Not needed (reused existing)         │
│  ☐ Sensor mounting bracket - Not needed                    │
│                                                             │
│  Actual repair time: [35        ] minutes                   │
│  (AI estimated: 30-45 minutes)                              │
│                                                             │
│  [ Submit Feedback ]                                        │
└─────────────────────────────────────────────────────────────┘
```

### Feedback Impact

| Your Feedback | AI Learning |
|---------------|-------------|
| "Exactly right" | Reinforces this diagnosis pattern |
| "Partially correct" | Adjusts confidence weighting |
| "Related but not quite" | Adds alternative consideration |
| "Completely wrong" | Flags for review, adjusts model weights |

### Accuracy Tracking

View AI accuracy over time:

```
┌─────────────────────────────────────────────────────────────┐
│  AI Accuracy Dashboard                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Overall Accuracy: 84% (168/200 diagnoses correct)          │
│                                                             │
│  By Trade:                                                  │
│  ├── Lifts:      87% ████████▓░ (145/167)                  │
│  ├── HVAC:       78% ███████▓░░ (18/23)                    │
│  └── Electrical: 75% ███████░░░ (5/10)                     │
│                                                             │
│  By Confidence Level:                                       │
│  ├── 90%+ conf:  94% correct                               │
│  ├── 80-90%:     85% correct                               │
│  ├── 70-80%:     71% correct                               │
│  └── <70%:       58% correct                               │
│                                                             │
│  Trend: ↑ 3% improvement over last 3 months                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Trade-Specific Knowledge

Triforce AI has specialized knowledge per trade:

### Lifts & Escalators
- Fault code databases (KONE, Otis, Schindler, ThyssenKrupp, Mitsubishi)
- Door system diagnostics (operators, sensors, interlocks)
- Drive system analysis (VFD, motor, encoder)
- Safety circuit troubleshooting (governors, safeties, buffers)
- Controller-specific patterns

### HVAC
- Refrigeration cycle analysis
- Airflow and ductwork diagnostics
- Energy efficiency patterns
- Compressor fault analysis
- BMS integration issues

### Electrical
- Power distribution issues
- Protection coordination
- Emergency system faults
- Power quality analysis
- Switchboard diagnostics

### Fire Systems
- Detection system analysis
- AS 1851 compliance requirements
- Suppression system checks
- Alarm panel diagnostics
- Integration with BMS

---

## Limitations & Edge Cases

### When AI Works Best

| Scenario | AI Performance |
|----------|----------------|
| Common fault codes | Excellent (95%+) |
| Well-documented symptoms | Very good (85%+) |
| Equipment with service history | Good (80%+) |
| Pattern matches across portfolio | Very good (85%+) |

### When AI Struggles

| Scenario | Why | What To Do |
|----------|-----|------------|
| **Brand new equipment** | No history to learn from | Rely on manufacturer docs |
| **Custom/modified equipment** | Non-standard configurations | Provide detailed context |
| **Intermittent issues** | Inconsistent symptoms | Include frequency, conditions |
| **Multiple simultaneous faults** | Confounding symptoms | Isolate and diagnose separately |
| **Environmental factors** | AI can't observe site | Describe conditions explicitly |
| **Recent modifications** | AI doesn't know changes | Include modification history |

### Known Limitations

1. **Cannot see your equipment** — AI works from descriptions, not visual inspection
2. **Knowledge cutoff** — Very new equipment models may not be in training data
3. **Local regulations** — May not know jurisdiction-specific requirements
4. **Custom installations** — Non-standard setups need explicit description
5. **Environmental context** — Weather, building events, power quality need manual input

### Handling Edge Cases

**Equipment AI Doesn't Recognize:**
```
┌─────────────────────────────────────────────────────────────┐
│  ⚠ Limited AI Support                                      │
│                                                             │
│  This equipment model (XYZ Custom 2024) is not in our       │
│  knowledge base. AI diagnosis will be limited to:           │
│                                                             │
│  • General symptom analysis                                 │
│  • Cross-reference with similar equipment                   │
│  • Pattern matching from your service history               │
│                                                             │
│  For best results:                                          │
│  • Upload equipment manual (PDF)                            │
│  • Add manufacturer fault code list                         │
│  • Describe symptoms in detail                              │
│                                                             │
│  [ Continue with Limited AI ]  [ Skip AI Diagnosis ]        │
└─────────────────────────────────────────────────────────────┘
```

**Multiple Fault Codes:**
```
┌─────────────────────────────────────────────────────────────┐
│  🤖 Multiple Faults Detected                               │
│                                                             │
│  You've reported 3 fault codes: E15, F505, A22              │
│                                                             │
│  AI will analyze each separately:                           │
│                                                             │
│  1. E15 (Door motor) - Primary (likely root cause)          │
│  2. F505 (Door zone) - Secondary (may be consequential)     │
│  3. A22 (General alarm) - Tertiary (symptom, not cause)     │
│                                                             │
│  Recommendation: Address E15 first. F505 and A22 may        │
│  resolve automatically.                                     │
│                                                             │
│  [ View E15 Diagnosis ]                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Tips for Better Diagnoses

### Do Provide

- **Fault codes** — Exact codes from equipment panel
- **Timing** — When did it start? How often?
- **Conditions** — Weather, time of day, load conditions
- **History** — "This happened before" or "First time"
- **Observations** — Sounds, smells, visual clues
- **Recent changes** — Modifications, repairs, environmental

### Don't Provide

- **Vague descriptions** — "It's not working right"
- **Assumptions** — Let AI diagnose, don't lead it
- **Irrelevant details** — Focus on the fault

### Example: Good vs. Bad

**Bad:**
> "Lift broken"

**Good:**
> "KONE MonoSpace Lift 1 showing F505 intermittently since Monday morning. Doors hesitate 2-3 seconds before closing on all floors. Weather has been humid (85%+). Last service was routine PM 3 weeks ago - no issues found then. Similar problem occurred last January during humid spell."

---

## Settings

### AI Diagnosis Preferences

Navigate to **Settings > AI Diagnosis**:

```
┌─────────────────────────────────────────────────────────────┐
│  AI Diagnosis Settings                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Auto-Diagnosis:                                            │
│  ☑ Automatically run AI diagnosis on new work orders        │
│  ☐ Only when fault code is provided                         │
│  ☐ Never (manual only)                                      │
│                                                             │
│  Confidence Threshold:                                      │
│  Show diagnosis only when confidence is above:              │
│  [ 60% ▼ ]                                                  │
│                                                             │
│  Parts Suggestions:                                         │
│  ☑ Include suggested parts with diagnosis                   │
│  ☑ Show pricing for suggested parts                         │
│  ☐ Auto-reserve parts from inventory                        │
│                                                             │
│  Learning:                                                  │
│  ☑ Use my feedback to improve AI accuracy                   │
│  ☑ Share anonymized patterns with industry (helps others)   │
│                                                             │
│  [ Save Settings ]                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### AI Diagnosis Not Appearing

**Problem**: Clicked "Get AI Diagnosis" but nothing happened

**Solutions**:
1. Check internet connection
2. Ensure description is not empty
3. Wait 10-15 seconds (AI needs time)
4. Refresh and try again
5. Check if AI is enabled in settings

### Low Confidence on Simple Issue

**Problem**: AI shows low confidence for a common fault

**Solutions**:
1. Add the fault code if you have it
2. Provide more specific symptoms
3. Mention equipment manufacturer and model
4. Check if this equipment has service history

### AI Suggesting Wrong Parts

**Problem**: Suggested parts don't match equipment

**Solutions**:
1. Verify equipment manufacturer/model is correct in asset record
2. Override with correct parts
3. Report feedback so AI learns

---

## Related Guides

- [Triforce AI Architecture](../explanation/triforce-ai.md) — Technical deep-dive
- [Work Orders](work-orders.md) — Create jobs with diagnoses
- [Add Assets](add-assets.md) — Complete asset profiles for better AI
- [Data Model](../reference/data-model.md) — AI-related fields

---

**[← Back to Work Orders](work-orders.md)** | **[Back to Quick Start](quick-start.md)**
