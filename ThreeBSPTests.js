

Gallery.tests = () => {

    const group = new THREE.Object3D();
    const wireframe =  new THREE.MeshBasicMaterial({wireframe: true});

    const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    const cubeBSP = new ThreeBSP(cubeGeo)
    const cube = new THREE.Mesh(cubeBSP.toGeometry(), wireframe)
    cube.position.set(0, 1, 0);
    //group.add(cube)
    // this is the same vertices as using the simpleCubeGeo
    // 12 faces, 36 vertices
    
    const cylinderGeo = new THREE.CylinderGeometry(.1, .1, 1, 16);
    cylinderGeo.rotateX(Math.PI/2);
    const cylinderBSP = new ThreeBSP(cylinderGeo);
    const cubeWithHoleBSP = cubeBSP.subtract(cylinderBSP)
    const cubeWithHole = new THREE.Mesh(cubeWithHoleBSP.toGeometry(),wireframe);
    cubeWithHole.position.set(0, 1, 2);
    //group.add(cubeWithHole)
    /* this one was not what i was expecting, I am not sure why the vertices 
    on all the planes that do not have a hole going through them should have to change
    the hole itself is about what i expected but the other faces have so many 
    unpredictable vertices */
    // 141 faces, 423 vertices

    const cubeWith2HolesBSP = cubeWithHoleBSP.subtract(
        new ThreeBSP(
            cylinderGeo.translate(-.25, -.25, 0 )
        )
    )
    const cubeWith3HolesBSP = cubeWith2HolesBSP.subtract(
        new ThreeBSP(
            cylinderGeo.translate(.5, .5, 0 )
        )
    )

    const cubeWith3Holes = new THREE.Mesh(cubeWith3HolesBSP.toGeometry(),wireframe);
    cubeWith3Holes.position.set(0, 1, 4);
    group.add(cubeWith3Holes)
    // 705 faces, 2215 vertices

    
    return group;


}