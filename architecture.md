# docs/ARCHITECTURE.md

# SecureGate Architecture

## Folder Structure

```txt
src/
├── app/
├── components/
├── lib/
├── schemas/
├── emails/
├── hooks/
├── types/
└── middleware.ts
```

---

# App Structure

## app/
Contains:
- auth pages
- dashboard
- API routes
- verification routes
- reset password routes

## components/
Reusable UI components:
- forms
- buttons
- cards
- auth components

## lib/
Shared reusable utilities:
- prisma.ts
- auth.ts
- tokens.ts
- mail.ts
- rate-limit.ts
- validations.ts
- utils.ts

## schemas/
Zod validation schemas.

## emails/
React Email templates.

## hooks/
Reusable frontend hooks.

## types/
Shared TypeScript types.

---

# Architectural Principles

- modular architecture
- reusable utilities
- clean separation of concerns
- defensive programming
- production-safe design
- scalable folder structure

---

# Authentication Architecture

Authentication uses:
- NextAuth Credentials Provider
- JWT sessions
- Prisma database adapter

Security checks occur in:
- middleware
- API routes
- auth callbacks

---

# Middleware Responsibilities

Middleware must:
- protect dashboard routes
- redirect unauthenticated users
- redirect unverified users
- handle missing sessions safely
- handle invalid cookies safely

---

# Token Architecture

Two token systems exist:

## Verification Tokens
Used for:
- email verification

Expires after:
- 15 minutes

## Password Reset Tokens
Used for:
- password reset flow

Expires after:
- 1 hour

All used tokens must be deleted after successful usage.