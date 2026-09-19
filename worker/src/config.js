// Every business fact lives here. Change it once, it changes everywhere on the site.

export const BUSINESS = {
  name: 'Asian Hairstyle AB',
  legalName: 'Frisör Style & Fashion (Asian Hairstyle AB)',
  street: 'Brandbergsleden 12',
  postcode: '136 76',
  city: 'Brandbergen',
  region: 'Stockholm',
  country: 'SE',
  // Phone in two shapes: one for humans, one for tel:/wa.me links.
  phoneDisplay: '076-320 06 05',
  phoneE164: '+46763200605',
  whatsapp: '46763200605',
  email: 'asian.hairstyle2025@gmail.com',
  rating: 5.0,
  reviewCount: 20,
  mapsQuery: 'Brandbergsleden+12,+136+76+Brandbergen',
  // Set once the Worker is deployed. Empty string = site runs in "request mode":
  // the form still works and emails you, it just can't hide taken slots yet.
  apiBase: 'https://api.asianhairstyleab.se',
};

// 0 = Sunday … 6 = Saturday. Minutes from midnight, Europe/Stockholm wall clock.
export const HOURS = {
  0: { open: 10 * 60, close: 17 * 60 },       // Sunday    10:00–17:00
  1: { open: 10 * 60, close: 19 * 60 + 30 },  // Monday    10:00–19:30
  2: null,                                     // Tuesday   closed
  3: { open: 10 * 60, close: 19 * 60 + 30 },  // Wednesday 10:00–19:30
  4: { open: 10 * 60, close: 19 * 60 + 30 },  // Thursday  10:00–19:30
  5: { open: 10 * 60, close: 19 * 60 + 30 },  // Friday    10:00–19:30
  6: { open: 10 * 60, close: 18 * 60 },       // Saturday  10:00–18:00
};

export const BOOKING = {
  slotMinutes: 15,      // granularity of offered start times
  minNoticeHours: 2,    // no bookings less than this far ahead
  maxDaysAhead: 60,     // how far into the future the calendar opens
  staffCount: 2,        // how many appointments can run in parallel overall
  timezone: 'Europe/Stockholm',
};

// Dates the salon is closed regardless of opening hours. 'YYYY-MM-DD'.
// Swedish red days for 2026 plus anything you add by hand.
export const CLOSED_DATES = [
  '2026-12-24', '2026-12-25', '2026-12-26', '2026-12-31',
  '2027-01-01', '2027-01-06',
];
