class CameraControls {
   yAxis = new THREE.Vector3(0, 1, 0);
   xAxis = new THREE.Vector3(1, 0, 0);
   buffer = 0.2;
   slow = 1;
   fast = 3;

   pressedKeys = {
      KeyW: 0,
      KeyA: 0,
      KeyS: 0,
      KeyD: 0,
      ArrowUp: 0,
      ArrowDown: 0,
      ArrowLeft: 0,
      ArrowRight: 0,
   };

   shiftedPressedKeys = Object.assign({}, this.pressedKeys);

   keyEffects = {
      KeyW: { velocity: -this.slow, rotation: 0 },
      KeyS: { velocity: this.slow, rotation: 0 },
      ArrowUp: { velocity: 0, rotation: { x: this.slow, y: 0 } },
      ArrowDown: { velocity: 0, rotation: { x: -this.slow, y: 0 } },
      ArrowLeft: { velocity: 0, rotation: { x: 0, y: 1 } },
      ArrowRight: { velocity: 0, rotation: { x: 0, y: -1 } },
   };

   shiftedKeyEffects = {
      KeyW: { velocity: -this.fast, rotation: 0 },
      KeyS: { velocity: this.fast, rotation: 0 },
      ArrowUp: { velocity: 0, rotation: { x: this.fast, y: 0 } },
      ArrowDown: { velocity: 0, rotation: { x: -this.fast, y: 0 } },
      ArrowLeft: { velocity: 0, rotation: { x: 0, y: 3 } },
      ArrowRight: { velocity: 0, rotation: { x: 0, y: -3 } },
   };

   halt() {
      this.camera.translateZ(0.005);
   }

   getRay(vel) {
      let target = new THREE.Vector3();
      this.camera.getWorldDirection(target);
      return new Ray(this.camera.position, target, vel);
   }

   getCurrent() {
      return this.camera.position;
   }

   getRayLength(velocity, delta) {
      return this.getNext(velocity, delta).sub(this.getCurrent());
   }

   getNext(velocity, delta) {
      this.camera.translateZ(-1 * velocity * delta);
      const next = this.camera.position.clone();
      this.camera.translateZ(1 * velocity * delta);
      return next;
   }

   constructor(camera) {
      this.camera = camera;

      window.addEventListener("keydown", (e) => {
         e.preventDefault();
         if (this.keyEffects[e.code]) {
            if (e.shiftKey && this.shiftedKeyEffects[e.code]) {
               this.shiftedPressedKeys[e.code] = 1;
            } else {
               this.pressedKeys[e.code] = 1;
            }
         }
      });

      window.addEventListener("keyup", (e) => {
         this.shiftedPressedKeys[e.code] = 0;
         this.pressedKeys[e.code] = 0;
      });
   }

   update(delta, leafMap) {

      let keysets = [
         { keys: this.pressedKeys, effects: this.keyEffects },
         { keys: this.shiftedPressedKeys, effects: this.shiftedKeyEffects },
      ];
      keysets.forEach(keyset => {
         const { keys, effects } = keyset;
         for (const key in keys) {
            if (keys[key]) {
               let vector = Object.assign({}, effects[key]);
               const curr = this.getCurrent();
               const next = this.getNext(-vector.velocity, delta);
               const ray = this.getRay(-vector.velocity);
               let s = next.distanceTo(curr);
               let hits = Gallery.currentIntersections(curr, next, ray, leafMap);
               let hit = hits[0];

               let standoff = this.buffer / s;
               if (
                  hit &&
                  hit.hitTriangles.length &&
                  hit.hitTriangles[0].s >= 0 &&
                  hit.hitTriangles[0].s <= standoff + 1
               ) {
                  let translation = standoff - hit.hitTriangles[0].s;
                  this.camera.translateZ(translation * s);
               } else {
                  this.applyVectorToCamera(vector, delta);
               }
            }
         }
      });
   }

   applyVectorToCamera(vector, delta) {
      if (vector) {
         const { rotation, velocity } = vector;

         if (rotation) {
            this.camera.rotateOnWorldAxis(this.yAxis, rotation.y * delta);
            this.camera.rotateX(rotation.x * delta);
         }

         this.camera.translateZ(1 * velocity * delta);
      }
   }
}
