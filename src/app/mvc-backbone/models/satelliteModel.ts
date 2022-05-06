import { Matrix4, Mesh, MeshBasicMaterial, SphereGeometry, TextureLoader, Vector3, Vector4 } from 'three';
import { CoordinateFrame } from '../../utilities/coordinateFrame'
import { v4 as generateV4 } from 'uuid';
import * as THREE from 'three';

export type SatelliteIdentifier = string;

// Radii are relative to the radius of the primary. For the sun, bodyRadius is the absolute distance. 
export interface SatelliteBackEndParameters {
	bodyRadius: number,
	rotationalAngularVelocity: number,
	orbitalRadius: number,
	orbitalAngularVelocity: number
}

export interface SatelliteFrontEndParameters {
	bodyRadius: number,
	rotationalPeriod: number,
	orbitalRadius: number, // relativeQuantity?
	orbitalPeriod: number
}

export class SatelliteModel {

	private static counter: number = 0;

	public static createSatelliteParameters(bodyRadius: number, rotationalAngularVelocity: number, orbitalRadius: number, orbitalAngularVelocity: number): SatelliteBackEndParameters {

        const params: SatelliteBackEndParameters = {
            bodyRadius: bodyRadius,
            rotationalAngularVelocity: rotationalAngularVelocity,
            orbitalRadius: orbitalRadius,
            orbitalAngularVelocity: orbitalAngularVelocity
        };

        return params;
    }

	private parent: SatelliteModel;
	private children: SatelliteModel[] = [];
	private parameters: SatelliteBackEndParameters;

	private frame: CoordinateFrame;
	private mesh: THREE.Mesh<THREE.BufferGeometry, THREE.Material>;

	private isDeleted: boolean = false; // Cleans up logic in SolarSystemModel

	private uuid: SatelliteIdentifier;

	// Angle in radians
	private currentOrbitalPhase = 0;
	private orbitalPhaseAtLastCapture = 0;
	private currentTime = 0;
	private timeAtLastCapture = 0;
	private currentRotationalPhase = 0;
	private rotationalPhaseAtLastCapture = 0;

    constructor(parent: SatelliteModel, parameters: SatelliteBackEndParameters, private texturePath: string, initialPhase: number = 0) {
		this.uuid = generateV4();

		this.parent = parent;
		this.children = [];

		this.parameters = parameters;

		this.frame = new CoordinateFrame(new Vector3(1,0,0), new Vector3(0,1,0), new Vector3(0,0,1), new Vector3(0,0,0));

		// THREE.SphereGeometry constructor requires absolute size, not relative
		const scalingFactor = this.parent ? parent.frame.E1.length() : 1;
		const absoluteRadius = scalingFactor * this.parameters.bodyRadius;

		var geometry = new SphereGeometry(absoluteRadius, 16, 16);

		let material: THREE.MeshBasicMaterial;

		if (texturePath) {
			const texture = new TextureLoader().load(texturePath);
			material = new MeshBasicMaterial({ map: texture });	
		} else {
			let color: number;
			switch (SatelliteModel.counter % 6) {
				case 0:
					color = 0x0000ff;
					break;
				case 1:
					color = 0x00ff00;
					break;
				case 2:
					color = 0xff0000;
					break;
				case 3:
					color = 0x00ffff;
					break;
				case 4:
					color = 0xffff00;
					break;
				case 5:
					color = 0xff00ff;
					break;
				default:
					color = 0xffffff;
					break;
			}
			SatelliteModel.counter++;
			material = new THREE.MeshBasicMaterial({ color: color });
		}

		this.mesh = new Mesh(geometry, material);
		this.mesh.rotation.x += Math.PI / 2;

		this.orbitalPhaseAtLastCapture = initialPhase;
		this.setCoordinateFrame(this.orbitalPhaseAtLastCapture);

		if (parent) {
			this.parent.addChild(this);
		}

	}

	public get UUID(): SatelliteIdentifier {
		return this.uuid;
	}

	public get ParentUUID(): string {
		return this.parent ? this.parent.UUID : null;
	}

	public get IsDeleted(): boolean {
		return this.isDeleted;
	}

	public get Origin(): Vector3 {
		return this.frame.Origin.clone();
	}

	public get Parameters(): SatelliteBackEndParameters {
		return this.parameters;
	}

	public get TexturePath(): string {
		return this.texturePath;
	}

	public get Material(): THREE.Material {
		return this.mesh.material;
	}

