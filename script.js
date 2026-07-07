/* ============================================
   ILS — Hero Slideshow
   Fades between 5 background images + text
   every 5 seconds. Click a dot to jump.
   ============================================ */

(function () {
  const SLIDE_INTERVAL = 5000;

  const slides = document.querySelectorAll('.hero-slide');
  const texts = document.querySelectorAll('.hero-text');
  const dots = document.querySelectorAll('.hero-dot');

  if (!slides.length || !texts.length) return;

  let current = 0;
  let timer = null;

  function setActive(index) {
    if (index === current) return;

    slides[current].classList.remove('is-active');
    texts[current].classList.remove('is-active');
    if (dots[current]) dots[current].classList.remove('is-active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('is-active');
    texts[current].classList.add('is-active');
    if (dots[current]) dots[current].classList.add('is-active');
  }

  function next() {
    setActive(current + 1);
  }

  function start() {
    stop();
    timer = setInterval(next, SLIDE_INTERVAL);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Dot navigation
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      if (!isNaN(idx)) {
        setActive(idx);
        start(); // reset timer so the next auto-advance is a full interval away
      }
    });
  });

  // Pause when the tab is hidden so we don't pile up transitions
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  start();
})();

/* ============================================
   ILS — Advanced Quotation Modal
   3-step quote builder. Submits via mailto:
   so the client's email app opens pre-filled
   to info@ilsmtc.com with all shipment data.
   ============================================ */

