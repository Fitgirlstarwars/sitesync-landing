<!--
---
title: Triforce AI System
description: Multi-model AI architecture for fault diagnosis and intelligent automation
version: 3.0.0
last_updated: 2025-12
status: stable
implementation_status: design
audience: developer, ai_assistant
prerequisites:
  - Understanding of LLMs
  - Basic async Python knowledge
related_docs:
  - /docs/GLOSSARY.md (AI terminology)
  - /docs/reference/data-model.md (DiagnosisResult schema)
  - /AI_CONTEXT.md (system overview)
---
-->

# SiteSync V3 - Triforce AI System

## Multi-Model AI Architecture

> This document describes the Triforce AI system - SiteSync's multi-model approach to AI-assisted diagnosis, knowledge retrieval, and intelligent automation.

## What is Triforce?

Triforce is a multi-model AI system that:
1. Queries multiple LLMs in parallel (Gemini, Claude, GPT-4)
2. Aggregates responses using consensus voting
3. Validates answers against a knowledge base
4. Produces structured, type-safe outputs

**Key Principle**: Multiple models catch each other's mistakes, producing more reliable results than any single model.

---

## Architecture Overview

```
TRIFORCE AI ARCHITECTURE
══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                         TRIFORCE V3                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────┐   ┌───────────┐   ┌───────────┐                  │
│  │  Gemini   │   │  Claude   │   │   GPT-4   │  ← JURY          │
│  │  2.0 Pro  │   │  Sonnet   │   │   Turbo   │    (Parallel)    │
│  └─────┬─────┘   └─────┬─────┘   └─────┬─────┘                  │
│        │               │               │                         │
│        └───────────────┼───────────────┘                         │
│                        ▼                                         │
│              ┌─────────────────┐                                 │
│              │    CONSENSUS    │  ← Weighted voting              │
│              │     ENGINE      │                                 │
│              └────────┬────────┘                                 │
│                       ▼                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    WITNESS (Validation)                  │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │    │
│  │  │ Knowledge    │  │ Hybrid       │  │ Tool Result  │   │    │
│  │  │ Base         │  │ Search       │  │ Verification │   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │    │
│  └──────────────────────────┬──────────────────────────────┘    │
│                             ▼                                    │
│              ┌─────────────────────────┐                         │
│              │         JUDGE           │  ← Final synthesis      │
│              │   (Claude Opus 4.5)     │    with skills          │
│              └─────────────────────────┘                         │
│                             │                                    │
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 HIERARCHICAL MEMORY                      │    │
│  │  ┌───────────┐  ┌───────────┐  ┌────────────┐           │    │
│  │  │ Episodic  │  │ Semantic  │  │ Procedural │           │    │
│  │  │ (Tasks)   │  │ (Facts)   │  │ (Skills)   │           │    │
│  │  └───────────┘  └───────────┘  └────────────┘           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

══════════════════════════════════════════════════════════════════
```

---

## Core Components

### 1. Jury System

The jury consists of multiple LLMs that evaluate problems in parallel, providing diverse perspectives.

```python
# sitesync_v3/core/triforce/jury.py

from dataclasses import dataclass
from enum import Enum
from typing import Protocol
import asyncio

class JuryModel(str, Enum):
    GEMINI_PRO = "gemini-2.0-pro"
    CLAUDE_SONNET = "claude-sonnet-4-20250514"
    GPT4_TURBO = "gpt-4-turbo"

@dataclass
class JuryResponse:
    """Response from a single jury member."""
    model: JuryModel
    answer: str
    confidence: float  # 0.0 - 1.0
    reasoning: str
    sources: list[str]
    latency_ms: int

class JuryMember(Protocol):
    """Protocol for jury member implementations."""

    async def evaluate(
        self,
        prompt: str,
        context: dict,
    ) -> JuryResponse:
        """Evaluate a prompt and return response."""
        ...

class Jury:
    """Multi-model jury for parallel evaluation."""

    def __init__(
        self,
        members: list[JuryMember],
        timeout_seconds: float = 30.0,
    ):
        self.members = members
        self.timeout = timeout_seconds

    async def deliberate(
        self,
        prompt: str,
        context: dict,
    ) -> list[JuryResponse]:
        """
        Run all jury members in parallel.

        Returns list of responses from each member.
        Handles timeouts and failures gracefully.
        """
        tasks = [
            asyncio.wait_for(
                member.evaluate(prompt, context),
                timeout=self.timeout
            )
            for member in self.members
        ]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        responses = []
        for result in results:
            if isinstance(result, JuryResponse):
                responses.append(result)
            # Log failures but continue with available responses

        return responses
```

