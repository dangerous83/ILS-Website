#!/usr/bin/env python3
"""One-shot SEO injector for ILSMTC website.
Adds meta description, keywords, OG/Twitter cards, canonical, and JSON-LD schema
to every HTML file. Safe to re-run — it removes its own previously injected block first.
"""
import os, re, json

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = "https://ilsmtc.com"
BRAND = "ILS — International Logistics Services"
DEFAULT_OG_IMG = "asset/Hero Services.png"

# Per-page metadata. Keys are file paths relative to repo root.
PAGES = {
    "index.html": {
        "title": "ILS — International Logistics Services | Dubai-Based Freight Forwarder",
        "description": "ILS is a Dubai-based freight forwarder moving cargo across air, sea, and land — UAE, Afghanistan, CIS, Europe, USA, and Africa. Get a quote in hours.",
        "keywords": "freight forwarder Dubai, logistics UAE, air freight, ocean freight, land transport, warehousing, customs clearance, supply chain, project cargo, Afghanistan logistics, CIS logistics",
        "og_image": "asset/Service - air.png",
        "schema": "Organization",
    },
    "pages/about.html": {
        "title": "About Us | ILS International Logistics Services",
        "description": "Founded in Dubai and led by industry veterans, ILS has been moving cargo across continents for over a decade. Meet our leadership and learn what drives us.",
        "keywords": "about ILS, ILSMTC, freight forwarder leadership, Dubai logistics company, ILS founder, international logistics",
        "og_image": "asset/about us.jpg",
        "schema": "AboutPage",
    },
    "pages/services.html": {
        "title": "Logistics Services | Air, Ocean, Land & Warehousing — ILS",
        "description": "Full-spectrum logistics services from ILS Dubai: air freight, ocean freight, land transport, and warehousing & distribution — engineered for global trade.",
        "keywords": "logistics services Dubai, air freight services, ocean freight services, land transport, warehousing UAE, 3PL",
        "og_image": "asset/Hero Services.png",
        "schema": "Service",
    },
    "pages/solutions.html": {
        "title": "Logistics Solutions | Freight Forwarding, Project Cargo & SCM — ILS",
        "description": "End-to-end logistics solutions from ILS: freight forwarding, project cargo, customs & compliance, and supply chain management — tailored to your trade lanes.",
        "keywords": "logistics solutions, freight forwarding, project cargo, supply chain management, customs compliance, ILS solutions",
        "og_image": "asset/Solution.jpg",
        "schema": "Service",
    },
    "pages/destinations.html": {
        "title": "Global Destinations | Middle East, Africa, Asia & Beyond — ILS",
        "description": "ILS moves cargo to 200+ countries. Discover our key trade lanes across the Middle East, Afghanistan, CIS, Europe, USA & Canada, and Africa.",
        "keywords": "logistics destinations, Middle East logistics, Afghanistan freight, CIS freight, Europe shipping, USA Canada logistics, Africa freight",
        "og_image": "asset/Dubai.jpg",
        "schema": "WebPage",
    },
    "pages/industries.html": {
        "title": "Industries We Serve | ILS International Logistics Services",
        "description": "ILS supports diverse industries — pharmaceuticals, automotive, oil & gas, retail, humanitarian, and more — with specialised freight forwarding solutions.",
        "keywords": "logistics industries, pharma logistics, automotive freight, oil and gas logistics, humanitarian freight, retail supply chain",
        "og_image": "asset/Hero - Industries.png",
        "schema": "WebPage",
    },
    "pages/resources.html": {
        "title": "Resources & Guides | ILS International Logistics Services",
        "description": "Free downloadable guides on incoterms, customs, route planning, and shipping documentation — practical resources from ILS's freight forwarding team.",
        "keywords": "logistics resources, freight forwarder guides, incoterms guide, customs documentation, shipping guides",
        "og_image": "asset/Hero - resources.png",
        "schema": "WebPage",
    },
    "pages/blog.html": {
        "title": "Blog | Freight & Logistics Insights from ILS",
        "description": "Market updates, trade lane shifts, customs changes, and operational insights from the ILS Dubai freight floor — written by the people who move the cargo.",
        "keywords": "logistics blog, freight news, trade lane updates, customs compliance news, ocean freight blog, air freight insights",
        "og_image": "asset/Hero - Blog.png",
        "schema": "Blog",
    },
    "pages/contact.html": {
        "title": "Contact ILS | Get a Freight Quote in Hours",
        "description": "Talk to ILS in Dubai — request a tailored freight quote, reach our regional desks, or visit our Media City office. Live response within hours.",
        "keywords": "contact ILS, freight quote Dubai, logistics inquiry, ILSMTC contact, Dubai freight forwarder phone",
        "og_image": "asset/ILS Ccntact hero image.png",
        "schema": "ContactPage",
    },
    "pages/air-freight.html": {
        "title": "Air Freight Services | Express & Time-Critical Cargo — ILS Dubai",
        "description": "Air freight from ILS Dubai: express, DG, temperature-controlled, and full-charter solutions. AOG response, pharma cold-chain, and 24/7 ops support.",
        "keywords": "air freight Dubai, express air cargo, dangerous goods air, pharma air freight, charter flights, AOG logistics",
        "og_image": "asset/Service - air.png",
        "schema": "Service",
    },
    "pages/ocean-freight.html": {
        "title": "Ocean Freight | FCL, LCL & Charter Solutions — ILS",
        "description": "Ocean freight from ILS: FCL, LCL, out-of-gauge, and charter services. Reliable schedules from Jebel Ali to global ports — built for high-volume shippers.",
        "keywords": "ocean freight Dubai, FCL shipping, LCL consolidation, container shipping UAE, sea freight, ocean charter",
        "og_image": "asset/Service - ship.png",
        "schema": "Service",
    },
    "pages/land-transport.html": {
        "title": "Land Transport | Cross-Border Trucking & FTL/LTL — ILS",
        "description": "Land transport from ILS: FTL, LTL, cross-border TIR, reefer, and 24/7 dispatch across the GCC, CIS, and Europe. Fully-tracked road freight.",
        "keywords": "land transport Dubai, cross-border trucking, TIR carnet, FTL LTL Middle East, road freight GCC, CIS trucking",
        "og_image": "asset/Service - truck.png",
        "schema": "Service",
    },
    "pages/warehousing.html": {
        "title": "Warehousing & Distribution | Bonded Storage & 3PL — ILS Dubai",
        "description": "Warehousing & distribution from ILS: bonded free-zone storage, cross-docking, pick/pack/kitting, and cloud-based inventory visibility. JAFZA-based.",
        "keywords": "warehousing Dubai, bonded warehouse UAE, JAFZA storage, 3PL Dubai, cross-docking, distribution center",
        "og_image": "asset/Service - container.png",
        "schema": "Service",
    },
    "pages/freight-forwarding.html": {
        "title": "Freight Forwarding Solutions | Air · Sea · Road — ILS",
        "description": "End-to-end freight forwarding from ILS — air, sea, and road combined into one tailored solution. Customs, compliance, and tracking included.",
        "keywords": "freight forwarding, multimodal logistics, Dubai forwarder, air sea road freight, international shipping",
        "og_image": "asset/Freight page.jpg",
        "schema": "Service",
    },
    "pages/project-cargo.html": {
        "title": "Project Cargo | Heavy Lift, OOG & Breakbulk — ILS",
        "description": "Project cargo specialists at ILS — heavy lift, out-of-gauge, and breakbulk into KSA, UAE, and beyond. Permits, escorts, and inland routing handled.",
        "keywords": "project cargo Dubai, heavy lift logistics, OOG shipping, breakbulk freight, NEOM logistics, oil and gas cargo",
        "og_image": "asset/hero -Move the impossible.png",
        "schema": "Service",
    },
    "pages/customs-compliance.html": {
        "title": "Customs & Compliance | Brokerage, AEO & FTA — ILS Dubai",
        "description": "UAE customs brokerage and trade compliance from ILS — AEO-certified clearance, FTA support, and end-to-end documentation for smooth border crossings.",
        "keywords": "customs broker Dubai, UAE customs clearance, AEO certification, FTA compliance, trade compliance UAE",
        "og_image": "asset/Hero - custom & Compliance.png",
        "schema": "Service",
    },
    "pages/supply-chain.html": {
        "title": "Supply Chain Management | End-to-End SCM — ILS",
        "description": "Supply chain management from ILS — sourcing, procurement, inventory optimisation, and distribution. End-to-end visibility from origin to delivery.",
        "keywords": "supply chain management Dubai, SCM services, end to end logistics, procurement, inventory management",
        "og_image": "asset/supply chain.jpg",
        "schema": "Service",
    },
    "pages/privacy.html": {
        "title": "Privacy Policy | ILS International Logistics Services",
        "description": "Read the ILS privacy policy — how we collect, use, and protect your personal information when you interact with our website and freight services.",
        "keywords": "ILS privacy policy, data protection, freight forwarder privacy",
        "og_image": "asset/Hero Services.png",
        "schema": "WebPage",
    },
    "pages/terms.html": {
        "title": "Terms of Service | ILS International Logistics Services",
        "description": "The terms governing use of the ILS website and freight forwarding services — read before booking or engaging with our team.",
        "keywords": "ILS terms of service, freight terms and conditions, logistics terms",
        "og_image": "asset/Hero Services.png",
        "schema": "WebPage",
    },
    "pages/cookies.html": {
        "title": "Cookies Policy | ILS International Logistics Services",
        "description": "How ILS uses cookies on its website — essential, analytics, and marketing cookies, your consent choices, and how to manage them.",
        "keywords": "ILS cookies, cookie policy, website cookies",
        "og_image": "asset/Hero Services.png",
        "schema": "WebPage",
    },
}

