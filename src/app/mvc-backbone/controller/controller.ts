import { SatelliteBackEndParameters, SatelliteFrontEndParameters, SatelliteIdentifier } from "../models/satelliteModel";
import { SolarSystemModel } from "../models/solarSystemModel";
import { BackendSatelliteData, ConversionUtility } from "../../utilities/mvcConversions";
import { Subject, Observable } from 'rxjs';
import { ControlModel } from '../models/controlModel';
import { DefaultValues } from 'src/app/constants';

export class Controller {

    private deleteSubject: Subject<SatelliteIdentifier> = new Subject<SatelliteIdentifier>();

    constructor(private solarSystemModel: SolarSystemModel, private controlModel: ControlModel) {
    }

    public get onDeletion$(): Observable<SatelliteIdentifier> {
        return this.deleteSubject.asObservable();
    }

    public acceptFrontEndParametersForId(params: SatelliteFrontEndParameters, id: string) {
        const data: BackendSatelliteData = {
            name: this.solarSystemModel.getNameFromId(id),
            params: ConversionUtility.frontEndToModelParams(params),
            uid: id,
            texturePath: this.solarSystemModel.getTexturePathForId(id)
        }

        this.setParameters(data);
    }

    public setParameters(data: BackendSatelliteData): void {
        this.solarSystemModel.setSatelliteParams(data);
    }

    public setSelectedSatellite(uid: string) {
        this.controlModel.SelectedID = uid;
    }

    public changeTextureForSatellite(satelliteId: string, newTexture: string) {
        this.solarSystemModel.setTextureForId(satelliteId, newTexture);
    }

    public changeTextureForSelectedSatellite(newTexture: string) {
        this.changeTextureForSatellite(this.controlModel.SelectedID, newTexture);
    }

    public createNewSatellite(satelliteName: string, primaryId: string, texturePath: string = null): void {
        const valuesForNewBody: SatelliteBackEndParameters = ConversionUtility.frontEndToModelParams(DefaultValues.ParametersForNewBody);
        this.solarSystemModel.addNewSatellite(satelliteName, primaryId, valuesForNewBody, texturePath, Math.random() * 2 * Math.PI, true);
    }

    public createNewSatelliteWithSelectedAsPrimary(satelliteName: string, texturePath: string = null): void {
        this.createNewSatellite(satelliteName, this.controlModel.SelectedID, texturePath);
    }

    public renameSatellite(satelliteId: string, newName: string): void {
        this.solarSystemModel.renameSatellite(satelliteId, newName);
    }

    // TODO
    public removeSatellite(satelliteId: string): void {
        // A bit convoluted, but SolarSystemViewport needs to pass its scene to the Backend, and this initiates the pipeline
        this.deleteSubject.next(satelliteId);
    }

}
