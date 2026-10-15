---
jira: FIX-16
epic: Platform
epic_key: FIX-9
status: in-progress
version: 3
last_synced: 2026-10-15
---

# Staff sign-in

As a dispatcher, technician, or ops manager, I want to sign in, so that only BrightRoof staff can assign and update jobs.

## Acceptance criteria

### AC1

Given I am a dispatcher, technician, or ops manager with a matching staff email and password  
When I submit that email and password on the sign-in screen  
Then I have a signed-in session, and opening a staff screen allowed for my role shows that screen instead of the sign-in screen

### AC2

Given I have no signed-in session  
When I open a staff screen that assigns or updates jobs  
Then I am shown the sign-in screen and the response includes no request data

### AC3

Given I am signed in  
When I sign out and then open a staff screen that assigns or updates jobs  
Then I am shown the sign-in screen and the response includes no request data

### AC4

Given I submit an email and password that do not match a staff user  
When I submit the sign-in form  
Then I have no signed-in session and the response includes no request data

## Behavior

Staff sign in with email and password on `/sign-in`. There is no identity provider. A matching sign-in sets an httpOnly cookie named `fixflow_session` to a random session id that expires after 12 hours. The database stores only a hash of that id, the staff user, and the expiry. Sign-out deletes the session row and clears the cookie.

A dispatcher opens `/dispatch` (Assign jobs). A technician opens `/technician/jobs` (Update jobs). An ops manager opens `/ops/open-jobs` (Open jobs). With no session, or after sign-out, the assign and update screens show the sign-in screen and include no request data. Single sign-on is not selected. Password length, lockout, and creating the first ops manager account are out of scope.
