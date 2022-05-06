import { SatellitePanelViewParameters, ConversionUtility, BackendSatelliteData } from '../../../utilities/mvcConversions';
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Inject, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { SatelliteNamePanelComponent, ValuesForNamePanel } from './satelliteNamePanel.component';
import { MVCTokens } from 'src/app/mvc-backbone/tokens';
import { MVCEngineService } from 'src/app/mvc-backbone/mvcEngine.service';

@Component({
  selector: 'satellite-table',
  templateUrl: './satelliteTable.component.html',
  styleUrls: ['./satelliteTable.component.scss']
})
export class SatelliteTableComponent implements AfterViewInit {
    @ViewChild("planetNamesRef", { read: ViewContainerRef }) planetNamesRef: ViewContainerRef;
    @ViewChild("tableContainer") tableContainer: ElementRef;

    private childComponentRefs = Array<ComponentRef<SatelliteNamePanelComponent>>()
    private satelliteList: ValuesForNamePanel[];

    constructor(private resolver: ComponentFactoryResolver, @Inject(MVCTokens.MVCEngineServiceToken) private mvc: MVCEngineService) {
        this.mvc.SolarSystemModel.onPlanetListChanged$.subscribe(data => {
            this.updateSatelliteData(this.mvc.SolarSystemModel.getSortedSatelliteData());
        });

        this.mvc.ControlModel.onSelectedBodyChanged$.subscribe(id => {
            this.updateSelected(id);
        })
    }

    public ngAfterViewInit() {
        setTimeout(() => this.updateSatelliteData(this.mvc.SolarSystemModel.getSortedSatelliteData()), 0);

        const contHeight = window.innerHeight * 0.55;

        this.tableContainer.nativeElement.style.height=contHeight.toString()+'px';
        
    }

    public createComponent(values: ValuesForNamePanel) {
        const componentFactory = this.resolver.resolveComponentFactory(SatelliteNamePanelComponent);
        const childComponentRef = this.planetNamesRef.createComponent(componentFactory);
        const childComponent = childComponentRef.instance;

        childComponent.setValues(values);
        childComponent.setParentRef(this);
    
        // add reference for newly created component
        this.childComponentRefs.push(childComponentRef);
    }

    // TODO: This might be unnecessary
    public remove(uid: string): void {
        if (this.planetNamesRef.length < 1) {
            return
        };
    
        const componentRef = this.childComponentRefs.filter(x => x.instance.UUID == uid)[0];
        const vcrIndex: number = this.planetNamesRef.indexOf(componentRef as any);
        this.planetNamesRef.remove(vcrIndex);
        this.childComponentRefs = this.childComponentRefs.filter(x => x.instance.UUID !== uid);
        componentRef.destroy();
    }

    private clearAllChildren(): void {
        this.childComponentRefs.forEach(ref => {
            const vcrIndex: number = this.planetNamesRef.indexOf(ref.hostView);
            if (vcrIndex >= 0) {
                this.planetNamesRef.remove(vcrIndex);
            }
            ref.destroy();
        });

        this.childComponentRefs = [];
    }

    private updateSatelliteData(data: BackendSatelliteData[]) {
        // Could update directly from reading the SolarSystemModel, but doing it this way so that it can be throttled or debounced.
        const satelliteParams: SatellitePanelViewParameters[] = data.map(satellite => ConversionUtility.backEndToViewParams(satellite, this.mvc.SolarSystemModel));
        this.satelliteList = satelliteParams.map(vals => {
            return {
                satelliteName: vals.name,
                primaryName: vals.nameOfPrimary,
                uuid: vals.uid,
                isSelected: vals.uid === this.mvc.ControlModel.SelectedID 
            };
        });

        this.clearAllChildren();

        this.satelliteList.forEach(x => {
            this.createComponent(x);
        });
    }

    private updateSelected(id: string) {
        this.childComponentRefs.forEach(ref => {
            ref.instance.IsActive = (ref.instance.UUID === id);
        });
    }


}
