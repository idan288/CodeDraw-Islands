class MeshInfo {
    constructor(mesh, indexInArray, title, text, titleColor, textColor, btnClass, href) {
        this.mesh = mesh;
        this.indexInArray = indexInArray;
        this.position = {
            x: mesh.position.x,
            y: mesh.position.y,
            z: mesh.position.z
        };
        this.title = title;
        this.text = text;
        this.titleColor = titleColor;
        this.textColor = textColor;
        this.btnClass = btnClass;
        this.href = href;
    }
}

module.exports = MeshInfo;