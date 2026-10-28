# DevSprint Free Production Architecture V1

## Goal
Run the first public version without purchasing a domain, server, or database subscription.

## Free stack

- Frontend: Render Static Site, using the repository's `render.yaml` blueprint.
- Backend: Render Free Web Service running Node.js + Express.
- Database: TiDB Cloud Starter free quota, MySQL-compatible.
- Source control: GitHub Free.
- Domain: provider subdomains (`onrender.com`) initially. A custom domain is intentionally postponed because a domain name itself is normally a paid registration.
- Payments: Payhip + Flutterwave when the product is ready for commercial launch. Payment-provider fees are transaction costs, not hosting costs.

## Architecture

```text
Browser
  |
  +--> Render static frontend
  |
  +--> Render Node/Express API
            |
            +--> TiDB Cloud Starter (MySQL-compatible)
            |
            +--> Payment webhooks later
```

## Important free-tier limitations

The Render free web service sleeps after inactivity and can take about a minute to wake. Its local filesystem is ephemeral, so customer data must never be stored on the server filesystem. Render's free Postgres is not selected because it expires after 30 days. The database is therefore externalized to TiDB Cloud Starter.

TiDB Cloud Starter provides a free quota while usage stays within its published limits. Set the spending limit to zero when creating the free instance so the project cannot silently become a paid database.

## Security rules

1. Never commit `.env` files, passwords, JWT secrets, payment secrets, or webhook secrets.
2. Store secrets only in the hosting provider's environment-variable settings.
3. Use HTTPS endpoints only in production.
4. Use server-side payment verification and signed webhooks before granting paid access.
5. Do not put database credentials in React/Vite variables.
6. Keep the database behind credentials and TLS.
7. Use the provider's free subdomain until a paid custom domain is affordable.

## Scaling path

Free prototype -> first customers -> paid hosting/database only when real usage requires it.

The architecture does not require rewriting the frontend when the hosting plan changes.
