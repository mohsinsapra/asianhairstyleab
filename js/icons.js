// Tiles for services that have no photograph yet.
//
// Nine of the 29 services came across from SumUp without an image. Rather than
// borrow a photo of a different treatment — a face-threading shot standing in
// for a leg wax misleads the customer — each falls back to a line icon drawn in
// its category's colour. As soon as a real photo is added to services.js, the
// photo wins and the icon is never rendered.
//
// All icons share a 24×24 grid and a 1.6 stroke so they sit together evenly.

const S = (inner) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

// The six waxing services differ only by body area, so six identical wax strips
// would tell the customer nothing. Instead: one figure, with the area being
// treated drawn solid over a faint body. Reads instantly at thumbnail size and
// is the convention salon and clinic menus already use.
const BODY = (highlight) => S(`
  <g opacity=".28">
    <circle cx="12" cy="4.1" r="2.1"/>
    <path d="M12 6.4v7.4"/>
    <path d="M12 8.3 8.5 11.3 7.5 15.2"/>
    <path d="M12 8.3 15.5 11.3 16.5 15.2"/>
    <path d="M12 13.8 10.1 17.1 9.5 21"/>
    <path d="M12 13.8 13.9 17.1 14.5 21"/>
  </g>
  <g stroke-width="2.2">${highlight}</g>`);

const ARM_L = '<path d="M12 8.3 8.5 11.3 7.5 15.2"/>';
const ARM_R = '<path d="M12 8.3 15.5 11.3 16.5 15.2"/>';
const LEG_L = '<path d="M12 13.8 10.1 17.1 9.5 21"/>';
const LEG_R = '<path d="M12 13.8 13.9 17.1 14.5 21"/>';

const WAX_ARMS      = BODY(ARM_L + ARM_R);
const WAX_ARM       = BODY(ARM_R);
const WAX_LEGS      = BODY(LEG_L + LEG_R);
const WAX_LEGS_ARMS = BODY(ARM_L + ARM_R + LEG_L + LEG_R);
const WAX_UNDERARM  = BODY('<circle cx="9.9" cy="9.7" r="1.5"/><circle cx="14.1" cy="9.7" r="1.5"/>');

// Generic fallback, used only if a future waxing service has no photo and no
// entry in BY_SERVICE: a wax strip mid-peel.
const WAX = S(`
  <path d="M4.2 14.4 12 6.6a2 2 0 0 1 2.8 0l2.4 2.4a2 2 0 0 1 0 2.8l-7.8 7.8z"/>
  <path d="M14.6 11.8c1.7 1.1 3.3 1.3 4.9.5"/>
  <path d="M18.4 4.6l.7 1.5 1.5.7-1.5.7-.7 1.5-.7-1.5-1.5-.7 1.5-.7z"/>`);

const SCISSORS = S(`
  <circle cx="6" cy="18" r="2.6"/><circle cx="18" cy="18" r="2.6"/>
  <path d="M7.9 16.1 18.5 4.5"/><path d="M16.1 16.1 5.5 4.5"/>`);

// Treatment bottle with a drop leaving the neck.
const TREATMENT = S(`
  <path d="M10 3h4v2.6l2.2 2.4a3 3 0 0 1 .8 2V18a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-8a3 3 0 0 1 .8-2L10 5.6z"/>
  <path d="M7.2 13.4h9.6"/>
  <path d="M12 8.4c.9 1 1.4 1.8 1.4 2.4a1.4 1.4 0 0 1-2.8 0c0-.6.5-1.4 1.4-2.4z"/>`);

// Brow arc over an eye, plus a tint drop.
const BROW = S(`
  <path d="M3.6 9.2C6 6.6 9.2 5.6 12.6 6.6"/>
  <path d="M3.8 15.4c2.6-3 6.6-3 9.2 0-2.6 3-6.6 3-9.2 0z"/>
  <circle cx="8.4" cy="15.4" r="1.5"/>
  <path d="M18.6 8.8c1.3 1.6 2 2.7 2 3.5a2 2 0 1 1-4 0c0-.8.7-1.9 2-3.5z"/>`);

// Brush loaded with colour.
const COLOUR = S(`
  <path d="M8.6 14.8 17.9 5.5a2.2 2.2 0 0 1 3.1 3.1L11.7 18z"/>
  <path d="M8.6 14.8 11.7 18l-2.4 1.9a2.6 2.6 0 0 1-3.9-2.9z"/>
  <path d="M3.4 20.8c1.2.4 2.2.2 2.9-.6"/>`);

const DRYER = S(`
  <path d="M3.4 8.6a4.2 4.2 0 0 1 4.2-4.2h6.2a4.2 4.2 0 0 1 0 8.4H7.6a4.2 4.2 0 0 1-4.2-4.2z"/>
  <path d="M9.6 12.8v3.4a2.4 2.4 0 0 0 2.4 2.4h.6"/>
  <path d="M17.2 9.4 21 11"/><path d="M17.2 7.8 21 6.2"/>`);

// Mehndi-style rosette.
const HENNA = S(`
  <circle cx="12" cy="12" r="2.4"/>
  <circle cx="12" cy="12" r="6.2"/>
  <path d="M12 3.2v2.6M12 18.2v2.6M3.2 12h2.6M18.2 12h2.6"/>
  <path d="m5.8 5.8 1.9 1.9M16.3 16.3l1.9 1.9M18.2 5.8l-1.9 1.9M7.7 16.3l-1.9 1.9"/>`);

const FACE = S(`
  <path d="M12 3.4c4 0 6.6 2.8 6.6 7 0 4.8-3 10.2-6.6 10.2S5.4 15.2 5.4 10.4c0-4.2 2.6-7 6.6-7z"/>
  <path d="M9.4 10.4h1.4M13.2 10.4h1.4"/>
  <path d="M10.4 14.6c1 .8 2.2.8 3.2 0"/>`);

// Polish bottle with a brush, for the nails menu.
const NAILS = S(`
  <path d="M10.4 2.6h3.2v3.1l1.5 1.4a2.4 2.4 0 0 1 .8 1.8v9.7a2.4 2.4 0 0 1-2.4 2.4h-3a2.4 2.4 0 0 1-2.4-2.4V8.9a2.4 2.4 0 0 1 .8-1.8l1.5-1.4z"/>
  <path d="M8.1 11.6h7.8"/>
  <path d="M19.4 6.1c1 1.6 1.5 2.7 1.5 3.3a1.5 1.5 0 0 1-3 0c0-.6.5-1.7 1.5-3.3z"/>`);

/** Per-category default. */
const BY_CATEGORY = {
  klippning: SCISSORS,
  farg: COLOUR,
  behandling: TREATMENT,
  styling: DRYER,
  bryn: BROW,
  vaxning: WAX,
  henna: HENNA,
  ansikte: FACE,
  naglar: NAILS,
};

/** Services that read better with something more specific than their category. */
const BY_SERVICE = {
  'vax-armar':     WAX_ARMS,
  'vax-arm':       WAX_ARM,
  'vax-ben':       WAX_LEGS,
  'vax-ben-armar': WAX_LEGS_ARMS,
  'vax-armhalor':  WAX_UNDERARM,
  'vax-ansikte':   FACE,          // a face reads better here than a body
};

export function serviceIcon(service) {
  return BY_SERVICE[service.id] || BY_CATEGORY[service.category] || SCISSORS;
}
