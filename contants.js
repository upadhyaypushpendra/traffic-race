export const sizes = { width: window.innerWidth, height: window.innerHeight };

export const trackRadius = 225;

export const trackWidth = 45;

export const innerTrackRadius = trackRadius - trackWidth;

export const outerTrackRadius = trackRadius + trackWidth;

export const arcAngle1 = (1 / 3) * Math.PI; // 60 degrees

export const deltaY = Math.sin(arcAngle1) * innerTrackRadius;

export const arcAngle2 = Math.asin(deltaY / outerTrackRadius);

export const arcCenterX = (
    Math.cos(arcAngle1) * innerTrackRadius +
    Math.cos(arcAngle2) * outerTrackRadius
) / 2;

export const arcAngle3 = Math.acos(arcCenterX / innerTrackRadius);

export const arcAngle4 = Math.acos(arcCenterX / outerTrackRadius);

export const vehicleTypes = ['car', 'truck'];

export const aspectRatio = window.innerWidth / window.innerHeight;

export const cameraWidth = 960;

export const cameraHeight = cameraWidth / aspectRatio;
