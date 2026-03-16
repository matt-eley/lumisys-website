(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');

  const PARTICLE_COUNT = 90;
  const CONNECTION_DIST = 160;
  const MOUSE_RADIUS = 180;
  const BASE_SPEED = 0.05;

  const COLORS = [
    { r: 255, g: 100, b: 150 },  // pink
    { r: 255, g: 140, b: 60  },  // orange
    { r: 80,  g: 160, b: 255 },  // blue
    { r: 220, g: 80,  b: 180 },  // magenta-pink
    { r: 255, g: 180, b: 80  },  // warm orange
    { r: 100, g: 200, b: 255 },  // light blue
  ];

  let particles = [];
  let mouse = { x: null, y: null };

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * BASE_SPEED;
      this.vy = (Math.random() - 0.5) * BASE_SPEED;
      this.radius = Math.random() * 3 + 2;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    update() {
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          this.vx += (dx / dist) * force * 0.6;
          this.vy += (dy / dist) * force * 0.6;
        }
      }

      // Slight random drift each frame for organic movement
      this.vx += (Math.random() - 0.5) * 0.02;
      this.vy += (Math.random() - 0.5) * 0.02;

      this.vx *= 0.98;
      this.vy *= 0.98;

      // Enforce minimum speed so particles never fully stop
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed < 0.07) {
        const angle = Math.random() * Math.PI * 2;
        this.vx += Math.cos(angle) * 0.07;
        this.vy += Math.sin(angle) * 0.07;
      }
      if (speed > 0.5) {
        this.vx = (this.vx / speed) * 0.5;
        this.vy = (this.vy / speed) * 0.5;
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      const { r, g, b } = this.color;

      // Glow
      const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3.5);
      glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.4)`);
      glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
      ctx.fill();
    }
  }

  function init() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.5;
          const { r, g, b } = particles[i].color;
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); init(); });

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  init();
  animate();
})();
