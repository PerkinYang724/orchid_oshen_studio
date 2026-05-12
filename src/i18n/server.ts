import { cookies } from "next/headers";
import { en } from "./messages/en";
import { zhTW } from "./messages/zh-TW";
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale, type Messages } from "./types";

const REGISTRY: Record<Locale, Messages> = {
  en,
  "zh-TW": zhTW,
};

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  if (value === "en" || value === "zh-TW") return value;
  return DEFAULT_LOCALE;
}

export async function getMessages(): Promise<Messages> {
  const locale = await getLocale();
  return REGISTRY[locale];
}

export function getMessagesFor(locale: Locale): Messages {
  return REGISTRY[locale];
}
