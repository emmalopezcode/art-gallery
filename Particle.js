// const THREE = require('./libs/three/three');

class Particle {
  static gravity = -0.001;
  constructor(position, velocity, mesh, r) {
    this.position = position;
    this.velocity = velocity;
    this.mesh = mesh;
    this.age = 0;
    this.r = r;
  }

  touches(other) {
    const distance = this.position.distanceTo(other.position);
    if (distance <= this.r) {
      const overlap = this.r * -distance;
      const backward = this.velocity.clone().multiplyScalar(overlap / 2);
      if (backward.y && this.position.y < 3) {
        backward.y += 0.1;
      }
      let forward = backward.negate();

      this.position.add(backward);
      other.position.add(forward);

      this.collide(other);
    }
  }

  collide(other) {
    const normal = this.position.clone().sub(other.position).normalize();
    let normalScale = this.velocity.clone().dot(normal) * -2 * 0.9;
    this.velocity.add(normal.clone().multiplyScalar(normalScale));

    const otherNormal = normal.clone().negate();
    const otherNormalScale = other.velocity.clone().dot(otherNormal) * -2 * 0.9;
    other.velocity.add(otherNormal.clone().multiplyScalar(otherNormalScale));
  }

  collideWall(normal) {
    let normalScale = this.velocity.clone().dot(normal) * -2 * 0.9;
    this.velocity.add(normal.clone().multiplyScalar(normalScale));
  }

  applyForce(force) {
    this.velocity.add(force);
  }

  render() {
    this.age++;

    this.velocity.y += Particle.gravity;

    this.position.add(this.velocity);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  }
}

// let a = new Particle(
//     new THREE.Vector3(0, 0, 0),
//     new THREE.Vector3(0, 0, 0)
// );

// let b = new Particle(
//     new THREE.Vector3(1.5, 0, 0),
//     new THREE.Vector3(-1, 0, 0)
// );

// b.touches(a);
// console.log(b.position);
// a.collide(b);
