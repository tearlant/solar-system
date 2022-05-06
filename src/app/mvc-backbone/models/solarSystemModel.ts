import { SatelliteIdentifier, SatelliteModel, SatelliteBackEndParameters } from './satelliteModel';
import { BackendSatelliteData } from '../../utilities/mvcConversions';
import { Subject, Observable } from 'rxjs';
import { Material } from 'three';

export class SolarSystemModel {

    private satelliteModelsMap: Map<SatelliteIdentifier, { name: string, model: SatelliteModel }> = new Map<SatelliteIdentifier, { name: string, model: SatelliteModel }>();

    // The sun is the centre of the solar system, and its logic is slightly different.
    private sunParams: SatelliteBackEndParameters;
    private sun: SatelliteModel;

    private onParametersChanged: Subject<BackendSatelliteData[]> = new Subject<BackendSatelliteData[]>();
    private onPlanetListChanged: Subject<BackendSatelliteData[]> = new Subject<BackendSatelliteData[]>();
    private onNewSatelliteCreated: Subject<SatelliteIdentifier> = new Subject<SatelliteIdentifier>();
    private readonly startID: string;
 
    constructor(solarRadius: number = 5) {

        this.sunParams = {
            bodyRadius: solarRadius,
            rotationalAngularVelocity: 0.2,
            orbitalRadius: 0,
            orbitalAngularVelocity: 0
        };
        this.sun = new SatelliteModel(null, this.sunParams, 'assets/textures/sun.jpg');
        this.satelliteModelsMap.set(this.sun.UUID, { name: 'Sun', model: this.sun });

        const TAU = Math.PI * 2;

        // Start with some default planets and moons
        const mercuryParams = SatelliteModel.createSatelliteParameters(0.2, TAU / 10, 8, TAU / 20);
        const mercuryId = this.addNewSatellite('Mercury', this.sun.UUID, mercuryParams, 'assets/textures/mercury.jpg', 0);

        const venusParams = SatelliteModel.createSatelliteParameters(0.35, TAU / 12, 15, TAU / 30);
        const venusId = this.addNewSatellite('Venus', this.sun.UUID, venusParams, 'assets/textures/venus.jpg', 0);
    
        const earthParams = SatelliteModel.createSatelliteParameters(0.42, TAU / 14, 25, TAU / 40);
        const earthId = this.addNewSatellite('Earth', this.sun.UUID, earthParams, 'assets/textures/earth.jpg', Math.PI * 0.75);
        this.startID = earthId;

        const moonParams = SatelliteModel.createSatelliteParameters(0.2, TAU / 4, 8, TAU / 10);
        const moonId = this.addNewSatellite('Earth\'s Moon', earthId, moonParams, 'assets/textures/moon.jpg', 0);

        const marsParams = SatelliteModel.createSatelliteParameters(0.35, TAU / 16, 38, TAU / 55);
        const marsId = this.addNewSatellite('Mars', this.sun.UUID, marsParams, 'assets/textures/mars.jpg', Math.PI * 0.25);

        const phobosParams = SatelliteModel.createSatelliteParameters(0.2, TAU / 5, 3, TAU / 5);
        const phobosId = this.addNewSatellite('Phobos', marsId, phobosParams, 'assets/textures/phobos.jpg', 0);

        const deimosParams = SatelliteModel.createSatelliteParameters(0.3, TAU / 7, 4.5, TAU / 8);
        const deimosId = this.addNewSatellite('Deimos', marsId, deimosParams, 'assets/textures/deimos.jpg', Math.PI * 0.5);

        const jupiterParams = SatelliteModel.createSatelliteParameters(0.7, TAU / 18, 50, TAU / 10);
        const jupiterId = this.addNewSatellite('Jupiter', this.sun.UUID, jupiterParams, 'assets/textures/jupiter.jpg', Math.PI * 0.5);

        const callistoParams = SatelliteModel.createSatelliteParameters(0.2, TAU / 5, 3, TAU / 5);
        const callistoId = this.addNewSatellite('Callisto', jupiterId, callistoParams, 'assets/textures/callisto.jpg', 0);

        const europaParams = SatelliteModel.createSatelliteParameters(0.32, TAU / 8, 4.5, TAU / 10);
        const europaId = this.addNewSatellite('Europa', jupiterId, europaParams, 'assets/textures/europa.jpg', Math.PI * 0.5);

        const ganymedeParams = SatelliteModel.createSatelliteParameters(0.39, TAU / 12, 4.5, TAU / 10);
        const ganymedeId = this.addNewSatellite('Ganymede', jupiterId, ganymedeParams, 'assets/textures/ganymede.jpg', Math.PI * 0.25);
    }

    public get StartingBodyID() {
        return this.startID;
    }

    // To be read by the side panel
    public get SatelliteData(): BackendSatelliteData[] {
        const satelliteData = Array.from(this.satelliteModelsMap, ([key, value]) => {
            return {
                name: value.name,
                params: value.model.Parameters,
                uid: key,
                texturePath: value.model.TexturePath
            };
        });
        return satelliteData;
    }

