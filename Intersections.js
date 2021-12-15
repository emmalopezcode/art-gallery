Gallery.currentIntersections = (curr, next, ray, leafMap) => {
  const intersections = [];
  for (const key in leafMap) {
    if (ray.intersectBox(leafMap[key].boundingBox)) {
      let hitTriangles = [];
      for (const triangle of leafMap[key].triangles) {
        const hitPoint = solveHitPoint(curr, next, triangle);
        if (hitPoint) {
          // console.log(hitPoint)
          const { hp, s } = hitPoint;

          let result = solveUV(triangle.matrix, triangle.anchor, hp);
          if (result.hit) hitTriangles.push({ triangle: triangle.points, s });
        }
      }
      hitTriangles.sort((a, b) => a.s - b.s);
      intersections.push({
        name: key,
        loc: ray.intersectBox(leafMap[key].boundingBox),
        hitTriangles,
      });
    }
  }
  intersections.sort((a, b) => a.loc - b.loc);

  return intersections;
};
