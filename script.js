/* ===========================
   script.js — Zio Hsu Portfolio
=========================== */

(function () {
  'use strict';

  const rightPanel = document.querySelector('.right-panel');
  const navLinks = document.querySelectorAll('[data-target]');

  // ──────────────────────────────────────────
  // 1. SMOOTH SCROLL TO SECTION
  //    Clicks on nav links scroll the right panel
  //    to the corresponding section
  // ──────────────────────────────────────────
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // On mobile, body scrolls; on desktop, rightPanel scrolls
      const scrollContainer = window.innerWidth <= 768 ? window : rightPanel;
      const offset = targetEl.getBoundingClientRect().top;

      if (window.innerWidth <= 768) {
        window.scrollBy({ top: offset - 16, behavior: 'smooth' });
      } else {
        rightPanel.scrollBy({ top: offset - 32, behavior: 'smooth' });
      }
    });
  });

  // ──────────────────────────────────────────
  // 2. ACTIVE NAV STATE
  //    Highlight current nav item as user scrolls
  // ──────────────────────────────────────────
  const sections = document.querySelectorAll('section[id], .content-block[id]');

  function updateActiveNav() {
    const panelScrollTop = rightPanel.scrollTop;
    const panelHeight = rightPanel.clientHeight;

    let currentId = null;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      if (panelScrollTop >= sectionTop - panelHeight * 0.4) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const target = link.getAttribute('data-target');
      if (target === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  rightPanel.addEventListener('scroll', updateActiveNav);

  // ──────────────────────────────────────────
  // 3. INTERSECTION OBSERVER — FADE IN
  //    Elements fade up as they enter the viewport
  // ──────────────────────────────────────────
  const fadeEls = document.querySelectorAll('.media-item, .content-block');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: rightPanel,
      threshold: 0.08,
    }
  );

  fadeEls.forEach(function (el) {
    observer.observe(el);
  });

  // ──────────────────────────────────────────
  // 4. STAGGER FIRST VISIBLE ELEMENTS
  //    So the first images don't all pop in at once
  // ──────────────────────────────────────────
  const firstItems = document.querySelectorAll('.image-strip .media-item');
  firstItems.forEach(function (el, i) {
    el.style.transitionDelay = (i * 0.06) + 's';
  });

})();
