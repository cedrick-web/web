# DevSprint

Global practical developer education business.

## Mission
Help beginner developers turn programming problems into algorithms, JavaScript, tests, debugging steps, and efficient solutions.

## Product #1
**JavaScript Problem-Solving & DSA Toolkit**

Core learning loop:

Understand → Identify Input/Output → Break Down → Think → Algorithm → Pseudocode → Implement → Test → Debug → Analyze Complexity → Improve

## Repository structure
- `website/` - public-facing MVP website
- `business/` - business strategy and operating documents
- `products/` - product specifications and learning content
- `marketing/` - acquisition and content system

## Status
The website foundation and V1 curriculum are implemented, but DevSprint is **not launch-ready**. Production hosting, database connectivity, checkout, authenticated account flows, package delivery and refunds still require end-to-end verification.

**Commercial security blocker:** this repository is public and paid workbook source has been committed to its Git history. CI no longer publishes customer ZIP artifacts, but that alone does not protect the source already in Git history. Do not take customer payments until the repository is made private or paid content is moved to a properly private source and the exposed Git history is remediated. GitHub's connected file-editing interface cannot change repository visibility or rewrite repository history.

Run website QA and create the customer download from `website/`:

```bash
npm run check
npm run package
```

See [business/phase-completion-roadmap-v1.md](business/phase-completion-roadmap-v1.md) for the ordered remaining launch and growth gates. Do not treat future product/platform phases as launch requirements; they are evidence-gated.
