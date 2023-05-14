import * as THREE from 'three';

import "./style.css";

import Camera from "./objects/Camera";
import Car from "./objects/Car";
import Truck from "./objects/Truck";
import Tree from "./objects/Tree";
import { Field, LineMarkingsPlane } from "./objects/Track";

import * as Constants from "./contants";
import { pickRandom } from './utils';

const sizes = Constants.sizes;
const arcCenterX = Constants.arcCenterX;

const config = {
  showHitZones: false,
  shadows: true, // Use shadow
  trees: true, // Add trees to the map
  curbs: true, // Show texture on the extruded geometry
  grid: false // Show grid helper
};

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0, 6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(100, -300, 400);
scene.add(directionalLight);

const camera = Camera();

const playerCar = Car();
scene.add(playerCar);

if (config.trees) {
  const tree1 = Tree();
  tree1.position.x = arcCenterX * 1.3;
  scene.add(tree1);

  const tree2 = Tree();
  tree2.position.y = arcCenterX * 1.9;
  tree2.position.x = arcCenterX * 1.3;
  scene.add(tree2);

  const tree3 = Tree();
  tree3.position.x = arcCenterX * 0.8;
  tree3.position.y = arcCenterX * 2;
  scene.add(tree3);

  const tree4 = Tree();
  tree4.position.x = arcCenterX * 1.8;
  tree4.position.y = arcCenterX * 2;
  scene.add(tree4);

  const tree5 = Tree();
  tree5.position.x = -arcCenterX * 1;
  tree5.position.y = arcCenterX * 2;
  scene.add(tree5);

  const tree6 = Tree();
  tree6.position.x = -arcCenterX * 2;
  tree6.position.y = arcCenterX * 1.8;
  scene.add(tree6);

  const tree7 = Tree();
  tree7.position.x = arcCenterX * 0.8;
  tree7.position.y = -arcCenterX * 2;
  scene.add(tree7);

  const tree8 = Tree();
  tree8.position.x = arcCenterX * 1.8;
  tree8.position.y = -arcCenterX * 2;
  scene.add(tree8);

  const tree9 = Tree();
  tree9.position.x = -arcCenterX * 1;
  tree9.position.y = -arcCenterX * 2;
  scene.add(tree9);

  const tree10 = Tree();
  tree10.position.x = -arcCenterX * 2;
  tree10.position.y = -arcCenterX * 1.8;
  scene.add(tree10);

  const tree11 = Tree();
  tree11.position.x = arcCenterX * 0.6;
  tree11.position.y = -arcCenterX * 2.3;
  scene.add(tree11);

  const tree12 = Tree();
  tree12.position.x = arcCenterX * 1.5;
  tree12.position.y = -arcCenterX * 2.4;
  scene.add(tree12);

  const tree13 = Tree();
  tree13.position.x = -arcCenterX * 0.7;
  tree13.position.y = -arcCenterX * 2.4;
  scene.add(tree13);

  const tree14 = Tree();
  tree14.position.x = -arcCenterX * 1.5;
  tree14.position.y = -arcCenterX * 1.8;
  scene.add(tree14);
}


function getDistance(coordinate1, coordinate2) {
  const horizontalDistance = coordinate2.x - coordinate1.x;
  const verticalDistance = coordinate2.y - coordinate1.y;
  return Math.sqrt(horizontalDistance ** 2 + verticalDistance ** 2);
}

function renderMap(mapWidth, mapHeight) {
  const lineMarkings = LineMarkingsPlane(mapWidth, mapHeight);
  scene.add(lineMarkings);

  const field = Field(mapWidth, mapHeight)
  scene.add(field);
}

renderMap(Constants.cameraWidth, Constants.cameraHeight * 2);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);


// Game Logic

const speed = 0.0017;
let ready = true;
const playerAngleInitial = Math.PI;
let playerAngleMoved = 0;
let score = 0;
const scoreElement = document.getElementById('score');
let otherVehicles = [];
let lastTimestamp;
let accelerate = false;
let deaccelerate = false;

