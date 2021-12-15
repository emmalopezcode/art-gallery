Gallery.rect = (context, config) => {
  context.beginPath();
  context.rect(config.x, config.y, config.width, config.height);
  context.fillStyle = config.color;
  context.fill();
};

convertToColor = (angles) => {
  let result = "#";
  let r = angles[0];
  let g = angles[1];
  let b = angles[2];
  const colorInts = [
    Math.round(r * 127) + 128,
    Math.round(g * 127) + 128,
    Math.round(b * 255),
  ];

  for (const int of colorInts) {
    var str = Number(int).toString(16);
    if (str.length < 2) {
      str = "0" + str;
    }
    result += str;
  }

  return result;
};

Gallery.generateNormal = () => {
  const size = 512;
  const numRects = 10;

  let angles = [
    [-Math.PI / 8, 0, Math.PI / 8],
    [0, 0, 0],
    [Math.PI / 8, 0, Math.PI / 8],
    [Math.PI / 4, 0, Math.PI / 4],
    [(3 * Math.PI) / 8, 0, Math.PI / 8],
    [Math.PI / 2, 0, 0],
    [(3 * Math.PI) / 8, 0, Math.PI / 8],
    [Math.PI / 4, 0, Math.PI / 4],
    [Math.PI / 8, 0, Math.PI / 8],
    [0, 0, 0],
    [-Math.PI / 8, 0, Math.PI / 8],
    [-Math.PI / 4, 0, -Math.PI / 4],
    [(-3 * Math.PI) / 8, 0, Math.PI / 8],
    [-Math.PI / 2, 0, 0],
    [(-3 * Math.PI) / 8, 0, Math.PI / 8],
    [-Math.PI / 4, 0, -Math.PI / 4],
  ].map((angle) => [Math.sin(angle[0]), 0, Math.cos(angle[0])]);

  var canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  var context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;

  Gallery.rect(context, {
    x: 0,
    y: 0,
    width: size,
    height: size,
    color: convertToColor(angles[1]),
  });

  for (let i = 0; i < angles.length; i++) {
    const color = convertToColor(angles[i]);
    Gallery.rect(context, {
      x: i * (size / angles.length),
      y: 0,
      width: size / angles.length,
      height: size,
      color,
    });
  }

  return canvas;
};

Gallery.generateDisplacement = () => {
  const size = 512;

  const neutralColor = "#FFFFFF";
  const indentColor = "#000000";

  var canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  var context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;

  Gallery.rect(context, {
    x: 0,
    y: 0,
    width: size,
    height: size,
    color: neutralColor,
  });

  Gallery.rect(context, {
    x: size / 2,
    y: 0,
    width: size / 2,
    height: size,
    color: indentColor,
  });

  return canvas;
};

Gallery.quarter = () => {
  const radius = 0.5;
  const thickness = 0.036;
  const x = -1.5;
  const y = 2.5;
  const z = 3;
  const segments = 1200;

  let group = new THREE.Object3D();

  let material = TexturedMaterial.simpleMaterial(
    "./textures/quarter/atlas.png",
    "map"
  );

  var edge = new THREE.Texture(Gallery.generateDisplacement());
  edge.needsUpdate = true;
  var edgeNormal = new THREE.Texture(Gallery.generateNormal());
  edgeNormal.needsUpdate = true;

  let edgeMat = new THREE.MeshStandardMaterial({
    displacementMap: edge,
    displacementScale: 0.01,
    metalness: 0.9,
    roughness: 0.5,
    normalMap: edgeNormal,
  });

  const geometry = Gallery.CylinderGeometry(radius, thickness, segments);

  const mesh = new THREE.Mesh(geometry, [material, edgeMat]);
  mesh.rotation.set(Math.PI, -Math.PI / 8, Math.PI);
  mesh.position.set(x, y, z);
  mesh.name = "Coin";

  mesh.noReceiveShadow = true;
  group.add(mesh);
  return group;
};
