# M02 code cleanup rules

## Problem
Legacy code groups files by technical type and lets components own unrelated responsibilities. The strongest example is `ReportItemForm.jsx` (~41 KB): it subscribes to auth, validates and sanitizes input, manipulates camera DOM, compresses images, writes Firestore documents, performs fake client-side rate limiting and renders the form.

## V2 rule: feature ownership
A feature owns its domain code. Shared visual primitives live in `components/ui`; layout lives in `components/layout`; infrastructure lives in `lib`; feature-specific UI/hooks/services/repositories live under `features/<feature>`.

```text
src/
  app/                  composition, routing, providers
  components/
    layout/             application layout only
    ui/                 reusable presentation primitives
    shared/             cross-feature composed UI
  features/
    auth/
    items/
    reports/
    matches/
    claims/
    messaging/
    notifications/
    profile/
  lib/                  infrastructure adapters/utilities
  hooks/                truly cross-feature hooks only
  styles/               tokens/global/animations
```

## Import boundaries
1. UI must not import Firebase/Supabase clients directly.
2. Pages compose features; pages do not implement persistence.
3. Feature repositories are the only feature code allowed to know persistence implementation details.
4. Feature hooks may depend on domain helpers and repository interfaces, never legacy page components.
5. `components/ui` cannot import from `features`.
6. Auth state has one provider; no component-local auth subscriptions.
7. Client validation is UX, not authorization/security.
8. Ownership and participant access must be enforced by backend rules/RLS.
9. Do not create another generic `utils` dumping ground; helpers stay with their owning feature unless genuinely cross-cutting.

## Migration rule
Do not mass-rename `src/componenets` while V1 imports depend on it. Move one dependency graph at a time, update consumers, verify, then delete the legacy module. This prevents a cosmetic cleanup from becoming a production regression.

## Definition of clean
A presentation component should generally receive data/callbacks and render. A feature orchestrator coordinates a use case. A repository performs persistence. A service performs an external/technical operation. Domain helpers contain deterministic business rules. These boundaries are what allow Firebase to be replaced by Supabase without rewriting the entire UI.
