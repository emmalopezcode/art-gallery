class ParticleEmitter {
  constructor(params) {
    this.location = params.location;
    this.frequency = params.frequency;
    this.r = params.r;
    this.maxAge = params.maxAge;
    this.particles = [];
  }

  emit(particlesGroup) {
    for (let i = 0; i < this.frequency; i++) {
      let mesh = new THREE.Mesh(
        new THREE.SphereGeometry(this.r, 16, 16),
        Gallery.materials.glass
      );
      particlesGroup.add(mesh);

      let particle = new Particle(
        new THREE.Vector3(Math.random() * 2 - 1, 3, -10),
        new THREE.Vector3(0, 0, 0),
        mesh,
        this.r
      );

      this.particles.push(particle);
    }
  }

  render(particlesGroup) {
    this.particles.forEach((p) => {
      p.render();
      this.particles.forEach((q) => {
        if (q.touches(p)) {
          q.collide(p);
        }
      });

      if (p.age > this.maxAge) {
        particlesGroup.remove(p.mesh);
      }
    });

    this.particles = this.particles.filter((p) => p.age <= this.maxAge);
  }
}
