import * as THREE from 'three';
import { getCarFrontTexture, getCarSideTexture, pickRandom } from '../utils';
import Wheel from "./Wheel";

const vehicleColors = [0xa52523, 0xbdb638, 0x78b14b];

function Car() {
    const car = new THREE.Group();

    const backWheel = new Wheel();
    backWheel.position.x = -18;
    car.add(backWheel);

    const frontWheel = new Wheel();
    frontWheel.position.x = 18;
    car.add(frontWheel);

    const main = new THREE.Mesh(
        new THREE.BoxGeometry(60, 30, 15),
        new THREE.MeshLambertMaterial({ color: pickRandom(vehicleColors) })
    );
    main.position.z = 12;
    car.add(main);

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
        new THREE.BoxGeometry(33, 24, 12),
        [
            new THREE.MeshLambertMaterial({ map: carFrontTexture }),
            new THREE.MeshLambertMaterial({ map: carBackTextture }),
            new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
            new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
            new THREE.MeshLambertMaterial({ color: 0xffffff }),
            new THREE.MeshLambertMaterial({ color: 0xffffff })
        ]
    );
    cabin.position.x = -6;
    cabin.position.z = 25.5;
    car.add(cabin);

    return car;
}

export default Car;