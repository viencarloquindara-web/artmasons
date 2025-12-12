"use client";

import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import Link from 'next/link';

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const { addToast } = useToast();
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('session_id');
  });

  const [status, setStatus] = useState<'checking' | 'paid' | 'pending' | 'not_found' | 'error'>(() =>
    sessionId ? 'checking' : 'not_found'
  );

  useEffect(() => {
    if (!sessionId) {
      addToast('No session id found in return URL', 'error');
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/order-status?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (res.ok && data.status === 'paid') {
          setStatus('paid');
          clearCart();
          addToast('Payment confirmed — your cart has been cleared', 'success');
        } else if (data.status === 'pending') {
          setStatus('pending');
          addToast('Payment is pending. We will update your order shortly.', 'info');
        } else if (data.status === 'not_found' || data.status === 'failed') {
          setStatus('not_found');
          addToast('Order not found on server', 'error');
        } else {
          setStatus('error');
          addToast('Unable to verify payment status', 'error');
        }
      } catch (e: unknown) {
        console.error('Status check failed', e);
        setStatus('error');
        addToast('Unable to verify payment status', 'error');
      }
    })();
  }, [sessionId, clearCart, addToast]);

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
        <h1 className="font-serif text-4xl font-bold text-[#800000] mb-4">Thank you — Order received</h1>
        {status === 'checking' && <p className="mb-6">Verifying payment...</p>}
        {status === 'paid' && <p className="mb-6">Your payment was successful. We have received your order and will process it shortly.</p>}
        {status === 'pending' && <p className="mb-6">Payment is pending. If this doesn’t update shortly, contact support.</p>}
        {status === 'not_found' && <p className="mb-6">We couldn&apos;t find your order on the server. If you were charged, contact support.</p>}
        {status === 'error' && <p className="mb-6">There was an error verifying your payment. Contact support if needed.</p>}
        <Link href="/" className="inline-block bg-[#800000] text-white px-6 py-3 rounded-md font-bold">Return to shop</Link>
      </div>
    </main>
  );
}
