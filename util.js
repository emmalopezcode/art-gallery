function save(mesh, title) {
  const exporter = new THREE.OBJExporter();
  const text = exporter.parse(mesh);
  var link = document.createElement("a");
  link.download = title;
  var blob = new Blob([text], { type: "text/plain" });
  link.href = window.URL.createObjectURL(blob);
  link.click();
}

function traverseScene(obj, fn) {
  if (obj.length) {
    obj.forEach((child) => {
      if (child.children && child.children.length) {
        traverseScene(child, fn);
      } else {
        fn(child);
      }
    });
  } else {
    traverseScene(obj.children, fn);
  }
}

function loadOBJAsset(path, scene, config) {
  const loader = new THREE.OBJLoader();
  loader.load(path, function (obj) {
    config.position &&
      obj.position.set(config.position.x, config.position.y, config.position.z);

    config.material && (obj.material = config.material);

    scene.add(obj);
  });
}

Gallery.subtract = (geo1, geo2) => {
  const geo1BSP = CSG.fromGeometry(geo1);
  const geo2BSP = CSG.fromGeometry(geo2);
  const subtraction = geo1BSP.subtract(geo2BSP);
  return CSG.toMesh(subtraction, new THREE.Matrix4());
};

Gallery.union = (geo1, geo2) => {
  const geo1BSP = CSG.fromGeometry(geo1);
  const geo2BSP = CSG.fromGeometry(geo2);
  const addition = geo1BSP.union(geo2BSP);
  return CSG.toMesh(addition, new THREE.Matrix4()).geometry;
};

between = (v, start, end) => {
  const betweenX =
    (start.x <= v.x && v.x <= end.x) || (end.x <= v.x && v.x <= start.x);
  const betweenY =
    (start.y <= v.y && v.y <= end.y) || (end.y <= v.y && v.y <= start.y);
  const betweenZ =
    (start.z <= v.z && v.z <= end.z) || (end.z <= v.z && v.z <= start.z);

  return betweenX && betweenY && betweenZ;
};

function toV3(input) {
  return new THREE.Vector3(input[0], input[1], input[2]);
}

function unflatten(input, size) {
  let output = [];
  for (let i = 0; i < input.length; i++) {
    if ((i + 1) % size === 0) {
      output.push(input.slice(i - (size - 1), i + 1));
    }
  }
  return output;
}
