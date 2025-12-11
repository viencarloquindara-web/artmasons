"use client";

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '', phone: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || items.length === 0) {
      addToast('Please provide name, email and at least one cart item', 'error');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: items.map((it) => ({ title: it.title, price: it.price, quantity: it.quantity, sku: it.sku, currency: it.currency || 'aed' })),
        success_url: window.location.origin + '/checkout/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: window.location.origin + '/checkout/cancel',
      };

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create checkout session');
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
        return;
      }
      throw new Error('No redirect URL from checkout session');
    } catch (err: any) {
      console.error('Checkout error', err);
      addToast(err.message || 'Checkout failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="font-serif text-4xl font-bold text-[#800000] mb-6">Checkout</h1>
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-4">Your cart is empty.</p>
            <Link href="/artists-a-z" className="text-[#800000] font-bold underline">Continue shopping</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border px-3 py-2 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full border px-3 py-2 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 block w-full border px-3 py-2 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shipping address</label>
              <textarea name="address" value={form.address} onChange={(e) => handleChange(e as any)} className="mt-1 block w-full border px-3 py-2 rounded-md" />
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-serif font-semibold">Subtotal</p>
                </div>
                <div className="font-serif font-bold">AED {subtotal.toLocaleString()}</div>
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full bg-[#800000] text-white px-4 py-3 rounded-md font-bold">
                {loading ? 'Processing...' : 'Pay (Test)'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
