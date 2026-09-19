// Timezone-correct helpers for Europe/Stockholm.
//
// The salon thinks in wall-clock time ("Thursday at 14:00"). Computers think in
// UTC instants. Sweden switches between CET and CEST twice a year, so the gap
// between those two is not a constant. Everything below exists to convert
// between them without ever guessing the offset.
//
// NOTE: worker/src/time.js is a byte-identical copy of this file.
//       Run `npm run check-sync` after editing either one.

export const TZ = 'Europe/Stockholm';

const PARTS_FMT = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ, hour12: false,
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
});

/** Minutes that Stockholm is ahead of UTC at a given instant (+60 CET, +120 CEST). */
export function tzOffsetMinutes(instant) {
  const p = {};
  for (const part of PARTS_FMT.formatToParts(instant)) p[part.type] = part.value;
  const asIfUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  return (asIfUTC - instant.getTime()) / 60000;
}

/**
 * Stockholm wall clock -> real UTC instant.
 * Applied twice because the offset we need depends on the instant we're solving for;
 * the second pass settles the DST-boundary cases.
 */
export function wallToInstant(dateStr, minutes) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const naive = Date.UTC(y, m - 1, d, Math.floor(minutes / 60), minutes % 60);
  const first = tzOffsetMinutes(new Date(naive));
  let ms = naive - first * 60000;
  const second = tzOffsetMinutes(new Date(ms));
  if (second !== first) ms = naive - second * 60000;
  return new Date(ms);
}

/** 'YYYY-MM-DD' for an instant, as seen in Stockholm. */
export function toDateStr(instant = new Date()) {
  // sv-SE formats as YYYY-MM-DD natively.
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(instant);
}

/** Minutes since Stockholm midnight for an instant. */
export function toMinutes(instant = new Date()) {
  const p = {};
  for (const part of PARTS_FMT.formatToParts(instant)) p[part.type] = part.value;
  return (+p.hour % 24) * 60 + +p.minute;
}

/** Day of week for a 'YYYY-MM-DD' string. 0 = Sunday. */
export function dayOfWeek(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Shift a 'YYYY-MM-DD' string by whole days, staying a calendar date. */
export function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

/** 570 -> '09:30' */
export function hhmm(minutes) {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** 270 -> '4 h 30 min' (sv) / '4 h 30 min' (en). Mirrors how SumUp phrased it. */
export function humanDuration(minutes) {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  if (h && m) return `${h} h ${m} min`;
  if (h) return `${h} h`;
  return `${m} min`;
}

/**
 * Candidate start times for a service on a date, ignoring existing bookings.
 * Returns minutes-since-midnight. The server intersects this with what's actually free.
 */
export function candidateSlots(dateStr, durationMinutes, { hours, closedDates, slotMinutes, minNoticeHours, now = new Date() }) {
  if (closedDates?.includes(dateStr)) return [];
  const open = hours[dayOfWeek(dateStr)];
  if (!open) return [];

  const earliest = new Date(now.getTime() + minNoticeHours * 3600_000);
  const out = [];
  // The appointment has to finish before we close.
  for (let t = open.open; t + durationMinutes <= open.close; t += slotMinutes) {
    if (wallToInstant(dateStr, t) >= earliest) out.push(t);
  }
  return out;
}

/** Do [aStart, aEnd) and [bStart, bEnd) overlap? Touching ends do not count. */
export function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}
