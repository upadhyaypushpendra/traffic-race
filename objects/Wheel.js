import * as THREE from 'three';

export function Wheel(width, height) {
    const wheel = new THREE.Mesh(
        new THREE.BoxGeometry(12, width || 33, height || 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );
    wheel.position.z = 6;

    return wheel;
}

export default Wheel;