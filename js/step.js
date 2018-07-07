var THREE = require('../lib/three');
require("../js/threeConstants");

class Step {
    constructor(mainColor, secondColor) {
        let mainCylinderGeo = new THREE.CylinderGeometry(10, 10, 15, 6);
        let mainCylinderMat = new THREE.MeshLambertMaterial({
            color: mainColor,
            flatShading: true
        });
        this.mainCylinderMesh = new THREE.Mesh(mainCylinderGeo, mainCylinderMat);

        let secondCylinderGeo = new THREE.CylinderGeometry(8, 8, 6, 6);
        let secondCylinderMat = new THREE.MeshLambertMaterial({
            color: secondColor,
            flatShading: true,
            side: THREE.DoubleSide,
        });
        this.secondCylinderMesh = new THREE.Mesh(secondCylinderGeo, secondCylinderMat);

        this.mainCylinderMesh.add(this.secondCylinderMesh);
        this.secondCylinderMesh.position.set(0, 5.3, 0);
        this.mainCylinderMesh.castShadow = true;
    }
}

module.exports = Step;