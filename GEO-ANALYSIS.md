# MortgageBreezy GEO analysis

Reviewed: 2026-08-25

## Readiness: 68/100

The project has server-rendered route metadata, country-specific calculator routes, structured application markup, official-source links and calculator interactivity. The main weaknesses are thin guide content, incomplete non-English copy, no named human reviewer/author credentials and no independent brand-mention evidence.

## Implemented improvements

- Added `/llms.txt` with primary calculators, guides, policy pages and explicit calculation limits.
- Explicitly allowed GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot and PerplexityBot in `robots.txt`.
- Unified schema organization and product naming as MortgageBreezy.
- Added Article JSON-LD, publication/review dates and answer-first summaries to all guide pages.

## Remaining highest-impact work

1. Translate all guide and calculator detail copy before treating non-English pages as equivalent hreflang alternatives.
2. Expand each guide into an evidence-led country-specific page with dated primary-source citations; the current guide pages are too thin for competitive informational queries.
3. Publish an editorial policy and qualified reviewer attribution for tax and mortgage rules.
4. Obtain independent brand mentions and citations; this cannot be created safely inside the codebase.
5. Add original comparative datasets or methodology examples to create citation-worthy first-party evidence.
