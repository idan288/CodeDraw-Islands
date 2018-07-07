var THREE = require('../lib/three');
require('../lib/GeometryUtils');

class TextObject {
    constructor(text, fontName, size, color, fontWeight, mirror) {
        this.text = text;
        this.fontName = fontName;
        this.color = color;
        this.size = size;
        this.fontWeight = fontWeight;
        this.mirror = mirror;
        this.textMesh1 = null;
        this.textMesh2 = null;
        this.textGroup = new THREE.Group();
        this.font = null;
        this.bevelThickness = 0.2;
        this.bevelSize = 0.1;
        this.bevelSegments = .2;
        this.bevelEnabled = false;
        this.hover = 3;
        this.curveSegments = 1;
        this.height = 1;
        this.materials = [
            new THREE.MeshPhongMaterial({
                color: "black",
                flatShading: true
            }), // front
 
        ];
        this.loadFont();
    }

    loadFont() {
        let loader = new THREE.FontLoader();
        let that = this;
        loader.load('fonts/' + this.fontName + '_' + this.fontWeight + '.typeface.json', function (response) {
            that.font = response;
            that.refreshText(response);
        });

    }

    refreshText(response) {
        this.textGroup.remove(this.textMesh1);
        if (this.mirror) this.textGroup.remove(this.textMesh2);
        if (!this.text) return;
        this.createText();
    }

    createText() {
        let textGeo = new THREE.TextGeometry(this.text, {
            font: this.font,
            size: this.size,
            height: this.height,
            curveSegments: this.curveSegments,
            bevelThickness: this.bevelThickness,
            bevelSize: this.bevelSize,
            bevelEnabled: this.bevelEnabled,
            material: 0,
            extrudeMaterial: 1
        });
        textGeo.computeBoundingBox();
        textGeo.computeVertexNormals();
        // "fix" side normals by removing z-component of normals for side faces
        // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
        if (!this.bevelEnabled) {
            let triangleAreaHeuristics = 0.1 * (this.height * this.size);
            for (let i = 0; i < textGeo.faces.length; i++) {
                let face = textGeo.faces[i];
                if (face.materialIndex == 1) {
                    for (let j = 0; j < face.vertexNormals.length; j++) {
                        face.vertexNormals[j].z = 0;
                        face.vertexNormals[j].normalize();
                    }
                    let va = textGeo.vertices[face.a];
                    let vb = textGeo.vertices[face.b];
                    let vc = textGeo.vertices[face.c];
                    let s = THREE.GeometryUtils.triangleArea(va, vb, vc);
                    if (s > triangleAreaHeuristics) {
                        for (let j = 0; j < face.vertexNormals.length; j++) {
                            face.vertexNormals[j].copy(face.normal);
                        }
                    }
                }
            }
        }

        let centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
        this.textMesh1 = new THREE.Mesh(textGeo, this.materials);
        this.textMesh1.position.x = centerOffset;
        this.textMesh1.position.y = this.hover;
        this.textMesh1.position.z = 0;
        this.textMesh1.rotation.x = 0;
        this.textMesh1.rotation.y = Math.PI * 2;
        this.textGroup.add(this.textMesh1);
        if (this.mirror) {
            this.textMesh2 = new THREE.Mesh(textGeo, this.materials);
            this.textMesh2.position.x = centerOffset;
            this.textMesh2.position.y = -this.hover;
            this.textMesh2.position.z = this.height;
            this.textMesh2.rotation.x = Math.PI;
            this.textMesh2.rotation.y = Math.PI * 2;
            this.textGroup.add(this.textMesh2);
        }
    }
}

module.exports = TextObject;