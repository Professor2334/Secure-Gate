# docs/PRD.md

# SecureGate — Product Requirements Document (PRD)

## Overview

SecureGate is a standalone authentication and security application built with Next.js 14, TypeScript, Prisma, PostgreSQL, NextAuth, Resend, and Vercel.

The project focuses on authentication correctness, secure session management, password security, token lifecycle handling, middleware protection, and production-grade engineering practices.

This is not a full SaaS product. It is a focused security-first authentication system.

---

# Features

## User Registration
- Register with name, email, and password
- Zod validation
- Password strength indicator
- bcrypt password hashing
- Prevent duplicate emails

## User Login
- Credentials login using NextAuth
- Generic authentication errors
- JWT session handling

## Email Verification
- Verification token generation
- Email verification flow
- Token expiry after 15 minutes
- Verification email via Resend

## Protected Dashboard
- Only authenticated and verified users allowed
- Middleware protection
- Secure redirects

## Forgot Password
- Password reset token generation
- Reset token expiry after 1 hour
- Reset email delivery

## Logout
- Destroy session securely
- Redirect to login

## Rate Limiting
- Protect login endpoint
- Protect forgot-password endpoint
- 5 attempts per IP per 10 minutes

## Security Hardening
- HTTP security headers
- Defensive programming
- Secure token handling
- Environment variable safety

---

# Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| ORM | Prisma |
| Database | PostgreSQL |
| Authentication | NextAuth |
| Validation | Zod |
| Hashing | bcryptjs |
| Email | Resend |
| Email Templates | React Email |
| Rate Limiting | Upstash Redis |
| Deployment | Vercel |

---

# Build Phases

## Phase 1
- Scaffold project
- Setup Prisma
- Connect PostgreSQL
- Create database schema

## Phase 2
- Configure NextAuth
- Build registration
- Build login
- Protect dashboard

## Phase 3
- Email verification flow
- Verification tokens
- Verification emails

## Phase 4
- Forgot password flow
- Reset password flow
- Reset token lifecycle

## Phase 5
- Rate limiting
- Security hardening
- Secure middleware

## Phase 6
- UI polish
- Accessibility
- Deployment
- Production checks

---

# Reflection.md

Create a REFLECTION.md file in the project root.

It must include:
- implementation analysis
- engineering decisions
- security reasoning
- architecture reflections
- technical debt discussion

The reflection must reference actual SecureGate implementation details.