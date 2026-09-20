import { BUSINESS, HOURS, CLOSED_DATES } from './config.js';
import { SERVICES, CATEGORIES } from './services.js';
import { initLang, setLang, getLang, t, sname, locale, STRINGS } from './i18n.js';
import { toDateStr, toMinutes, dayOfWeek, hhmm, humanDuration } from './time.js';
import { initBooking, startWith, relabel } from './booking.js';
import { REVIEWS as MANUAL_REVIEWS } from './reviews.js';
import { serviceIcon } from './icons.js';

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let activeCat = 'all';

function boot() {
  initLang();
  wireLinks();
  buildHeroArt();
  buildMarquee();
  buildChips();
  buildJsonLd();
  initBooking();
  loadReviews();
  applyLang();

  $('#year').textContent = new Date().getFullYear();
  $('#factServices').textContent = SERVICES.length;
  $('#langToggle').addEventListener('click', () => {
    setLang(getLang() === 'sv' ? 'en' : 'sv');
    applyLang();
    relabel();
  });

  // Opening status drifts as the day goes on.
  setInterval(renderStatus, 60_000);
}

/** Phone/WhatsApp/map hrefs all come from config so the number lives in one place. */
function wireLinks() {
  for (const id of ['navCall', 'heroCall', 'stickyCall', 'contactPhone']) {
    const a = $('#' + id);
    if (a) a.href = `tel:${BUSINESS.phoneE164}`;
  }
  $('#contactPhone').textContent = BUSINESS.phoneDisplay;
  $('#contactEmail').href = `mailto:${BUSINESS.email}`;
  $('#contactEmail').textContent = BUSINESS.email;
  $('#waLink').href = `https://wa.me/${BUSINESS.whatsapp}`;
  $('#mapsLink').href = `https://www.google.com/maps/search/?api=1&query=${BUSINESS.mapsQuery}`;

  // Map embed is built here rather than hardcoded in the HTML, so the pin and
  // the schema.org coordinates can never disagree.
  const { lat, lon } = BUSINESS;
  const bbox = [lon - 0.006, lat - 0.003, lon + 0.006, lat + 0.003].map((n) => n.toFixed(6)).join('%2C');
  $('#mapFrame').src =
    `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
}

// ------------------------------------------------------------------- language

function applyLang() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.title = t('meta.title');
  document.querySelector('meta[name=description]').content = t('meta.desc');
  $('#langToggle').textContent = t('lang.switch');

  for (const node of document.querySelectorAll('[data-i18n]')) {
    node.textContent = t(node.dataset.i18n);
  }

  const nf = new Intl.NumberFormat(locale(), { minimumFractionDigits: 1 });
  const rating = nf.format(BUSINESS.rating);
  $('#factRating').textContent = rating;
  $('#ratingChip').innerHTML =
    `<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path fill="#FFB020" d="m10 1.6 2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5 2.7 1-5.6-4.1-4 5.6-.8z"/></svg>` +
    esc(t('hero.badge', { rating, count: BUSINESS.reviewCount }));
  $('#reviewsLead').textContent = t('reviews.lead', { rating, count: BUSINESS.reviewCount });

  renderStatus();
  renderHours();
  if (reviewData.length) renderReviews();
  renderServices();
  buildChips();
  buildMarquee();
}

// --------------------------------------------------------------------- hero

// Hand-picked from the salon's own photos: the henna mandala and the threading
// shot are what make this salon different from any other frisör in Stockholm.
// All three are chosen to show the work rather than a recognisable customer.
const HERO_SHOTS = [
  'assets/services/img_3ASM2F4A6S8MFBHSVDF64ZC1ZA.jpg', // glossy straight blow-dry
  'assets/services/img_0Z56TB48KM92ZVDKCTN3SR6357.jpg', // henna mandala
  'assets/services/img_5A1P43BQZ29BJVW4HAHY2YMJY1.jpg', // brow threading
];

function buildHeroArt() {
  document.querySelectorAll('.shot').forEach((fig, i) => {
    if (HERO_SHOTS[i]) fig.style.backgroundImage = `url("${HERO_SHOTS[i]}")`;
  });
}

function buildMarquee() {
  const names = CATEGORIES.map((c) => (getLang() === 'en' ? c.en : c.sv));
  const run = names.map((n) => `<span>${esc(n)}</span>`).join('');
  // Duplicated so the -50% translate loops seamlessly.
  $('#marquee').innerHTML = run + run;
}

function renderStatus() {
  const node = $('#openStatus');
  const today = toDateStr();
  const nowMin = toMinutes();
  const h = HOURS[dayOfWeek(today)];
  const closedToday = !h || CLOSED_DATES.includes(today);

  if (!closedToday && nowMin >= h.open && nowMin < h.close) {
    node.dataset.open = 'true';
    node.textContent = t('hero.openNow', { time: hhmm(h.close) });
    return;
  }
  node.dataset.open = 'false';

  // Walk forward to the next day we're actually open.
  for (let i = closedToday || nowMin >= h.close ? 1 : 0; i <= 7; i++) {
    const [y, m, d] = today.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d + i));
    const ds = dt.toISOString().slice(0, 10);
    const hh = HOURS[dt.getUTCDay()];
    if (!hh || CLOSED_DATES.includes(ds)) continue;
    const dayName = new Intl.DateTimeFormat(locale(), { weekday: 'long', timeZone: 'UTC' }).format(dt);
    node.textContent = i === 0
      ? t('hero.opensAt', { day: '', time: hhmm(hh.open) }).replace(/\s+/g, ' ').trim()
      : t('hero.opensAt', { day: dayName, time: hhmm(hh.open) });
    return;
  }
  node.textContent = t('hero.closedNow');
}

// ------------------------------------------------------------------ services

function buildChips() {
  const box = $('#catChips');
  const cats = [{ id: 'all', label: t('services.all') }]
    .concat(CATEGORIES.map((c) => ({ id: c.id, label: getLang() === 'en' ? c.en : c.sv })));

  box.innerHTML = cats.map((c) =>
    `<button type="button" class="chip" role="tab" data-cat="${esc(c.id)}" aria-selected="${c.id === activeCat}">${esc(c.label)}</button>`
  ).join('');

  box.querySelectorAll('.chip').forEach((b) => {
    b.onclick = () => {
      activeCat = b.dataset.cat;
      buildChips();
      renderServices();
    };
  });
}

function renderServices() {
  const list = $('#serviceList');
  const en = getLang() === 'en';
  const shown = CATEGORIES.filter((c) => activeCat === 'all' || c.id === activeCat);

  list.innerHTML = shown.map((cat) => {
    const rows = SERVICES.filter((s) => s.category === cat.id);
    if (!rows.length) return '';
    return `
      <div class="catgroup" style="--cat:var(--c-${cat.id})">
        <div class="catgroup__head">
          <h3>${esc(en ? cat.en : cat.sv)}</h3>
          <span>${rows.length} ${esc(en ? 'services' : 'tjänster')}</span>
        </div>
        <p class="catgroup__blurb">${esc(en ? cat.blurbEn : cat.blurbSv)}</p>
        ${rows.map((s) => `
          <article class="srv" style="--cat:var(--c-${cat.id})">
            ${s.images[0]
              ? `<div class="srv__img" style="background-image:url('${esc(s.images[0])}')"></div>`
              : `<div class="srv__img srv__img--icon">${serviceIcon(s)}</div>`}
            <div>
              <div class="srv__name">${esc(sname(s))}${s.package ? `<span class="srv__tag">${esc(t('services.package'))}</span>` : ''}</div>
              <div class="srv__meta">${esc(humanDuration(s.duration))}</div>
            </div>
            <div class="srv__price">${s.from ? `<small>${esc(t('services.from'))}</small>` : ''}${s.price} kr</div>
            <button type="button" class="btn btn--primary srv__btn" data-book="${esc(s.id)}">${esc(t('services.book'))}</button>
          </article>`).join('')}
      </div>`;
  }).join('');

  list.querySelectorAll('[data-book]').forEach((b) => {
    b.onclick = () => startWith(b.dataset.book);
  });
}


// ------------------------------------------------------------------ reviews

let reviewData = [];

/**
 * Live reviews from Google via the Worker, falling back to whatever real
 * reviews are pasted into reviews.js. If neither yields anything the section
 * stays hidden — an empty slider is worse than no slider, and nothing here
 * ever invents review text.
 */
async function loadReviews() {
  let fetched = null;
  if (BUSINESS.apiBase) {
    try {
      const res = await fetch(`${BUSINESS.apiBase}/api/reviews`, { headers: { accept: 'application/json' } });
      if (res.ok) fetched = await res.json();
    } catch (err) {
      console.warn('reviews unavailable:', err.message);
    }
  }

  reviewData = (fetched?.reviews?.length ? fetched.reviews : MANUAL_REVIEWS) || [];
  if (fetched?.mapsUri) $('#reviewsLink').href = fetched.mapsUri;

  const section = $('#omdomen');
  if (!reviewData.length) { section.hidden = true; return; }
  section.hidden = false;
  renderReviews();
  wireSlider();
}

function renderReviews() {
  const track = $('#revTrack');
  track.innerHTML = reviewData.map((r) => {
    const stars = '★'.repeat(Math.round(r.rating || 5)) + '☆'.repeat(5 - Math.round(r.rating || 5));
    const initial = (r.author || '?').trim().charAt(0).toUpperCase();
    const avatar = r.photo
      ? `<img class="rev__avatar" src="${esc(r.photo)}" alt="" loading="lazy" referrerpolicy="no-referrer">`
      : `<div class="rev__avatar" aria-hidden="true">${esc(initial)}</div>`;
    return `
      <article class="rev">
        <div class="rev__stars" aria-label="${r.rating || 5}/5">${stars}</div>
        <p class="rev__text">${esc(r.text)}</p>
        <div class="rev__by">
          ${avatar}
          <div class="rev__who">
            <strong>${esc(r.author)}</strong>
            <span>${esc(r.when || t('reviews.google'))}</span>
          </div>
        </div>
      </article>`;
  }).join('');
}

function wireSlider() {
  const track = $('#revTrack');
  const prev = $('#revPrev');
  const next = $('#revNext');
  const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 16;

  prev.onclick = () => track.scrollBy({ left: -step(), behavior: 'smooth' });
  next.onclick = () => track.scrollBy({ left: step(), behavior: 'smooth' });

  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
  });

  const sync = () => {
    // Scroll-snap rests the first card just past the track's own left padding,
    // so "at the start" is that padding, not zero.
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= pad + 2;
    next.disabled = track.scrollLeft >= max;
  };
  track.addEventListener('scroll', sync, { passive: true });
  new ResizeObserver(sync).observe(track);
  sync();
}

// --------------------------------------------------------------------- hours

function renderHours() {
  const today = dayOfWeek(toDateStr());
  const order = [1, 2, 3, 4, 5, 6, 0];   // Monday first
  const fmt = new Intl.DateTimeFormat(locale(), { weekday: 'long', timeZone: 'UTC' });

  $('#hoursBody').innerHTML = order.map((d) => {
    const h = HOURS[d];
    // 2026-01-04 is a Sunday, so +d lands on the right weekday name.
    const name = fmt.format(new Date(Date.UTC(2026, 0, 4 + d)));
    const label = h ? `${hhmm(h.open)}–${hhmm(h.close)}` : t('about.closed');
    return `<tr ${d === today ? 'data-today="1"' : ''} ${h ? '' : 'data-closed="1"'}>
      <td>${esc(name[0].toUpperCase() + name.slice(1))}${d === today ? ` <small>(${esc(t('about.today'))})</small>` : ''}</td>
      <td>${esc(label)}</td></tr>`;
  }).join('');
}

// ------------------------------------------------------------------- JSON-LD

function buildJsonLd() {
  const spec = [1, 2, 3, 4, 5, 6, 0].filter((d) => HOURS[d]).map((d) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: `https://schema.org/${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d]}`,
    opens: hhmm(HOURS[d].open),
    closes: hhmm(HOURS[d].close),
  }));

  const data = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: BUSINESS.legalName,
    alternateName: BUSINESS.name,
    url: 'https://asianhairstyleab.se/',
    telephone: BUSINESS.phoneE164,
    email: BUSINESS.email,
    image: 'https://asianhairstyleab.se/assets/og.jpg',
    priceRange: `${Math.min(...SERVICES.map((x) => x.price))}–${Math.max(...SERVICES.map((x) => x.price))} kr`,
    currenciesAccepted: 'SEK',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.street,
      postalCode: BUSINESS.postcode,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: BUSINESS.lat, longitude: BUSINESS.lon },
    openingHoursSpecification: spec,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: BUSINESS.rating,
      reviewCount: BUSINESS.reviewCount,
      bestRating: 5,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Tjänster',
      itemListElement: CATEGORIES.map((c) => ({
        '@type': 'OfferCatalog',
        name: c.sv,
        itemListElement: SERVICES.filter((s) => s.category === c.id).map((s) => ({
          '@type': 'Offer',
          priceCurrency: 'SEK',
          price: String(s.price),
          itemOffered: { '@type': 'Service', name: s.sv, alternateName: s.en },
        })),
      })),
    },
  };

  document.getElementById('ld-business').textContent = JSON.stringify(data);
}

// Started last so every const above is initialised before boot() touches it.
boot();
