class Ray {
  constructor(origin, direction, pace) {
    this.origin = origin;
    this.direction = direction;
    this.delta = direction.clone().multiplyScalar(pace);
  }

  intersectBox(box) {
    let s = {};

    s.x = this.solveForSComponent(box, "x");
    let result = s.x;

    s.y = this.solveForSComponent(box, "y");
    if (result.min > s.y.max || s.y.min > result.max) return null;
    if (s.y.min > result.min) result.min = s.y.min;
    if (s.y.max < result.max) result.max = s.y.max;

    s.z = this.solveForSComponent(box, "z");
    if (result.min > s.z.max || s.z.min > result.max) return null;
    if (s.z.min > result.min) result.min = s.z.min;
    if (s.z.max < result.max) result.max = s.z.max;

    if (result.max < 0) return null;
    return result.min >= 0 ? result.min : result.max;
  }

  solveForSComponent(box, axis) {
    const { origin } = this;
    let min, max;

    if (this.direction[axis] >= 0) {
      min = (box.min[axis] - origin[axis]) / this.delta[axis];
      max = (box.max[axis] - origin[axis]) / this.delta[axis];
    } else {
      min = (box.max[axis] - origin[axis]) / this.delta[axis];
      max = (box.min[axis] - origin[axis]) / this.delta[axis];
    }

    return { min, max };
  }
}
