# DevSprint Phase Completion Roadmap V1

## Current position

The repository already contains a business foundation, a public website MVP, eight curriculum modules, 51 lesson records, 60 registered challenges, a Node API, deployment configuration, and CI workflows. The curriculum was not empty; its remaining generic lesson fallbacks and two incomplete challenges have been replaced, and the paid package now has automated content checks and a ZIP build.

The product is **not publicly launch-ready**. Local source QA does not prove a production deployment, a working database, payment-provider approval, customer delivery, or a tested refund.

## Phase 1 — Foundation and website MVP

**Status: Implemented; local QA and production build pass. Deployment smoke tests remain.**

- [x] Business positioning, customer, offer, and low-risk operating principles documented.
- [x] Website MVP and learning navigation implemented.
- [x] Eight-module curriculum and 60-challenge registry present.
- [x] Generic lesson fallbacks removed; each lesson has a specific objective, explanation, example, and practice prompt.
- [x] Regression QA fails if generic lesson copy returns.
- [x] CI workflows exist for the website and backend.
- [x] Run `npm run check`; curriculum/package QA and the production build pass.
- [ ] Confirm the deployed website URL and smoke-test desktop/mobile navigation.

## Phase 2 — Finish and release the V1 learning product

**Status: Source content and package pipeline implemented; release review remains.**

- [x] Eight paid module workbooks and 60 registered challenge records.
- [x] Added the missing complete solution, tests, pseudocode, and complexity notes for DSP-011 and DSP-012.
- [x] Added implementation examples and test cases for the strategy-comparison challenge DSP-053.
- [x] Automated checks cover every challenge's problem, algorithm/pseudocode, solution, tests, and complexity notes.
- [x] Added `npm run package` to build the customer ZIP from an explicit allowlist.
- [x] Package contents exclude internal business documents, server source, dependencies, environment files, and build output.
- [ ] Generate the ZIP after QA passes, inspect its full file list, open it, and review the customer documents manually.
- [ ] Confirm the final package matches the sales page, offer, manifest, and version.
- [ ] Obtain a final human proofread of all 60 solutions, expected outputs, and learning claims.

## Phase 3 — Public launch and production delivery

**Status: Blocked on external account setup and end-to-end verification.**

These tasks require the project owner; source-code work cannot create or verify third-party accounts, supply business/tax documents, accept terms, provide credentials, or make purchases on the owner's behalf.

- [ ] Create/verify the payment and delivery accounts described in `payhip-flutterwave-launch-v1.md`.
- [ ] Set the product price, upload the reviewed ZIP, configure payment methods, and keep the product unlisted during testing.
- [ ] Complete a real provider-supported test checkout and verify the confirmation, download, ZIP contents, and customer email.
- [ ] Verify and document cancellation, refund, and access-removal behavior.
- [ ] Add the genuine checkout URL only after checkout and delivery tests pass.
- [ ] Configure production environment variables and a production database using `free-deployment-runbook-v1.md`.
- [ ] Apply the database schema and verify API health, registration, login, `/api/me`, progress persistence, CORS, and recovery after refresh.
- [ ] Verify that paid access is granted only after provider verification and removed after a refund.
- [ ] Run website/backend QA and production smoke tests; review privacy, support, tax, and refund obligations.
- [ ] Publish the sales page and announce the launch only after every launch gate is satisfied.

## Phase 4 — Validate demand and improve the business

**Status: Not started; this phase needs real customer evidence.**

- [ ] Publish useful content consistently and direct readers to the free challenges.
- [ ] Track qualified leads, sales, checkout conversion, support requests, refunds, and acquisition source.
- [ ] Ask early customers for structured feedback and fix the most common product friction.
- [ ] Review price and positioning only after collecting enough evidence to make a reasoned decision.
- [ ] Build a second product or bundle only when customer feedback or sales demonstrate demand.

## Phase 5 — Expand into a learning platform

**Status: Basic account and progress UI/API wiring implemented; database-backed validation and paid-learning access remain blocked on production setup.**

Guests continue to use browser-local progress. Signed-in users can register/login and use the API-backed challenge-progress endpoints when `VITE_API_URL` is configured. The backend has not yet been verified against a provisioned database, and paid-learning access is not yet enforced by the website. Do not expand this into a larger platform before Phase 4 validates demand.

When evidence justifies the investment:

- [ ] Define paid-account access, privacy, retention, and support requirements.
- [x] Add website sign-in/registration and API-backed challenge progress.
- [ ] Verify account registration, login, progress persistence, CORS, and refresh against the deployed API/database.
- [ ] Protect paid content with a verified entitlement flow and test refund/revocation cases.
- [ ] Add interactive paid challenges and educator-facing features only from validated user needs.
- [ ] Reassess hosting, database, availability, backups, and operating costs before scaling.

## Completion rule

Do not label the business or product “fully complete” because code or a ZIP exists. Phase 3 is complete only after a verified customer can pay, receive the correct product, get support/refunds, and use the deployed service reliably. Phases 4 and 5 are growth opportunities, not prerequisites to selling V1.
