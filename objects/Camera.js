import * as THREE from 'three';

import { cameraWidth, cameraHeight } from '../contants';

export function Camera() {
    // Add a camera

    const camera = new THREE.OrthographicCamera(
        cameraWidth / -2, // left
        cameraWidth / 2, // right
        cameraHeight / 2,// top
        cameraHeight / -2, // bottom
        0, // near plane
        1000 // far place
    );
    camera.position.set(0, -210, 300);
    camera.lookAt(0, 0, 0);

    return camera;
}

export default Camera;