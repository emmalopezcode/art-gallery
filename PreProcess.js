Gallery.addLeaf = (leafMap, scene, child) => {
  let pos = unflatten(child.geometry.getAttribute("position").array, 3);
  scene.updateMatrixWorld(true);
  child.geometry.computeBoundingBox();
  child.geometry.boundingBox.applyMatrix4(child.matrixWorld);
  let helper = new THREE.Box3Helper(child.geometry.boundingBox);
  // scene.add(helper);

  let triangles;
  if (child.geometry.index) {
    let indices = unflatten(child.geometry.index.array, 3);
    triangles = indices.map((index) => {
      let points = {
        p0: toV3(pos[index[0]]).applyMatrix4(child.matrixWorld),
        p1: toV3(pos[index[1]]).applyMatrix4(child.matrixWorld),
        p2: toV3(pos[index[2]]).applyMatrix4(child.matrixWorld),
      };

      const triangleInfo = defineTriangle(points);
      return { ...triangleInfo, points };
    });
  } else {
    triangles = unflatten(pos, 3).map((triangle) => {
      let points = {
        p0: toV3(triangle[0]).applyMatrix4(child.matrixWorld),
        p1: toV3(triangle[1]).applyMatrix4(child.matrixWorld),
        p2: toV3(triangle[2]).applyMatrix4(child.matrixWorld),
      };
      const triangleInfo = defineTriangle(points);
      return { ...triangleInfo, points };
    });
  }

  leafMap[child.name] = {
    boundingBox: child.geometry.boundingBox,
    triangles,
  };
};
