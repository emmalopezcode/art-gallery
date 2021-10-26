Gallery.rect = (context, config) => {
  context.beginPath();
  context.rect(config.x, config.y, config.width, config.height);
  context.fillStyle = config.color;
  context.fill();
};

Gallery.generateTexture = (isNormal) => {
  // draw a circle in the center of the canvas
  const size = 512;
  const numRects = 10;

  const neutralColor = isNormal ? "#797FF2" : "#FFFFFF";
  const indentColor = isNormal ? "#7866F2" : "#000000";

  // create canvas
  var canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  // get context
  var context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;

  Gallery.rect(context, {
    x: 0,
    y: 0,
    width: size,
    height: size,
    color: "#797FF2",
  });

  for (let i = 0; i < numRects; i++) {
    Gallery.rect(context, {
      x: i * (size / numRects) + size / (2 * numRects),
      y: 0,
      width: size / (4 * numRects),
      height: size,
      color: "#7866F2",
    });
  }

  return canvas;
};

Gallery.edgeTest = () => {
  let group = new THREE.Object3D();

  var texture = new THREE.Texture(Gallery.generateTexture());
  texture.needsUpdate = true;

  let material = new THREE.MeshStandardMaterial({
    displacementMap: texture,
    //color: '0xffffff',
    displacementScale: 0.036,

  });

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 1, 0);

  group.add(mesh);

  return group;
};

Gallery.quarter = () => {
  const radius = .25;
  const thickness = .036;
  const x = 0;
  const y = 1;
  const z = 3;

  let group = new THREE.Object3D();

  let front = TexturedMaterial.simpleMaterial(
    './textures/quarter/quarter-front.png', 'map'
  );
  let back = TexturedMaterial.simpleMaterial(
    './textures/quarter/quarter-back.png', 'map'
  );
  var sideNormal = new THREE.Texture(Gallery.generateTexture(true));
  sideNormal.needsUpdate = true;
  sideNormal.repeat.set(12, 1);

  var sideDisp = new THREE.Texture(Gallery.generateTexture(false));
  sideDisp.needsUpdate = true;
  sideDisp.repeat.set(12, 1);

  let material = new THREE.MeshStandardMaterial({
    normalMap: sideNormal,
    displacementScale: sideDisp,
    displacementScale: .01

  });

  const geometry = new THREE.CylinderGeometry(radius, radius, thickness, 512);
  const mesh = new THREE.Mesh(geometry, [material, front, back]);
  mesh.position.set(x, y, z);
  mesh.rotation.set(0, 0, Math.PI/2);

 // geometry.faceVertexUvs[0] = [];
  group.add(mesh);

  return group;

}