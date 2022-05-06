import { SatelliteIdentifier, SatelliteModel, SatelliteBackEndParameters, SatelliteFrontEndParameters } from "../mvc-backbone/models/satelliteModel";
import { SolarSystemModel } from "../mvc-backbone/models/solarSystemModel";

export interface BackendSatelliteData {
    name: string;
    params: SatelliteBackEndParameters;
    uid: string;
    texturePath: string;
}

export interface SatellitePanelViewParameters extends SatelliteFrontEndParameters {
    name: string;
    uid: string; // only need satellite Uid, not primary because Controller can figure that out.
    nameOfPrimary: string;
    texturePath: string;
}

export interface SatelliteDataWrapper {
    name: string;
    uid: string;
    value: number;
}

// For convenience, we want the backend expressed in angular velocity and the frontend in orbital period.
// For convenience, the frontend uses percentage values
export namespace ConversionUtility {
    // export const getAllViewData: (ssModel: SolarSystemModel) => SatellitePanelViewParameters[] = (ssModel) => {
    //     const allData: BackendSatelliteData[] = ssModel.SatelliteData;
    //     const output: SatellitePanelViewParameters[] = allData.map((backendData) => ConversionUtility.backendToView(backendData, ssModel));
    //     return output;
    // }

    export const backEndToViewParams: (backend: BackendSatelliteData, ssModel: SolarSystemModel) => SatellitePanelViewParameters = (backend, ssModel) => {
        return {
            name: backend.name,
            uid: backend.uid,
            nameOfPrimary: ssModel.getNameOfPrimary(backend.uid),
            bodyRadius: backend.params.bodyRadius * 100.0,
            rotationalPeriod: 2 * Math.PI / backend.params.rotationalAngularVelocity,
            orbitalRadius: backend.params.orbitalRadius * 100.0,
            orbitalPeriod: 2 * Math.PI / backend.params.orbitalAngularVelocity,
            texturePath: backend.texturePath
        }
    }

    export const frontEndToModelParams: (data: SatelliteFrontEndParameters) => SatelliteBackEndParameters = (data) => {
        return {
            bodyRadius: data.bodyRadius * 0.01,
            rotationalAngularVelocity: 2 * Math.PI / data.rotationalPeriod,
            orbitalRadius: data.orbitalRadius * 0.01,
            orbitalAngularVelocity: 2 * Math.PI / data.orbitalPeriod
        };
    }
}
