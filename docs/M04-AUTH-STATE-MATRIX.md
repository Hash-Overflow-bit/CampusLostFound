# M04 Authentication State Matrix

This matrix is the acceptance contract for the V2 authentication flow. React guards improve navigation and UX; database RLS/provider controls remain the security boundary.

| State | Login / Signup / Forgot | Update password | Dashboard / Report | Role route |
|---|---|---|---|---|
| Guest | Allow | Deny unless valid recovery session | Redirect to login | Redirect to login |
| Signed in, email unverified | Redirect away from guest pages; login service rejects normal access | Deny unless recovery intent | Deny; require verification | Deny |
| Verified student | Redirect to dashboard | Deny unless recovery intent | Allow | Only student-allowed routes |
| Verified moderator | Redirect to dashboard | Deny unless recovery intent | Allow | Moderator-allowed routes only |
| Verified admin | Redirect to dashboard | Deny unless recovery intent | Allow | Admin-allowed routes only |
| Supabase PASSWORD_RECOVERY | Not a normal login state | Allow while recovery marker + valid session exist | Do not use recovery state to elevate authorization | Never elevate role |
| Signed out / expired session | Allow guest pages | Deny | Redirect to login | Redirect to login |

## Required invariants

1. Roles come from the trusted profile/database, never signup metadata, localStorage, URL parameters, or component state.
2. Email verification is required before protected application routes.
3. `PASSWORD_RECOVERY` intent is tracked separately from an ordinary authenticated session and cleared after password update, sign-in, OAuth sign-in, or sign-out.
4. Login failures remain generic to reduce account enumeration.
5. Password-reset requests return an enumeration-safe success response.
6. Browser cooldowns are UX only. Provider/server rate limits are required for real abuse protection.
7. React route guards are not authorization. Supabase RLS must independently enforce row ownership, participant access, and privileged operations.
8. A recovery session must never grant moderator/admin privileges or bypass RLS.

## Rate-limit targets

- Login: 10 attempts / 5 minutes per IP/account signal.
- Signup: 5 attempts / 15 minutes.
- Confirmation resend: 3 attempts / 15 minutes.
- Password reset request: 3 attempts / 15 minutes.
- Password update: provider/session constrained plus abuse monitoring.

These limits must be implemented at the authentication provider, gateway, Edge Function, or another trusted server boundary. React timers are not security controls.

## Manual acceptance tests before M04 completion

- New university user signs up and receives confirmation email.
- Unverified user cannot access `/dashboard` or `/report`.
- Verified user can sign in and reach the original safe return path.
- Authenticated user cannot reopen guest-only Login/Signup/Forgot pages.
- Reset request does not reveal whether an account exists.
- Ordinary authenticated Supabase session cannot use `/update-password` as recovery.
- Valid Supabase `PASSWORD_RECOVERY` session can set one new password; recovery intent is consumed afterward.
- Expired/invalid recovery link shows a safe recovery error.
- Student cannot access moderator/admin role routes.
- Moderator cannot access admin-only routes unless explicitly allowed.
- Logout clears application auth state and remembered local credential flags.