### 2. Consensus Engine

The consensus engine aggregates jury responses using configurable voting strategies.

```python
# sitesync_v3/core/triforce/consensus.py

from dataclasses import dataclass
from enum import Enum
from collections import Counter

class VotingStrategy(str, Enum):
    MAJORITY = "majority"          # Most common answer wins
    WEIGHTED = "weighted"          # Factor in confidence scores
    UNANIMOUS = "unanimous"        # All must agree
    QUORUM = "quorum"              # N of M must agree

@dataclass
class ConsensusResult:
    """Result of consensus voting."""
    answer: str
    confidence: float
    agreement_rate: float
    strategy_used: VotingStrategy
    supporting_responses: list[JuryResponse]
    dissenting_responses: list[JuryResponse]

class ConsensusEngine:
    """Aggregate jury responses through voting."""

    # Default weights by model (can be tuned based on performance)
    DEFAULT_WEIGHTS = {
        JuryModel.GEMINI_PRO: 1.0,
        JuryModel.CLAUDE_SONNET: 1.2,  # Slightly higher for reasoning
        JuryModel.GPT4_TURBO: 1.0,
    }

    def __init__(
        self,
        strategy: VotingStrategy = VotingStrategy.WEIGHTED,
        weights: dict[JuryModel, float] | None = None,
        quorum_threshold: int = 2,
    ):
        self.strategy = strategy
        self.weights = weights or self.DEFAULT_WEIGHTS
        self.quorum_threshold = quorum_threshold

    def vote(
        self,
        responses: list[JuryResponse],
    ) -> ConsensusResult:
        """
        Aggregate responses using configured strategy.
        """
        if not responses:
            raise ValueError("No responses to vote on")

        if self.strategy == VotingStrategy.MAJORITY:
            return self._majority_vote(responses)
        elif self.strategy == VotingStrategy.WEIGHTED:
            return self._weighted_vote(responses)
        elif self.strategy == VotingStrategy.UNANIMOUS:
            return self._unanimous_vote(responses)
        elif self.strategy == VotingStrategy.QUORUM:
            return self._quorum_vote(responses)
        else:
            raise ValueError(f"Unknown strategy: {self.strategy}")

    def _weighted_vote(
        self,
        responses: list[JuryResponse],
    ) -> ConsensusResult:
        """
        Weighted voting based on model weights and confidence.
        """
        # Calculate weighted scores for each unique answer
        answer_scores: dict[str, float] = {}
        answer_responses: dict[str, list[JuryResponse]] = {}

        for response in responses:
            weight = self.weights.get(response.model, 1.0)
            score = weight * response.confidence

            if response.answer not in answer_scores:
                answer_scores[response.answer] = 0
                answer_responses[response.answer] = []

            answer_scores[response.answer] += score
            answer_responses[response.answer].append(response)

        # Find winning answer
        winning_answer = max(answer_scores, key=answer_scores.get)
        total_score = sum(answer_scores.values())

        supporting = answer_responses[winning_answer]
        dissenting = [
            r for r in responses
            if r.answer != winning_answer
        ]

        return ConsensusResult(
            answer=winning_answer,
            confidence=answer_scores[winning_answer] / total_score,
            agreement_rate=len(supporting) / len(responses),
            strategy_used=VotingStrategy.WEIGHTED,
            supporting_responses=supporting,
            dissenting_responses=dissenting,
        )

    def _majority_vote(
        self,
        responses: list[JuryResponse],
    ) -> ConsensusResult:
        """Simple majority voting."""
        answers = [r.answer for r in responses]
        counter = Counter(answers)
        winning_answer, count = counter.most_common(1)[0]

        supporting = [r for r in responses if r.answer == winning_answer]
        dissenting = [r for r in responses if r.answer != winning_answer]

        avg_confidence = sum(r.confidence for r in supporting) / len(supporting)

        return ConsensusResult(
            answer=winning_answer,
            confidence=avg_confidence,
            agreement_rate=count / len(responses),
            strategy_used=VotingStrategy.MAJORITY,
            supporting_responses=supporting,
            dissenting_responses=dissenting,
        )

    def _unanimous_vote(
        self,
        responses: list[JuryResponse],
    ) -> ConsensusResult:
        """Require unanimous agreement."""
        answers = set(r.answer for r in responses)

        if len(answers) == 1:
            answer = answers.pop()
            avg_confidence = sum(r.confidence for r in responses) / len(responses)
            return ConsensusResult(
                answer=answer,
                confidence=avg_confidence,
                agreement_rate=1.0,
                strategy_used=VotingStrategy.UNANIMOUS,
                supporting_responses=responses,
                dissenting_responses=[],
            )
        else:
            # No consensus - fall back to weighted
            return self._weighted_vote(responses)

    def _quorum_vote(
        self,
        responses: list[JuryResponse],
    ) -> ConsensusResult:
        """Require quorum threshold agreement."""
        answers = [r.answer for r in responses]
        counter = Counter(answers)
        winning_answer, count = counter.most_common(1)[0]

        if count >= self.quorum_threshold:
            supporting = [r for r in responses if r.answer == winning_answer]
            dissenting = [r for r in responses if r.answer != winning_answer]
            avg_confidence = sum(r.confidence for r in supporting) / len(supporting)

            return ConsensusResult(
                answer=winning_answer,
                confidence=avg_confidence,
                agreement_rate=count / len(responses),
                strategy_used=VotingStrategy.QUORUM,
                supporting_responses=supporting,
                dissenting_responses=dissenting,
            )
        else:
            # Quorum not met - fall back to weighted
            return self._weighted_vote(responses)
```

