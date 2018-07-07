// Imports:
var MeshInfo = require('./meshInfo');
var THREE = require('../lib/three');
var OBJLoader = require('../lib/OBJLoader');
var CustomMesh = require('../lib/CustomMeshFlat');
var MTLLoader = require('../lib/MTLLoader');
var OrbitControls = require('../lib/OrbitControls');
var ProgressBar = require('../lib/progressbar');
var GLTFLoader = require('../lib/GLTFLoader');
var GSPreloader = require('../lib/GSPreloader');

// Constants:
const islandArray = [];
const islandsMap = new Map();
const middleXPoint = 0;
const distanceToRight = 200;
const distanceToLeft = -distanceToRight;
const Colorss = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xf5986e,
  brownDark: 0x23190f,
  blue: 0x68c3c0,
  black: 0x000000
};
const yellowMat = new THREE.MeshPhongMaterial({
  color: 0x978617,
  flatShading: true
});

const pinkMat = new THREE.MeshPhongMaterial({
  color: 0xe0877e, //0xe0a79f,
  flatShading: true
});

const redMat = new THREE.MeshPhongMaterial({
  color: 0x630d15,
  flatShading: true
});

const whiteMat = new THREE.MeshPhongMaterial({
  color: 0xd8d0d1,
  flatShading: true
});

const blackMat = new THREE.MeshPhongMaterial({
  color: 0x222222,
  flatShading: true
});
const greenMat = new THREE.MeshPhongMaterial({
  color: 0x105a0c,
  flatShading: true
});
const brownMat = new THREE.MeshPhongMaterial({
  color: 0x2e2019, //0x4b342a,
  flatShading: true
});

const lightBrownMat = new THREE.MeshPhongMaterial({
  color: 0x664f4a,
  flatShading: true
});

const blueMat = new THREE.MeshPhongMaterial({
  color: 0x151b47,
  flatShading: true
});
// End constants.

// Global variabels:
let scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  HEIGHT,
  WIDTH,
  renderer,
  container,
  objLoader,
  jsonLoader,
  objectLoader,
  chair,
  orbit,
  gltfLoader,
  home;

var preloader = new GSPreloader({
  radius: 42,
  dotSize: 15,
  dotCount: 10,
  colors: ["#61AC27", "#555", "purple", "#FF6600"], //have as many or as few colors as you want.
  boxOpacity: 0,
  boxBorder: "1px solid #AAA",
  animationOffset: 1.8, //jump 1.8 seconds into the animation for a more active part of the spinning initially (just looks a bit better in my opinion)
});


$('#goBtn').click(makeLoadAnimation);

window.addEventListener("load", init);

objLoader = new THREE.OBJLoader();
jsonLoader = new THREE.JSONLoader();
objectLoader = new THREE.ObjectLoader();
gltfLoader = new THREE.GLTFLoader();

function init() {
  makeLoadAnimation();
  preloader.active(false);
  // set up the scene, the camera and the renderer  
  createScene();

  // add the lights
  createLights();

  //add the objects
  //createPlane();

  //add the listener

  // start a loop that will update the objects' positions
  // and render the scene on each frame  

  loop();
}

let c1, c2, c3, c4;

