import { Component, ViewChild, ViewContainerRef, Input, Inject } from '@angular/core';
import { MVCTokens } from 'src/app/mvc-backbone/tokens';
import { MVCEngineService } from 'src/app/mvc-backbone/mvcEngine.service';
import { SatellitePanelViewParameters, BackendSatelliteData, ConversionUtility } from 'src/app/utilities/mvcConversions';

export interface SatelliteControlsInterface {
    SatelliteName: string;
    PrimaryName: string;
    OrbitalRadius: number;
    BodyRadius: number;
    OrbitalPeriod: number;
    RotationalPeriod: number;
    UUID: string;
    TexturePath: string;
}

@Component({
    selector: 'satellite-controls',
    templateUrl: './satelliteControls.component.html',
    styleUrls: ['./satelliteControls.component.scss']
})
export class SatelliteControlsComponent implements SatelliteControlsInterface {
    private satelliteParams: SatellitePanelViewParameters;
    private isDisabled: boolean = false;

    public readonly slider1note: string = "Orbit (% of primary's radius)";
    public readonly slider2note: string = "Radius (% of primary's radius)";
    public readonly slider3note: string = "Period of revolution (seconds)";
    public readonly slider4note: string = "Period of rotation (seconds)";

    constructor(@Inject(MVCTokens.MVCEngineServiceToken) private mvc: MVCEngineService) {

        this.updateSatelliteData(this.mvc.SolarSystemModel.SatelliteData);

        // may need to throttle or debounce
        this.mvc.SolarSystemModel.onParametersChanged$.subscribe(data => {
            this.updateSatelliteData(data);
        });

        this.mvc.SolarSystemModel.onPlanetListChanged$.subscribe(data => {
            this.updateSatelliteData(data);
        });
    
        this.mvc.ControlModel.onSelectedBodyChanged$.subscribe(uid => {
            this.updateSatelliteData(this.mvc.SolarSystemModel.SatelliteData);
        });    
    }

    public get IsDisabled(): boolean {
        return this.isDisabled;
    }

    public get DisableButtons(): boolean {
        return this.mvc.ControlModel.SunIsSelected;
    }

    public get SatelliteName(): string {
        return this.satelliteParams.name;
    }

    public get PrimaryName(): string {
        return this.satelliteParams.nameOfPrimary;
    }

    public get Notation(): string {
        if (this.mvc.ControlModel.SunIsSelected) {
            return 'The Sun';
        } else {
            return `${this.SatelliteName} (Orbiting ${this.PrimaryName})`;
        }
    }

    public get OrbitalRadius(): number {
        return this.satelliteParams.orbitalRadius;
    }

    public get BodyRadius(): number {
        return this.satelliteParams.bodyRadius;
    }

    public get OrbitalPeriod(): number {
        return this.satelliteParams.orbitalPeriod;
    }

    public get RotationalPeriod(): number {
        return this.satelliteParams.rotationalPeriod;
    }

    public get UUID(): string {
        return this.satelliteParams.uid;
    }

    public get TexturePath(): string {
        return this.satelliteParams.texturePath;
    }

    public setOrbitalRadius: (value: number) => void = ((value: number) => {
        this.satelliteParams.orbitalRadius = value;
        this.sendDataToController();
    }).bind(this);

    public setBodyRadius: (value: number) => void = ((value: number) => {
        this.satelliteParams.bodyRadius = value;
        this.sendDataToController();
    }).bind(this);

    public setOrbitalPeriod: (value: number) => void = ((value: number) => {
        this.satelliteParams.orbitalPeriod = value;
        this.sendDataToController();
    }).bind(this);

    public setRotationalPeriod: (value: number) => void = ((value: number) => {
        this.satelliteParams.rotationalPeriod = value;
        this.sendDataToController();
    }).bind(this);

    public changeName(): void {
        const newName: string = prompt("Enter new name of satellite:", this.SatelliteName);
        if (newName !== null && newName !== '') {
            this.mvc.Controller.renameSatellite(this.UUID, newName);
        }
    }      

    public deleteModelAndChildren(): void {
        this.mvc.Controller.removeSatellite(this.UUID);
    }


    private sendDataToController(): void {
        this.mvc.Controller.acceptFrontEndParametersForId(this.satelliteParams, this.UUID);
    }

    private updateSatelliteData(data: BackendSatelliteData[]): void {
        // Could update directly from reading the SolarSystemModel, but doing it this way so that it can be throttled or debounced.
        const solarSystemData: SatellitePanelViewParameters[] = data.map(satellite => ConversionUtility.backEndToViewParams(satellite, this.mvc.SolarSystemModel));
        const satelliteData: SatellitePanelViewParameters[] = solarSystemData.filter(x => x.uid === this.mvc.ControlModel.SelectedID);
        if (satelliteData.length === 0) {
            this.isDisabled = true;
            this.satelliteParams = null;            
        } else {
            this.isDisabled = false;
            this.satelliteParams = satelliteData[0];
        }
    }
    
}  

