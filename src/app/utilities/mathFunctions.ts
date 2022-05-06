import { Vector3, Vector4 } from "three";

export function projectivePoint(vec: Vector3): Vector4 {
	return new Vector4(vec.x, vec.y, vec.z, 1);
}

export function projectiveDirection(vec: Vector3): Vector4 {
	return new Vector4(vec.x, vec.y, vec.z, 0);
}

export function degreesToRads(degrees: number): number {
	return degrees * Math.PI / 180;
}

export function radsToDegrees(rads: number): number {
	return rads * 180 / Math.PI;
}
