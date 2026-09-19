// Google reviews, fetched through the Places API and cached for a day.
//
// Nothing here invents review content. With no API key configured the endpoint
// reports `configured: false` and the site simply doesn't render the section.
//
// To switch on:
//   npx wrangler secret put GOOGLE_PLACES_API_KEY
//   npx wrangler secret put GOOGLE_PLACE_ID
//
// The key should be restricted to the Places API in Google Cloud Console.

const CACHE_KEY = 'google_reviews';
const TTL_MS = 24 * 60 * 60 * 1000;

export async function getReviews(env) {
  const { GOOGLE_PLACES_API_KEY: key, GOOGLE_PLACE_ID: placeId } = env;
  if (!key || !placeId) return { configured: false, reviews: [] };

  const cached = await readCache(env);
  if (cached) return { ...cached, cached: true };

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`
    + `?languageCode=sv&regionCode=SE`;

  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': key,
      // Asking for only these fields keeps the call in the cheapest billing tier.
      'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
    },
  });
  if (!res.ok) throw new Error(`places ${res.status}: ${(await res.text()).slice(0, 300)}`);

  const data = await res.json();
  const payload = {
    configured: true,
    rating: data.rating ?? null,
    total: data.userRatingCount ?? null,
    mapsUri: data.googleMapsUri ?? null,
    reviews: (data.reviews || []).map((r) => ({
      author: r.authorAttribution?.displayName || 'Google-användare',
      photo: r.authorAttribution?.photoUri || null,
      profile: r.authorAttribution?.uri || null,
      rating: r.rating ?? null,
      text: (r.originalText?.text || r.text?.text || '').trim(),
      when: r.relativePublishTimeDescription || null,
      publishTime: r.publishTime || null,
    })).filter((r) => r.text),
  };

  await writeCache(env, payload);
  return payload;
}

async function readCache(env) {
  const { results } = await env.DB.prepare(
    'SELECT value, fetched_at FROM cache WHERE key = ?1'
  ).bind(CACHE_KEY).all();
  const row = results?.[0];
  if (!row) return null;
  if (Date.now() - Date.parse(row.fetched_at) > TTL_MS) return null;
  try { return JSON.parse(row.value); } catch { return null; }
}

async function writeCache(env, payload) {
  await env.DB.prepare(
    `INSERT INTO cache (key, value, fetched_at) VALUES (?1, ?2, ?3)
     ON CONFLICT(key) DO UPDATE SET value = ?2, fetched_at = ?3`
  ).bind(CACHE_KEY, JSON.stringify(payload), new Date().toISOString()).run();
}
