# M02 — System Design, Security & Scalability Audit

Status: implementation blueprint for `redesign/v2`. V1 behavior on `main` remains frozen.

## 1. Security invariant

A React `ProtectedRoute` protects navigation UX only. It is not an authorization boundary. Every private row, mutation, upload, claim, message and admin action must be authorized again at the backend/database layer. The target Supabase implementation therefore uses Auth + PostgreSQL RLS + Storage policies + server-side validation.

Never trust `user_id`, `owner_id`, role, email, campus or verification state sent by the browser. Ownership is derived from the authenticated JWT (`auth.uid()`) and trusted database records.

## 2. Current critical flaws

### P0 — credentials in browser storage
Legacy auth stores/removes `rememberedPassword`. Passwords must never be persisted in localStorage/sessionStorage. Remove password persistence; rely on provider-managed session persistence.

### P0 — route guard is client-only
`ProtectedRoute` checks authentication and email verification in React. A caller can bypass React and access a backend directly if backend rules permit it. Backend RLS must enforce ownership and participant membership.

### P0 — client-side rate limiting is bypassable
The report form uses a localStorage timestamp. Clearing storage, another browser, or direct API calls bypass it. Keep client cooldown only as UX; authoritative limits belong at the API/Edge layer.

### P0 — components directly own persistence/security logic
Large components combine UI, Firebase calls, auth listeners, validation, upload/compression and business rules. This prevents consistent authorization, testing and migration.

### P1 — duplicate auth subscriptions
AuthContext is the canonical session owner, but other components create independent auth listeners. V2 must have one session provider and consumers must use it.

### P1 — unbounded reads / browser filtering
University item lists should not download the entire candidate set and sort/filter it in JS. Query only required columns, use indexes and cursor pagination.

### P1 — stale-request races
Remote search needs debounce plus AbortController/request sequencing. Debounce alone does not prevent an older slow response from replacing a newer result.

### P1 — duplicate reads
Dashboard aggregates and item lists must not independently download the same rows. Use aggregate queries/RPC for counts and a query cache/deduplication layer for shared reads.

## 3. Target application boundaries

```text
src/
  app/
    App.jsx
    router.jsx
    providers.jsx
    routePolicy.js
  components/
    ui/
    layout/
    shared/
  features/
    auth/
      guards/
      services/
    items/
      api/
      components/
      hooks/
    matches/
    claims/
    messaging/
    notifications/
    profile/
  lib/
    api/
    security/
    supabase/
  hooks/
  styles/
```

Dependency rule:

```text
Page -> feature/use-case -> repository -> data provider
                              |
                              +-> Supabase
```

Pages/components never import database clients directly.

## 4. Route policy

Classify routes rather than scattering ad-hoc checks.

- PUBLIC: home, explore, item public detail, universities, about, legal.
- GUEST_ONLY: login, signup, password recovery.
- AUTHENTICATED: profile and account shell.
- VERIFIED: report, matches, claims, messaging.
- OWNER_SCOPED: edit/delete a report. Backend verifies `items.user_id = auth.uid()`.
- PARTICIPANT_SCOPED: conversation/message reads. Backend verifies conversation membership.
- ADMIN: moderation routes. Role comes from trusted server-side profile/claim, never a browser flag.

A private page may render only after auth hydration completes. Unauthorized users return to login with a safe internal `from` path. Never redirect to an arbitrary external URL from route state.

## 5. Backend authorization/RLS blueprint

Examples for M03:

- `profiles`: user reads/updates own private profile; public-safe profile data exposed separately if required.
- `items`: public can select explicitly public columns for OPEN reports; authenticated owner inserts/updates own rows; owner identity is derived from auth.
- `item_private_details`: owner and approved claim workflow only; never included in public item query.
- `claims`: claimant can insert for self; claimant and item owner can read relevant claim; state transitions restricted.
- `conversations`: only members can select.
- `messages`: only conversation members can select/insert; sender id derived from auth.
- `notifications`: recipient only.
- Storage: uploads go under an authenticated ownership path; MIME/size validation is repeated server-side; private evidence uses private buckets/signed access.

Use database constraints for enums/state validity and transactional functions for sensitive state transitions.

## 6. Account/session protection

1. Remove remembered password storage.
2. Use provider-managed secure sessions; do not invent custom auth tokens.
3. Email verification gates sensitive actions, but authorization still uses RLS.
4. Re-authentication should be required later for destructive/security-sensitive actions such as account deletion or changing sensitive identity fields.
5. Do not expose private email/phone in public item records.
6. Add optional MFA as a later hardening feature, not as a substitute for RLS.
7. Logout invalidates provider session and clears only non-sensitive UI cache.

## 7. Rate limiting

Use a server-side token bucket or sliding-window limiter. Client throttles are UX only.

Initial policy to validate with telemetry:

| Action | Initial limit | Key |
| --- | --- | --- |
| password reset/custom auth action | 3 / 15 min | account + IP |
| create report | 5 / 10 min | user |
| edit report | 20 / 10 min | user |
| create claim | 5 / 10 min | user + item |
| send message | 30 / min | user + conversation |
| image upload authorization | 20 / hour | user |
| expensive search | 60 / min | user/IP |

Return `429` with `Retry-After`. Add burst capacity where UX needs it. Do not permanently block an account solely from IP limits. Authentication endpoints also retain provider-native abuse protection.

## 8. Search algorithm and request control

Search flow:

```text
keystroke
 -> normalize input
 -> debounce 300ms
 -> reject too-short/no-op query
 -> cancel previous request
 -> query indexed backend
 -> cursor-limited result set
 -> ignore stale response sequence
 -> cache short-lived result
```