function createScene() {
  // Get the width and the height of the screen,
  // use them to set up the aspect ratio of the camera
  // and the size of the renderer.
  HEIGHT = window.innerHeight * 0.6;
  WIDTH = window.innerWidth * 0.6;

  // Create the scene
  scene = new THREE.Scene();

  // Add a fog effect to the scene; same color as the
  // background color used in the style sheet
  //scene.fog = new THREE.Fog(0x00d0aa, 100, 950);
  //let fogcol = 0xcefaeb;//0x1c0403
  //scene.fog = new THREE.FogExp2(fogcol, 0.0028); //new THREE.Fog(fogcol, 300, 1000);
  // Create the camera
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  // Set the position of the camera
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  // Create the renderer
  renderer = new THREE.WebGLRenderer({
    // Allow transparency to show the gradient background
    // we defined in the CSS
    alpha: true,

    // Activate the anti-aliasing; this is less performant,
    // but, as our project is low-poly based, it should be fine :)
    antialias: true
  });

  // Define the size of the renderer; in this case,
  // it will fill the entire screen
  renderer.setSize(WIDTH, HEIGHT);

  // Enable shadow rendering
  renderer.shadowMap.enabled = true;

  // Add the DOM element of the renderer to the
  // container we created in the HTML
  container = document.getElementById("world");
  container.appendChild(renderer.domElement);

  /*   let mtlLoader = new THREE.MTLLoader();
       mtlLoader.load("island.mtl", function (materials) {
           console.log(materials);
           materials.preload();
   
           objLoader.setMaterials(materials);
           objLoader.load('island.obj', function (obj) {
               console.log(obj);
              //obj.material = materials;
               obj.scale.set(6, 6, 6);
               obj.position.set(0, 50, 0);
               
               changeMatandPosToMeshName(obj, "Cloud", whiteMat, new THREE.Vector3(25, 8, 10), new THREE.Vector3(0.8, 0.8, 1));
               
               scene.add(obj);
           });
       });
   */
  orbit = new THREE.OrbitControls(camera, renderer.domElement);
  orbit.enableZoom = true;
  orbit.enablePan = false;
  orbit.rotateSpeed = 0;
  orbit.zoomSpeed = 2;
  //orbit.enabled = false;
  //  orbit.autoRotate = true;
  //  orbit.autoRotateSpeed = 0.6;

  //orbit.minPolarAngle = Math.PI * 0.3;
  // orbit.maxPolarAngle = Math.PI * 0.45;

  //orbit.minAzimuthAngle = -Math.PI * 0.2; // radians
  //orbit.maxAzimuthAngle = Math.PI * 0.2; // radians

  //orbit.minDistance = 4;
  // orbit.maxDistance = 3;

  orbit.target.set(0, 5, 0);
  orbit.update();

  objectLoader.load("isalnd-baserock.json", function (obj) {
    obj.scale.set(.6, .6, .6);
    obj.position.set(400, -150, -600);
    obj.children[0].name = "blueWorld";
    chair = obj;
    c1 = obj.clone();
    c2 = obj.clone();
    c3 = obj.clone();
    c4 = obj.clone();
    c1.position.set(200, -150, -600);
    c1.children[0].name = "brownWorld";
    c2.position.set(0, -150, -600);
    c2.children[0].name = "redWorld";
    c3.position.set(600, -150, -600);
    c3.children[0].name = "blackWorld";
    c4.position.set(800, -150, -600);
    c4.children[0].name = "yellowWorld";
    changeMatandPosToMeshName(obj, "lal", blueMat, {
      x: 10,
      y: 20
    });
    changeMatandPosToMeshName(c1, "lal", brownMat, {
      x: 10,
      y: 20
    });
    changeMatandPosToMeshName(c2, "lal", redMat, {
      x: 10,
      y: 20
    });
    changeMatandPosToMeshName(c3, "lal", blackMat, {
      x: 10,
      y: 20
    });
    changeMatandPosToMeshName(c4, "lal", yellowMat, {
      x: 10,
      y: 20
    });
    scene.add(c1);
    addIslandArrayAndMap(c1, "Brown Island", "<p>This Brown island include the basic to make you a great codeDrawer.</p><p>This island will make you learn all the basic commands.</p><p>Lest begin...</p>",
      "#8B4837", "#a54a30", "btn btn-outline-success", "shapeLevels.html");
    scene.add(c2);
    addIslandArrayAndMap(c2, "Shape Island", "<p>This Shape island include the basic to make you a great codeDrawer.</p><p>This island will make you learn all the basic commands.</p><p>Lest begin...</p>",
      "#AA3939", "#DC3545", "btn btn-outline-danger", "shapeLevels.html");
    scene.add(c3);
    addIslandArrayAndMap(c3, "Black Island", "<p>This Black island include the basic to make you a great codeDrawer.</p><p>This island will make you learn all the basic commands.</p><p>Lest begin...</p>",
      "#222222", "#1C1917", "btn btn-outline-dark", "shapeLevels.html");
    scene.add(c4);
    addIslandArrayAndMap(c4, "Yellow Island", "<p>This Yellow island include the basic to make you a great codeDrawer.</p><p>This island will make you learn all the basic commands.</p><p>Lest begin...</p>",
      "#F0AC00", "#CC9200", "btn btn-outline-warning", "shapeLevels.html");
    scene.add(chair);
    addIslandArrayAndMap(obj, "Blue Island", "<p>This Blue island include the basic to make you a great codeDrawer.</p><p>This island will make you learn all the basic commands.</p><p>Lest begin...</p>",
      "#3055a5", "#293D66", "btn btn-outline-primary", "shapeLevels.html");
    changeLabelsPos();

    // Triangle
    var triangleShape = new THREE.Shape();
    triangleShape.moveTo(80, 20);
    triangleShape.lineTo(40, 80);
    triangleShape.lineTo(120, 80);
    triangleShape.lineTo(80, 20); // close path
    let triangleMesh = addShape(
      triangleShape,
      0xc0392b, -180,
      0,
      0,
      0,
      0,
      0,
      1
    );

    triangleMesh.position.set(48, 40, -33);
    triangleMesh.rotation.z = Math.PI;
    triangleMesh.scale.set(0.5, 0.5, 0.5);
    c2.children[0].children[0].add(triangleMesh);

    // Circle
    var arcShape = new THREE.Shape();
    arcShape.moveTo(50, 10);
    arcShape.absarc(10, 10, 40, 0, Math.PI * 2, false);
    let circleMesh = addShape(arcShape, 0x808028, 150, 0, 0, 0, 0, 0, 1);
    circleMesh.position.set(-24, 18, -30);
    circleMesh.scale.set(0.5, 0.5, 0.5);
    c2.children[0].children[0].add(circleMesh);

    // Square
    var sqLength = 80;
    var squareShape = new THREE.Shape();
    squareShape.moveTo(0, 0);
    squareShape.lineTo(0, sqLength);
    squareShape.lineTo(sqLength, sqLength);
    squareShape.lineTo(sqLength, 0);
    squareShape.lineTo(0, 0);
    let squareMesh = addShape(squareShape, 0x1b4964, 150, 100, 0, 0, 0, 0, 1);
    squareMesh.position.set(-70, 0, -23);
    squareMesh.scale.set(0.5, 0.5, 0.5);
    c2.children[0].children[0].add(squareMesh);

    // Home
    home = new THREE.Mesh();

    // Roof
    let roofShape = new THREE.Shape();
    roofShape.moveTo(40, 20);
    roofShape.lineTo(120, 20);
    roofShape.lineTo(80, 70);
    roofShape.lineTo(40, 20); // close path
    let roofMesh = addShape(roofShape, 0x630d15, -180, 0, 0, 0, 0, 0, 1);
    roofMesh.position.set(12, 61, -20);
    home.add(roofMesh);

    // House Body
    let houseBodyLength = 80;
    let houseBodyShape = new THREE.Shape();
    houseBodyShape.moveTo(0, 0);
    houseBodyShape.lineTo(0, houseBodyLength);
    houseBodyShape.lineTo(houseBodyLength, houseBodyLength);
    houseBodyShape.lineTo(houseBodyLength, 0);
    houseBodyShape.lineTo(0, 0);
    let houseBodyMesh = addShape(houseBodyShape, 0x2c3e50, 150, 100, 0, 0, 0, 0, 1);
    houseBodyMesh.position.set(52, 0, -20);
    home.add(houseBodyMesh);

    // Window
    //left
    let leftWindowLength = 15;
    let leftWindowShape = new THREE.Shape();
    leftWindowShape.moveTo(0, 0);
    leftWindowShape.lineTo(0, leftWindowLength);
    leftWindowShape.lineTo(leftWindowLength, leftWindowLength);
    leftWindowShape.lineTo(leftWindowLength, 0);
    leftWindowShape.lineTo(0, 0);
    let leftWindowMesh = addShape(leftWindowShape, 0x176931, 150, 100, 0, 0, 0, 0, 1);
    leftWindowMesh.position.set(110, 50, -25);
    home.add(leftWindowMesh);

    //right
    let rightWindowMesh = leftWindowMesh.clone();
    rightWindowMesh.position.set(60, 50, -25);
    home.add(rightWindowMesh);

    // Door
    let doorLengthHor = 20;
    let doorLengthVer = 40;
    let doorShape = new THREE.Shape();
    doorShape.moveTo(0, 0);
    doorShape.lineTo(0, doorLengthVer);
    doorShape.lineTo(doorLengthHor, doorLengthVer);
    doorShape.lineTo(doorLengthHor, 0);
    doorShape.lineTo(0, 0);
    let doorMesh = addShape(doorShape, 0x341818, 150, 100, 0, 0, 0, 0, 1);
    doorMesh.position.set(80, 0, -25);
    home.add(doorMesh);

    home.rotation.y += Math.PI / 3;
    home.position.set(20, 0, 40);
    c2.children[0].children[0].add(home);

    let grid = new THREE.GridHelper(100, 5, 0x00000c, 0x00000c);

    grid.rotation.x = Math.PI / 2;
    grid.rotation.x = Math.PI / 2;
    grid.rotation.x = Math.PI / 2;

    var geometry = new THREE.PlaneGeometry(100, 100, 32);
    var material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    var plane = new THREE.Mesh(geometry, material);

    grid.position.z -= 2;
    grid.position.x -= 1;
    plane.position.set(-30, 50, -20);
    plane.add(grid);
    // c2.children[0].children[0].add(plane);


  });

  gltfLoader.load("wolf.glb", function (obj) {
    obj.scene.children[0].scale.set(200, 200, 200);
    obj.scene.children[0].rotation.y = Math.PI / 2 + Math.PI / 4;
    obj.scene.children[0].position.set(0, 50, 20);
    c1.children[0].children[0].add(obj.scene.children[0]);

    moveIslndsToCenter();
  });

  // Listen to the screen: if the user resize it
  // we have to update the camera and the renderer size
  window.addEventListener("resize", handleWindowResize, false);
  window.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("click", mouseClick, false);
  handleWindowResize();
}
var hatMan;

