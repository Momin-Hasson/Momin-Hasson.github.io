function initReveals() {
  const items = document.querySelectorAll('[data-reveal]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.gsap) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  items.forEach((el) => {
    gsap.set(el, { opacity: 0, y: 24 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }),
    });
  });
}

function initTimelineDraw(selector) {
  const container = document.querySelector(selector);
  const line = container ? container.querySelector('.timeline__line') : null;
  if (!container || !line) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.gsap) {
    line.style.transform = 'scaleY(1)';
    return;
  }
  gsap.set(line, { scaleY: 0, transformOrigin: 'top' });
  gsap.to(line, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top 70%',
      end: 'bottom 90%',
      scrub: true,
    },
  });
}

window.initReveals = initReveals;
window.initTimelineDraw = initTimelineDraw;
