import * as THREE from 'three';
import { getCarFrontTexture, getCarSideTexture, pickRandom } from '../utils';
import Wheel from "./Wheel";

const vehicleColors = [0xa52523, 0xbdb638, 0x78b14b];

function Car() {
    const truck = new THREE.Group();

    const backWheel = new Wheel(25, 4);
    backWheel.position.x = -18;
    backWheel.position.z = 0;
    truck.add(backWheel);

    const frontWheel = new Wheel(25, 4);
    frontWheel.position.x = 18;
    frontWheel.position.z = 0;
    truck.add(frontWheel);

    const containerColor = pickRandom(vehicleColors);

    const container = new THREE.Mesh(
        new THREE.BoxGeometry(60, 24, 24),
        new THREE.MeshLambertMaterial({ color: containerColor })
    );
    container.position.z = 12;
    truck.add(container);

    const axle = new THREE.Mesh(
        new THREE.BoxGeometry(20, 16, 6),
        new THREE.MeshLambertMaterial({ color: containerColor })
    );
    axle.position.z = 2;
    axle.position.x = 32;
    truck.add(axle);



    const carFrontTexture = getCarFrontTexture();
    carFrontTexture.center = new THREE.Vector2(0.5, 0.5);
    carFrontTexture.rotation = Math.PI / 2;

    const carBackTextture = getCarFrontTexture();
    carBackTextture.center = new THREE.Vector2(0.5, 0.5);
    carBackTextture.rotation = -Math.PI / 2;

    const carRightSideTexture = getCarSideTexture();

    const carLeftSideTexture = getCarSideTexture();
    carLeftSideTexture.flipY = false;

    const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(20, 20, 20),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    cabin.position.x = 44;
    cabin.position.z = 8;
    truck.add(cabin);

    const cabinWheel = new Wheel(21);
    cabinWheel.position.x = 44;
    cabinWheel.position.z = 0;
    truck.add(cabinWheel);

    const mirror = new THREE.Mesh(
        new THREE.BoxGeometry(8, 21, 8),
        new THREE.MeshLambertMaterial({ color: 0x333333dd })
    );
    mirror.position.x = 51;
    mirror.position.z = 12;
    truck.add(mirror);

    return truck;
}

export default Car;