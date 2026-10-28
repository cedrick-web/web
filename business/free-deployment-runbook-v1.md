# DevSprint Free Deployment Runbook V1

## 1. Database

Create a TiDB Cloud Starter instance on the free quota.

- Keep the spending limit at zero.
- Generate the database password.
- Copy the TLS connection details.
- Run `server/db/schema.sql` against the database.
- Keep the connection string private.

## 2. Backend

The Render Blueprint automatically generates `JWT_SECRET`, sets the default `CORS_ORIGIN` to `https://devsprint-web.onrender.com`, and checks the production environment before starting the API.

The following values still need real, private database account data:
- `DATABASE_URL`: the actual TiDB/MySQL TLS connection string.
- `DB_SSL=true`
- `DB_CONNECTION_LIMIT=5`

The Payhip API key and product ID are deliberately not required to deploy the free learning API. Until those values are added to the backend environment, the Payhip webhook fails closed and paid checkout remains disabled. Do not commit any credentials to GitHub.

If using a custom domain or a different Render hostname, update `CORS_ORIGIN` to the exact frontend HTTPS origin and `VITE_API_URL` to the API HTTPS origin, then rebuild/redeploy the frontend and API.
 
## 3. Frontend

The Blueprint builds `website` with deterministic `npm ci` dependencies and publishes `website/dist`. The static site uses the default API hostname above; it does not require a manual `VITE_API_URL` entry when using the default Render URLs.

Do not put secrets in `VITE_*` variables. These values are bundled into public browser code.

## 4. First health test

Open:

`https://YOUR-API.onrender.com/health`

Expected result:

```json
{"ok":true,"service":"devsprint-api","database":"ok"}
```

## 5. Production test order

1. Website loads.
2. API health endpoint is healthy.
3. Registration creates a user.
4. Login returns an authenticated session token.
5. `/api/me` works with that token.
6. Progress can be created and retrieved.
7. Refreshing the frontend does not lose server-backed progress.
8. Paid content remains protected.
9. Payment webhooks are verified before entitlement is granted.
10. Failed and refunded payments do not grant or retain access.

## 6. Domain policy

No paid custom domain is required for V1. Use the free provider subdomains until the business generates enough revenue to justify a custom domain.


## DevSprint V1 hardening updates

- On a fresh database, apply the current `server/db/schema.sql`, which seeds the V1 product record.
- If the database already exists, apply `server/db/migrations/003_payhip-product-refunds.sql` once after confirming earlier schema migrations have been applied.
- Configure `PAYHIP_WEBHOOK_API_KEY` and the exact DevSprint product ID as `PAYHIP_PRODUCT_ID` in the backend host. Never put either value in the frontend or Git.
- Configure `VITE_CHECKOUT_URL` only after the real Payhip product page is published and the hosted checkout has been tested. It must be an HTTPS URL.
- Backend automated tests run without production credentials using a fake database. They verify API routes and Payhip event handling, but do not replace a live database smoke test.


## Payhip webhook verification hardening

The API verifies the SHA-256 hash of the Payhip developer API key and the exact configured `PAYHIP_PRODUCT_ID`. Payhip's documented signature is a static hash of the API key, not a MAC of the individual payload. For that reason this implementation also requires a separate random endpoint secret.

1. Render generates `PAYHIP_WEBHOOK_SECRET` for the backend service. Treat this value as a password.
2. After the actual Payhip product exists, add `PAYHIP_WEBHOOK_API_KEY` and the exact `PAYHIP_PRODUCT_ID` to the backend service's environment settings. Those two real provider values are intentionally not fabricated in source code.
3. Configure the Payhip webhook endpoint as `https://YOUR-API-HOST/api/payments/payhip/webhook?secret=URL_ENCODED_SECRET`. URL-encode the generated secret before placing it in the query string (for example with `encodeURIComponent(secret)` in JavaScript), because generated secrets may contain `+`, `/`, and `=`. Never put this URL or secret in the public repository or a public chat.
4. A payment event for a different product is ignored. New sales are rejected if the DevSprint product is archived or inactive. Refunds continue to be processed after a product is archived.
5. Refund events with a smaller cumulative refund total than an already recorded event are treated as stale and cannot roll the refund record backwards.

Payhip documents transaction IDs, product IDs, event types, the signature field, and that prices are in cents/pennies in its [official webhook documentation](https://help.payhip.com/article/115-webhooks). The additional endpoint secret is a DevSprint-side control to strengthen authenticity checks; it is not a Payhip-provided signature field.


## Commercial content confidentiality blocker

The source repository is currently public and contains paid workbook source in Git history. Treat this as a launch blocker. The package workflow builds the ZIP only for validation and deletes it from the runner; it does not upload the commercial ZIP as a GitHub Actions artifact. This prevents the workflow from creating another convenient public download, but does **not** remove already-committed source or past artifacts.

Before accepting payment, the repository owner must make the repository private or separate commercial content into a private repository, then remediate the public Git history and review any previously generated workflow artifacts. The repository file connector used for code edits cannot change repository visibility, purge Git history across refs, or delete old action artifacts. Do not claim that this blocker is resolved until those account-level checks are complete.