function changeMatandPosToMeshName(obj, meshName, material, pos, size) {
  let name;
  let x = pos.x;
  meshName = meshName.toLowerCase();
  obj.children.forEach(element => {
    if (element instanceof THREE.Mesh) {
      name = element.name.toLowerCase();
      if (name.includes(meshName)) {
        element.material = material;
        element.scale.set(size.x, size.y, size.z);
        element.position.set(x, pos.y, pos.z);
        x -= 30;
      } else if (name.includes("rock")) {
        element.material = blackMat;
      } else if (name.includes("bush")) {
        element.material = greenMat;
      } else if (name.includes("sand")) {
        element.material = brownMat;
      } else if (name.includes("leav")) {
        element.material = greenMat;
      } else {
        element.material = brownMat;
      }
    } else if (element instanceof THREE.Object3D) {
      element.children[0].material = material;
      //  element.children[0].scale.set(2, 2, 2);
    }
  });
}

//Lights vars:
let hemisphereLight, shadowLight, ambientLight;

function createLights() {
  // A hemisphere light is a gradient colored light;
  // the first parameter is the sky color, the second parameter is the ground color,
  // the third parameter is the intensity of the light
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0xffffff, 1.6);

  // an ambient light modifies the global color of a scene and makes the shadows softer
  ambientLight = new THREE.AmbientLight(0, 0.5);
  scene.add(ambientLight);

  // A directional light shines from a specific direction.
  // It acts like the sun, that means that all the rays produced are parallel.
  shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
  // Set the direction of the light
  shadowLight.position.set(150, 350, 350);

  // Allow shadow casting
  shadowLight.castShadow = true;

  // define the visible area of the projected shadow
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = 400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  // define the resolution of the shadow; the higher the better,
  // but also the more expensive and less performance
  shadowLight.shadow.mapSize.width = 1920;
  shadowLight.shadow.mapSize.height = 1080;

  // to activate the lights, just add them to the scene
  scene.add(hemisphereLight);
  scene.add(shadowLight);
}

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();

  changeLabelsPos();
}