    // Exposed because it needs to be the point of focus of the Camera
    public get Sun(): SatelliteModel {
        return this.sun;
    }

    public get onParametersChanged$(): Observable<BackendSatelliteData[]> {
        return this.onParametersChanged.asObservable();
    }

    public get onPlanetListChanged$(): Observable<BackendSatelliteData[]> {
        return this.onPlanetListChanged.asObservable();
    }

    public get onNewSatelliteCreated$(): Observable<SatelliteIdentifier> {
        return this.onNewSatelliteCreated.asObservable();
    }

    // During initialization, it is convenient to have this return the SatelliteIdentifier of the newly created SatelliteModel 
    public addNewSatellite(newSatelliteName: string, primaryId: SatelliteIdentifier, params: SatelliteBackEndParameters, texture: string, initialPhase: number, notify: boolean = false): SatelliteIdentifier {
        const primaryModel: SatelliteModel = primaryId === this.Sun.UUID ? this.Sun : this.satelliteModelsMap.get(primaryId)!.model;

        const satelliteModel = new SatelliteModel(primaryModel, params, texture, initialPhase);

        const data = {
            name: newSatelliteName,
            model: satelliteModel
        }

        this.satelliteModelsMap.set(satelliteModel.UUID, data);
        this.onPlanetListChanged.next(this.SatelliteData);

        if (notify) {
            this.onNewSatelliteCreated.next(satelliteModel.UUID);
        }

        return satelliteModel.UUID;
    }

    public getSortedSatelliteData(): BackendSatelliteData[] {
        return this.SatelliteData.sort((a, b) => this.sorter(a.uid, b.uid));
    }

    public renameSatellite(id: SatelliteIdentifier, newName: string): void {
        this.satelliteModelsMap.get(id)!.name = newName;
        this.onPlanetListChanged.next(this.SatelliteData);
    }

    public addSatelliteToScene(id: SatelliteIdentifier, scene: THREE.Scene) {
        this.satelliteModelsMap.get(id)?.model.addToScene(scene);
    }

    public removeSatelliteAndChildren(id: SatelliteIdentifier, scene: THREE.Scene): void {
        this.satelliteModelsMap.get(id)?.model.disposeOfSatellite(scene);
        this.removeDeletedModelsFromMap();
        this.onPlanetListChanged.next(this.SatelliteData);
    }

    public getNameFromId(id: string): string {
        const satellites = this.SatelliteData.filter(data => data.uid === id);
        return satellites.length === 0 ? '' : satellites[0].name;
    }

    public getNameOfPrimary(id: SatelliteIdentifier): string {
        if (id === this.sun.UUID) {
            return 'nothing else';
        }

        const primaryID = this.satelliteModelsMap.get(id).model.ParentUUID;

        // "orbiting the Sun" sounds more natural than "orbiting Sun"
        if (primaryID === this.Sun.UUID) {
            return 'the Sun';
        }

        if (!this.satelliteModelsMap.has(primaryID)) {
            return 'unknown Primary body';
        }

        return this.satelliteModelsMap.get(primaryID).name;
    }

    public getMaterialForId(id: string): Material {
        const model: SatelliteModel = this.satelliteModelsMap.get(id).model;
        return model.Material;
    }

    public getTexturePathForId(id: string): string {
        const satellites = this.SatelliteData.filter(data => data.uid === id);
        return satellites.length === 0 ? '' : satellites[0].texturePath;
    }

    public setSatelliteParams(data: BackendSatelliteData): void {
        this.satelliteModelsMap.get(data.uid)!.name = data.name;
        this.satelliteModelsMap.get(data.uid)!.model.Parameters = data.params;
        this.onParametersChanged.next(this.SatelliteData);
    }

    public setTextureForId(id: string, texture: string) {
        this.satelliteModelsMap.get(id).model.swapTexture(texture);
    }

    private sorter(id1: SatelliteIdentifier, id2: SatelliteIdentifier): number {
        const sat1 = this.satelliteModelsMap.get(id1).model;
        const sat2 = this.satelliteModelsMap.get(id2).model;

        if (sat1.UUID === sat2.UUID) { return 0 };

        const firstAncestorTree = sat1.ancestorTree();
        const secondAncestorTree = sat2.ancestorTree();

        for (let i = 0; i < firstAncestorTree.length; i++) {
            if (i >= secondAncestorTree.length) {
                // sat1 is a descendant of sat2
                return 1;
            }

            if (firstAncestorTree[i] !== secondAncestorTree[i]) {
                return this.satelliteModelsMap.get(firstAncestorTree[i]).model.Parameters.orbitalRadius - this.satelliteModelsMap.get(secondAncestorTree[i]).model.Parameters.orbitalRadius
            }
        }

        // sat2 is a descendant of sat1
        return -1;
    }

    // There is no functional way of filtering a Map in ES6. Casting to an Array still involves iterating through all values
    private removeDeletedModelsFromMap() {
        for (let [k, v] of this.satelliteModelsMap.entries()) {
            if (v.model.IsDeleted) {
                this.satelliteModelsMap.delete(k);
            }
        }
    }

}
