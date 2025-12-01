<!--
---
title: SiteSync Documentation Hub
description: Central documentation index for SiteSync V3
version: 3.0.0
last_updated: 2025-12
audience: all
related_docs:
  - /AI_CONTEXT.md (AI assistant quick start)
  - /CLAUDE_CODE_GUIDE.md (complete technical reference)
  - /llms.txt (documentation index for AI)
  - /docs/GLOSSARY.md (terminology definitions)
---
-->

# SiteSync Documentation

> **YOUR BUILDING. YOUR DATA. YOUR INTELLIGENCE.**

## For AI Assistants

If you are Claude Code, GPT-4, Gemini, or another AI assistant:
1. Read `/AI_CONTEXT.md` first for essential context
2. Use `/docs/GLOSSARY.md` for consistent terminology
3. See `/CLAUDE_CODE_GUIDE.md` for complete technical reference

## Overview

**SiteSync** is an AI-Native Building Services Operating System that gives buildings permanent ownership of their service history.

| Traditional Model | SiteSync Model |
|-------------------|-----------------|
| Contractors own service data | Buildings own their data |
| History lost when vendors change | History permanent with building |
| Knowledge locked in corporations | Knowledge shared by community |
| Workers' expertise invisible | Workers' reputation portable |

---

## Quick Start

| I want to... | Start here |
|--------------|------------|
| Set up my first building | [Quick Start Tutorial](tutorials/quick-start.md) |
| Add equipment to my building | [Add Assets](tutorials/add-assets.md) |
| Create and manage jobs | [Work Orders](tutorials/work-orders.md) |
| Use AI fault diagnosis | [AI Diagnosis](tutorials/ai-diagnosis.md) |
| Understand the platform | [Vision](explanation/vision.md) |

---

## Documentation Structure

This documentation follows the [Diátaxis framework](https://diataxis.fr/).

### Tutorials (Learning-Oriented)

Step-by-step guides for new users.

| Tutorial | Description |
|----------|-------------|
| [Quick Start](tutorials/quick-start.md) | Get your first building set up |
| [Add Assets](tutorials/add-assets.md) | Register equipment |
| [Work Orders](tutorials/work-orders.md) | Create and manage jobs |
| [AI Diagnosis](tutorials/ai-diagnosis.md) | Use Triforce AI |

### How-To Guides (Task-Oriented)

Solve specific problems.

| Guide | Description |
|-------|-------------|
| [Data Migration](how-to/data-migration.md) | Import historical records |
| [Switch Contractors](how-to/switch-contractors.md) | Change service providers |
| [Compliance Tracking](how-to/compliance-tracking.md) | Manage inspections |

### Reference (Information-Oriented)

Technical specifications and details.

| Reference | Description |
|-----------|-------------|
| [Architecture](reference/architecture.md) | System design |
| [Data Model](reference/data-model.md) | Database schemas |
| [API Reference](reference/api.md) | REST API documentation |
| [Implementation](reference/implementation.md) | Code patterns |
| [Enums & Constants](reference/enums.md) | Status codes, types |
| [Features](reference/features.md) | Feature specifications |
| [Quick Reference](reference/quick-reference.md) | Cheatsheet |
| [UI/UX Spec](reference/ui-ux-spec.md) | Design system |

### Explanation (Understanding-Oriented)

Background and concepts.

| Topic | Description |
|-------|-------------|
| [Vision](explanation/vision.md) | Why SiteSync exists |
| [For Buildings](explanation/for-buildings.md) | Building owner value |
| [For Technicians](explanation/for-technicians.md) | Technician value |
| [Platform Ecosystem](explanation/platform-ecosystem.md) | How it connects |
| [Triforce AI](explanation/triforce-ai.md) | AI architecture |
| [Security & Compliance](explanation/security-compliance.md) | Trust framework |

### Other

| Document | Description |
|----------|-------------|
| [FAQ](faq.md) | Frequently asked questions |
| [Market Strategy](strategy/market-strategy.md) | Go-to-market (internal) |
| [Enterprise FM](enterprise/facilities-management.md) | Large portfolio features |

---

## For AI Assistants

If you are Claude Code or another AI, read the [Claude Code Guide](../CLAUDE_CODE_GUIDE.md) at the project root first.

---

## Key Concepts

### Buildings Own Their Data

Every service record belongs to the building—not the contractor. When contractors change, your history stays.

### Workers Own Their Reputation

Technicians build professional profiles based on verified work. Expertise that travels with them.

### AI Assists Invisibly

Triforce AI uses multiple models for reliable diagnosis. AI helps without getting in the way.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Database | PostgreSQL 16+ with RLS |
| Backend | FastAPI, Python 3.12+ |
| Frontend | React 18, TypeScript |
| AI | Triforce (Gemini + Claude + GPT-4) |

---

## Quick Links

- **[Tutorials](tutorials/)** — Learn SiteSync step by step
- **[How-To Guides](how-to/)** — Solve specific problems
- **[Reference](reference/)** — Technical details
- **[Explanation](explanation/)** — Understand concepts
- **[FAQ](faq.md)** — Common questions

---

*Documentation last updated: December 2025*
