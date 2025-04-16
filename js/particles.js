// Particle animation for the background
class Particle {
  constructor(canvas, ctx, options = {}) {
    this.canvas = canvas;
    this.ctx = ctx;
    
    this.x = options.x || Math.random() * canvas.width;
    this.y = options.y || Math.random() * canvas.height;
    
    this.size = options.size || Math.random() * 3 + 1;
    this.baseSize = this.size;
    
    this.speed = options.speed || {
      x: (Math.random() - 0.5) * 0.8,
      y: (Math.random() - 0.5) * 0.8
    };
    
    // Color from theme variables (purple and cyan)
    this.colors = ['rgba(138, 43, 226, 0.7)', 'rgba(104, 220, 253, 0.7)', 'rgba(255, 0, 255, 0.3)'];
    this.color = options.color || this.colors[Math.floor(Math.random() * this.colors.length)];
    
    this.connected = [];
    this.opacity = Math.random() * 0.5 + 0.2;
    this.pulse = 0;
    this.pulseSpeed = Math.random() * 0.02 + 0.01;
  }
  
  update() {
    this.pulse += this.pulseSpeed;
    this.size = this.baseSize + Math.sin(this.pulse) * (this.baseSize * 0.3);
    
    this.x += this.speed.x;
    this.y += this.speed.y;
    
    // Bounce off edges
    if (this.x > this.canvas.width || this.x < 0) {
      this.speed.x *= -1;
    }
    
    if (this.y > this.canvas.height || this.y < 0) {
      this.speed.y *= -1;
    }
    
    // Keep particles within canvas
    this.x = Math.max(0, Math.min(this.canvas.width, this.x));
    this.y = Math.max(0, Math.min(this.canvas.height, this.y));
  }
  
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
  
  connect(particles) {
    this.connected = [];
    
    particles.forEach(p => {
      if (p === this) return;
      
      const distance = Math.sqrt((this.x - p.x) ** 2 + (this.y - p.y) ** 2);
      const maxDistance = 150;
      
      if (distance < maxDistance) {
        this.connected.push({
          particle: p,
          distance: distance
        });
        
        // Draw connection line
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color.replace(/[^,]+\)/, (this.opacity * (1 - distance / maxDistance)) + ')');
        this.ctx.lineWidth = 0.5;
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(p.x, p.y);
        this.ctx.stroke();
      }
    });
  }
}

class ParticleSystem {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.options = Object.assign({
      count: 40,
      connectParticles: true,
      responsive: true
    }, options);
    
    this.init();
    this.animate();
    
    // Handle resize
    window.addEventListener('resize', () => this.resize());
  }
  
  init() {
    // Set canvas to full size
    this.resize();
    
    // Create particles
    for (let i = 0; i < this.options.count; i++) {
      this.particles.push(new Particle(this.canvas, this.ctx));
    }
  }
  
  resize() {
    if (!this.options.responsive) return;
    
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.offsetWidth;
    this.canvas.height = parent.offsetHeight;
    
    // Adjust particles if needed
    if (this.particles.length) {
      for (let i = 0; i < this.particles.length; i++) {
        if (this.particles[i].x > this.canvas.width) {
          this.particles[i].x = Math.random() * this.canvas.width;
        }
        if (this.particles[i].y > this.canvas.height) {
          this.particles[i].y = Math.random() * this.canvas.height;
        }
      }
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      this.particles[i].draw();
      
      if (this.options.connectParticles) {
        this.particles[i].connect(this.particles);
      }
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait a moment to ensure the canvas element is available
  setTimeout(() => {
    new ParticleSystem('particles-js');
  }, 100);
}); 