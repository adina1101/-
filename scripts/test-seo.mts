import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { games } from '../src/lib/games.ts';

const html = readFileSync('index.html', 'utf8');
const robots = readFileSync('public/robots.txt', 'utf8');
const sitemap = readFileSync('public/sitemap.xml', 'utf8');
const origin = 'https://ruddy-eight-39.vercel.app';

assert.match(html, /<title>CARDIX[^<]+<\/title>/, 'home page needs a descriptive title');
assert.match(html, /name="description" content="[^"]{80,}/, 'home page needs a useful description');
assert.ok(html.includes('application/ld+json'), 'home page needs structured data');
assert.ok(html.includes(`<link rel="canonical" href="${origin}/"`), 'home page needs a canonical URL');
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt must advertise the sitemap');
for (const game of games) {
  assert.ok(sitemap.includes(`<loc>${origin}/rules/${game.id}</loc>`), `${game.id} needs a sitemap URL`);
}

console.log(`✓ SEO: metadata, structured data, robots.txt and ${games.length + 2} sitemap pages`);
