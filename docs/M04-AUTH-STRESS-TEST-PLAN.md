# M04 Authentication Adversarial / Stress Test Gate

This document separates code-review results from tests that require an authorized staging Supabase/Firebase project. Never run load tests against production without an explicit maintenance window and provider approval.

## Required staging tests before M04 production approval

| Area | Scenario | Expected result |
| --- | --- | --- |
| Login | repeated invalid passwords from one client | provider/server throttles requests; UI remains generic |
| Login | invalid passwords distributed across fresh browser sessions | browser cooldown is irrelevant; provider/server protection still applies |
| Login | unknown email vs wrong password | externally indistinguishable response |
| Signup | repeated signup attempts | provider/server signup/email limits engage |
| Signup | approved email for a different selected university | rejected before signup; DB still derives campus from confirmed email |
| Signup | unapproved domain | rejected |
| Verification | resend confirmation repeatedly | provider/server email rate limit engages |
| Verification | unconfirmed account accesses campus route | denied |
| Verification | confirmed email with unsupported campus domain | no trusted campus; campus routes denied |
| Recovery | repeated reset requests | generic response; provider/server email rate limit engages |
| Recovery | normal authenticated session opens update-password | password update denied without PASSWORD_RECOVERY intent |
| Recovery | valid recovery link | one recovery flow succeeds |
| Recovery | reuse recovery state after success | denied; recovery session is signed out |
| Recovery | expired/invalid link | denied without account disclosure |
| Authorization | browser attempts role/admin/profile escalation | denied by DB privileges/RLS |
| Authorization | browser supplies another campus_id | ignored/denied; trusted campus derived server-side |
| Authorization | cross-campus item/claim/message reads | denied by RLS |

## Rate-limit acceptance targets

Client-side cooldowns are UX only and MUST NOT be counted as security controls. Production approval requires provider/server-side controls for at least:

- login/password attempts
- signup attempts
- confirmation-email resend
- password-reset email
- OAuth abuse where applicable

Record the configured Supabase Auth limits and observed HTTP/provider responses in the final test report. If custom limits are required beyond the provider controls, proxy the sensitive operation through an authorized server/Edge layer with IP/account-aware throttling. Do not place service-role credentials in the browser.

## Load-test safety

Use staging test accounts and controlled source IPs. Start with low concurrency and increase gradually. Stop on unexpected email volume, provider warnings, elevated error rates, or resource saturation. Do not send verification/reset mail to third-party addresses.

## Current code-review status

- Generic login errors: PASS
- Unverified login/session rejection: PASS
- Guest/verified/campus/role route separation: PASS by static review
- Trusted role/campus ownership: PASS by migration/policy review
- University selection vs email domain: PASS after M04 validation hardening
- Recovery intent requirement: PASS at application layer
- Recovery session terminated after password update: PASS after M04 hardening
- Environment-aware auth redirect origin: PASS after M04 hardening
- Provider-side rate limiting: NOT VERIFIED until staging configuration is inspected/tested
- Real email delivery/expiry behavior: NOT VERIFIED until staging test
- Concurrent request/load behavior: NOT VERIFIED until staging test

M04 must not be marked production-complete solely from frontend cooldown behavior or static code review.
