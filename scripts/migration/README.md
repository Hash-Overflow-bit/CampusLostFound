# Firebase → Supabase migration

This folder contains the controlled legacy-data migration tooling for CampusLostFound.

## Known source inventory

- Firebase project: `campusfoundlost`
- Firebase Auth: 148 users
- Firestore `Signup User`: 61 profiles (59 linked to Auth, 2 orphaned)
- Firestore `items`: 19 items (18 linked to Auth, 1 orphaned)
- Firestore `universities`: 43
- Subscribers: 4
- Item images: 6 data URLs stored in Firestore; 13 items have no image
- No Cloud Storage bucket was found

## Safety rules

1. Firebase is read-only during migration. Never delete source records.
2. Always run `audit.mjs` before any write operation.
3. Migration scripts default to dry-run. A write requires an explicit `--apply` flag.
4. Never commit Firebase Auth exports, service-role keys, ADC files, generated migration reports, or user data.
5. Orphaned profiles/items are quarantined for review instead of silently discarded.
6. Verify counts and ownership after every phase.
7. Do not retire Firebase until authentication, profiles, items, images and ownership have passed verification.

## Local prerequisites

- Google Application Default Credentials authenticated for `campusfoundlost`.
- `firebase-admin` installed locally for migration tooling.
- Supabase server-side credentials supplied only through local environment variables when an apply phase is approved.

## Planned phases

1. `audit.mjs` — read-only Firebase inventory and relationship checks.
2. Auth migration — migrate users using the supported Supabase/Firebase migration method after compatibility is verified.
3. Profiles — map `Signup User` to `profiles` using the Auth UID mapping.
4. Items — map Firestore items to the V2 `items` schema while preserving ownership.
5. Images — decode the six data URLs and upload them to private Supabase Storage, then create `item_images` rows.
6. Orphans — produce a review report for the two orphan profiles and one orphan-owned item.
7. `verify.mjs` — compare source/target counts and ownership and report mismatches.

Do not run a write phase until its dry-run output has been reviewed.