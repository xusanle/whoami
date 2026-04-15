(function () {
  'use strict';

  const panel = document.getElementById('right-panel');
  const navLinks = document.querySelectorAll('[data-target]');
  const sections = document.querySelectorAll('section[id]');

  // ── 1. Click nav → scroll right panel to section ──
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('data-target');
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      // offsetTop is relative to right-panel's scroll container
      const targetTop = target.offsetTop - 32;
      panel.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  // ── 2. Active nav on scroll ──
  function updateActive() {
    const scrolled = panel.scrollTop + panel.clientHeight * 0.35;
    let current = null;

    sections.forEach(function (s) {
      if (s.offsetTop <= scrolled) current = s.id;
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-target') === current);
    });
  }

  panel.addEventListener('scroll', updateActive, { passive: true });

  // ── 3. Intersection observer → fade in ──
  const fadeEls = document.querySelectorAll('.media-item, .content-block');

  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { root: panel, threshold: 0.05 }
  );

  fadeEls.forEach(function (el) { io.observe(el); });

  // ── 4. Stagger image entrance ──
  document.querySelectorAll('.image-strip .media-item').forEach(function (el, i) {
    el.style.transitionDelay = (i * 0.055) + 's';
  });

})();
