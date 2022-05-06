import { Component, Input, ViewChild, Inject } from '@angular/core';
import { SidebarWindowViewportComponent } from './sidebarWindowViewport.component';
import { MVCEngineService } from 'src/app/mvc-backbone/mvcEngine.service';
import { MVCTokens } from 'src/app/mvc-backbone/tokens';

@Component({
    selector: 'sidebar-buttons',
    templateUrl: './sidebarButtons.component.html',
    styleUrls: ['./sidebarButtons.component.scss']
})
export class SidebarButtonsComponent {
    @Input() texturePath: string;
    @ViewChild("panelViewport") vp: SidebarWindowViewportComponent;

    public constructor(@Inject(MVCTokens.MVCEngineServiceToken) private mvc: MVCEngineService) {
        //console.log('texturePath = ' + this.texturePath);
    }

    public get TexturePath() {
        return this.texturePath;
    }

    public changeTexture(event: Event): void {
        const target = event.target as HTMLInputElement;
        const files = target.files as FileList;
        const name = URL.createObjectURL(files[0]);
        this.vp.updateTexture(name);
        this.mvc.Controller.changeTextureForSelectedSatellite(name);
    }

    public addSatellite(): void {
        this.mvc.Controller.createNewSatelliteWithSelectedAsPrimary('New Satellite');
    }

}
