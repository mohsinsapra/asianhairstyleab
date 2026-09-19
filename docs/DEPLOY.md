# Deploying asianhairstyleab.se

Do these in order. Steps 1–3 put the site online. Steps 4–6 switch the booking engine on. The site is useful after step 3 even if you stop there for a few days.

Everything here fits inside the free tiers of GitHub and Cloudflare. Nothing in this document costs money.

---

## 1. GitHub Pages

The repo is already pushed. Turn Pages on:

1. Go to **Settings → Pages** in the GitHub repo.
2. **Source:** Deploy from a branch.
3. **Branch:** `main`, folder **`/ (root)`**. Save.
4. Wait ~1 minute, then check the `github.io` URL it shows you. The site should load (styling and all) — it just won't be on your own domain yet.

`CNAME` already contains `asianhairstyleab.se`, so GitHub knows which domain to expect. Leave the **Enforce HTTPS** box alone for now; it can't be ticked until DNS points here.

---

## 2. Point the domain at Cloudflare

Your domain is registered at **Loopia** and currently has no DNS set up, which makes this clean.

**In Cloudflare:**

1. **Add a site** → type `asianhairstyleab.se` → choose the **Free** plan.
2. Cloudflare will show you two nameservers, something like
   `xxx.ns.cloudflare.com` and `yyy.ns.cloudflare.com`. Copy both.

**In Loopia:**

3. Log in → find `asianhairstyleab.se` → **Namnservrar** (nameservers).
4. Choose the option for *"Använd egna namnservrar"* / your own nameservers.
5. Replace whatever is there with the two Cloudflare ones. Save.

Then wait. `.se` usually updates within an hour or two, sometimes up to 24. Cloudflare emails you when the domain goes active.

Check progress any time:

```bash
dig +short NS asianhairstyleab.se
```

When that prints the two `ns.cloudflare.com` names, you're through.

---

## 3. DNS records for the website

Once Cloudflare says the domain is **Active**, go to **DNS → Records** and add these five.

> **Set the proxy to DNS only (grey cloud) for now.** GitHub has to reach your domain directly to issue its TLS certificate, and the orange cloud blocks that. You turn it on in step 3c.

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | `185.199.108.153` | DNS only |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `mohsinsapra.github.io` | DNS only |

**3b. Let GitHub issue the certificate.**
Back in **GitHub → Settings → Pages**, the Custom domain box should already say `asianhairstyleab.se`. It will show *"DNS check in progress"*, then a green tick. Once ticked, enable **Enforce HTTPS**. This usually takes 10–30 minutes; occasionally an hour. Don't skip ahead — the certificate has to exist before the next step.

**3c. Now turn the proxy on (optional but worth it).**
Only after HTTPS is working on your domain:

- Flip all five records to **Proxied** (orange cloud).
- Go to **SSL/TLS → Overview** and set the mode to **Full**. Not Flexible — Flexible will cause a redirect loop with GitHub Pages.

You now get Cloudflare's caching, analytics and DDoS protection. If anything looks broken afterwards, flip back to grey cloud; that always works.

---

## 4. The booking API

```bash
cd worker
npm install
npx wrangler login              # opens a browser once
npx wrangler d1 create ahab-bookings
```

That last command prints a `database_id`. Paste it into `worker/wrangler.toml`, replacing the placeholder. Then:

```bash
npx wrangler d1 execute ahab-bookings --remote --file=./schema.sql
npx wrangler deploy
```

The `routes` block in `wrangler.toml` makes Cloudflare create the `api.asianhairstyleab.se` DNS record for you — there's nothing to add by hand.

Check it:

```bash
curl https://api.asianhairstyleab.se/api/health
# {"ok":true,"services":29}
```

The website is already pointed at this URL, so bookings start working the moment this responds.

---

## 5. Email notifications

Bookings are stored safely without this, but you won't be told about them until you do it.

1. Sign up at **resend.com** (free: 100 emails/day, 3,000/month — far more than you need).
2. Create an API key.
3. ```bash
   cd worker
   npx wrangler secret put RESEND_API_KEY     # paste the key
   npx wrangler secret put SALON_EMAIL        # asian.hairstyle2025@gmail.com
   ```

That's enough to start. Emails will arrive from `onboarding@resend.dev`.

**To send from your own domain instead** (looks more professional, less likely to hit spam): in Resend, add `asianhairstyleab.se` as a domain, copy the DKIM/SPF records it gives you into Cloudflare DNS, wait for it to verify, then:

```bash
npx wrangler secret put MAIL_FROM
# Asian Hairstyle AB <bokning@asianhairstyleab.se>
```

---

## 6. Google Calendar (optional)

Until this is set up, everything works — bookings are stored and emailed, they just don't appear in a calendar app.

1. In **Google Cloud Console**, create a project and enable the **Google Calendar API**.
2. Create a **Service account**. Under its Keys tab, **Add key → JSON**, and download it.
3. Open the JSON. You need `client_email` and `private_key`.
4. In **Google Calendar**, open the calendar you want bookings in → **Settings and sharing** → **Share with specific people** → add the `client_email` address with permission **Make changes to events**.
5. On that same settings page, copy the **Calendar ID** (often just your Gmail address).
6. ```bash
   cd worker
   npx wrangler secret put GOOGLE_CALENDAR_ID     # the Calendar ID
   npx wrangler secret put GOOGLE_SA_EMAIL        # client_email
   npx wrangler secret put GOOGLE_SA_PRIVATE_KEY  # the whole private_key, -----BEGIN…END----- included
   npx wrangler deploy
   ```

Step 4 is the one people miss. Without sharing the calendar with the service account, the Worker authenticates fine and then gets a 404 writing the event.

---

## Day-to-day

**See your bookings:**

```bash
cd worker && npm run db:bookings
```

**Watch live logs:**

```bash
cd worker && npm run tail
```

**Change a price:** edit `js/services.js`, mirror it into `worker/src/services.js`, run `npm run check-sync`, commit and push. GitHub Pages redeploys on its own; run `npx wrangler deploy` in `worker/` for the API side.

**Close for a holiday:** add the date to `CLOSED_DATES` in *both* `js/config.js` and `worker/src/config.js`, then push and redeploy the Worker.

---

## If something breaks

| Symptom | Cause | Fix |
|---|---|---|
| Site loads on `github.io` but not your domain | DNS hasn't propagated | `dig +short NS asianhairstyleab.se` — wait for the Cloudflare nameservers |
| Redirect loop after enabling the orange cloud | SSL mode is Flexible | **SSL/TLS → Overview → Full** |
| GitHub won't issue a certificate | Proxy is on too early | Set all records to DNS only, wait, then re-enable |
| Booking form shows opening hours and says it'll confirm by hand | The Worker isn't reachable | `curl https://api.asianhairstyleab.se/api/health` |
| Bookings appear in the database but no email | `RESEND_API_KEY` missing or wrong | `npx wrangler tail` and book once to see the error |
| Email arrives but no calendar event | Calendar not shared with the service account | Step 6.4 above |
| Times look an hour off | Something set a timezone other than Europe/Stockholm | `npm test` — the DST tests will catch it |
