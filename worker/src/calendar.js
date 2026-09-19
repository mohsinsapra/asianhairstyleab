import { BUSINESS, BOOKING } from './config.js';

// Optional Google Calendar mirroring.
//
// Bookings are already safe in D1 before this runs — this just puts the
// appointment on the salon's phone. If the secrets aren't set it quietly does
// nothing, which is what lets the site go live before a calendar is chosen.
//
// To switch on, set three secrets and share the calendar with the service
// account address (Make changes to events):
//   GOOGLE_CALENDAR_ID          e.g. asian.hairstyle2025@gmail.com
//   GOOGLE_SA_EMAIL             ...@...iam.gserviceaccount.com
//   GOOGLE_SA_PRIVATE_KEY       the full PEM, \n escapes are fine

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/calendar.events';

export async function createCalendarEvent(env, b) {
  const { GOOGLE_CALENDAR_ID: calId, GOOGLE_SA_EMAIL: saEmail, GOOGLE_SA_PRIVATE_KEY: saKey } = env;
  if (!calId || !saEmail || !saKey) return null;

  const token = await getAccessToken(saEmail, saKey);
  const en = b.lang === 'en';

  const body = {
    summary: `${b.service.sv} — ${b.name}`,
    description: [
      `${en ? 'Service' : 'Tjänst'}: ${b.service.sv}`,
      `${en ? 'Customer' : 'Kund'}: ${b.name}`,
      `${en ? 'Phone' : 'Telefon'}: ${b.phone}`,
      b.email ? `${en ? 'Email' : 'E-post'}: ${b.email}` : null,
      `${en ? 'Price' : 'Pris'}: ${b.service.price} kr`,
      b.notes ? `\n${en ? 'Message' : 'Meddelande'}: ${b.notes}` : null,
      `\nBoknings-ID: ${b.id}`,
    ].filter(Boolean).join('\n'),
    location: `${BUSINESS.street}, ${BUSINESS.postcode} ${BUSINESS.city}`,
    start: { dateTime: b.startUtc, timeZone: BOOKING.timezone },
    end: { dateTime: b.endUtc, timeZone: BOOKING.timezone },
    // Lets us find the event again if we ever add cancellation.
    extendedProperties: { private: { bookingId: b.id } },
    reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 60 }] },
  };

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events`,
    {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`calendar ${res.status}: ${await res.text()}`);
  return (await res.json()).id;
}

// ------------------------------------------------------- service account auth

async function getAccessToken(email, pem) {
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const unsigned = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(JSON.stringify(claim))}`;
  const key = await importKey(pem);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  const jwt = `${unsigned}.${b64url(sig)}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(`google token ${res.status}: ${await res.text()}`);
  return (await res.json()).access_token;
}

async function importKey(pem) {
  const der = base64ToBytes(
    pem.replace(/\\n/g, '\n')
       .replace(/-----BEGIN PRIVATE KEY-----/, '')
       .replace(/-----END PRIVATE KEY-----/, '')
       .replace(/\s+/g, '')
  );
  return crypto.subtle.importKey(
    'pkcs8', der,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

function b64url(input) {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
