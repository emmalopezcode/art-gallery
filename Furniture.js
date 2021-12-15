
function addAll(object, children) {
  children.forEach((child) => {
    object.add(child);
  });
}

Gallery.createShelves = () => {
  const shelfL = Gallery.room.length;
  const shelfH = 0.02;
  const shelfW = 0.5;
  let shelves = new THREE.Object3D();

  const vertical = [Gallery.room.height / 2, 3*Gallery.room.height / 4];
  const horizontal = [-Gallery.room.width / 2 + shelfW / 2, Gallery.room.width / 2 - shelfW / 2]

  let shelfGeo = new THREE.BoxGeometry(shelfW, shelfH, shelfL);

  for (const y of vertical) {
    for (const x of horizontal) {
      let shelf = new THREE.Mesh(
        shelfGeo.clone(),
        Gallery.materials.wood.shelves
      );
      shelf.position.set(x,y,0);
      shelf.name = `shelf(${x}, ${y}, 0)`;
      shelves.add(shelf);
    }
  }

  return shelves;
};

Gallery.createColumns = () => {
  const columnDiameter = 0.25;
  const columnHeight = 1.8;
  const capWidth = 0.9;
  const capHeight = 0.1;
  const numPillars = 14;

  let columns = new THREE.Object3D();

  let xOffsets = [1.5, -1.5];
  const yOffset = columnHeight / 2 + capHeight;

  for (let i = 0; i < numPillars / 2; i++) {
    xOffsets.forEach((x, xOffsetIndex) => {
      let pillar = new THREE.Object3D();
      pillar.name = `Pillar(${x}, ${i * 2 - 7})`;
      let column = new THREE.Mesh(
        new THREE.CylinderGeometry(
          columnDiameter,
          columnDiameter,
          columnHeight,
          10
        ),
        Gallery.materials.marble[0]
      );
      column.position.set(x, yOffset, i * 2 - 7);
      column.name = `${pillar.name}:column`
      column.recieveShadow = true;

      pillar.add(column);
      const capGeo = new THREE.BoxGeometry(capWidth, capHeight, capWidth);

      let topCap = new THREE.Mesh(capGeo.clone(), Gallery.materials.marble[0]);
      topCap.position.set(x, 0.9 + yOffset, i * 2 - 7);
      topCap.name = `${pillar.name}:topCap`
      pillar.add(topCap);

      let bottomCap = new THREE.Mesh(capGeo, Gallery.materials.marble[0]);
      bottomCap.position.set(x, -0.9 + yOffset, i * 2 - 7);
      bottomCap.name = `${pillar.name}:bottomCap`
      pillar.add(bottomCap);

      let topPoints = [];
      for (let i = 3.14169 / 2; i > 0; i -= 0.1) {
        topPoints.push(
          new THREE.Vector2(Math.cos(i) * 0.05 + 0.25, -Math.sin(i) * 0.08)
        );
      }

      let bandGeo = new THREE.LatheGeometry(topPoints, 100);
      let topBand = new THREE.Mesh(
        bandGeo.clone(),
        Gallery.materials.gold
      );
      topBand.position.set(x, 0.9 + yOffset, i * 2 - 7);
      topBand.name = `${pillar.name}:topBand`
      pillar.add(topBand);

      let bottomBand = new THREE.Mesh(
        bandGeo.clone(),
        Gallery.materials.gold
      );
      bottomBand.scale.y = -1;
      bottomBand.position.set(x, capHeight, i * 2 - 7);
      bottomBand.name = `${pillar.name}:bottomBand`
      pillar.add(bottomBand);

      columns.add(pillar);
    });
  }
  columns.position.y -= .05;

  return columns;
};