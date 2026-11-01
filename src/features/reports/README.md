# Reports feature boundary

The legacy `componenets/reportForm/ReportItemForm.jsx` mixes UI, auth listeners, Firestore, validation, camera DOM, compression and state. V2 moves those responsibilities into this feature incrementally so V1 behavior can remain operational while Firebase is still active.

## Dependency rule

`components -> hooks/domain -> repository/services -> Firebase/Supabase adapter`

UI components must not import Firebase directly. Domain validation must not manipulate DOM. Repositories must not contain presentation state. Authentication comes from the single application auth provider, never a component-local auth listener.

## Current extracted modules

- `reportModel.js`: draft/domain helpers and university resolution.
- `reportValidation.js`: normalization and client validation. This improves UX only; M03 database constraints/RLS are authoritative.
- `hooks/useReportDraft.js`: report state management.
- `services/imageService.js`: image validation/compression/preview lifecycle.
- `repositories/firebaseReportRepository.js`: temporary Firebase persistence adapter.

## Planned UI split

- `ReportFlow`: orchestration/submission only.
- `ReportTypeStep`: lost/found choice.
- `ItemDetailsStep`: title/category/description.
- `LocationStep`: campus location/date.
- `PhotoStep`: upload/camera.
- `ContactStep`: private contact preferences during Firebase compatibility period.
- `ReviewStep`: review and submit.

In M03 the Firebase repository is replaced with a Supabase repository without changing feature UI contracts.
