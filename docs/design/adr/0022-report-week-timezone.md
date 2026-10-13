# ADR 0022: Report week timezone is configuration

## ADR

The jobs-per-technician week is Monday through Sunday in a configured zone. The zone value is unset.

## Decision

The week runs from Monday 00:00:00 through Sunday 23:59:59 in the report timezone. Production and tests set that zone. The 24-hour met or breached result uses elapsed seconds and does not use this zone. The display timezone for timestamps is also unset.

## Why it matters

The weekly overload count depends on where the week boundary falls. The zone stays configurable until BrightRoof names it, and that choice leaves the warranty result unchanged.
