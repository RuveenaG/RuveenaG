// ---------- split hero headline into animated chars ----------
document.querySelectorAll('[data-split]').forEach((el) => {
  const text = el.textContent;
  el.textContent = '';
  let delay = 0;
  text.split(' ').forEach((word, wordIndex, words) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';
    [...word].forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.style.animationDelay = `${0.35 + delay}s`;
      span.textContent = ch;
      wordSpan.appendChild(span);
      delay += 0.035;
    });
    el.appendChild(wordSpan);
    if (wordIndex < words.length - 1) {
      el.appendChild(document.createTextNode(' '));
    }
  });
});

// ---------- nav shadow on scroll ----------
const nav = document.querySelector('.site-nav');
if (nav) {
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---------- scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ---------- project / pass card cursor glow ----------
document.querySelectorAll('.project-card, .pass-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

// ---------- smooth in-page nav close on click (mobile safeguard) ----------
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});