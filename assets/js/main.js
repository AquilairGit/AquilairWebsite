/* ============================================================
   AQUILAIR — main.js
   ============================================================ */

'use strict';

/* ── NAV scroll state ────────────────────────────────────── */
const nav = document.querySelector('.nav');

function updateNav() {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav(); // run on init


/* ── HERO VIDEO FADE on scroll ───────────────────────────── */
const heroVideoWrap = document.querySelector('.hero-video-wrap');
const heroHeight = () => document.querySelector('.hero').offsetHeight;

function updateVideoFade() {
  if (!heroVideoWrap) return;

  const scrolled = window.scrollY;
  const h = heroHeight();

  // Fade starts at 10% of hero height, fully transparent at 65%
  const start = h * 0.10;
  const end   = h * 0.65;

  let opacity = 1;

  if (scrolled > start) {
    opacity = 1 - Math.min((scrolled - start) / (end - start), 1);
  }

  // Slight scale-up as video fades (parallax feel)
  const scale = 1 + scrolled * 0.00015;

  heroVideoWrap.style.opacity = opacity;
  heroVideoWrap.style.transform = `scale(${scale})`;
}

window.addEventListener('scroll', updateVideoFade, { passive: true });
updateVideoFade();


/* ── SCROLL REVEAL (Intersection Observer) ───────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── SMOOTH ANCHOR SCROLL ────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── TICKER pause on hover (CSS handles it, JS as fallback) ─ */
// Already handled via CSS animation-play-state: paused on hover.


/* ── FORM feedback ───────────────────────────────────────── */
const form = document.querySelector('.form');
const submitBtn = form ? form.querySelector('.form-submit') : null;

if (form && submitBtn) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic required field check
    const required = form.querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;

    required.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#FF4444';
        field.addEventListener('input', () => {
          field.style.borderColor = '';
        }, { once: true });
      }
    });

    if (!valid) return;

    // Simulate send
    const original = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours…';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = '✓ Message envoyé';
      submitBtn.style.background = '#1A9E4A';
      setTimeout(() => {
        submitBtn.textContent = original;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        form.reset();
      }, 3500);
    }, 1200);
  });
}


/* ── ANIMATED COUNTERS in hero stats ────────────────────── */
function animateCounter(el, target, suffix, duration = 1400) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Trigger counters when hero stats come into view
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num[data-target]');
      statNums.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
