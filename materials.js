Gallery.wood = new TexturedMaterial({
  path: "./textures/wood",
  repeats: {
    x: 0.5,
    y: 16,
  },
  roughness: 0.7,
});
Gallery.materials = {
  brick: new TexturedMaterial({
    path: "./textures/brick",
    metalness: 0,
    normal: true,
    roughness: 1,
    displacement: false,
    repeats: {
      x: 1,
      y: 1,
    },
  }).mat(),
  glass: new THREE.MeshPhysicalMaterial({
    roughness: 0.35,
    transmission: 1,
    thickness: 2.4,
    clearcoat: 1,
    clearcoatRoughness: 0,
  }),
  brick_back: new TexturedMaterial({
    path: "./textures/brick",
    metalness: 0,
    normal: true,
    roughness: 1,
    displacement: false,
    repeats: {
      x: 1,
      y: 1,
    },
  }).mat(),
  wood: {
    shelves: Gallery.wood.mat(),
    edge_top: Gallery.wood.setRepeats({ x: 0.1, y: 3 }).mat(),
    edge_side: Gallery.wood.setRepeats({ x: 1, y: 1 }).mat(),
    marble_game: Gallery.wood.setRepeats({ x: 1, y: 1 }).mat(),
  },
  floor: new TexturedMaterial({
    path: "./textures/wood_flooring",
    metalness: 0,
    roughnessMap: true,
    roughness: 1,
    repeats: {
      x: 3,
      y: 2,
    },
    normal: true,
  }).mat(),
  gold: new TexturedMaterial({
    path: "./textures/gold",
    metalness: 0.9,
    roughness: 0.5,
    normal: false,
    repeats: {
      x: 1,
      y: 1,
    },
  }).mat(),
  marble: [
    new TexturedMaterial({
      path: "./textures/marble/simple",
      metalness: 0.5,
      roughness: 0.5,
      normal: false,
      repeats: {
        x: 1,
        y: 1,
      },
    }).mat(),
    new TexturedMaterial({
      path: "./textures/marble/red",
      metalness: 0.5,
      roughness: 0.7,
      normal: false,
      repeats: {
        x: 1,
        y: 1,
      },
    }).mat(),
    new TexturedMaterial({
      path: "./textures/marble/cream",
      metalness: 0.5,
      roughness: 0.7,
      normal: false,
      repeats: {
        x: 1,
        y: 1,
      },
    }).mat(),
    new TexturedMaterial({
      path: "./textures/marble/black",
      metalness: 0.5,
      roughness: 0.7,
      normal: false,
      repeats: {
        x: 1,
        y: 1,
      },
    }).mat(),
  ],
  plaster: new TexturedMaterial({
    path: "./textures/plaster",
    normal: true,
    metalness: 0,
    roughness: 0.5,
    repeats: {
      x: 3,
      y: 1,
    },
  }).mat(),
};
