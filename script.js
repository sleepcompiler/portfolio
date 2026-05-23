// ─────────────────────────────────────────────
//  PORTFOLIO -- script.js
// ─────────────────────────────────────────────

(function () {
  'use strict';

  // ─── CURSOR (desktop only) ────────────────
  const isTouchDevice = 
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');

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

    // Hover effect on interactive elements (delegated to document for dynamic components)
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, .project-card, .fact-card, .tag, .btn-primary, .btn-ghost, .indicator-dot, .slider-btn, .modal-close');
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
      status: 'In progress',
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

  const openProjectModal = (projectId) => {
    const data = projectData[projectId];
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
  };

  const closeModal = () => {
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
          video.play().catch(() => {});
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

  // Click on project card to open modal
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Ignore clicks on links inside the card
      if (e.target.closest('a')) {
        return;
      }
      e.preventDefault();
      openProjectModal(card.id);
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

})();