	public set Parameters(value: SatelliteBackEndParameters) {
		this.capturePhaseAndTime();
		const scalingFactor = Math.max(value.bodyRadius / this.parameters.bodyRadius, 0.01);
		//this.mesh.geometry.scale(scalingFactor, scalingFactor, scalingFactor);
		this.scaleThisAndAllChildren(scalingFactor);
		this.parameters = value;
	}

	public addChild(satellite: SatelliteModel): void {
		this.children.push(satellite);
	}

	public addToScene(scene: THREE.Scene) {
		scene.add(this.mesh);
		for (const satellite of this.children) {
			satellite.addToScene(scene);
		}
	}

	public disposeOfSatellite(scene: THREE.Scene): void {

		this.mesh.geometry.dispose();
		this.mesh.material.dispose();
		scene.remove(this.mesh);

		this.isDeleted = true;

		for (const satellite of this.children) {
			satellite.disposeOfSatellite(scene);
		}

		// Possibly necessary... https://discourse.threejs.org/t/correctly-remove-mesh-from-scene-and-dispose-material-and-geometry/5448/2
		// renderer.renderLists.dispose();
	}

	public update(timeInSeconds: number): void {
		this.currentTime = timeInSeconds;
		this.mesh.rotation.y = this.parameters.rotationalAngularVelocity * (this.currentTime - this.timeAtLastCapture) + this.rotationalPhaseAtLastCapture;
		this.currentRotationalPhase = this.mesh.rotation.y;

		this.currentOrbitalPhase = this.parameters.orbitalAngularVelocity * (this.currentTime - this.timeAtLastCapture) + this.orbitalPhaseAtLastCapture;
		this.setCoordinateFrame(this.currentOrbitalPhase);
		this.setBody()

		for (const satellite of this.children) {
			satellite.update(timeInSeconds);
		}
	}

	public swapTexture(texturePath: string) {
        const texture = new TextureLoader().load(texturePath);
        this.mesh.material = new MeshBasicMaterial({ map: texture });
	}

	// Returns an array of UUIDs of [Sun, ..., this]
	public ancestorTree(): SatelliteIdentifier[] {
		const treeOfParent = !this.ParentUUID ? [] : this.parent.ancestorTree();
		treeOfParent.push(this.UUID);
		return treeOfParent;
	}

	// Set the origin and vectors in 3D space
	private setCoordinateFrame(phase: number): void {
		const parentOrigin = new Vector3(0, 0, 0);

		const orbitRadius = this.parameters.orbitalRadius;
		const localOriginPositionVector = new Vector4(orbitRadius * Math.cos(phase), orbitRadius * Math.sin(phase), 0.0, 0.0);

		const absRadial = localOriginPositionVector.clone();
		const parentMatrix = this.parent ? this.parent.frame.Matrix.clone() : new Matrix4(); // Defaults to identity matrix

		parentOrigin.setFromMatrixPosition(parentMatrix); // Position of parent (absolute coods)
		absRadial.applyMatrix4(parentMatrix); // Outward facing vector (absolute coords)

		var globalOrigin = parentOrigin.add(new Vector3(absRadial.x, absRadial.y, absRadial.z)); // Position in absolute space

		const radial = orbitRadius !== 0 ? localOriginPositionVector.clone() : new Vector4(parentMatrix.elements[0],parentMatrix.elements[1],parentMatrix.elements[2],parentMatrix.elements[3]);
		radial.setLength(this.parameters.bodyRadius);
		var azimuthal = new Vector4(radial.y * -1, radial.x, 0, 0);
		var normal = new Vector4(0, 0, this.parameters.bodyRadius, 0);

		radial.applyMatrix4(parentMatrix);
		azimuthal.applyMatrix4(parentMatrix);
		normal.applyMatrix4(parentMatrix);

		this.frame.set(radial, azimuthal, normal, globalOrigin);
		this.setBody();
	}

	private setBody(): void {
		this.mesh.position.set(this.frame.Origin.x, this.frame.Origin.y, this.frame.Origin.z);
	}

	// This needs to be called when the speed is changed, otherwise the object can "jump"
	private capturePhaseAndTime(): void {
		this.timeAtLastCapture = this.currentTime;
		this.orbitalPhaseAtLastCapture = this.currentOrbitalPhase;
		this.rotationalPhaseAtLastCapture = this.currentRotationalPhase;
	}

	private scaleThisAndAllChildren(scalingFactor: number): void {
		this.mesh.geometry.scale(scalingFactor, scalingFactor, scalingFactor);
		for (const satellite of this.children) {
			satellite.scaleThisAndAllChildren(scalingFactor);
		}
	}

}
