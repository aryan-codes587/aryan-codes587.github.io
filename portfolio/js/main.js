// ── GRID CANVAS ANIMATION ──────────────────────────────
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');

let W, H, cols, rows, nodes = [], animId;

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
  cols = Math.floor(W / 60);
  rows = Math.floor(H / 60);
  initNodes();
}

function initNodes() {
  nodes = [];
  for (let c = 0; c <= cols; c++) {
    for (let r = 0; r <= rows; r++) {
      nodes.push({
        x: (c / cols) * W,
        y: (r / rows) * H,
        ox: (c / cols) * W,
        oy: (r / rows) * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }
}

function drawGrid() {
  ctx.clearRect(0, 0, W, H);

  const time = Date.now() * 0.001;

  // Update node positions
  nodes.forEach(n => {
    n.pulse += 0.008;
    n.x = n.ox + Math.sin(n.pulse) * 8;
    n.y = n.oy + Math.cos(n.pulse * 0.7) * 6;
  });

  // Draw connecting lines
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 90) {
        const alpha = (1 - dist / 90) * 0.5;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(124, 108, 252, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  // Draw dots
  nodes.forEach(n => {
    const glow = (Math.sin(n.pulse * 2) + 1) / 2;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(124, 108, 252, ${0.3 + glow * 0.4})`;
    ctx.fill();
  });

  animId = requestAnimationFrame(drawGrid);
}

window.addEventListener('resize', () => { cancelAnimationFrame(animId); resize(); drawGrid(); });
resize();
drawGrid();


// ── SCROLL REVEAL ──────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.project-card, .about-grid, .contact-title, .contact-sub, .stats-bar, .section-header'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));


// ── SKILL BAR ANIMATION ────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('animate'), i * 100 + 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsBlock = document.querySelector('.skills-block');
if (skillsBlock) skillObserver.observe(skillsBlock);


// ── SMOOTH NAV ACTIVE STATE ────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}`
      ? 'var(--text)' : '';
  });
}, { passive: true });
