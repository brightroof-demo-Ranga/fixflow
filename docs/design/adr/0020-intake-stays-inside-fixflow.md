# ADR 0020: Intake stays inside FixFlow

## ADR

New requests are stored from the public form and from the dispatcher on-behalf form.

## Decision

Those routes accept a submit on Monday through Sunday, including 30 November 2026 and 1 December 2026. They record the source the submitter used: `customer_form`, `whatsapp`, or `phone`. They do not call a WhatsApp API, a hotline API, email, or a Google Sheet.

## Why it matters

A weekend or weekday submit becomes a request with an id and a create time inside FixFlow. WhatsApp and phone work still enter when a dispatcher types them.
