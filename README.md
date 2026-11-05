# Henagin Home Improvement

React, TypeScript, and Vite website recreated from the owner-supplied [reference site](https://my-site-290db118.ploy.build/), with the restored Facebook section and owner-supplied customer recommendation.

Production: **https://henagin-construction.web.app/**. Source backup: **https://github.com/austenconor02/HenaginConstruction**. Firebase project: `henagin-construction`.

## Run

```powershell
npm.cmd install
npm.cmd run dev
```

Open the Vite Local URL. `npm.cmd run build` creates the production site in `dist/`; `npm.cmd run preview` serves that build.

## Reference design

The page retains the reference's logo, farmhouse hero, kitchen, bathroom, living-room built-ins, media wall, and filming images. Barlow Condensed and Hanken Grotesk fonts are served locally, along with the reference favicon. The black/yellow palette, sticky header, mobile menu, and hover treatments follow the original design. Service copy reflects remodeling, repairs and built-ins; the owner confirmed that ground-up/custom-home construction is not offered, so that copy and the ADU offering have been removed.

The page sections are individual React components under `src/components/`: `Header`, `Hero`, `Services`, `ProjectShowcase`, `BuiltIns`, `ExteriorServices`, `FlipHouse`, `Commitment`, `CallStrip`, `EstimateSection`, and `Footer`. `src/App.tsx` composes them. The original reference's design tokens and utilities are in `src/styles/reference.css`; application behavior and accessibility additions are in `src/styles.css`. No Ploy runtime, analytics, experiments, or platform badge is included.

Images are in `public/images/reference/`; fonts are in `public/fonts/reference/`. These are the AI-generated design images supplied through the reference, kept separate from genuine published project albums in `src/content/publicContent.ts`. The reference's Flip House Chronicles copy is reproduced as requested. This design recreation is not independent verification of that affiliation or a record of completed jobs.

The kitchen, bathroom and built-in galleries each contain four design images: the original plus three new generated images. `src/content/designGallery.ts` defines the images and descriptions; `ProjectShowcase` provides thumbnails, selection and the shared full-size photo viewer. New optimized WebPs and thumbnails live in `public/images/gallery/`, with source PNGs in `assets/generated/gallery/`. The gallery labels this imagery as AI-generated design inspiration and does not publish it as actual customer work. See [the image prompts](docs/gallery-image-prompts.md) for the complete prompt set and asset paths.

The legacy internal service ID `custom-builds` remains for compatibility with existing inquiry validation and saved records; its public label and current use are built-ins only.

The estimate form follows the reference's Name, Phone, Email, Project type, and project-description layout. The existing location, contact preference, and optional photo features remain in an expandable row. A brief connection-status note accounts for the small difference in form-panel height. Accessibility additions include a skip link, keyboard focus indicators, Escape-to-close mobile navigation, reduced-motion handling, and a narrow-screen heading adjustment.

The Facebook section sits between Our Commitment and the yellow estimate banner, with matching typography and a branded link card. Its button and card open the existing business Facebook page in a new tab; no embedded feed or Facebook scripts load.

## Inquiries

The website is registered as a Firebase Web app. Public browser identifiers are in `src/content/firebaseWebApp.ts`, with optional environment overrides. `.firebaserc` and `firebase.json` target the `henagin-construction` Hosting site and `dist/`. Analytics and trackers are not initialized.

Until EmailJS and the inquiry backend are configured, valid estimate requests open a prefilled email to the owner's temporary recipient, **austenconor02@gmail.com**. The visitor reviews and sends it in their email app and attaches photos manually. Opening an email app is not confirmation of delivery; the site says so. Change the temporary recipient in `src/content/business.ts` when the permanent address is supplied. Call/text links use **972-310-3255**.

The existing `src/services/estimateGateway.ts` and Firebase backend are retained. Direct web submission remains off until App Check, backend resources and delivery are configured and verified. Firebase Functions require Blaze billing; this release deploys Hosting without upgrading the project's billing plan.

With the gateway connected, the form requires the backend's city/ZIP and preferred-contact information, reveals any errors in the extra fields, prevents duplicate clicks, preserves drafts on failure, and reports success only after a returned reference. Up to five JPG/PNG/WebP/AVIF photos, 10 MiB each, can be previewed and removed. Drafts are held in memory. See [inquiry integration](docs/inquiry-integration.md) before enabling submission; credentials and email secrets do not belong in Vite public variables.

`#admin` retains the existing unconnected management placeholder. Publication filtering, public-content contracts, and the reusable photo lightbox are retained for future genuine project albums and reviews.

## Reviews

`src/content/publicContent.ts` contains Clayton Ralston's exact owner-supplied Facebook recommendation. It is marked `published: true` and `featured: true`, and no star rating is invented. Add future approved reviews to that array. Featured reviews sort first; navigation appears when multiple reviews are available.

`FloatingReviews` shows a raised desktop card and a compact mobile chip. Visitors can read the full recommendation, minimize or dismiss it. The widget stays out of the estimate form area. The source link goes to the business Facebook page because no individual post URL was supplied. Review content is included in the deployed build; this release does not claim a live Facebook feed or remote review admin.

## Deploy and back up

```powershell
npm.cmd run build
firebase.cmd deploy --only hosting --project henagin-construction --non-interactive
git add .
git commit -m "Update Henagin website"
git push origin main
```

Git excludes installed dependencies, build output, temporary files, Firebase caches/debug logs and local environment files. The committed Firebase Web app identifiers are public browser configuration; no server keys belong in this repository.

## Verification

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run check:smoke
```

The smoke check starts its own local Vite server, uses installed Chrome, and checks responsive layout, navigation, asset loading, offline form behavior, photo validation, and the reusable lightbox. Screenshots are saved in ignored `tmp/`; it stops its server and removes its temporary fixture.

The reference was inspected in Chrome at 1440px desktop and 390px mobile widths. The original reference layout was matched before adding the Facebook section, featured review and temporary email handoff. Responsive browser checks cover desktop, tablet and narrow phones. Email-app handoff is checked without sending mail; actual email delivery depends on the visitor's email app. Direct Firebase inquiry/photo-upload delivery and EmailJS remain unconnected. Existing backend checks remain available as `npm.cmd run test:backend` and `npm.cmd run build:backend`.
