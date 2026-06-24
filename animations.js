/* ============================================
   ILS — Inner Page Animations
   Scroll-reveal + counter animations
   ============================================ */

(function () {
  const REVEAL_SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
  const COUNTER_SELECTOR = '.counter';

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll(REVEAL_SELECTOR);

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show everything immediately
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- counter animation ---------- */
  function animateCounter(el, target, duration) {
    const startTime = performance.now();
    const startVal = 0;

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + (target - startVal) * eased);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = target.toLocaleString();
    }

    requestAnimationFrame(frame);
  }

  const counters = document.querySelectorAll(COUNTER_SELECTOR);

  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const duration = parseInt(el.dataset.duration, 10) || 1800;
            if (!isNaN(target)) {
              animateCounter(el, target, duration);
            }
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach((el) => counterObserver.observe(el));
  } else {
    // Fallback: jump straight to target
    counters.forEach((el) => {
      const t = parseInt(el.dataset.target, 10);
      if (!isNaN(t)) el.textContent = t.toLocaleString();
    });
  }

  /* ---------- smooth scroll for in-page anchors ---------- */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const targetId = link.getAttribute('href');
    if (targetId === '#' || targetId.length < 2) return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- sticky navbar: add `is-scrolled` once page has moved ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const SCROLL_THRESHOLD = 40;
    const onScroll = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mobile navbar drawer (burger toggle) ---------- */
  initMobileNav();

  /* ---------- top contact banner (above navbar) ---------- */
  injectTopBanner();

  /* ---------- floating widgets: WhatsApp + Get Quote ---------- */
  injectFloatingWidgets();

  /* ---------- guide modal: opens from .res-card Read-guide buttons ---------- */
  injectGuideModal();

  /* ---------- animated logistics network in every CTA section ---------- */
  injectCtaNetwork();

  /* ---------- left-side cargo mode launcher (cyber style) ---------- */
  injectCargoFab();

  function initMobileNav() {
    const burger = document.querySelector('.nav-burger');
    const menu   = document.querySelector('.nav-menu');
    if (!burger || !menu) return;

    // Inject a Get-a-Quote CTA + contact row at the bottom of the drawer
    if (!menu.querySelector('.nav-mobile-cta')) {
      // Dedicated close (X) button inside the drawer, top-right of panel
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'nav-drawer-close';
      closeBtn.setAttribute('aria-label', 'Close menu');
      closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      closeBtn.addEventListener('click', () => {
        document.body.classList.remove('is-mobile-nav-open');
        burger.classList.remove('is-active');
      });
      menu.appendChild(closeBtn);

      const cta = document.createElement('button');
      cta.type = 'button';
      cta.className = 'nav-mobile-cta';
      cta.innerHTML = '<span class="arrow">→</span> Get a Quote';
      cta.addEventListener('click', () => {
        document.body.classList.remove('is-mobile-nav-open');
        burger.classList.remove('is-active');
        const trigger = document.getElementById('openQuoteBtn');
        if (trigger) { setTimeout(() => trigger.click(), 220); }
        else { window.location.href = (location.pathname.includes('/pages/') ? '../' : '') + 'pages/contact.html'; }
      });
      menu.appendChild(cta);

      const contacts = document.createElement('div');
      contacts.className = 'nav-mobile-contacts';
      contacts.innerHTML =
        '<a href="tel:+97144343800" aria-label="Call ILS">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>' +
          'Call</a>' +
        '<a href="https://wa.me/971545461339" target="_blank" rel="noopener" aria-label="WhatsApp ILS">' +
          '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2l-1 1.2c-.2.2-.4.2-.7.1-1-.4-2-1-2.7-2-.5-.9-.6-1.3-.4-1.5l.6-.7c.1-.1.2-.2.2-.4 0-.1 0-.3-.1-.4l-1-2.3c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.5s1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4 0-.1-.3-.2-.5-.2zM12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.4A10 10 0 1 0 12 2z"/></svg>' +
          'WhatsApp</a>' +
        '<a href="mailto:info@ilsmtc.com" aria-label="Email ILS">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' +
          'Email</a>';
      menu.appendChild(contacts);
    }

    // Submenu expand/collapse in the mobile drawer
    //   - tapping the title text navigates to the parent page (default <a> behaviour)
    //   - tapping the caret pill toggles the submenu without navigating
    menu.querySelectorAll('.has-submenu > a > .caret').forEach((caret) => {
      caret.addEventListener('click', (e) => {
        if (!document.body.classList.contains('is-mobile-nav-open')) return;
        e.preventDefault();
        e.stopPropagation();
        const li = caret.closest('.has-submenu');
        if (!li) return;
        const siblings = li.parentElement ? li.parentElement.children : [];
        for (const sib of siblings) {
          if (sib !== li) sib.classList.remove('is-expanded');
        }
        li.classList.toggle('is-expanded');
      });
    });

    burger.addEventListener('click', () => {
      document.body.classList.toggle('is-mobile-nav-open');
      burger.classList.toggle('is-active');
    });

    // Close when a real menu link is followed
    menu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        document.body.classList.remove('is-mobile-nav-open');
        burger.classList.remove('is-active');
      });
    });

    // ESC closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('is-mobile-nav-open')) {
        document.body.classList.remove('is-mobile-nav-open');
        burger.classList.remove('is-active');
      }
    });

    // Backdrop click closes (tap outside the drawer)
    document.addEventListener('click', (e) => {
      if (!document.body.classList.contains('is-mobile-nav-open')) return;
      if (e.target.closest('.nav-menu')) return;
      if (e.target.closest('.nav-burger')) return;
      document.body.classList.remove('is-mobile-nav-open');
      burger.classList.remove('is-active');
    });
  }

  function injectTopBanner() {
    if (document.querySelector('.ils-topbar')) return;

    const bar = document.createElement('div');
    bar.className = 'ils-topbar';
    bar.setAttribute('role', 'complementary');
    bar.setAttribute('aria-label', 'Contact information');
    bar.innerHTML = `
      <div class="ils-topbar-inner">
        <div class="ils-topbar-tagline">
          <span class="ils-topbar-pulse" aria-hidden="true"></span>
          <span class="ils-topbar-tagline-text">
            <strong>Moving Cargo. Driving Trade.</strong>
            <span class="ils-topbar-tagline-sub">Your trusted freight forwarder — Dubai to the world.</span>
          </span>
        </div>
        <div class="ils-topbar-contact">
          <a class="ils-topbar-link" href="mailto:info@ilsmtc.com" aria-label="Email us">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>
            <span>info@ilsmtc.com</span>
          </a>
          <span class="ils-topbar-sep" aria-hidden="true"></span>
          <a class="ils-topbar-link" href="tel:+97144343800" aria-label="Call our landline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8 9.8a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.9 2.3z"/></svg>
            <span>+971 4 4343800</span>
          </a>
          <span class="ils-topbar-sep" aria-hidden="true"></span>
          <a class="ils-topbar-link ils-topbar-link--wa" href="https://wa.me/971545461339" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5.3-.5.8-1.5.1-.2.1-.3 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.1 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2z"/></svg>
            <span>+971 54 546 1339</span>
          </a>
          <span class="ils-topbar-sep" aria-hidden="true"></span>
          <div class="ils-topbar-social" aria-label="Follow ILS on social media">
            <a class="ils-topbar-social-link" href="https://www.facebook.com/ilsmtc/" target="_blank" rel="noopener" aria-label="ILS on Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9V14.9H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>
            </a>
            <a class="ils-topbar-social-link" href="https://www.linkedin.com/company/94794509" target="_blank" rel="noopener" aria-label="ILS on LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zm-1.5-10.3a1.7 1.7 0 1 1 0-3.5 1.7 1.7 0 0 1 0 3.5zM19 19h-3v-4.7c0-1.1 0-2.5-1.5-2.5s-1.7 1.2-1.7 2.4V19h-3v-9h2.9v1.3a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.6 2 3.6 4.7z"/></svg>
            </a>
            <a class="ils-topbar-social-link" href="https://www.instagram.com/ilsdxb/" target="_blank" rel="noopener" aria-label="ILS on Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4A4 4 0 1 1 12.6 8a4 4 0 0 1 3.4 3.4z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
        </div>
      </div>
    `;

    // Insert as the very first element of body so it sits above the navbar
    if (document.body) {
      document.body.insertBefore(bar, document.body.firstChild);
    }

    // Keep the navbar flush to the bottom of the banner (no gap, even on wrap)
    const syncHeight = () => {
      const h = bar.offsetHeight || 44;
      document.documentElement.style.setProperty('--ils-topbar-height', h + 'px');
    };
    syncHeight();
    window.addEventListener('resize', syncHeight, { passive: true });
    if (window.ResizeObserver) {
      new ResizeObserver(syncHeight).observe(bar);
    }
  }

  function injectCargoFab() {
    if (document.querySelector('.ils-cargo-fab')) return;

    const fab = document.createElement('div');
    fab.className = 'ils-cargo-fab';
    fab.setAttribute('data-state', 'closed');
    fab.innerHTML = `
      <button type="button" class="ils-cargo-trigger" aria-label="Open cargo modes" aria-expanded="false">
        <span class="ils-cargo-trigger-echo" aria-hidden="true"></span>
        <span class="ils-cargo-trigger-echo ils-cargo-trigger-echo--2" aria-hidden="true"></span>
        <span class="ils-cargo-trigger-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7l9-4 9 4-9 4-9-4z"/>
            <path d="M3 7v10l9 4 9-4V7"/>
            <path d="M12 11v10"/>
          </svg>
        </span>
        <span class="ils-cargo-trigger-label">CARGO</span>
      </button>

      <aside class="ils-cargo-panel" aria-hidden="true" role="dialog" aria-label="Choose cargo mode">
        <span class="ils-cargo-panel-frame" aria-hidden="true"></span>
        <span class="ils-cargo-panel-scan" aria-hidden="true"></span>
        <span class="ils-cargo-panel-grid" aria-hidden="true"></span>

        <header class="ils-cargo-panel-header">
          <div>
            <div class="ils-cargo-panel-eyebrow">// SELECT TRANSPORT MODE</div>
            <h3 class="ils-cargo-panel-title">How are we moving it?</h3>
          </div>
          <button type="button" class="ils-cargo-panel-close" aria-label="Close">&times;</button>
        </header>

        <div class="ils-cargo-options">
          <button type="button" class="ils-cargo-option ils-cargo-option--air" data-mode="Air Freight">
            <span class="ils-cargo-option-glow" aria-hidden="true"></span>
            <span class="ils-cargo-option-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
              </svg>
            </span>
            <span class="ils-cargo-option-text">
              <span class="ils-cargo-option-label">CARGO <span>PLANE</span></span>
              <span class="ils-cargo-option-sub">By Air · Express Worldwide</span>
            </span>
            <span class="ils-cargo-option-arrow" aria-hidden="true">→</span>
          </button>

          <button type="button" class="ils-cargo-option ils-cargo-option--sea" data-mode="Sea Freight">
            <span class="ils-cargo-option-glow" aria-hidden="true"></span>
            <span class="ils-cargo-option-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 20c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0"/>
                <path d="M4 18l-2-6h20l-2 6"/>
                <path d="M12 10V4M8 7l4-3 4 3"/>
              </svg>
            </span>
            <span class="ils-cargo-option-text">
              <span class="ils-cargo-option-label">CARGO <span>SHIP</span></span>
              <span class="ils-cargo-option-sub">By Sea · FCL · LCL · Charter</span>
            </span>
            <span class="ils-cargo-option-arrow" aria-hidden="true">→</span>
          </button>

          <button type="button" class="ils-cargo-option ils-cargo-option--land" data-mode="Road Freight">
            <span class="ils-cargo-option-glow" aria-hidden="true"></span>
            <span class="ils-cargo-option-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 17V7h11v10M14 11h4l3 3v3h-7"/>
                <circle cx="7" cy="17.5" r="2"/>
                <circle cx="17" cy="17.5" r="2"/>
              </svg>
            </span>
            <span class="ils-cargo-option-text">
              <span class="ils-cargo-option-label">CARGO <span>TRUCK</span></span>
              <span class="ils-cargo-option-sub">By Land · Cross-border</span>
            </span>
            <span class="ils-cargo-option-arrow" aria-hidden="true">→</span>
          </button>
        </div>

        <footer class="ils-cargo-panel-footer">
          <span class="ils-cargo-panel-status">
            <span class="ils-cargo-panel-led"></span>
            ILS OPS · LIVE
          </span>
          <span class="ils-cargo-panel-stamp">[ DXB · 24/7 ]</span>
        </footer>
      </aside>
    `;
    document.body.appendChild(fab);

    const trigger = fab.querySelector('.ils-cargo-trigger');
    const panel   = fab.querySelector('.ils-cargo-panel');
    const closeBtn = fab.querySelector('.ils-cargo-panel-close');
    const options  = fab.querySelectorAll('.ils-cargo-option');

    const setState = (state) => {
      fab.setAttribute('data-state', state);
      trigger.setAttribute('aria-expanded', state === 'open' ? 'true' : 'false');
      panel.setAttribute('aria-hidden', state === 'open' ? 'false' : 'true');
    };

    trigger.addEventListener('click', () => {
      setState(fab.getAttribute('data-state') === 'open' ? 'closed' : 'open');
    });
    closeBtn.addEventListener('click', () => setState('closed'));

    // Click outside closes
    document.addEventListener('click', (e) => {
      if (fab.getAttribute('data-state') !== 'open') return;
      if (fab.contains(e.target)) return;
      setState('closed');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fab.getAttribute('data-state') === 'open') setState('closed');
    });

    // Each option closes the launcher and opens the Get Quote modal with the chosen mode pre-selected
    options.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        setState('closed');
        setTimeout(() => {
          const quoteFab = document.querySelector('.ils-fab--quote');
          if (!quoteFab) return;
          quoteFab.click();
          setTimeout(() => {
            const select = document.getElementById('ils-q-service');
            if (select) {
              for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value === mode || select.options[i].text === mode) {
                  select.selectedIndex = i;
                  break;
                }
              }
            }
          }, 120);
        }, 220);
      });
    });
  }

  function injectCtaNetwork() {
    const sections = document.querySelectorAll('.cta-section');
    if (!sections.length) return;

    // Logistics hubs positioned on a 1600x800 world-style canvas
    const HUBS = [
      { id: 'dxb', x: 1000, y: 380, label: 'Dubai' },
      { id: 'sin', x: 1240, y: 480, label: 'Singapore' },
      { id: 'hkg', x: 1290, y: 380, label: 'Hong Kong' },
      { id: 'bom', x: 1100, y: 430, label: 'Mumbai' },
      { id: 'fra', x: 830,  y: 270, label: 'Frankfurt' },
      { id: 'lon', x: 780,  y: 230, label: 'London' },
      { id: 'jfk', x: 410,  y: 320, label: 'New York' },
      { id: 'lax', x: 240,  y: 360, label: 'Los Angeles' },
      { id: 'gru', x: 540,  y: 580, label: 'São Paulo' },
      { id: 'los', x: 830,  y: 470, label: 'Lagos' },
      { id: 'syd', x: 1410, y: 640, label: 'Sydney' },
    ];

    // Arcs always originate from Dubai (DXB) since ILS is Dubai-based
    const ARCS = [
      { from: 'dxb', to: 'lon', dur: 5.5 },
      { from: 'dxb', to: 'fra', dur: 4.8 },
      { from: 'dxb', to: 'jfk', dur: 7.2 },
      { from: 'dxb', to: 'lax', dur: 8.0 },
      { from: 'dxb', to: 'hkg', dur: 5.0 },
      { from: 'dxb', to: 'sin', dur: 5.6 },
      { from: 'dxb', to: 'syd', dur: 7.6 },
      { from: 'dxb', to: 'gru', dur: 8.4 },
      { from: 'dxb', to: 'los', dur: 5.2 },
      { from: 'dxb', to: 'bom', dur: 3.6 },
    ];

    const hubById = (id) => HUBS.find((h) => h.id === id);

    // Curved Bezier path: lift control point above the midpoint so arcs feel like flight paths
    const arcPath = (a, b) => {
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      const lift = Math.min(dist * 0.35, 220);
      // perpendicular offset, biased upward
      const nx = -dy / dist;
      const ny = dx / dist;
      const cx = mx + nx * lift;
      const cy = my + ny * lift - 30;
      return `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`;
    };

    sections.forEach((section, secIdx) => {
      if (section.querySelector('.cta-network')) return;

      const wrap = document.createElement('div');
      wrap.className = 'cta-network';
      wrap.setAttribute('aria-hidden', 'true');

      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('class', 'cta-network-svg');
      svg.setAttribute('viewBox', '0 0 1600 800');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

      // defs: hub glow gradient
      const defs = document.createElementNS(ns, 'defs');
      defs.innerHTML = `
        <radialGradient id="ctaHubGlow-${secIdx}" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stop-color="rgba(120,180,255,0.9)"/>
          <stop offset="60%" stop-color="rgba(120,180,255,0.25)"/>
          <stop offset="100%" stop-color="rgba(120,180,255,0)"/>
        </radialGradient>
      `;
      svg.appendChild(defs);

      // dotted world-map silhouette (continents approximated as polygons)
      svg.appendChild(buildWorldMap(ns));

      // arcs
      const arcsGroup = document.createElementNS(ns, 'g');
      arcsGroup.setAttribute('class', 'cta-arcs');
      ARCS.forEach((arc, i) => {
        const a = hubById(arc.from);
        const b = hubById(arc.to);
        if (!a || !b) return;
        const d = arcPath(a, b);
        const pathId = `ctaArc-${secIdx}-${i}`;

        // Faint static guide line so the route is always visible
        const guide = document.createElementNS(ns, 'path');
        guide.setAttribute('d', d);
        guide.setAttribute('class', 'cta-arc-guide');
        arcsGroup.appendChild(guide);

        // Animated bright arc that draws/erases on loop
        const draw = document.createElementNS(ns, 'path');
        draw.setAttribute('d', d);
        draw.setAttribute('id', pathId);
        draw.setAttribute('class', 'cta-arc');
        draw.style.animationDuration = arc.dur + 's';
        draw.style.animationDelay = (i * 0.45) + 's';
        arcsGroup.appendChild(draw);

        // Travelling glow dot following the path
        const dot = document.createElementNS(ns, 'circle');
        dot.setAttribute('r', '4.5');
        dot.setAttribute('class', 'cta-traveler');

        const anim = document.createElementNS(ns, 'animateMotion');
        anim.setAttribute('dur', arc.dur + 's');
        anim.setAttribute('repeatCount', 'indefinite');
        anim.setAttribute('begin', (i * 0.45) + 's');
        anim.setAttribute('rotate', 'auto');
        const mpath = document.createElementNS(ns, 'mpath');
        mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + pathId);
        anim.appendChild(mpath);
        dot.appendChild(anim);
        arcsGroup.appendChild(dot);
      });
      svg.appendChild(arcsGroup);

      // hubs
      const hubsGroup = document.createElementNS(ns, 'g');
      hubsGroup.setAttribute('class', 'cta-hubs');
      HUBS.forEach((h, i) => {
        const g = document.createElementNS(ns, 'g');
        g.setAttribute('class', 'cta-hub' + (h.id === 'dxb' ? ' cta-hub--primary' : ''));
        g.setAttribute('transform', `translate(${h.x},${h.y})`);
        g.style.animationDelay = (i * 0.3) + 's';

        const glow = document.createElementNS(ns, 'circle');
        glow.setAttribute('class', 'cta-hub-glow');
        glow.setAttribute('r', h.id === 'dxb' ? '22' : '14');
        glow.setAttribute('fill', `url(#ctaHubGlow-${secIdx})`);
        g.appendChild(glow);

        const dot = document.createElementNS(ns, 'circle');
        dot.setAttribute('class', 'cta-hub-dot');
        dot.setAttribute('r', h.id === 'dxb' ? '5' : '3');
        g.appendChild(dot);

        hubsGroup.appendChild(g);
      });
      svg.appendChild(hubsGroup);

      wrap.appendChild(svg);
      section.insertBefore(wrap, section.firstChild);
    });

    // Builds a dotted world-map silhouette inside the SVG viewBox 1600 x 800.
    // Continents are approximated as polygons; we drop a dot at every grid cell
    // whose centre falls inside one of them.
    function buildWorldMap(nsURI) {
      const CONTINENTS = [
        // North America
        [[120,250],[260,210],[400,220],[470,290],[500,400],[440,500],[320,540],[200,490],[150,400]],
        // Central America
        [[400,500],[470,520],[490,560],[440,580],[400,560]],
        // South America
        [[460,560],[560,540],[620,610],[600,700],[520,720],[470,660]],
        // Greenland
        [[540,150],[640,150],[660,210],[580,230]],
        // Europe
        [[720,210],[830,200],[880,240],[860,300],[770,310],[720,270]],
        // Africa
        [[790,330],[920,330],[970,440],[940,560],[880,640],[810,620],[770,510],[770,400]],
        // Middle East / Arabia
        [[890,330],[990,330],[1010,420],[950,460],[900,430]],
        // North Asia
        [[890,170],[1380,160],[1430,260],[1380,330],[1190,330],[1010,320],[920,290]],
        // South Asia / India
        [[1000,330],[1140,330],[1170,430],[1100,470],[1030,440]],
        // SE Asia
        [[1180,400],[1290,400],[1310,500],[1250,540],[1190,510]],
        // Indonesia / Philippines (small clusters)
        [[1230,540],[1330,540],[1340,580],[1260,580]],
        // Japan
        [[1380,290],[1430,290],[1440,360],[1395,360]],
        // Australia
        [[1300,580],[1480,580],[1490,660],[1410,690],[1320,670]],
      ];

      // Point-in-polygon test (ray casting)
      const inside = (x, y, poly) => {
        let isIn = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
          const [xi, yi] = poly[i];
          const [xj, yj] = poly[j];
          const intersect =
            (yi > y) !== (yj > y) &&
            x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
          if (intersect) isIn = !isIn;
        }
        return isIn;
      };

      const group = document.createElementNS(nsURI, 'g');
      group.setAttribute('class', 'cta-worldmap');

      const STEP = 14;       // grid spacing
      const R    = 1.6;      // dot radius
      const W    = 1600;
      const H    = 800;

      for (let y = 100; y <= H - 60; y += STEP) {
        for (let x = 60; x <= W - 60; x += STEP) {
          let onLand = false;
          for (let c = 0; c < CONTINENTS.length; c++) {
            if (inside(x, y, CONTINENTS[c])) { onLand = true; break; }
          }
          if (!onLand) continue;
          const dot = document.createElementNS(nsURI, 'circle');
          dot.setAttribute('cx', x);
          dot.setAttribute('cy', y);
          dot.setAttribute('r', R);
          dot.setAttribute('fill', 'rgba(160, 200, 255, 0.32)');
          group.appendChild(dot);
        }
      }
      return group;
    }
  }

  function injectGuideModal() {
    const cards = document.querySelectorAll('.res-card');
    if (!cards.length || document.querySelector('.ils-modal--guide')) return;

    const modal = document.createElement('div');
    modal.className = 'ils-modal ils-modal--guide';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-labelledby', 'ils-guide-title');
    modal.innerHTML = `
      <div class="ils-modal-overlay" data-ils-close-guide></div>
      <div class="ils-modal-dialog ils-guide-dialog">
        <button type="button" class="ils-modal-close" aria-label="Close" data-ils-close-guide>&times;</button>

        <div class="ils-guide-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/>
            <path d="M4 17a3 3 0 0 1 3-3h11"/>
            <path d="M9 8h6M9 12h4"/>
          </svg>
        </div>

        <span class="ils-guide-tag" data-guide-tag></span>
        <h2 class="ils-guide-title" id="ils-guide-title" data-guide-title></h2>

        <div class="ils-guide-meta">
          <span class="ils-guide-time" data-guide-time></span>
          <span class="ils-guide-meta-dot"></span>
          <span>Practical guide</span>
        </div>

        <p class="ils-guide-desc" data-guide-desc></p>

        <div class="ils-guide-body">
          <h3 class="ils-guide-section-title">
            <span class="ils-guide-section-dot"></span>
            What you'll learn
          </h3>
          <ul class="ils-guide-bullets" data-guide-bullets></ul>
        </div>

        <div class="ils-guide-cta">
          <button type="button" class="ils-guide-btn ils-guide-btn--primary" data-ils-guide-contact>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-4.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>
            </svg>
            Contact an Expert
          </button>
          <a class="ils-guide-btn ils-guide-btn--ghost" href="mailto:info@ilsmtc.com" data-ils-guide-email>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2"/>
              <path d="M3 7l9 6 9-6"/>
            </svg>
            Email Us
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const openModal = (card) => {
      const tagEl  = card.querySelector('.res-card-tag');
      const titEl  = card.querySelector('.res-card-title');
      const descEl = card.querySelector('.res-card-desc');
      const timeEl = card.querySelector('.res-card-meta span:first-child');
      const points = card.querySelectorAll('.res-card-points li');

      const tagSlot   = modal.querySelector('[data-guide-tag]');
      const titleSlot = modal.querySelector('[data-guide-title]');
      const descSlot  = modal.querySelector('[data-guide-desc]');
      const timeSlot  = modal.querySelector('[data-guide-time]');
      const bullets   = modal.querySelector('[data-guide-bullets]');
      const emailBtn  = modal.querySelector('[data-ils-guide-email]');

      // Copy tag text + tag colour class
      tagSlot.textContent = tagEl ? tagEl.textContent.trim() : '';
      tagSlot.className = 'ils-guide-tag';
      if (tagEl) {
        Array.from(tagEl.classList).forEach((c) => {
          if (c.startsWith('tag-')) tagSlot.classList.add(c);
        });
      }

      titleSlot.textContent = titEl ? titEl.textContent.trim() : '';
      descSlot.textContent  = descEl ? descEl.textContent.trim() : '';
      timeSlot.textContent  = timeEl ? timeEl.textContent.trim() : '';

      bullets.innerHTML = '';
      points.forEach((li, idx) => {
        const item = document.createElement('li');
        item.textContent = li.textContent.trim();
        item.style.setProperty('--i', idx);
        bullets.appendChild(item);
      });

      const title = titleSlot.textContent;
      emailBtn.setAttribute(
        'href',
        'mailto:info@ilsmtc.com?subject=' +
          encodeURIComponent('Question about: ' + title) +
          '&body=' +
          encodeURIComponent('Hello ILS team,\n\nI just read your guide on "' + title + '" and would like to discuss this further.\n\n')
      );

      // Restart animations on every open
      modal.classList.remove('is-open');
      void modal.offsetWidth;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    cards.forEach((card) => {
      // Whole card is clickable
      card.classList.add('res-card--clickable');
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(card);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card);
        }
      });
    });

    modal.querySelectorAll('[data-ils-close-guide]').forEach((el) =>
      el.addEventListener('click', closeModal)
    );

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    // Contact an Expert → close guide modal and open the existing Get Quote modal
    modal.querySelector('[data-ils-guide-contact]').addEventListener('click', () => {
      closeModal();
      setTimeout(() => {
        const quoteTrigger = document.querySelector('.ils-fab--quote');
        if (quoteTrigger) quoteTrigger.click();
      }, 260);
    });
  }

  function injectFloatingWidgets() {
    if (document.querySelector('.ils-floating-widgets')) return;

    const WHATSAPP_NUMBER = '971545461339';
    const QUOTE_EMAIL = 'info@ilsmtc.com';
    const WA_PREFILL = encodeURIComponent(
      "Hello ILS, I'd like to get more information about your logistics services."
    );

    const widgets = document.createElement('div');
    widgets.className = 'ils-floating-widgets';
    widgets.innerHTML = `
      <a class="ils-fab ils-fab--whatsapp" href="https://wa.me/${WHATSAPP_NUMBER}?text=${WA_PREFILL}"
         target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
        <span class="ils-fab-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="currentColor">
            <path d="M19.11 17.29c-.27-.14-1.61-.79-1.86-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.66 1.12 2.84.14.18 1.93 2.95 4.68 4.13.65.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.61-.66 1.84-1.3.23-.64.23-1.18.16-1.3-.07-.12-.25-.18-.52-.32zM16.02 4.5C9.66 4.5 4.5 9.66 4.5 16.02c0 2.04.53 4.03 1.54 5.79L4.5 27.5l5.86-1.53a11.5 11.5 0 0 0 5.66 1.47h.01c6.36 0 11.52-5.16 11.52-11.52 0-3.08-1.2-5.97-3.38-8.14a11.45 11.45 0 0 0-8.15-3.38zm0 21.13h-.01a9.6 9.6 0 0 1-4.88-1.34l-.35-.21-3.48.91.93-3.39-.23-.36a9.59 9.59 0 0 1-1.47-5.12c0-5.3 4.31-9.61 9.6-9.61 2.57 0 4.97 1 6.79 2.81a9.55 9.55 0 0 1 2.82 6.81c0 5.3-4.31 9.61-9.6 9.61z"/>
          </svg>
        </span>
        <span class="ils-fab-label">WhatsApp Us</span>
      </a>
      <button type="button" class="ils-fab ils-fab--quote" aria-label="Get a quote" data-ils-open-quote>
        <span class="ils-fab-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/>
            <path d="M14 3v5h5"/>
            <path d="M9 13h6M9 17h4"/>
          </svg>
        </span>
        <span class="ils-fab-label">Get a Quote</span>
        <span class="ils-fab-badge" aria-hidden="true"></span>
      </button>
    `;
    document.body.appendChild(widgets);

    const modal = document.createElement('div');
    modal.className = 'ils-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'ils-quote-title');
    modal.innerHTML = `
      <div class="ils-modal-overlay" data-ils-close-quote></div>
      <div class="ils-modal-dialog">
        <button type="button" class="ils-modal-close" aria-label="Close" data-ils-close-quote>&times;</button>
        <div class="ils-modal-header">
          <span class="ils-modal-header-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/>
              <path d="M14 3v5h5"/>
              <path d="M9 13h6M9 17h4"/>
            </svg>
          </span>
          <div>
            <div class="ils-modal-title" id="ils-quote-title">Request a Quote</div>
            <div class="ils-modal-subtitle">Tell us about your shipment — our team replies within one business day.</div>
          </div>
        </div>
        <form class="ils-quote-form" novalidate>
          <div class="ils-field-row">
            <div>
              <label for="ils-q-name">Full Name *</label>
              <input id="ils-q-name" name="name" type="text" required autocomplete="name" />
            </div>
            <div>
              <label for="ils-q-company">Company</label>
              <input id="ils-q-company" name="company" type="text" autocomplete="organization" />
            </div>
          </div>
          <div class="ils-field-row">
            <div>
              <label for="ils-q-email">Email *</label>
              <input id="ils-q-email" name="email" type="email" required autocomplete="email" />
            </div>
            <div>
              <label for="ils-q-phone">Phone</label>
              <input id="ils-q-phone" name="phone" type="tel" autocomplete="tel" />
            </div>
          </div>
          <div class="ils-field-row">
            <div>
              <label for="ils-q-service">Service</label>
              <select id="ils-q-service" name="service">
                <option>Air Freight</option>
                <option>Sea Freight</option>
                <option>Road Freight</option>
                <option>Project Cargo</option>
                <option>Customs &amp; Compliance</option>
                <option>Supply Chain Management</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label for="ils-q-route">Origin → Destination</label>
              <input id="ils-q-route" name="route" type="text" placeholder="e.g. Dubai → Kabul" />
            </div>
          </div>
          <div>
            <label for="ils-q-details">Shipment Details</label>
            <textarea id="ils-q-details" name="details" placeholder="Commodity, weight, volume, incoterms, timeline…"></textarea>
          </div>
          <button type="submit" class="ils-quote-submit">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
            Send Quote Request
          </button>
          <div class="ils-quote-note">Your request will be sent to ${QUOTE_EMAIL}.</div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    const openBtn = widgets.querySelector('[data-ils-open-quote]');
    const form = modal.querySelector('.ils-quote-form');
    const firstField = modal.querySelector('#ils-q-name');

    const openModal = () => {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstField && firstField.focus(), 50);
    };
    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    openBtn.addEventListener('click', openModal);
    modal.querySelectorAll('[data-ils-close-quote]').forEach((el) =>
      el.addEventListener('click', closeModal)
    );
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    // Allow other site CTAs to open the quote modal via [data-open-quote] or href="#get-quote"
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-quote], a[href="#get-quote"]');
      if (trigger) {
        e.preventDefault();
        openModal();
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = {
        name: form.name.value.trim(),
        company: form.company.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        service: form.service.value,
        route: form.route.value.trim(),
        details: form.details.value.trim()
      };

      if (!data.name || !data.email) {
        if (!data.name) form.name.focus();
        else form.email.focus();
        return;
      }

      const subject = `Quote Request — ${data.service}${data.route ? ' — ' + data.route : ''}`;
      const bodyLines = [
        'New quote request from the ILS website:',
        '',
        `Name:     ${data.name}`,
        `Company:  ${data.company || '-'}`,
        `Email:    ${data.email}`,
        `Phone:    ${data.phone || '-'}`,
        `Service:  ${data.service}`,
        `Route:    ${data.route || '-'}`,
        '',
        'Shipment Details:',
        data.details || '-',
        '',
        `Submitted from: ${window.location.href}`
      ];
      const mailto = `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
      window.location.href = mailto;

      setTimeout(() => {
        form.reset();
        closeModal();
      }, 400);
    });
  }
})();
