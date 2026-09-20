import { availableSlots, findService } from '../worker/src/availability.js';
import { hhmm } from '../worker/src/time.js';

let fail = 0;
const eq = (got, want, label) => {
  const ok = String(got) === String(want);
  if (!ok) fail++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}: got ${got}${ok ? '' : `  want ${want}`}`);
};

const NOW = new Date('2026-09-01T06:00:00Z');   // well before the test dates
const SAT = '2026-09-19';                        // Sat 10:00–18:00
const TUE = '2026-09-22';                        // closed

const cut   = findService('damklippning-kort-har');    // 45 min, maxConcurrent 2
const ker   = findService('keratinbehandling-langt-har'); // 360 min, maxConcurrent 1
const bal   = findService('balayage-toning');          // 270 min, maxConcurrent 1

eq(cut.duration, 45, 'haircut duration');
eq(ker.duration, 360, 'keratin duration');
eq(ker.maxConcurrent, 1, 'keratin is one-at-a-time');
eq(cut.maxConcurrent, 2, 'haircut runs in parallel');

const slots = (d, s, booked) => availableSlots(d, s, booked, NOW).map(hhmm);

// Baseline
eq(slots(SAT, cut, []).length, 30, 'empty Saturday, 45min');
eq(slots(TUE, cut, []).length, 0, 'Tuesday closed');

// ONE haircut booked 12:00–12:45. staffCount 2, maxConcurrent 2 -> still bookable.
const oneCut = [{ start_min: 720, end_min: 765, service_id: 'damklippning-kort-har' }];
eq(slots(SAT, cut, oneCut).includes('12:00'), true, '1 haircut: 12:00 still open (parallel)');

// TWO haircuts at 12:00 -> per-service cap of 2 reached.
const twoCuts = [
  { start_min: 720, end_min: 765, service_id: 'damklippning-kort-har' },
  { start_min: 720, end_min: 765, service_id: 'damklippning-kort-har' },
];
eq(slots(SAT, cut, twoCuts).includes('12:00'), false, '2 haircuts: 12:00 now full');
eq(slots(SAT, cut, twoCuts).includes('12:45'), true, '2 haircuts: 12:45 free again');
eq(slots(SAT, cut, twoCuts).includes('11:30'), false, '2 haircuts: 11:30 would overlap');
eq(slots(SAT, cut, twoCuts).includes('11:15'), true, '2 haircuts: 11:15 ends exactly at 12:00');

// A single keratin blocks the whole day for another keratin (maxConcurrent 1).
const oneKeratin = [{ start_min: 600, end_min: 960, service_id: 'keratinbehandling-langt-har' }];
eq(slots(SAT, ker, oneKeratin).length, 0, 'keratin booked -> no second keratin');
// ...but a haircut can still run alongside it, because staffCount is 2.
eq(slots(SAT, cut, oneKeratin).includes('11:00'), true, 'haircut alongside keratin');

// Keratin + haircut = 2 staff busy -> nothing else can overlap.
const busy = [
  { start_min: 600, end_min: 960, service_id: 'keratinbehandling-langt-har' },
  { start_min: 660, end_min: 705, service_id: 'damklippning-kort-har' },
];
eq(slots(SAT, cut, busy).includes('11:00'), false, 'both staff busy at 11:00');
eq(slots(SAT, cut, busy).includes('11:45'), true, 'free once the haircut ends');

// Different one-at-a-time services still consume the 2 staff slots.
const twoLong = [
  { start_min: 600, end_min: 960, service_id: 'keratinbehandling-langt-har' },
  { start_min: 600, end_min: 870, service_id: 'balayage-toning' },
];
eq(slots(SAT, cut, twoLong).includes('10:30'), false, 'keratin + balayage = salon full');
eq(slots(SAT, bal, twoLong).length, 0, 'no balayage while both staff busy all day');

console.log(fail ? `\n${fail} FAILURES` : '\nall passing');
process.exit(fail ? 1 : 0);
