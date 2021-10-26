var Gallery = {};

Gallery.subtract = (geo1, geo2) => {
   const geo1BSP = new ThreeBSP(geo1);
   const geo2BSP = new ThreeBSP(geo2);
   return geo1BSP.subtract(geo2BSP).toGeometry();
};

Gallery.room = {
   width: 6,
   length: 15,
   height: 3,
};
Gallery.wood = new TexturedMaterial({
   path: "./textures/wood",
   repeats: {
      x: 0.5,
      y: 16,
   },
   roughness: 0.7,
});
function addAll(object, children) {
   children.forEach((child) => {
      object.add(child);
   });
}

Gallery.createWindowPane = () => {
   const windowH = 1.5;
   const windowW = 3;
   const edgeW = 0.1;
   const edgeD = 0.02;

   let windowGeo = new THREE.PlaneGeometry(windowW, windowH);
   let windowMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
   });
   let window = new THREE.Mesh(windowGeo, windowMaterial);
   window.position.set(0, Gallery.room.height / 2, -Gallery.room.length / 2);

   let edging = new THREE.Object3D();
   let windowPane = new THREE.Object3D();

   const edgeMat = Gallery.materials.wood.edge_top;
   let leftEdge = new THREE.Mesh(
      new THREE.BoxGeometry(edgeW, windowH + edgeW, edgeD),
      edgeMat
   );
   leftEdge.position.set(
      -Gallery.room.width / 2 + windowW / 2,
      Gallery.room.height / 2,
      -Gallery.room.length / 2
   );
   let rightEdge = leftEdge.clone();
   rightEdge.position.x = Gallery.room.width / 2 - windowW / 2;

   let topEdge = new THREE.Mesh(
      new THREE.BoxGeometry(edgeW, windowW + edgeW, edgeD),
      edgeMat
   );
   topEdge.position.set(
      0,
      Gallery.room.height / 2 + windowH / 2,
      -Gallery.room.length / 2
   );
   topEdge.rotation.set(0, 0, Math.PI / 2);

   let bottomEdge = topEdge.clone();
   bottomEdge.position.y = Gallery.room.height / 2 - windowH / 2;

   addAll(edging, [leftEdge, rightEdge, topEdge, bottomEdge]);
   windowPane.add(edging);
   windowPane.add(window);
   return windowPane;
};

Gallery.createWindowWall = () => {
   const windowH = 1.5;
   const windowW = 3;

   let windowWall = new THREE.Object3D();

   let wallBSP = new ThreeBSP(
      new THREE.BoxGeometry(Gallery.room.width, Gallery.room.height, 0.1)
   );
   let windowBSP = new ThreeBSP(new THREE.BoxGeometry(windowW, windowH, 0.2));
   let result = wallBSP.subtract(windowBSP).toGeometry();

   let wall = new THREE.Mesh(result, Gallery.materials.plaster);
   wall.position.set(0, 1.5, -Gallery.room.length / 2);

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

   //ceiling
   room.add(
      new THREE.Mesh(ceilingGeo, Gallery.materials.plaster)
         .translateY(Gallery.room.height)
         .rotateX(0.5 * Math.PI)
   );

   //floor
   let floor = new THREE.Mesh(
      new THREE.PlaneGeometry(Gallery.room.length, Gallery.room.width),
      Gallery.materials.floor
   )
      .translateY(0)
      .rotateX(-Math.PI / 2)
      .rotateZ(-Math.PI / 2);
   room.add(floor);

   let tileGeo = new THREE.PlaneGeometry(
      Gallery.room.length / 5,
      Gallery.room.height,
      300,
      300
   );

   for (let i = 0; i < 5; i++) {
      room.add(
         new THREE.Mesh(tileGeo, Gallery.materials.brick)
            .translateZ(
               -Gallery.room.length / 2 +
               Gallery.room.length / 10 +
               (i * Gallery.room.length) / 5
            )
            .translateY(Gallery.room.height / 2)
            .translateX(Gallery.room.width / 2)
            .rotateY(-0.5 * Math.PI)
      );
      room.add(
         new THREE.Mesh(tileGeo, Gallery.materials.brick)
            .translateZ(
               -Gallery.room.length / 2 +
               Gallery.room.length / 10 +
               (i * Gallery.room.length) / 5
            )
            .translateY(Gallery.room.height / 2)
            .translateX(-Gallery.room.width / 2)
            .rotateY(0.5 * Math.PI)
      );
   }
   let backWallLeft = new THREE.Mesh(tileGeo, Gallery.materials.brick_back);
   backWallLeft.rotation.set(0, Math.PI, 0);
   backWallLeft.position.set(
      Gallery.room.width / 2 - Gallery.room.length / 10,
      Gallery.room.height / 2,
      Gallery.room.length / 2
   );
   let backWallRight = backWallLeft.clone();
   backWallRight.position.set(
      -Gallery.room.width / 2 + Gallery.room.length / 10,
      Gallery.room.height / 2,
      Gallery.room.length / 2
   );

   room.add(backWallLeft);
   room.add(backWallRight);

   return room;
};

Gallery.createShelves = () => {
   const shelfL = Gallery.room.length;
   const shelfH = 0.02;
   const shelfW = 0.5;
   let shelves = new THREE.Object3D();

   let leftShelf = new THREE.Mesh(
      new THREE.BoxGeometry(shelfW, shelfH, shelfL),
      Gallery.materials.wood.shelves
   );
   leftShelf.position.set(
      -Gallery.room.width / 2 + shelfW / 2,
      Gallery.room.height / 2,
      0
   );
   let rightShelf = leftShelf.clone();

   rightShelf.position.x = Gallery.room.width / 2 - shelfW / 2;

   shelves.add(leftShelf);
   shelves.add(rightShelf);

   let lowerShelves = shelves.clone();
   lowerShelves.position.y = Gallery.room.height / 4;
   shelves.add(lowerShelves);

   return shelves;
};

