#!/usr/bin/env node
/**
 * Cache-busting stamp.
 *
 * GitHub Pages serves index.html with max-age=600 but CSS and JS with
 * max-age=14400. After a deploy that leaves a four-hour window where a
 * returning visitor runs brand-new HTML against stale JavaScript — which is
 * exactly how the page ends up with empty categories and an empty wizard.
 *
 * This appends ?v=<hash> to every asset URL, including the imports *inside*
 * the modules: a browser resolves `import './services.js'` relative to the
 * module URL and drops the query, so stamping only the entry point would leave
 * every imported file still cached.
 *
 * It rewrites files in place and is idempotent — existing stamps are stripped
 * before the hash is computed, so running it twice with no source change is a
 * no-op. Nothing here compiles anything: skip it and the site still works,
 * it just caches the old way. Run `npm run stamp` before committing a deploy.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath, not .pathname — the repo path contains a space, which
// .pathname leaves percent-encoded and fs cannot open.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const JS_DIR = join(ROOT, 'js');
const PAGES = ['index.html', '404.html'];
const CSS = 'css/style.css';

const jsFiles = readdirSync(JS_DIR).filter((f) => f.endsWith('.js')).sort();
const strip = (t) => t.replace(/\?v=[a-f0-9]{8}/g, '');

// 1. Unstamp everything first so the hash reflects real content, not old hashes.
const files = new Map();
for (const rel of [...jsFiles.map((f) => `js/${f}`), CSS, ...PAGES]) {
  files.set(rel, strip(readFileSync(join(ROOT, rel), 'utf8')));
}

// 2. Hash the code and styles — not the HTML, which contains the stamp itself.
const hash = createHash('sha256');
for (const rel of [...jsFiles.map((f) => `js/${f}`), CSS]) hash.update(files.get(rel));
const v = hash.digest('hex').slice(0, 8);

// 3. Stamp relative imports inside the modules.
let importCount = 0;
for (const f of jsFiles) {
  const rel = `js/${f}`;
  const out = files.get(rel).replace(/(from\s+['"])(\.\/[\w.-]+\.js)(['"])/g, (_, a, path, c) => {
    importCount++;
    return `${a}${path}?v=${v}${c}`;
  });
  files.set(rel, out);
}

// 4. Stamp the stylesheet and the module entry point in the HTML.
let assetCount = 0;
for (const page of PAGES) {
  const out = files.get(page)
    .replace(/(href=")(css\/style\.css)(")/g, (_, a, p, c) => (assetCount++, `${a}${p}?v=${v}${c}`))
    .replace(/(src=")(js\/main\.js)(")/g, (_, a, p, c) => (assetCount++, `${a}${p}?v=${v}${c}`));
  files.set(page, out);
}

for (const [rel, text] of files) writeFileSync(join(ROOT, rel), text);

console.log(`stamped v=${v}  (${importCount} module imports, ${assetCount} asset links across ${PAGES.length} pages)`);
