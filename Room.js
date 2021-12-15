Gallery.room = {
  width: 6,
  length: 15,
  height: 3,
};

Gallery.createWindowPane = () => {
  const windowH = 1.5;
  const windowW = 3;
  const edgeW = 0.1;
  const edgeD = 0.02;

  let windowGeo = new THREE.PlaneGeometry(windowW, windowH);
  let windowMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
  });
  let window = new THREE.Mesh(windowGeo, windowMaterial);
  window.position.set(0, Gallery.room.height / 2, -Gallery.room.length / 2);
  window.name = "window";

  let edging = new THREE.Object3D();
  let windowPane = new THREE.Object3D();
  const edgeMat = Gallery.materials.wood.edge_top;
  const vertGeo = new THREE.BoxGeometry(edgeW, windowH + edgeW, edgeD);
  const horizGeo = new THREE.BoxGeometry(edgeW, windowW + edgeW, edgeD);

  const horizPos = [
    {
      x: 0,
      y: Gallery.room.height / 2 + windowH / 2,
      z: -Gallery.room.length / 2,
    },
    {
      x: 0,
      y: Gallery.room.height / 2 - windowH / 2,
      z: -Gallery.room.length / 2,
    },
  ];

  horizPos.forEach((pos) => {
    let edge = new THREE.Mesh(horizGeo.clone(), edgeMat);
    edge.position.set(pos.x, pos.y, pos.z);
    edge.rotation.set(0, 0, Math.PI / 2);
    edge.name = `edge(${pos.x}, ${pos.y}, ${pos.z})`;
    edging.add(edge);
  });

  const vertPos = [
    {
      x: -Gallery.room.width / 2 + windowW / 2,
      y: Gallery.room.height / 2,
      z: -Gallery.room.length / 2,
    },
    {
      x: Gallery.room.width / 2 - windowW / 2,
      y: Gallery.room.height / 2,
      z: -Gallery.room.length / 2,
    },
  ];

  vertPos.forEach((pos) => {
    let edge = new THREE.Mesh(vertGeo.clone(), edgeMat);
    edge.position.set(pos.x, pos.y, pos.z);
    edge.name = `edge(${pos.x}, ${pos.y}, ${pos.z})`;
    edging.add(edge);
  });

  windowPane.add(edging);
  windowPane.add(window);
  return windowPane;
};

Gallery.createWindowWall = () => {
  const windowH = 1.5;
  const windowW = 3;

  let windowWall = new THREE.Object3D();

  let wall = Gallery.subtract(
    new THREE.BoxGeometry(Gallery.room.width, Gallery.room.height, 0.1),
    new THREE.BoxGeometry(windowW, windowH, 0.2)
  );

  wall.material = Gallery.materials.plaster;
  wall.position.set(0, 1.5, -Gallery.room.length / 2);
  wall.name = "backwall";

  addAll(windowWall, [wall, Gallery.createWindowPane()]);
  return windowWall;
};

Gallery.createRoom = () => {
  let room = new THREE.Object3D();

  room.add(Gallery.createWindowWall());

  let ceilingGeo = new THREE.PlaneGeometry(
    Gallery.room.width,
    Gallery.room.length
  );
  let ceiling = new THREE.Mesh(ceilingGeo, Gallery.materials.plaster)
    .translateY(Gallery.room.height)
    .rotateX(0.5 * Math.PI);
  ceiling.name = "Ceiling";
  room.add(ceiling);

  let floor = new THREE.Mesh(
    new THREE.PlaneGeometry(Gallery.room.length, Gallery.room.width),
    Gallery.materials.floor
  )
    .translateY(0)
    .rotateX(-Math.PI / 2)
    .rotateZ(-Math.PI / 2);
  floor.name = "Floor";
  room.add(floor);

  let tileGeo = new THREE.PlaneGeometry(
    Gallery.room.length / 5,
    Gallery.room.height
  );

  for (let i = 0; i < 5; i++) {
    let z =
      -Gallery.room.length / 2 +
      Gallery.room.length / 10 +
      (i * Gallery.room.length) / 5;
    let x = Gallery.room.width / 2;
    let y = Gallery.room.height / 2;

    let rightTile = new THREE.Mesh(tileGeo.clone(), Gallery.materials.brick);
    rightTile.position.set(x, y, z);
    rightTile.rotation.set(0, -Math.PI / 2, 0);
    rightTile.name = `brickTile(${x}, ${y}, ${z})`;
    room.add(rightTile);

    leftTile = new THREE.Mesh(tileGeo.clone(), Gallery.materials.brick);
    leftTile.position.set(-x, y, z);
    leftTile.rotation.set(0, Math.PI / 2, 0);
    leftTile.name = `brickTile(${-x}, ${y}, ${z})`;
    room.add(leftTile);
  }

  let backWallLeft = new THREE.Mesh(tileGeo, Gallery.materials.brick_back);
  backWallLeft.rotation.set(0, Math.PI, 0);
  backWallLeft.position.set(
    Gallery.room.width / 2 - Gallery.room.length / 10,
    Gallery.room.height / 2,
    Gallery.room.length / 2
  );
  backWallLeft.name = "backWallLeft";

  let backWallRight = new THREE.Mesh(
    tileGeo.clone(),
    Gallery.materials.brick_back
  );
  backWallRight.rotation.set(0, Math.PI, 0);
  backWallRight.position.set(
    -Gallery.room.width / 2 + Gallery.room.length / 10,
    Gallery.room.height / 2,
    Gallery.room.length / 2
  );
  backWallRight.name = "backWallRight";

  room.add(backWallLeft);
  room.add(backWallRight);

  return room;
};
