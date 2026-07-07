/* ============================================
   ILS — Destinations Page
   Country switcher: hero swap, dropdown sync, detail content swap
   ============================================ */

(function () {
  const DESTINATIONS = {
    'middle-east': {
      num: '01',
      region: 'Middle East',
      breadcrumb: 'Middle East',
      heroImage: '../asset/Middle east - 2.png?v=20260630h',
      heroTitleHTML: 'Shipping to the <span class="accent">Middle East</span>',
      heroSubtitle: 'Our Dubai hub connects the Gulf to Iraq, Syria, and Turkey — daily air, sea, and road consolidations with on-the-ground customs expertise across the region.',
      eyebrow: 'Middle East Gateway',
      detailTitleHTML: 'A trusted partner for <span class="accent">regional trade</span>',
      detailDesc: "From Dubai's Jebel Ali and DXB, our Middle East desk consolidates daily air, sea, and road shipments across the Gulf and into Iraq, Syria, and Turkey. Bonded warehouses, free-zone expertise, and Arabic-speaking customs brokers built in.",
      modes: { air: true, road: true, sea: true },
      features: [
        'Daily air &amp; sea consolidations from the Dubai hub',
        'FCL &amp; LCL ocean to all GCC and regional ports',
        'Cross-border trucking into Iraq, Syria, and Turkey',
        'Customs clearance across the GCC and the Levant',
        'Bonded &amp; free-zone warehousing in the UAE',
      ],
      lanes: [
        { mode: 'air',  route: 'Dubai (DXB) → Baghdad (BGW)',   transit: 'Air freight transit: <strong>2.5 hours</strong> · Daily departures' },
        { mode: 'sea',  route: 'Mumbai → Jebel Ali (JEA)',       transit: 'FCL ocean transit: <strong>5–7 days</strong> · 3 sailings/week' },
        { mode: 'road', route: 'Dubai → Istanbul',               transit: 'Cross-border road: <strong>6–8 days</strong> · Weekly trucks' },
        { mode: 'air',  route: 'Dubai (DXB) → Istanbul (IST)',   transit: 'Air freight transit: <strong>4.5 hours</strong> · Daily flights' },
        { mode: 'sea',  route: 'Shanghai → Jebel Ali',           transit: 'FCL ocean transit: <strong>18–22 days</strong> · Weekly sailings' },
        { mode: 'road', route: 'Mersin → Aleppo',                transit: 'Cross-border road: <strong>1–2 days</strong> · Weekly' },
      ],
    },

    'central-asia': {
      num: '02',
      region: 'Central Asia',
      breadcrumb: 'Central Asia',
      heroImage: '../asset/Central Asia - 2.png?v=20260630h',
      heroTitleHTML: 'Logistics across <span class="accent">Central Asia</span>',
      heroSubtitle: 'Our SILKWAY service connects global cargo to Kazakhstan, Uzbekistan, Turkmenistan, Kyrgyzstan, and Tajikistan — by road, rail, and air through every major gateway.',
      eyebrow: 'SILKWAY Network',
      detailTitleHTML: 'Move cargo along the <span class="accent">Silk Road</span>',
      detailDesc: 'Our SILKWAY operation links Europe, the Middle East, and China to the Central Asian republics with reliable road, rail, and air services — handling customs in Russian, English, and local languages.',
      modes: { air: true, road: true, sea: false },
      features: [
        'Block-train rail into Tashkent and Almaty',
        'TIR-Carnet trucking across all Central Asian borders',
        'Road transit via Iran, Turkey, and the CIS',
        'Air consolidations from Dubai and Istanbul',
        'Customs brokerage in Russian-speaking markets',
      ],
      lanes: [
        { mode: 'road', route: 'Istanbul → Tashkent',         transit: 'TIR road freight: <strong>9–12 days</strong> · Weekly departures' },
        { mode: 'air',  route: 'Dubai (DXB) → Almaty (ALA)',  transit: 'Air freight transit: <strong>5 hours</strong> · Daily flights' },
        { mode: 'road', route: 'Bandar Abbas → Ashgabat',     transit: 'Overland trucking: <strong>7–9 days</strong> · 2x weekly' },
        { mode: 'road', route: 'Xi’an → Almaty (rail)',       transit: 'Block-train rail: <strong>6–8 days</strong> · Weekly' },
        { mode: 'road', route: 'Hamburg → Tashkent (rail)',   transit: 'Block-train rail: <strong>16–20 days</strong> · 2x monthly' },
        { mode: 'air',  route: 'Frankfurt (FRA) → Tashkent',  transit: 'Air freight transit: <strong>7 hours</strong> · 4x weekly' },
      ],
    },

    'south-asia': {
      num: '03',
      region: 'South Asia',
      breadcrumb: 'South Asia',
      heroImage: '../asset/South Asia -2.png?v=20260630h',
      heroTitleHTML: 'Freight across <span class="accent">South Asia</span>',
      heroSubtitle: 'Anchored by our Karachi hub — ocean, air, and overland services across Pakistan and India, with deep NVOCC and consolidation expertise.',
      eyebrow: 'South Asia Gateway',
      detailTitleHTML: 'Your gateway to <span class="accent">Pakistan &amp; India</span>',
      detailDesc: 'Our Karachi hub anchors a dense network across the subcontinent. From Karachi and Port Qasim to Nhava Sheva and Mundra, we run FCL, LCL, and NVOCC services with onward trucking and customs clearance across Pakistan and India.',
      modes: { air: true, road: true, sea: true },
      features: [
        'Karachi &amp; Port Qasim ocean gateway (FCL, LCL, NVOCC)',
        'Air freight via Karachi (KHI) and Dubai (DXB)',
        'Customs clearance across Pakistan and India',
        'Onward trucking to upcountry Pakistan',
        'Consolidation and cargo handling for all sizes',
      ],
      lanes: [
        { mode: 'sea',  route: 'Jebel Ali → Karachi (KHI)',     transit: 'FCL ocean transit: <strong>2–3 days</strong> · Multiple sailings/week' },
        { mode: 'air',  route: 'Dubai (DXB) → Karachi (KHI)',   transit: 'Air freight transit: <strong>2 hours</strong> · Daily flights' },
        { mode: 'sea',  route: 'Shanghai → Nhava Sheva',        transit: 'FCL ocean transit: <strong>14–18 days</strong> · Weekly sailings' },
        { mode: 'road', route: 'Karachi → Lahore',              transit: 'Overland trucking: <strong>2–3 days</strong> · Daily departures' },
        { mode: 'sea',  route: 'Hamburg → Karachi',             transit: 'FCL ocean transit: <strong>22–26 days</strong> · Weekly sailings' },
        { mode: 'air',  route: 'Karachi (KHI) → Delhi (DEL)',   transit: 'Air freight transit: <strong>2.5 hours</strong> · Several weekly' },
      ],
    },

    'caucasus': {
      num: '04',
      region: 'CIS',
      breadcrumb: 'CIS',
      heroImage: '../asset/CIS - 55.png?v=20260707b',
      heroTitleHTML: 'Logistics across the <span class="accent">CIS</span>',
      heroSubtitle: 'Connecting the Middle East and Europe to Azerbaijan, Armenia, and Georgia — a key bridge on the Europe–Central Asia corridor.',
      eyebrow: 'CIS Corridor',
      detailTitleHTML: 'A bridge between <span class="accent">continents</span>',
      detailDesc: 'The CIS is the bridge between Europe, the Middle East, and Central Asia. Through the Black Sea ports of Poti and Batumi and the Baku–Tbilisi corridor, we move road, rail, and sea cargo across Azerbaijan, Armenia, and Georgia.',
      modes: { air: true, road: true, sea: true },
      features: [
        'Black Sea ports of Poti and Batumi (Georgia)',
        'Caspian crossing via Baku, Azerbaijan',
        'TIR road transit through Turkey and Georgia',
        'Customs clearance across the CIS',
        'Trans-Caspian links onward to Central Asia',
      ],
      lanes: [
        { mode: 'road', route: 'Istanbul → Tbilisi',           transit: 'TIR road freight: <strong>3–4 days</strong> · Weekly departures' },
        { mode: 'sea',  route: 'Constanta → Poti',             transit: 'Black Sea transit: <strong>2–3 days</strong> · Weekly sailings' },
        { mode: 'road', route: 'Tbilisi → Baku',               transit: 'Cross-border road: <strong>1–2 days</strong> · Daily trucks' },
        { mode: 'air',  route: 'Dubai (DXB) → Baku (GYD)',     transit: 'Air freight transit: <strong>3 hours</strong> · Daily flights' },
        { mode: 'road', route: 'Baku → Aktau (Caspian ferry)', transit: 'Trans-Caspian: <strong>2–3 days</strong> · Several weekly' },
        { mode: 'air',  route: 'Istanbul (IST) → Yerevan (EVN)', transit: 'Air freight transit: <strong>2.5 hours</strong> · Daily flights' },
      ],
    },

    'europe': {
      num: '05',
      region: 'Europe',
      breadcrumb: 'Europe',
      heroImage: '../asset/europe - 22.webp?v=20260701',
      heroTitleHTML: 'Freight across <span class="accent">Europe</span>',
      heroSubtitle: 'Anchored by our Hamburg hub — sea, air, and road across the EU and UK, feeding the Europe–Central Asia–East Asia corridor.',
      eyebrow: 'European Network',
      detailTitleHTML: 'A continent, <span class="accent">door-to-door</span>',
      detailDesc: 'Our Hamburg gateway receives cargo from every corner of the world and feeds it into a dense road and rail network that reaches any address in the EU — and onward along the Silk Road to Central Asia and beyond.',
      modes: { air: true, road: true, sea: true },
      features: [
        'Hamburg ocean &amp; NVOCC gateway hub',
        'FCL &amp; LCL into Hamburg, Rotterdam, Antwerp',
        'Pan-European road groupage (FTL &amp; LTL)',
        'EU customs and VAT compliance handled',
        'Rail links onward to Central Asia &amp; China',
      ],
      lanes: [
        { mode: 'sea',  route: 'Shanghai → Hamburg',              transit: 'FCL ocean transit: <strong>30–35 days</strong> · Weekly sailings' },
        { mode: 'air',  route: 'Dubai (DXB) → Frankfurt (FRA)',   transit: 'Air freight transit: <strong>7 hours</strong> · Daily flights' },
        { mode: 'road', route: 'Hamburg → Munich',                transit: 'Road groupage: <strong>1–2 days</strong> · Daily departures' },
        { mode: 'road', route: 'Hamburg → Almaty (rail)',         transit: 'Block-train rail: <strong>16–20 days</strong> · 2x monthly' },
        { mode: 'sea',  route: 'Jebel Ali → Hamburg',             transit: 'FCL ocean transit: <strong>18–22 days</strong> · Weekly sailings' },
        { mode: 'road', route: 'Rotterdam → Madrid',              transit: 'Road groupage: <strong>3–4 days</strong> · Daily trucks' },
      ],
    },

    'east-asia': {
      num: '06',
      region: 'East Asia',
      breadcrumb: 'East Asia',
      heroImage: '../asset/East Asia - 2.png?v=20260630h',
      heroTitleHTML: 'Freight to &amp; from <span class="accent">East Asia</span>',
      heroSubtitle: 'China at the eastern end of our SILKWAY corridor — ocean, air, and block-train rail connecting the world’s manufacturing hub to Europe and beyond.',
      eyebrow: 'East Asia Gateway',
      detailTitleHTML: 'Connecting <span class="accent">China</span> to the world',
      detailDesc: 'From Shanghai, Ningbo, and Shenzhen, we move FCL, LCL, and NVOCC ocean cargo, urgent airfreight, and block-train rail along the China–Central Asia–Europe corridor — the eastern anchor of our SILKWAY network.',
      modes: { air: true, road: true, sea: true },
      features: [
        'FCL, LCL &amp; NVOCC from Shanghai, Ningbo, Shenzhen',
        'Block-train rail China → Central Asia → Europe',
        'Airfreight from major Chinese gateways',
        'Consolidation and buyer’s-console services',
        'Customs and documentation expertise',
      ],
      lanes: [
        { mode: 'sea',  route: 'Shanghai → Jebel Ali',          transit: 'FCL ocean transit: <strong>18–22 days</strong> · Weekly sailings' },
        { mode: 'sea',  route: 'Shanghai → Hamburg',            transit: 'FCL ocean transit: <strong>30–35 days</strong> · Weekly sailings' },
        { mode: 'road', route: 'Xi’an → Almaty (rail)',         transit: 'Block-train rail: <strong>6–8 days</strong> · Weekly' },
        { mode: 'air',  route: 'Shanghai (PVG) → Dubai (DXB)',  transit: 'Air freight transit: <strong>8 hours</strong> · Daily flights' },
        { mode: 'road', route: 'Chengdu → Tashkent (rail)',     transit: 'Block-train rail: <strong>8–10 days</strong> · 2x monthly' },
        { mode: 'sea',  route: 'Ningbo → Karachi',              transit: 'FCL ocean transit: <strong>16–20 days</strong> · Weekly sailings' },
      ],
    },
  };

  /* Mode-icon SVG markup, reused in trade-lane cards */
  const MODE_ICONS = {
    air:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
    road: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17V7h11v10M14 11h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/></svg>',
    sea:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0"/><path d="M4 18l-2-6h20l-2 6"/><path d="M12 10V4M8 7l4-3 4 3"/></svg>',
  };

  const MODE_LABELS = { air: 'Air', road: 'Road', sea: 'Sea' };

  /* DOM refs */
  const hero            = document.getElementById('dest-hero');
  const heroImage       = document.getElementById('destHeroImage');
  const heroTitle       = document.getElementById('destHeroTitle');
  const heroSubtitle    = document.getElementById('destHeroSubtitle');
  const breadcrumbName  = document.getElementById('breadcrumbCountry');
  const select          = document.getElementById('destinationSelect');
  const buttons         = document.querySelectorAll('.dest-btn');

  const detailSection   = document.getElementById('country-detail');
  const detailImage     = document.getElementById('destDetailImage');
  const detailNum       = document.getElementById('destDetailNum');
  const detailRegion    = document.getElementById('destDetailRegion');
  const detailEyebrow   = document.getElementById('destDetailEyebrow');
  const detailTitle     = document.getElementById('destDetailTitle');
  const detailDesc      = document.getElementById('destDetailDesc');
  const detailFeatures  = document.getElementById('destFeatures');
  const detailModes     = document.getElementById('destModes');
  const ctaName         = document.getElementById('destCtaName');

  const lanesGrid       = document.getElementById('destLanesGrid');

  /* Build mode chips */
  function renderModes(modes) {
    detailModes.innerHTML = ['air', 'road', 'sea'].map((mode) => {
      const on = !!modes[mode];
      return `
        <div class="dest-mode ${on ? 'is-on' : 'is-off'}">
          <span class="dest-mode-icon" aria-hidden="true">${MODE_ICONS[mode]}</span>
          <span class="dest-mode-name">${MODE_LABELS[mode]}${on ? '' : ' — N/A'}</span>
        </div>
      `;
    }).join('');
  }

  /* Build feature list */
  function renderFeatures(features) {
    detailFeatures.innerHTML = features
      .map((f) => `<li><span class="check">✓</span> ${f}</li>`)
      .join('');
  }

  /* Build trade lanes grid */
  function renderLanes(lanes) {
    lanesGrid.innerHTML = lanes.map((lane) => `
      <article class="dest-lane-card reveal">
        <div class="dest-lane-mode">
          <span class="dest-lane-mode-dot" aria-hidden="true">${MODE_ICONS[lane.mode]}</span>
          ${MODE_LABELS[lane.mode]} Freight
        </div>
        <div class="dest-lane-route">${lane.route}</div>
        <div class="dest-lane-transit">${lane.transit}</div>
      </article>
    `).join('');

    /* re-trigger reveal animation for newly inserted cards */
    requestAnimationFrame(() => {
      lanesGrid.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    });
  }

  /* Apply a destination — fade hero + detail, then swap */
  function applyDestination(key, opts) {
    const data = DESTINATIONS[key];
    if (!data) return;
    opts = opts || {};

    /* hero image cross-fade */
    if (heroImage) heroImage.classList.add('is-fading');
    hero.classList.add('is-swapping');
    detailSection.classList.add('is-swapping');

    window.setTimeout(() => {
      if (heroImage) heroImage.style.backgroundImage = `url('${data.heroImage}')`;
      heroTitle.innerHTML = data.heroTitleHTML;
      heroSubtitle.textContent = data.heroSubtitle;
      breadcrumbName.textContent = data.breadcrumb;

      if (detailImage) {
        detailImage.src = data.heroImage;
        detailImage.alt = data.region + ' logistics';
      }
      detailNum.textContent = data.num;
      detailRegion.textContent = data.region;
      detailEyebrow.textContent = data.eyebrow;
      detailTitle.innerHTML = data.detailTitleHTML;
      detailDesc.textContent = data.detailDesc;
      if (ctaName) ctaName.textContent = data.region;

      renderFeatures(data.features);
      renderModes(data.modes);
      renderLanes(data.lanes);

      if (heroImage) heroImage.classList.remove('is-fading');
      hero.classList.remove('is-swapping');
      detailSection.classList.remove('is-swapping');
    }, 280);

    /* sync UI state */
    buttons.forEach((btn) => {
      const isActive = btn.dataset.dest === key;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    if (select && select.value !== key) select.value = key;

    /* update URL hash so the choice is shareable / back-button friendly */
    if (!opts.skipHash) {
      try { history.replaceState(null, '', '#' + key); } catch (e) {}
    }

    /* scroll hint when triggered from anchor links */
    if (opts.scrollTo) {
      const target = document.querySelector(opts.scrollTo);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* Wire up the country buttons */
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyDestination(btn.dataset.dest);
    });
  });

  /* Wire up the dropdown */
  if (select) {
    select.addEventListener('change', (e) => {
      applyDestination(e.target.value);
    });
  }

  /* Footer quick-links */
  document.querySelectorAll('[data-dest-link]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      applyDestination(a.dataset.destLink, { scrollTo: '#country-detail' });
    });
  });

  /* Initial render — honor URL hash if present, otherwise default to middle-east.
     Also map the legacy '#cis' hash to the new 'central-asia' key. */
  const LEGACY = { cis: 'central-asia' };
  const initialKey = (() => {
    let fromHash = (location.hash || '').replace('#', '');
    if (LEGACY[fromHash]) fromHash = LEGACY[fromHash];
    if (fromHash && DESTINATIONS[fromHash]) return fromHash;
    return 'middle-east';
  })();

  applyDestination(initialKey, { skipHash: true });

  /* React to in-page hash changes (e.g. clicking a Destinations submenu link
     while already on this page). */
  window.addEventListener('hashchange', () => {
    let key = (location.hash || '').replace('#', '');
    if (LEGACY[key]) key = LEGACY[key];
    if (key && DESTINATIONS[key]) {
      applyDestination(key, { skipHash: true, scrollTo: '#country-detail' });
    }
  });
})();
