# Adesola Restaurant — production-ready static frontend

Responsive static website for Adesola Restaurant, Sheffield, built with semantic HTML, Bootstrap 5.3, custom CSS and vanilla JavaScript. Intended for Netlify hosting.

## Confirmed business details

- Cuisine: International cuisine
- Address: 15, Bungearve Road, S3 9DG, Sheffield
- Opening hours: 24 hours (as supplied by the restaurant owner)
- Hosting: Netlify
- Contact details supplied for the project: Habkenny2@gmail.com / +44 7769 533756 — confirm that the restaurant is authorised to publish these before launch.
- Menu and prices: not supplied; the website deliberately does not invent menu items or prices.

## Features

- Responsive navigation and layout, keyboard-accessible gallery lightbox, skip link, focus states, and reduced-motion support.
- Netlify Forms integration for reservation requests and contact messages, including native validation, date validation, URL-encoded AJAX submission, loading/error/success states and a honeypot field.
- Basic SEO metadata and Netlify security headers.
- No fake menu items, sample prices, or claim that a booking is confirmed without checking real table availability.

## Run locally

Open `index.html` directly or use VS Code Live Server. Browser-only previews can validate the UI, but Netlify Forms submissions work only after deploying to Netlify with form detection enabled.

## Netlify deployment

1. Upload the contents of `adesola-restaurant/` to a new Netlify site, or connect the repository.
2. The included `netlify.toml` sets the publish directory to the project root (`.`). No build command is required.
3. In Netlify, open **Forms** and enable **form detection**.
4. Redeploy after enabling form detection. Netlify detects static HTML forms named `reservation` and `contact` at deploy time.
5. Submit a real test from the deployed domain and confirm each submission appears in Netlify Forms. Configure notification emails/webhooks in Netlify and check spam submissions.
6. Set up the production domain and HTTPS; test forms on the final domain and check mobile/desktop layouts.

## Important launch limitation: instant booking confirmation

The current reservation form submits a booking **request** to Netlify Forms. Netlify Forms stores submissions; it does not check restaurant capacity, prevent double bookings, or confirm a table against a live availability system. The UI explicitly tells the customer that the request is not yet a confirmed reservation. To meet the requested *instant confirmed booking* workflow, connect a real reservation provider or build a backend with a database, availability/slot locking, duplicate-booking protection, confirmation email/SMS and operational handling. Do not change the success message to “confirmed” until the backend/provider returns a confirmed booking result.

## Menu, imagery and content

- The menu section is a deliberate placeholder until the restaurant supplies approved dish names, descriptions, prices, allergens and dietary information.
- The remaining food/interior photography uses remote Unsplash image URLs as illustrative, non-Adesola reference imagery. Replace with supplied restaurant photos or assets whose licence and attribution requirements have been checked. These are not represented as photos of the actual premises or dishes.
- Confirm the restaurant story, logo/branding, opening hours, and whether the supplied contact details may be published.

## Privacy and data handling

`privacy.html` is a launch checklist-style draft, not legal advice. Before collecting customer data, the restaurant must verify the data controller identity/contact, lawful basis, retention period, access/deletion process, any processor terms, and a privacy notice compliant with UK GDPR and PECR as applicable. Restrict access to submissions and avoid collecting unnecessary information.

## Tests

Run `node --test tests/site.test.cjs` from this directory. The checks validate essential page metadata, known address/hours, absence of invented menu prices, Netlify form fields, and the absence of a false instant-confirmation claim. These are static regression checks, not an end-to-end live Netlify submission test.
