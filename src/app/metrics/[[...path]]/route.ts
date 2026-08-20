import type { NextRequest } from "next/server";
import { GA_GATEWAY_ORIGIN, GA_GATEWAY_PATH } from "@/lib/ga";

/** Google tag gateway proxy.
 *
 *  Forwards /metrics/* to the tag's first-party origin so both the tag script
 *  and its measurement hits travel over oshenstudio.com. The path prefix is
 *  passed through untouched: the origin reads it to identify the measurement
 *  path, and returns "Measurement path is empty" without it. */

// Measurement traffic must never be cached or statically rendered.
export const dynamic = "force-dynamic";

/** Hop-by-hop and length headers: fetch recomputes these, and forwarding the
 *  original Host would defeat the point of the proxy. */
const SKIP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "transfer-encoding",
  "accept-encoding",
]);

const SKIP_RESPONSE_HEADERS = new Set([
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
]);

function buildRequestHeaders(req: NextRequest): Headers {
  const out = new Headers();
  req.headers.forEach((value, key) => {
    if (!SKIP_REQUEST_HEADERS.has(key.toLowerCase())) out.set(key, value);
  });

  // The hit now reaches Google from our infrastructure, not the visitor's
  // browser, so their location has to be forwarded explicitly or every user
  // is attributed to a Vercel region. These are Vercel's edge geo headers.
  const country = req.headers.get("x-vercel-ip-country");
  const region = req.headers.get("x-vercel-ip-country-region");
  const city = req.headers.get("x-vercel-ip-city");
  const lat = req.headers.get("x-vercel-ip-latitude");
  const lon = req.headers.get("x-vercel-ip-longitude");

  if (country) out.set("X-Forwarded-Country", country);
  if (region) out.set("X-Forwarded-Region", region);
  if (lat && lon) {
    // Vercel percent-encodes city names ("New%20York").
    let cityName = "";
    if (city) {
      try {
        cityName = decodeURIComponent(city);
      } catch {
        cityName = city;
      }
    }
    out.set("X-Forwarded-Geolocation", `latlong=${lat},${lon};city=${cityName}`);
  }

  // Deliberately no X-Gtg-Tag-Id: the origin rejects the request outright
  // ("Tag ID is in both Header and Host subdomain") when the ID arrives via
  // both the header and the g-<id>.fps.goog host we are already using.
  return out;
}

async function proxy(req: NextRequest): Promise<Response> {
  const url = new URL(req.url);
  // The origin serves the tag at "/metrics/" and 404s on "/metrics", so the
  // bare path has to regain its trailing slash. Next strips it: routing
  // normalises "/metrics/" to "/metrics" before this handler ever runs.
  const path =
    url.pathname === GA_GATEWAY_PATH ? `${GA_GATEWAY_PATH}/` : url.pathname;
  const target = `${GA_GATEWAY_ORIGIN}${path}${url.search}`;

  const hasBody = req.method !== "GET" && req.method !== "HEAD";

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers: buildRequestHeaders(req),
      body: hasBody ? await req.arrayBuffer() : undefined,
      redirect: "manual",
      cache: "no-store",
    });
  } catch {
    // A failed beacon must never surface as a broken page. Swallow it.
    return new Response(null, { status: 502 });
  }

  const headers = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!SKIP_RESPONSE_HEADERS.has(key.toLowerCase())) headers.set(key, value);
  });
  headers.set("cache-control", "no-store");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

export const GET = proxy;
export const POST = proxy;
export const HEAD = proxy;
export const OPTIONS = proxy;
