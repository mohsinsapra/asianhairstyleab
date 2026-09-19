import { BUSINESS } from './config.js';

// Sends two emails per booking: the alert to the salon, and a confirmation to
// the customer. Both are best-effort — a mail failure never fails a booking.
//
// Secrets: RESEND_API_KEY, and optionally MAIL_FROM once the domain is verified
// in Resend. Until then the default sender works with no DNS setup at all.

const ENDPOINT = 'https://api.resend.com/emails';

export async function sendBookingEmails(env, b) {
  if (!env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set — skipping email for booking', b.id);
    return;
  }
  const from = env.MAIL_FROM || 'Asian Hairstyle AB <onboarding@resend.dev>';
  const to = env.SALON_EMAIL || BUSINESS.email;

  await send(env, {
    from,
    to: [to],
    reply_to: b.email || undefined,
    subject: `Ny bokning: ${b.service.sv} — ${b.date} ${b.timeLabel.split('–')[0]}`,
    html: salonHtml(b),
  });

  if (b.email) {
    await send(env, {
      from,
      to: [b.email],
      reply_to: BUSINESS.email,
      subject: b.lang === 'en'
        ? `Your appointment at ${BUSINESS.name} — ${b.date}`
        : `Din tid hos ${BUSINESS.name} — ${b.date}`,
      html: customerHtml(b),
    });
  }
}

async function send(env, payload) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`);
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const shell = (inner) => `<!doctype html><html><body style="margin:0;padding:24px;background:#FFF7F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#2A0E3A">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #F2E3D5">
${inner}
</div></body></html>`;

const header = (title, sub) => `<div style="background:linear-gradient(120deg,#FF5B4A,#FF2E88 55%,#FFC24B);padding:26px 28px;color:#fff">
<div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.9">${esc(BUSINESS.name)}</div>
<div style="font-size:23px;font-weight:700;margin-top:6px">${esc(title)}</div>
${sub ? `<div style="font-size:14px;opacity:.95;margin-top:4px">${esc(sub)}</div>` : ''}
</div>`;

const row = (k, v) => `<tr>
<td style="padding:9px 0;color:#7A6A80;font-size:14px;width:38%;vertical-align:top">${esc(k)}</td>
<td style="padding:9px 0;font-size:15px;font-weight:600;vertical-align:top">${v}</td></tr>`;

function salonHtml(b) {
  return shell(header('Ny bokning', `${b.date} kl ${b.timeLabel}`) + `
<div style="padding:24px 28px">
<table style="width:100%;border-collapse:collapse">
${row('Tjänst', esc(b.service.sv))}
${row('Datum', esc(b.date))}
${row('Tid', esc(b.timeLabel) + ` <span style="font-weight:400;color:#7A6A80">(${esc(b.durationLabel)})</span>`)}
${row('Pris', `${b.service.price} kr`)}
${row('Kund', esc(b.name))}
${row('Telefon', `<a href="tel:${esc(b.phone)}" style="color:#E01E63">${esc(b.phone)}</a>`)}
${b.email ? row('E-post', `<a href="mailto:${esc(b.email)}" style="color:#E01E63">${esc(b.email)}</a>`) : ''}
${b.notes ? row('Meddelande', esc(b.notes)) : ''}
${row('Språk', b.lang === 'en' ? 'Engelska' : 'Svenska')}
</table>
<div style="margin-top:22px">
<a href="https://wa.me/${BUSINESS.whatsapp}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:11px 18px;border-radius:999px;font-weight:600;font-size:14px;margin-right:8px">WhatsApp</a>
<a href="tel:${esc(b.phone)}" style="display:inline-block;background:#2A0E3A;color:#fff;text-decoration:none;padding:11px 18px;border-radius:999px;font-weight:600;font-size:14px">Ring kunden</a>
</div>
<div style="margin-top:20px;font-size:12px;color:#9A8AA0">Boknings-ID ${esc(b.id)}</div>
</div>`);
}

function customerHtml(b) {
  const en = b.lang === 'en';
  const svcName = en ? b.service.en : b.service.sv;
  const L = en
    ? { t: 'Your appointment is confirmed', lead: 'We look forward to seeing you.', s: 'Service', d: 'Date', ti: 'Time', p: 'Price', w: 'Where', c: 'Need to change or cancel? Just call or WhatsApp us.', dir: 'Get directions' }
    : { t: 'Din tid är bokad', lead: 'Vi ser fram emot att träffa dig.', s: 'Tjänst', d: 'Datum', ti: 'Tid', p: 'Pris', w: 'Var', c: 'Behöver du ändra eller avboka? Ring eller skicka ett WhatsApp.', dir: 'Vägbeskrivning' };

  return shell(header(L.t, `${b.date} · ${b.timeLabel}`) + `
<div style="padding:24px 28px">
<p style="margin:0 0 18px;font-size:15px;color:#5A4A60">${esc(L.lead)}</p>
<table style="width:100%;border-collapse:collapse">
${row(L.s, esc(svcName))}
${row(L.d, esc(b.date))}
${row(L.ti, esc(b.timeLabel) + ` <span style="font-weight:400;color:#7A6A80">(${esc(b.durationLabel)})</span>`)}
${row(L.p, `${b.service.price} kr`)}
${row(L.w, `${esc(BUSINESS.street)}, ${esc(BUSINESS.postcode)} ${esc(BUSINESS.city)}`)}
</table>
<div style="margin-top:22px">
<a href="https://www.google.com/maps/search/?api=1&query=${BUSINESS.mapsQuery}" style="display:inline-block;background:#FF2E88;color:#fff;text-decoration:none;padding:11px 18px;border-radius:999px;font-weight:600;font-size:14px;margin-right:8px">${esc(L.dir)}</a>
<a href="tel:${BUSINESS.phoneE164}" style="display:inline-block;background:#2A0E3A;color:#fff;text-decoration:none;padding:11px 18px;border-radius:999px;font-weight:600;font-size:14px">${esc(BUSINESS.phoneDisplay)}</a>
</div>
<p style="margin:22px 0 0;font-size:13px;color:#7A6A80">${esc(L.c)}</p>
<div style="margin-top:18px;padding-top:16px;border-top:1px solid #F2E3D5;font-size:12px;color:#9A8AA0">
${esc(BUSINESS.legalName)} · ${esc(BUSINESS.street)}, ${esc(BUSINESS.postcode)} ${esc(BUSINESS.city)} · ${esc(BUSINESS.phoneDisplay)}
</div>
</div>`);
}
