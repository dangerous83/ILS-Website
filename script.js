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




/* HERO 3D WIREFRAME GLOBE — moved to globe.js (shared with subpages). */


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
