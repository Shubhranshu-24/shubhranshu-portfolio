/* ─────────────────────────────────────────────
   MAIN.JS  —  Shubhranshu Behera Portfolio
   Motion: particles, counters, typewriter,
   magnetic buttons, parallax, hamburger nav
───────────────────────────────────────────── */

/* ── SCROLL PROGRESS BAR ── */
const bar = document.getElementById('progress-bar');
function updateBar() {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  if (bar) bar.style.width = pct + '%';
}

/* ── HEADER SHADOW ── */
const hdr = document.querySelector('header');
function updateHeader() {
  if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 10);
}

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });
  // Close on nav link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => observer.observe(el));

/* ── SKILL BAR ANIMATION ── */
const allBars = document.querySelectorAll('.skill-bar-fill');
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width || '0%';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
allBars.forEach(b => barObs.observe(b));

/* ── COUNTER ANIMATION ── */
function animateCounter(el, end, suffix, duration) {
  const start = 0;
  const range = end - start;
  const startTime = performance.now();
  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = (start + Math.round(range * ease)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num[data-count]');
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const val = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (!isNaN(val)) animateCounter(el, val, suffix, 1200);
      statObs.unobserve(el);
    }
  });
}, { threshold: 0.3 });
statNums.forEach(n => statObs.observe(n));

/* ── TYPEWRITER EFFECT ── */
function typewriter(el, text, speed) {
  if (!el) return;
  el.textContent = '';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  el.parentNode.insertBefore(cursor, el.nextSibling);
  function tick() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed + Math.random() * 25);
    } else {
      setTimeout(() => cursor.remove(), 2500);
    }
  }
  setTimeout(tick, 400);
}
const twEl = document.querySelector('[data-typewriter]');
if (twEl) typewriter(twEl, twEl.dataset.typewriter, 55);

/* ── PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 2 + 0.5;
      this.speed = Math.random() * 0.4 + 0.15;
      this.drift = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.35 + 0.05;
      this.life = 0;
      this.maxLife = 300 + Math.random() * 400;
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      this.life++;
      if (this.y < -10 || this.life > this.maxLife) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * Math.sin(Math.PI * this.life / this.maxLife);
      ctx.fillStyle = '#4D9E8E';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 55 }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
  loop();
})();

/* ── MAGNETIC BUTTON EFFECT ── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── HERO PARALLAX SCROLL ── */
const heroGlow = document.querySelector('.hero-orb-1');
window.addEventListener('scroll', () => {
  updateBar();
  updateHeader();
  if (heroGlow) {
    heroGlow.style.transform = `translateY(${window.scrollY * 0.18}px)`;
  }
}, { passive: true });
updateHeader();

/* ── CARD TILT 3D ── */
document.querySelectorAll('.hcard, .hobby-card, .comp-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    card.style.boxShadow = `${-x * 12}px ${-y * 12}px 28px rgba(45,106,94,0.12)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});

/* ── SMOOTH ANCHOR ACTIVE STATE ── */
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(a => {
  if (a.href === window.location.href) a.classList.add('active');
});

/* ── CONTACT FORM — Formspree Integration ──
   SETUP INSTRUCTIONS:
   1. Go to https://formspree.io and create a free account
   2. Create a new form and get your Form ID (e.g. "xpwzydqb")
   3. Replace 'YOUR_FORM_ID' below with your actual Formspree form ID
   4. Formspree will forward all submissions to shubhranshu.behera@niser.ac.in
      (set this as your email in Formspree dashboard)
────────────────────────────────────────── */
const FORMSPREE_ID = 'mnjokbyw'; // ← Replace with your Formspree form ID

window.submitForm = async function () {
  const nameEl    = document.getElementById('name');
  const emailEl   = document.getElementById('email');
  const subjectEl = document.getElementById('subject');
  const msgEl     = document.getElementById('msg');

  const n = nameEl?.value.trim();
  const e = emailEl?.value.trim();
  const s = subjectEl?.value.trim();
  const m = msgEl?.value.trim();

  if (!n || !e || !m) {
    alert('Please fill in your name, email, and message.');
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(e)) {
    alert('Please enter a valid email address.');
    return;
  }

  const btn = document.querySelector('.sbtn');
  const successMsg = document.getElementById('success-msg');

  if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: n,
        _replyto: e,
        email: e,
        subject: s || 'Message from portfolio',
        message: m
      })
    });

    if (response.ok) {
      if (successMsg) successMsg.style.display = 'block';
      [nameEl, emailEl, subjectEl, msgEl].forEach(el => { if (el) el.value = ''; });
      // Hide success after 6s
      setTimeout(() => { if (successMsg) successMsg.style.display = 'none'; }, 6000);
    } else {
      const data = await response.json();
      if (data.errors) {
        alert('Error: ' + data.errors.map(err => err.message).join(', '));
      } else {
        alert('Something went wrong. Please email directly at shubhranshu.behera@niser.ac.in');
      }
    }
  } catch (err) {
    alert('Network error. Please email directly at shubhranshu.behera@niser.ac.in');
    console.error('Form error:', err);
  } finally {
    if (btn) { btn.textContent = 'Send message →'; btn.disabled = false; }
  }
};
