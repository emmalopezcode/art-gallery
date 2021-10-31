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
      color: neutralColor,
   });

   for (let i = 0; i < numRects; i++) {
      Gallery.rect(context, {
         x: i * (size / numRects) + size / (2 * numRects),
         y: 0,
         width: size / (4 * numRects),
         height: size,
         color: indentColor,
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
   const radius = 0.25;
   const thickness = 0.036;
   const x = -1.5;
   const y = 2.5 - radius;
   const z = 3;
   const segments = 40;
   const numRidges = 120;
   const headsLocation = { x: 0.25, y: 0.25 };
   const tailsLocation = { x: 0.75, y: 0.25 };

   let group = new THREE.Object3D();

   let material = TexturedMaterial.simpleMaterial(
      "./textures/quarter/atlas.png",
      "map"
   );

   var edge = new THREE.Texture(Gallery.generateTexture(false));
   edge.needsUpdate = true;
   edge.repeat.set(numRidges / 10, 1);
   let edgeMat = new THREE.MeshStandardMaterial({ map: edge });

   let heads = Gallery.uvMapFace(headsLocation, segments);
   let tails = Gallery.uvMapFace(tailsLocation, segments).reverse();
   let wrap = Math.floor(segments / 2);
   tails = [...tails.slice(wrap), ...tails.slice(0, wrap)];

   const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      thickness,
      segments
   );

   const edgeUvs = Array(segments)
      .fill()
      .map(() =>
         // repeating just the first face
         geometry.faceVertexUvs[0].slice(0, 2)
      )
      .flat(1);

   geometry.faceVertexUvs[0] = [...edgeUvs, ...heads, ...tails];

   const mesh = new THREE.Mesh(geometry, [edgeMat, material, material]);
   mesh.position.set(x, y, z);
   mesh.rotation.set(0, -Math.PI / 4, Math.PI / 2);
   group.add(mesh);
   return group;
};

Gallery.uvMapFace = (location, segments) => {
   const radius = 0.25;
   let uvs = [];
   for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * (2 * Math.PI) - 1;
      const prevAngle = ((i - 1) / segments) * (2 * Math.PI) - 1;
      const { x, y } = location;
      const curr = new THREE.Vector2(
         radius * Math.sin(-angle) + x,
         radius * Math.cos(-angle) + y
      );
      const prev = new THREE.Vector2(
         radius * Math.sin(-prevAngle) + x,
         radius * Math.cos(-prevAngle) + y
      );
      uvs.push([prev, curr, new THREE.Vector2(x, y)]);
   }

   return uvs;
};
