// Customer reviews shown in the slider.
//
// There are two ways to fill this, and you only need one:
//
//   1. LIVE  — set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID as Worker secrets.
//              The site then pulls the newest reviews straight from Google once
//              a day and ignores the list below entirely.
//
//   2. MANUAL — paste real reviews into REVIEWS below, copying the wording from
//              your Google listing. Used whenever the live fetch returns nothing.
//
// Leave it empty and the reviews section simply doesn't appear. Never put
// invented reviews here: made-up testimonials are illegal marketing in Sweden
// (marknadsföringslagen) and Google can delist a business for them.
//
// Shape:
//   { author: 'Namn', rating: 5, text: 'Vad de skrev…', when: 'för 2 månader sedan' }

export const REVIEWS = [];

/** Fallback used when Google returns nothing and REVIEWS is empty. */
export const HAS_MANUAL_REVIEWS = REVIEWS.length > 0;
