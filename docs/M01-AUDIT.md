# CampusLostFound V2 — M01 Audit & Baseline

Status: Complete
Branch: `redesign/v2`
Scope: Read-only audit of V1 plus migration baseline. No V1 runtime behavior changed in M01.

## 1. Current stack

- React 19 + Vite 7
- React Router 6
- Firebase Auth + Firestore + Firebase Hosting
- GitHub Actions Firebase hosting workflows
- Bootstrap plus large page/component CSS files
- React Hook Form, React Icons, React Helmet Async
- Vercel configuration also exists

## 2. Current architecture

The application is primarily page-oriented. `src/App.jsx` owns routing, global SEO, layout decisions and a global report form. Business/data access is spread across pages, auth context, services and Firebase configuration.

Current major areas:

- `src/pages/` — public pages, auth, dashboard, reporting, universities and legal content
- `src/componenets/` — shared and feature UI (directory name is misspelled)
- `src/AuthContext/` — Firebase auth session state
- `src/firebaseConfig/` — Firebase initialization
- `src/services/` — Firebase-backed service logic
- `src/postData/` — data seeding/write utility
- `src/data/` — university/static data
- `src/utils/` — includes Firebase test utilities

## 3. Existing user flow

Public routes currently include home, about, how-it-works, blog, contact, universities, university detail, privacy and terms.

Auth routes include login, signup and forgot password.

Authenticated routes currently include dashboard and report.

`/lost` and `/found` are placeholders, which means discovery is not yet a complete first-class product flow.

## 4. Firebase coupling inventory

Firebase is not isolated behind one repository/data layer. It appears in:

- package dependencies
- Firebase initialization
- AuthContext
- signup/login/password recovery
- dashboard item queries
- report/item persistence
- subscriber/partnership services
- phone verification
- Firebase-specific test utilities
- Vite manual chunks
- HTML resource hints
- Firebase Hosting configuration and GitHub Actions

Implication: Firebase must be migrated feature-by-feature. Removing the dependency first would break V1.

## 5. Architecture problems to fix in V2

### P0 — Backend coupling
UI/features directly know about Firebase APIs. V2 will introduce a Supabase client plus feature repositories/services so pages do not contain database implementation details.

### P0 — Missing domain model
The current product is centered around pages and reports. V2 needs explicit domain concepts: item, report type, match, claim, conversation, message, notification, campus and profile.

### P0 — Authorization model
V2 must use Supabase Row Level Security as the security boundary. Client-side protected routes are UX only and must not be treated as authorization.

### P1 — Routing/app shell
`App.jsx` has too many responsibilities. V2 will move routing to `app/router`, providers to `app/providers`, and shared navigation/layout into an app shell.

### P1 — Component organization
The `componenets` directory should become `components`, split into `ui`, `layout`, and reusable domain components. Feature-specific components should live with their feature.

### P1 — Styling
Large page-specific CSS files make visual consistency expensive. V2 will introduce design tokens, primitives and shared responsive rules before page redesigns.

### P1 — Discovery flow
Lost/found discovery is incomplete. V2 will make Explore/Search a primary route with filters for campus, category, date, location and report type.

### P1 — Recovery flow
A report currently lacks a complete match → claim → verification → conversation → recovered lifecycle. This becomes the main V2 domain flow.

### P2 — Naming/dead/demo code
There are test/demo/legacy artifacts (`TestRoutes`, `ReportDemo`, `App-optimized.css`, Firebase test utilities, etc.). They should be evaluated and removed only after replacement behavior is verified.

### P2 — Deployment duplication
Firebase Hosting and Vercel configuration both exist. Deployment should be intentionally standardized after backend migration rather than changed during M01.

## 6. V1 behavior freeze

Until its V2 replacement is complete, preserve:

- home and public informational routes
- login/signup/logout/password reset
- protected dashboard/report access
- report creation and existing item reads
- university pages/data
- SEO metadata/canonical behavior
- existing production deployment

`main` remains the V1 baseline. V2 work happens on `redesign/v2`.

## 7. Target V2 architecture

```text
src/
  app/
    App.jsx
    router.jsx
    providers.jsx
  components/
    ui/
    layout/
    shared/
  features/
    auth/
    items/
    matches/
    claims/
    messaging/
    notifications/
    profile/
  pages/
    Home/
    Explore/
    Report/
    Item/
    Matches/
    Profile/
  lib/
    supabase/
  hooks/
  utils/
  styles/
    tokens.css
    globals.css
    animations.css
```

Dependency direction:

```text
Pages
  ↓
Features + shared UI
  ↓
Feature repositories/services
  ↓
Supabase client
  ↓
PostgreSQL / Auth / Storage / Realtime
```

## 8. Target product lifecycle

```text
LOST or FOUND report
        ↓
OPEN
        ↓
possible match generated
        ↓
POSSIBLE_MATCH
        ↓
claim submitted
        ↓
CLAIM_PENDING
        ↓
ownership verification + secure conversation
        ↓
RECOVERED
        ↓
CLOSED
```

## 9. Supabase migration boundaries

Migration order:

1. Add Supabase client/config without removing Firebase.
2. Create PostgreSQL schema and RLS policies.
3. Migrate authentication/session handling.
4. Migrate item/report reads and writes.
5. Migrate image storage.
6. Introduce matching and claims.
7. Introduce realtime messaging/notifications.
8. Verify migrated data and feature parity.
9. Remove Firebase runtime dependencies/config/workflows only after no production path uses them.

## 10. Proposed core tables

- `profiles`
- `campuses`
- `items`
- `item_images`
- `matches`
- `claims`
- `conversations`
- `conversation_members`
- `messages`
- `notifications`
- `reports` (moderation/abuse reports)
- `activity_logs`

Exact SQL, indexes, constraints and RLS belong to M03 after the frontend architecture/design foundation is defined.

## 11. UX principles for V2

- Mobile-first reporting; target < 60 seconds for a normal report.
- Two dominant intents: “I lost something” and “I found something”.
- Search/explore available without unnecessary authentication friction.
- Keep identifying details private when they can be used to verify ownership.
- Never expose a user's phone/email publicly by default.
- Status and next action must be obvious on every report/match/claim.
- Recovery is the success metric, not number of posts.

## 12. M01 exit criteria

- [x] Dedicated V2 branch created from `main`.
- [x] Current stack inventoried.
- [x] Current route/product flow reviewed.
- [x] Firebase coupling identified.
- [x] V1 behavior freeze defined.
- [x] Target architecture documented.
- [x] Supabase migration boundaries documented.
- [x] Major UX/domain gaps documented.
- [x] `main` left unchanged.

## Next milestone — M02

Build the V2 frontend foundation without migrating production data yet:

1. establish `app/`, `components/`, `features/`, `lib/` and `styles/` boundaries;
2. introduce design tokens and global styles;
3. build the new app shell/navigation primitives;
4. define the new route map;
5. preserve V1 functionality while the new shell is introduced incrementally.