function getPlayerSpeed() {
  if (accelerate) return speed * 2;
  if (deaccelerate) return speed * 0.5;
  return speed;
}

function movePlayerCar(timeDelta) {
  const playerSpeed = getPlayerSpeed();

  playerAngleMoved -= playerSpeed * timeDelta;

  const totalPlayerAngle = playerAngleInitial + playerAngleMoved;

  const playerX = Math.cos(totalPlayerAngle) * Constants.trackRadius - Constants.arcCenterX;
  const playerY = Math.sin(totalPlayerAngle) * Constants.trackRadius;

  playerCar.position.x = playerX;
  playerCar.position.y = playerY;

  playerCar.rotation.z = totalPlayerAngle - (Math.PI / 2);
}

function getVehicleSpeed(type) {
  if (type === 'car') {
    const minSpeed = 1;
    const maxSpeed = 2;
    return minSpeed * Math.random() + (maxSpeed - minSpeed);
  }
  if (type === 'truck') {
    const minSpeed = 0.6;
    const maxSpeed = 1.5;
    return minSpeed * Math.random() + (maxSpeed - minSpeed);
  }
}

function addVehicle() {
  const type = pickRandom(Constants.vehicleTypes);

  const mesh = type === 'car' ? Car() : Truck();
  scene.add(mesh);

  const clockwise = Math.random() > 0.5;
  const angle = clockwise ? Math.PI / 2 : -Math.PI / 2;

  const speed = getVehicleSpeed(type);

  otherVehicles.push({ mesh, type, clockwise, angle, speed });
}

function moveOtherVehicles(timeDelta) {
  otherVehicles.forEach(vehicle => {
    if (vehicle.clockwise) {
      vehicle.angle -= speed * timeDelta * vehicle.speed;
    } else {
      vehicle.angle += speed * timeDelta * vehicle.speed;
    }

    const vehicleX = Math.cos(vehicle.angle) * Constants.trackRadius + Constants.arcCenterX;
    const vehicleY = Math.sin(vehicle.angle) * Constants.trackRadius;
    const rotation = vehicle.angle + (vehicle.clockwise ? -Math.PI / 2 : Math.PI / 2);

    vehicle.mesh.position.x = vehicleX;
    vehicle.mesh.position.y = vehicleY;
    vehicle.mesh.rotation.z = rotation;
  });
}

function getHitZonePosition(center, angle, clockwise, distance) {
  const directionAngle = angle + clockwise ? -Math.PI / 2 : +Math.PI / 2;
  return {
    x: center.x + Math.cos(directionAngle) * distance,
    y: center.y + Math.sin(directionAngle) * distance
  };
}

