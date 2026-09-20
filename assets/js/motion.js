// Page motion: sets the "ready" flag for the load sequence and reveals elements as they scroll in.
(function () {
  var root = document.documentElement;

  requestAnimationFrame(function () {
    requestAnimationFrame(function () { root.classList.add('ready'); });
  });

  function initReveals() {
    var targets = document.querySelectorAll('.entry, .timeline, .timeline__item, .project-card, [data-reveal]');
    if (!('IntersectionObserver' in window) || !root.classList.contains('js')) {
      targets.forEach(function (t) { t.classList.add('in', 'is-visible'); });
      return;
    }
    var seen = 0;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.classList.contains('project-card')) el.style.transitionDelay = (seen++ % 4) * 90 + 'ms';
        el.classList.add('in', 'is-visible');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  // Typed words on the home hero, as on the original site.
  function initTyped() {
    var el = document.querySelector('.typed[data-words]');
    if (!el) return;
    var words = el.dataset.words.split(',').map(function (w) { return w.trim(); });
    if (!root.classList.contains('js')) { el.textContent = words[0]; return; }
    var w = 0, i = 0, del = false;
    (function tick() {
      var word = words[w];
      i += del ? -1 : 1;
      el.textContent = word.slice(0, i);
      var wait = del ? 35 : 75;
      if (!del && i === word.length) { del = true; wait = 1400; }
      else if (del && i === 0) { del = false; w = (w + 1) % words.length; wait = 350; }
      setTimeout(tick, wait);
    })();
  }

  window.initReveals = initReveals;
  window.initTyped = initTyped;
  window.initTimelineDraw = function () {}; // kept for legacy pages; the timeline now draws via CSS
})();
