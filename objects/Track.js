import * as THREE from 'three';

import { getLineMarkingTexture } from '../utils';

import * as Constants from "../contants";

const trackRadius = Constants.trackRadius;
const innerTrackRadius = Constants.innerTrackRadius;
const outerTrackRadius = Constants.outerTrackRadius;
const arcAngle1 = Constants.arcAngle1;
const arcAngle2 = Constants.arcAngle2;
const arcCenterX = Constants.arcCenterX;
const arcAngle3 = Constants.arcAngle3;
const arcAngle4 = Constants.arcAngle4;


export function LineMarkingsPlane(mapWidth, mapHeight) {
    // Plane with line markings
    const lineMarkingTexture = getLineMarkingTexture(mapWidth, mapHeight, arcCenterX, trackRadius);

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(mapWidth, mapHeight),
        new THREE.MeshLambertMaterial({ map: lineMarkingTexture })
    );

    return plane;
}

export function LeftIsland() {
    const leftIsland = new THREE.Shape();

    leftIsland.absarc(
        -arcCenterX,
        0,
        innerTrackRadius,
        arcAngle1,
        -arcAngle1,
        false
    );

    leftIsland.absarc(
        arcCenterX,
        0,
        outerTrackRadius,
        Math.PI + arcAngle2,
        Math.PI - arcAngle2,
        true
    )

    return leftIsland;
}


export function MiddleIsland() {
    const middleIsland = new THREE.Shape();

    middleIsland.absarc(
        -arcCenterX,
        0,
        innerTrackRadius,
        arcAngle3,
        -arcAngle3,
        true
    );

    middleIsland.absarc(
        arcCenterX,
        0,
        innerTrackRadius,
        Math.PI + arcAngle2,
        Math.PI - arcAngle2,
        true
    )

    return middleIsland;
}

export function RightIsland() {
    const lightIsland = new THREE.Shape();

    lightIsland.absarc(
        arcCenterX,
        0,
        innerTrackRadius,
        Math.PI - arcAngle1,
        Math.PI + arcAngle1,
        true
    );

    lightIsland.absarc(
        -arcCenterX,
        0,
        outerTrackRadius,
        -arcAngle2,
        arcAngle2,
        false
    )

    return lightIsland;
}

export function OuterField(mapWidth, mapHeight) {
    const outerField = new THREE.Shape();

    outerField.moveTo(-mapWidth / 2, -mapHeight / 2);
    outerField.lineTo(0, -mapHeight / 2);

    outerField.absarc(
        -arcCenterX,
        0,
        outerTrackRadius,
        -arcAngle4,
        arcAngle4,
        true
    );

    outerField.absarc(
        arcCenterX,
        0,
        outerTrackRadius,
        Math.PI - arcAngle4,
        Math.PI + arcAngle4,
        true
    );

    outerField.lineTo(0, -mapHeight / 2);
    outerField.lineTo(mapWidth / 2, -mapHeight / 2);
    outerField.lineTo(mapWidth / 2, mapHeight / 2);
    outerField.lineTo(-mapWidth / 2, mapHeight / 2);

    return outerField;
}

export function Field(mapWidth, mapHeight) {
    const fieldMesh = new THREE.Mesh(
        new THREE.ExtrudeGeometry(
            [LeftIsland(), MiddleIsland(), RightIsland(), OuterField(mapWidth, mapHeight)],
            { depth: 6, bevelEnabled: false }
        ),
        [
            new THREE.MeshLambertMaterial({ color: 0x67c240 }),
            new THREE.MeshLambertMaterial({ color: 0x23311c }),
        ]
    );

    return fieldMesh;
}