# FixFlow epics

Each epic lists its stories (files under `docs/requirements/stories/`). Jira keys stay blank until sync.

---

## 1. Platform

**Goal:** Only BrightRoof staff can assign and update jobs; each staff user has a role; create/assign/update actions are attributable so warranty response can be proved.

**Stories:**

- [staff-sign-in.md](stories/staff-sign-in.md)
- [roles-and-permissions.md](stories/roles-and-permissions.md)
- [audit-log.md](stories/audit-log.md)

---

## 2. Capture service requests

**Goal:** A request exists for every problem that should not be lost — customers log without accounts; dispatchers enter WhatsApp and phone work on the customer’s behalf.

**Stories:**

- [customer-log-request.md](stories/customer-log-request.md)
- [dispatcher-log-on-behalf.md](stories/dispatcher-log-on-behalf.md)

---

## 3. Dispatch and assign

**Goal:** A dispatcher assigns a technician so the job has an owner instead of sitting only in a sheet, and can cancel a request the customer no longer wants.

**Stories:**

- [dispatcher-assign-technician.md](stories/dispatcher-assign-technician.md)
- [cancel-request.md](stories/cancel-request.md)

---

## 4. Field updates

**Goal:** Technicians update jobs from their phones; photos can be attached so the fault is clearer.

**Stories:**

- [technician-update-job.md](stories/technician-update-job.md)
- [attach-photos.md](stories/attach-photos.md)

---

## 5. Customer status

**Goal:** Customers stop calling “when is someone coming?” — they get a tracking link with no account, and SMS (must).

**Stories:**

- [customer-tracking-link.md](stories/customer-tracking-link.md)
- [sms-notify-customer.md](stories/sms-notify-customer.md)

---

## 6. Critical SLA

**Goal:** Critical faults use the workshop definition; ops can prove whether a technician was on site or remote diagnosis completed within 24 hours of the request.

**Stories:**

- [classify-critical-fault.md](stories/classify-critical-fault.md)
- [sla-24h-response.md](stories/sla-24h-response.md)

---

## 7. Operations reporting

**Goal:** Management can see what is going on: open jobs, SLA breaches, average time to resolve, jobs per technician per week.

**Stories:**

- [ops-open-jobs.md](stories/ops-open-jobs.md)
- [ops-sla-workload-reports.md](stories/ops-sla-workload-reports.md)
