# DevSprint JavaScript Problem-Solving & DSA Toolkit V1

## Package purpose

This manifest defines the exact files that must be included in the customer-facing V1 download. It is the release checklist for packaging, not the downloadable archive itself.

## Customer package

```text
DEVSPRINT-JAVASCRIPT-PROBLEM-SOLVING-DSA-TOOLKIT-V1/
├── README.md
├── Workbook/
│   ├── Module-01-Think-Like-a-Programmer.md
│   ├── Module-02-JavaScript-for-Problem-Solving.md
│   ├── Module-03-Arrays-and-Strings.md
│   ├── Module-04-Searching.md
│   ├── Module-05-Sorting.md
│   ├── Module-06-Data-Structures.md
│   ├── Module-07-Big-O-Without-the-Pain.md
│   └── Module-08-Problem-Solving-Lab.md
├── Practice/
│   └── 60-Challenge-Index.md
├── Debugging-Lab/
│   └── Debugging-Lab.md
├── Assessment-Simulator/
│   └── Assessment-Simulator.md
├── Final-Project/
│   └── Student-Performance-Analyzer.md
├── Tests/
│   └── Test-Guide.md
└── Revision/
    └── Revision-Checklist.md
```

## Source-of-truth mapping

The eight module files map to the canonical challenge registry at:

`data/challenge-registry.json`

The registry contains exactly 60 challenges, DSP-001 through DSP-060. The human-readable paid modules remain the learning source documents.

## Release requirements

The customer ZIP is generated from the approved source mapping by running `npm run package` in `website/`. The generated `release/` directory is intentionally ignored by Git so it cannot be mistaken for source.

Before uploading or distributing that ZIP:

- [ ] `npm run check` passes.
- [ ] `npm run package` creates `release/DEVSPRINT-JAVASCRIPT-PROBLEM-SOLVING-DSA-TOOLKIT-V1.zip`.
- [ ] The archive opens and contains exactly the customer-facing files listed above.
- [ ] All 60 challenge IDs have a problem, pseudocode/algorithm, solution, tests, and complexity notes.
- [ ] The eight modules and all included learning material match the approved V1 content.
- [ ] Final Project, Debugging Lab, Assessment Simulator, Test Guide, and Revision Checklist are present.
- [ ] No internal development files, credentials, secrets, `.env` files, dependencies, or build artifacts are included.
- [ ] Product version and sales claims match the delivered package.
- [ ] A manual content and archive review is complete.

## Customer README requirements

The final customer README should explain:

1. What the toolkit is.
2. Who it is for.
3. The recommended learning loop.
4. How to use hints without immediately reading solutions.
5. How to run JavaScript solutions/tests.
6. How to use the Debugging Lab.
7. How to complete the Assessment Simulator.
8. How to complete the Final Project.
9. How to use the Revision Checklist.
10. Where to get support and how refunds work.

## Packaging rule

Automated QA verifies the source content and expected package files; it does not replace human review of the final ZIP or checkout delivery. Do not distribute the package until the release checklist above is checked.
