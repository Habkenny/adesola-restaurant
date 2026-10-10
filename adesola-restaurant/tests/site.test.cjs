const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/css/style.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'assets/js/main.js'), 'utf8');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');

test('shows supplied address and 24-hour opening statement', () => {
  assert.match(html, /15, Bungearve Road, S3 9DG, Sheffield/i);
  assert.match(html, /Open 24 hours/i);
});
test('does not publish invented sample dishes or prices', () => {
  assert.doesNotMatch(js, /Garden Table Salad|Golden Plantain Bites|Slow-Roasted House Chicken/);
  assert.doesNotMatch(js, /price:\s*['"]\d/);
  assert.match(html, /approved menu, dish descriptions, allergen information and prices have not yet been supplied/i);
});
test('reservation and contact forms are registered for Netlify', () => {
  assert.match(html, /name="reservation" method="POST" data-netlify="true"/);
  assert.match(html, /name="contact" method="POST" data-netlify="true"/);
  assert.match(html, /name="form-name" value="reservation"/);
  assert.match(html, /name="form-name" value="contact"/);
  assert.match(html, /netlify-honeypot="bot-field"/);
});
test('does not falsely claim a booking is confirmed', () => {
  assert.match(js, /This is not a confirmed table reservation/);
  assert.match(readme, /does not check restaurant capacity/);
});
test('uses the correct local hero image path without broken relative asset references', () => {
  assert.doesNotMatch(css, /url\(\s*["']images\/adesola-hero\.jpg["']\s*\)/);
  assert.match(css, /adesola-hero\.jpg/);
  assert.ok(fs.existsSync(path.join(root, 'images', 'adesola-hero.jpg')));
});
test('includes Netlify configuration and privacy draft', () => {
  assert.ok(fs.existsSync(path.join(root, 'netlify.toml')));
  assert.ok(fs.existsSync(path.join(root, 'privacy.html')));
});