(function () {
  const RECIPIENT = 'info@ilsmtc.com';

  const modal = document.getElementById('quoteModal');
  const openBtn = document.getElementById('openQuoteBtn');
  if (!modal || !openBtn) return;

  const form = modal.querySelector('#quoteForm');
  const steps = modal.querySelectorAll('.quote-step');
  const stepChips = modal.querySelectorAll('.quote-steps li');
  const prevBtn = modal.querySelector('[data-quote-prev]');
  const nextBtn = modal.querySelector('[data-quote-next]');
  const submitBtn = modal.querySelector('.quote-btn-submit');
  const statusEl = modal.querySelector('#quoteFormStatus');
  const reviewList = modal.querySelector('#quoteReviewList');
  const successEl = modal.querySelector('#quoteSuccess');

  const STEP_VALIDATORS = {
    1: ['fullName', 'email'],
    2: ['service', 'origin', 'destination'],
    3: ['consent']
  };

  const LABELS = {
    fullName: 'Full Name', company: 'Company', email: 'Email', phone: 'Phone',
    country: 'Country', service: 'Service', origin: 'Origin', destination: 'Destination',
    cargo: 'Cargo', weight: 'Weight (kg)', dimensions: 'Dimensions (cm)',
    readyDate: 'Ready Date', incoterms: 'Incoterms', loadType: 'Load Type', notes: 'Notes'
  };

  let currentStep = 1;
  let lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('quote-modal-locked');
    setStep(1);
    setTimeout(() => {
      const f = form.querySelector('input, select, textarea');
      if (f) f.focus();
    }, 350);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('quote-modal-locked');
    successEl.classList.remove('is-shown');
    form.style.display = '';
    modal.querySelector('.quote-form-actions').style.display = '';
    modal.querySelector('.quote-modal-head').style.display = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function setStep(n) {
    currentStep = n;
    steps.forEach((s) => s.classList.toggle('is-active', Number(s.dataset.step) === n));
    stepChips.forEach((c) => {
      const sn = Number(c.dataset.step);
      c.classList.toggle('is-active', sn === n);
      c.classList.toggle('is-done', sn < n);
    });
    prevBtn.disabled = n === 1;
    const isLast = n === steps.length;
    nextBtn.style.display = isLast ? 'none' : '';
    submitBtn.style.display = isLast ? '' : 'none';
    statusEl.textContent = '';
    statusEl.className = 'quote-form-status';
    if (isLast) renderReview();
    // scroll form back to top
    const formEl = modal.querySelector('.quote-form');
    if (formEl) formEl.scrollTop = 0;
  }

  function validateStep(n) {
    const names = STEP_VALIDATORS[n] || [];
    let firstBad = null;
    names.forEach((name) => {
      const fields = form.querySelectorAll('[name="' + name + '"]');
      if (!fields.length) return;
      let ok = false;
      if (fields[0].type === 'radio') {
        ok = Array.from(fields).some((f) => f.checked);
      } else if (fields[0].type === 'checkbox') {
        ok = fields[0].checked;
      } else {
        const v = (fields[0].value || '').trim();
        ok = v.length > 0;
        if (ok && fields[0].type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        }
      }
      const wrap = fields[0].closest('.quote-field');
      if (wrap) wrap.classList.toggle('is-invalid', !ok);
      if (!ok && !firstBad) firstBad = fields[0];
    });
    if (firstBad) {
      statusEl.textContent = firstBad.type === 'checkbox'
        ? 'Please confirm the privacy notice to continue.'
        : 'Please complete the highlighted fields.';
      statusEl.className = 'quote-form-status is-error';
      if (firstBad.focus) firstBad.focus();
      return false;
    }
    return true;
  }

  function collectData() {
    const data = {};
    const fd = new FormData(form);
    fd.forEach((value, key) => { data[key] = (value || '').toString().trim(); });
    return data;
  }

  function renderReview() {
    const d = collectData();
    const rows = [];
    const push = (key, full) => {
      if (!d[key]) return;
      rows.push(
        '<div class="item' + (full ? ' full' : '') + '">' +
          '<dt>' + LABELS[key] + '</dt>' +
          '<dd>' + escapeHtml(d[key]) + '</dd>' +
        '</div>'
      );
    };
    ['fullName','company','email','phone','country','service','origin','destination',
     'cargo','weight','dimensions','readyDate','incoterms','loadType'].forEach((k) => push(k, false));
    push('notes', true);
    reviewList.innerHTML = rows.join('') || '<div class="item full"><dt>Note</dt><dd>No details entered yet.</dd></div>';
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (c) => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  function buildMailto(d) {
    const subject = 'Quote Request — ' + (d.service || 'General') +
      ((d.origin || d.destination) ? ' — ' + (d.origin || '?') + ' → ' + (d.destination || '?') : '');
    const lines = [
      'New quotation request via ilsmtc.com',
      '',
      '— CONTACT —',
      'Name: ' + (d.fullName || ''),
      'Company: ' + (d.company || ''),
      'Email: ' + (d.email || ''),
      'Phone: ' + (d.phone || ''),
      'Country: ' + (d.country || ''),
      '',
      '— SHIPMENT —',
      'Service: ' + (d.service || ''),
      'Origin: ' + (d.origin || ''),
      'Destination: ' + (d.destination || ''),
      'Cargo: ' + (d.cargo || ''),
      'Weight (kg): ' + (d.weight || ''),
      'Dimensions: ' + (d.dimensions || ''),
      'Ready Date: ' + (d.readyDate || ''),
      'Incoterms: ' + (d.incoterms || ''),
      'Load Type: ' + (d.loadType || ''),
      '',
      '— NOTES —',
      d.notes || '(none)',
      '',
      '— Sent from ILS website quote form —'
    ];
    return 'mailto:' + RECIPIENT +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));
  }

  // Wire events
  openBtn.addEventListener('click', openModal);

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-quote-close]')) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  nextBtn.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < steps.length) setStep(currentStep + 1);
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) setStep(currentStep - 1);
  });

  // Clear invalid state on input
  form.addEventListener('input', (e) => {
    const wrap = e.target.closest('.quote-field');
    if (wrap) wrap.classList.remove('is-invalid');
  });
  form.addEventListener('change', (e) => {
    const wrap = e.target.closest('.quote-field');
    if (wrap) wrap.classList.remove('is-invalid');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // validate all steps
    if (!validateStep(1)) { setStep(1); return; }
    if (!validateStep(2)) { setStep(2); return; }
    if (!validateStep(3)) { setStep(3); return; }

    const d = collectData();
    const href = buildMailto(d);

    // Open user's email client
    window.location.href = href;

    // Show success state
    form.style.display = 'none';
    modal.querySelector('.quote-form-actions').style.display = 'none';
    modal.querySelector('.quote-modal-head').style.display = 'none';
    successEl.classList.add('is-shown');
    successEl.setAttribute('aria-hidden', 'false');
  });
})();

