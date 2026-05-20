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
