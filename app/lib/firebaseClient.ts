// Firebase client temporarily disabled
// Uncomment to re-enable Firebase client authentication

/*
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

let _auth: any = null;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    initializeApp(clientConfig);
  }
  _auth = getAuth();
}

export const auth = _auth;

export default { auth };
*/

// Placeholder exports while Firebase is disabled
export const auth = null;
const firebaseClient = { auth: null };
export default firebaseClient;
