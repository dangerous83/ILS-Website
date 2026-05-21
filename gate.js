/* ============================================
   ILS — Site Access Gate
   Soft password gate; persists per browser session.
   Password: "ils" (case-insensitive)
   Note: client-side only; bypassable by viewing source.
   ============================================ */
(function () {
  var PASSWORD = 'ils';
  var KEY = 'ilsSiteUnlocked';

  // Already unlocked in this session — do nothing
  try {
    if (sessionStorage.getItem(KEY) === '1') return;
  } catch (e) { /* sessionStorage blocked — continue and show gate */ }

  // Hide page content immediately so it doesn't flash before the overlay paints
  var pre = document.createElement('style');
  pre.id = 'ilsGateStyle';
  pre.textContent =
    'html.ils-gate-locked, html.ils-gate-locked body { overflow: hidden !important; }' +
    'html.ils-gate-locked body > *:not(#ilsGate) { visibility: hidden !important; }' +
    '#ilsGate {' +
    '  position: fixed; inset: 0; z-index: 2147483647;' +
    '  display: flex; align-items: center; justify-content: center;' +
    '  background:' +
    '    radial-gradient(ellipse at 18% 12%, rgba(36,82,255,0.32), transparent 55%),' +
    '    radial-gradient(ellipse at 82% 88%, rgba(0,180,255,0.28), transparent 55%),' +
    '    linear-gradient(180deg, #04081f, #0a1230);' +
    '  color: #e8efff;' +
    '  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;' +
    '  padding: 24px;' +
    '  opacity: 0; transition: opacity .35s ease;' +
    '}' +
    '#ilsGate.is-shown { opacity: 1; }' +
    '#ilsGate.is-leaving { opacity: 0; transition: opacity .4s ease; }' +
    '#ilsGate .ils-gate-fx {' +
    '  position: absolute; inset: 0; pointer-events: none; overflow: hidden;' +
    '}' +
    '#ilsGate .ils-gate-grid {' +
    '  position: absolute; inset: -20%;' +
    '  background-image:' +
    '    linear-gradient(rgba(120,170,255,0.08) 1px, transparent 1px),' +
    '    linear-gradient(90deg, rgba(120,170,255,0.08) 1px, transparent 1px);' +
    '  background-size: 40px 40px;' +
    '  -webkit-mask-image: radial-gradient(ellipse at center, #000 35%, transparent 75%);' +
    '          mask-image: radial-gradient(ellipse at center, #000 35%, transparent 75%);' +
    '  animation: ilsGateDrift 22s linear infinite;' +
    '}' +
    '@keyframes ilsGateDrift { to { transform: translate(40px, 40px); } }' +
    '#ilsGate .ils-gate-orb {' +
    '  position: absolute; border-radius: 50%; filter: blur(70px); opacity: .55;' +
    '}' +
    '#ilsGate .ils-gate-orb-1 { width: 320px; height: 320px; background: #3463ff; top: -90px; left: -90px; }' +
    '#ilsGate .ils-gate-orb-2 { width: 280px; height: 280px; background: #00c2ff; bottom: -80px; right: -60px; }' +
    '#ilsGate .ils-gate-card {' +
    '  position: relative; z-index: 1;' +
    '  width: min(440px, 100%);' +
    '  background: linear-gradient(180deg, rgba(10,18,46,0.95), rgba(6,12,32,0.95));' +
    '  border: 1px solid rgba(120,170,255,0.22);' +
    '  border-radius: 22px;' +
    '  padding: 36px 32px 28px;' +
    '  box-shadow:' +
    '    0 30px 80px rgba(0, 20, 90, 0.55),' +
    '    0 0 0 1px rgba(255,255,255,0.04) inset,' +
    '    0 0 60px rgba(60,120,255,0.25) inset;' +
    '  text-align: center;' +
    '  transform: translateY(18px) scale(.97);' +
    '  transition: transform .5s cubic-bezier(.2,.8,.2,1);' +
    '}' +
    '#ilsGate.is-shown .ils-gate-card { transform: translateY(0) scale(1); }' +
    '#ilsGate .ils-gate-eyebrow {' +
    '  display: inline-flex; align-items: center; gap: 8px;' +
    '  font-size: 11px; letter-spacing: .24em; font-weight: 700;' +
    '  color: #8fb1ff; text-transform: uppercase;' +
    '}' +
    '#ilsGate .ils-gate-eyebrow::before {' +
    '  content: ""; width: 8px; height: 8px; border-radius: 50%;' +
    '  background: #36e0a3; box-shadow: 0 0 0 4px rgba(54, 224, 163, 0.18);' +
    '  animation: ilsGatePulse 1.6s ease-in-out infinite;' +
    '}' +
    '@keyframes ilsGatePulse {' +
    '  0%, 100% { box-shadow: 0 0 0 4px rgba(54, 224, 163, 0.18); }' +
    '  50%      { box-shadow: 0 0 0 9px rgba(54, 224, 163, 0); }' +
    '}' +
    '#ilsGate .ils-gate-title {' +
    '  margin: 14px 0 6px;' +
    '  font-size: 26px; font-weight: 800; letter-spacing: -.01em; color: #fff;' +
    '}' +
    '#ilsGate .ils-gate-title .accent {' +
    '  background: linear-gradient(90deg, #6aa6ff, #36e0a3);' +
    '  -webkit-background-clip: text; background-clip: text; color: transparent;' +
    '}' +
    '#ilsGate .ils-gate-subtitle {' +
    '  margin: 0 0 24px; font-size: 14px; color: rgba(220,232,255,0.72);' +
    '  line-height: 1.55;' +
    '}' +
    '#ilsGate .ils-gate-form { display: flex; flex-direction: column; gap: 12px; }' +
    '#ilsGate .ils-gate-input-wrap { position: relative; }' +
    '#ilsGate input[type="password"], #ilsGate input[type="text"] {' +
    '  width: 100%;' +
    '  padding: 14px 46px 14px 18px;' +
    '  background: rgba(255,255,255,0.04);' +
    '  border: 1px solid rgba(120,170,255,0.25);' +
    '  border-radius: 12px;' +
    '  color: #f0f5ff; font-size: 16px; font-family: inherit;' +
    '  letter-spacing: .08em; text-align: center;' +
    '  transition: border-color .25s, background .25s, box-shadow .25s;' +
    '}' +
    '#ilsGate input::placeholder { color: rgba(220,232,255,0.35); letter-spacing: 0; }' +
    '#ilsGate input:focus {' +
    '  outline: none; border-color: #6aa6ff;' +
    '  background: rgba(106, 166, 255, 0.06);' +
    '  box-shadow: 0 0 0 3px rgba(106, 166, 255, 0.18);' +
    '}' +
    '#ilsGate .ils-gate-reveal {' +
    '  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);' +
    '  width: 34px; height: 34px; border-radius: 50%;' +
    '  border: none; background: transparent; color: #8fb1ff; cursor: pointer;' +
    '  display: inline-flex; align-items: center; justify-content: center;' +
    '  transition: background .2s, color .2s;' +
    '}' +
    '#ilsGate .ils-gate-reveal:hover { background: rgba(106, 166, 255, 0.12); color: #fff; }' +
    '#ilsGate .ils-gate-btn {' +
    '  display: inline-flex; align-items: center; justify-content: center; gap: 8px;' +
    '  padding: 13px 22px;' +
    '  border: none; border-radius: 999px;' +
    '  background: linear-gradient(120deg, #3463ff, #00b4ff 55%, #36e0a3);' +
    '  background-size: 220% 220%; background-position: 0% 50%;' +
    '  color: #fff; font: inherit; font-weight: 700; font-size: 15px;' +
    '  cursor: pointer;' +
    '  box-shadow: 0 14px 36px rgba(0, 70, 220, 0.45), 0 0 0 1px rgba(255,255,255,0.08) inset;' +
    '  transition: transform .2s, box-shadow .2s, background-position .35s;' +
    '}' +
    '#ilsGate .ils-gate-btn:hover { background-position: 100% 50%; transform: translateY(-1px); }' +
    '#ilsGate .ils-gate-error {' +
    '  min-height: 18px; font-size: 12.5px; color: #ff9a9a; letter-spacing: .02em;' +
    '}' +
    '#ilsGate .ils-gate-card.is-shake { animation: ilsGateShake .45s ease both; }' +
    '@keyframes ilsGateShake {' +
    '  0%, 100% { transform: translateX(0); }' +
    '  20%, 60% { transform: translateX(-8px); }' +
    '  40%, 80% { transform: translateX(8px); }' +
    '}' +
    '#ilsGate .ils-gate-foot {' +
    '  margin-top: 18px; font-size: 11.5px; color: rgba(220,232,255,0.5);' +
    '  letter-spacing: .14em; text-transform: uppercase;' +
    '}' +
    '@media (max-width: 480px) {' +
    '  #ilsGate .ils-gate-card { padding: 28px 22px 22px; border-radius: 18px; }' +
    '  #ilsGate .ils-gate-title { font-size: 22px; }' +
    '}' +
    '@media (prefers-reduced-motion: reduce) {' +
    '  #ilsGate, #ilsGate .ils-gate-card, #ilsGate .ils-gate-grid,' +
    '  #ilsGate .ils-gate-eyebrow::before { animation: none !important; transition: none !important; }' +
    '}';
  document.documentElement.appendChild(pre);
  document.documentElement.classList.add('ils-gate-locked');

  function build() {
    var gate = document.createElement('div');
    gate.id = 'ilsGate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-label', 'Site access');
    gate.innerHTML =
      '<div class="ils-gate-fx" aria-hidden="true">' +
        '<div class="ils-gate-grid"></div>' +
        '<div class="ils-gate-orb ils-gate-orb-1"></div>' +
        '<div class="ils-gate-orb ils-gate-orb-2"></div>' +
      '</div>' +
      '<div class="ils-gate-card">' +
        '<span class="ils-gate-eyebrow">ILS · RESTRICTED PREVIEW</span>' +
        '<h1 class="ils-gate-title">Enter <span class="accent">Access Key</span></h1>' +
        '<p class="ils-gate-subtitle">This site is protected. Please enter the access key to continue.</p>' +
        '<form class="ils-gate-form" novalidate>' +
          '<div class="ils-gate-input-wrap">' +
            '<input type="password" name="key" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Access key" aria-label="Access key" />' +
            '<button type="button" class="ils-gate-reveal" aria-label="Show key" data-show="0">' +
              '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="ils-gate-error" role="alert" aria-live="polite"></div>' +
          '<button type="submit" class="ils-gate-btn">Unlock Site →</button>' +
        '</form>' +
        '<div class="ils-gate-foot">International Logistics Services</div>' +
      '</div>';
    document.body.appendChild(gate);

    var input = gate.querySelector('input');
    var reveal = gate.querySelector('.ils-gate-reveal');
    var form = gate.querySelector('form');
    var err = gate.querySelector('.ils-gate-error');
    var card = gate.querySelector('.ils-gate-card');

    requestAnimationFrame(function () {
      gate.classList.add('is-shown');
      setTimeout(function () { try { input.focus(); } catch (e) {} }, 250);
    });

    reveal.addEventListener('click', function () {
      var showing = reveal.getAttribute('data-show') === '1';
      input.type = showing ? 'password' : 'text';
      reveal.setAttribute('data-show', showing ? '0' : '1');
      input.focus();
    });

    input.addEventListener('input', function () {
      err.textContent = '';
      card.classList.remove('is-shake');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = (input.value || '').trim().toLowerCase();
      if (val === PASSWORD) {
        try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
        gate.classList.add('is-leaving');
        document.documentElement.classList.remove('ils-gate-locked');
        setTimeout(function () {
          if (gate.parentNode) gate.parentNode.removeChild(gate);
          var s = document.getElementById('ilsGateStyle');
          if (s && s.parentNode) s.parentNode.removeChild(s);
        }, 420);
      } else {
        err.textContent = 'Incorrect access key. Please try again.';
        card.classList.remove('is-shake');
        void card.offsetWidth; // restart shake
        card.classList.add('is-shake');
        input.select();
      }
    });
  }

  if (document.body) {
    build();
  } else {
    document.addEventListener('DOMContentLoaded', build, { once: true });
  }
})();