/* ============================================
   ILS — Corporate Video Modal
   Plays the company film on loop in a polished
   dialog. Pauses + rewinds on close.
   ============================================ */

(function () {
  const modal = document.getElementById('videoModal');
  const openBtn = document.getElementById('openVideoBtn');
  if (!modal || !openBtn) return;

  const player = modal.querySelector('#ilsVideoPlayer');
  const quoteBtn = modal.querySelector('#videoToQuoteBtn');
  let lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('video-modal-locked');
    if (player) {
      player.currentTime = 0;
      const p = player.play();
      if (p && typeof p.catch === 'function') {
        // Autoplay may be blocked; fall back to muted autoplay
        p.catch(() => {
          player.muted = true;
          player.play().catch(() => { /* user can press play */ });
        });
      }
    }
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('video-modal-locked');
    if (player) {
      player.pause();
      try { player.currentTime = 0; } catch (e) {}
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  openBtn.addEventListener('click', openModal);

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-video-close]')) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  if (quoteBtn) {
    quoteBtn.addEventListener('click', () => {
      closeModal();
      const trigger = document.getElementById('openQuoteBtn');
      if (trigger) setTimeout(() => trigger.click(), 250);
    });
  }
})();




/* ============================================
   HERO 3D WIREFRAME GLOBE
   Canvas network sphere — points on a sphere
   connected by lines, rotating in 3D.
   - Drag (mouse / touch) to spin, with inertia
   - Hover makes the wireframe glow brighter
   - The 6 region chips are anchored to fixed
     points ON the sphere and are re-projected
     every frame, so they rotate with it.
   ============================================ */