### 3. Witness Layer (Validation)

The witness layer validates and enriches jury responses with factual data.

```python
# sitesync_v3/core/triforce/witness.py

from dataclasses import dataclass
from typing import Protocol

@dataclass
class ValidationResult:
    """Result of witness validation."""
    is_valid: bool
    confidence_adjustment: float  # -1.0 to +1.0
    supporting_evidence: list[str]
    contradicting_evidence: list[str]
    enrichment_data: dict

class Witness(Protocol):
    """Protocol for witness implementations."""

    async def validate(
        self,
        claim: str,
        context: dict,
    ) -> ValidationResult:
        """Validate a claim against known data."""
        ...

class KnowledgeBaseWitness:
    """Validates against the knowledge base."""

    def __init__(self, knowledge_service):
        self.knowledge = knowledge_service

    async def validate(
        self,
        claim: str,
        context: dict,
    ) -> ValidationResult:
        """
        Search knowledge base for supporting or
        contradicting information.
        """
        # Search for relevant knowledge
        results = await self.knowledge.search(
            query=claim,
            equipment_type=context.get("equipment_type"),
            limit=10,
        )

        supporting = []
        contradicting = []

        for result in results:
            # Analyze if result supports or contradicts claim
            # This would use embedding similarity or another LLM
            if result.relevance_score > 0.8:
                supporting.append(result.content)

        confidence_adj = len(supporting) * 0.05 - len(contradicting) * 0.1

        return ValidationResult(
            is_valid=len(contradicting) == 0,
            confidence_adjustment=max(-0.5, min(0.5, confidence_adj)),
            supporting_evidence=supporting,
            contradicting_evidence=contradicting,
            enrichment_data={
                "related_fault_codes": [r.fault_code for r in results if r.fault_code],
                "related_procedures": [r.procedure_id for r in results if r.procedure_id],
            },
        )

class HybridSearchWitness:
    """Validates using hybrid search (vector + keyword)."""

    def __init__(self, search_service):
        self.search = search_service

    async def validate(
        self,
        claim: str,
        context: dict,
    ) -> ValidationResult:
        """
        Use hybrid search to find supporting documents.
        """
        results = await self.search.hybrid_search(
            query=claim,
            filters=context,
        )

        # Extract relevant evidence
        supporting = [
            r.snippet for r in results
            if r.relevance > 0.7
        ]

        return ValidationResult(
            is_valid=True,
            confidence_adjustment=0.1 if supporting else 0,
            supporting_evidence=supporting[:5],
            contradicting_evidence=[],
            enrichment_data={
                "document_references": [r.document_id for r in results[:5]],
            },
        )

class WitnessPanel:
    """Coordinates multiple witnesses."""

    def __init__(self, witnesses: list[Witness]):
        self.witnesses = witnesses

    async def validate_all(
        self,
        claim: str,
        context: dict,
    ) -> list[ValidationResult]:
        """Run all witnesses in parallel."""
        tasks = [
            witness.validate(claim, context)
            for witness in self.witnesses
        ]
        return await asyncio.gather(*tasks)

    def aggregate_validations(
        self,
        results: list[ValidationResult],
    ) -> ValidationResult:
        """Combine validation results."""
        all_supporting = []
        all_contradicting = []
        total_adjustment = 0
        all_enrichment = {}

        for result in results:
            all_supporting.extend(result.supporting_evidence)
            all_contradicting.extend(result.contradicting_evidence)
            total_adjustment += result.confidence_adjustment
            all_enrichment.update(result.enrichment_data)

        return ValidationResult(
            is_valid=len(all_contradicting) == 0,
            confidence_adjustment=total_adjustment / len(results),
            supporting_evidence=all_supporting,
            contradicting_evidence=all_contradicting,
            enrichment_data=all_enrichment,
        )
```

