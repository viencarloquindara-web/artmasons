import { NextResponse } from 'next/server';
import ordersLib from '../../lib/orders';
import { getStripe } from '../../lib/stripe';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  const order = ordersLib.findOrderBySession(sessionId);
  if (!order) {
    return NextResponse.json({ status: 'not_found' }, { status: 404 });
  }

  // If pending, opportunistically confirm with Stripe to reduce reliance on webhooks during dev.
  if (order.status === 'pending') {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid' || session.payment_status === 'no_payment_required') {
        const updated = ordersLib.markOrderPaid(sessionId, {
          id: session.id,
          payment_status: session.payment_status,
          status: session.status,
          amount_total: session.amount_total,
          currency: session.currency,
        });
        return NextResponse.json({ status: updated?.status || 'paid' });
      }

      if (session.status === 'expired') {
        // Keep it simple: report failed but don't mutate if you prefer.
        return NextResponse.json({ status: 'failed' });
      }
    } catch {
      // If Stripe isn't configured, fall back to local file.
    }
  }

  return NextResponse.json({ status: order.status });
}
