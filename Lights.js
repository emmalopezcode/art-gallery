Gallery.lights = () => {

    let lights = new THREE.Object3D();

    let ambientLight = new THREE.AmbientLight(0x353535);
  
    let pointLightA = new THREE.SpotLight(0xffffff, 0.6);
    pointLightA.castShadow = true;
    pointLightA.position.set(
      -Gallery.room.width / 4 + 0.2,
      Gallery.room.height - 0.2,
      Gallery.room.length / 2 - 0.2
    );
    pointLightA.shadow.mapSize.width = 1024;
    pointLightA.shadow.mapSize.height = 1024;
    pointLightA.penumbra = 1;
    pointLightA.lookAt(0, 0, 0);
  
    let pointLightB = pointLightA.clone();
    pointLightB.position.set(
      Gallery.room.width / 4 - 0.2,
      Gallery.room.height - 0.2,
      -Gallery.room.length / 2 + 0.2
    );

    let pointLightC = pointLightA.clone();
    pointLightC.position.set(
      -Gallery.room.width / 4 + 0.2,
      Gallery.room.height - 0.2,
      -Gallery.room.length / 2 + 0.2
    );

    let pointLightD = pointLightA.clone();
    pointLightD.position.set(
      Gallery.room.width / 4 - 0.2,
      Gallery.room.height - 0.2,
      Gallery.room.length / 2 - 0.2
    );

    lights.add(ambientLight);
    lights.add(pointLightA);
    lights.add(pointLightB);
    lights.add(pointLightC);
    lights.add(pointLightD);

    return lights;
}