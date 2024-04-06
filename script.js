let fireworks = [];
let gravityX = 0;
let gravityY = 0.15;

function setup() {
  createCanvas(800, 600);
  strokeWeight(10);
}

function draw() {
  colorMode(RGB);
  background(0, 25); // Slight fade effect for trails
  if (random(1) < 0.08) {
    fireworks.push(new Firework());
  }
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y, color, firework) {
    this.x = x;
    this.y = y;
    this.velX = firework ? 0 : cos(random(TWO_PI)) * random(2, 10);
    this.velY = firework ? random(-12, -8) : sin(random(TWO_PI)) * random(2, 10);
    this.accX = 0;
    this.accY = 0;
    this.color = color;
    this.lifespan = 255;
    this.firework = firework;
  }

  applyForce(forceX, forceY) {
    this.accX += forceX;
    this.accY += forceY;
  }

  update() {
    if (!this.firework) {
      this.velX *= 0.9; // Slow down
      this.velY *= 0.9; // Slow down
      this.lifespan -= 4;
    }
    this.velX += this.accX;
    this.velY += this.accY;
    this.x += this.velX;
    this.y += this.velY;
    this.accX = 0;
    this.accY = 0;
  }

  show() {
    if (!this.firework) {
      strokeWeight(2);
    } else {
      strokeWeight(4);
    }
    stroke(this.color[0], this.color[1], this.color[2], this.lifespan);
    point(this.x, this.y);
  }

  done() {
    return this.lifespan <= 0;
  }
}

class Firework {
  constructor() {
    this.color = [random(255), random(255), random(255)];
    this.firework = new Particle(random(width), height, this.color, true);
    this.exploded = false;
    this.particles = [];
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(gravityX, gravityY);
      this.firework.update();
      if (this.firework.velY >= 0) {
        this.explode();
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravityX, gravityY);
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  explode() {
    this.exploded = true;
    for (let i = 0; i < 100; i++) {
      let p = new Particle(this.firework.x, this.firework.y, this.color, false);
      this.particles.push(p);
    }
  }

  show() {
    if (!this.exploded) {
      this.firework.show();
    }
    for (let particle of this.particles) {
      particle.show();
    }
  }

  done() {
    if (this.exploded) {
      if (this.particles.length === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}