(function () {
  const scene = document.getElementById('heroGlobe');
  const canvas = document.getElementById('globeCanvas');
  if (!scene || !canvas) return;

  const ctx = canvas.getContext('2d');
  const chips = Array.from(scene.querySelectorAll('[data-globe-node]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- geometry ---------- */
  const POINTS = 190;
  const pts = [];
  // Fibonacci sphere — evenly distributed points
  const GA = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < POINTS; i++) {
    const y = 1 - (i / (POINTS - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = GA * i;
    pts.push({ x: Math.cos(th) * r, y: y, z: Math.sin(th) * r });
  }

  // Precompute the wireframe topology once — rigid rotation keeps
  // distances constant, so neighbor pairs never change.
  const links = [];
  const LINK_DIST = 0.36;
  for (let i = 0; i < POINTS; i++) {
    for (let j = i + 1; j < POINTS; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const dz = pts[i].z - pts[j].z;
      if (dx * dx + dy * dy + dz * dz < LINK_DIST * LINK_DIST) links.push([i, j]);
    }
  }

  // A few of the points get drawn as little "cargo cubes"
  const cubes = [];
  for (let i = 7; i < POINTS; i += 23) cubes.push(i);

  // Region chip anchors — spread over the sphere (lat°, lon°)
  const anchorLL = [
    [18, 10], [-14, 70], [26, 135], [-8, 195], [20, 258], [-24, 315]
  ];
  const anchors = anchorLL.map(([lat, lon]) => {
    const la = (lat * Math.PI) / 180;
    const lo = (lon * Math.PI) / 180;
    return { x: Math.cos(la) * Math.cos(lo), y: Math.sin(la), z: Math.cos(la) * Math.sin(lo) };
  });

  /* ---------- state ---------- */
  let W = 0, H = 0, CX = 0, CY = 0, R = 0, DPR = 1;
  let yaw = 0.6;                 // current rotation
  const pitch = -0.35;           // fixed tilt (like the reference)
  let vel = 0.0032;              // auto-spin speed (rad/frame @60fps)
  const BASE_VEL = 0.0032;
  let glow = 0, glowTarget = 0;  // eased hover glow 0..1
  let dragging = false, lastX = 0, lastT = 0, dragVel = 0;
  let paused = false;            // chip hover pauses the spin
  let raf = null;
  // cursor position (canvas px) for the proximity "torch" glow
  let mx = -9999, my = -9999, mInside = false;
  const TORCH = 108;             // glow radius around the cursor

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    const rect = scene.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    CX = W / 2; CY = H / 2;
    R = W * 0.41;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  // 0..1 closeness of a screen point to the cursor (for the torch glow)
  function torch(x, y) {
    if (!mInside) return 0;
    const dx = x - mx, dy = y - my;
    const d = Math.sqrt(dx * dx + dy * dy);
    return d < TORCH ? 1 - d / TORCH : 0;
  }

  const cosP = () => Math.cos(pitch), sinP = () => Math.sin(pitch);

  // rotate + perspective-project a unit vector; returns screen pos, depth, scale
  function project(p, cy, sy) {
    // yaw (around Y)
    const x1 = p.x * cy + p.z * sy;
    const z1 = -p.x * sy + p.z * cy;
    // pitch (around X)
    const y2 = p.y * cosP() - z1 * sinP();
    const z2 = p.y * sinP() + z1 * cosP();
    const d = 3.2;                       // camera distance (in radii)
    const s = d / (d - z2);              // perspective scale
    return { sx: CX + x1 * R * s, sy: CY + y2 * R * s, z: z2, s: s };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const cy = Math.cos(yaw), sy = Math.sin(yaw);

    const proj = pts.map((p) => project(p, cy, sy));
    const g = glow;

    // wireframe links — subtle by default; depth + hover + the cursor
    // "torch" brighten them. Lines the cursor passes over light up.
    for (let k = 0; k < links.length; k++) {
      const a = proj[links[k][0]], b = proj[links[k][1]];
      const depth = (a.z + b.z) / 2;               // -1 back … +1 front
      const t = (depth + 1) / 2;
      const near = torch((a.sx + b.sx) / 2, (a.sy + b.sy) / 2);
      const alpha = (0.03 + t * 0.20) * (1 + g * 1.1) + near * 0.75;
      // near the cursor the line shifts brighter / whiter-blue
      const col = near > 0.02 ? (150 + near * 70) + ', ' + (190 + near * 45) + ', 255'
                              : '112, 168, 255';
      ctx.strokeStyle = 'rgba(' + col + ',' + Math.min(alpha, 0.95) + ')';
      ctx.lineWidth = 0.9 + g * 0.5 + near * 1.4;
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }

    // points
    for (let i = 0; i < proj.length; i++) {
      const p = proj[i];
      const t = (p.z + 1) / 2;
      const near = torch(p.sx, p.sy);
      const alpha = (0.16 + t * 0.42) * (1 + g * 0.6) + near * 0.7;
      const size = (0.85 + t * 1.2) * p.s + near * 1.6;
      const col = near > 0.02 ? (170 + near * 60) + ', ' + (205 + near * 30) + ', 255'
                              : '168, 204, 255';
      ctx.fillStyle = 'rgba(' + col + ',' + Math.min(alpha, 1) + ')';
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // small "cargo cube" accents
    for (let c = 0; c < cubes.length; c++) {
      const p = proj[cubes[c]];
      if (p.z < -0.2) continue;                    // hide far-back cubes
      const t = (p.z + 1) / 2;
      const near = torch(p.sx, p.sy);
      const s = (3 + t * 3) * p.s;
      ctx.save();
      ctx.translate(p.sx, p.sy);
      ctx.rotate(yaw + c);
      ctx.globalAlpha = Math.min(0.22 + t * 0.4 + near * 0.5, 1);
      ctx.strokeStyle = 'rgba(190, 218, 255,' + (0.45 + g * 0.35 + near * 0.4) + ')';
      ctx.lineWidth = 1.1;
      ctx.strokeRect(-s / 2, -s / 2, s, s);
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    // outer glow halo (stronger on hover)
    const halo = ctx.createRadialGradient(CX, CY, R * 0.55, CX, CY, R * 1.25);
    halo.addColorStop(0, 'rgba(64, 130, 255, 0)');
    halo.addColorStop(0.8, 'rgba(64, 130, 255,' + (0.04 + g * 0.09) + ')');
    halo.addColorStop(1, 'rgba(64, 130, 255, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);

    // soft spotlight that follows the cursor across the mesh
    if (mInside) {
      const spot = ctx.createRadialGradient(mx, my, 0, mx, my, TORCH);
      spot.addColorStop(0, 'rgba(120, 180, 255, 0.16)');
      spot.addColorStop(1, 'rgba(120, 180, 255, 0)');
      ctx.fillStyle = spot;
      ctx.beginPath();
      ctx.arc(mx, my, TORCH, 0, Math.PI * 2);
      ctx.fill();
    }

    // position the 6 region chips on the sphere
    for (let i = 0; i < chips.length; i++) {
      const a = project(anchors[i], cy, sy);
      const t = (a.z + 1) / 2;                      // 0 back … 1 front
      const scale = 0.55 + t * 0.55;
      const el = chips[i];
      el.style.transform =
        'translate(' + (a.sx - 26) + 'px,' + (a.sy - 26) + 'px) scale(' + scale.toFixed(3) + ')';
      el.style.opacity = (0.30 + t * 0.70).toFixed(3);
      el.style.zIndex = a.z > 0 ? 4 : 1;            // front chips above canvas
      el.style.pointerEvents = a.z > 0 ? 'auto' : 'none';
    }
  }

  function tick() {
    if (!dragging && !paused) yaw += vel;
    // ease drag inertia back to the cruise speed
    if (!dragging) vel += (BASE_VEL - vel) * 0.02;
    // ease the glow
    glow += (glowTarget - glow) * 0.08;
    draw();
    raf = requestAnimationFrame(tick);
  }

  /* ---------- interaction ---------- */
  scene.addEventListener('mouseenter', () => { glowTarget = 1; mInside = true; });
  scene.addEventListener('mouseleave', () => {
    glowTarget = 0; mInside = false; mx = my = -9999;
    dragging = false; scene.classList.remove('is-dragging');
  });

  chips.forEach((el) => {
    el.addEventListener('mouseenter', () => { paused = true; });
    el.addEventListener('mouseleave', () => { paused = false; });
    el.addEventListener('focus', () => { paused = true; });
    el.addEventListener('blur', () => { paused = false; });
  });

  scene.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.globe-node')) return;   // let chip clicks through
    dragging = true;
    lastX = e.clientX;
    lastT = performance.now();
    scene.classList.add('is-dragging');
    scene.setPointerCapture && scene.setPointerCapture(e.pointerId);
  });
  scene.addEventListener('pointermove', (e) => {
    // track the cursor over the canvas for the torch glow (hover or drag)
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
    mInside = true;
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - lastX;
    yaw += dx * 0.006;
    dragVel = (dx * 0.006) / Math.max(now - lastT, 1) * 16.7;
    lastX = e.clientX;
    lastT = now;
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    scene.classList.remove('is-dragging');
    // hand off inertia, clamped so it can't spin wildly
    vel = Math.max(-0.05, Math.min(0.05, dragVel || BASE_VEL));
    if (Math.abs(vel) < 0.0005) vel = BASE_VEL;
  }
  scene.addEventListener('pointerup', endDrag);
  scene.addEventListener('pointercancel', endDrag);

  /* ---------- boot ---------- */
  resize();
  window.addEventListener('resize', () => { resize(); if (reduceMotion) draw(); });

  if (reduceMotion) {
    draw();                                        // static frame only
  } else {
    // don't burn frames while the globe is off-screen
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { if (!raf) tick(); }
          else if (raf) { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0.05 });
      io.observe(scene);
    } else {
      tick();
    }
  }
})();


/* ============================================
   REGIONS PANEL — opened from the hero globe
   "Explore our 6 regions" button. The panel
   morphs open (circular clip reveal) and the
   six regions fly out of the core — all
   choreographed in CSS; JS just toggles state.
   ============================================ */
(function () {
  const panel = document.getElementById('regionsPanel');
  const openBtn = document.getElementById('openRegionsBtn');
  if (!panel || !openBtn) return;

  let lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('quote-modal-locked');
    const closeBtn = panel.querySelector('.regions-close');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 650);
  }

  function close() {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('quote-modal-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  openBtn.addEventListener('click', open);

  panel.querySelectorAll('[data-regions-close]').forEach((el) => {
    el.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) close();
  });
})();
