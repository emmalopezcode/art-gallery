class TexturedMaterial{
  
  constructor(config){
    this.config = config;
    this.material = TexturedMaterial.createTexturedMaterial(config);
  }

  static createTexturedMaterial(config) {
    let material = new THREE.MeshStandardMaterial({
      map: TexturedMaterial.loadTexture(`${config.path}/albedo.png`, {
        x: config.repeats.x,
        y: config.repeats.y,
      }),
      normalMap:
        config.normal &&
        TexturedMaterial.loadTexture(`${config.path}/normal.png`, {
          x: config.repeats.x,
          y: config.repeats.y,
        }),
      metalness: config.metalness,
      roughnessMap: config.roughnessMap &&
      TexturedMaterial.loadTexture(`${config.path}/roughness.png`, {
        x: config.repeats.x,
        y: config.repeats.y,
      }),
      displacementMap:
        config.displacement &&
        TexturedMaterial.loadTexture(`${config.path}/displacement.png`, {
          x: config.repeats.x,
          y: config.repeats.y,
        }),
      displacementScale: .2,
      roughness: config.roughness,
      metalness: config.metalness
    });
    return material;
  }

  static simpleMaterial(path, property, repeats) {
    repeats = repeats || {x:1, y:1};
    let material = new THREE.MeshStandardMaterial();
    material[property] = TexturedMaterial.loadTexture(
      path, {x:1, y:1}
    );
    material.side = THREE.DoubleSide;
    return material;
  }

  static loadTexture(path, repeats) {
    let loader = new THREE.TextureLoader();
    let texture = loader.load(path, (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeats.x, repeats.y);
    });
    return texture;
  }

  setRepeats(repeats) {
    this.config = {
      ...this.config,
      repeats
    }
    this.material = TexturedMaterial.createTexturedMaterial(this.config);
    return this;
  }

  mat() {
    return this.material;
  }
}