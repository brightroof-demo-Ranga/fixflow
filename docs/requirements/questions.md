# Clarifying questions — BrightRoof service calls

Source: `docs/intake/2026-10-09-brightroof-request.md` (Nirosha Perera, Head of Operations).

Workshop answers are in `docs/intake/2026-10-14-workshop-notes.md`. Phase 2 requirements live under `docs/requirements/` (PRD, epics, stories, traceability). Items with no acceptance criterion are out of scope for MVP; see the out-of-scope list in `PRD.md`.

For each question: **why it matters** and a **suggested default** if they have no strong preference. Defaults are not decisions.

---

## Scope

1. **What must ship in the first version vs later?** Customer log, assign, technician phone updates, management view, and photos were all named. Job duration, workload, and 24-hour proof were named as problems.
   - Why it matters: Budget is limited and they asked to start small; packing every problem into MVP will miss December.
   - Suggested default: MVP = log a request (with optional photo), assign a technician, technician updates status from a phone, dispatcher/ops can see open jobs. Later = SLA proof reports, workload balancing, customer self-serve “when is someone coming?”, WhatsApp/hotline capture.

2. **Do we replace the Google Sheet in MVP, or run alongside it?**
   - Why it matters: Dual systems lose calls again; a hard cutover needs a migration and training plan.
   - Suggested default: Replace the sheet for new requests on go-live; keep the old sheet read-only for history.

3. **Is customer self-service in MVP, or only staff logging on the customer’s behalf?**
   - Why it matters: “Customers can log a problem” vs today’s hotline/WhatsApp changes who uses the first UI and how accounts work.
   - Suggested default: Staff log requests in MVP; a simple customer web form is next if December still allows.

4. **Are photos required, optional, or later?**
   - Why it matters: Photos were “would help a lot” but add upload, storage, and phone camera work.
   - Suggested default: Optional photo on create and on technician update in MVP.

5. **Is proving the 24-hour critical-fault response in MVP or a later report?**
   - Why it matters: Warranty proof needs timestamps, a definition of “respond”, and a critical flag — more than a simple board.
   - Suggested default: Capture created/assigned/first-update times in MVP; a one-page SLA report in the next slice.

---

## Users and roles

6. **Which roles exist on day one?** Email names customer, coordinator, technician, and management (Nirosha / ops).
   - Why it matters: Permissions and screens depend on this; extra roles slow MVP.
   - Suggested default: Customer (or staff acting for them), Dispatcher (coordinator), Technician, Ops manager.

7. **How do people sign in?** BrightRoof accounts, email magic link, shared dispatcher login, etc.
   - Why it matters: 2,000 customers and 12 technicians is a different identity problem than four office users.
   - Suggested default: Email-and-password for staff in MVP; customers use a link or staff-created request, not a full customer portal yet.

8. **Who is allowed to assign and reassign jobs?**
   - Why it matters: “We can assign it” is ambiguous; technicians self-picking changes the dispatcher model.
   - Suggested default: Dispatcher assigns and reassigns; technicians cannot take unassigned jobs themselves in MVP.

9. **Do customers get their own login, or only a tracking link after a request exists?**
   - Why it matters: This decides account creation for 2,000 households and the “when is someone coming?” loop.
   - Suggested default: No customer accounts in MVP; status shown to staff, who tell the customer (or a later tracking link).

---

## Workflow

10. **What statuses does a request go through?**
    - Why it matters: Technician phone updates and the management view need a shared lifecycle.
    - Suggested default: New → Assigned → En route → On site → Done (and Cancelled).

11. **What does a technician update from their phone?** Status only, notes, photos, time on site, parts?
    - Why it matters: Scope of the mobile flow and what “how long jobs take” can mean later.
    - Suggested default: Status + optional note + optional photo; record timestamps automatically when status changes.

12. **How is “someone is coming” communicated today, and what should the system do?**
    - Why it matters: Customers keep calling; in-app status, SMS, WhatsApp, or dispatcher call are different builds.
    - Suggested default: MVP shows ETA/status to dispatcher only; customer notifications later.

13. **Weekend and after-hours: who logs and assigns when the coordinator is off?**
    - Why it matters: Calls get lost especially on weekends; a form without an on-call dispatcher still stalls assignment.
    - Suggested default: Customer/staff can create requests 24/7; assignment waits for the next dispatcher shift unless an on-call person is named.

14. **Can one request cover multiple site visits, or is each visit a new request?**
    - Why it matters: Job duration and overload stats go wrong if revisits are new tickets or hidden notes.
    - Suggested default: One request until Done; extra visits stay on the same request as new status cycles or a “reopened” status later.

---

## SLAs and data

15. **What counts as “respond” for the 24-hour critical-fault warranty?** Acknowledge, assign, technician on site, or first customer contact?
    - Why it matters: They cannot prove the contract today; the clock definition is the report.
    - Suggested default: Time from request created to technician status En route or On site, whichever comes first; confirm with legal/ops.

