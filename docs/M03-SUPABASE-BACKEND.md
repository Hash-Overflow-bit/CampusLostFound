# M03 — Supabase backend foundation

## Goal
Move authorization and integrity out of React and into PostgreSQL/RLS while keeping Firebase production paths intact until parity is verified.

## Migration order
1. Apply `001_core_schema.sql`.
2. Apply `002_rls.sql`.
3. Apply `003_auth_storage.sql`.
4. Create/configure Supabase project environment values locally/hosting; never commit service-role keys.
5. Add the Supabase browser client behind a repository boundary.
6. Migrate auth/session in M04.
7. Migrate item/report reads/writes and storage.
8. Migrate claims, matching, conversations, realtime and notifications.
9. Verify parity before removing Firebase.

## Security invariants
- React route guards are UX only.
- `auth.uid()` is the ownership source; browser-supplied owner IDs are never trusted.
- Public `items` rows do not contain contact data or ownership evidence.
- Sensitive data lives in `item_private_details` and is owner-only by RLS.
- Match generation, claim acceptance/rejection, conversation creation, notifications and audit logs are trusted server/RPC operations.
- Storage is private and ownership is encoded in the first path segment.
- Service-role credentials must never ship to the browser.

## Data flow

```text
React
  -> feature repository
     -> Supabase anon client + authenticated JWT
        -> PostgREST / Storage
           -> PostgreSQL RLS + constraints
```

## Scaling baseline
Indexes cover campus/status feeds, owner feeds, candidate matching inputs, claims, messages and unread notifications. Reads should use cursor/keyset pagination rather than unbounded offsets. Matching should generate bounded candidates first and then apply the deterministic scorer.

## Rate limiting
RLS is not rate limiting. Sensitive mutations (claims, uploads, messages, auth-related custom endpoints) should be routed through trusted server/Edge endpoints where token-bucket/sliding-window limits, idempotency keys and abuse telemetry can be enforced.

## Important migration rule
Do not remove Firebase yet. M03 establishes the new database/security foundation; M04+ moves live application paths onto it incrementally.
