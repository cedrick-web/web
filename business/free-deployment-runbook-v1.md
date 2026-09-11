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
- `CORS_ORIGIN` = the deployed frontend URL
- `DB_SSL=true`
- `DB_CONNECTION_LIMIT=5`

Do not commit any of those secrets to GitHub.

## 3. Frontend

The blueprint builds `website` and publishes `website/dist`.

Later, when the API is wired into the learning UI, set `VITE_API_URL` to the Render API URL. Do not put secrets in `VITE_*` variables.

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
