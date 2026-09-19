import { HOURS, BOOKING, CLOSED_DATES } from './config.js';
import { SERVICES } from './services.js';
import { candidateSlots, overlaps } from './time.js';

export function findService(id) {
  return SERVICES.find((s) => s.id === id) || null;
}

/**
 * Which start times are genuinely bookable for this service on this date.
 *
 * A slot survives two independent checks:
 *   1. Overall capacity  — fewer than BOOKING.staffCount appointments overlap it.
 *   2. Per-service cap   — fewer than service.maxConcurrent of THIS service overlap it.
 *
 * The second check is what stops two four-hour colour treatments landing on the
 * same afternoon when only one person can actually do them.
 *
 * @param {{start_min:number,end_min:number,service_id:string}[]} booked
 * @returns {number[]} start times as minutes from Stockholm midnight
 */
export function availableSlots(dateStr, service, booked, now = new Date()) {
  const candidates = candidateSlots(dateStr, service.duration, {
    hours: HOURS,
    closedDates: CLOSED_DATES,
    slotMinutes: BOOKING.slotMinutes,
    minNoticeHours: BOOKING.minNoticeHours,
    now,
  });

  return candidates.filter((start) => {
    const end = start + service.duration;
    let total = 0;
    let sameService = 0;
    for (const b of booked) {
      if (!overlaps(start, end, b.start_min, b.end_min)) continue;
      total++;
      if (b.service_id === service.id) sameService++;
    }
    return total < BOOKING.staffCount && sameService < service.maxConcurrent;
  });
}
