# DevSprint Free Deployment Runbook V1

## 1. Database

Create a TiDB Cloud Starter instance on the free quota.

- Keep the spending limit at zero.
- Generate the database password.
- Copy the TLS connection details.
- Run `server/db/schema.sql` against the database.
- Keep the connection string private.

## 2. Backend

Create the Render Blueprint from the repository's `render.yaml`.

Set these backend environment variables in Render:

- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGIN` = the deployed frontend origin, including `https://`
- `DB_SSL=true`
- `DB_CONNECTION_LIMIT=5`

Do not commit any of those secrets to GitHub.

After both services have deployed, set `VITE_API_URL` on the frontend and `CORS_ORIGIN` on the API to each other's exact HTTPS origins, then redeploy both services.

## 3. Frontend

The blueprint builds `website` and publishes `website/dist`. Set `VITE_API_URL` on the `devsprint-web` static site to the deployed API origin, including `https://`.

Do not put secrets in `VITE_*` variables. This value is public and only identifies the API server.

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

1. Generate a unique secret with at least 32 characters and store it only in the backend's `PAYHIP_WEBHOOK_SECRET` variable.
2. Configure the Payhip webhook endpoint as `https://YOUR-API-HOST/api/payments/payhip/webhook?secret=YOUR_RANDOM_SECRET`. Do not put this URL in frontend code or public repository files.
3. Also configure `PAYHIP_WEBHOOK_API_KEY` and the exact `PAYHIP_PRODUCT_ID` for the DevSprint item. Never use a guessed product ID.
4. A payment event for a different product is ignored. New sales are rejected if the DevSprint product is archived or inactive. Refunds continue to be processed after a product is archived.
5. Refund events with a smaller cumulative refund total than an already recorded event are treated as stale and cannot roll the refund record backwards.

Payhip documents transaction IDs, product IDs, event types, the signature field, and that prices are in cents/pennies in its [official webhook documentation](https://help.payhip.com/article/115-webhooks). The additional endpoint secret is a DevSprint-side control to strengthen authenticity checks; it is not a Payhip-provided signature field.


## Commercial content confidentiality blocker

The source repository is currently public and contains paid workbook source in Git history. Treat this as a launch blocker. The package workflow builds the ZIP only for validation and deletes it from the runner; it does not upload the commercial ZIP as a GitHub Actions artifact. This prevents the workflow from creating another convenient public download, but does **not** remove already-committed source or past artifacts.

Before accepting payment, the repository owner must make the repository private or separate commercial content into a private repository, then remediate the public Git history and review any previously generated workflow artifacts. The repository file connector used for code edits cannot change repository visibility, purge Git history across refs, or delete old action artifacts. Do not claim that this blocker is resolved until those account-level checks are complete.
