import { SatelliteFrontEndParameters } from './mvc-backbone/models/satelliteModel';

export namespace DefaultValues {
    export const ParametersForNewBody: SatelliteFrontEndParameters = {
        bodyRadius: 50,
        rotationalPeriod: 20,
        orbitalRadius: 200,
        orbitalPeriod: 20
    }    
}
