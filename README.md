# QR Studio support website

Official static website for QR Studio: Scan & Create.

Primary address: https://studioqrapp.com/, hosted alongside QR Studio’s attribution receiver on Cloudflare (domain migration requested by Marc on 24 September 2026).
GitHub Pages remains available from `main` at https://mmm489.github.io/qr-studio-support/ for released app versions.

The six public files (index/privacy/support/terms HTML, style.css and app-icon.svg)
are also deployed from `Infrastructure/cloudflare/public` in the QR Studio iOS
repository. After updating this source, synchronize those six files, run the
validation and worker tests there, and deploy that worker with Wrangler. Preserve
the existing Apple attribution route and `/health`. Do not publish a stale branch.

Before publishing content changes:

```sh
node scripts/validate.mjs
git diff --check
```

These are static structure/link checks, not a certification of privacy compliance.
Reconcile disclosures with the app and deployed backend, not just unshipped source.
