// ─────────────────────────────────────────────
//  PORTFOLIO -- script.js
// ─────────────────────────────────────────────

(function () {
  'use strict';

  // Inject Pokéball dot style dynamically to bypass stylesheet caching
  const dotStyle = document.createElement('style');
  dotStyle.innerHTML = `
    .pokeball-dot {
      display: inline-block !important;
      width: 0.18em !important;
      height: 0.18em !important;
      border-radius: 50% !important;
      border: 0.03em solid var(--gray-600) !important;
      position: relative !important;
      vertical-align: baseline !important;
      margin-left: 0.06em !important;
      cursor: none !important;
      background: transparent !important;
      transition: transform 0.3s ease, border-color 0.3s ease !important;
    }
    .pokeball-dot:hover {
      transform: rotate(20deg) !important;
      border-color: var(--text-primary) !important;
    }
    .pokeball-dot::before {
      content: '' !important;
      position: absolute !important;
      top: 50% !important;
      left: 0 !important;
      width: 100% !important;
      height: 0.03em !important;
      background: var(--gray-600) !important;
      transform: translateY(-50%) !important;
      transition: background-color 0.3s ease !important;
    }
    .pokeball-dot:hover::before {
      background: var(--text-primary) !important;
    }
    .coming-soon-title em {
      color: transparent !important;
      -webkit-text-stroke: 1px var(--gray-500) !important;
      font-style: normal !important;
    }
  `;
  document.head.appendChild(dotStyle);

  // ─── CURSOR (desktop only) ────────────────
  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');

  if (isTouchDevice) {
    if (cursor) cursor.style.display = 'none';
    if (trail) trail.style.display = 'none';
    document.body.style.cursor = 'auto';

    // Also reset the nav toggle which has cursor: none in CSS
    const navToggle = document.getElementById('navToggle');
    if (navToggle) navToggle.style.cursor = 'auto';
  } else {
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    // Smooth trailing cursor
    (function animateTrail() {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      trail.style.left = trailX + 'px';
      trail.style.top = trailY + 'px';
      requestAnimationFrame(animateTrail);
    })();

    // Hover effect on interactive elements (delegated to document for dynamic components)
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, .project-card, .fact-card, .tag, .btn-primary, .btn-ghost, .indicator-dot, .slider-btn, .modal-close, .pokeball-dot');
      if (target) {
        document.body.classList.add('cursor-hover');
      } else {
        document.body.classList.remove('cursor-hover');
      }
    });
  }

  // ─── NAV SCROLL ───────────────────────────
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ─── MOBILE MENU ──────────────────────────
  const navToggle = document.getElementById('navToggle');
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

  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    navLogo.addEventListener('click', () => {
      if (menuOpen) toggleMenu();
    });
  }

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
    document.body.style.opacity = '1';
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
        .then(() => showToast('Email copied -- ' + EMAIL))
        .catch(() => showToast('✉ ' + EMAIL));

      // Also attempt to open the mail client (works if one is configured)
      setTimeout(() => { window.location.href = 'mailto:' + EMAIL; }, 300);
    });
  });

  // ─── CONNECT CTA -- magnetic effect ───────
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
  const navLinks = document.querySelectorAll('.nav-link');

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

  // ─── PROJECT DETAILS MODAL ────────────────
  const projectData = {
    'proj-cataclysm': {
      title: 'Cataclysm',
      number: '01',
      tags: ['Game Dev', 'TypeScript', 'Strategy', 'WebGL'],
      status: 'In progress',
      statusClass: 'status-wip',
      description: 'A turn-based hex strategy game with unique character mechanics -- traps, thresholds, and units that fight dirty. Built from scratch with custom rendering.',
      features: [
        'Custom rendering pipeline using HTML5 Canvas & WebGL.',
        'Unique tactical unit abilities including traps, displacement, and catnip usage.',
        'Interactive deckbuilder mode with card drawing limits and deck constraints.',
        'Server integration tracking player matches and an ELO rating leaderboard.'
      ],
      media: [
        { type: 'image', path: 'media/catnip/catnip1.png', caption: 'Tactical board layout showing hex grid and unit tokens.' },
        { type: 'video', path: 'media/catnip/catnip1.mp4', caption: 'Gameplay walkthrough and unit movement preview.' },
        { type: 'image', path: 'media/catnip/catnip2.png', caption: 'Cat Tree base defense and unit positioning.' },
        { type: 'video', path: 'media/catnip/catnip2.mp4', caption: 'Defeat / Victory game over screen display.' },
        { type: 'image', path: 'media/catnip/catnip3.png', caption: 'Card selection and unit detail overview.' }
      ],
      links: [
        { text: 'Live Demo', url: 'https://cataclysm-main.onrender.com' },
        { text: 'GitHub', url: 'https://github.com/sleepcompiler/cataclysm' }
      ]
    },
    'proj-plaiground': {
      title: 'Plaiground',
      number: '02',
      tags: ['AI', 'TypeScript', 'Web'],
      status: 'Live',
      statusClass: 'status-live',
      description: 'An AI playground for experimenting with language models, specifically making them play Pokemon FireRed on an emulator. Watching them make decisions is fascinating and offers insights into agentic workflows.',
      features: [
        'Direct interface with Game Boy Advance emulator inside browser runtime.',
        'Real-time OCR and RAM state reading to feed textual environment representations to LLM agents.',
        'Live logging panel visualizing prompt details, decision trees, and battle actions.',
        'Adjustable LLM hyperparameters and prompt injection control interface.'
      ],
      media: [
        { type: 'image', path: 'media/plaiground/plaiground1.png', caption: 'Agentic model decision log panel side-by-side with active emulator.' }
      ],
      links: [
        { text: 'GitHub', url: 'https://github.com/sleepcompiler/plaiground' }
      ]
    },
    'proj-clipmaster': {
      title: 'ClipMaster 95',
      number: '03',
      tags: ['Rust', 'Tauri', 'Desktop'],
      status: 'Live',
      statusClass: 'status-live',
      description: 'A retro-styled clipboard manager for power users. Global hotkeys, persistent history, and a UI that nods to the golden era of software aesthetics.',
      features: [
        'Ultra-fast desktop integration using Tauri and Rust backend.',
        'Authentic Windows 95 classic design theme with customizable widgets.',
        'Local SQLite database cache with rapid full-text search index.',
        'Global shortcut listener and automatic clipboard monitoring with minimal resource usage.'
      ],
      media: [
        { type: 'image', path: 'media/clipmaster/clipmaster1.png', caption: 'Classic dialog box layout with retro styled borders.' },
        { type: 'image', path: 'media/clipmaster/clipmaster2.png', caption: 'Clipboard history scrolling menu with instant copying.' },
        { type: 'image', path: 'media/clipmaster/clipmaster3.png', caption: 'Advanced theme customizer and retro font selectors.' },
        { type: 'image', path: 'media/clipmaster/clipmaster4.png', caption: 'Settings menu modal in the nostalgic OS styling.' },
        { type: 'image', path: 'media/clipmaster/clipmaster5.png', caption: 'Vintage interface controls, checkboxes, and buttons.' },
        { type: 'image', path: 'media/clipmaster/clipmaster6.png', caption: 'Vintage grid list showcasing copied text snippets.' }
      ],
      links: [
        { text: 'GitHub', url: 'https://github.com/sleepcompiler/clipmaster95' }
      ]
    },
    'proj-cinereview': {
      title: 'CineReview',
      number: '04',
      tags: ['Full Stack', 'Prisma', 'Node.js'],
      status: 'In progress',
      statusClass: 'status-wip',
      description: 'A movie tracking and review platform. Pulls from external APIs, persists data with Prisma, and serves up a clean, modern browsing experience.',
      features: [
        'Real-time movie details retrieval via Tmdb API wrapper integrations.',
        'Secure user authentication and relational database schema modeled with Prisma.',
        'Responsive layout for browsing popular, trending, and highly-rated movies.',
        'Custom review creation, tracking lists, and ratings logging.'
      ],
      media: [
        { type: 'image', path: 'media/cinerev/cinerev (1).png', caption: 'CineReview homepage displaying trending, popular, and top-rated movies.' },
        { type: 'image', path: 'media/cinerev/cinerev (2).png', caption: 'Detailed movie page featuring synopsis, ratings, and genre tags.' },
        { type: 'image', path: 'media/cinerev/cinerev (3).png', caption: 'Personalized user dashboard for tracking watchlist and reviews.' },
        { type: 'image', path: 'media/cinerev/cinerev (4).png', caption: 'Interactive movie search and advanced filters.' },
        { type: 'image', path: 'media/cinerev/cinerev (5).png', caption: 'User reviews and movie ratings discussion panel.' }
      ],
      links: [
        { text: 'Live Demo', url: 'https://cinerev.onrender.com/' },
        { text: 'GitHub', url: 'https://github.com/sleepcompiler/cinerev' }
      ]
    },
    'proj-p2psync': {
      title: 'P2P Sync',
      number: '05',
      tags: ['Rust', 'WebRTC', 'CRDTs'],
      status: 'Coming soon',
      statusClass: 'status-wip',
      description: 'A local-first synchronization library written in Rust. Leverages CRDTs for seamless conflict resolution, WebRTC for direct peer-to-peer data transfer, and encrypted SQLite for secure local storage in Tauri apps.',
      features: [
        'Local-first data management using Conflict-Free Replicated Data Types (CRDTs).',
        'Direct browser-to-browser and device-to-device communication using WebRTC.',
        'Tauri-ready storage layer relying on SQLCipher/SQLite encryption.',
        'Distributed replication mechanism bypassing centralized servers.'
      ],
      media: [], // Empty (will show "No screencaptures to show. Visit GitHub for project details.")
      links: [
        { text: 'GitHub', url: 'https://github.com/sleepcompiler/p2p-sync' }
      ]
    },
    'proj-archivist': {
      title: 'Archivist',
      number: '06',
      tags: ['Rust', 'Tauri', 'Wasm AI'],
      status: 'Coming soon',
      statusClass: 'status-wip',
      description: 'A local-first, semantic clipboard manager. Runs local WebAssembly sentence transformers to cluster, search, and categorize clippings into structured Markdown folders, with a 2D interactive canvas graph and PDF exports.',
      features: [
        'Offline sentence embeddings generated client-side using Transformers.js.',
        'Auto-categorization of clipboard contents into specific folders based on cosine similarity.',
        'Interactive 2D physics graph layout displaying semantic relationships.',
        'One-click clean PDF document exports.'
      ],
      media: [],
      links: [
        { text: 'GitHub', url: 'https://github.com/sleepcompiler/archivist' }
      ]
    },
    'proj-wiki': {
      title: 'Wiki Engine',
      number: '07',
      tags: ['React', 'Node.js', 'Full Stack'],
      status: 'Coming soon',
      statusClass: 'status-wip',
      description: 'A lightweight, clean local wiki and knowledge base engine for developers. Features lightning fast full-text searching, markdown parsing, visual category browsing, and instant page linking.',
      features: [
        'Dynamic markdown parsing and local link resolution.',
        'Interactive Category Browser grid view.',
        'Fast local indexing for full-text search.',
        'Zero-configuration database storage.'
      ],
      media: [],
      links: [
        { text: 'GitHub', url: 'https://github.com/sleepcompiler/wiki' }
      ]
    }
  };

  const modal = document.getElementById('projectModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');
  const slidesTrack = document.getElementById('modalSlidesTrack');
  const sliderPrev = document.getElementById('sliderPrev');
  const sliderNext = document.getElementById('sliderNext');
  const sliderIndicators = document.getElementById('sliderIndicators');
  const modalNum = document.getElementById('modalProjectNum');
  const modalTitle = document.getElementById('modalProjectTitle');
  const modalTags = document.getElementById('modalProjectTags');
  const modalDesc = document.getElementById('modalProjectDesc');
  const modalFeatures = document.getElementById('modalProjectFeatures');
  const modalStatus = document.getElementById('modalProjectStatus');
  const modalLinks = document.getElementById('modalProjectLinks');

  let currentSlideIndex = 0;
  let activeMedia = [];
  let previousActiveElement = null;

  const openProjectModal = (projectId) => {
    const data = projectData[projectId];
    previousActiveElement = document.activeElement;
    if (!data) return;

    activeMedia = data.media || [];
    currentSlideIndex = 0;

    // Populate text content
    modalNum.textContent = data.number;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;
    modalStatus.textContent = data.status;
    modalStatus.className = 'project-status ' + data.statusClass;

    // Populate tags
    modalTags.innerHTML = '';
    data.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'ptag';
      span.textContent = tag;
      modalTags.appendChild(span);
    });

    // Populate key features
    modalFeatures.innerHTML = '';
    data.features.forEach(feat => {
      const li = document.createElement('li');
      li.textContent = feat;
      modalFeatures.appendChild(li);
    });

    // Populate links
    modalLinks.innerHTML = '';
    data.links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.className = 'project-link-text';
      a.textContent = link.text + ' ↗';
      modalLinks.appendChild(a);
    });

    // Populate slides and dots
    slidesTrack.innerHTML = '';
    sliderIndicators.innerHTML = '';

    if (activeMedia.length === 0) {
      // Show custom placeholder
      const slide = document.createElement('div');
      slide.className = 'modal-slide';

      const placeholder = document.createElement('div');
      placeholder.className = 'modal-placeholder';

      // Inline SVG screen icon
      placeholder.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      `;

      const p = document.createElement('p');
      if (projectId === 'proj-p2psync') {
        p.textContent = 'No screencaptures to show. Visit GitHub for project details.';
      } else {
        p.textContent = 'No screenshots available yet. Visit GitHub or Live Demo for project details.';
      }
      placeholder.appendChild(p);
      slide.appendChild(placeholder);
      slidesTrack.appendChild(slide);

      sliderPrev.classList.add('hidden');
      sliderNext.classList.add('hidden');
    } else {
      // Populate images and videos
      activeMedia.forEach((media, idx) => {
        const slide = document.createElement('div');
        slide.className = 'modal-slide';

        if (media.type === 'video') {
          const video = document.createElement('video');
          video.src = media.path;
          video.controls = true;
          video.loop = true;
          video.muted = true;
          video.playsInline = true;
          video.autoplay = false;
          slide.appendChild(video);
        } else {
          const img = document.createElement('img');
          img.src = media.path;
          img.alt = media.caption;
          img.loading = 'lazy';
          slide.appendChild(img);
        }
        slidesTrack.appendChild(slide);

        // Dot indicators
        const dot = document.createElement('button');
        dot.className = 'indicator-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
        dot.addEventListener('click', () => {
          goToSlide(idx);
        });
        sliderIndicators.appendChild(dot);
      });

      // Show navigation if multiple items
      if (activeMedia.length > 1) {
        sliderPrev.classList.remove('hidden');
        sliderNext.classList.remove('hidden');
      } else {
        sliderPrev.classList.add('hidden');
        sliderNext.classList.add('hidden');
      }
    }

    // Reset slide position
    updateSlider();

    // Show modal
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Focus the close button for accessibility
    if (closeBtn) {
      closeBtn.focus();
    }
  };

  const closeModal = () => {
    // Return focus to the trigger element to prevent focus lock/warnings
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    } else if (modal.contains(document.activeElement)) {
      document.activeElement.blur();
    }

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    // Pause all playing videos
    const videos = slidesTrack.querySelectorAll('video');
    videos.forEach(video => {
      video.pause();
    });
  };

  const updateSlider = () => {
    if (activeMedia.length === 0) return;

    // Slide transition
    slidesTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    // Update dots
    const dots = sliderIndicators.querySelectorAll('.indicator-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlideIndex);
    });

    // Control video playback on slide transition
    const slides = slidesTrack.querySelectorAll('.modal-slide');

    slides.forEach((slide, idx) => {
      const video = slide.querySelector('video');
      if (video) {
        if (idx === currentSlideIndex) {
          // Play current video (with fallback if browser blocks it)
          video.play().catch(() => { });
        } else {
          // Pause other videos
          video.pause();
        }
      }
    });
  };

  const goToSlide = (index) => {
    if (activeMedia.length === 0) return;
    currentSlideIndex = index;
    updateSlider();
  };

  const nextSlide = () => {
    if (activeMedia.length <= 1) return;
    currentSlideIndex = (currentSlideIndex + 1) % activeMedia.length;
    updateSlider();
  };

  const prevSlide = () => {
    if (activeMedia.length <= 1) return;
    currentSlideIndex = (currentSlideIndex - 1 + activeMedia.length) % activeMedia.length;
    updateSlider();
  };

  // Close handlers
  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  // Slider navigation clicks
  sliderPrev.addEventListener('click', prevSlide);
  sliderNext.addEventListener('click', nextSlide);

  // Click/KeyPress on project card to open modal
  document.querySelectorAll('.project-card').forEach(card => {
    const handleActivation = (e) => {
      // Ignore clicks/keypresses on links inside the card
      if (e.target.closest('a')) {
        return;
      }
      e.preventDefault();
      openProjectModal(card.id);
    };

    card.addEventListener('click', handleActivation);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleActivation(e);
      }
    });
  });

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });

  // Usage:
  //   dex()

  let dexDatabase = null;
  let dexHeaders = [];

  async function preloadPokedex() {
    let csvText = "";
    const paths = ['./dexfull.csv', '../dexfull.csv', '/dexfull.csv'];
    for (const path of paths) {
      try {
        const res = await fetch(path);
        if (res.ok) {
          csvText = await res.text();
          break;
        }
      } catch (_) { }
    }

    if (!csvText) return;

    const lines = csvText.split('\n');
    dexHeaders = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

    const idIdx = dexHeaders.indexOf("Pokemon Id");
    const numIdx = dexHeaders.indexOf("Pokedex Number");
    const nameIdx = dexHeaders.indexOf("Pokemon Name");
    const classIdx = dexHeaders.indexOf("Classification");
    const preEvoIdx = dexHeaders.indexOf("Pre-Evolution Pokemon Id");
    const type1Idx = dexHeaders.indexOf("Primary Type");
    const type2Idx = dexHeaders.indexOf("Secondary Type");
    const hpIdx = dexHeaders.indexOf("Health Stat");
    const atkIdx = dexHeaders.indexOf("Attack Stat");
    const defIdx = dexHeaders.indexOf("Defense Stat");
    const spatkIdx = dexHeaders.indexOf("Special Attack Stat");
    const spdefIdx = dexHeaders.indexOf("Special Defense Stat");
    const speedIdx = dexHeaders.indexOf("Speed Stat");
    const totalIdx = dexHeaders.indexOf("Base Stat Total");
    const heightIdx = dexHeaders.indexOf("Pokemon Height");
    const weightIdx = dexHeaders.indexOf("Pokemon Weight");
    const abilityIdx = dexHeaders.indexOf("Primary Ability");

    if (nameIdx === -1 || preEvoIdx === -1) return;

    dexDatabase = [];
    const parentIds = new Set();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const row = [];
      let insideQuote = false;
      let entry = "";
      for (let c = 0; c < line.length; c++) {
        const ch = line[c];
        if (ch === '"') {
          insideQuote = !insideQuote;
        } else if (ch === ',' && !insideQuote) {
          row.push(entry.trim());
          entry = "";
        } else {
          entry += ch;
        }
      }
      row.push(entry.trim());

      if (row.length <= nameIdx) continue;

      const pokemonId = row[idIdx]?.replace(/^["']|["']$/g, '').trim();
      const preEvoId = row[preEvoIdx]?.replace(/^["']|["']$/g, '').trim();

      if (preEvoId && preEvoId !== 'NULL') {
        parentIds.add(preEvoId);
      }

      dexDatabase.push({
        id: pokemonId,
        pokedexNum: row[numIdx]?.replace(/^["']|["']$/g, '').trim(),
        name: row[nameIdx]?.replace(/^["']|["']$/g, '').trim(),
        class: row[classIdx]?.replace(/^["']|["']$/g, '').trim(),
        preEvoId: preEvoId,
        type1: row[type1Idx]?.replace(/^["']|["']$/g, '').trim(),
        type2: row[type2Idx]?.replace(/^["']|["']$/g, '').trim(),
        hp: parseInt(row[hpIdx]) || 0,
        atk: parseInt(row[atkIdx]) || 0,
        def: parseInt(row[defIdx]) || 0,
        spatk: parseInt(row[spatkIdx]) || 0,
        spdef: parseInt(row[spdefIdx]) || 0,
        speed: parseInt(row[speedIdx]) || 0,
        total: parseInt(row[totalIdx]) || 0,
        height: row[heightIdx]?.replace(/^["']|["']$/g, '').trim(),
        weight: row[weightIdx]?.replace(/^["']|["']$/g, '').trim(),
        ability: row[abilityIdx]?.replace(/^["']|["']$/g, '').trim(),
        rawRow: row
      });
    }

    dexDatabase.forEach(p => {
      if (!p.preEvoId || p.preEvoId === 'NULL') {
        p.stage = 1;
      } else if (parentIds.has(p.id)) {
        p.stage = 2;
      } else {
        p.stage = 3;
      }
    });
  }

  let dexWidget = null;
  let dexScreen = null;
  let dexSearchInput = null;

  function initDexWidget() {
    if (dexWidget) return;

    // Inject styles dynamically to guarantee rendering and bypass browser caching
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      .cursor {
        z-index: 999999999 !important;
        mix-blend-mode: normal !important;
      }
      .cursor-trail {
        z-index: 999999998 !important;
        mix-blend-mode: normal !important;
      }
      .dex-chat-widget {
        position: fixed !important;
        bottom: 0 !important;
        right: 40px !important;
        width: 330px !important;
        height: 40px !important;
        background: #dc0a2d !important;
        border: 2px solid #222 !important;
        border-bottom: none !important;
        border-radius: 8px 8px 0 0 !important;
        display: flex !important;
        flex-direction: column !important;
        z-index: 99999 !important;
        font-family: 'DM Mono', monospace !important;
        color: #fff !important;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.55) !important;
        transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        transform: translateY(110%) !important;
        overflow: hidden !important;
      }
      .dex-chat-widget, .dex-chat-widget * {
        box-sizing: border-box !important;
        cursor: none !important;
      }
      .dex-chat-widget.active {
        transform: translateY(0) !important;
      }
      .dex-chat-widget.expanded {
        height: 480px !important;
      }
      .dex-chat-header {
        height: 40px !important;
        min-height: 40px !important;
        background: #b00820 !important;
        border-bottom: 2px solid #222 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 0 12px !important;
        user-select: none !important;
      }
      .dex-header-lights {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
      }
      .dex-sensor-blue {
        width: 18px !important;
        height: 18px !important;
        border-radius: 50% !important;
        background: radial-gradient(circle, #85e0ff 0%, #00a2e8 70%, #005f87 100%) !important;
        border: 1.5px solid #fff !important;
        box-shadow: 0 0 6px #00a2e8 !important;
        animation: sensor-pulse 2s infinite !important;
      }
      @keyframes sensor-pulse {
        0%, 100% { box-shadow: 0 0 4px #00a2e8 !important; }
        50% { box-shadow: 0 0 10px #85e0ff !important; }
      }
      .dex-mini-led {
        width: 6px !important;
        height: 6px !important;
        border-radius: 50% !important;
        border: 0.5px solid #222 !important;
      }
      .dex-mini-led.red { background: #ea4335 !important; }
      .dex-mini-led.yellow { background: #fbbc05 !important; }
      .dex-mini-led.green { background: #34a853 !important; }
      .dex-chat-title {
        font-size: 0.8rem !important;
        font-weight: bold !important;
        letter-spacing: 0.05em !important;
        margin-left: 6px !important;
        flex: 1 !important;
        color: #fff !important;
      }
      .dex-chat-toggle-btn {
        background: none !important;
        border: none !important;
        color: #fff !important;
        font-size: 1rem !important;
        opacity: 0.8 !important;
        transition: opacity 0.2s !important;
        padding: 4px !important;
      }
      .dex-chat-toggle-btn:hover {
        opacity: 1 !important;
      }
      .dex-chat-body {
        flex: 1 !important;
        background: #3e3e3e !important;
        padding: 10px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
        overflow: hidden !important;
      }
      .dex-screen {
        flex: 1 !important;
        background: #15181a !important;
        border: 4px solid #282828 !important;
        border-radius: 6px !important;
        display: flex !important;
        flex-direction: column !important;
        padding: 10px !important;
        overflow-y: auto !important;
        color: #a3ffac !important;
        font-size: 0.78rem !important;
        line-height: 1.5 !important;
      }
      .dex-screen::-webkit-scrollbar {
        width: 4px !important;
      }
      .dex-screen::-webkit-scrollbar-track {
        background: transparent !important;
      }
      .dex-screen::-webkit-scrollbar-thumb {
        background: #a3ffac !important;
        border-radius: 2px !important;
      }
      .dex-search-container {
        display: flex !important;
        align-items: center !important;
        background: #25282a !important;
        border: 2px solid #555 !important;
        border-radius: 4px !important;
        padding: 4px 8px !important;
      }
      .dex-chat-widget input.dex-search-input {
        flex: 1 !important;
        background: transparent !important;
        border: none !important;
        outline: none !important;
        color: #fff !important;
        font-family: inherit !important;
        font-size: 0.8rem !important;
        width: 100% !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .dex-search-input::placeholder {
        color: #777 !important;
      }
      .dex-badge {
        display: inline-block !important;
        padding: 2px 6px !important;
        border-radius: 3px !important;
        font-size: 0.62rem !important;
        font-weight: bold !important;
        text-transform: uppercase !important;
        color: #fff !important;
        margin-right: 4px !important;
      }
      .type-fire { background: #ff9d55 !important; }
      .type-water { background: #5090d6 !important; }
      .type-grass { background: #63bc5a !important; }
      .type-poison { background: #a040a0 !important; }
      .type-normal { background: #9099a1 !important; }
      .type-electric { background: #f4d23c !important; color: #111 !important; }
      .type-ice { background: #73cec0 !important; }
      .type-fighting { background: #ce4069 !important; }
      .type-ground { background: #d97746 !important; }
      .type-flying { background: #8fa8dd !important; }
      .type-psychic { background: #fa7179 !important; }
      .type-bug { background: #91c12f !important; }
      .type-rock { background: #c5b78c !important; }
      .type-ghost { background: #5269ac !important; }
      .type-dragon { background: #0b6dc3 !important; }
      .type-dark { background: #5a5366 !important; }
      .type-steel { background: #5a8ea1 !important; }
      .type-fairy { background: #ec8fe6 !important; }
      .dex-screen-stat-row {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        margin-top: 4px !important;
      }
      .dex-screen-stat-label {
        width: 60px !important;
        color: #8cd993 !important;
      }
      .dex-screen-stat-bar {
        flex: 1 !important;
        height: 6px !important;
        background: rgba(163, 255, 172, 0.1) !important;
        border-radius: 3px !important;
        overflow: hidden !important;
      }
      .dex-screen-stat-fill {
        height: 100% !important;
        background: #a3ffac !important;
        border-radius: 3px !important;
      }
      .dex-screen-stat-val {
        width: 28px !important;
        text-align: right !important;
        font-weight: bold !important;
      }
      .dex-list-item {
        padding: 6px !important;
        border-bottom: 1px solid rgba(163, 255, 172, 0.1) !important;
        transition: background 0.2s, color 0.2s !important;
      }
      .dex-list-item:hover {
        background: rgba(163, 255, 172, 0.15) !important;
        color: #fff !important;
      }
    `;
    document.head.appendChild(styleEl);

    dexWidget = document.createElement('div');
    dexWidget.className = 'dex-chat-widget';
    dexWidget.innerHTML = `
      <div class="dex-chat-header">
        <div class="dex-header-lights">
          <div class="dex-sensor-blue"></div>
          <div class="dex-mini-led red"></div>
          <div class="dex-mini-led yellow"></div>
          <div class="dex-mini-led green"></div>
          <span class="dex-chat-title">Pokédex</span>
        </div>
        <button class="dex-chat-toggle-btn" title="Toggle Pokédex">▲</button>
      </div>
      <div class="dex-chat-body">
        <div class="dex-search-container">
          <input type="text" class="dex-search-input" placeholder="Search Pokémon..." autocomplete="off" spellcheck="false" />
        </div>
        <div class="dex-screen"></div>
      </div>
    `;

    document.body.appendChild(dexWidget);
    dexScreen = dexWidget.querySelector('.dex-screen');
    dexSearchInput = dexWidget.querySelector('.dex-search-input');

    const header = dexWidget.querySelector('.dex-chat-header');
    header.addEventListener('click', toggleDexWidget);

    dexWidget.querySelector('.dex-chat-body').addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dexWidget.classList.contains('expanded')) {
        minimizeDexWidget();
      }
    });

    dexSearchInput.addEventListener('input', () => {
      handleDexSearch(dexSearchInput.value.trim().toLowerCase());
    });

    showWelcomeScreen();
  }

  function toggleDexWidget() {
    if (dexWidget.classList.contains('expanded')) {
      minimizeDexWidget();
    } else {
      expandDexWidget();
    }
  }

  function activateDexWidget() {
    initDexWidget();
    setTimeout(() => {
      if (dexWidget) {
        dexWidget.classList.add('active');
      }
    }, 50);
  }

  function expandDexWidget() {
    initDexWidget();
    dexWidget.classList.add('active');
    dexWidget.classList.add('expanded');
    dexWidget.querySelector('.dex-chat-toggle-btn').innerText = '▼';
    setTimeout(() => {
      if (dexSearchInput) dexSearchInput.focus();
    }, 100);
  }

  function minimizeDexWidget() {
    if (dexWidget) {
      dexWidget.classList.remove('expanded');
      dexWidget.querySelector('.dex-chat-toggle-btn').innerText = '▲';
      if (dexSearchInput) dexSearchInput.blur();
    }
  }

  function showWelcomeScreen() {
    if (!dexScreen) return;
    dexScreen.innerHTML = `
      <div style="text-align: center; margin-top: 20px;">
        <span style="font-size: 1.8rem; display: block; margin-bottom: 10px;"></span>
        <div style="font-weight: bold; font-size: 0.85rem; margin-bottom: 12px; color: #fff;">congratulations. you have discovered the hidden pokedex.</div>
        <p style="color: #8cd993; font-size: 0.72rem; line-height: 1.4; padding: 0 10px;">
          Type a name, number, or stats query below. <br/><br/>
          Try: <br/>
          • <span style="color: #fff; text-decoration: underline; cursor: pointer;" class="sample-search">snorlax</span><br/>
          • <span style="color: #fff; text-decoration: underline; cursor: pointer;" class="sample-search">snorlax info</span><br/>
          • <span style="color: #fff; text-decoration: underline; cursor: pointer;" class="sample-search">snorlax stats</span><br/>
          • <span style="color: #fff; text-decoration: underline; cursor: pointer;" class="sample-search">name 8 stage 1</span><br/>
          • <span style="color: #fff; text-decoration: underline; cursor: pointer;" class="sample-search">8 4 i</span>
        </p>
      </div>
    `;

    // Bind sample clicks
    dexScreen.querySelectorAll('.sample-search').forEach(span => {
      span.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dexSearchInput) {
          dexSearchInput.value = span.innerText;
          handleDexSearch(span.innerText.trim().toLowerCase());
        }
      });
    });
  }

  function findPokemon(term) {
    if (!term) return null;
    // 1. Try exact name match
    let match = dexDatabase.find(item => item.name.toLowerCase() === term);
    if (match) return match;

    // 2. Try exact Pokedex number match
    match = dexDatabase.find(item => item.pokedexNum === term);
    if (match) return match;

    // 3. Fallback to database ID match
    match = dexDatabase.find(item => item.id === term);
    return match;
  }

  function handleDexSearch(query) {
    if (!query) {
      showWelcomeScreen();
      return;
    }

    // Case A: Brute force solver (e.g. "8 4 i")
    const bruteRegex = /^(\d+)\s+(\d+)\s+([a-zA-Z])$/;
    const bruteMatch = query.match(bruteRegex);
    if (bruteMatch) {
      const minLen = parseInt(bruteMatch[1]);
      const pos = parseInt(bruteMatch[2]);
      const charVal = bruteMatch[3].toUpperCase();
      const matched = dexDatabase.filter(p =>
        p.preEvoId && p.preEvoId !== 'NULL' &&
        p.name.length === minLen &&
        p.name.length >= pos &&
        p.name[pos - 1].toUpperCase() === charVal
      );

      let html = `<div style="font-weight: bold; color: #fff; margin-bottom: 6px;">Brute Force (${minLen} L, ${pos} @ ${charVal}):</div>`;
      if (matched.length > 0) {
        matched.forEach(m => {
          html += `<div class="dex-list-item" data-id="${m.id}">${m.name}</div>`;
        });
      } else {
        html += `<div style="color: #ff8585;">No evolved matches.</div>`;
      }
      dexScreen.innerHTML = html;
      bindListItemClicks();
      return;
    }

    // Case B: Search name/stage lists (e.g. "name 8 stage 1")
    const stageRegex = /^name\s+(\d+)\s+stage\s+(\d+)$/;
    const stageMatch = query.match(stageRegex);
    if (stageMatch) {
      const len = parseInt(stageMatch[1]);
      const stageVal = parseInt(stageMatch[2]);
      const matched = dexDatabase.filter(p => p.name.length === len && p.stage === stageVal);

      let html = `<div style="font-weight: bold; color: #fff; margin-bottom: 6px;">Stage ${stageVal} (${len} letters):</div>`;
      if (matched.length > 0) {
        matched.forEach(m => {
          html += `<div class="dex-list-item" data-id="${m.id}">${m.name}</div>`;
        });
      } else {
        html += `<div style="color: #ff8585;">No matches.</div>`;
      }
      dexScreen.innerHTML = html;
      bindListItemClicks();
      return;
    }

    // Case C: Stats bar chart (e.g. "snorlax stats")
    const statsRegex = /^(.*?)\s+stats$/;
    const statsMatch = query.match(statsRegex);
    if (statsMatch) {
      const term = statsMatch[1].trim();
      const p = findPokemon(term);
      if (p) {
        dexScreen.innerHTML = renderStatsHTML(p);
      } else {
        dexScreen.innerHTML = `<div style="color: #ff8585;">Pokémon "${term}" not found.</div>`;
      }
      return;
    }

    // Case D: Full info (e.g. "snorlax info")
    const infoRegex = /^(.*?)\s+info$/;
    const infoMatch = query.match(infoRegex);
    if (infoMatch) {
      const term = infoMatch[1].trim();
      const p = findPokemon(term);
      if (p) {
        dexScreen.innerHTML = renderInfoHTML(p) + renderFullTableHTML(p);
      } else {
        dexScreen.innerHTML = `<div style="color: #ff8585;">Pokémon "${term}" not found.</div>`;
      }
      return;
    }

    // Case E: Direct search/ID lookup (e.g. "361" or "snorlax")
    const p = findPokemon(query);
    if (p) {
      dexScreen.innerHTML = renderInfoHTML(p) + renderStatsHTML(p);
      return;
    }

    // Case F: Partial matches fallback
    const matches = dexDatabase.filter(item => item.name.toLowerCase().includes(query));
    if (matches.length > 0) {
      let html = `<div style="font-weight: bold; color: #fff; margin-bottom: 6px;">Matches (${matches.length}):</div>`;
      matches.forEach(m => {
        html += `<div class="dex-list-item" data-id="${m.id}">#${m.pokedexNum} - ${m.name}</div>`;
      });
      dexScreen.innerHTML = html;
      bindListItemClicks();
    } else {
      dexScreen.innerHTML = `<div style="color: #ff8585;">No matching Pokémon found.</div>`;
    }
  }

  function bindListItemClicks() {
    const items = dexScreen.querySelectorAll('.dex-list-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        const p = dexDatabase.find(x => x.id === id);
        if (p) {
          dexSearchInput.value = p.name;
          handleDexSearch(p.name.toLowerCase());
        }
      });
    });
  }

  function renderStatsHTML(p) {
    const stats = [
      { label: "HP", val: p.hp, max: 250 },
      { label: "Attack", val: p.atk, max: 190 },
      { label: "Defense", val: p.def, max: 230 },
      { label: "Sp. Atk", val: p.spatk, max: 194 },
      { label: "Sp. Def", val: p.spdef, max: 230 },
      { label: "Speed", val: p.speed, max: 180 }
    ];

    let html = `<div style="font-weight: bold; margin-bottom: 8px; color: #fff; border-bottom: 1px solid rgba(163, 255, 172, 0.2); padding-bottom: 4px;">📊 Stats (Total: ${p.total})</div>`;
    stats.forEach(s => {
      const pct = Math.min(100, Math.round((s.val / s.max) * 100));
      html += `
        <div class="dex-screen-stat-row">
          <div class="dex-screen-stat-label">${s.label}</div>
          <div class="dex-screen-stat-bar">
            <div class="dex-screen-stat-fill" style="width: ${pct}%;"></div>
          </div>
          <div class="dex-screen-stat-val">${s.val}</div>
        </div>
      `;
    });
    return html;
  }

  function renderInfoHTML(p) {
    const typeBadge = (type) => {
      if (!type || type === 'NULL') return '';
      return `<span class="dex-badge type-${type.toLowerCase()}">${type}</span>`;
    };
    return `
      <div style="font-weight: bold; color: #fff; font-size: 0.95rem; margin-bottom: 2px;">#${p.pokedexNum} - ${p.name}</div>
      <div style="font-style: italic; color: #8cd993; margin-bottom: 6px;">${p.class || 'Unknown Pokémon'}</div>
      <div style="margin-bottom: 8px;">
        ${typeBadge(p.type1)} ${typeBadge(p.type2)}
      </div>
      <div style="margin-bottom: 10px; font-size: 0.72rem; line-height: 1.4; color: #e2ffe5;">
        <strong>Ht/Wt:</strong> ${p.height}m / ${p.weight}kg<br/>
        <strong>Ability:</strong> ${p.ability}<br/>
        <strong>Stage:</strong> Stage ${p.stage}
      </div>
    `;
  }

  function renderFullTableHTML(p) {
    let html = `<table style="width:100%; border-collapse:collapse; font-size:0.7rem; margin-top:8px; border-top: 1px dashed rgba(163, 255, 172, 0.2);">`;
    dexHeaders.forEach((h, idx) => {
      if (p.rawRow[idx] && p.rawRow[idx] !== 'NULL') {
        html += `<tr>
          <td style="color:#8cd993; padding:4px 0; font-weight:bold; width:110px;">${h}</td>
          <td style="color:#fff; padding:4px 0;">${p.rawRow[idx]}</td>
        </tr>`;
      }
    });
    html += `</table>`;
    return html;
  }

  Object.defineProperty(window, 'dex', {
    get: function () {
      if (!dexDatabase) {
        console.error("❌ Error: Pokédex database is preloading, or dexfull.csv was not found in server root.");
        return "Not loaded";
      }

      activateDexWidget();
      return "SYSTEM.DEX widget activated (sliding up from bottom).";
    },
    configurable: true
  });

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloadPokedex().then(() => {
        const dot = document.getElementById('pokedexUnlockDot');
        if (dot) {
          dot.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            activateDexWidget();
          });
        }
      });
    }, 600);
  });

  // ─── SKILL TOOLTIPS ────────────────────────
  const skillDescriptions = {
    'rust': 'A systems programming language focused on safety, speed, and concurrency.',
    'typescript': 'A strongly typed superset of JavaScript that compiles to plain, readable JavaScript.',
    'python': 'An interpreted, high-level language known for dynamic semantics and rapid development.',
    'c++': 'A high-performance compiled language with hardware level control and object-oriented structure.',
    'javascript': 'A lightweight, interpreted programming language with first-class functions for the web.',
    'sql': 'Structured Query Language: standard programming language for managing relational databases.',
    'tauri': 'A framework for building tiny, blazing fast, secure desktop applications using web frontends.',
    'react': 'A component-based declarative library for building interactive user interfaces.',
    'sveltekit': 'A high-performance framework for building web applications with Svelte.',
    'bun': 'A fast all-in-one JavaScript runtime, bundler, test runner, and package manager.',
    'node.js': 'A cross-platform JavaScript runtime environment built on Chrome\'s V8 engine.',
    'prisma': 'A next-generation Node.js and TypeScript ORM for clean, type-safe database queries.',
    'webrtc': 'Real-Time Communication protocol enabling direct peer-to-peer audio/video streaming and data channels.',
    'sqlite': 'A lightweight, zero-configuration database engine running completely locally.',
    'game dev': 'Designing and building interactive game loops, physics simulations, and graphics rendering.',
    'systems programming': 'Developing low-level software architectures, compilers, memory management, and device drivers.',
    'ai / ml': 'Developing agentic models, natural language interfaces, custom embeddings, and neural nets.',
    'p2p / networking': 'Decentralized peer-to-peer synchronization, transport layer protocols, and routing systems.'
  };

  const initSkillTooltips = () => {
    const tooltip = document.createElement('div');
    tooltip.className = 'skill-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tooltip);

    const tags = document.querySelectorAll('.skills-wrap .tag');
    tags.forEach(tag => {
      const text = tag.textContent.trim().toLowerCase();
      const desc = skillDescriptions[text];
      if (!desc) return;

      tag.addEventListener('mouseenter', () => {
        tooltip.textContent = desc;
        tooltip.classList.add('visible');
        tooltip.setAttribute('aria-hidden', 'false');
        
        // Position
        const rect = tag.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 8}px`;
      });

      tag.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
        tooltip.setAttribute('aria-hidden', 'true');
      });
    });
  };

  // Run on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkillTooltips);
  } else {
    initSkillTooltips();
  }

  console.log("💡 Tip: Try running `dex` in this console to unlock the hidden Pokédex tool!");

})();