function changeLabelsPos() {
  let vector;
  for (let i = 0; i < islandArray.length; i++) {
    vector = toScreenPosition(islandArray[i], camera);
    if (islandArray[i] != islandCur) {
      TweenMax.to($("#" + getName(islandArray[i])), 0, {
        opacity: 1,
        left: vector.x - 120 + "px",
        top: vector.y - 110 + "px",
        ease: Back.easeOut.config(3.7)
      });
    } else {
      TweenMax.to($("#" + getName(islandArray[i])), 0, {
        opacity: 0,
        left: vector.x - 120 + "px",
        top: vector.y - 110 + "px",
        ease: Back.easeOut.config(3.7)
      });
    }
  }
}

function getName(obj) {
  while (obj != null) {
    if (obj.name.includes("World")) {
      return obj.name;
    }
    obj = obj.children[0];
  }
  return "";
}

function loop() {
  orbit.update();
  updateRAy();

  if (home != null) {
    // home.rotation.y += 0.01;
  }

  if (hatMan != null) {
    //  hatMan.rotation.z += 0.01;
  }
  // render the scene
  renderer.render(scene, camera);

  // call the loop function again
  requestAnimationFrame(loop);
}

function createPlane() {
  let floorCol = Colors.green_d;
  let meshi = new CustomMesh.PlaneMesh(1200, 1200, 8, floorCol);
  let vertices = meshi.geometry.vertices;
  for (let i = 0; i < vertices.length; i++) {
    let v = vertices[i];
    v.x += Math2.rangeRandom(-10, 10);
    v.y += Math2.rangeRandom(-10, 10);
    v.z += Math2.rangeRandom(-10, 10);
  }
  meshi.geometry.computeFaceNormals();
  meshi.geometry.verticesNeedUpdate = true;
  meshi.geometry.colorsNeedUpdate = true;
  //
  //this.mesh.geometry.computeVertexNormals();
  meshi.rotation.x = -Math.PI / 2;

  scene.add(meshi);
}

