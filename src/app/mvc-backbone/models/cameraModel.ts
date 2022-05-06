import { PerspectiveCamera, Vector3 } from 'three';
import { SatelliteModel } from './satelliteModel';
import { degreesToRads } from '../../utilities/mathFunctions';

export class CameraModel {

	private offset: Vector3;
	private risingY: number;
	private risingZ: number;

	private camera: PerspectiveCamera;

	constructor(private anchor: SatelliteModel, offset: Vector3, angle: number, private orbitalRadius: number, private startingPhase: number, private angularVelocity: number) {

		this.offset = offset.clone();
		this.risingY = Math.cos(degreesToRads(angle));
		this.risingZ = Math.sin(degreesToRads(angle));
		
		// TODO: May have to change when resizing window
		this.camera = new PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		this.angularVelocity = 0;
		this.setCameraPosition(this.startingPhase);
	}

	public get Camera(): PerspectiveCamera {
		return this.camera;
	}

	public update(time: number): void {
		this.setCameraPosition(this.startingPhase + this.angularVelocity * time);
	}

	public setAspectRatio(aspectRatio: number): void {
		this.camera.aspect = aspectRatio;
		this.camera.updateProjectionMatrix();
	}

	private setCameraPosition(phase: number) {
		const anchorOrigin: Vector3 = this.anchor.Origin;

		var origin = anchorOrigin.clone().add(
			new Vector3(
				this.offset.x + this.orbitalRadius * Math.cos(phase),
				this.offset.y + this.orbitalRadius * Math.sin(phase) * this.risingY,
				this.offset.z + this.orbitalRadius * Math.sin(phase) * this.risingZ
			)
		);

		this.camera.position.set(origin.x, origin.y, origin.z);
		this.camera.up.set(0, 0, 1);

		this.camera.lookAt(anchorOrigin.x, anchorOrigin.y, anchorOrigin.z);
	}

}
