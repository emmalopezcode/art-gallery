Gallery.loader = new THREE.GLTFLoader();

Gallery.wireframe = (geometry) => {
  const line = new THREE.LineSegments(
    new THREE.WireframeGeometry(geometry.translate(0, 1, 0)),
    new THREE.LineBasicMaterial({ color: 0xff3333, linewidth: 5 })
  );
  return line;
};

Gallery.loadAsset = (scene, config) => {
  const loader = new THREE.GLTFLoader();
  loader.load(`./blender/${config.file}`, (data) => {
    let model = data.scene.children[0];
    model.material = config.material;
    config.rotation &&
      model.rotation.set(
        config.rotation.x,
        config.rotation.y,
        config.rotation.z
      );
    config.position &&
      model.position.set(
        config.position.x,
        config.position.y,
        config.position.z
      );
    scene.add(model);
  });
};

Gallery.musicBox = () => {
  const group = new THREE.Object3D();
  const cylinderRadius = 0.25;
  const cylinderHeight = 0.8;
  const indent = 0.05;
  const rodHeight = 0.2;
  const rodRadius = 0.025;
  const netCylinderRadius = cylinderRadius - rodRadius;
  const numTeeth = 16;
  const bevelSegments = 5;
  const bevel = 0.015;

  const points = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(rodRadius, 0),
    new THREE.Vector2(rodRadius, rodHeight),
    new THREE.Vector2(netCylinderRadius - indent, rodHeight),
    new THREE.Vector2(netCylinderRadius - indent, rodHeight - indent),
    new THREE.Vector2(netCylinderRadius, rodHeight - indent),
    new THREE.Vector2(netCylinderRadius, cylinderHeight + rodHeight),
    new THREE.Vector2(netCylinderRadius - indent, cylinderHeight + rodHeight),
    new THREE.Vector2(
      netCylinderRadius - indent,
      cylinderHeight + rodHeight - indent
    ),
    new THREE.Vector2(rodRadius, cylinderHeight + rodHeight - indent),
    new THREE.Vector2(rodRadius, cylinderHeight - indent + 2 * rodHeight),
    new THREE.Vector2(0, cylinderHeight - indent + 2 * rodHeight),
  ];

  const doublePoints = [];
  points.forEach((point) => {
    doublePoints.push(point);
    doublePoints.push(point);
  });

  let body = new THREE.LatheGeometry(doublePoints, 40);

  const length = 0.01;
  const width = 0.01;

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, width);
  shape.lineTo(length, width);
  shape.lineTo(length, 0);
  shape.lineTo(0, 0);

  const extrudeSettings = {
    steps: 2,
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: -4,
    bevelSegments: bevelSegments,
  };
  const toothGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  for (
    let y = rodHeight;
    y <= rodHeight + cylinderHeight;
    y += cylinderHeight / numTeeth
  ) {
    let angle = Math.random() * Math.PI;
    let geometry = toothGeometry
      .clone()
      .rotateY(-angle + Math.PI / 2)
      .translate(
        Math.cos(angle) * cylinderRadius * 0.9,
        y,
        Math.sin(angle) * cylinderRadius * 0.9
      );
    body.merge(geometry);
  }

  let mesh = new THREE.Mesh(body, Gallery.materials.gold);
  mesh.rotation.y = Math.PI;
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(1.5, 2.25, 2.5);
  group.add(mesh);

  return group;
};
