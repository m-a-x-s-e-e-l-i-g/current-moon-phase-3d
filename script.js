var moonTextureImage = "./img/lroc_color_poles_1k.jpg";
var moonDisplacementImageLowRes = "./img/ldem_4_uint.jpg";
var moonDisplacementImageHighRes = "./img/ldem_hw5x3.jpg";

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableRotate = false;
controls.enableZoom = false;


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.SphereGeometry(2, 60, 60);

var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load(moonTextureImage);
var displacementMap = textureLoader.load(moonDisplacementImageHighRes);

var material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  map: texture,
  displacementMap: displacementMap,
  displacementScale: 0.06,
  bumpMap: displacementMap,
  bumpScale: 0.04,
  reflectivity: 0,
  shininess: 0
});

var moon = new THREE.Mesh(geometry, material);


const light = new THREE.DirectionalLight(0xFFFFFF, 1.4);
light.position.set(1, 0, 0);
scene.add(light);


hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 0, 0);
scene.add(hemiLight);

scene.add(moon);
camera.position.z = 5;

moon.rotation.x = 3.1415 * 0.02;
moon.rotation.y = 3.1415 * 1.54;

function animate() {
  requestAnimationFrame(animate);
  moon.rotation.y += 0.0002;
  moon.rotation.x += 0;

  renderer.render(scene, camera);
}
animate();


// Keep moon in the middle of the window
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize, false);