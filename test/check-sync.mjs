// site/js and worker/src share three files. Nothing enforces that at runtime,
// so this does — a price changed in one copy and not the other would silently
// let customers book slots the server then rejects.
import { readFileSync } from 'node:fs';

const PAIRS = [
  ['site/js/time.js', 'worker/src/time.js', 'exact'],
  ['site/js/config.js', 'worker/src/config.js', 'exact'],
  ['site/js/services.js', 'worker/src/services.js', 'fields'],
];

let bad = 0;
for (const [a, b, mode] of PAIRS) {
  if (mode === 'exact') {
    const same = readFileSync(a, 'utf8') === readFileSync(b, 'utf8');
    console.log(`${same ? 'ok  ' : 'FAIL'} ${a} === ${b}`);
    if (!same) bad++;
    continue;
  }
  // services.js: the worker copy drops images/sumup fields, so compare the
  // fields that actually drive booking.
  const pick = (src) => {
    // Start at SERVICES so the CATEGORIES ids above it aren't picked up.
    const body = src.slice(src.indexOf('export const SERVICES'));
    return [...body.matchAll(/"id":\s*"([^"]+)"[\s\S]*?"duration":\s*(\d+),\s*"price":\s*(\d+),\s*"maxConcurrent":\s*(\d+)/g)]
      .map((m) => m.slice(1, 5).join(':'));
  };
  const [x, y] = [pick(readFileSync(a, 'utf8')), pick(readFileSync(b, 'utf8'))];
  const same = x.length > 0 && x.length === y.length && x.every((v, i) => v === y[i]);
  console.log(`${same ? 'ok  ' : 'FAIL'} ${a} ~ ${b}  (${x.length} vs ${y.length} services)`);
  if (!same) {
    bad++;
    for (let i = 0; i < Math.max(x.length, y.length); i++) if (x[i] !== y[i]) console.log(`       ${x[i] ?? '-'}  !=  ${y[i] ?? '-'}`);
  }
}
console.log(bad ? `\n${bad} file(s) out of sync` : '\nsite and worker copies agree');
process.exit(bad ? 1 : 0);
