Gallery.scramble = (array) => {
   for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
   }
   return array;
};

Gallery.marbleGame = () => {
   const group = new THREE.Group();
   const r = 0.6;
   const height = 0.1;
   const x = 1.5,
      y = 1.98,
      z = 1;
   let material = new THREE.MeshPhongMaterial({ color: 0x3e1b1b });
   const numMarbles = 18;
   const subtraction = new THREE.Geometry();

   let topPoints = [];
   for (let i = 3.14169 / 2; i > 0; i -= 0.1) {
      topPoints.push(
         new THREE.Vector2(
            (Math.cos(i) * r) / 4 + (3 * r) / 4,
            -Math.sin(i) * height + 0.015
         )
      );
   }

   const bodyGeo = new THREE.LatheGeometry(topPoints, 100);
   bodyGeo.translate(x, height + y, z);
   const bodyInterior = new THREE.CylinderGeometry(r, (3 * r) / 4, height, 32);
   bodyInterior.translate(x, height / 2 + y, z);
   bodyGeo.merge(bodyInterior);

   const hollowRingGeo = new THREE.TorusGeometry(r * 0.85, height / 5, 16, 100);
   hollowRingGeo.rotateX(Math.PI / 2);
   hollowRingGeo.translate(x, height + y, z);
   subtraction.merge(hollowRingGeo, hollowRingGeo.matrix);

   const baseRingFull = new THREE.TorusGeometry(r * 0.85, height / 5, 16, 100);
   baseRingFull.rotateX(Math.PI / 2);
   baseRingFull.translate(x, y, z);

   const slice = new THREE.BoxGeometry(2 * r, height, 2 * r);
   slice.translate(x, y - height / 2, z);

   const gap = 5 / r;
   const offset = 3 * r;

   let divetLocations = [{}];
   for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
         divetLocations.push({
            x: i / gap - offset / gap + x,
            y: height + y,
            z: j / gap - offset / gap + z,
         });
      }
   }

   [1, 2, 3].map((i) => {
      divetLocations.push({
         x: i / gap - offset / gap + x,
         y: height + y,
         z: -1 / gap - offset / gap + z,
      });
      divetLocations.push({
         x: i / gap - offset / gap + x,
         y: height + y,
         z: 5 / gap - offset / gap + z,
      });
   });

   [1, 2, 3].map((j) => {
      divetLocations.push({
         x: -1 / gap - offset / gap + x,
         y: height + y,
         z: j / gap - offset / gap + z,
      });
      divetLocations.push({
         x: 5 / gap - offset / gap + x,
         y: height + y,
         z: j / gap - offset / gap + z,
      });
   });

   const locations = Gallery.scramble(divetLocations);
   const marbleLocations = locations.slice(0, numMarbles);
   const emptyLocations = locations.slice(numMarbles);
   const divetGeo = new THREE.SphereGeometry(height / 3, 32, 16);
   marbleLocations.forEach(location => {
      let geometry = divetGeo
         .clone()
         .translate(location.x, location.y, location.z);

      let marbleMat = Gallery.materials.marble[
         Math.floor(Math.random() * Gallery.materials.marble.length)
      ];
      const marble = new THREE.Mesh(geometry, marbleMat);
      group.add(marble);

   });

   emptyLocations.forEach((location) => {
      let geometry = divetGeo
         .clone()
         .translate(location.x, location.y, location.z);
      subtraction.merge(geometry);

   });

   const baseRingHalf = Gallery.subtract(baseRingFull, slice);
   const geometry = Gallery.subtract(bodyGeo, subtraction);

   group.add(new THREE.Mesh(baseRingHalf, material))
   group.add(new THREE.Mesh(geometry, material))

   save(group, 'marble_game.obj');

   return group;
};
