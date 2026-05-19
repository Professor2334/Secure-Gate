# docs/SECURITY.md

# SecureGate Security Requirements

# Password Security

- Never store plaintext passwords
- Use bcryptjs hashing
- Use salt rounds of 12
- Compare passwords securely

---

# Token Security

- Verification tokens expire after 15 minutes
- Password reset tokens expire after 1 hour
- Delete used tokens immediately
- Use secure random token generation

Token generation:
```ts
crypto.randomBytes(32).toString("hex")
```

---

# Authentication Security

- Use generic auth errors
- Never reveal whether email exists
- Never reveal whether password is incorrect
- Protect sessions defensively

---

# Middleware Security

Middleware must:
- protect dashboard routes
- validate sessions
- handle deleted cookies safely
- redirect securely

---

# Rate Limiting

Protect:
- login endpoint
- forgot-password endpoint

Rules:
- 5 attempts
- per IP
- per 10 minutes

---

# Input Validation

- Validate all server input using Zod
- Never trust client input
- Sanitize data
- Prevent malformed requests

---

# Environment Security

- Never hardcode secrets
- Never commit .env.local
- Use Vercel environment variables
- Create .env.example

---

# Security Headers

Add:
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

---

# Defensive Engineering

Assume:
- tokens expire
- cookies disappear
- sessions fail
- users make mistakes
- attackers probe endpoints

The system must fail safely.