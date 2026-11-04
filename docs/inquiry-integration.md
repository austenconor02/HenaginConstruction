# Inquiry and EmailJS integration — Hosting connected, backend pending

The website is registered in Firebase project `henagin-construction` and configured for Firebase Hosting at https://henagin-construction.web.app/. Public browser app identifiers are in `src/content/firebaseWebApp.ts`; environment variables can override them. This release does not deploy the inquiry Cloud Functions, enable billing, or connect EmailJS/App Check.

The owner supplied **austenconor02@gmail.com** as the temporary estimate recipient. While direct backend submission is disabled, the form opens a prefilled email for the visitor to review and send; selected photos must be attached manually. No automatic email or saved inquiry is claimed. Change `business.estimateEmail` when the permanent owner address is supplied. Keep the Firebase submission flag off until the backend requirements below are complete.

## What is built

- Direct Firebase submission uses the existing `estimateGateway`. While it is disabled, the form validates the details and opens the temporary recipient's email draft instead. Photo previews remain local and email attachments must be added manually.
- `VITE_INQUIRY_SUBMISSION_ENABLED=false` prevents Firebase initialization, App Check loading, uploads, and submission requests, even if public Firebase fields are present. The Firebase transport is loaded only after a configured, enabled submission.
- When later enabled, the form shows progress, prevents a second click while sending, preserves details on failure, and confirms success only after the server returns a saved inquiry reference. Unchanged retries reuse the same in-memory request key.
- `beginInquiry` validates all fields and photo metadata, rate-limits new attempts, and creates an `awaiting_upload` record. It returns short-lived upload policies for at most five private images of up to 10 MiB each.
- Photos upload directly to a staging prefix with a signed policy that restricts type and exact declared size. `finishInquiry` checks object metadata and image signatures, copies the verified generation into the private final prefix, then marks the inquiry `received`. A reused staging policy cannot replace its final photos.
- Repeated submissions with the same key and unchanged payload return the existing record. A saved inquiry is independent of its email notification, so email failure does not falsely tell a visitor their inquiry was lost.
- `notifyInquiryOwner` sends an owner notification through the [official EmailJS JSON API](https://www.emailjs.com/docs/rest-api/send/), when separately enabled. The configured owner email controls the recipient. A transaction prevents concurrent duplicate notifications, and dispatch slots respect the documented one-request-per-second API limit.
- Notification states are `pending`, `sending`, `sent`, `failed`, `uncertain`, or `disabled`. A network timeout is uncertain because the provider may already have received the email. It is not automatically retried. A process interruption can leave `sending`; the owner should review it before any future retry tool resends it.
- Firestore/Storage rules prevent public inquiry reads and direct client writes. A future authenticated admin with the `admin: true` custom claim can read inquiries and final photos. The current Admin view remains the existing placeholder; a full admin interface was not added in this change.

## Files and commands

| File                                       | Purpose                                                                                       |
| ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `.env.example`                             | Blank public Firebase/App Check settings; submission disabled.                                |
| `src/services/inquiryConfig.ts`            | Explicit connection gate and required public settings.                                        |
| `src/services/estimateGateway.ts`          | Existing form's single submission gateway.                                                    |
| `src/services/firebaseInquiryTransport.ts` | Lazy Firebase callables and signed photo uploads.                                             |
| `functions/.env.example`                   | Backend and EmailJS flags, both disabled, with blank account fields.                          |
| `functions/src/index.ts`                   | Inquiry reservation, validation/finalization, notification, and deleted-record photo cleanup. |
| `functions/src/validation.ts`              | Server-side input, type/size, and image-signature checks.                                     |
| `functions/src/emailjs.ts`                 | Server-only EmailJS adapter; no private key in the browser.                                   |
| `firestore.rules`, `storage.rules`         | Private inquiry records and photos. Merge with other project rules when connecting.           |
| `firebase.json`, `.firebaserc`             | Hosting deployment targets henagin-construction; backend/rules config retained separately.    |

```powershell
npm.cmd install
npm.cmd --prefix functions install
npm.cmd run build
npm.cmd run build:backend
npm.cmd test
npm.cmd run test:backend
```

The frontend SDK is pinned to a release compatible with the workspace's Node 22 runtime. The backend targets Node 22.

## When the owner is ready to connect

1. Choose the Firebase project, configure Firestore and a private Storage bucket, and register the website with [App Check using reCAPTCHA Enterprise](https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider). The callable functions enforce App Check. No anonymous account is needed for the inquiry form.
2. Provide the public Firebase app values and Enterprise site key from `.env.example`. Keep the browser flag false during setup.
3. Fill the backend configuration for the exact website origin and Storage bucket. The runtime service account needs to sign upload policies and read/copy/delete objects in that bucket. Set bucket CORS for POST uploads from the website origin. No public object permissions are required. See Google's [signed POST policy reference](https://googleapis.dev/nodejs/storage/latest/File.html#generateSignedPostPolicyV4).
4. Deploy and verify the callables and rules in the chosen project. The region is `us-central1`, matching the frontend example. Enable `INQUIRIES_ENABLED` only for that configured backend.
5. Configure Firestore TTL on `expiresAt` for `inquiries` and `inquiryLimits`. Finalization removes `expiresAt` from received inquiries, so accepted requests do not expire. The deletion trigger cleans files belonging to deleted/expired records. Add a bucket lifecycle rule to remove `inquiry-staging/` objects older than one day, merging with existing rules; this also removes any late reuse of expired staging sessions. It must not target `inquiry-photos/`.
6. When EmailJS exists, supply the service ID, template ID, public key, fixed owner recipient, and server-side private key. Store `EMAILJS_PRIVATE_KEY` in Firebase Secret Manager. Set `EMAILJS_ENABLED=true` and redeploy the notification function so its secret is bound. While EmailJS is disabled, it has no secret binding and inquiries can be configured independently.
7. Verify real saved inquiries, private photos, duplicate prevention, and notification delivery. Only then enable the frontend submission flag and rebuild the site. No flag is enabled in this workspace.

## EmailJS template variables

The owner supplied template ID `template_cn7om1o` and temporary recipient `austenconor02@gmail.com`. These non-secret values are recorded in `functions/.env.example`. Service ID, public key, and the server-only private key are still required before automatic notification delivery can be enabled. `EMAILJS_ENABLED` and `INQUIRIES_ENABLED` remain false; the live form continues to use the email-app handoff.

Set the template recipient to `{{to_email}}` and Reply-To to `{{reply_to}}`. A phone-only inquiry uses the configured owner address as Reply-To. Use escaped template variables for visitor-provided fields, rather than raw/triple-brace HTML. The adapter supplies:

`business_name`, `inquiry_id`, `reference`, `from_name`, `reply_to`, `phone`, `preferred_contact`, `service`, `location`, `project_description`, and `photo_count`.

No photos or public download URLs are included in email. Photos remain private for the authenticated admin; the email contains the inquiry reference and photo count. No visitor auto-reply is sent by this implementation.

## Verification limits

Frontend/backend TypeScript builds and focused tests cover validation, file boundaries/signatures, disconnected defaults, and the EmailJS adapter using a fake transport. No live inquiry, Storage upload, App Check attestation, secret binding, email delivery, or Firebase rules/emulator test has been performed. Browser visual review remains with the owner.