BLOCK_START = "<!-- BEGIN-SEO -->"
BLOCK_END   = "<!-- END-SEO -->"

ORG_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ILS International Logistics Services",
    "alternateName": "ILSMTC",
    "url": SITE,
    "logo": f"{SITE}/asset/ILS Logo-Blue.png",
    "description": "Dubai-based international freight forwarder — air, sea, and land transport across the Middle East, Afghanistan, CIS, Europe, USA, and Africa.",
    "foundingDate": "2011",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Business Central Towers, Office 2802 B, Media City",
        "addressLocality": "Dubai",
        "postalCode": "19195",
        "addressCountry": "AE"
    },
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+971-4-4343800",
        "email": "info@ilsmtc.com",
        "contactType": "customer service",
        "areaServed": ["AE", "AF", "SA", "KW", "QA", "OM", "BH", "Worldwide"]
    },
    "sameAs": [
        "https://www.facebook.com/ilsmtc/",
        "https://www.linkedin.com/company/94794509",
        "https://www.instagram.com/ilsdxb/"
    ]
}

def build_seo_block(rel_path, meta):
    is_index = rel_path == "index.html"
    asset_prefix = "" if is_index else "../"
    canonical = SITE if is_index else f"{SITE}/{rel_path.replace(os.sep, '/')}"
    og_image_url = f"{SITE}/{meta['og_image'].replace(os.sep, '/')}"

    if meta["schema"] == "Organization":
        schema_obj = ORG_SCHEMA
    else:
        schema_obj = {
            "@context": "https://schema.org",
            "@type": meta["schema"],
            "name": meta["title"],
            "description": meta["description"],
            "url": canonical,
            "image": og_image_url,
            "publisher": {
                "@type": "Organization",
                "name": "ILS International Logistics Services",
                "logo": {
                    "@type": "ImageObject",
                    "url": f"{SITE}/asset/ILS Logo-Blue.png"
                }
            }
        }

    schema_json = json.dumps(schema_obj, ensure_ascii=False, indent=2)

    return f"""  {BLOCK_START}
  <meta name="description" content="{meta['description']}" />
  <meta name="keywords" content="{meta['keywords']}" />
  <meta name="author" content="ILS International Logistics Services" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="{canonical}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="{BRAND}" />
  <meta property="og:title" content="{meta['title']}" />
  <meta property="og:description" content="{meta['description']}" />
  <meta property="og:url" content="{canonical}" />
  <meta property="og:image" content="{og_image_url}" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{meta['title']}" />
  <meta name="twitter:description" content="{meta['description']}" />
  <meta name="twitter:image" content="{og_image_url}" />

  <!-- JSON-LD structured data -->
  <script type="application/ld+json">
{schema_json}
  </script>
  {BLOCK_END}"""


def inject(file_rel, meta):
    file_path = os.path.join(ROOT, file_rel.replace("/", os.sep))
    if not os.path.exists(file_path):
        print(f"SKIP (missing): {file_rel}")
        return
    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Remove any previously injected block
    html = re.sub(re.escape(BLOCK_START) + r".*?" + re.escape(BLOCK_END) + r"\s*",
                  "", html, flags=re.DOTALL)

    # Update <title> tag content
    new_title = meta["title"]
    html = re.sub(r"<title>.*?</title>", f"<title>{new_title}</title>", html, count=1, flags=re.DOTALL)

    # Inject SEO block right before the stylesheet link
    seo_block = build_seo_block(file_rel, meta)
    if "<link rel=\"stylesheet\"" in html:
        html = html.replace(
            "<link rel=\"stylesheet\"",
            seo_block + "\n  <link rel=\"stylesheet\"",
            1
        )
    else:
        # Fallback: inject before </head>
        html = html.replace("</head>", seo_block + "\n</head>", 1)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"OK: {file_rel}")


if __name__ == "__main__":
    for rel, meta in PAGES.items():
        inject(rel, meta)
    print("\nDone. SEO meta + OG + Twitter Cards + JSON-LD schema injected into all pages.")
