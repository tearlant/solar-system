import { Component, Inject } from '@angular/core';
import { SatelliteTableComponent } from './satelliteTable.component';
import { MVCEngineService } from 'src/app/mvc-backbone/mvcEngine.service';
import { MVCTokens } from 'src/app/mvc-backbone/tokens';

export interface ValuesForNamePanel {
    satelliteName: string;
    primaryName: string;
    uuid: string;
    isSelected: boolean;
}

@Component({
    selector: 'satellite-name-panel',
    templateUrl: './satelliteNamePanel.component.html',
    styleUrls: ['./satelliteNamePanel.component.scss']
})
export class SatelliteNamePanelComponent {

    private satelliteName: string;
    private primaryName: string;
    private uuid: string;
    private isSelected: boolean;

    private parentRef: SatelliteTableComponent;

    constructor(@Inject(MVCTokens.MVCEngineServiceToken) private mvc: MVCEngineService) {
    }

    public setParentRef(ref: SatelliteTableComponent) {
        this.parentRef = ref;
    }

    public setValues(values: ValuesForNamePanel) {
        this.satelliteName = values.satelliteName;
        this.primaryName = values.primaryName;
        this.uuid = values.uuid;
        this.isSelected = values.isSelected;
    }

    public set IsActive(value: boolean) {
        this.isSelected = value;
    }

    public get SatelliteName(): string {
        return this.satelliteName;
    }

    public get PrimaryName(): string {
        return this.primaryName;
    }

    public get UUID(): string {
        return this.uuid;
    }

    public get Notation(): string {
        const emSpace: string = String.fromCharCode(0x2005);
        if (this.mvc.SolarSystemModel.Sun.UUID === this.UUID) {
            return `${emSpace}Sun`;
        } else {
            return `${emSpace}${this.SatelliteName} (Orbiting ${this.PrimaryName})`;
        }
    }

    public get IsActive(): boolean {
        return this.isSelected;
    }

    public onClick() {
        this.mvc.ControlModel.SelectedID = this.uuid;
    }

}
