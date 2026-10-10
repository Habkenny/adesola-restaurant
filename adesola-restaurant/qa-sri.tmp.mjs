export default async function run(page) {
  // Does the SAME CDN asset load at all in this sandbox when integrity is absent?
  const noSri = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const s = document.createElement("script");
        s.src =
          "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js";
        s.onload = () => resolve("loaded");
        s.onerror = () => resolve("error");
        document.head.appendChild(s);
      }),
  );

  // Fetch that asset and hash it in-page, to compare against the hash I hard-coded.
  let fetchInfo;
  try {
    fetchInfo = await page.evaluate(async () => {
      const r = await fetch(
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js",
      );
      const buf = await r.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-384", buf);
      const b64 = btoa(String.fromCharCode.apply(null, new Uint8Array(digest)));
      return {
        status: r.status,
        bytes: buf.byteLength,
        sha384: "sha384-" + b64,
      };
    });
  } catch (e) {
    fetchInfo = { error: String(e) };
  }

  return { noSriLoad: noSri, fetchInfo };
}
