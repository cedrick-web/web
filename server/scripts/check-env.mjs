import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const BASE_PRODUCTION_KEYS = ['DATABASE_URL', 'JWT_SECRET', 'CORS_ORIGIN'];
const PAYHIP_KEYS = ['PAYHIP_WEBHOOK_API_KEY', 'PAYHIP_PRODUCT_ID', 'PAYHIP_WEBHOOK_SECRET'];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateEnvironment(env = process.env) {
  const problems = [];
  const production = env.NODE_ENV === 'production';

  if (!production) {
    if (isNonEmptyString(env.JWT_SECRET) && env.JWT_SECRET.length < 32) {
      problems.push('JWT_SECRET must be at least 32 characters.');
    }
    if (problems.length) throw new Error(problems.join(' '));
    const missing = ['DATABASE_URL', 'JWT_SECRET'].filter(key => !isNonEmptyString(env[key]));
    return {
      production,
      warnings: missing.length
        ? [`Missing ${missing.join(', ')} is acceptable for local automated tests, but not for production.`]
        : [],
    };
  }

  for (const key of BASE_PRODUCTION_KEYS) {
    if (!isNonEmptyString(env[key])) problems.push(`${key} is required in production.`);
  }

  if (isNonEmptyString(env.JWT_SECRET) && env.JWT_SECRET.length < 32) {
    problems.push('JWT_SECRET must be at least 32 characters.');
  }

  if (isNonEmptyString(env.DATABASE_URL)) {
    try {
      const databaseUrl = new URL(env.DATABASE_URL);
      if (!['mysql:', 'mariadb:'].includes(databaseUrl.protocol)) {
        problems.push('DATABASE_URL must use mysql:// or mariadb://.');
      }
      if (!databaseUrl.hostname || !databaseUrl.username || !databaseUrl.pathname || databaseUrl.pathname === '/') {
        problems.push('DATABASE_URL must include a host, username, and database name.');
      }
    } catch {
      problems.push('DATABASE_URL must be a valid MySQL connection URL.');
    }
  }

  if (isNonEmptyString(env.CORS_ORIGIN)) {
    const origins = env.CORS_ORIGIN.split(',').map(value => value.trim()).filter(Boolean);
    if (!origins.length) {
      problems.push('CORS_ORIGIN must contain at least one HTTPS origin.');
    }
    for (const origin of origins) {
      try {
        const parsed = new URL(origin);
        if (parsed.protocol !== 'https:' || parsed.origin !== origin || parsed.username || parsed.password) {
          problems.push(`CORS_ORIGIN entry "${origin}" must be an exact HTTPS origin without a path or trailing slash.`);
        }
      } catch {
        problems.push(`CORS_ORIGIN entry "${origin}" is not a valid URL.`);
      }
    }
  }

  const configuredPayhipKeys = PAYHIP_KEYS.filter(key => isNonEmptyString(env[key]));
  if (configuredPayhipKeys.length > 0 && configuredPayhipKeys.length !== PAYHIP_KEYS.length) {
    const missing = PAYHIP_KEYS.filter(key => !isNonEmptyString(env[key]));
    problems.push(`Payhip webhook configuration is partial; set all three values: ${missing.join(', ')} still missing.`);
  }
  if (isNonEmptyString(env.PAYHIP_WEBHOOK_SECRET) && env.PAYHIP_WEBHOOK_SECRET.length < 32) {
    problems.push('PAYHIP_WEBHOOK_SECRET must be at least 32 characters.');
  }

  if (problems.length) {
    throw new Error('Invalid production environment:\n- ' + problems.join('\n- '));
  }

  return { production, warnings: [] };
}

const isDirectExecution = process.argv[1]
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirectExecution) {
  try {
    const result = validateEnvironment();
    if (result.warnings.length) {
      console.log('Backend configuration template check: ' + result.warnings.join(' '));
    } else {
      console.log('Backend environment configuration is valid.');
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
