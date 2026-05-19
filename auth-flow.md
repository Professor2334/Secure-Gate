# docs/AUTH_FLOW.md

# SecureGate Authentication Flow

# Registration Flow

1. User submits:
   - name
   - email
   - password

2. Validate input using Zod

3. Check for duplicate email

4. Hash password using bcryptjs

5. Save user to database

6. Generate verification token

7. Save token to database

8. Send verification email using Resend

9. Redirect user to verification notice

---

# Login Flow

1. User submits:
   - email
   - password

2. Find user by email

3. Compare password using bcrypt.compare()

4. Reject invalid credentials safely

5. Reject unverified users

6. Create JWT session

7. Redirect authenticated user to dashboard

---

# Dashboard Protection Flow

1. Middleware checks session

2. If session missing:
   - redirect to login

3. If user not verified:
   - redirect to verification page

4. Allow authenticated verified users

---

# Email Verification Flow

1. User clicks verification link

2. Find verification token

3. Check token expiry

4. If expired:
   - show expired state
   - allow resend verification

5. If valid:
   - verify user
   - delete token
   - redirect to dashboard

---

# Forgot Password Flow

1. User submits email

2. Generate reset token

3. Save token in database

4. Send reset email

5. Return generic success message

IMPORTANT:
Never reveal whether email exists.

---

# Reset Password Flow

1. User opens reset link

2. Validate token

3. Check expiry

4. Accept new password

5. Hash new password

6. Update database

7. Delete token

8. Redirect to login