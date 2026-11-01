# M04 Authentication & Authorization Audit

## Critical findings

1. Login still calls Firebase directly, bypassing the backend-agnostic auth boundary.
2. Signup is tightly coupled to Firebase Auth + Firestore and stores a serialized auth user in sessionStorage.
3. Signup uses the error channel for success/verification messages and uses browser alerts in the verification flow.
4. Forgot Password logs account identifiers/auth objects and exposes raw provider errors through alert().
5. Email verification completion is browser-driven and Firestore profile creation happens only after a manual client-side verification check.
6. Guest-only routes are declared in routePolicy but the router does not enforce them.
7. Route authorization only understands authenticated/verified. Role-aware route policy is missing.
8. Client-side rate limiting is not a security boundary. Authentication throttling must be enforced by the auth provider/server/edge layer. UI cooldowns are only an additional abuse/UX control.
9. Authentication errors need normalization so provider internals and account-enumeration-sensitive details are not leaked.
10. Redirect destinations must remain internal-only and role/access checked after authentication.

## Target flow

### Signup

validate -> rate-limit/cooldown -> create account -> send confirmation email -> confirmation-pending screen -> verified session -> profile/campus bootstrap -> dashboard

Never store passwords. Do not serialize provider user objects into web storage. Store only non-sensitive UX state when necessary.

### Login

validate -> rate-limit/cooldown -> authenticate -> require confirmed email -> load trusted profile/role -> authorize destination -> redirect

### Forgot password

validate -> rate-limit/cooldown -> request reset -> always show neutral success message -> reset callback -> establish recovery session -> change password

The forgot-password response must not reveal whether an email address exists.

### Authorization

Frontend guards are UX only. Supabase RLS/database policies are authoritative for data access. Roles are loaded from the trusted profile, never accepted from browser input.

Route access levels:
- public
- guest-only
- authenticated
- verified
- role restricted

## Rate-limit policy

Provider/server enforcement is required. Suggested starting limits:
- login: 10 attempts / 5 minutes per IP/account key
- signup: 5 attempts / 15 minutes per IP
- resend confirmation: 3 / 15 minutes per account/IP
- forgot password: 3 / 15 minutes per account/IP

The browser may additionally enforce short cooldowns to prevent accidental repeated submissions, but this must never be described as the security control.

## Message policy

Use inline accessible status components with `role=status` for success/info and `role=alert` for errors. Do not use alert(). Do not show raw Firebase/Supabase messages. Login should use a generic invalid-credentials message. Password reset should always return the same neutral success message after an accepted request.
