# docs/REFLECTION_GUIDE.md

# SecureGate Reflection Guide

The REFLECTION.md file is an engineering analysis document.

It must reflect:
- real implementation decisions
- real architecture choices
- real security reasoning

Do not write generic answers.

---

# Reflection Goals

While building SecureGate:

- observe architecture decisions
- document security tradeoffs
- note middleware behavior
- understand token lifecycle handling
- identify abstraction leaks
- identify technical debt
- think defensively

---

# Reflection Areas

## Authentication
Understand:
- session handling
- protected routes
- verified vs authenticated users

## Security
Understand:
- password hashing
- token expiry
- generic auth errors
- rate limiting
- middleware protection

## Architecture
Understand:
- reusable utilities
- folder structure
- separation of concerns
- scalability decisions

## Defensive Programming
Think about:
- deleted cookies
- expired tokens
- invalid requests
- brute force attacks
- broken sessions

---

# Reflection Writing Rules

The reflection must:
- reference actual SecureGate code
- reference real implementation details
- explain engineering decisions clearly
- explain what could go wrong
- use plain English

Do not:
- paste definitions
- copy generic explanations
- write vague answers

---

# Important Engineering Themes

While building, pay attention to:
- Murphy's Law
- defensive programming
- leaky abstractions
- technical debt
- scalability
- security-first engineering

Your REFLECTION.md should naturally emerge from your implementation experience.