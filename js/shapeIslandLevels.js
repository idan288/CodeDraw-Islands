var THREE = require('../lib/three');
require('../lib/Water');
var OrbitControls = require('../lib/OrbitControls');
var Detector = require('../lib/Detector');
var Step = require('../js/step');
var TextObject = require('../js/textObject');

var extrudeSettings = {
    amount: .2,
    bevelEnabled: false,
    bevelSegments: 0.5,
    steps: 2,
    bevelSize: 1,
    bevelThickness: 1
};

if (!Detector.webgl) Detector.addGetWebGLMessage();

var container;
var camera, scene, renderer, light;
var controls, water, sphere, cubeMap;
var fishes = [];
var fishAmount = 30;

// Water parameters:
var parameters = {
    oceanSide: 2000,
    size: 10.0,
    distortionScale: 10.7,
    alpha: 0.5
};

var steps = [];
var STEPSAMOUNT = 10;
var speed = {
    x: 0,
    y: 0
};
var smoothing = 10;
var angleFin = 0;

init();
animate();

function init() {
    var els = document.querySelectorAll('path');
    Array.prototype.slice.call(els).forEach(function (el) {
        el.setAttribute('stroke', 'black');
        el.setAttribute('stroke-width', '1.5');
        el.setAttribute('fill', 'transparent');
    });

    TweenMax.fromTo($('#world'), 2, {
        width: "0%"
    }, {
        width: "100%",
        ease: Power4.easeInOut,
        onComplete: playStepAnimate
    });

    TweenMax.fromTo([$('#dist'), $('#tex')], 3, {
        opacity: 0,
        ease: Power4.easeInOut,
    }, {
        opacity: 1,
        ease: Power4.easeInOut,
    });

    container = document.getElementById('world');
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);


    scene = new THREE.Scene();
    //  scene.fog = new THREE.FogExp2(0xff0000, 0.001);
    //scene.fog = new THREE.Fog(0xd84242, 100, 950);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(0, 16, 484);

    // A hemisphere light is a gradient colored light;
    // the first parameter is the sky color, the second parameter is the ground color,
    // the third parameter is the intensity of the light
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

    // an ambient light modifies the global color of a scene and makes the shadows softer
    let ambientLight = new THREE.AmbientLight(0xdc8874, .5);
    scene.add(ambientLight);

    // A directional light shines from a specific direction.
    // It acts like the sun, that means that all the rays produced are parallel.
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    // Set the direction of the light
    shadowLight.position.set(150, 350, 350);

    // Allow shadow casting
    shadowLight.castShadow = true;

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // define the resolution of the shadow; the higher the better,
    // but also the more expensive and less performance
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    // to activate the lights, just add them to the scene
    scene.add(hemisphereLight);
    scene.add(shadowLight);
    light = shadowLight;

    //

    setWater();

    //

    setSkybox();

    //
    setSteps();

    miniTriangleFish();

    //setText();

    var geometry = new THREE.IcosahedronGeometry(20, 2);

    for (var i = 0, j = geometry.faces.length; i < j; i++) {

        geometry.faces[i].color.setHex(Math.random() * 0xffffff);

    }

    var material = new THREE.MeshPhongMaterial({
        vertexColors: THREE.FaceColors,
        shininess: 10,
        //envMap: cubeMap,
        side: THREE.DoubleSide
    });

    sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    scene.add(sphere);
    //

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 10, 0);
    controls.enablePan = false;
    //controls.minDistance = 40.0;
    controls.maxDistance = 900.0;
    camera.lookAt(controls.target);


    window.addEventListener('resize', onWindowResize, false);
    //playStepAnimate();

}

function setWater() {

    var waterGeometry = new THREE.PlaneBufferGeometry(parameters.oceanSide * 5, parameters.oceanSide * 5);

    water = new THREE.Water(
        waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('waternormals.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            alpha: parameters.alpha,
            sunDirection: light.position.clone().normalize(),
            sunColor: 0xffffff,
            waterColor: 0x6b63d6,
            distortionScale: parameters.distortionScale,
            fog: scene.fog !== undefined
        }
    );

    water.rotation.x = -Math.PI / 2;
    water.receiveShadow = true;

    scene.add(water);

}

function setSkybox() {

    var cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('js/skybox/');

    cubeMap = cubeTextureLoader.load([
        'nx.jpg', 'px.jpg',
        'ny.jpg', 'py.jpg',
        'nz.jpg', 'pz.jpg',
    ]);

    var cubeShader = THREE.ShaderLib['cube'];
    cubeShader.uniforms['tCube'].value = cubeMap;

    var skyBoxMaterial = new THREE.ShaderMaterial({
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        side: THREE.BackSide
    });

    var skyBoxGeometry = new THREE.BoxBufferGeometry(
        parameters.oceanSide * 5 + 100,
        parameters.oceanSide * 5 + 100,
        parameters.oceanSide * 5 + 100);

    var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);

    // scene.add(skyBox);
}

var isIdeling = false;
var time = 0;
var idelingPos = {
    x: 0,
    y: 10,
    z: 420
};

