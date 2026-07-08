/* ============================================================
   University of Roehampton — Computing Department Portal
   main.js
   ============================================================ */

'use strict';

/* ── Dark mode ───────────────────────────────────────────── */
(function () {
  const STORAGE_KEY = 'rh-computing-theme';
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeBtn');
    if (!btn) return;
    const icon = theme === 'dark'
      ? `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    btn.innerHTML = icon;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || preferred);

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('themeBtn');
    if (!btn) return;
    const current = root.getAttribute('data-theme') || 'light';
    applyTheme(current);
    btn.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  });
})();

/* ── DOM ready ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile menu ─────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });
  }

  /* ── Search bar toggle ───────────────────────────────── */
  const searchBtn = document.getElementById('searchBtn');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');
  if (searchBtn && searchBar) {
    searchBtn.addEventListener('click', function () {
      const open = searchBar.classList.toggle('open');
      if (open && searchInput) searchInput.focus();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') searchBar.classList.remove('open');
    });
  }

  /* ── Tab switching ───────────────────────────────────── */
  document.querySelectorAll('[data-tabs]').forEach(function (tabGroup) {
    const btns = tabGroup.querySelectorAll('.tab-btn');
    const target = tabGroup.dataset.tabs;
    const panels = document.querySelectorAll('.tab-panel[data-group="' + target + '"]');

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.dataset.tab;
        btns.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const panel = document.querySelector('.tab-panel[data-tab="' + id + '"][data-group="' + target + '"]');
        if (panel) panel.classList.add('active');
      });
    });
  });

  /* ── Role tabs (hero) ────────────────────────────────── */
  document.querySelectorAll('.role-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.role-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      // Optionally scroll to services
      const target = document.getElementById('services');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── Accordion ───────────────────────────────────────── */
  document.querySelectorAll('.accordion-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const body = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');
      // Close all in same accordion
      const accordion = btn.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion-btn').forEach(function (b) {
          b.classList.remove('open');
          b.setAttribute('aria-expanded', 'false');
          if (b.nextElementSibling) b.nextElementSibling.classList.remove('open');
        });
      }
      if (!isOpen) {
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        if (body) body.classList.add('open');
      }
    });
  });

  /* ── News filter (programme chips have their own handler) ── */
  document.querySelectorAll('.filter-btn:not(.prog-filter-btn)').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn:not(.prog-filter-btn)').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.news-item').forEach(function (item) {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ── Announcement close ──────────────────────────────── */
  const annClose = document.querySelector('.announcement-close');
  if (annClose) {
    annClose.addEventListener('click', function () {
      annClose.closest('.announcement').style.display = 'none';
    });
  }

  /* ── Animate stats counter ───────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;
    const timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, step);
  }

  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(function (el) { observer.observe(el); });
  }

  /* ── Active nav link ─────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Smooth reveal on scroll ─────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ── Dropdown nav ────────────────────────────────────── */
  document.querySelectorAll('.nav-item').forEach(function (item) {
    const toggle = item.querySelector('.dropdown-toggle');
    const dropdown = item.querySelector('.dropdown');
    if (!toggle || !dropdown) return;

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.nav-item.open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          const t = other.querySelector('.dropdown-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        item.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  });

  document.addEventListener('click', function () {
    document.querySelectorAll('.nav-item.open').forEach(function (item) {
      item.classList.remove('open');
      const t = item.querySelector('.dropdown-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Programme filter ────────────────────────────────── */
  const progFilterBtns = document.querySelectorAll('.prog-filter-btn');
  const progCards = document.querySelectorAll('.prog-card');
  const progSearch = document.getElementById('progSearch');
  const progNoResults = document.getElementById('progNoResults');
  const progCount = document.getElementById('progCount');
  const progEmpty = document.getElementById('progEmpty');

  /* Progressive disclosure: the catalogue stays dormant until the user
     explicitly picks a level or types a search — nothing shown by default. */
  function filterProgrammes() {
    const activeBtn = document.querySelector('.prog-filter-btn.active');
    const filter = activeBtn ? activeBtn.dataset.filter : null;
    const query = progSearch ? progSearch.value.toLowerCase().trim() : '';

    const progHideBtn = document.getElementById('progHide');
    if (!filter && !query) {
      progCards.forEach(function (card) { card.hidden = true; });
      if (progEmpty) progEmpty.hidden = false;
      if (progNoResults) progNoResults.hidden = true;
      if (progCount) progCount.textContent = '';
      if (progHideBtn) progHideBtn.hidden = true;
      return;
    }
    if (progHideBtn) progHideBtn.hidden = false;

    if (progEmpty) progEmpty.hidden = true;
    let visible = 0;
    progCards.forEach(function (card) {
      const levelMatch = !filter || filter === 'all' || card.dataset.level === filter;
      const textMatch = !query || card.textContent.toLowerCase().includes(query);
      const show = levelMatch && textMatch;
      card.hidden = !show;
      if (show) visible++;
    });
    if (progNoResults) progNoResults.hidden = visible > 0;
    /* Always tell the user what they are looking at — reduces cognitive load */
    if (progCount) {
      const label = activeBtn ? activeBtn.textContent.replace(/\s*\(\d+\)\s*$/, '').trim() : 'All';
      progCount.textContent = query
        ? 'Showing ' + visible + ' of ' + progCards.length + ' programmes matching “' + query + '”.'
        : 'Showing ' + visible + ' of ' + progCards.length + ' programmes · ' + label + '. Pick another chip to switch level.';
    }
  }

  if (progFilterBtns.length) {
    progFilterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        /* Clicking the active chip again puts the catalogue back to sleep */
        const wasActive = btn.classList.contains('active');
        progFilterBtns.forEach(function (b) { b.classList.remove('active'); });
        if (!wasActive) btn.classList.add('active');
        filterProgrammes();
      });
    });
  }
  if (progSearch) {
    progSearch.addEventListener('input', filterProgrammes);
  }
  /* Explicit collapse control — puts the catalogue back to sleep */
  const progHide = document.getElementById('progHide');
  if (progHide) {
    progHide.addEventListener('click', function () {
      progFilterBtns.forEach(function (b) { b.classList.remove('active'); });
      if (progSearch) progSearch.value = '';
      filterProgrammes();
      const head = document.getElementById('catalogue-heading');
      if (head) head.scrollIntoView({ block: 'center' });
    });
  }
  if (progCards.length) filterProgrammes();

  /* ── Services: collapsible category groups ───────────────
     Each category starts closed, showing only its name and how
     many services it holds. Opening one closes the others, so
     the reader never faces more than one group at a time. */
  document.querySelectorAll('.tab-panel[data-group="services"]').forEach(function (panel) {
    panel.querySelectorAll('.section-label').forEach(function (label) {
      const grid = label.nextElementSibling;
      if (!grid || !grid.classList.contains('grid-3')) return;
      const title = label.querySelector('h3') ? label.querySelector('h3').textContent.trim() : 'Services';
      const count = grid.children.length;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'svc-toggle';
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<span class="svc-toggle-title">' + title + '</span>' +
        '<span class="svc-count">' + count + ' service' + (count === 1 ? '' : 's') + '</span>' +
        '<svg class="svc-chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polyline points="6 9 12 15 18 9"/></svg>';
      label.replaceWith(btn);
      grid.hidden = true;
      btn.addEventListener('click', function () {
        const wasOpen = btn.getAttribute('aria-expanded') === 'true';
        panel.querySelectorAll('.svc-toggle').forEach(function (b) {
          b.setAttribute('aria-expanded', 'false');
          const g = b.nextElementSibling;
          if (g) g.hidden = true;
        });
        if (!wasOpen) {
          btn.setAttribute('aria-expanded', 'true');
          grid.hidden = false;
        }
      });
    });
  });
  /* Deep links (e.g. services.html#students) still work: open the
     group that contains the anchor target, then scroll to it. */
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target && target.classList && target.classList.contains('grid-3') && target.hidden) {
      const toggle = target.previousElementSibling;
      if (toggle && toggle.classList.contains('svc-toggle')) {
        toggle.click();
        toggle.scrollIntoView({ block: 'center' });
      }
    }
  }

  /* ── Fast Feedback ───────────────────────────────────── */
  const ffBtn = document.getElementById('fastFeedback');
  const ffPanel = document.getElementById('fastFeedbackPanel');
  const ffCloseBtn = document.getElementById('ffClose');

  if (ffBtn && ffPanel) {
    ffBtn.addEventListener('click', function () {
      ffPanel.hidden = !ffPanel.hidden;
    });
  }
  if (ffCloseBtn && ffPanel) {
    ffCloseBtn.addEventListener('click', function () {
      ffPanel.hidden = true;
    });
  }

  // Star rating
  const ffStars = document.querySelectorAll('.ff-star');
  ffStars.forEach(function (star, i) {
    star.addEventListener('click', function () {
      ffStars.forEach(function (s, j) {
        s.textContent = j <= i ? '★' : '☆';
        s.setAttribute('aria-pressed', j <= i ? 'true' : 'false');
      });
    });
    star.addEventListener('mouseover', function () {
      ffStars.forEach(function (s, j) { s.style.opacity = j <= i ? '1' : '.35'; });
    });
    star.addEventListener('mouseout', function () {
      ffStars.forEach(function (s) { s.style.opacity = '1'; });
    });
  });

  /* ── Hero carousel ───────────────────────────────────────── */
  const carousel = document.getElementById('heroCarousel');
  if (carousel) {
    const track = document.getElementById('carouselTrack');
    const slides = track.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const status = document.getElementById('carouselStatus');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const AUTOPLAY_MS = 6000;
    let index = 0;
    let timer = null;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (d, j) {
        d.classList.toggle('active', j === index);
        d.setAttribute('aria-selected', j === index ? 'true' : 'false');
      });
      if (status) status.textContent = (index + 1) + ' / ' + slides.length;
    }

    function play() {
      stop();
      timer = setInterval(function () { goTo(index + 1); }, AUTOPLAY_MS);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); play(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); play(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); play(); });
    });

    /* Pause on hover/focus — user control (Nielsen #3) */
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', play);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', play);

    /* Keyboard support */
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { goTo(index - 1); play(); }
      if (e.key === 'ArrowRight') { goTo(index + 1); play(); }
    });

    /* Respect reduced-motion preference */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.style.transition = 'none';
    } else {
      play();
    }
    goTo(0);
  }

  /* ── Programme tabs ─────────────────────────────────────── */
  const progTabs = document.querySelectorAll('.prog-tab');
  const progPanels = document.querySelectorAll('.prog-tab-panel');
  if (progTabs.length) {
    progTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const target = tab.dataset.panel;
        progTabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        progPanels.forEach(function (p) { p.hidden = true; });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const panel = document.getElementById('panel-' + target);
        if (panel) panel.hidden = false;
      });
    });
  }


});
