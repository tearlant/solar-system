import { Injectable } from "@angular/core";
import { SolarSystemModel } from './models/solarSystemModel';
import { Controller } from './controller/controller';
import { CameraModel } from './models/cameraModel';
import { Vector3 } from 'three';
import { ControlModel } from './models/controlModel';


@Injectable({
    providedIn: 'root'
})
export class MVCEngineService {

    private solarSystemModel = new SolarSystemModel(5);
    private controlModel = new ControlModel(this.solarSystemModel);
    private controller = new Controller(this.solarSystemModel, this.controlModel);
    private cameraModel = new CameraModel(this.solarSystemModel.Sun, new Vector3(0,0,60), Math.PI/6, 70, 0, -0.017);
    //private sidePanelView = new SidePanelView(this.solarSystemModel, this.controller);

    constructor() {}

    public get SolarSystemModel(): SolarSystemModel {
        return this.solarSystemModel;
    }

    public get ControlModel(): ControlModel {
        return this.controlModel;
    }

    public get Controller(): Controller {
        return this.controller;
    }

    public get CameraModel(): CameraModel {
        return this.cameraModel;
    }

}