var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var INTERSECTED = null;
var intersects;
var lastClickIsland = null;

function updateRAy() {
  raycaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  intersects = raycaster.intersectObjects(scene.children, true);
}
var islandCur = null;
var exitComplete = false;
var enterComplete = false;

function moveIslndsToCenter() {
  let dis = chair.position.x > middleXPoint ? distanceToLeft : distanceToRight;
  moveIslands(chair, dis, true);
}

// TODO:: change make a callback for each object/mesh so when click the function invoke.
function mouseClick() {
  //  $("#dist2").finish();

  if (intersects.length > 0) {
    let islandUserClick = findIslandInArray(intersects[0].object);
    changeContext(islandUserClick);

    if (INTERSECTED != null && INTERSECTED != islandUserClick) {
      changeUnSelectItemProperties(islandCur, true);
    }

    if (INTERSECTED != islandUserClick) {
      //  if (INTERSECTED) INTERSECTED.material = (INTERSECTED.currentHex);
      INTERSECTED = islandUserClick;

      // move islands right or left so the selected island will be in the middle of the screen.
      islandCur = islandUserClick;

      if (islandCur.position.x != middleXPoint) { // the selected island in the middle , no movement require.
        let dis = islandCur.position.x > middleXPoint ? distanceToLeft : distanceToRight;
        moveIslands(islandCur, dis);
      } else { // make the selected island label to disappear.
        let divID = "#" + getName(islandUserClick);
        TweenMax.to($(divID), 0.7, {
          opacity: 0,
          top: $(divID).position().top - 10 + "px",
          ease: Power4.easeOut
        });
      }

      TweenMax.to(islandCur.scale, 0.7, {
        y: .9,
        x: .9,
        z: .9,
        onStart: () => {
          makeContentShow(true);
        },
        // ease: Bounce.easeIn,
      });
      TweenMax.to(islandCur.position, 0.2, {
        z: -300,
        y: -200,
        //ease: Bounce.easeIn,
      });
      INTERSECTED = islandUserClick;
    }
  } else {
    if (INTERSECTED) {
      changeUnSelectItemProperties(islandCur);
    }
    moveIslndsToCenter();
    lastClickIsland = islandCur;
    INTERSECTED = null;
    islandCur = null;
  }
}


function changeUnSelectItemProperties(island, isNewItem) {

  TweenMax.to([island.scale], 0.7, {
    y: .6,
    x: .6,
    z: .6,
    // ease: Bounce.easeOut,
  });

  TweenMax.to([island.position], 0.7, {
    z: islandsMap.get(island).position.z,
    y: islandsMap.get(island).position.y,
    // ease: Bounce.easeOut,
    onUpdate: () => {
      changeLabelsPos();
      let divID = "#" + getName(island);
      $(divID).addClass('animated lightSpeedIn');
      $(divID).css({
        opacity: 1
      });
    },
    onComplete: () => {
      let divID = "#" + getName(island);
      $(divID).removeClass('animated lightSpeedIn');
    },
    onStart: () => {
      if (isNewItem === true) {
        //makeContentShow(true);
      } else {
        makeContentShow(false);
      }
    }
  });

}

function onMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  event.preventDefault();
  mouse.x = event.clientX / window.innerWidth * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

