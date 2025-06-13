import * as THREE from "three";
import * as dat from "dat.gui";

// ایجاد GUI
const gui = new dat.GUI();
const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegmnets: 10,
    heightSegmnets: 10,
  },
};

// اضافه کردن تنظیمات به GUI
gui.add(world.plane, "width", 1, 20).onChange(updatePlaneGeometry);
gui.add(world.plane, "height", 1, 20).onChange(updatePlaneGeometry);
gui.add(world.plane, "widthSegmnets", 1, 50).onChange(updatePlaneGeometry);
gui.add(world.plane, "heightSegmnets", 1, 50).onChange(updatePlaneGeometry);

// صحنه، دوربین و رندر
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// موقعیت دوربین
camera.position.z = 15;

// ایجاد یک مش (هندسه‌ی اولیه صفحه)
const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegmnets,
  world.plane.heightSegmnets
);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
  flatShading: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

// اضافه کردن نویز تصادفی به هندسه
function addRandomNoiseToGeometry(geometry) {
  const { array } = geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    array[i + 2] = Math.random();
  }
  geometry.attributes.position.needsUpdate = true;
}
addRandomNoiseToGeometry(planeMesh.geometry);

// به‌روزرسانی هندسه هنگام تغییر عرض یا ارتفاع
function updatePlaneGeometry() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegmnets,
    world.plane.heightSegmnets
  );
  addRandomNoiseToGeometry(planeMesh.geometry);
}

// اضافه کردن نور
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

// اضافه کردن نور محیطی
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// مدیریت تغییر اندازه پنجره
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

function animate() {
  requestAnimationFrame(animate);
  planeMesh.rotation.x += 0.01;
  planeMesh.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();
