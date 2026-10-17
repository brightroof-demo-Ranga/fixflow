This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Staff sign-in

Dispatchers, technicians, and ops managers sign in at `/sign-in` with the email and password stored on their staff row. There is no identity provider, and single sign-on is not selected. Password length, lockout, and creating the first ops manager account are out of scope.

A matching sign-in sets an httpOnly cookie named `fixflow_session`. The cookie value is a random session id. The database stores only a hash of that id, the staff user, and an expiry 12 hours later. Sign-out deletes that session row and clears the cookie.

After sign-in, a dispatcher opens `/dispatch`, a technician opens `/technician/jobs`, and an ops manager opens `/ops/open-jobs`. Those screens show the sign-in form, and no request data, when there is no session.

## Customer log request

A customer with no account logs a problem at `/requests/new`. The required fields are phone number, system ID, and problem description. Name, site address, email, and photo may be absent. `POST /api/requests` stores the request with source `customer_form`, a new request id, and a create timestamp. The confirmation shows that request id.

The route does not call a Google Sheet, a WhatsApp API, or email. It does not reject weekends, weekdays, 30 November 2026, or 1 December 2026. A second open request for the same phone and system ID is stored as a new row. A system ID that is not already stored is accepted.

Local development uses SQLite at `prisma/dev.db`. `npm test` generates the Prisma client and runs the unit tests.

## Dispatcher assign technician

A signed-in dispatcher assigns a technician at `/dispatch/requests/{id}`. `POST /api/requests/{id}/assignments` inserts an assignment row. The current assignee is the row whose `supersededAt` is empty, and that row's `assignedAt` is the time of that save. The previous current row, if any, receives `supersededAt`. The first assignment on a request that is not assigned sets the status to `assigned`. A later assignment replaces the assignee and leaves the status as it was.

`expectedArrivalAt` is stored on the current row when that save sends one. A save that omits it stores no expected arrival. `GET /api/technicians` returns technician-role staff as id and name. The list has no customer phone numbers or system IDs.

A signed-out caller gets the sign-in challenge and no request data. A technician or an ops manager who assigns writes nothing. Assigning a dispatcher or an ops manager leaves the assignee unchanged. Assigning on a cancelled request leaves the assignee unchanged and the status cancelled. A completed request is left unchanged.

## Technician update job

A signed-in technician opens current jobs at `/technician/jobs` and one job at `/technician/jobs/{id}`. Both screens are usable at 390 CSS pixels wide. `GET /api/technician/jobs` returns only that technician's current assignments, each with its request id. A request assigned to someone else, including one reassigned away, is not listed.

`POST /api/requests/{id}/status` accepts `on_site`, `remote_diagnosis_completed`, or `completed` from the current assignee. On site stores `onSiteAt`. Remote diagnosis completed stores `remoteDiagnosisCompletedAt`. Completed stores `completedAt`, and only when the status is already On site or Remote diagnosis completed. Each timestamp is the server time of that successful save. Status is `cancelled` when `cancelledAt` is set, otherwise `completed` when `completedAt` is set, otherwise whichever of the two response timestamps is later, otherwise `assigned` when a current assignment exists, otherwise `not_assigned`. Each successful change appends a `StatusEvent`.

A submit that never reaches the server writes no timestamp. The next successful save uses the later server time. A technician who is not the current assignee writes nothing, and the assignee stays as it was. A cancelled request stays cancelled. A signed-out caller gets the sign-in challenge. A dispatcher or an ops manager who posts a status writes nothing.

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
