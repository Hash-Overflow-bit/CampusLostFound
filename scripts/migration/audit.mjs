import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'campusfoundlost';

initializeApp({ credential: applicationDefault(), projectId: FIREBASE_PROJECT_ID });
const auth = getAuth();
const db = getFirestore();

async function listAllUsers() {
  const users = [];
  let pageToken;
  do {
    const page = await auth.listUsers(1000, pageToken);
    users.push(...page.users);
    pageToken = page.pageToken;
  } while (pageToken);
  return users;
}

function classifyImage(value) {
  if (!value || typeof value !== 'string') return 'none';
  if (value.startsWith('data:')) return 'data-url';
  try {
    const url = new URL(value);
    if (url.hostname.includes('firebasestorage.googleapis.com') || url.hostname.includes('storage.googleapis.com')) return 'firebase-storage';
    return 'external-url';
  } catch {
    return 'other';
  }
}

async function main() {
  console.log(`\n=== Firebase migration audit: ${FIREBASE_PROJECT_ID} ===\n`);
  const [users, profiles, items, universities, nust, umt] = await Promise.all([
    listAllUsers(),
    db.collection('Signup User').get(),
    db.collection('items').get(),
    db.collection('universities').get(),
    db.collection('subscribers_NUST').get(),
    db.collection('subscribers_UMT').get(),
  ]);

  const authIds = new Set(users.map((u) => u.uid));
  let linkedProfiles = 0;
  let orphanProfiles = 0;
  for (const doc of profiles.docs) {
    const uid = doc.data().userId;
    if (uid && authIds.has(uid)) linkedProfiles += 1;
    else orphanProfiles += 1;
  }

  let validItems = 0;
  let orphanItems = 0;
  let itemsWithoutUserId = 0;
  const images = { none: 0, 'data-url': 0, 'firebase-storage': 0, 'external-url': 0, other: 0 };
  for (const doc of items.docs) {
    const data = doc.data();
    if (!data.userId) itemsWithoutUserId += 1;
    else if (authIds.has(data.userId)) validItems += 1;
    else orphanItems += 1;
    images[classifyImage(data.imageUrl || data.image)] += 1;
  }

  console.log(`Auth users: ${users.length}`);
  console.log(`Signup User profiles: ${profiles.size}`);
  console.log(`Profiles linked to Auth: ${linkedProfiles}`);
  console.log(`Profiles without matching Auth: ${orphanProfiles}`);
  console.log(`Items: ${items.size}`);
  console.log(`Items with valid Auth owner: ${validItems}`);
  console.log(`Items with missing Auth owner: ${orphanItems}`);
  console.log(`Items without userId: ${itemsWithoutUserId}`);
  console.log(`Universities: ${universities.size}`);
  console.log(`Subscribers: ${nust.size + umt.size}`);
  console.log('Image references:', images);
  console.log('\nRead-only audit complete. No Firebase data was modified.\n');
}

main().catch((error) => {
  console.error('Audit failed:', error.message);
  process.exitCode = 1;
});