function hitDetection() {
  const playerHitZone1 = getHitZonePosition(
    playerCar.position,
    playerAngleInitial + playerAngleMoved,
    true,
    15
  );

  const playerHitZone2 = getHitZonePosition(
    playerCar.position,
    playerAngleInitial + playerAngleMoved,
    true,
    -15
  );

  if (config.showHitZones) {
    playerCar.userData.hitZone1.position.x = playerHitZone1.x;
    playerCar.userData.hitZone1.position.y = playerHitZone1.y;

    playerCar.userData.hitZone2.position.x = playerHitZone2.x;
    playerCar.userData.hitZone2.position.y = playerHitZone2.y;
  }

  const hit = otherVehicles.some((vehicle) => {
    if (vehicle.type == "car") {
      const vehicleHitZone1 = getHitZonePosition(
        vehicle.mesh.position,
        vehicle.angle,
        vehicle.clockwise,
        15
      );

      const vehicleHitZone2 = getHitZonePosition(
        vehicle.mesh.position,
        vehicle.angle,
        vehicle.clockwise,
        -15
      );

      if (config.showHitZones) {
        vehicle.mesh.userData.hitZone1.position.x = vehicleHitZone1.x;
        vehicle.mesh.userData.hitZone1.position.y = vehicleHitZone1.y;

        vehicle.mesh.userData.hitZone2.position.x = vehicleHitZone2.x;
        vehicle.mesh.userData.hitZone2.position.y = vehicleHitZone2.y;
      }

      // The player hits another vehicle
      if (getDistance(playerHitZone1, vehicleHitZone1) < 40) return true;
      if (getDistance(playerHitZone1, vehicleHitZone2) < 40) return true;

      // Another vehicle hits the player
      if (getDistance(playerHitZone2, vehicleHitZone1) < 40) return true;
    }

    if (vehicle.type == "truck") {
      const vehicleHitZone1 = getHitZonePosition(
        vehicle.mesh.position,
        vehicle.angle,
        vehicle.clockwise,
        35
      );

      const vehicleHitZone2 = getHitZonePosition(
        vehicle.mesh.position,
        vehicle.angle,
        vehicle.clockwise,
        0
      );

      const vehicleHitZone3 = getHitZonePosition(
        vehicle.mesh.position,
        vehicle.angle,
        vehicle.clockwise,
        -35
      );

      if (config.showHitZones) {
        vehicle.mesh.userData.hitZone1.position.x = vehicleHitZone1.x;
        vehicle.mesh.userData.hitZone1.position.y = vehicleHitZone1.y;

        vehicle.mesh.userData.hitZone2.position.x = vehicleHitZone2.x;
        vehicle.mesh.userData.hitZone2.position.y = vehicleHitZone2.y;

        vehicle.mesh.userData.hitZone3.position.x = vehicleHitZone3.x;
        vehicle.mesh.userData.hitZone3.position.y = vehicleHitZone3.y;
      }

      // The player hits another vehicle
      if (getDistance(playerHitZone1, vehicleHitZone1) < 40) return true;
      if (getDistance(playerHitZone1, vehicleHitZone2) < 40) return true;
      if (getDistance(playerHitZone1, vehicleHitZone3) < 40) return true;

      // Another vehicle hits the player
      if (getDistance(playerHitZone2, vehicleHitZone1) < 40) return true;
    }
  });

  if (hit) {
    // if (resultsElement) resultsElement.style.display = "flex";
    renderer.setAnimationLoop(null); // Stop animation loop
    reset();
  }
}


function animation(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
    return;
  }

  const timeDelta = timestamp - lastTimestamp;

  movePlayerCar(timeDelta);

  const laps = Math.floor(Math.abs(playerAngleMoved) / (Math.PI * 2));

  if (laps !== score) {
    score = laps;
    scoreElement.innerText = score;
  }

  if (otherVehicles.length < (laps + 1) / 5) addVehicle();

  moveOtherVehicles(timeDelta);

  hitDetection();

  renderer.render(scene, camera);
  lastTimestamp = timestamp;
}

function reset() {
  playerAngleMoved = 0;
  movePlayerCar(0);
  score = 0;
  scoreElement.innerText = score;
  lastTimestamp = undefined;

  // Remove other vehicles
  otherVehicles.forEach((vehicle) => {
    scene.remove(vehicle.mesh);
  });
  otherVehicles = [];

  renderer.render(scene, camera);
  ready = true;
}

function startGame() {
  if (ready) {
    ready = false;
    renderer.setAnimationLoop(animation);
  }
}

window.addEventListener("keydown", (e) => {
  if (e.key === 'ArrowUp') {
    startGame();
    accelerate = true;
    return;
  }

  if (e.key === 'ArrowDown') {
    deaccelerate = true;
    return;
  }

  if (e.key === 'R' || e.key === 'r') {
    reset();
    return;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === 'ArrowUp') {
    accelerate = false;
    return;
  }
  if (e.key === 'ArrowUp') {
    deaccelerate = false;
    return;
  }
});

// Auto Resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

reset();