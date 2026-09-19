import { BUSINESS, BOOKING, HOURS, CLOSED_DATES } from './config.js';
import { SERVICES } from './services.js';
import { availableSlots, findService } from './availability.js';
import { wallToInstant, toDateStr, dayOfWeek, hhmm, humanDuration, addDays } from './time.js';
import { sendBookingEmails } from './email.js';
import { createCalendarEvent } from './calendar.js';

const ALLOWED_ORIGINS = [
  'https://asianhairstyleab.se',
  'https://www.asianhairstyleab.se',
  'http://localhost:8788',
  'http://127.0.0.1:8788',
];

// Temporary staging copy on Cloudflare Pages, used to preview the site while
// the domain's nameservers propagate. Every Pages deployment also gets its own
// <hash>.<project>.pages.dev hostname, hence the suffix match rather than a
// fixed string. Safe to delete this and the isAllowed branch once the real
// domain is serving.
const PREVIEW_SUFFIX = '.asianhairstyleab-preview.pages.dev';
const PREVIEW_ORIGIN = 'https://asianhairstyleab-preview.pages.dev';

function isAllowed(origin) {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin === PREVIEW_ORIGIN) return true;
  return origin.startsWith('https://') && origin.endsWith(PREVIEW_SUFFIX);
}

const json = (data, status, origin) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...cors(origin) },
  });

function cors(origin) {
  const allow = isAllowed(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'access-control-allow-origin': allow,
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    'vary': 'origin',
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('origin') || '';

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

    try {
      if (url.pathname === '/api/health') return json({ ok: true, services: SERVICES.length }, 200, origin);
      if (url.pathname === '/api/services') return json({ services: SERVICES }, 200, origin);
      if (url.pathname === '/api/availability' && request.method === 'GET') return availability(url, env, origin);
      if (url.pathname === '/api/booking' && request.method === 'POST') return book(request, env, ctx, origin);
      return json({ error: 'not_found' }, 404, origin);
    } catch (err) {
      console.error('unhandled', err?.stack || err);
      return json({ error: 'server_error' }, 500, origin);
    }
  },
};

// ---------------------------------------------------------------- availability

async function availability(url, env, origin) {
  const serviceId = url.searchParams.get('service');
  const date = url.searchParams.get('date');
  const days = Math.min(Number(url.searchParams.get('days') || 1), 62);

  const service = findService(serviceId);
  if (!service) return json({ error: 'unknown_service' }, 400, origin);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return json({ error: 'bad_date' }, 400, origin);

  const today = toDateStr();
  const horizon = addDays(today, BOOKING.maxDaysAhead);
  const lastDate = addDays(date, days - 1);
  if (date < today || date > horizon) return json({ error: 'out_of_range' }, 400, origin);

  // One query covers the whole requested window.
  const { results } = await env.DB.prepare(
    `SELECT date, start_min, end_min, service_id FROM bookings
      WHERE status = 'confirmed' AND date BETWEEN ?1 AND ?2`
  ).bind(date, lastDate).all();

  const byDate = new Map();
  for (const r of results || []) {
    if (!byDate.has(r.date)) byDate.set(r.date, []);
    byDate.get(r.date).push(r);
  }

  const now = new Date();
  const out = {};
  for (let i = 0; i < days; i++) {
    const d = addDays(date, i);
    if (d > horizon) break;
    out[d] = availableSlots(d, service, byDate.get(d) || [], now).map((m) => ({ min: m, label: hhmm(m) }));
  }

  return json({
    service: { id: service.id, duration: service.duration, price: service.price },
    slots: out,
    generatedAt: now.toISOString(),
  }, 200, origin);
}

// --------------------------------------------------------------------- booking

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v || '');
// Swedish mobiles, with or without +46, spaces, or dashes.
const isPhone = (v) => /^[\d\s+()-]{7,20}$/.test(v || '') && (v.match(/\d/g) || []).length >= 7;
const clean = (v, max) => String(v ?? '').trim().slice(0, max);

