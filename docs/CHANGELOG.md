# Documentation Changelog

All notable changes to SiteSync documentation are recorded here.

## [3.0.1] - December 2025

### Added (Research-Driven Improvements)

Based on deep research into official Anthropic/Claude, Google Gemini, and OpenAI GPT documentation:

- **CLAUDE.md**: Concise project context file (~70 lines, ~800 tokens) per Anthropic best practices
- **llms-full.txt**: Complete documentation dump (~18,500 lines, ~60,000 words) per llms.txt standard
- **AI Research Document**: `docs/AI_DOCUMENTATION_RESEARCH.md` with synthesized findings
- **Cache Hints**: Added `cache_hints` to manifest for prompt caching optimization
- **Model Tips**: Added model-specific guidance (Claude, Gemini, GPT) to manifest
- **Token Estimates**: Added per-document token estimates to llms.txt
- **Optional Section**: Added `## Optional` section to llms.txt per specification

### Changed

- **llms.txt**: Enhanced with token estimates, optional section, and llms-full.txt reference
- **.llm-manifest.json**: Updated with cache hints, model tips, and CLAUDE.md as start_here
- **Reading Order**: Now starts with CLAUDE.md for faster context loading

### Key Research Findings Applied

| Provider | Key Practice | Applied |
|----------|--------------|---------|
| Claude | CLAUDE.md under 100 lines | CLAUDE.md at 70 lines |
| Claude | Documents at TOP, queries at END | Documented in research |
| Gemini | Use consistent delimiters | XML tags recommended |
| Gemini | Context caching supported | Cache hints added |
| GPT | XML > JSON for long context | Documented in tips |
| llms.txt | Optional section for secondary content | Added to llms.txt |

---

## [3.0.0] - December 2025

### Added

- **LLM Optimization**: Created `.llm-manifest.json` for machine-readable documentation index
- **AI Context**: New `AI_CONTEXT.md` for quick AI assistant onboarding
- **Archive Exclusion**: Added `archive/.llmignore` to prevent AI confusion with deprecated docs
- **Frontmatter**: Added YAML frontmatter with status and metadata to all reference docs
- **Chunking Hints**: Large files now include section breakdowns for partial loading

### Changed

- **Product Rebrand**: Renamed from "LiftLogic" to "SiteSync" throughout all documentation
- **Directory Structure**: Reorganized using Diátaxis framework (tutorials, how-to, reference, explanation)
- **Link Format**: Standardized all internal links to relative paths
- **AI_CONTEXT.md**: Streamlined to reference authoritative sources instead of duplicating content

### Fixed

- **Navigation Links**: Updated all broken footer navigation links referencing old numbered file names
- **Cross-References**: Fixed inconsistent path formats (`./`, `../`, `/`)

### Deprecated

- **Archive**: Previous numbered documentation (00_OVERVIEW.md through 17_ENTERPRISE_FM.md) moved to `archive/LIFTLOGIC_V3_REFERENCE/`

---

## [2.0.0] - November 2025

### Added

- Initial comprehensive documentation suite
- Triforce AI architecture documentation
- Data model with SQL schemas and Pydantic models
- API reference with endpoint documentation
- Multi-tenant architecture with RLS

---

## Documentation Status Key

| Status | Meaning |
|--------|---------|
| `stable` | Content reviewed and approved |
| `design` | Design phase, subject to change |
| `draft` | Work in progress |
| `deprecated` | Superseded, kept for reference |

## Implementation Status Key

| Status | Meaning |
|--------|---------|
| `complete` | Fully implemented |
| `partial` | Partially implemented |
| `design` | Design only, not yet implemented |
| `planned` | Planned for future implementation |