function fishMove() {
    TweenMax.killTweensOf(fish.rotation);
    time += .03;


    if (isIdeling || Math.random() < .98) return;

    isIdeling = true;
    var tx = Math.random() * ((Math.PI / 12) - (-Math.PI / 12)) + -Math.PI / 12;
    // random number in the range (Math.PI / 2 + Math.PI / 8) to (Math.PI / 2 - Math.PI / 8).
    var ty = Math.random() * ((Math.PI / 2 + Math.PI / 8) - (Math.PI / 2 - Math.PI / 8)) + (Math.PI / 2 - Math.PI / 8);
    var tz = Math.random() * ((Math.PI / 12) - (-Math.PI / 12)) + -Math.PI / 12;
    var speed = .5 + Math.random() * 2;
    TweenMax.to(idelingPos, speed, {
        x: tx,
        y: ty,
        z: tz,
        ease: Power4.easeOut,
        onUpdate: () => {
            //fish.rotation.x = idelingPos.x;
            //  fish.rotation.y = idelingPos.y;
            // fish.rotation.z = idelingPos.z;
        },
        onComplete: () => {
            isIdeling = false;
        }
    });
}

function setSteps() {
    /*
    step1 = new Step(0xd71427, 0xd8d0d1);
    step1.mainCylinderMesh.position.set(0, -10, 446);
    steps.push(step1);
    scene.add(step1.mainCylinderMesh);

    step2 = new Step(0xd71427, 0xd8d0d1);
    step2.mainCylinderMesh.position.set(0, -10, 420);
    steps.push(step2);
    scene.add(step2.mainCylinderMesh);
    */
    let step;
    let zDistance = 446;
    let text1;

    for (let i = 1; i <= STEPSAMOUNT; i++) {
        step = new Step(0xd71427, 0xd8d0d1);
        step.mainCylinderMesh.position.set(0, -10, zDistance);
        steps.push(step);
        scene.add(step.mainCylinderMesh);
        text1 = new TextObject("Level " + i, "helvetiker", 1.4, 0x000000, "bold", true);
        text1.textGroup.position.set(0, 0, zDistance);
        scene.add(text1.textGroup);
        zDistance -= 26;
    }

}

function setText() {
    let text1 = new TextObject("Level 1", "helvetiker", 1.4, 0x000000, "regular", true);
    text1.textGroup.position.set(0, 0, 446);
    scene.add(text1.textGroup);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);
    //fishMove();
    var s2 = 25 / 100;
    angleFin += s2;
    var sideFinsCycle = -Math.sin(angleFin / 5);

    for (i = 0; i < fishAmount; i++) {
        fishes[i].rotation.x = sideFinsCycle * .5;
        fishes[i].position.x -= 0.09;
    }

    render();
}

function addShape(shape, color, x, y, z, rx, ry, rz, s) {
    /*  var geometry = new THREE.ShapeBufferGeometry(shape);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide }));
        mesh.position.set(x, y, z - 125);
        mesh.rotation.set(rx, ry, rz);
        mesh.scale.set(s, s, s);
    */
    // lines

    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({
            color: color,
            flatShading: true,
            side: THREE.DoubleSide
        })
    );
    mesh.position.set(x, y, z - 75);

    mesh.scale.set(s, s, s);
    return mesh;
}

function miniTriangleFish() {
    let triangleShape;
    let triangleMesh;
    let z = 400;
    let y = -10;
    let x = 0;

    for (i = 0; i < fishAmount; i++) {
        triangleShape = new THREE.Shape();
        triangleShape.moveTo(40, 20);
        triangleShape.lineTo(60, 20);
        triangleShape.lineTo(55, 30);
        triangleShape.lineTo(40, 20); // close path
        triangleMesh = addShape(
            triangleShape,
            "black", -180,
            0,
            0,
            0,
            0,
            0,
            1
        );

        triangleMesh.position.set(x, y, z);
        // triangleMesh.rotation.z = Math.PI;
        triangleMesh.scale.set(0.1, 0.1, 0.1);
        fishes.push(triangleMesh);
        scene.add(triangleMesh);
        x += Math.floor(Math.random() * 3 + 1);
        // y += 3;
        z += Math.floor(Math.random() * 3 + 1);
    }

}

function render() {

    var time = performance.now() * 0.001;

    sphere.position.y = Math.sin(time) * 20 + 5;
    sphere.rotation.x = time * 0.5;
    sphere.rotation.z = time * 0.51;

    water.material.uniforms.time.value += 1.0 / 60.0;
    water.material.uniforms.size.value = parameters.size;
    water.material.uniforms.distortionScale.value = parameters.distortionScale;
    water.material.uniforms.alpha.value = parameters.alpha;
    renderer.render(scene, camera);
}

function playStepAnimate() {
    for (let i = 0; i < steps.length - 5; i++) {
        TweenMax.to(steps[i].mainCylinderMesh.position, 3, {
            y: -6,
            ease: Back.easeOut.config(1.7),
        });
    }
    TweenMax.to(camera.position, 3, {
        z: camera.position.z - 26 * 4,
        ease: Power0.easeNone,
    });
}