### 4. Judge (Final Synthesis)

The judge makes the final decision, incorporating jury consensus and witness validation.

```python
# sitesync_v3/core/triforce/judge.py

from pydantic import BaseModel
from pydantic_ai import Agent

class DiagnosisOutput(BaseModel):
    """Structured output for diagnosis."""
    fault_code: str
    severity: str  # 'critical', 'high', 'medium', 'low'
    primary_cause: str
    secondary_causes: list[str]
    recommended_actions: list[str]
    parts_needed: list[str]
    estimated_repair_time_minutes: int
    confidence: float
    reasoning: str

class Judge:
    """Final synthesis and decision making."""

    def __init__(self):
        self.agent = Agent(
            'claude-opus-4-5-20251101',
            result_type=DiagnosisOutput,
            system_prompt=self._build_system_prompt(),
        )

    def _build_system_prompt(self) -> str:
        return """
You are the final judge in an AI diagnosis system for elevator faults.

You receive:
1. A consensus from multiple AI models (the "jury")
2. Validation results from knowledge base searches (the "witnesses")
3. Equipment context and history

Your job is to synthesize all inputs and provide the final diagnosis.

Guidelines:
- If jury and witnesses agree, be confident
- If they disagree, explain the uncertainty
- Always consider equipment-specific quirks
- Prioritize safety-critical issues
- Recommend the minimum necessary actions

Output must be structured and actionable.
"""

    async def decide(
        self,
        consensus: ConsensusResult,
        validation: ValidationResult,
        context: dict,
    ) -> DiagnosisOutput:
        """
        Make final diagnosis decision.
        """
        prompt = self._build_prompt(consensus, validation, context)
        result = await self.agent.run(prompt)
        return result.data

    def _build_prompt(
        self,
        consensus: ConsensusResult,
        validation: ValidationResult,
        context: dict,
    ) -> str:
        return f"""
## Jury Consensus
Answer: {consensus.answer}
Confidence: {consensus.confidence:.0%}
Agreement: {consensus.agreement_rate:.0%}

## Supporting Evidence
{chr(10).join(f'- {e}' for e in validation.supporting_evidence[:5])}

## Equipment Context
Manufacturer: {context.get('manufacturer', 'Unknown')}
Model: {context.get('model', 'Unknown')}
Age: {context.get('age_years', 'Unknown')} years
Known Quirks: {', '.join(context.get('known_quirks', []))}

## Reported Symptoms
{context.get('symptoms', 'No symptoms reported')}

## Fault Code
{context.get('fault_code', 'No fault code')}

Please provide your final diagnosis.
"""
```

