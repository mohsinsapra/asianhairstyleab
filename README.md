# asianhairstyleab.se

Website and online booking for **Frisör Style & Fashion (Asian Hairstyle AB)**, Brandbergsleden 12, Brandbergen, Stockholm.

Swedish and English, mobile-first, 29 services with live availability. Customers pick a service, see only the times that are genuinely free, and book themselves in. The salon gets an email, and the appointment lands in Google Calendar.

```
site/     static front-end  →  GitHub Pages  →  asianhairstyleab.se
worker/   booking API       →  Cloudflare    →  api.asianhairstyleab.se
          ├── D1            appointments (source of truth)
          ├── Resend        email to the salon + customer
          └── Google Calendar (optional mirror)
```

## Why it is built this way

**No build step on the front end.** Plain HTML, CSS and ES modules. GitHub Pages serves the files exactly as committed, so there is no CI to break and no toolchain to keep alive. Changing a price means editing one line in `site/js/services.js` and pushing.

**D1 is the source of truth, not Google Calendar.** Bookings are safe in a SQL table with real capacity constraints before anything else happens. Calendar sync is a best-effort mirror — if Google is down or not yet configured, bookings still work.

**Double-booking is prevented in SQL, not in JavaScript.** Both capacity checks and the insert happen inside a single statement (`worker/src/index.js`), so two people confirming the same slot in the same millisecond cannot both succeed.

## Editing the content

| What | Where |
|---|---|
| Prices, durations, service names | `site/js/services.js` (and mirror into `worker/src/services.js`) |
| Opening hours, phone, address | `site/js/config.js` |
| Public holidays / closed days | `CLOSED_DATES` in `site/js/config.js` |
| How many customers at once | `BOOKING.staffCount` in `site/js/config.js` |
| Which services can't overlap | `maxConcurrent` per service in `services.js` |
| Swedish / English wording | `site/js/i18n.js` |

`site/js/config.js`, `services.js` and `time.js` are duplicated into `worker/src/`. After editing either copy run:

```bash
npm run check-sync
```

## Availability rules

A time slot is offered when **both** are true:

1. Fewer than `staffCount` appointments overlap it (currently **2**).
2. Fewer than that service's `maxConcurrent` of the *same* service overlap it.

Rule 2 is what stops two six-hour keratin treatments landing on the same afternoon. These services are one-at-a-time: balayage, foil highlights, root colour, keratin, perm, protein treatment, both Fiberplex treatments.

Slots are 15 minutes apart, need 2 hours' notice, and open 60 days ahead. All of it is in `BOOKING` in `config.js`.

## Running it locally

```bash
# Front end
cd site && python3 -m http.server 8788

# Booking API (separate terminal)
cd worker && npm install
npx wrangler d1 execute ahab-bookings --local --file=./schema.sql
npx wrangler dev --local --port 8787
```

Then point the site at the local API by editing `apiBase` in `site/js/config.js`, or leave it alone — if the API can't be reached the booking form falls back to plain opening hours and still sends the request.

## Tests

```bash
npm test
```

Covers the Europe/Stockholm conversions across both DST boundaries, slot generation against real opening hours, and the capacity rules.

## Deploying

See [docs/DEPLOY.md](docs/DEPLOY.md) — Cloudflare DNS, GitHub Pages, the Worker, email, and Google Calendar, in order.

## Where the data came from

Services, prices, durations and photos were taken from the salon's SumUp booking page on 2026-09-19 and cleaned up: spelling fixed, capitalisation normalised, and the 29 services grouped into 8 categories. The original scrape is kept in `docs/sumup-raw-services.json` for reference.
