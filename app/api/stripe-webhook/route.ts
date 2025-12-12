import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import ordersLib from '../../lib/orders';
// import { firestore } from '../../lib/firebaseAdmin';

export const runtime = 'nodejs';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2022-11-15' }) : null;

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured (STRIPE_SECRET_KEY)' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  if (!webhookSecret) {
    // Only allow unverified events in development.
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Stripe webhook not configured (STRIPE_WEBHOOK_SECRET)' }, { status: 500 });
    }

    const evt = JSON.parse(body);
    console.warn('Received stripe event WITHOUT verification (development only):', evt.type || evt);
    return NextResponse.json({ received: true });
  }

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('Verified Stripe webhook event:', event.type);

    // Handle events of interest (expand as needed)
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Checkout session completed:', event.data.object);
        // Mark order paid if we have a saved record (Firebase/Firestore temporarily disabled)
        try {
          const sessionObj = event.data.object as Stripe.Checkout.Session;
          const sessionId = sessionObj.id;
          const result = await ordersLib.markOrderPaid(sessionId, sessionObj);
          console.log('Local order mark result', result);
        } catch (e) {
          console.error('Failed to mark order paid', e);
        }
        break;
      case 'checkout.session.async_payment_failed':
        try {
          const sessionObj = event.data.object as Stripe.Checkout.Session;
          const sessionId = sessionObj.id;
          const result = await ordersLib.markOrderFailed(sessionId, sessionObj);
          console.log('Local order mark failed result', result);
        } catch (e) {
          console.error('Failed to mark order failed', e);
        }
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed.', message);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }
}