16. **What is a critical fault vs other work?** Who sets that flag?
    - Why it matters: The 24-hour rule only applies to critical faults.
    - Suggested default: Dispatcher sets Critical vs Standard at log time; customer form can suggest Critical for “no power / safety”.

17. **When does the 24-hour clock start — first WhatsApp/call, or when it is in the system?** Timezone?
    - Why it matters: Weekend gaps and channel delay change compliance.
    - Suggested default: Clock starts when the request is created in FixFlow; timezone Asia/Colombo (confirm).

18. **Which fields are mandatory on a request?** Customer, site/address, system ID, symptom, contact number, photo, urgency?
    - Why it matters: Incomplete logs recreate “lost” jobs; too many fields block weekend intake.
    - Suggested default: Customer name, phone, site address or account id, short description, urgency (critical/standard). Photo optional.

19. **How do we identify the rooftop system and customer among ~2,000?**
    - Why it matters: Wrong site dispatch wastes technician time and SLA clock.
    - Suggested default: Search by phone or customer name in MVP; system serial/account id if they can give a simple list later.

20. **How long must we retain requests, photos, and timestamps for warranty proof?**
    - Why it matters: Storage, privacy, and “we can't prove we do”.
    - Suggested default: Keep request history and timestamps for the warranty period they name (ask: years); photos for 12 months.

---

## Integrations

21. **Must MVP still accept hotline and WhatsApp, or is the new form the only intake?**
    - Why it matters: Integrations vs a new channel is the difference between a small app and a messaging project.
    - Suggested default: No WhatsApp/hotline API in MVP; dispatcher types those calls into FixFlow.

22. **Is Google Sheets import/export required?**
    - Why it matters: History and backup; also a way to leak process back into the sheet.
    - Suggested default: No live Sheet sync; optional one-off export later.

23. **Do we need SMS, email, or WhatsApp outbound for assignment and customer updates?**
    - Why it matters: “When is someone coming?” and technician dispatch today happen by phone.
    - Suggested default: In-app only in MVP; email later if cheap.

24. **Is there an existing customer/system list (CRM, billing, installer spreadsheet) we must use?**
    - Why it matters: Creating 2,000 customers by hand is not “start small”.
    - Suggested default: Create customers as requests come in; bulk import only if they already have a clean spreadsheet.

---

## Non-functional

25. **Which devices and languages must work on day one?**
    - Why it matters: Technicians update from phones; coordinators may be on a laptop.
    - Suggested default: Mobile browser for technicians; desktop browser for dispatcher/ops; English first (confirm Sinhala/Tamil).

26. **Can this be web-only, or is a store app required?**
    - Why it matters: App stores blow the December/small-budget constraint.
    - Suggested default: Responsive web app, no native stores.

27. **Who hosts it, and is internet assumed for technicians on site?**
    - Why it matters: Roof work may have poor signal; offline is a large extra.
    - Suggested default: Online-only MVP; failed submit retries when signal returns (no full offline queue).

28. **Any data residency, privacy, or customer-data rules besides warranty records?**
    - Why it matters: Photos of homes and phone numbers are personal data.
    - Suggested default: Staff-only access to PII; no public listing of requests.

29. **Expected load for MVP?** 2,000 customers, 12 technicians, unknown requests/day.
    - Why it matters: Over-building vs a sheet that already fails on volume.
    - Suggested default: Design for tens of new requests per day and 12 concurrent technicians, not thousands of simultaneous users.

---

## Delivery

30. **What is the latest acceptable go-live date for “before the December rush”?**
    - Why it matters: “Ideally” is not a date; scope must fit the calendar.
    - Suggested default: Production usable by 1 December 2026 (confirm year and whose December).

31. **Who will try the first version (dispatcher, one technician crew, Nirosha)?**
    - Why it matters: Training and whether all 12 technicians must be live on day one.
    - Suggested default: One dispatcher + 2 technicians pilot, then the remaining 10.

32. **What does “budget is limited / start small” mean in money, people, and what we must not buy?**
    - Why it matters: SMS, WhatsApp APIs, native apps, and SLA analytics all cost.
    - Suggested default: No paid messaging APIs and no native apps in MVP; use a single web app.

33. **Who signs off MVP as done — Nirosha only, or also the coordinator and a technician?**
    - Why it matters: Success measures in the email are operational; ops-only sign-off can miss field use.
    - Suggested default: Nirosha + the coordinator; one technician walkthrough before calling it live.

---

Next step: take this list to BrightRoof (Nirosha / coordinator). Capture answers in a workshop note such as `docs/intake/2026-10-xx-brightroof-workshop.md`. After that file exists, re-run `/expand-request` for Phase 2 (PRD, epics, stories, traceability).
