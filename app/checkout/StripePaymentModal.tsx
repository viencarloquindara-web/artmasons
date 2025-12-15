"use client";

import React, { useEffect, useId, useMemo, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { X } from 'lucide-react';
import StripePaymentForm from './StripePaymentForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

type Props = {
  open: boolean;
  clientSecret: string | null;
  paymentIntentId: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function StripePaymentModal({ open, clientSecret, paymentIntentId, onClose, onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const resetTimer = window.setTimeout(() => {
      setError(null);
      setSubmitting(false);
    }, 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(resetTimer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const reactId = useId();
  const formId = useMemo(() => `stripe-payment-form-${reactId.replace(/:/g, '')}`, [reactId]);
  const ready = Boolean(publishableKey && clientSecret && paymentIntentId);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl max-h-[90vh] bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="font-serif text-xl font-bold text-gray-900">Secure payment</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
              aria-label="Close payment modal"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-6 py-5 overflow-y-auto flex-1">
            {!publishableKey ? (
              <p className="font-serif text-sm text-red-600">Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.</p>
            ) : !clientSecret || !paymentIntentId ? (
              <p className="font-serif text-sm text-gray-600">Loading payment form…</p>
            ) : (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm
                  formId={formId}
                  paymentIntentId={paymentIntentId}
                  onSuccess={onSuccess}
                  onError={setError}
                  onSubmittingChange={setSubmitting}
                />
              </Elements>
            )}

              <p className="mt-4 font-serif text-xs text-gray-500">Payments are processed securely by Stripe.</p>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              {error && <p className="mb-3 font-serif text-sm text-red-600">{error}</p>}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg border border-gray-300 font-serif font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form={formId}
                  disabled={!ready || submitting}
                  className="px-4 py-2 rounded-lg bg-[#800000] text-white font-serif font-bold hover:bg-[#600000] disabled:opacity-60"
                >
                  {submitting ? 'Paying…' : 'Pay now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
