import { NgModule } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SatelliteControlsComponent } from './panels/satelliteControls.component';
import { SatelliteNamePanelComponent } from './panels/satelliteNamePanel.component';
import { SatelliteSliderComponent } from './panels/satelliteSlider.component';
import { SatelliteTableComponent } from './panels/satelliteTable.component';
import { SidebarButtonsComponent } from './panels/sidebarButtons.component';
import { SidebarWindowViewportComponent } from './panels/sidebarWindowViewport.component';

@NgModule({
  declarations: [
    SidebarComponent,
    SatelliteControlsComponent,
    SatelliteNamePanelComponent,
    SatelliteSliderComponent,
    SatelliteTableComponent,
    SidebarButtonsComponent,
    SidebarWindowViewportComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
