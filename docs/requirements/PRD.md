# FixFlow PRD — BrightRoof service calls

Sources:

- [docs/intake/2026-10-09-brightroof-request.md](../intake/2026-10-09-brightroof-request.md)
- [docs/intake/2026-10-14-workshop-notes.md](../intake/2026-10-14-workshop-notes.md)

Suggested defaults in [docs/requirements/questions.md](questions.md) are not customer decisions.

---

## Problem

BrightRoof has about 2,000 rooftop customers and 12 technicians. When a system stops working, customers call the hotline or message WhatsApp. A coordinator writes the job in a Google Sheet and phones a technician.

That process fails in four ways the customer named:

- Calls get lost, especially on weekends.
- Customers keep calling to ask when someone is coming.
- Ops cannot see how long jobs take or which technicians are overloaded.
- The warranty requires a response to critical faults within 24 hours, and they cannot prove they do it.

They asked for something simple: customers log a problem, staff assign it, technicians update it from phones, management can see what is going on, and photos would help. Budget is limited, so start small.

---

## Goals (measurable)

| ID | Goal | How we will know |
| --- | --- | --- |
| G1 | Every service need that reaches FixFlow is a request with an identifier and create time, including weekend intake. | A request exists after a customer log or a dispatcher on-behalf log; it is not only a sheet row. |
| G2 | Critical faults use the workshop definition and show whether the 24-hour response was met. | Critical = zero output or safety signs (smoke, burning smell, sparks, exposed wiring). Met = technician on site, or remote diagnosis completed, within 24 hours of the request. |
| G3 | Customers can follow a job without an account. | Identify with phone number + system ID; receive a tracking link; SMS is sent (email is not required for MVP). |
| G4 | Dispatchers can still take WhatsApp and phone work. | Dispatcher can create a request on the customer’s behalf. |
| G5 | Technicians can update jobs from a phone. | A signed-in technician can change a job from a phone-sized browser. |
| G6 | Ops can see workload and SLA. | Screens or reports for: open jobs, SLA breaches, average time to resolve, jobs per technician per week. |
| G7 | Staff actions are attributable. | Sign-in for dispatcher, technician, and ops manager; audit records of create, assign, and update. |
| G8 | Dates the customer named. | Pilot 1 December 2026 with 3 technicians; all 12 technicians by mid-January (year after the 1 December 2026 pilot, i.e. January 2027, unless they say otherwise — see Open questions). |

---

## Personas

| Persona | Who | What they do in FixFlow |
| --- | --- | --- |
| Customer | Rooftop system owner | Logs a problem with phone + system ID; no account; uses tracking link and SMS. |
| Dispatcher | Coordinator who today uses the sheet | Enters WhatsApp/phone requests; assigns technicians. |
| Technician | Field staff (12; pilot 3) | Updates assigned jobs from a phone; may attach photos. |
| Ops manager | Head of Operations (Nirosha) | Sees open jobs and SLA/workload reports; uses audit when proof is needed. |

---

## In scope (MVP)

- Staff roles: dispatcher, technician, ops manager.
- Staff sign-in (mechanism not specified by the customer — see Open questions).
- Audit log of who created, assigned, and updated a request.
- Customer logs a request without an account (phone + system ID).
- Dispatcher logs WhatsApp and phone requests on the customer’s behalf.
- Dispatcher assigns a technician.
- Technician updates a job from a phone.
- Photos on a request (customer asked; optional vs required not decided).
- Tracking link for the customer.
- SMS notifications (must).
- Critical-fault classification using the workshop definition.
- Record on-site or remote-diagnosis time and whether that happened within 24 hours of the request.
- Reports: open jobs, SLA breaches, average time to resolve, jobs per technician per week.
- English UI.

---

## Out of scope (MVP)

Stated by the customer as later or “for now”:

- Customer accounts.
- WhatsApp or hotline API (WhatsApp stays; dispatchers type those requests in).
- Email notifications (nice to have).
- Sinhala and Tamil UI (phase 2).

Not asked for in intake or workshop, so not in MVP:

- Live Google Sheet sync.

---

## MVP vs later

**MVP (pilot 1 December 2026, 3 technicians)**

Platform, capture, assign, field updates, photos, tracking link, SMS, critical SLA proof, four reports, English.

**Later**

- Remaining technicians, all 12 by mid-January.
- Email notifications.
- Sinhala and Tamil.
- WhatsApp automation, if they still want it after the pilot.

---

## Non-functional requirements

- UI language for MVP: English.
- Technician updates must work on a phone (web; store apps not requested).
- SMS delivery is required for customer notification.
- Customers do not sign in.
- Staff create/assign/update actions must be attributable in the audit log.

---

## Assumptions

These are not workshop answers. Treat as working assumptions until the customer confirms.

- “Within 24 hours of the request” means 24 hours from the FixFlow create timestamp.
- “Remote diagnosis completed” is a technician (or dispatcher) action recorded on the request.
- Only signed-in dispatchers assign work in MVP.
- Photos are allowed on create and on technician update, not mandatory.
- Email is after MVP.

---

## Risks

- Dual intake (WhatsApp + FixFlow) can still lose jobs if the dispatcher does not enter the WhatsApp message.
- SMS is a must; no provider was chosen — delivery cost and reliability can block the December date.
- 24-hour proof depends on staff recording on-site or remote diagnosis; missing status updates look like SLA breaches.
- Pilot of 3 technicians vs 12 may hide overload; mid-January roll-out is a second delivery, not automatic.
- Tracking link without an account can leak job details if the URL is guessable (security not specified).

---

## Open questions

1. What is the request status list (including how “on site” and “remote diagnosis completed” are recorded)?
2. Who may assign and reassign (dispatcher only, or also ops manager / technician)?
3. Which fields besides phone and system ID are mandatory (name, address, description, photo)?
4. Timezone for the 24-hour clock?
5. Does “of the request” start at FixFlow create, or at first WhatsApp/call (not in the system)?
6. How staff sign in (password, magic link, SSO)?
7. How long to keep requests, photos, and audit records?
8. Is a photo required or optional?
9. Which SMS provider, and who pays?
10. How is the tracking link protected (secret token vs phone + system ID only)?
11. Google Sheet: replace on go-live, or run in parallel?
12. Offline use on the roof, or online-only?
13. Native mobile app, or phone browser?
14. Confirm mid-January means January 2027 after the 1 December 2026 pilot.
15. Who may mark remote diagnosis completed?
