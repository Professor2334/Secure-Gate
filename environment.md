# docs/ENVIRONMENT.md

# SecureGate Environment Variables

Create:
- .env.local
- .env.example

Never commit:
- .env.local

---

# Required Variables

```env
DATABASE_URL=

NEXTAUTH_SECRET=
NEXTAUTH_URL=

RESEND_API_KEY=
RESEND_FROM=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

# Environment Rules

## DATABASE_URL
Used for PostgreSQL database connection.

## NEXTAUTH_SECRET
Used for secure session encryption.

## NEXTAUTH_URL
Used for authentication callback URLs.

## RESEND_API_KEY
Used for transactional email sending.

## RESEND_FROM
Verified sender email.

## UPSTASH_REDIS_REST_URL
Upstash Redis connection URL.

## UPSTASH_REDIS_REST_TOKEN
Upstash Redis access token.

---

# Security Rules

- Never expose secrets publicly
- Never hardcode API keys
- Use Vercel environment variables
- Use different secrets for production
- Rotate secrets if compromised

---

# Deployment Environment

Deployment platform:
- Vercel

Production requirements:
- all variables configured
- no missing secrets
- no exposed API keys