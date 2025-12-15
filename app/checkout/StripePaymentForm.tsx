"use client";

import React from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

type Props = {
  formId: string;
  paymentIntentId: string;
  onSuccess: () => void;
  onError: (message: string | null) => void;
  onSubmittingChange: (submitting: boolean) => void;
};

export default function StripePaymentForm({ formId, paymentIntentId, onSuccess, onError, onSubmittingChange }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError(null);

    if (!stripe || !elements) {
      onError('Payment form is still loading. Please try again.');
      return;
    }

    onSubmittingChange(true);
    try {
      const returnUrl = `${window.location.origin}/checkout/success?payment_intent=${encodeURIComponent(paymentIntentId)}`;

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
        redirect: 'if_required',
      });

      if (result.error) {
        onError(result.error.message || 'Payment failed. Please try again.');
        return;
      }

      const status = result.paymentIntent?.status;
      if (status === 'succeeded' || status === 'processing' || status === 'requires_capture') {
        onSuccess();
        return;
      }

      // For payment methods that redirect, Stripe will have navigated to return_url.
      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      onError(message);
    } finally {
      onSubmittingChange(false);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
    </form>
  );
}
