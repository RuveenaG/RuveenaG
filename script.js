/**
 * RUVEENA GAMAGE — Portfolio Animations & Interactivity Engine
 * Obsidian / Emerald / Gold Editorial Experience
 */

(function () {
  'use strict';

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     0. PRELOADER INTRO SEQUENCE
     ========================================================= */
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloaderBar');
  const preloaderCount = document.getElementById('preloaderCount');

  let loadProgress = 0;
  let isWindowLoaded = false;

  window.addEventListener('load', () => {
    isWindowLoaded = true;
  });

  const finishPreloader = () => {
    if (!preloader) return;
    preloader.classList.add('is-loaded');
    document.body.classList.remove('is-loading');

    // Trigger hero character reveal and role rotator right after loader lifts
    setTimeout(() => {
      initHeroSplit();
      initHeroRoleRotator();
    }, 200);
  };

  if (preloader && preloaderBar && preloaderCount) {
    if (isReducedMotion) {
      finishPreloader();
    } else {
      const updatePreloader = () => {
        const increment = isWindowLoaded ? Math.random() * 6 + 3.5 : Math.random() * 2.5 + 1.2;
        loadProgress = Math.min(100, loadProgress + increment);

        preloaderBar.style.width = `${loadProgress}%`;
        preloaderCount.textContent = `${Math.floor(loadProgress)}%`;

        if (loadProgress < 100) {
          requestAnimationFrame(updatePreloader);
        } else {
          setTimeout(finishPreloader, 300);
        }
      };
      requestAnimationFrame(updatePreloader);
    }
  } else {
    document.body.classList.remove('is-loading');
    initHeroSplit();
    initHeroRoleRotator();
  }

  /* =========================================================
     1. HERO HEADLINE CHARACTER REVEAL
     ========================================================= */
  function initHeroSplit() {
    document.querySelectorAll('[data-split]').forEach((el) => {
      if (el.dataset.hasSplit) return;
      el.dataset.hasSplit = 'true';
      const text = el.textContent.trim();
      el.textContent = '';
      let delay = 0;
      text.split(' ').forEach((word, wordIndex, words) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        [...word].forEach((ch) => {
          const span = document.createElement('span');
          span.className = 'char';
          span.style.animationDelay = `${0.2 + delay}s`;
          span.textContent = ch;
          wordSpan.appendChild(span);
          delay += 0.032;
        });
        el.appendChild(wordSpan);
        if (wordIndex < words.length - 1) {
          el.appendChild(document.createTextNode(' '));
        }
      });
    });
  }

  /* =========================================================
     2. DYNAMIC HERO ROLE TYPEWRITER / ROTATOR
     ========================================================= */
  function initHeroRoleRotator() {
    const roleEl = document.getElementById('roleRotator');
    if (!roleEl || roleEl.dataset.hasInit) return;
    roleEl.dataset.hasInit = 'true';

    let roles = [];
    try {
      roles = JSON.parse(roleEl.getAttribute('data-roles') || '[]');
    } catch (e) {
      roles = ["Aspiring Project Manager — leading teams to delivery"];
    }

    if (roles.length > 0 && !isReducedMotion) {
      let roleIdx = 0;
      let charIdx = 0;
      let isDeleting = false;
      roleEl.textContent = '';

      const typeLoop = () => {
        const currentRole = roles[roleIdx];
        if (isDeleting) {
          charIdx--;
          roleEl.textContent = currentRole.substring(0, charIdx);
        } else {
          charIdx++;
          roleEl.textContent = currentRole.substring(0, charIdx);
        }

        let speed = isDeleting ? 28 : 60;

        if (!isDeleting && charIdx === currentRole.length) {
          speed = 2200; // Pause at end of text
          isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          speed = 450; // Pause before typing next role
        }

        setTimeout(typeLoop, speed);
      };

      // Start role typing
      setTimeout(typeLoop, 800);
    }
  }

  /* =========================================================
     3. AMBIENT BACKGROUND PARTICLE & GLOW CANVAS
     ========================================================= */
  const canvas = document.getElementById('bgCanvas');
  if (canvas && !isReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 24000), 45);

    const mouse = { x: -1000, y: -1000, active: false };

    class Particle {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.size = Math.random() * 2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -(Math.random() * 0.45 + 0.15);
        this.color = Math.random() > 0.4 ? 'rgba(201, 164, 65, ' : 'rgba(44, 122, 87, ';
        this.alpha = Math.random() * 0.5 + 0.2;
        this.maxAlpha = this.alpha;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Subtle mouse repulsion
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            this.x += (dx / dist) * force * 1.5;
            this.y += (dy / dist) * force * 1.5;
          }
        }

        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset(false);
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color.includes('201') ? 'rgba(201, 164, 65, 0.4)' : 'rgba(44, 122, 87, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();

    let animationFrameId;
    let isTabVisible = true;

    const animateCanvas = () => {
      if (!isTabVisible) return;
      ctx.clearRect(0, 0, width, height);

      // Draw faint connections
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(201, 164, 65, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animateCanvas);
    };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) animateCanvas();
      else cancelAnimationFrame(animationFrameId);
    });

    animateCanvas();
  }

  /* =========================================================
     4. CUSTOM CURSOR FOLLOWER (Fine Pointer Desktop)
     ========================================================= */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !isReducedMotion) {
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });

    window.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });

    window.addEventListener('mousedown', () => cursorRing.classList.add('is-clicking'));
    window.addEventListener('mouseup', () => cursorRing.classList.remove('is-clicking'));

    // Hover detection for interactive targets
    const interactiveQuery = 'a, button, .chip, .skill-pill, .project-card, .pass-card, .skill-card, input, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveQuery)) {
        cursorRing.classList.add('is-hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveQuery)) {
        cursorRing.classList.remove('is-hovering');
      }
    });

    const renderCursor = () => {
      // Dot directly follows mouse
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      // Ring smoothly lerps
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(renderCursor);
    };
    renderCursor();
  }

  /* =========================================================
     5. 3D CARD TILT & INTERACTIVE GLARE
     ========================================================= */
  const tiltCards = document.querySelectorAll('.project-card, .pass-card, .skill-card, .portrait-stage');

  if (!isReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    tiltCards.forEach((card) => {
      let isHovered = false;

      card.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Custom property for radial gradient light source
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);

        if (!isHovered) return;

        // 3D Tilt calculation
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;

        const maxTilt = card.classList.contains('portrait-stage') ? 4 : 7;
        const rotateY = percentX * maxTilt;
        const rotateX = -percentY * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        card.style.transform = '';
      });
    });
  } else {
    // Touch/simple mouse glow fallback
    document.querySelectorAll('.project-card, .pass-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    });
  }

  /* =========================================================
     6. SCROLL PROGRESS BAR & ACTIVE NAV HIGHLIGHTER
     ========================================================= */
  const backToTop = document.getElementById('backToTop');
  const progressCircle = document.getElementById('progressCircle');
  const nav = document.querySelector('.site-nav');
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinksList = document.querySelectorAll('.nav-links a');

  const circleCircumference = 2 * Math.PI * 18; // r = 18 => ~113.1

  const onScrollHandler = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    // Back to top visibility & circular progress
    if (backToTop) {
      if (scrollY > 350) {
        backToTop.classList.add('is-visible');
        if (progressCircle) {
          const offset = circleCircumference - (scrollPercent / 100) * circleCircumference;
          progressCircle.style.strokeDashoffset = offset;
        }
      } else {
        backToTop.classList.remove('is-visible');
      }
    }

    // Sticky nav backdrop
    if (nav) {
      if (scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }

    // Experience timeline line-draw calculation
    const timeline = document.querySelector('.timeline');
    const timelineBar = document.getElementById('timelineBar');
    if (timeline && timelineBar) {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const totalHeight = rect.height;
        const visibleAmount = windowHeight * 0.7 - rect.top;
        const progress = Math.min(100, Math.max(0, (visibleAmount / totalHeight) * 100));
        timelineBar.style.height = `${progress}%`;

        // Activate step circles when progress reaches them
        const items = timeline.querySelectorAll('.timeline-item');
        items.forEach((item) => {
          const itemRect = item.getBoundingClientRect();
          if (itemRect.top < windowHeight * 0.72) {
            item.classList.add('active-step');
          } else {
            item.classList.remove('active-step');
          }
        });
      }
    }

    // Active nav link detection
    let currentActiveId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentActiveId = sec.getAttribute('id');
      }
    });

    navLinksList.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentActiveId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  document.addEventListener('scroll', onScrollHandler, { passive: true });
  onScrollHandler();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =========================================================
     7. SCROLL REVEAL & STAMP SLAM OBSERVER
     ========================================================= */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* =========================================================
     8. MAGNETIC BUTTONS & CHIPS (Desktop Fine Pointer)
     ========================================================= */
  if (!isReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const magnetics = document.querySelectorAll('.btn, .chip, .nav-mark');
    magnetics.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* =========================================================
     9. BUTTON CLICK RIPPLE EFFECT
     ========================================================= */
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* =========================================================
     10. MOBILE HAMBURGER MENU & SMOOTH NAV
     ========================================================= */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    const closeMenu = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    };
    const openMenu = () => {
      navToggle.setAttribute('aria-expanded', 'true');
      navLinks.classList.add('is-open');
      document.body.classList.add('nav-open');
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    // Close when clicking any nav link
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', closeMenu);
    });

    // Close when clicking on the backdrop outside links
    navLinks.addEventListener('click', (e) => {
      if (e.target === navLinks) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* =========================================================
     11. SMOOTH IN-PAGE ANCHOR SCROLLING
     ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href');
      if (targetId === '#top' || targetId === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* =========================================================
     12. CV PREVIEW MODAL CONTROLLER
     ========================================================= */
  const openCvBtn = document.getElementById('openCvBtn');
  const cvModal = document.getElementById('cvModal');
  const cvModalClose = document.getElementById('cvModalClose');
  const cvModalBackdrop = document.getElementById('cvModalBackdrop');

  if (openCvBtn && cvModal) {
    const openModal = () => {
      cvModal.classList.add('is-open');
      cvModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('cv-modal-open');
    };

    const closeModal = () => {
      cvModal.classList.remove('is-open');
      cvModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('cv-modal-open');
    };

    openCvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });

    if (cvModalClose) cvModalClose.addEventListener('click', closeModal);
    if (cvModalBackdrop) cvModalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cvModal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  /* =========================================================
     13. LEGATHON EVENT PHOTO SLIDER
     ========================================================= */
  const sliderEl = document.getElementById('legathonSlider');
  if (sliderEl) {
    const slides = sliderEl.querySelectorAll('.slider-slide');
    const dots = sliderEl.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const captionEl = document.getElementById('sliderCaption');
    let currentIndex = 0;
    let timer = null;

    const showSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
      if (captionEl && slides[currentIndex]) {
        const cap = slides[currentIndex].getAttribute('data-caption') || '';
        captionEl.innerHTML = cap;
      }
    };

    const nextSlide = () => showSlide(currentIndex + 1);
    const prevSlide = () => showSlide(currentIndex - 1);

    const startAutoPlay = () => {
      if (isReducedMotion) return;
      stopAutoPlay();
      timer = setInterval(nextSlide, 4500);
    };

    const stopAutoPlay = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
        showSlide(idx);
        startAutoPlay();
      });
    });

    sliderEl.addEventListener('mouseenter', stopAutoPlay);
    sliderEl.addEventListener('mouseleave', startAutoPlay);

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    sliderEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    sliderEl.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) nextSlide();
        else prevSlide();
      }
      startAutoPlay();
    }, { passive: true });

    startAutoPlay();
  }
})();