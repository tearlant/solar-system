import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolarSystemViewportComponent } from './solarSystemViewport.component';

@NgModule({
  declarations: [
    SolarSystemViewportComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [],
  exports: [
    SolarSystemViewportComponent
  ]
})
export class SolarSystemViewportModule { }
