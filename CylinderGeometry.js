Gallery.CylinderFront = (params) => {
  let { segments, positions, indices, normals, uvs, uvLocation } = params;
  positions.buffer.push([0, 0, 0]);
  uvs.push([uvLocation.x, uvLocation.y]);
  const centerIndex = 0;
  forEachAngle(segments, (angle) => {
    positions.append(angle, 0);
    let currentIndex = positions.buffer.length - 1;
    indices.push([centerIndex, currentIndex, currentIndex + 1]);
    normals.push([0, 0, -1]);
    const radius = 0.25;
    uvs.push([
      radius * Math.sin(-angle) + uvLocation.x,
      radius * Math.cos(-angle) + uvLocation.y,
    ]);
  });

  indices.pop();
  indices.push([centerIndex, segments, 1]);
  normals.push([0, 0, -1]);
};

Gallery.CylinderBack = (params) => {
  let { segments, positions, indices, height, normals, uvs, uvLocation } =
    params;
  positions.buffer.push([0, 0, height]);
  uvs.push([uvLocation.x, uvLocation.y]);

  // back faces
  const backIndex = positions.buffer.length - 1;
  forEachAngle(segments, (angle) => {
    positions.append(angle, height);
    let currentIndex = positions.buffer.length - 1;
    indices.push([backIndex, currentIndex + 1, currentIndex]);
    normals.push([0, 0, 1]);
    const radius = 0.25;
    uvs.push([
      radius * Math.sin(angle + Math.PI) + uvLocation.x,
      radius * Math.cos(angle + Math.PI) + uvLocation.y,
    ]);
  });

  indices.pop();
  indices.push([segments + 1, segments + 2, segments * 2 + 1]);
  normals.push([0, 0, 1]);
};

Gallery.CylinderGeometry = (r, height, segments) => {
  const ridges = 120;
  let positions = {
    buffer: [],
    append: (angle, zOffset) => {
      positions.buffer.push([
        r * Math.sin(angle),
        r * Math.cos(angle),
        zOffset,
      ]);
    },
  };

  let indices = [];
  let normals = [];
  let uvs = [];

  //locations in atlas
  const headsLocation = { x: 0.25, y: 0.25 };
  const tailsLocation = { x: 0.75, y: 0.25 };

  Gallery.CylinderFront({
    segments,
    positions,
    indices,
    normals,
    uvs,
    uvLocation: headsLocation,
  });

  Gallery.CylinderBack({
    segments,
    positions,
    indices,
    normals,
    uvs,
    uvLocation: tailsLocation,
    height,
  });

  // middle faces
  let turn = 0;
  forEachAngle(segments, (angle) => {
    positions.append(angle, 0);
    let currentIndex = positions.buffer.length - 1;
    positions.append(angle, height);
    normals = normals.concat([
      [Math.sin(angle), Math.cos(angle), 0],
      [Math.sin(angle), Math.cos(angle), 0],
    ]);
    indices.push([currentIndex, currentIndex + 1, currentIndex + 2]);
    indices.push([currentIndex + 2, currentIndex + 1, currentIndex + 3]);

    const divisor = segments / ridges;
    uvs.push([turn / divisor, 0]);
    uvs.push([turn / divisor, 0]);
    turn++;
    if (turn > divisor) turn = 0;
  });

  indices.pop();
  indices.pop();

  indices.push([
    positions.buffer.length - 1,
    segments * 2 + 3,
    segments * 2 + 2,
  ]);
  indices.push([
    positions.buffer.length - 1,
    segments * 2 + 2,
    positions.buffer.length - 2,
  ]);

  const vertices = new Float32Array(positions.buffer.flat(1));
  const normalArr = new Float32Array(normals.flat(1));
  const uvsArr = new Float32Array(uvs.flat(1));
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices.flat(1));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normalArr, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvsArr, 2));
  geometry.addGroup(0, segments * 6, 0);
  geometry.addGroup(segments * 6, segments * 6, 1);

  return geometry;
};

forEachAngle = (segments, action, offset) => {
  offset = offset || 0;
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * (2 * Math.PI) + offset;
    action(angle);
  }
};
