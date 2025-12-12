// Firebase Admin temporarily disabled
// Uncomment to re-enable Firebase Admin SDK

/*
// Server-only wrapper for firebase-admin.
// Avoid importing `firebase-admin` at module-eval time so this file can be
// safely referenced from code that runs in the browser during build.

// Make TypeScript happy when using `require` in this file.
declare var require: any;

let admin: any = null;
let _auth: any = null;
let _firestore: any = null;

if (typeof window === 'undefined') {
  try {
    // Use require to avoid ESM static import that some bundlers try to include in client
    // bundles. This keeps this module safe to import from files that are bundled for
    // the browser (they'll get null exports instead of a hard failure).
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    admin = require('firebase-admin');

    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (admin && !admin.apps?.length) {
      if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        console.warn('Firebase Admin not fully configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.');
      } else {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey,
          }),
        });
      }
    }

    _auth = admin && admin.auth ? admin.auth() : null;
    _firestore = admin && admin.firestore ? admin.firestore() : null;
  } catch (e: any) {
    // If require/import fails, log a friendly message but don't throw — server
    // runtime that doesn't have firebase-admin installed can still run.
    // Keep exports as null so callers can handle missing configuration.
    // eslint-disable-next-line no-console
    console.warn('Could not initialize firebase-admin:', e && e.message ? e.message : e);
    admin = null;
    _auth = null;
    _firestore = null;
  }
}

export const authAdmin = _auth;
export const firestore = _firestore;

export default admin;
*/

// Placeholder exports while Firebase is disabled
export const authAdmin = null;
export const firestore = null;
const firebaseAdmin = null;
export default firebaseAdmin;