---

## Hierarchical Memory

### Memory Architecture

```python
# sitesync_v3/core/triforce/memory.py

from dataclasses import dataclass
from datetime import datetime
from typing import Protocol
from uuid import UUID

@dataclass
class MemoryEntry:
    """A single memory entry."""
    id: UUID
    content: str
    memory_type: str  # 'episodic', 'semantic', 'procedural'
    relevance_score: float
    created_at: datetime
    last_accessed: datetime
    access_count: int
    metadata: dict

class MemoryStore(Protocol):
    """Protocol for memory storage."""

    async def store(self, entry: MemoryEntry) -> None: ...
    async def retrieve(self, query: str, limit: int) -> list[MemoryEntry]: ...
    async def update_access(self, entry_id: UUID) -> None: ...

class EpisodicMemory:
    """
    Task-specific, short-term memory.

    Stores recent interactions, current task context,
    and temporary working memory.

    Examples:
    - "Last time with this KONE unit, F505 was humidity-related"
    - "User prefers brief responses"
    - "Current task: diagnose door fault on Lift 2"
    """

    def __init__(self, store: MemoryStore):
        self.store = store

    async def remember_task(
        self,
        task_id: UUID,
        context: dict,
    ) -> None:
        """Store task-specific memory."""
        entry = MemoryEntry(
            id=UUID(),
            content=str(context),
            memory_type="episodic",
            relevance_score=1.0,
            created_at=datetime.now(),
            last_accessed=datetime.now(),
            access_count=1,
            metadata={"task_id": str(task_id)},
        )
        await self.store.store(entry)

    async def recall_similar_tasks(
        self,
        query: str,
        limit: int = 5,
    ) -> list[MemoryEntry]:
        """Retrieve similar past tasks."""
        return await self.store.retrieve(query, limit)

class SemanticMemory:
    """
    Factual, long-term knowledge.

    Stores facts, definitions, and learned information
    that persists across sessions.

    Examples:
    - "F505 means door zone fault"
    - "KONE MonoSpace uses EcoDisc drive"
    - "Standard door close time is 3.5 seconds"
    """

    def __init__(self, store: MemoryStore):
        self.store = store

    async def learn_fact(
        self,
        fact: str,
        source: str,
        confidence: float,
    ) -> None:
        """Store a factual memory."""
        entry = MemoryEntry(
            id=UUID(),
            content=fact,
            memory_type="semantic",
            relevance_score=confidence,
            created_at=datetime.now(),
            last_accessed=datetime.now(),
            access_count=1,
            metadata={"source": source},
        )
        await self.store.store(entry)

    async def recall_facts(
        self,
        query: str,
        limit: int = 10,
    ) -> list[MemoryEntry]:
        """Retrieve relevant facts."""
        return await self.store.retrieve(query, limit)

class ProceduralMemory:
    """
    Skills and procedures.

    Stores how to do things - procedures, workflows,
    and learned skills.

    Examples:
    - "How to diagnose door faults step by step"
    - "Procedure for KONE controller reset"
    - "Best practices for safety circuit testing"
    """

    def __init__(self, store: MemoryStore):
        self.store = store

    async def learn_procedure(
        self,
        name: str,
        steps: list[str],
        equipment_type: str | None = None,
    ) -> None:
        """Store a procedure."""
        content = f"{name}\n" + "\n".join(f"{i+1}. {s}" for i, s in enumerate(steps))
        entry = MemoryEntry(
            id=UUID(),
            content=content,
            memory_type="procedural",
            relevance_score=1.0,
            created_at=datetime.now(),
            last_accessed=datetime.now(),
            access_count=1,
            metadata={
                "name": name,
                "equipment_type": equipment_type,
                "step_count": len(steps),
            },
        )
        await self.store.store(entry)

    async def recall_procedures(
        self,
        query: str,
        equipment_type: str | None = None,
        limit: int = 5,
    ) -> list[MemoryEntry]:
        """Retrieve relevant procedures."""
        # Filter by equipment type if specified
        return await self.store.retrieve(query, limit)

class HierarchicalMemory:
    """
    Unified interface to all memory types.
    """

    def __init__(
        self,
        episodic: EpisodicMemory,
        semantic: SemanticMemory,
        procedural: ProceduralMemory,
    ):
        self.episodic = episodic
        self.semantic = semantic
        self.procedural = procedural

    async def recall(
        self,
        query: str,
        memory_types: list[str] | None = None,
        limit_per_type: int = 5,
    ) -> dict[str, list[MemoryEntry]]:
        """
        Recall relevant memories from specified types.
        """
        types = memory_types or ["episodic", "semantic", "procedural"]
        results = {}

        if "episodic" in types:
            results["episodic"] = await self.episodic.recall_similar_tasks(
                query, limit_per_type
            )
        if "semantic" in types:
            results["semantic"] = await self.semantic.recall_facts(
                query, limit_per_type
            )
        if "procedural" in types:
            results["procedural"] = await self.procedural.recall_procedures(
                query, limit=limit_per_type
            )

        return results

    async def consolidate(self) -> None:
        """
        Memory consolidation - move short-term to long-term.

        Called during idle periods to:
        - Promote frequently accessed episodic to semantic
        - Update relevance scores
        - Prune rarely used memories
        """
        # Implementation depends on storage backend
        pass
```