async function book(request, env, ctx, origin) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad_json' }, 400, origin); }

  // Honeypot: real people never fill a hidden field.
  if (clean(body.company, 50)) return json({ ok: true, id: 'ignored' }, 200, origin);

  const service = findService(body.serviceId);
  if (!service) return json({ error: 'unknown_service' }, 400, origin);

  const date = clean(body.date, 10);
  const startMin = Number(body.startMin);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ error: 'bad_date' }, 400, origin);
  if (!Number.isInteger(startMin) || startMin < 0 || startMin > 1440) return json({ error: 'bad_time' }, 400, origin);

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 160);
  const notes = clean(body.notes, 1000);
  const lang = body.lang === 'en' ? 'en' : 'sv';

  if (name.length < 2) return json({ error: 'bad_name' }, 400, origin);
  if (!isPhone(phone)) return json({ error: 'bad_phone' }, 400, origin);
  if (email && !isEmail(email)) return json({ error: 'bad_email' }, 400, origin);

  // The slot must still be one the rules would offer — this re-runs opening hours,
  // closed dates, minimum notice and the horizon server-side, so a tampered
  // request can't book at 3am on a Tuesday.
  const today = toDateStr();
  if (date < today || date > addDays(today, BOOKING.maxDaysAhead)) {
    return json({ error: 'out_of_range' }, 400, origin);
  }
  const { results: dayRows } = await env.DB.prepare(
    `SELECT date, start_min, end_min, service_id FROM bookings WHERE status='confirmed' AND date = ?1`
  ).bind(date).all();

  if (!availableSlots(date, service, dayRows || [], new Date()).includes(startMin)) {
    return json({ error: 'slot_unavailable' }, 409, origin);
  }

  const endMin = startMin + service.duration;
  const id = crypto.randomUUID();
  const startUtc = wallToInstant(date, startMin).toISOString();
  const endUtc = wallToInstant(date, endMin).toISOString();
  const createdAt = new Date().toISOString();
  const clientHash = await hash((request.headers.get('cf-connecting-ip') || '') + '|' + date);

  // Cheap abuse guard: at most 5 bookings from one IP per day.
  const { results: recent } = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM bookings WHERE client_hash = ?1 AND created_at > ?2`
  ).bind(clientHash, new Date(Date.now() - 86400_000).toISOString()).all();
  if ((recent?.[0]?.n ?? 0) >= 5) return json({ error: 'rate_limited' }, 429, origin);

  // The race-proof insert. Both capacity checks and the write happen inside a
  // single SQLite statement, so two people confirming the same slot at the same
  // millisecond cannot both succeed — the loser gets changes === 0.
  const res = await env.DB.prepare(
    `INSERT INTO bookings (
       id, service_id, service_name, date, start_min, end_min, start_utc, end_utc,
       duration, price, customer_name, customer_phone, customer_email, notes, lang,
       status, created_at, client_hash)
     SELECT ?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,'confirmed',?16,?17
     WHERE (SELECT COUNT(*) FROM bookings
              WHERE date = ?4 AND status = 'confirmed'
                AND start_min < ?6 AND ?5 < end_min) < ?18
       AND (SELECT COUNT(*) FROM bookings
              WHERE date = ?4 AND status = 'confirmed' AND service_id = ?2
                AND start_min < ?6 AND ?5 < end_min) < ?19`
  ).bind(
    id, service.id, service.sv, date, startMin, endMin, startUtc, endUtc,
    service.duration, service.price, name, phone, email || null, notes || null, lang,
    createdAt, clientHash, BOOKING.staffCount, service.maxConcurrent
  ).run();

  if (!res.meta?.changes) return json({ error: 'slot_unavailable' }, 409, origin);

  const booking = {
    id, service, date, startMin, endMin, startUtc, endUtc,
    name, phone, email, notes, lang,
    timeLabel: `${hhmm(startMin)}–${hhmm(endMin)}`,
    durationLabel: humanDuration(service.duration),
  };

  // Email and calendar must never make the customer wait, or fail their booking.
  ctx.waitUntil((async () => {
    try { await sendBookingEmails(env, booking); } catch (e) { console.error('email', e?.stack || e); }
    try {
      const evId = await createCalendarEvent(env, booking);
      if (evId) await env.DB.prepare('UPDATE bookings SET calendar_event_id = ?1 WHERE id = ?2').bind(evId, id).run();
    } catch (e) { console.error('calendar', e?.stack || e); }
  })());

  return json({
    ok: true,
    id,
    date,
    start: hhmm(startMin),
    end: hhmm(endMin),
    startUtc,
    endUtc,
    service: { id: service.id, sv: service.sv, en: service.en, price: service.price, duration: service.duration },
  }, 201, origin);
}

async function hash(input) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].slice(0, 16).map((b) => b.toString(16).padStart(2, '0')).join('');
}