Debounce is appropriate for search/autocomplete. Throttle (100–200ms) is appropriate for high-frequency scroll/resize/map events. Do not throttle report submission; use idempotency + server limit instead.

## 9. Pagination and query design

Do not use unlimited collection reads or large client-side sorting. Prefer keyset/cursor pagination:

```text
ORDER BY event_date DESC, id DESC
WHERE campus_id = :campus
  AND status = 'OPEN'
  AND (event_date, id) < (:cursor_date, :cursor_id)
LIMIT 20
```

Candidate indexes (finalized against real query plans in M03):

- `(campus_id, status, event_date DESC, id DESC)`
- `(user_id, status, created_at DESC)`
- `(category, campus_id, event_date DESC)` where query patterns justify it
- text-search index for normalized title/description if full-text search is used

Avoid speculative indexes: every index increases write/storage cost. Confirm with `EXPLAIN ANALYZE` once PostgreSQL schema exists.

## 10. Lost/found matching algorithm

Use two phases so we do not score the entire database.

### Candidate generation
Filter by opposite report type, same/near campus, compatible category, OPEN state, and bounded date window. This turns N global items into K plausible candidates.

### Ranking
Initial deterministic score (0–100):

```text
category       25
location       20
time proximity 20
title          15
color            8
brand            7
description      5
```

Normalize missing fields so absence does not automatically behave like a mismatch. Persist algorithm version and component scores with generated matches for explainability/tuning. Suggested bands: <40 discard, 40–64 weak, 65–79 possible, >=80 strong. Thresholds are product defaults and must be calibrated from real recovery/false-positive data.

Matching runs asynchronously after report creation rather than blocking the user's report request.

## 11. Idempotency and concurrency

Critical mutations require idempotency:

- create report
- create claim
- recovery confirmation
- notification dispatch

Client generates an operation id; backend stores/recognizes it transactionally. Repeated requests return the existing result instead of duplicating records.

Sensitive state changes use transactions/conditional updates. Example: two claimants cannot both transition one item from CLAIM_PENDING to RECOVERED.

## 12. Background work and backpressure

Request path should remain short:

```text
Create report transaction
 -> success response
 -> enqueue matching job
 -> matching worker
 -> persist candidates
 -> enqueue notifications
 -> notification worker
```

Expensive image processing, matching and bulk notifications do not belong in the interactive request. Use bounded retries with exponential backoff + jitter and a dead-letter/failure strategy. Never recursively fan out unbounded Edge Functions.

## 13. Caching and request deduplication

Cache only where correctness allows it:

- campus/category/reference data: long TTL/versioned
- public search: short TTL
- private account data: user-scoped cache only
- claims/messages: realtime/invalidation oriented, not long-lived cache

Identical in-flight reads should share a promise/request. Mutations invalidate affected cache keys.

Do not cache authorization decisions in the browser as a security control.

## 14. Load balancing and scaling

Do not deploy a custom load balancer in M02. Static frontend/CDN and managed Supabase gateway/database infrastructure are sufficient initially. Adding Nginx/HAProxy now creates operational complexity without a measured bottleneck.

Scale from measurements:

1. CDN/static asset optimization.
2. Indexed bounded queries.
3. Connection pooling/managed DB limits.
4. Queue expensive work.
5. Cache safe hot reads.
6. Observe p95/p99 latency, DB CPU/connections, error/429 rates and queue depth.
7. Add dedicated infrastructure only when measurements identify the constraint.

## 15. Abuse/privacy controls

- Public item DTO excludes private ownership evidence, email and phone.
- Strip image metadata where feasible before public serving.
- Validate upload content server-side; browser MIME is not authoritative.
- Claims need anti-spam limits and state-machine validation.
- Messaging requires participant authorization and report/block hooks.
- Audit security-sensitive transitions without logging passwords/tokens/private evidence.
- Avoid precise location disclosure for sensitive found items; use campus/building-level public location when appropriate.

## 16. Observability/SLO foundation

Measure before scaling:

- request count and error rate by operation
- p50/p95/p99 latency
- DB query latency and slow-query fingerprints
- auth failures and verification funnel
- 429 counts
- upload failures
- queue depth/retry count
- matching candidates/report and acceptance/recovery rate
- duplicate/idempotency conflicts

Use correlation/request IDs across Edge Function logs and asynchronous jobs. Alert on sustained symptoms, not single transient failures.

## 17. M02 implementation sequence

1. Establish app/feature/lib/style boundaries without breaking V1.
2. Introduce route policy and centralized guards.
3. Remove password persistence and duplicate auth ownership.
4. Add generic `useDebouncedValue`, throttle and abortable-request primitives.
5. Introduce repository interfaces so UI no longer imports Firebase directly as features migrate.
6. Add design tokens/UI primitives and app shell.
7. Refactor search/list reads toward bounded/paginated repository contracts.
8. Split report flow into steps/hooks/services.
9. Add tests for route policy, debounce/cancellation, matching score and state transitions.
10. M03 implements Supabase schema, RLS, indexes, Storage policies, Edge Functions and authoritative rate limits.

## 18. Definition of done

M02 is complete only when:

- `main` remains unchanged.
- V2 has explicit architectural boundaries.
- protected-route policy is centralized.
- no password is intentionally persisted by V2.
- one auth/session owner exists.
- components being migrated no longer directly own backend authorization logic.
- search utilities support debounce + cancellation.
- repository contracts are pagination-ready.
- system design/security decisions are documented and testable.
- no claim is made that client-side route guards or cooldowns secure backend data.

M03 then makes those policies authoritative in Supabase/PostgreSQL.