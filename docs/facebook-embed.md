# Facebook embed verification — October 27, 2026

Exact business URL: https://www.facebook.com/profile.php?id=61557012234198

The following official Meta documentation endpoints were checked before implementing the Facebook section:

- [Page Plugin](https://developers.facebook.com/docs/plugins/page-plugin/) returned **Not Logged In / Please log in to see this page**.
- [Embedded Posts](https://developers.facebook.com/docs/plugins/embedded-posts/) could not be retrieved (**429 Too Many Requests**).
- [Embedded Video Player](https://developers.facebook.com/docs/plugins/embedded-video-player/) could not be retrieved (**429 Too Many Requests**).
- The supplied Facebook URL could not be retrieved by the browsing tool. This does not establish that the page is unavailable to visitors.

Current support and public embed eligibility for this exact page could not be verified. No specific public post or video URL was supplied. The site therefore uses the requested fallback: an intentional link card with the unmodified company logo, Facebook’s recognizable blue icon, and a visible “View Photos & Videos on Facebook” button pointing to the exact supplied URL.

This is a link card, not an invented Facebook feed or post preview. No embedded content, third-party scraper, SDK, tracking pixel, blank iframe, or synchronization claim is included. Links open in a new tab with `noopener noreferrer`.

For later work, re-check Meta’s then-current official documentation and confirm the exact public page/post/video renders for signed-out visitors before enabling a lazy or click-to-load embed. Keep the direct link and a useful fallback visible even if an embed is blocked by browser privacy settings or page restrictions. Do not infer success solely from a cross-origin iframe’s `load` event.
