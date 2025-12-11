// Admin helpers temporarily disabled (depends on Firebase)
// Uncomment to re-enable Firebase-based admin verification

/*
import { NextResponse } from 'next/server';
import { authAdmin, firestore } from './firebaseAdmin';

export async function verifyAdminFromRequest(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) return { ok: false, message: 'Missing authorization token' };
    const idToken = authHeader.replace('Bearer ', '');
    if (!authAdmin) return { ok: false, message: 'Firebase Admin not configured' };
    const decoded = await authAdmin.verifyIdToken(idToken).catch(() => null);
    if (!decoded || !decoded.uid) return { ok: false, message: 'Invalid token' };

    // Check Firestore admins collection
    if (firestore) {
      try {
        const doc = await firestore.collection('admins').doc(decoded.uid).get();
        if (doc && doc.exists) return { ok: true, uid: decoded.uid, email: decoded.email };
      } catch (e) {
        // ignore and fallthrough to env check
      }
    }

    // Fallback: allow if UID present in ADMIN_UIDS env var (comma-separated)
    const allowed = (process.env.ADMIN_UIDS || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (allowed.includes(decoded.uid)) return { ok: true, uid: decoded.uid, email: decoded.email };

    return { ok: false, message: 'Not an admin' };
  } catch (e: any) {
    return { ok: false, message: e?.message || String(e) };
  }
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 });
}
*/

import { NextResponse } from 'next/server';

// Placeholder exports while Firebase is disabled
export async function verifyAdminFromRequest(req: Request) {
  return { ok: false, message: 'Firebase temporarily disabled' };
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 });
}
