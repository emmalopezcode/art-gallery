var Gallery = {};

Gallery.setup = () => {
   let clock = new THREE.Clock();
   let scene = new THREE.Scene();
   let camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
   );

   let renderer = new THREE.WebGLRenderer({ antialiasing: true });
   renderer.setPixelRatio(window.devicePixelRatio * 1.5);
   renderer.setClearColor(0x00aaff);
   renderer.setSize(window.innerWidth, window.innerHeight);
   renderer.shadowMap.enabled = true;
   document.getElementById("webgl-output").appendChild(renderer.domElement);

   const leafMap = {};

   scene.add(Gallery.createRoom());
   scene.add(Gallery.createShelves());
   scene.add(Gallery.createColumns());
   scene.add(Gallery.musicBox());
   scene.add(Gallery.quarter());
   Gallery.loadAsset(scene, leafMap, {
      file: "music_box.glb",
      material: Gallery.materials.gold,
      rotation: {
         x: -Math.PI / 2,
         y: 0,
         z: 0,
      },
      position: {
         x: 1.4,
         y: 2.25,
         z: 1.25,
      },
   });

   camera.position.set(0, 1, 7);
   camera.lookAt(scene.position);
   scene.add(Gallery.lights());

   const controls = new CameraControls(camera);

   window.addEventListener("keydown", (e) => {
      if (e.key === "x" && e.ctrlKey) {
         const curr = controls.getCurrent();
         const next = controls.getNext(10, clock.getDelta());
         const ray = controls.getRay(1);
         const intersections = Gallery.currentIntersections(
            curr,
            next,
            ray,
            leafMap
         );
         intersections
            .sort((a, b) => a.loc - b.loc)
            .forEach((i) => console.log(i));
      }
   });

   traverseScene(scene, (child) => {
      if (!child.noReceiveShadow) {
         child.receiveShadow = true;
      }
      child.castShadow = true;
      if (child.name) {
         Gallery.addLeaf(leafMap, scene, child);
      }
   });

   let frameCount = 0;
   let particlesGroup = new THREE.Object3D();
   const waterfall = new ParticleEmitter({
      frequency: 10,
      r: 0.05,
      maxAge: 100,
   });
   scene.add(particlesGroup);

   render();

   function render() {
      frameCount++;
      if (frameCount % 10 === 0) {
         //waterfall.emit(particlesGroup);
      }
      waterfall.render(particlesGroup);

      controls.update(clock.getDelta(), leafMap);
      requestAnimationFrame(render);
      renderer.render(scene, camera);
   }
};
