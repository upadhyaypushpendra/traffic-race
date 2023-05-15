import * as THREE from 'three';

export function getCarFrontTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;

    const context = canvas.getContext('2d');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = '#666666';
    context.fillRect(8, 8, 48, 24);

    return new THREE.CanvasTexture(canvas);
}

export function getCarSideTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;

    const context = canvas.getContext('2d');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = '#666666';
    context.fillRect(8, 8, 26, 24);
    context.fillRect(38, 8, 20, 24);

    return new THREE.CanvasTexture(canvas);
}

export function getLineMarkingTexture(mapWidth, mapHeight, arcCenterX, trackRadius) {
    const canvas = document.createElement('canvas');
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    const context = canvas.getContext('2d');

    context.fillStyle = '#546E90';
    context.fillRect(0, 0, mapWidth, mapHeight);

    context.lineWidth = 2;
    context.strokeStyle = '#E0FFFF';
    context.setLineDash([10, 14]);

    // Left Circle
    context.beginPath();
    context.arc(
        mapWidth / 2 - arcCenterX,
        mapHeight / 2,
        trackRadius,
        0,
        Math.PI * 2
    );
    context.stroke();

    // Right circle
    context.beginPath();
    context.arc(
        mapWidth / 2 + arcCenterX,
        mapHeight / 2,
        trackRadius,
        0,
        Math.PI * 2
    );
    context.stroke();

    return new THREE.CanvasTexture(canvas);
}