Gallery.createColumns = () => {
   const columnDiameter = 0.25;
   const columnHeight = 1.8;
   const capWidth = 0.9;
   const capHeight = 0.1;
   const numPillars = 14;

   let pillars = new THREE.Object3D();

   let xOffsets = [-1.5, 1.5];
   const yOffset = columnHeight / 2 + capHeight;

   for (let i = 0; i < numPillars / 2; i++) {
      xOffsets.forEach((x) => {
         let pillar = new THREE.Object3D();
         let column = new THREE.Mesh(
            new THREE.CylinderGeometry(
               columnDiameter,
               columnDiameter,
               columnHeight,
               10
            ),
            Gallery.materials.marble[0]
         );
         column.position.set(x, yOffset, i * 2 - 7);
         column.recieveShadow = true;

         pillar.add(column);
         const capGeo = new THREE.BoxGeometry(capWidth, capHeight, capWidth);

         let topCap = new THREE.Mesh(capGeo, Gallery.materials.marble[0]);
         topCap.position.set(x, 0.9 + yOffset, i * 2 - 7);
         pillar.add(topCap);

         let bottomCap = new THREE.Mesh(capGeo, Gallery.materials.marble[0]);
         bottomCap.position.set(x, -0.9 + yOffset, i * 2 - 7);
         pillar.add(bottomCap);

         let topPoints = [];
         for (let i = 3.14169 / 2; i > 0; i -= 0.1) {
            topPoints.push(
               new THREE.Vector2(Math.cos(i) * 0.05 + 0.25, -Math.sin(i) * 0.08)
            );
         }

         let topBand = new THREE.Mesh(
            new THREE.LatheGeometry(topPoints, 100),
            Gallery.materials.gold
         );
         topBand.position.set(x, 0.9 + yOffset, i * 2 - 7);
         pillar.add(topBand);

         let bottomBand = topBand.clone();
         bottomBand.scale.y = -1;
         bottomBand.position.set(x, capHeight, i * 2 - 7);
         pillar.add(bottomBand);

         pillars.add(pillar);
      });
   }

   return pillars;
};

Gallery.setup = () => {
   let camera;
   let scene;
   let renderer;

   let clock = new THREE.Clock();

   scene = new THREE.Scene();

   camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
   );

   renderer = new THREE.WebGLRenderer({ antialiasing: true });
   renderer.setPixelRatio(window.devicePixelRatio * 1.5);
   renderer.setClearColor(new THREE.Color(0x000));
   renderer.setSize(window.innerWidth, window.innerHeight);
   renderer.shadowMap.enabled = true;

   scene.add(Gallery.createRoom());
   scene.add(Gallery.createShelves());
   scene.add(Gallery.createColumns());
   scene.add(Gallery.musicBox());
   Gallery.loadAsset(scene, {
      file: 'music_box.glb',
      material: Gallery.materials.gold,
      rotation: {
         x: Math.PI / 2,
         y: Math.PI,
         z: 0
      },
      position: {
         x: -1.5,
         y: 2.25,
         z: 3
      }
   });

   scene.add(Gallery.quarter());

   camera.position.set(0, 1, 7);
   camera.lookAt(scene.position);

   let ambienLight = new THREE.AmbientLight(0x353535);
   scene.add(ambienLight);

   let pointLightA = new THREE.SpotLight(0xffffff, 0.6);
   pointLightA.castShadow = true;
   pointLightA.position.set(
      -Gallery.room.width / 4 + .2,
      Gallery.room.height - .2,
      Gallery.room.length / 2 - .2
   );
   pointLightA.shadow.mapSize.width = 1024;
   pointLightA.shadow.mapSize.height = 1024;
   //pointLightA.decay = 5;
   pointLightA.penumbra = 1;
   pointLightA.lookAt(0, 0, 0);

   let pointLightB = pointLightA.clone();
   pointLightB.position.set(
      Gallery.room.width / 4 - .2,
      Gallery.room.height - .2,
      -Gallery.room.length / 2 + .2
   );
   let pointLightC = pointLightA.clone();
   pointLightC.position.set(
      -Gallery.room.width / 4 + .2,
      Gallery.room.height - .2,
      -Gallery.room.length / 2 + .2
   );
   let pointLightD = pointLightA.clone();
   pointLightD.position.set(
      Gallery.room.width / 4 - .2,
      Gallery.room.height - .2,
      Gallery.room.length / 2 - .2
   );


   scene.add(pointLightA);
   scene.add(pointLightB);
   scene.add(pointLightC);
   scene.add(pointLightD);

   //const controls = new THREE.FlyControls(camera, renderer.domElement);
   const controls = new THREE.OrbitControls(camera, renderer.domElement);
   document.getElementById("webgl-output").appendChild(renderer.domElement);

   recurseChildren(scene, (child) => {
      child.receiveShadow = true;
      child.castShadow = true;
   });
   render();

   function render() {
      controls.update(clock.getDelta() * 15);
      requestAnimationFrame(render);
      renderer.render(scene, camera);
   }
};

const recurseChildren = (obj, fn) => {
   if (obj.length) {
      obj.forEach((child => {
         if (child.children && child.children.length) {
            recurseChildren(child, fn);
         }
         else {
            fn(child);
         }
      }));
   } else {
      recurseChildren(obj.children, fn);
   }
}
