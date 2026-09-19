import { wallToInstant, toDateStr, toMinutes, dayOfWeek, hhmm, humanDuration, candidateSlots, tzOffsetMinutes, addDays } from '../js/time.js';

let fail = 0;
const eq = (got, want, label) => {
  const ok = String(got) === String(want);
  if (!ok) fail++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}: got ${got}${ok ? '' : `  want ${want}`}`);
};

// Winter (CET, +1): 14:00 Stockholm = 13:00 UTC
eq(wallToInstant('2026-01-15', 14*60).toISOString(), '2026-01-15T13:00:00.000Z', 'CET winter 14:00');
// Summer (CEST, +2): 14:00 Stockholm = 12:00 UTC
eq(wallToInstant('2026-07-15', 14*60).toISOString(), '2026-07-15T12:00:00.000Z', 'CEST summer 14:00');
// Day before spring-forward 2027-03-28
eq(wallToInstant('2027-03-27', 10*60).toISOString(), '2027-03-27T09:00:00.000Z', 'day before DST start');
// Day of spring-forward, salon opens 10:00 -> already CEST
eq(wallToInstant('2027-03-28', 10*60).toISOString(), '2027-03-28T08:00:00.000Z', 'DST start day 10:00');
// Fall-back day 2026-10-25, 10:00 is after the 03:00 switch -> CET
eq(wallToInstant('2026-10-25', 10*60).toISOString(), '2026-10-25T09:00:00.000Z', 'DST end day 10:00');
eq(tzOffsetMinutes(new Date('2026-01-15T12:00:00Z')), 60, 'offset CET');
eq(tzOffsetMinutes(new Date('2026-07-15T12:00:00Z')), 120, 'offset CEST');

// Round trip
eq(toDateStr(wallToInstant('2026-07-15', 14*60)), '2026-07-15', 'roundtrip date');
eq(toMinutes(wallToInstant('2026-07-15', 14*60)), 840, 'roundtrip minutes');

// Weekday: 2026-09-19 is a Saturday
eq(dayOfWeek('2026-09-19'), 6, 'Sat=6');
eq(dayOfWeek('2026-09-22'), 2, 'Tue=2');
eq(addDays('2026-12-31', 1), '2027-01-01', 'addDays across year');
eq(addDays('2027-02-28', 1), '2027-03-01', 'addDays non-leap Feb');

eq(hhmm(570), '09:30', 'hhmm'); eq(hhmm(1170), '19:30', 'hhmm 19:30');
eq(humanDuration(270), '4 h 30 min', 'dur 4h30'); eq(humanDuration(60), '1 h', 'dur 1h'); eq(humanDuration(15), '15 min', 'dur 15m');

const HOURS = {0:{open:600,close:1020},1:{open:600,close:1170},2:null,3:{open:600,close:1170},4:{open:600,close:1170},5:{open:600,close:1170},6:{open:600,close:1080}};
const cfg = { hours: HOURS, closedDates: ['2026-12-24'], slotMinutes: 15, minNoticeHours: 2, now: new Date('2026-09-01T00:00:00Z') };

// Tuesday closed
eq(candidateSlots('2026-09-22', 45, cfg).length, 0, 'Tuesday closed');
eq(candidateSlots('2026-12-24', 45, cfg).length, 0, 'closed date');
// Saturday 10:00-18:00, 45min service, 15min steps: last start 17:15 -> 30 slots
const sat = candidateSlots('2026-09-19', 45, cfg);
eq(sat.length, 30, 'Sat 45min slot count');
eq(hhmm(sat[0]), '10:00', 'Sat first');
eq(hhmm(sat.at(-1)), '17:15', 'Sat last (ends 18:00)');
// 6h keratin on a Saturday (10-18 = 8h) -> last start 12:00
const ker = candidateSlots('2026-09-19', 360, cfg);
eq(hhmm(ker.at(-1)), '12:00', 'keratin last start');
// 6h keratin on Sunday (10-17 = 7h) -> last start 11:00
eq(hhmm(candidateSlots('2026-09-20', 360, cfg).at(-1)), '11:00', 'keratin Sunday last');

// min-notice trims the front of today
const soon = candidateSlots('2026-09-19', 45, { ...cfg, now: new Date('2026-09-19T10:00:00Z') }); // 12:00 Stockholm
eq(hhmm(soon[0]), '14:00', 'min notice 2h from 12:00');

console.log(fail ? `\n${fail} FAILURES` : '\nall passing');
process.exit(fail ? 1 : 0);
