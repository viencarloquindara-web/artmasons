"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import Link from 'next/link';

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const { addToast } = useToast();
  const [id] = useState(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get('payment_intent') || params.get('session_id');
    if (urlId) return urlId;
    try {
      const stored = window.sessionStorage.getItem('last_payment_intent');
      return stored || null;
    } catch {
      return null;
    }
  });

  const [status, setStatus] = useState<'checking' | 'paid' | 'pending' | 'not_found' | 'error'>(() =>
    id ? 'checking' : 'not_found'
  );

  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!id) {
      if (!notifiedRef.current) {
        addToast('No payment reference found in return URL', 'error');
        notifiedRef.current = true;
      }
      return;
    }

    (async () => {
      try {
        const queryKey = id.startsWith('pi_') ? 'payment_intent' : 'session_id';
        const res = await fetch(`/api/order-status?${queryKey}=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (res.ok && data.status === 'paid') {
          setStatus('paid');
          clearCart();
          try {
            if (typeof window !== 'undefined') window.sessionStorage.removeItem('last_payment_intent');
          } catch {
            // ignore
          }
          if (!notifiedRef.current) {
            addToast('Payment confirmed — your cart has been cleared', 'success');
            notifiedRef.current = true;
          }
        } else if (data.status === 'pending') {
          setStatus('pending');
          if (!notifiedRef.current) {
            addToast('Payment is pending. We will update your order shortly.', 'info');
            notifiedRef.current = true;
          }
        } else if (data.status === 'not_found' || data.status === 'failed') {
          setStatus('not_found');
          if (!notifiedRef.current) {
            addToast('Order not found on server', 'error');
            notifiedRef.current = true;
          }
        } else {
          setStatus('error');
          if (!notifiedRef.current) {
            addToast('Unable to verify payment status', 'error');
            notifiedRef.current = true;
          }
        }
      } catch (e: unknown) {
        console.error('Status check failed', e);
        setStatus('error');
        if (!notifiedRef.current) {
          addToast('Unable to verify payment status', 'error');
          notifiedRef.current = true;
        }
      }
    })();
  }, [id, clearCart, addToast]);

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
        <h1 className="font-serif text-4xl font-bold text-[#800000] mb-4">Thank you — Order received</h1>
        {status === 'checking' && <p className="mb-6 text-gray-600">Verifying payment...</p>}
        {status === 'paid' && <p className="mb-6 text-gray-700">Your payment was successful. We have received your order and will process it shortly.</p>}
        {status === 'pending' && <p className="mb-6 text-gray-600">Payment is pending. If this doesn’t update shortly, contact support.</p>}
        {status === 'not_found' && <p className="mb-6 text-gray-700">We couldn&apos;t find your order on the server. If you were charged, contact support.</p>}
        {status === 'error' && <p className="mb-6 text-gray-700">There was an error verifying your payment. Contact support if needed.</p>}
        <Link href="/" className="inline-block bg-[#800000] text-white px-6 py-3 rounded-md font-bold">Return to shop</Link>
      </div>
    </main>
  );
}
