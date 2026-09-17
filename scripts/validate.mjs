import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Dependency-free smoke checks for this static, script-free support site.
// These check structure/links, not legal completeness or visual appearance.
const root = fileURLToPath(new URL('../', import.meta.url));
const pages = ['index.html', 'privacy.html', 'support.html', 'terms.html'];
for (const page of pages) {
  const html = await readFile(path.join(root, page), 'utf8');
  assert.match(html, /<!doctype html>/i, `${page}: HTML doctype`);
  assert.match(html, /<html lang="en">/, `${page}: language`);
  assert.match(html, /name="viewport"/, `${page}: mobile viewport`);
  for (const tag of ['head', 'body', 'main', 'nav', 'h1', 'title']) {
    assert.equal((html.match(new RegExp(`<${tag}(?:\\s[^>]*)?>`, 'g')) ?? []).length, 1, `${page}: one ${tag}`);
    assert.equal((html.match(new RegExp(`</${tag}>`, 'g')) ?? []).length, 1, `${page}: closes ${tag}`);
  }
  assert.doesNotMatch(html, /<script\b|\son\w+=|javascript:/i, `${page}: no executable content`);
  for (const [, target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^https:|^mailto:|^#/.test(target)) continue;
    assert(!target.includes('..') && !target.includes(':'), `${page}: safe relative link ${target}`);
    await access(path.join(root, target.split('#')[0]));
  }
  const sectionNumbers = [...html.matchAll(/<h2>(\d+)\./g)].map(match => Number(match[1]));
  if (sectionNumbers.length) assert.deepEqual(sectionNumbers, sectionNumbers.map((_, i) => i + 1), `${page}: sequential sections`);
  console.log(`PASS ${page}: structure, links, and no embedded scripts`);
}

const privacy = await readFile(path.join(root, 'privacy.html'), 'utf8');
for (const disclosure of ['Google Analytics for Firebase', 'Google AdMob', 'Supabase', 'GitHub Pages', 'not end-to-end encrypted', 'deletion markers', 'does not offer Sign in with Apple']) {
  assert(privacy.includes(disclosure), `Missing expected disclosure: ${disclosure}`);
}
const support = await readFile(path.join(root, 'support.html'), 'utf8');
assert(!support.includes('If a future version offers QR Studio Pro'), 'Outdated subscription instructions');
assert(!privacy.includes('You may optionally link it with Sign in with Apple'), 'Unavailable account linking advertised');
console.log('PASS current feature disclosures');
