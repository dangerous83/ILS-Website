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
      heroImage: '../asset/Destination - Middle east.png',
      heroTitleHTML: 'Shipping to the <span class="accent">Middle East</span>',
      heroSubtitle: 'Trusted gateway to the Gulf and beyond — daily air, sea, and road consolidations into UAE, Saudi Arabia, Qatar, Oman, Kuwait, and Bahrain with on-the-ground customs expertise.',
      eyebrow: 'Middle East Gateway',
      detailTitleHTML: 'A trusted partner for <span class="accent">Gulf trade</span>',
      detailDesc: "From Dubai's Jebel Ali to Saudi's King Abdullah Port, our Middle East desk consolidates daily air, sea, and road shipments into every GCC country. Bonded warehouses, free-zone expertise, and Arabic-speaking customs brokers built in.",
      modes: { air: true, road: true, sea: true },
      features: [
        'Daily air consolidations from major hubs',
        'FCL & LCL ocean to all GCC ports',
        'Cross-border trucking inside the GCC',
        'Customs clearance in UAE, KSA, Oman, Qatar',
        'Bonded & free-zone warehousing',
      ],
      lanes: [
        { mode: 'air',  route: 'Dubai (DXB) → Riyadh (RUH)',  transit: 'Air freight transit: <strong>24–48 hours</strong> · Daily departures' },
        { mode: 'sea',  route: 'Mumbai → Jebel Ali (JEA)',     transit: 'FCL ocean transit: <strong>5–7 days</strong> · 3 sailings/week' },
        { mode: 'road', route: 'Dubai → Muscat',               transit: 'Cross-border road: <strong>14–18 hours</strong> · Daily trucks' },
        { mode: 'air',  route: 'Frankfurt (FRA) → Dubai (DXB)', transit: 'Air freight transit: <strong>7 hours</strong> · 14+ flights daily' },
        { mode: 'sea',  route: 'Shanghai → Jebel Ali',          transit: 'FCL ocean transit: <strong>18–22 days</strong> · Weekly sailings' },
        { mode: 'road', route: 'Riyadh → Doha',                 transit: 'Cross-border road: <strong>20–26 hours</strong> · 5x weekly' },
      ],
    },

    'afghanistan': {
      num: '02',
      region: 'Afghanistan',
      breadcrumb: 'Afghanistan',
      heroImage: '../asset/Destination - Afghanistan.png',
      heroTitleHTML: 'Reliable freight into <span class="accent">Afghanistan</span>',
      heroSubtitle: "One of the most challenging destinations in the world — handled with care. We move cargo into Kabul, Herat, Mazar-i-Sharif, and Kandahar via established air and overland corridors.",
      eyebrow: 'Afghanistan Corridor',
      detailTitleHTML: 'Specialists for <span class="accent">complex routes</span>',
      detailDesc: 'Decades of operating experience into Afghanistan via Dubai, Karachi, and the Central Asian land routes. Our agents on the ground manage clearance at Kabul, Hairatan, and Torkham — keeping your cargo moving when others stall.',
      modes: { air: true, road: true, sea: false },
      features: [
        'Air freight via Dubai (DXB) and Istanbul (IST)',
        'Overland trucking via Pakistan and Uzbekistan',
        'Customs clearance at Kabul, Hairatan, Torkham',
        'Project cargo and NGO shipment expertise',
        'Local agents in Kabul, Herat, Mazar-i-Sharif',
      ],
      lanes: [
        { mode: 'air',  route: 'Dubai (DXB) → Kabul (KBL)',         transit: 'Air freight transit: <strong>3 hours</strong> · 5x weekly' },
        { mode: 'road', route: 'Karachi → Kabul (via Torkham)',     transit: 'Overland trucking: <strong>5–7 days</strong> · Weekly departures' },
        { mode: 'road', route: 'Termez (UZ) → Mazar-i-Sharif',       transit: 'Cross-border road: <strong>2–3 days</strong> · 2x weekly' },
        { mode: 'air',  route: 'Istanbul (IST) → Kabul (KBL)',      transit: 'Air freight transit: <strong>4 hours</strong> · 3x weekly' },
        { mode: 'road', route: 'Bandar Abbas → Herat (via Islam Qala)', transit: 'Overland trucking: <strong>7–10 days</strong> · Weekly' },
        { mode: 'air',  route: 'Dubai (DXB) → Herat (HEA)',         transit: 'Air freight transit: <strong>3.5 hours</strong> · 2x weekly' },
      ],
    },

    'cis': {
      num: '03',
      region: 'CIS',
      breadcrumb: 'CIS',
      heroImage: '../asset/Destination - CIS.png',
      heroTitleHTML: 'Logistics across the <span class="accent">CIS Region</span>',
      heroSubtitle: 'Connecting global cargo to Central Asia — Uzbekistan, Kazakhstan, Tajikistan, Turkmenistan, Kyrgyzstan, and beyond. Air, road, and rail through every major gateway.',
      eyebrow: 'CIS Network',
      detailTitleHTML: 'Move cargo across the <span class="accent">Silk Road</span>',
      detailDesc: 'A modern Silk Road operation. We connect Europe, the Middle East, and China to the Central Asian republics with reliable road, rail, and air services — handling customs in Russian, English, and local languages.',
      modes: { air: true, road: true, sea: false },
      features: [
        'Road transit via Iran, Turkey, and Russia',
        'Block-train rail services into Tashkent and Almaty',
        'Air consolidations from Dubai and Istanbul',
        'TIR-Carnet trucking across all CIS borders',
        'Customs brokerage in Russian-speaking markets',
      ],
      lanes: [
        { mode: 'road', route: 'Istanbul → Tashkent',         transit: 'TIR road freight: <strong>9–12 days</strong> · Weekly departures' },
        { mode: 'air',  route: 'Dubai (DXB) → Almaty (ALA)',  transit: 'Air freight transit: <strong>5 hours</strong> · Daily flights' },
        { mode: 'road', route: 'Bandar Abbas → Ashgabat',     transit: 'Overland trucking: <strong>7–9 days</strong> · 2x weekly' },
        { mode: 'air',  route: 'Frankfurt (FRA) → Tashkent',  transit: 'Air freight transit: <strong>7 hours</strong> · 4x weekly' },
        { mode: 'road', route: 'Shanghai → Almaty (rail)',     transit: 'Block-train rail: <strong>12–14 days</strong> · 3x monthly' },
        { mode: 'road', route: 'Moscow → Bishkek',             transit: 'Overland trucking: <strong>8–10 days</strong> · Weekly' },
      ],
    },

    'europe': {
      num: '04',
      region: 'Europe',
      breadcrumb: 'Europe',
      heroImage: '../asset/Destination - Europe.png',
      heroTitleHTML: 'Freight across <span class="accent">Europe</span>',
      heroSubtitle: 'One unified network across the EU and UK. Same-day air, weekly ocean from major Asian ports, and dense road groupage covering every postcode in the Schengen area.',
      eyebrow: 'European Network',
      detailTitleHTML: 'A continent, <span class="accent">door-to-door</span>',
      detailDesc: 'Frankfurt, Rotterdam, Antwerp, Hamburg, Felixstowe — our European gateways receive cargo from every corner of the world and feed it into a dense road network that reaches any address in the EU within days.',
      modes: { air: true, road: true, sea: true },
      features: [
        'Daily air freight from 200+ origins',
        'FCL & LCL into Rotterdam, Antwerp, Hamburg, Felixstowe',
        'Pan-European road groupage (FTL & LTL)',
        'EU customs and VAT compliance handled',
        'Brexit-compliant UK clearance & dual customs',
      ],
      lanes: [
        { mode: 'air',  route: 'Dubai (DXB) → Frankfurt (FRA)',   transit: 'Air freight transit: <strong>7 hours</strong> · Daily flights' },
        { mode: 'sea',  route: 'Shanghai → Rotterdam',            transit: 'FCL ocean transit: <strong>30–35 days</strong> · Weekly sailings' },
        { mode: 'road', route: 'Rotterdam → Munich',              transit: 'Road groupage: <strong>2–3 days</strong> · Daily departures' },
        { mode: 'air',  route: 'New York (JFK) → London (LHR)',   transit: 'Air freight transit: <strong>8 hours</strong> · 15+ flights daily' },
        { mode: 'sea',  route: 'Singapore → Hamburg',             transit: 'FCL ocean transit: <strong>28–32 days</strong> · Weekly sailings' },
        { mode: 'road', route: 'Antwerp → Madrid',                transit: 'Road groupage: <strong>3–4 days</strong> · Daily trucks' },
      ],
    },

    'usa-canada': {
      num: '05',
      region: 'USA & Canada',
      breadcrumb: 'USA & Canada',
      heroImage: '../asset/Destination - USA and Canada.png',
      heroTitleHTML: 'Door-to-door to <span class="accent">North America</span>',
      heroSubtitle: 'Coast-to-coast coverage across the US and Canada. Air freight into JFK, LAX, ORD, YYZ, and YVR — ocean into every major US and Canadian port with seamless customs at the border.',
      eyebrow: 'North America Gateway',
      detailTitleHTML: 'Move it to <span class="accent">North America</span>',
      detailDesc: 'From Manhattan to Vancouver, we cover every ZIP and postal code. Licensed US customs brokers, CBSA-registered Canadian brokerage, and trucking partners across the lower 48, Hawaii, Alaska, and all Canadian provinces.',
      modes: { air: true, road: true, sea: true },
      features: [
        'Daily air freight into JFK, LAX, ORD, MIA, YYZ',
        'FCL & LCL ocean into LA/Long Beach, NY/NJ, Savannah, Vancouver',
        'CBP & CBSA licensed customs brokerage',
        'Cross-border trucking (US-Canada-Mexico)',
        'Bonded warehousing and FTZ services',
      ],
      lanes: [
        { mode: 'air',  route: 'Dubai (DXB) → New York (JFK)',     transit: 'Air freight transit: <strong>14 hours</strong> · Daily flights' },
        { mode: 'sea',  route: 'Shanghai → Los Angeles',           transit: 'FCL ocean transit: <strong>16–20 days</strong> · Daily sailings' },
        { mode: 'road', route: 'New York → Toronto',                transit: 'Cross-border road: <strong>2 days</strong> · Daily departures' },
        { mode: 'air',  route: 'Frankfurt (FRA) → Chicago (ORD)',  transit: 'Air freight transit: <strong>9 hours</strong> · Daily flights' },
        { mode: 'sea',  route: 'Hamburg → New York (NYC)',          transit: 'FCL ocean transit: <strong>10–14 days</strong> · 3 sailings/week' },
        { mode: 'road', route: 'Los Angeles → Vancouver',           transit: 'Cross-border road: <strong>2–3 days</strong> · Daily trucks' },
      ],
    },

    'africa': {
      num: '06',
      region: 'Africa',
      breadcrumb: 'Africa',
      heroImage: '../asset/Destination - Africa.png?v=2',
      heroTitleHTML: 'Coverage across <span class="accent">Africa</span>',
      heroSubtitle: 'East, West, North, and Southern Africa — connected. From Cairo to Cape Town, Lagos to Mombasa, we navigate the continent with local agents, deep customs knowledge, and reliable transit.',
      eyebrow: 'African Network',
      detailTitleHTML: 'A continent, <span class="accent">connected</span>',
      detailDesc: 'Africa is 54 countries, each with its own rules and routes. Our regional desks in Egypt, Kenya, Nigeria, and South Africa run the largest mixed-mode network on the continent — from project cargo to humanitarian aid.',
      modes: { air: true, road: true, sea: true },
      features: [
        'Air freight into Cairo, Nairobi, Lagos, Johannesburg, Addis Ababa',
        'FCL & LCL ocean into all major African ports',
        'Cross-border trucking on Mombasa-Kampala-Kigali corridor',
        'COMESA & SADC customs expertise',
        'Project cargo for oil, mining, and infrastructure',
      ],
      lanes: [
        { mode: 'air',  route: 'Dubai (DXB) → Nairobi (NBO)',       transit: 'Air freight transit: <strong>5 hours</strong> · Daily flights' },
        { mode: 'sea',  route: 'Shanghai → Mombasa',                transit: 'FCL ocean transit: <strong>24–28 days</strong> · Weekly sailings' },
        { mode: 'road', route: 'Mombasa → Kampala (East Africa)',    transit: 'Overland trucking: <strong>3–4 days</strong> · Daily trucks' },
        { mode: 'air',  route: 'Istanbul (IST) → Lagos (LOS)',       transit: 'Air freight transit: <strong>7 hours</strong> · Daily flights' },
        { mode: 'sea',  route: 'Rotterdam → Cape Town',              transit: 'FCL ocean transit: <strong>22–26 days</strong> · Weekly sailings' },
        { mode: 'road', route: 'Johannesburg → Lusaka',              transit: 'Overland trucking: <strong>3–5 days</strong> · 3x weekly' },
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
    heroImage.classList.add('is-fading');
    hero.classList.add('is-swapping');
    detailSection.classList.add('is-swapping');

    window.setTimeout(() => {
      heroImage.style.backgroundImage = `url('${data.heroImage}')`;
      heroTitle.innerHTML = data.heroTitleHTML;
      heroSubtitle.textContent = data.heroSubtitle;
      breadcrumbName.textContent = data.breadcrumb;

      detailImage.src = data.heroImage;
      detailImage.alt = data.region + ' logistics';
      detailNum.textContent = data.num;
      detailRegion.textContent = data.region;
      detailEyebrow.textContent = data.eyebrow;
      detailTitle.innerHTML = data.detailTitleHTML;
      detailDesc.textContent = data.detailDesc;
      if (ctaName) ctaName.textContent = data.region;

      renderFeatures(data.features);
      renderModes(data.modes);
      renderLanes(data.lanes);

      heroImage.classList.remove('is-fading');
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

  /* Initial render — honor URL hash if present, otherwise default to middle-east */
  const initialKey = (() => {
    const fromHash = (location.hash || '').replace('#', '');
    if (fromHash && DESTINATIONS[fromHash]) return fromHash;
    return 'middle-east';
  })();

  applyDestination(initialKey, { skipHash: true });

  /* React to in-page hash changes (e.g. clicking a Destinations submenu link
     while already on this page). */
  window.addEventListener('hashchange', () => {
    const key = (location.hash || '').replace('#', '');
    if (key && DESTINATIONS[key]) {
      applyDestination(key, { skipHash: true, scrollTo: '#country-detail' });
    }
  });
})();
