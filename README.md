This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Stripe Test Integration (local)

This project includes a simple serverless API route to create a Stripe Checkout Session in test mode: `/api/create-checkout-session`.

Steps to test locally:

- Install new dependency:

```bash
npm install
```

- Set environment variable `STRIPE_SECRET_KEY` (your Stripe test secret key) in your shell or in a `.env.local` file:

```
STRIPE_SECRET_KEY=sk_test_...
```

- Start dev server:

```bash
npm run dev
```

- Add items to the cart and use the Checkout page. The app will call the API to create a Checkout Session and redirect you to Stripe's hosted test checkout.

Note: This is a minimal integration for testing purposes. For production, follow Stripe's security and webhook guidance.

### Webhook (optional)

To receive server-side confirmation of payment and fulfill orders, set up a webhook endpoint and configure the `STRIPE_WEBHOOK_SECRET` environment variable. Example endpoint in this repo: `/api/stripe-webhook`.

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

When running locally you can use `stripe listen --forward-to localhost:3000/api/stripe-webhook` to forward test events to your local dev server.
