# Traceability — intake need → story → AC ids

Sources: [2026-10-09-brightroof-request.md](../intake/2026-10-09-brightroof-request.md), [2026-10-14-workshop-notes.md](../intake/2026-10-14-workshop-notes.md).

| Intake need | Source | Story | AC ids |
| --- | --- | --- | --- |
| Calls get lost, especially on weekends | Request | [customer-log-request.md](stories/customer-log-request.md) | AC1, AC2, AC4 |
| Calls get lost on a weekday | Request | [customer-log-request.md](stories/customer-log-request.md), [dispatcher-log-on-behalf.md](stories/dispatcher-log-on-behalf.md) | log AC12; on-behalf AC7 |
| Calls get lost (WhatsApp/phone still used) | Request + workshop | [dispatcher-log-on-behalf.md](stories/dispatcher-log-on-behalf.md) | AC1, AC2, AC4, AC6, AC7, AC8 |
| Customers keep calling “when is someone coming?” | Request | [customer-tracking-link.md](stories/customer-tracking-link.md), [dispatcher-assign-technician.md](stories/dispatcher-assign-technician.md) | tracking AC1, AC2, AC4, AC9, AC10; assign AC7, AC8 |
| Customers keep calling “when is someone coming?” | Request + workshop (SMS must) | [sms-notify-customer.md](stories/sms-notify-customer.md) | AC1, AC2, AC3, AC7, AC8 |
| Don’t know how long jobs take | Request + workshop (avg time to resolve) | [ops-sla-workload-reports.md](stories/ops-sla-workload-reports.md) | AC2 |
| Don’t know which technicians are overloaded | Request + workshop (jobs per technician per week) | [ops-sla-workload-reports.md](stories/ops-sla-workload-reports.md) | AC3 |
| Warranty: respond to critical faults within 24 hours; cannot prove it | Request | [classify-critical-fault.md](stories/classify-critical-fault.md) | AC1, AC2, AC3, AC4 |
| Warranty proof (on site or remote diagnosis within 24 hours of the request) | Workshop | [sla-24h-response.md](stories/sla-24h-response.md) | AC1, AC2, AC3, AC4 |
| Warranty proof from the original WhatsApp or call time | Request (“can’t prove”) | [dispatcher-log-on-behalf.md](stories/dispatcher-log-on-behalf.md), [sla-24h-response.md](stories/sla-24h-response.md) | on-behalf AC9, AC10; SLA AC7, AC8, AC9, AC10, AC11 |
| Warranty proof / attributable actions | Request (“can’t prove”) + Platform plan | [audit-log.md](stories/audit-log.md) | AC1, AC2, AC3, AC4 |
| Customers can log a problem | Request | [customer-log-request.md](stories/customer-log-request.md) | AC1, AC3 |
| We can assign it | Request | [dispatcher-assign-technician.md](stories/dispatcher-assign-technician.md) | AC1, AC2, AC4 |
| Technician reassigned | QA review; assign already allowed a second assignee | [dispatcher-assign-technician.md](stories/dispatcher-assign-technician.md), [technician-update-job.md](stories/technician-update-job.md), [audit-log.md](stories/audit-log.md), [customer-tracking-link.md](stories/customer-tracking-link.md), [sms-notify-customer.md](stories/sms-notify-customer.md), [ops-open-jobs.md](stories/ops-open-jobs.md), [ops-sla-workload-reports.md](stories/ops-sla-workload-reports.md) | assign AC2; technician AC5; audit AC5; tracking AC6; SMS AC5; open-jobs AC5; reports AC5 |
| Same phone and system ID submitted again | QA review (not in intake) | [customer-log-request.md](stories/customer-log-request.md), [dispatcher-log-on-behalf.md](stories/dispatcher-log-on-behalf.md), [sms-notify-customer.md](stories/sms-notify-customer.md) | log AC5; on-behalf AC5; SMS AC6 |
| Technician device cannot reach the server | QA review; PRD open question 12, not a workshop answer | [technician-update-job.md](stories/technician-update-job.md), [attach-photos.md](stories/attach-photos.md) | technician AC6, AC7; photos AC6 |
| Customer no longer wants the visit | QA review (not in intake or workshop) | [cancel-request.md](stories/cancel-request.md) | AC1–AC5 |
| Technicians can update it from their phones | Request | [technician-update-job.md](stories/technician-update-job.md) | AC1, AC2, AC3 |
| Technician sees the jobs assigned to them | Request (coordinator calls a technician) | [technician-update-job.md](stories/technician-update-job.md) | AC9, AC10 |
| Management can see what’s going on | Request | [ops-open-jobs.md](stories/ops-open-jobs.md) | AC1, AC2 |
| Management reports: open jobs, SLA breaches, avg resolve, jobs/tech/week | Workshop | [ops-open-jobs.md](stories/ops-open-jobs.md), [ops-sla-workload-reports.md](stories/ops-sla-workload-reports.md) | open-jobs AC1; reports AC1–AC3 |
| Photos would help a lot | Request | [attach-photos.md](stories/attach-photos.md) | AC1, AC2, AC3, AC4 |
| No customer accounts; phone + system ID; tracking link | Workshop | [customer-log-request.md](stories/customer-log-request.md), [roles-and-permissions.md](stories/roles-and-permissions.md), [customer-tracking-link.md](stories/customer-tracking-link.md) | log AC1–AC2; roles AC3; tracking AC1, AC4 |
| WhatsApp stays; dispatchers enter WhatsApp and phone on customer’s behalf | Workshop | [dispatcher-log-on-behalf.md](stories/dispatcher-log-on-behalf.md) | AC1, AC4, AC6 |
| SMS is a must; email is nice to have | Workshop | [sms-notify-customer.md](stories/sms-notify-customer.md) | AC1, AC2, AC3, AC4 |
| English first; Sinhala and Tamil in phase 2 | Workshop | PRD NFR / later (no story) | — |
| Pilot 1 December 2026 with 3 technicians; all 12 by mid-January | Workshop | PRD G8; [customer-log-request.md](stories/customer-log-request.md); [dispatcher-assign-technician.md](stories/dispatcher-assign-technician.md) | log AC7 (intake on 1 December 2026); assign AC4 (role, not a cap of 3); assign AC9 (list of 12 when 12 have the role). The 3-technician pilot count stays operational. |
| Critical fault = zero output or safety signs | Workshop | [classify-critical-fault.md](stories/classify-critical-fault.md) | AC2, AC3 |
| Staff-only assign/update | Implied by assign + phone updates; customers have no accounts | [staff-sign-in.md](stories/staff-sign-in.md), [roles-and-permissions.md](stories/roles-and-permissions.md) | sign-in AC1–AC3; roles AC1, AC2, AC4 |
| Something simple (phone, system ID, and description are enough) | Request | [customer-log-request.md](stories/customer-log-request.md) | AC9 |
| Start small / budget limited | Request | [customer-log-request.md](stories/customer-log-request.md) | AC8, AC11 |
| ~2,000 customers, 12 technicians | Request | [customer-log-request.md](stories/customer-log-request.md), [dispatcher-assign-technician.md](stories/dispatcher-assign-technician.md) | log AC6; assign AC9 |
| Live before the December rush | Request + workshop (pilot date 1 December 2026) | [customer-log-request.md](stories/customer-log-request.md) | AC7, AC10 |

Email notifications and Sinhala/Tamil stay out of MVP (PRD) and have no story ACs on purpose. A customer log save does not require Google Sheet sync or a WhatsApp API ([customer-log-request.md](stories/customer-log-request.md) AC8). AC11 also stores that save when email delivery is unavailable, and no email is sent. Dispatcher entry of WhatsApp and phone does not use a WhatsApp API or a hotline API ([dispatcher-log-on-behalf.md](stories/dispatcher-log-on-behalf.md) AC8). An assignment with no expected arrival timestamp stays valid ([dispatcher-assign-technician.md](stories/dispatcher-assign-technician.md) AC1); the tracking page and the assignment SMS then show "no arrival time". The original-contact result does not replace the create-timestamp SLA result ([sla-24h-response.md](stories/sla-24h-response.md) AC7, AC8, AC11).
