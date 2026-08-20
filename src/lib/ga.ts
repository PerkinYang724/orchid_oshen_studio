/** Google Analytics + Google tag gateway configuration.
 *
 *  The gateway serves the Google tag from our own domain instead of
 *  googletagmanager.com, so measurement survives ad blockers and the
 *  shortened cookie lifetimes browsers apply to third-party requests.
 *  See src/app/metrics/[[...path]]/route.ts for the proxy itself. */

/** Public by design: it ships in the page source either way. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-90YK91J4HP";

/** First-party path the tag and its measurement hits travel over. Must not
 *  collide with a real route, must not be "/", and must stay under 100 chars. */
export const GA_GATEWAY_PATH = "/metrics";

/** Google derives this host from the measurement ID; nothing needs to be
 *  registered on their side for it to exist. */
export const GA_GATEWAY_ORIGIN = `https://${GA_MEASUREMENT_ID.toLowerCase()}.fps.goog`;

/** Kill switch. Set GA_USE_GATEWAY=0 in the environment to go back to loading
 *  the tag straight from Google, without touching this code. */
export const GA_USE_GATEWAY = process.env.GA_USE_GATEWAY !== "0";

/** What the <script src> points at. */
export const gaScriptSrc = GA_USE_GATEWAY
  ? GA_GATEWAY_PATH
  : `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
