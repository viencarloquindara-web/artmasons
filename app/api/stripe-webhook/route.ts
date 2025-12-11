import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import ordersLib from '../../lib/orders';
// import { firestore } from '../../lib/firebaseAdmin';

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
    // If no webhook secret, accept event without verification (NOT recommended in production)
    const evt = JSON.parse(body);
    console.log('Received stripe event (no verification):', evt.type || evt);
    return NextResponse.json({ received: true });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature || '', webhookSecret);
    console.log('Verified Stripe webhook event:', event.type);

    // Handle events of interest (expand as needed)
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Checkout session completed:', event.data.object);
        // Mark order paid if we have a saved record (Firebase/Firestore temporarily disabled)
        try {
          const sessionObj: any = event.data.object;
          const sessionId = sessionObj.id;
          const result = await ordersLib.markOrderPaid(sessionId, event.data.object);
          console.log('Local order mark result', result);
        } catch (e) {
          console.error('Failed to mark order paid', e);
        }
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }
}
