export default async function run(page) {
  const assets = {
    bootstrapCss:
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css",
    bootstrapIconsCss:
      "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
    bootstrapJs:
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js",
  };
  const pageHashes = {
    bootstrapCss: document.querySelector ? null : null,
  };
  const embedded = {
    bootstrapCss: page.evaluate(
      () =>
        document.querySelector('link[href*="bootstrap.min.css"]')?.integrity,
    ),
    bootstrapIconsCss: page.evaluate(
      () => document.querySelector('link[href*="bootstrap-icons"]')?.integrity,
    ),
    bootstrapJs: page.evaluate(
      () =>
        document.querySelector('script[src*="bootstrap.bundle"]')?.integrity,
    ),
  };
  const embeddedResolved = {
    bootstrapCss: await embedded.bootstrapCss,
    bootstrapIconsCss: await embedded.bootstrapIconsCss,
    bootstrapJs: await embedded.bootstrapJs,
  };

  const computed = await page.evaluate(async (urls) => {
    const out = {};
    for (const [key, url] of Object.entries(urls)) {
      const r = await fetch(url);
      const buf = await r.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-384", buf);
      out[key] =
        "sha384-" +
        btoa(String.fromCharCode.apply(null, new Uint8Array(digest)));
    }
    return out;
  }, assets);

  const match = {};
  for (const key of Object.keys(assets)) {
    match[key] = computed[key] === embeddedResolved[key];
  }
  return { match, computed, embeddedResolved };
}
