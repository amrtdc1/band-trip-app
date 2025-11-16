App Check debug token
---------------------

For local development, `firebase-init.js` enables the Firebase App Check debug token when the app is served from `localhost`, `127.0.0.1`, or `::1`.

- This allows you to test App Check-protected calls without a production attestor.
- The debug token is explicitly disabled for other hostnames (including GitHub Pages).

If you deploy to GitHub Pages or any production host, ensure the console does not show the warning message "App Check debug token enabled (local dev). Remove before production." If it does, double-check `firebase-init.js` and remove any leftover debug configuration before publishing.

If you'd like stricter control, consider using a build-time config (CI) to inject a debug flag only for preview or staging deployments.

Switching Firebase initializer (local / prod)
--------------------------------------------

This repo includes a small helper to switch the active Firebase initializer between a local (dev) version and a production-ready version. Use this during development to safely toggle App Check debug mode without editing files manually.

- `npm run use:local` — copies `firebase-initLocal.js` -> `firebase-init.js` (local/dev, debug App Check enabled)
- `npm run use:prod`  — copies `firebase-init.prod.js` -> `firebase-init.js` (production initializer)

Files involved:
- `firebase-initLocal.js` — kept as your local/dev initializer (can contain debug tokens).
- `firebase-init.prod.js` — production initializer (replace placeholder config with production values).
- `firebase-init.js` — the file imported by the app; this is overwritten by the switch script.

Usage example (from project root):

```bash
npm run use:local   # prepare local initializer
# or
npm run use:prod    # restore production initializer
```

Safety notes:
- Do NOT commit production API keys or App Check provider secrets to a public repo. Prefer injecting production secrets at deploy time (CI/CD) or using environment variables.
- Always verify `firebase-init.js` after switching before deploying.
- The switch script simply copies files — no encryption or secret management is provided.


