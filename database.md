# docs/DATABASE.md

# SecureGate Database Schema

## Database

Database engine:
- PostgreSQL

ORM:
- Prisma ORM

---

# User Model

Fields:
- id
- name
- email
- password
- emailVerified
- createdAt

Rules:
- email must be unique
- passwords must be hashed
- emailVerified defaults to false

---

# VerificationToken Model

Fields:
- identifier
- token
- expires

Purpose:
- email verification flow

Rules:
- token must expire
- token deleted after successful verification

---

# PasswordResetToken Model

Fields:
- email
- token
- expires

Purpose:
- password reset flow

Rules:
- token expires after 1 hour
- token deleted after password reset

---

# Database Requirements

- Prisma migrations required
- Prisma client singleton required
- Secure database connection handling
- No plaintext passwords
- No token reuse

---

# Prisma Requirements

Create:
- reusable prisma client
- clean schema structure
- production-safe migrations

Run:
```bash
npx prisma migrate dev
```

Confirm tables exist before continuing development.