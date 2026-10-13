# ADR 0003: Photo bytes on the app server

## ADR

A photo is a database row plus a file on the app server. Object storage is unset.

## Decision

`Photo` stores the request, the content type, and a `storageKey`. The bytes live in a directory on the app server. The API returns them to a dispatcher, the assigned technician, or an ops manager. The tracking response includes no photo.

## Why it matters

A customer or assigned technician can attach an image, and the staff who are allowed to open the job can see it. Another technician does not receive the file. A durable object store is a paid service and is not selected.
