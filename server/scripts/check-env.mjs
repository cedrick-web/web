const required = ['DATABASE_URL', 'JWT_SECRET'];
const missing = required.filter(key => !process.env[key]);
if (missing.length) {
  console.log(`Backend configuration template check: missing ${missing.join(', ')} is expected in local CI unless secrets are supplied.`);
} else if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters');
} else {
  console.log('Backend configuration looks valid.');
}