var extrudeSettings = {
  amount: 8,
  bevelEnabled: true,
  bevelSegments: 2,
  steps: 2,
  bevelSize: 1,
  bevelThickness: 1
};

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
  mesh.rotation.set(rx, ry, rz);
  mesh.scale.set(s, s, s);
  return mesh;
}

function toScreenPosition(obj, camera) {
  var vector = new THREE.Vector3();
  var widthHalf = 0.5 * renderer.context.canvas.width;
  var heightHalf = 0.5 * renderer.context.canvas.height;

  obj.updateMatrixWorld();
  vector.setFromMatrixPosition(obj.matrixWorld);
  vector.project(camera);
  vector.x = vector.x * widthHalf + widthHalf;
  vector.y = -(vector.y * heightHalf) + heightHalf;

  return {
    x: vector.x,
    y: vector.y
  };
}

function addIslandArrayAndMap(island, title, text, titleColor, textColor, btnClass, href) {
  islandArray.push(island);
  islandsMap.set(island, new MeshInfo(island, islandArray.length - 1, title, text, titleColor, textColor, btnClass, href));
}

function moveIslands(island, distance, justMove) {
  let loopLength = Math.abs((island.position.x - middleXPoint) / distance);
  let vector;
  let newX;
  let divID;
  for (let i = 0; i < islandArray.length && loopLength > 0; i++) {
    newX = islandArray[i].position.x + loopLength * distance;
    TweenMax.to(islandArray[i].position, 0.7, {
      x: newX,
      ease: Power1.easeOut,
      onUpdate: () => {
        vector = toScreenPosition(islandArray[i], camera);
        divID = "#" + getName(islandArray[i]);
        if (islandArray[i] != island || justMove) { // not the selected island.       
          TweenMax.to($(divID), 0.3, {
            opacity: 1,
            left: vector.x - 120 + "px",
            top: vector.y - 110 + "px",
            ease: Back.easeOut.config(3.7)
          });
        } else { // if this is the selected island, we want the label will disappear.
          TweenMax.to($(divID), .3, {
            opacity: 0,
            top: $(divID).position().top - 10 + "px",
            ease: Power4.easeOut
          });
        }
      }
    });
  }
}

function findIslandInArray(item) {
  let island, found = false;
  while (!found && item != null) {
    for (let i = 0; i < islandArray.length && !found; i++) {
      if (islandArray[i] === item) {
        return item;
      }
    }
    item = item.parent;
  }
  return item;
}


let gl = true;

function myAnimate() {
  if (gl)
    preloader.active(true);
  else
    preloader.active(false);

  gl = !gl;
}

$.fn.extend({
  animateCss: function (animationName, callback) {
    var animationEnd = (function (el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));

    this.addClass('animated ' + animationName).one(animationEnd, function () {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
    });

    return this;
  },
});

function makeContentShow(show) {
  if (show == true) {
    TweenMax.fromTo($("#dist2"), 0.7, {
      autoAlpha: 0,
      left: "-2%",
    }, {
      autoAlpha: 1,
      left: "2%",
      ease: Elastic.easeOut.config(1, 0.5)
    });
  } else {
    TweenMax.fromTo($("#dist2"), .7, {
      autoAlpha: 1,
      left: "2%",
    }, {
      autoAlpha: 0,
      left: "-2%",
    });
  }
}

function changeContext(island) {
  if (islandsMap.has(island)) {
    let islandInfo = islandsMap.get(island);
    $("#distValue2").text(islandInfo.title).css({
      color: islandInfo.titleColor
    });

    $(".label2").html(islandInfo.text).
    css({
      color: islandInfo.textColor
    });


    //$("#goBtn").removeClass();
    //$("#goBtn").addClass(islandInfo.btnClass);

  } else {
    throw "Parameter is not found in island map!";
  }
}

function makeLoadAnimation() {
  var loadingBar = new ProgressBar.Line("#loading-bar", {
    color: "#E62117",
    strokeWidth: 1,
    easing: 'easeIn',
    duration: 3000,
    trailColor: '#eee',
    trailWidth: 0.5,
    svgStyle: {
      width: "100%",
      height: "100%",
      display: "block"
    }
  });
  preloader.active(true);

  loadingBar.animate(1, () => {
    loadingBar.destroy();
    preloader.active(false);
    if (lastClickIsland != null) {
      let islandInfo = islandsMap.get(findIslandInArray(lastClickIsland));
      window.location.href = islandInfo.href;
    }
  });
}