---

## Skills Manager

### Dynamic Skill Loading

```python
# sitesync_v3/core/triforce/skills.py

from dataclasses import dataclass
from pathlib import Path
import yaml

@dataclass
class Skill:
    """A loadable skill definition."""
    name: str
    description: str
    prompt_template: str
    required_context: list[str]
    output_format: str
    examples: list[dict]

class SkillsManager:
    """Load and inject specialized skills."""

    def __init__(self, skills_dir: Path):
        self.skills_dir = skills_dir
        self._skills_cache: dict[str, Skill] = {}

    def load_skill(self, skill_name: str) -> Skill:
        """Load a skill definition from YAML."""
        if skill_name in self._skills_cache:
            return self._skills_cache[skill_name]

        skill_path = self.skills_dir / f"{skill_name}.yaml"
        if not skill_path.exists():
            raise ValueError(f"Skill not found: {skill_name}")

        with open(skill_path) as f:
            data = yaml.safe_load(f)

        skill = Skill(
            name=data["name"],
            description=data["description"],
            prompt_template=data["prompt_template"],
            required_context=data.get("required_context", []),
            output_format=data.get("output_format", "text"),
            examples=data.get("examples", []),
        )

        self._skills_cache[skill_name] = skill
        return skill

    def list_skills(self) -> list[str]:
        """List available skills."""
        return [
            p.stem for p in self.skills_dir.glob("*.yaml")
        ]

    def select_skills_for_task(
        self,
        task_type: str,
        equipment_type: str | None = None,
    ) -> list[Skill]:
        """
        Automatically select relevant skills for a task.
        """
        relevant_skills = []

        # Map task types to skills
        skill_mapping = {
            "diagnosis": ["fault_diagnosis", "safety_assessment"],
            "maintenance": ["maintenance_planning", "parts_identification"],
            "inspection": ["inspection_checklist", "compliance_check"],
            "report": ["report_generation", "summary_writing"],
        }

        skill_names = skill_mapping.get(task_type, [])

        # Add equipment-specific skills
        if equipment_type:
            equipment_skill = f"{equipment_type.lower()}_specialist"
            if (self.skills_dir / f"{equipment_skill}.yaml").exists():
                skill_names.append(equipment_skill)

        for name in skill_names:
            try:
                relevant_skills.append(self.load_skill(name))
            except ValueError:
                pass  # Skill not found, skip

        return relevant_skills

    def build_skill_prompt(
        self,
        skill: Skill,
        context: dict,
    ) -> str:
        """
        Build a prompt from skill template and context.
        """
        # Validate required context
        missing = [
            key for key in skill.required_context
            if key not in context
        ]
        if missing:
            raise ValueError(f"Missing context for skill: {missing}")

        # Format template
        prompt = skill.prompt_template.format(**context)

        # Add examples if available
        if skill.examples:
            examples_text = "\n\nExamples:\n"
            for ex in skill.examples[:3]:
                examples_text += f"\nInput: {ex['input']}\nOutput: {ex['output']}\n"
            prompt += examples_text

        return prompt
```

