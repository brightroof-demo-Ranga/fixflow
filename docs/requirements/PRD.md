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
| G8 | Dates the customer named. | Pilot 1 December 2026 with 3 technicians; all 12 technicians by mid-January 2027. |

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
- Staff sign-in with email and password.
- Audit log of who created, assigned, and updated a request.
- Customer logs a request without an account (phone + system ID).
- Dispatcher logs WhatsApp and phone requests on the customer’s behalf.
- Dispatcher assigns a technician.
- Technician updates a job from a phone.
- Photos on a request (optional).
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
- Password length, account lockout, and creating the first ops manager account.
- Customer marking critical, and keyword auto-flag. No stored reason code for zero output versus a safety sign.
- Photo count, file size, allowed types, a required photo, dispatcher attach on behalf, and photos on the tracking page.
- A named display timezone. Shown arrival times stay the stored instant, to the second.
- Customer cancel, reopen, a required cancellation note, and a cancellation SMS.
- Ops manager assign, reassign, on-behalf create, and cancel.
- Dispatcher or ops manager saving On site or Remote diagnosis completed.
- A longer status list than On site, Remote diagnosis completed, completed, and cancelled.
- Live capacity on the assign screen. Warn-or-block on a matching open request.
- Dispatcher access to the ops open-jobs list and the SLA/workload reports. Sort and filter on open jobs.
- An audit row for customer self-log, a retention period, dispatcher or technician read of audit, and an audit sort order.
- A default report period when none is chosen. Picking which of the two stored SLA results the warranty contract uses.
- SMS provider, sender id, rejection handling, and delivery receipts. The recorded send stays required. Technician name in the assignment SMS. Phone or SMS to the technician.
- Who creates or changes staff roles. A specific tracking-token format. Showing the tracking link on screen after submit. The SMS body still contains the link.

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
- “Remote diagnosis completed” is recorded by the assigned technician.
- Only signed-in dispatchers assign work in MVP.
- Photos are allowed on create and on technician update, not mandatory.
- Email is after MVP.
- A technician update that cannot reach the server is not stored and is not queued.

---

## Risks

- Dual intake (WhatsApp + FixFlow) can still lose jobs if the dispatcher does not enter the WhatsApp message.
- SMS is a must; no provider was chosen — delivery cost and reliability can block the December date.
- 24-hour proof depends on staff recording on-site or remote diagnosis; missing status updates look like SLA breaches.
- Pilot of 3 technicians vs 12 may hide overload; mid-January roll-out is a second delivery, not automatic.
- Tracking link without an account can leak job details if the URL is guessable (security not specified).
