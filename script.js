// ─────────────────────────────────────────────
//  PORTFOLIO — script.js
// ─────────────────────────────────────────────

(function () {
  'use strict';

  // ─── CURSOR (desktop only) ────────────────
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (!isTouchDevice) {
    const cursor = document.getElementById('cursor');
    const trail  = document.getElementById('cursorTrail');

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Smooth trailing cursor
    (function animateTrail() {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      trail.style.left = trailX + 'px';
      trail.style.top  = trailY + 'px';
      requestAnimationFrame(animateTrail);
    })();

    // Hover effect on interactive elements
    const hoverTargets = 'a, button, .project-card, .fact-card, .tag, .btn-primary, .btn-ghost';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ─── NAV SCROLL ───────────────────────────
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ─── MOBILE MENU ──────────────────────────
  const navToggle  = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  const toggleMenu = () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const spans = navToggle.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  };

  navToggle.addEventListener('click', toggleMenu);

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      if (menuOpen) toggleMenu();
    });
  });

  // ─── REVEAL ON SCROLL ─────────────────────
  const revealEls = document.querySelectorAll('.reveal-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));

  // ─── PROJECT CARD GLOW ────────────────────
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  // ─── TICKER PAUSE ON HOVER ────────────────
  const ticker = document.querySelector('.ticker');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => {
      ticker.style.animationPlayState = 'paused';
    });
    ticker.addEventListener('mouseleave', () => {
      ticker.style.animationPlayState = 'running';
    });
  }

  // ─── SMOOTH SCROLL ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── HERO NAME STROKE ANIMATION ──────────
  // Subtle parallax on the orbs
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  if (orb1 && orb2) {
    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      orb1.style.transform = `translate(${dx * 20}px, ${dy * 20}px)`;
      orb2.style.transform = `translate(${dx * -15}px, ${dy * -15}px)`;
    });
  }

  // ─── STAGGERED REVEAL FOR CHILDREN ──────
  // Trigger initial reveals for elements already in view on load
  const initialCheck = () => {
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  };

  // Small delay to let CSS load
  setTimeout(initialCheck, 100);

  // ─── PAGE LOAD ANIMATION ─────────────────
  document.body.style.opacity = '0';
  window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity   = '1';
  });

  // ─── TOAST HELPER ────────────────────────
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // ─── EMAIL COPY + MAILTO ─────────────────
  // Intercept ALL mailto links: copy address to clipboard, then let the
  // browser try to open the mail client. Shows a toast either way so the
  // user always gets feedback even when no mail client is configured.
  const EMAIL = 'udayaditya@proton.me';

  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(EMAIL)
        .then(() => showToast('Email copied — ' + EMAIL))
        .catch(() => showToast('✉ ' + EMAIL));

      // Also attempt to open the mail client (works if one is configured)
      setTimeout(() => { window.location.href = 'mailto:' + EMAIL; }, 300);
    });
  });

  // ─── CONNECT CTA — magnetic effect ───────
  const connectCta = document.getElementById('connectCta');
  if (connectCta) {
    connectCta.addEventListener('mousemove', (e) => {
      const rect = connectCta.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      connectCta.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    connectCta.addEventListener('mouseleave', () => {
      connectCta.style.transform = '';
    });
  }

  // ─── ACTIVE NAV LINK HIGHLIGHT ───────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 200) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}`
        ? 'var(--text-primary)'
        : '';
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

})();
