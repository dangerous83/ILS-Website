# ILS — International Logistics Services

Marketing website for **ILS (International Logistics Services)**, a Dubai-based freight forwarder operating across air, sea, and land — UAE, Afghanistan, CIS, Europe, USA, and Africa.

Live site: [ilsmtc.com](https://ilsmtc.com)

---

## Tech Stack

Static, framework-free, deliberately fast.

- HTML5 / CSS3 / vanilla JavaScript
- Custom scroll & reveal animations (no animation library)
- JSON-LD structured data for SEO
- Open Graph + Twitter Card meta
- A small Python helper script (`_seo_inject.py`) for batch SEO meta injection

No build step. No bundler. Open `index.html` and it runs.

---

## Project Structure

```
ILS-Website/
├── index.html          # Main landing page
├── style.css           # All styling (single stylesheet)
├── script.js           # Page bootstrapping
├── animations.js       # Scroll / reveal / splash animations
├── destinations.js     # Destination grid data + interactions
├── _seo_inject.py      # SEO meta tag injector (build-time helper)
└── asset/              # Images, logos, icons
```

---

## Running Locally

Any static server works. Easiest options:

**VS Code Live Server** — right-click `index.html` → *Open with Live Server*.

**Python** — from the project folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

**Node** — if you have it:

```bash
npx serve .
```

---

## SEO Helper

`_seo_inject.py` rewrites the SEO block in HTML files between the `<!-- BEGIN-SEO -->` and `<!-- END-SEO -->` markers. Run it after editing page content if titles, descriptions, or structured data need updating.

```bash
python _seo_inject.py
```

---

## Deployment

Static hosting — any CDN works. Drop the folder onto Cloudflare Pages, Netlify, Vercel, or upload to S3 / standard web hosting. No environment variables, no secrets, no build pipeline required.

---

## License

© ILS — International Logistics Services. All rights reserved.
