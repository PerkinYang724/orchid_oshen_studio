import { cookies, headers } from "next/headers";
import { en } from "./messages/en";
import { zhTW } from "./messages/zh-TW";
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale, type Messages } from "./types";

const REGISTRY: Record<Locale, Messages> = {
  en,
  "zh-TW": zhTW,
};

function detectFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  // Parse Accept-Language tags in priority order: "zh-TW,zh;q=0.9,en;q=0.8"
  const tags = header
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase())
    .filter(Boolean);
  for (const tag of tags) {
    if (tag.startsWith("zh-tw") || tag.startsWith("zh-hant") || tag === "zh") {
      return "zh-TW";
    }
    if (tag.startsWith("en")) return "en";
  }
  return null;
}

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const cookieValue = store.get(LOCALE_COOKIE)?.value;
  if (cookieValue === "en" || cookieValue === "zh-TW") return cookieValue;

  // No cookie: fall back to Accept-Language so first-time zh-TW users
  // see Mandarin without needing to click the switcher.
  const hdrs = await headers();
  const detected = detectFromAcceptLanguage(hdrs.get("accept-language"));
  return detected ?? DEFAULT_LOCALE;
}

export async function getMessages(): Promise<Messages> {
  const locale = await getLocale();
  return REGISTRY[locale];
}

export function getMessagesFor(locale: Locale): Messages {
  return REGISTRY[locale];
}
