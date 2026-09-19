import { BUSINESS, HOURS, BOOKING, CLOSED_DATES } from './config.js';
import { SERVICES, CATEGORIES } from './services.js';
import { t, sname, getLang, locale } from './i18n.js';
import { toDateStr, addDays, dayOfWeek, hhmm, humanDuration, candidateSlots, wallToInstant } from './time.js';

const state = {
  step: 1,
  service: null,
  date: null,
  startMin: null,
  month: null,        // 'YYYY-MM-01' — the month the calendar is showing
  slotsByDate: {},    // 'YYYY-MM-DD' -> [{min,label}]
  loading: false,
  offline: false,     // true when the API can't be reached; falls back to opening hours
  sending: false,
  error: null,
  result: null,
};

let body, stepsEl;

export function initBooking() {
  body = document.getElementById('wizardBody');
  stepsEl = document.getElementById('steps');
  state.month = monthStart(toDateStr());
  render();
}

/** Called by the "Boka" button on each service row. */
export function startWith(serviceId) {
  const svc = SERVICES.find((s) => s.id === serviceId);
  if (!svc) return;
  state.service = svc;
  state.date = null;
  state.startMin = null;
  state.result = null;
  state.error = null;
  state.step = 2;
  state.month = monthStart(toDateStr());
  render();
  loadMonth();
  document.getElementById('boka').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function relabel() {
  if (body) render();
}

// ------------------------------------------------------------------- helpers

const monthStart = (d) => d.slice(0, 8) + '01';
const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const catColor = (id) => `var(--c-${id})`;

function isClosedDay(dateStr) {
  return !HOURS[dayOfWeek(dateStr)] || CLOSED_DATES.includes(dateStr);
}

function monthLabel(dateStr) {
  const [y, m] = dateStr.split('-').map(Number);
  return new Intl.DateTimeFormat(locale(), { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(y, m - 1, 1)));
}

function longDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Intl.DateTimeFormat(locale(), { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
    .format(new Date(Date.UTC(y, m - 1, d)));
}

/** Monday-first weekday initials, localised. */
function dowLabels() {
  const f = new Intl.DateTimeFormat(locale(), { weekday: 'short', timeZone: 'UTC' });
  // 2026-01-05 is a Monday.
  return [0, 1, 2, 3, 4, 5, 6].map((i) => f.format(new Date(Date.UTC(2026, 0, 5 + i))).replace('.', '').slice(0, 3));
}

// ----------------------------------------------------------------- API calls

async function loadMonth() {
  if (!state.service) return;
  const today = toDateStr();
  const horizon = addDays(today, BOOKING.maxDaysAhead);

  const first = state.month < today ? today : state.month;
  const [y, m] = state.month.split('-').map(Number);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  let last = `${state.month.slice(0, 8)}${String(daysInMonth).padStart(2, '0')}`;
  if (last > horizon) last = horizon;
  if (first > last) { state.slotsByDate = {}; render(); return; }

  const span = Math.round((Date.parse(last) - Date.parse(first)) / 86400000) + 1;

  state.loading = true;
  state.offline = false;
  render();

  try {
    if (!BUSINESS.apiBase) throw new Error('no api configured');
    const url = `${BUSINESS.apiBase}/api/availability?service=${encodeURIComponent(state.service.id)}&date=${first}&days=${span}`;
    const res = await fetch(url, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`availability ${res.status}`);
    const data = await res.json();
    state.slotsByDate = data.slots || {};
  } catch (err) {
    // The API is unreachable. Rather than show an empty calendar, fall back to
    // plain opening hours and tell the customer we'll confirm the slot by hand.
    console.warn('availability fallback:', err.message);
    state.offline = true;
    state.slotsByDate = {};
    for (let i = 0; i < span; i++) {
      const d = addDays(first, i);
      state.slotsByDate[d] = candidateSlots(d, state.service.duration, {
        hours: HOURS, closedDates: CLOSED_DATES,
        slotMinutes: 30, minNoticeHours: BOOKING.minNoticeHours,
      }).map((min) => ({ min, label: hhmm(min) }));
    }
  } finally {
    state.loading = false;
    render();
  }
}

async function submit() {
  state.sending = true;
  state.error = null;
  render();

  const f = state.form;
  const payload = {
    serviceId: state.service.id,
    date: state.date,
    startMin: state.startMin,
    name: f.name, phone: f.phone, email: f.email, notes: f.notes,
    lang: getLang(), company: f.company,
  };

  try {
    if (!BUSINESS.apiBase) throw new Error('no_api');
    const res = await fetch(`${BUSINESS.apiBase}/api/booking`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (res.status === 409) {
      state.error = t('booking.errTaken');
      state.startMin = null;
      state.step = 3;
      state.sending = false;
      render();
      loadMonth();
      return;
    }
    if (!res.ok) throw new Error(data.error || `http ${res.status}`);

    state.result = { id: data.id, ...payload };
  } catch (err) {
    console.error('booking failed:', err);
    // Never leave the customer with a dead end — hand them straight to WhatsApp.
    state.error = t('booking.errGeneric', { phone: BUSINESS.phoneDisplay });
    state.sending = false;
    render();
    return;
  }

  state.sending = false;
  state.step = 5;
  render();
  document.getElementById('boka').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// -------------------------------------------------------------------- render

function render() {
  renderSteps();
  const map = { 1: stepService, 2: stepDate, 3: stepTime, 4: stepDetails, 5: stepDone };
  body.innerHTML = '';
  body.appendChild(map[state.step]());
}

function renderSteps() {
  if (state.step === 5) { stepsEl.hidden = true; return; }
  stepsEl.hidden = false;
  const labels = [t('booking.step1'), t('booking.step2'), t('booking.step3'), t('booking.step4')];
  stepsEl.innerHTML = labels.map((label, i) => {
    const n = i + 1;
    const stateAttr = n === state.step ? 'active' : n < state.step ? 'done' : 'todo';
    return `<li data-state="${stateAttr}"><b>${n < state.step ? '✓' : n}</b><span>${esc(label)}</span></li>`;
  }).join('');
}

function nav({ back, next, nextLabel, nextDisabled }) {
  const wrap = el(`<div class="wizard__nav"></div>`);
  if (back) {
    const b = el(`<button type="button" class="btn btn--ghost">${esc(t('booking.back'))}</button>`);
    b.onclick = back;
    wrap.appendChild(b);
  }
  if (next) {
    const n = el(`<button type="button" class="btn btn--primary"${nextDisabled ? ' disabled' : ''}>${esc(nextLabel || t('booking.next'))}</button>`);
    n.onclick = next;
    wrap.appendChild(n);
  }
  return wrap;
}

// step 1 — pick a service
function stepService() {
  const box = el('<div></div>');
  box.appendChild(el(`<h3>${esc(t('booking.pickService'))}</h3>`));

  const list = el('<div class="pick"></div>');
  for (const cat of CATEGORIES) {
    const rows = SERVICES.filter((s) => s.category === cat.id);
    if (!rows.length) continue;
    list.appendChild(el(`<h4 style="margin:14px 0 4px;font:600 13px var(--body);color:var(--ink-faint)">${esc(getLang() === 'en' ? cat.en : cat.sv)}</h4>`));
    for (const s of rows) {
      const btn = el(`
        <button type="button" class="pickitem" style="--cat:${catColor(s.category)}"
                aria-pressed="${state.service?.id === s.id}">
          <span><b>${esc(sname(s))}</b><small>${esc(humanDuration(s.duration))}</small></span>
          <i>${s.price} kr</i>
        </button>`);
      btn.onclick = () => {
        state.service = s;
        state.date = null;
        state.startMin = null;
        state.step = 2;
        render();
        loadMonth();
      };
      list.appendChild(btn);
    }
  }
  box.appendChild(list);
  return box;
}

// step 2 — pick a date
function stepDate() {
  const box = el('<div></div>');
  box.appendChild(el(`<h3>${esc(t('booking.pickDate'))}</h3>`));
  box.appendChild(chosenService());

  if (state.offline) box.appendChild(el(`<p class="note">${esc(t('booking.slotsFallback'))}</p>`));

  const today = toDateStr();
  const horizon = addDays(today, BOOKING.maxDaysAhead);
  const [y, m] = state.month.split('-').map(Number);

  const head = el(`
    <div class="cal__head">
      <div class="cal__month">${esc(monthLabel(state.month))}</div>
      <div class="cal__nav">
        <button type="button" aria-label="Föregående månad" ${state.month <= monthStart(today) ? 'disabled' : ''}>‹</button>
        <button type="button" aria-label="Nästa månad" ${state.month >= monthStart(horizon) ? 'disabled' : ''}>›</button>
      </div>
    </div>`);
  const [prev, next] = head.querySelectorAll('button');
  prev.onclick = () => { state.month = shiftMonth(state.month, -1); render(); loadMonth(); };
  next.onclick = () => { state.month = shiftMonth(state.month, 1); render(); loadMonth(); };
  box.appendChild(head);

  const grid = el('<div class="cal__grid"></div>');
  for (const d of dowLabels()) grid.appendChild(el(`<div class="cal__dow">${esc(d)}</div>`));

  // Monday-first offset.
  const firstDow = (dayOfWeek(state.month) + 6) % 7;
  for (let i = 0; i < firstDow; i++) grid.appendChild(el('<div class="cal__blank"></div>'));

  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const ds = `${state.month.slice(0, 8)}${String(day).padStart(2, '0')}`;
    const closed = isClosedDay(ds);
    const known = Object.prototype.hasOwnProperty.call(state.slotsByDate, ds);
    const full = known && state.slotsByDate[ds].length === 0;
    const disabled = ds < today || ds > horizon || closed || (known && full);

    const b = el(`
      <button type="button" class="cal__day"
        ${disabled ? 'disabled' : ''}
        ${closed ? 'data-closed="1"' : ''}
        ${ds === today ? 'data-today="1"' : ''}
        aria-pressed="${state.date === ds}"
        aria-label="${esc(longDate(ds))}${closed ? ` — ${esc(t('booking.closedDay'))}` : ''}">${day}</button>`);
    if (!disabled) b.onclick = () => { state.date = ds; state.startMin = null; state.step = 3; render(); };
    grid.appendChild(b);
  }
  box.appendChild(grid);

  if (state.loading) box.appendChild(el(`<p class="empty">${esc(t('booking.loadingSlots'))}</p>`));

  box.appendChild(nav({ back: () => { state.step = 1; render(); } }));
  return box;
}

function shiftMonth(ms, delta) {
  const [y, m] = ms.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`;
}

// step 3 — pick a time
function stepTime() {
  const box = el('<div></div>');
  box.appendChild(el(`<h3>${esc(t('booking.pickTime'))}</h3>`));
  box.appendChild(chosenService(true));

  if (state.error) box.appendChild(el(`<p class="alert">${esc(state.error)}</p>`));
  if (state.offline) box.appendChild(el(`<p class="note">${esc(t('booking.slotsFallback'))}</p>`));

  const slots = state.slotsByDate[state.date] || [];

  if (state.loading) {
    box.appendChild(el(`<p class="empty">${esc(t('booking.loadingSlots'))}</p>`));
  } else if (!slots.length) {
    box.appendChild(el(`<p class="empty">${esc(t('booking.noSlots'))}</p>`));
  } else {
    const groups = [
      ['09:00–12:00', slots.filter((s) => s.min < 720)],
      ['12:00–17:00', slots.filter((s) => s.min >= 720 && s.min < 1020)],
      ['17:00–20:00', slots.filter((s) => s.min >= 1020)],
    ];
    for (const [label, items] of groups) {
      if (!items.length) continue;
      const g = el(`<div class="slotgroup"><h4>${esc(label)}</h4><div class="slots"></div></div>`);
      const row = g.querySelector('.slots');
      for (const s of items) {
        const b = el(`<button type="button" class="slot" aria-pressed="${state.startMin === s.min}">${esc(s.label)}</button>`);
        b.onclick = () => { state.startMin = s.min; state.error = null; state.step = 4; render(); };
        row.appendChild(b);
      }
      g.appendChild(row);
      box.appendChild(g);
    }
  }

  box.appendChild(nav({ back: () => { state.step = 2; state.error = null; render(); } }));
  return box;
}

// step 4 — details + confirm
function stepDetails() {
  state.form ||= { name: '', phone: '', email: '', notes: '', company: '' };
  const f = state.form;

  const box = el('<div></div>');
  box.appendChild(el(`<h3>${esc(t('booking.yourDetails'))}</h3>`));
  box.appendChild(summaryBlock());
  if (state.error) box.appendChild(el(`<p class="alert">${esc(state.error)}</p>`));

  const form = el('<form novalidate></form>');
  form.innerHTML = `
    <div class="field" data-k="name">
      <label for="bf-name">${esc(t('booking.name'))}</label>
      <input id="bf-name" name="name" type="text" autocomplete="name" required
             placeholder="${esc(t('booking.namePh'))}" value="${esc(f.name)}">
      <p class="field__err">${esc(t('booking.errName'))}</p>
    </div>
    <div class="field" data-k="phone">
      <label for="bf-phone">${esc(t('booking.phone'))}</label>
      <input id="bf-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required
             placeholder="${esc(t('booking.phonePh'))}" value="${esc(f.phone)}">
      <p class="field__err">${esc(t('booking.errPhone'))}</p>
    </div>
    <div class="field" data-k="email">
      <label for="bf-email">${esc(t('booking.email'))}</label>
      <input id="bf-email" name="email" type="email" inputmode="email" autocomplete="email"
             placeholder="${esc(t('booking.emailPh'))}" value="${esc(f.email)}">
      <p class="field__err">${esc(t('booking.errEmail'))}</p>
    </div>
    <div class="field" data-k="notes">
      <label for="bf-notes">${esc(t('booking.notes'))}</label>
      <textarea id="bf-notes" name="notes" rows="3" placeholder="${esc(t('booking.notesPh'))}">${esc(f.notes)}</textarea>
    </div>
    <div class="hp" aria-hidden="true">
      <label>Company<input name="company" tabindex="-1" autocomplete="off" value=""></label>
    </div>`;

  form.addEventListener('input', (e) => {
    if (!e.target.name) return;
    f[e.target.name] = e.target.value;
    e.target.closest('.field')?.removeAttribute('data-invalid');
  });
  form.addEventListener('submit', (e) => { e.preventDefault(); tryConfirm(form); });
  box.appendChild(form);

  box.appendChild(nav({
    back: () => { state.step = 3; state.error = null; render(); },
    next: () => tryConfirm(form),
    nextLabel: state.sending ? t('booking.sending') : t('booking.confirm'),
    nextDisabled: state.sending,
  }));
  return box;
}

function tryConfirm(form) {
  const f = state.form;
  f.company = form.querySelector('[name=company]')?.value || '';
  let ok = true;
  const mark = (k, good) => {
    const field = form.querySelector(`.field[data-k="${k}"]`);
    if (good) field?.removeAttribute('data-invalid');
    else { field?.setAttribute('data-invalid', '1'); ok = false; }
  };
  mark('name', f.name.trim().length >= 2);
  mark('phone', (f.phone.match(/\d/g) || []).length >= 7);
  mark('email', !f.email.trim() || /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(f.email.trim()));
  if (!ok) { form.querySelector('.field[data-invalid] input')?.focus(); return; }
  if (state.startMin == null) { state.error = t('booking.errSlot'); render(); return; }
  submit();
}

// step 5 — confirmation
function stepDone() {
  const box = el('<div class="done"></div>');
  box.appendChild(el(`
    <div class="done__tick"><svg viewBox="0 0 24 24" width="32" height="32"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="m5 13 4.5 4.5L19 7.5"/></svg></div>`));
  box.appendChild(el(`<h3>${esc(t('booking.doneTitle'))}</h3>`));
  box.appendChild(el(`<p>${esc(t('booking.doneLead'))}</p>`));
  box.appendChild(summaryBlock());

  const btns = el('<div class="done__btns"></div>');

  const ics = el(`<button type="button" class="btn btn--primary">${esc(t('booking.addCalendar'))}</button>`);
  ics.onclick = downloadIcs;
  btns.appendChild(ics);

  btns.appendChild(el(`
    <a class="btn btn--wa" target="_blank" rel="noopener" href="https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(whatsappText())}">
      ${esc(t('booking.sendWhatsapp'))}</a>`));

  const again = el(`<button type="button" class="btn btn--ghost">${esc(t('booking.bookAnother'))}</button>`);
  again.onclick = () => {
    Object.assign(state, { step: 1, service: null, date: null, startMin: null, result: null, error: null, form: null });
    render();
  };
  btns.appendChild(again);

  box.appendChild(btns);
  return box;
}

// ------------------------------------------------------------ shared pieces

function chosenService(withDate) {
  const s = state.service;
  if (!s) return el('<div></div>');
  const bits = [humanDuration(s.duration), `${s.price} kr`];
  if (withDate && state.date) bits.unshift(longDate(state.date));
  return el(`
    <p class="note" style="background:#FBF3FF;border-color:#EBD9F7;color:var(--ink-soft)">
      <strong style="color:var(--ink)">${esc(sname(s))}</strong> — ${esc(bits.join(', '))}
    </p>`);
}

function summaryBlock() {
  const s = state.service;
  const rows = [
    [t('booking.step1'), esc(sname(s))],
    [t('booking.step2'), esc(longDate(state.date))],
    [t('booking.step3'), `${hhmm(state.startMin)}–${hhmm(state.startMin + s.duration)}`],
  ];
  return el(`
    <div class="summary">
      <dl>${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>
      <p class="summary__total"><span>${esc(t('booking.summary'))}</span><b>${s.price} kr</b></p>
    </div>`);
}

function whatsappText() {
  const s = state.service;
  return `${sname(s)} — ${state.date} ${hhmm(state.startMin)}\n${state.form?.name || ''} ${state.form?.phone || ''}`.trim();
}

function downloadIcs() {
  const s = state.service;
  const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const start = wallToInstant(state.date, state.startMin);
  const end = wallToInstant(state.date, state.startMin + s.duration);

  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Asian Hairstyle AB//Booking//SV', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${state.result?.id || crypto.randomUUID()}@asianhairstyleab.se`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${sname(s)} — ${BUSINESS.name}`,
    `LOCATION:${BUSINESS.street}\\, ${BUSINESS.postcode} ${BUSINESS.city}`,
    `DESCRIPTION:${sname(s)} (${humanDuration(s.duration)})\\, ${s.price} kr. ${BUSINESS.phoneDisplay}`,
    'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', `DESCRIPTION:${BUSINESS.name}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `asian-hairstyle-${state.date}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
