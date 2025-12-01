# AI Documentation Research Synthesis
## Official LLM Provider Best Practices for Document Ingestion

> Research conducted December 2025 from official documentation of Claude (Anthropic), Gemini (Google), and GPT (OpenAI)

---

## Executive Summary

After deep research into official documentation from all three major LLM providers, clear consensus patterns emerge for optimizing documentation for AI consumption. This synthesis provides actionable recommendations for SiteSync.

---

## Key Findings by Provider

### Anthropic/Claude

**Source**: [Anthropic Engineering Blog](https://www.anthropic.com/engineering/claude-code-best-practices), [Claude Platform Docs](https://platform.claude.com)

| Finding | Application |
|---------|-------------|
| Put documents at TOP, instructions at END | Structure long docs with data first, queries last |
| Use XML tags for structure | `<instructions>`, `<documents>`, `<data>`, `<context>` |
| CLAUDE.md auto-loads as context | Keep under 100 lines, project-specific |
| "Smallest possible set of high-signal tokens" | Be concise, remove redundancy |
| Quote grounding improves accuracy | Ask to extract quotes before analysis |
| Claude 4.x follows instructions literally | Be explicit about desired behavior |
| Prompt caching saves 90% cost | Place stable content at prompt beginning |

**Key Quote**: "Context engineering is the art and science of curating the context window."

### Google Gemini

**Source**: [AI Google Dev Docs](https://ai.google.dev/gemini-api/docs), [Vertex AI Docs](https://cloud.google.com/vertex-ai/generative-ai/docs)

| Finding | Application |
|---------|-------------|
| 1M+ token context with 99% retrieval | Can load entire codebases |
| Query at END after context | Position questions after data |
| Use consistent delimiters | XML tags or Markdown headings |
| Condense prompts | Avoid repeating context |
| Request structured outputs | JSON, tables, bullets save tokens |
| Pre-summarize long files | Summary first, details accessible |
| Context caching with TTL | 60-minute default, configurable |

**Key Quote**: "Place your specific instructions at the end of the prompt (after the data context)."

### OpenAI GPT

**Source**: [OpenAI Cookbook](https://cookbook.openai.com), [Platform Docs](https://platform.openai.com/docs)

| Finding | Application |
|---------|-------------|
| GPT-4.1 follows instructions literally | Requires explicit specification |
| XML format performs well for long context | Better than JSON |
| JSON performs "particularly poorly" | Avoid JSON for doc structure |
| Sandwich instructions for long context | Beginning AND end placement |
| Agentic workflows need persistence | Include continuation guidance |
| Reasoning models (o1/o3): keep simple | No chain-of-thought prompting needed |
| Structured outputs guarantee schema | Use for API responses |

**Key Quote**: "XML format performed well... JSON performed particularly poorly" for long context.

---

## Consensus Best Practices

### 1. Document Structure

```
OPTIMAL ORDER:
1. Project name/title (H1)
2. Brief summary (blockquote)
3. Data/context (bulk content)
4. Instructions/queries (at end)
```

### 2. Formatting Preferences

| Format | Recommendation |
|--------|----------------|
| **XML tags** | Highly recommended (all providers) |
| **Markdown** | Good baseline, universally supported |
| **JSON** | Avoid for long documents (poor performance) |

### 3. Content Organization

- **Hierarchy**: Clear nested structure
- **Chunking**: Break large docs into logical sections
- **Token estimates**: Include for cost/context planning
- **Reading order**: Explicit guidance on what to read first

### 4. AI-Specific Files

| File | Purpose |
|------|---------|
| `llms.txt` | Discovery index (community standard) |
| `llms-full.txt` | Complete documentation dump |
| `CLAUDE.md` | Claude-specific project context |
| `.llm-manifest.json` | Machine-readable metadata |

---

## llms.txt Standard

**Source**: [llmstxt.org](https://llmstxt.org/)

### Required Structure

```markdown
# Project Name

> Brief summary in blockquote

## Section Name
- [Link Title](url): Optional description
```

### Optional Enhancements

- `## Optional` section for secondary content
- `llms-full.txt` for complete documentation
- `.md` URLs for clean content

---

## CLAUDE.md Best Practices

**Source**: [Anthropic Blog](https://www.claude.com/blog/using-claude-md-files)

### Recommended Sections

1. **Project Summary** - What is this?
2. **Directory Map** - Key files/folders
3. **Standards** - Coding conventions
4. **Common Commands** - Frequent operations
5. **Workflows** - Step-by-step processes
6. **Tool Integration** - MCP servers, scripts

### Guidelines

- Keep under 100 lines
- No sensitive information
- Start simple, expand based on friction
- Treat as living documentation
- Update as project evolves

---

## Recommendations for SiteSync

### Immediate Actions

1. **Create CLAUDE.md**
   - Convert AI_CONTEXT.md to CLAUDE.md format
   - Keep under 100 lines
   - Focus on project-specific patterns

2. **Add llms-full.txt**
   - Concatenate all documentation
   - Include token count header
   - Update on doc changes

3. **Enhance llms.txt**
   - Add `## Optional` section
   - Include token estimates per link
   - Add version/date metadata

4. **Add XML structure to key docs**
   - Use `<context>`, `<instructions>`, `<examples>`
   - Helps all three major LLM providers

5. **Update .llm-manifest.json**
   - Add explicit reading_order priority
   - Include cache hints for stable content
   - Add model-specific optimizations

### Structural Improvements

| Current | Recommended |
|---------|-------------|
| AI_CONTEXT.md (223 lines) | CLAUDE.md (<100 lines) + AI_CONTEXT.md (detailed) |
| llms.txt (index only) | llms.txt + llms-full.txt |
| No XML tags | Add `<section>` tags in key docs |
| JSON manifest | Keep, but add cache_hints |

### Content Optimization

1. **Deduplicate** terminology across files
2. **Add "why" explanations** alongside "what"
3. **Include examples** showing desired patterns
4. **Position queries** at end of long documents
5. **Pre-summarize** complex sections

---

## Token Budget Guidance

Based on research, optimal context allocation:

| Content Type | Token Budget | Notes |
|--------------|--------------|-------|
| System context | 500-2000 | CLAUDE.md equivalent |
| Project docs | 5000-15000 | Core reference material |
| Code context | 10000-50000 | Relevant source files |
| User query | 100-500 | Specific request |
| Response space | 2000-8000 | Output generation |

**Total recommended**: 20K-75K tokens for typical coding session

---

## Caching Strategy

### Anthropic Claude

```
Cache stable content:
- System instructions
- Large reference documents
- Code style guides
- API documentation

Cache lifetime: 5 min default, 1 hour available
Cost: 10% of base input for cache hits
```

### Google Gemini

```
Implicit caching: Automatic on 2.5+ models
Explicit caching: 90% discount on 2.5 models
TTL: 60 min default, configurable
```

---

## Sources

### Anthropic/Claude
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Using CLAUDE.md Files](https://www.claude.com/blog/using-claude-md-files)
- [Context Engineering for AI Agents](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Prompt Caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [Claude 4 Best Practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-4-best-practices)
- [XML Tags Guide](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/use-xml-tags)

### Google Gemini
- [Long Context Guide](https://ai.google.dev/gemini-api/docs/long-context)
- [Prompting Strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)
- [Context Caching](https://ai.google.dev/gemini-api/docs/caching)

### OpenAI GPT
- [GPT-4.1 Prompting Guide](https://cookbook.openai.com/examples/gpt4-1_prompting_guide)
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Reasoning Models Advice](https://platform.openai.com/docs/guides/reasoning)

### Community Standards
- [llms.txt Specification](https://llmstxt.org/)
- [Mintlify llms.txt](https://www.mintlify.com/blog/simplifying-docs-with-llms-txt)

---

*Research compiled December 2025*
