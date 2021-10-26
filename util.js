function save(mesh, title) {
    const exporter = new THREE.OBJExporter();
    const text = exporter.parse(mesh);
    var link = document.createElement('a');
    link.download = title;
    var blob = new Blob([text], { type: 'text/plain' });
    link.href = window.URL.createObjectURL(blob);
    link.click();
}

function recurseChildren(obj, fn) {
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

function loadOBJAsset(path, scene, config) {
    const loader = new THREE.OBJLoader();
    loader.load(path, function (obj) {
        config.position &&
            obj.position.set(
                config.position.x, 
                config.position.y, 
                config.position.z
            );

        config.material &&
            (obj.material = config.material);

        scene.add(obj)
    });
}