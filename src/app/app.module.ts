import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MVCModule } from './mvc-backbone/mvc.module';
import { SidebarModule } from './components/sidebar/sidebar.module';
import { SolarSystemViewportModule } from './components/viewport/solarSystemViewport.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MVCModule.forRoot(),
    SidebarModule,
    SolarSystemViewportModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
