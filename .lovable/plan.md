## Problem
Vite dev server blocks requests from `vw-dusseldorf.de` with the error:
> Blocked request. This host ("vw-dusseldorf.de") is not allowed.

## Fix
Update `vite.config.ts` to add the new domain to `server.allowedHosts`.

## Change
In `vite.config.ts`, append to the `allowedHosts` array:
- `"vw-dusseldorf.de"`
- `"www.vw-dusseldorf.de"`

Also add corresponding entries to `server.cors.origin` for consistency.

## Verification
After the change, accessing the preview via `vw-dusseldorf.de` should no longer trigger the blocked-request error.