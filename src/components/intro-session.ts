/**
 * Shared between the server page (which inlines the no-flash script) and the
 * client gate. Deliberately has no "use client" directive so both can import it.
 */

export const INTRO_SESSION_KEY = "still-human-intro-v1";

/**
 * Runs during HTML parse, before the overlay element below it is parsed, so a
 * returning visitor never sees a black frame and a first-time visitor never
 * sees the site before the intro. Same inline-script pattern the GA consent
 * bootstrap already uses — `next/script` would run far too late.
 */
export const INTRO_NO_FLASH_SCRIPT =
  `try{if(sessionStorage.getItem(${JSON.stringify(INTRO_SESSION_KEY)})==="seen")` +
  `document.documentElement.setAttribute("data-intro-seen","")}catch(e){}`;