### Example Skill Definition

```yaml
# skills/fault_diagnosis.yaml
name: fault_diagnosis
description: Diagnose elevator faults from symptoms and fault codes

prompt_template: |
  You are an expert elevator fault diagnosis system.

  Equipment: {manufacturer} {model}
  Fault Code: {fault_code}
  Symptoms: {symptoms}
  Equipment Age: {age_years} years
  Known Quirks: {known_quirks}

  Based on this information, provide a diagnosis including:
  1. Most likely cause
  2. Secondary possible causes
  3. Recommended diagnostic steps
  4. Parts that may be needed
  5. Estimated repair time

required_context:
  - manufacturer
  - fault_code
  - symptoms

output_format: structured

examples:
  - input:
      manufacturer: KONE
      fault_code: F505
      symptoms: Door won't close, error on display
    output:
      primary_cause: Door zone sensor fault
      confidence: 0.85
      recommended_actions:
        - Check door zone sensor alignment
        - Test sensor output
        - Inspect wiring connections
```

---

## Pydantic AI Integration

### Structured Outputs

```python
# sitesync_v3/core/triforce/structured.py

from pydantic import BaseModel, Field
from pydantic_ai import Agent

class FaultDiagnosis(BaseModel):
    """Structured fault diagnosis output."""
    fault_code: str = Field(description="The fault code being diagnosed")
    severity: str = Field(description="critical, high, medium, or low")
    primary_cause: str = Field(description="Most likely cause of the fault")
    secondary_causes: list[str] = Field(description="Other possible causes")
    diagnostic_steps: list[str] = Field(description="Steps to confirm diagnosis")
    recommended_actions: list[str] = Field(description="Actions to resolve")
    parts_needed: list[str] = Field(description="Parts that may be required")
    estimated_time_minutes: int = Field(description="Estimated repair time")
    confidence: float = Field(ge=0, le=1, description="Confidence in diagnosis")
    safety_notes: list[str] = Field(description="Safety considerations")

class ReportContent(BaseModel):
    """Structured report output."""
    summary: str = Field(description="Brief summary of the work")
    work_performed: list[str] = Field(description="List of work items")
    parts_used: list[dict] = Field(description="Parts used with quantities")
    recommendations: list[str] = Field(description="Future recommendations")
    next_service_date: str | None = Field(description="Recommended next service")

# Create specialized agents
diagnosis_agent = Agent(
    'gemini-2.0-flash',
    result_type=FaultDiagnosis,
    system_prompt="""
You are an expert elevator fault diagnosis system.
Analyze the provided symptoms and fault code to determine
the most likely cause and recommended actions.
Always prioritize safety considerations.
"""
)

report_agent = Agent(
    'gemini-2.0-flash',
    result_type=ReportContent,
    system_prompt="""
You are a professional technical report writer.
Generate clear, concise service reports from work order data.
Use professional language appropriate for building managers.
"""
)
```

---

## Putting It All Together

