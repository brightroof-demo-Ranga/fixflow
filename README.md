This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Staff sign-in

Dispatchers, technicians, and ops managers sign in at `/sign-in` with the email and password stored on their staff row. There is no identity provider, and single sign-on is not selected. Password length, lockout, and creating the first ops manager account are out of scope.

A matching sign-in sets an httpOnly cookie named `fixflow_session`. The cookie value is a random session id. The database stores only a hash of that id, the staff user, and an expiry 12 hours later. Sign-out deletes that session row and clears the cookie.

After sign-in, a dispatcher opens `/dispatch`, a technician opens `/technician/jobs`, and an ops manager opens `/ops/open-jobs`. Those screens show the sign-in form, and no request data, when there is no session.

## Customer log request

A customer with no account logs a problem at `/requests/new`. The required fields are phone number, system ID, and problem description. Name, site address, email, and photo may be absent. `POST /api/requests` stores the request with source `customer_form`, a new request id, and a create timestamp. The confirmation shows that request id.

The route does not call a Google Sheet, a WhatsApp API, or email. It does not reject weekends, weekdays, 30 November 2026, or 1 December 2026. A second open request for the same phone and system ID is stored as a new row. A system ID that is not already stored is accepted.

Local development uses SQLite at `prisma/dev.db`. `npm test` generates the Prisma client and runs the unit tests.

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
