// //const { Vector3 } = require("./libs/three/three");

// const { Vector2, Vector3 } = require("./libs/three/three");
// const THREE = require("./libs/three/three");

function defineTriangle(points) {
  const { p0, p1, p2 } = points;
  const anchor = p0.clone();
  const v0 = p1.clone().sub(p0);
  const v1 = p2.clone().sub(p0);

  const normal = v1.clone().cross(v0).normalize();
  const distance = normal.clone().dot(p0);

  const matrix = new THREE.Matrix3();
  matrix.set(v0.x, v0.y, v0.z, v1.x, v1.y, v1.z, normal.x, normal.y, normal.z);

  return { normal, distance, v0, v1, anchor, matrix, normal };
}

function solveHitPoint(start, end, triangle) {
  let constant = 0;
  let coefficient = 0;
  const delta = end.clone().sub(start);

  ["x", "y", "z"].forEach((x) => {
    coefficient += delta[x] * triangle.normal[x];
    constant += start[x] * triangle.normal[x];
  });

  const s = (triangle.distance - constant) / coefficient;
  const hp = new THREE.Vector3(
    start.x + s * delta.x,
    start.y + s * delta.y,
    start.z + s * delta.z
  );

  return { hp, s };
}

function solveUV(matrix, anchor, hitPoint) {
  if (hitPoint.hp) {
    hitPoint = hitPoint.hp;
  }
  const d = hitPoint.clone().sub(anchor);
  const m = matrix.clone().invert().transpose();

  const [u, v, t] = d.applyMatrix3(m);
  if (t < -0.0001 || t > 0.0001) {
    console.error("emma found a bad t", t);
  }
  const hit = u >= 0 && u <= 1 && v >= 0 && v <= 1 && u + v <= 1;
  return { hit, hitPoint, u, v };
}

const test_suite = [
  {
    input: {
      triangle: {
        p0: new Vector3(-3, 0, -7.5),
        p1: new Vector3(-3, 0, 7.5),
        p2: new Vector3(3, 0, 7.5),
      },
      start: new Vector3(0, 1, 7),
      end: new Vector3(-0.016, 0.493, 6.137),
    },
    output: {
      hit: true,
      hitPoint: new Vector3(-3, 1, 6),
    },
  },
  // {
  //   input: {
  //     triangle: {
  //       p0: new Vector3(-4.5, 0, 6),
  //       p1: new Vector3(-1.5, 0, 6),
  //       p2: new Vector3(-1.5, 3, 6),
  //     },
  //     start: new Vector3(-2.355, 0.826, 6.606),
  //     end: new Vector3(-3.343, 0.754, 6.467),
  //   },
  //   output: {
  //     hit: true,
  //     hitPoint: new Vector3(-3, 1, 6),
  //   },
  // },
];

// for (const test of test_suite) {
//   const { input, output } = test;

//   const triangle = defineTriangle(input.triangle);
//   console.log('triangle', triangle)

//   const hitPoint = solveHitPoint(input.start, input.end, triangle);
//   console.log(hitPoint.s)
//   const result = solveUV(triangle.matrix, triangle.anchor, hitPoint);
//   console.log(result);
// }