### The Triforce Orchestrator

```python
# sitesync_v3/core/triforce/orchestrator.py

class TriforceOrchestrator:
    """
    Main orchestrator for the Triforce AI system.

    Coordinates jury, witnesses, judge, memory, and skills
    to produce high-quality AI outputs.
    """

    def __init__(
        self,
        jury: Jury,
        witness_panel: WitnessPanel,
        judge: Judge,
        memory: HierarchicalMemory,
        skills_manager: SkillsManager,
    ):
        self.jury = jury
        self.witnesses = witness_panel
        self.judge = judge
        self.memory = memory
        self.skills = skills_manager

    async def diagnose(
        self,
        fault_code: str,
        symptoms: list[str],
        equipment_context: dict,
    ) -> DiagnosisOutput:
        """
        Full diagnosis pipeline.
        """
        # 1. Recall relevant memories
        memories = await self.memory.recall(
            query=f"{fault_code} {' '.join(symptoms)}",
            memory_types=["semantic", "procedural", "episodic"],
        )

        # 2. Load relevant skills
        skills = self.skills.select_skills_for_task(
            task_type="diagnosis",
            equipment_type=equipment_context.get("manufacturer"),
        )

        # 3. Build context
        context = {
            **equipment_context,
            "fault_code": fault_code,
            "symptoms": symptoms,
            "relevant_facts": [m.content for m in memories.get("semantic", [])],
            "relevant_procedures": [m.content for m in memories.get("procedural", [])],
            "past_experiences": [m.content for m in memories.get("episodic", [])],
        }

        # 4. Jury deliberation
        prompt = self._build_diagnosis_prompt(context, skills)
        jury_responses = await self.jury.deliberate(prompt, context)

        # 5. Consensus voting
        consensus = ConsensusEngine(VotingStrategy.WEIGHTED).vote(jury_responses)

        # 6. Witness validation
        validations = await self.witnesses.validate_all(
            claim=consensus.answer,
            context=context,
        )
        aggregated_validation = self.witnesses.aggregate_validations(validations)

        # 7. Judge final decision
        result = await self.judge.decide(
            consensus=consensus,
            validation=aggregated_validation,
            context=context,
        )

        # 8. Store in episodic memory for future reference
        await self.memory.episodic.remember_task(
            task_id=UUID(),
            context={
                "fault_code": fault_code,
                "diagnosis": result.primary_cause,
                "confidence": result.confidence,
            },
        )

        return result

    def _build_diagnosis_prompt(
        self,
        context: dict,
        skills: list[Skill],
    ) -> str:
        """Build the diagnosis prompt with skills."""
        base_prompt = f"""
Diagnose the following elevator fault:

Fault Code: {context['fault_code']}
Symptoms: {', '.join(context['symptoms'])}
Equipment: {context.get('manufacturer', 'Unknown')} {context.get('model', '')}

Relevant Knowledge:
{chr(10).join(context.get('relevant_facts', [])[:5])}

Past Similar Cases:
{chr(10).join(context.get('past_experiences', [])[:3])}
"""

        # Add skill-specific instructions
        for skill in skills:
            base_prompt += f"\n\n{skill.prompt_template}"

        return base_prompt
```

---

## Usage Example

```python
# Example usage in a service

async def diagnose_fault(
    work_order: WorkOrder,
    elevator: Elevator,
) -> DiagnosisOutput:
    """
    Use Triforce to diagnose a fault.
    """
    triforce = get_triforce_orchestrator()  # Dependency injection

    result = await triforce.diagnose(
        fault_code=work_order.fault_code,
        symptoms=work_order.reported_symptoms,
        equipment_context={
            "manufacturer": elevator.manufacturer,
            "model": elevator.model,
            "controller_type": elevator.controller_type,
            "age_years": calculate_age(elevator.installation_date),
            "known_quirks": elevator.known_quirks,
        },
    )

    return result
```

---

**[← Back to Data Model](../reference/data-model.md)** | **[Next: API Reference →](../reference/api.md)**
