Gallery.createWhiffleBall = () => {

   const r = .25;
   const x = -1.5, y = 2.25, z = 1;
   const holeRadius = .1 * r;
   const thickness = .05 * r;
   const numHoles = 50;

   const outerSphere = new THREE.SphereGeometry(r, 32, 16);
   const innerSphere = new THREE.SphereGeometry(r - thickness, 32, 16);
   const holeGeo = new THREE.CylinderGeometry(holeRadius, holeRadius, thickness * 10, 16);

   let subtraction;

   for (let i = 0; i < numHoles; i++) {
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      const point2D = { x: i / numHoles, y: i / goldenRatio };

      const spherePoint = {
         theta: Math.acos(2 * point2D.x - 1) - (Math.PI / 2),
         phi: 2 * Math.PI * point2D.y
      }
      const point = {
         x: Math.cos(spherePoint.theta) * Math.cos(spherePoint.phi) * r,
         y: Math.cos(spherePoint.theta) * Math.sin(spherePoint.phi) * r,
         z: Math.sin(spherePoint.theta) * r,
      }

      let hole = holeGeo.clone().rotateX(spherePoint.theta)
         .rotateZ(spherePoint.phi - Math.PI / 2)
         .translate(point.x, point.y, point.z)

      if (!subtraction)
         subtraction = hole;
      else
         subtraction.merge(hole);

   }

   const outerBSP = new ThreeBSP(outerSphere);
   const innerBSP = new ThreeBSP(innerSphere);
   const subtractionBSP = new ThreeBSP(subtraction);
   const hollowSphere = outerBSP.subtract(innerBSP);
   const whiffleBall = hollowSphere.subtract(subtractionBSP);

   const result = new THREE.Mesh(
      whiffleBall.toGeometry(), 
      new THREE.MeshPhongMaterial({
         color: 0xdddddd
       })
   );
   result.position.set(x, y, z);

   return result;
}