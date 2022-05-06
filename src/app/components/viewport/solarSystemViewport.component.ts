import { Component, Inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MVCTokens } from 'src/app/mvc-backbone/tokens';
import { MVCEngineService } from 'src/app/mvc-backbone/mvcEngine.service';
import { WebGLRenderer, Scene } from 'three';

@Component({
    selector: 'solar-system-viewport',
    templateUrl: './solarSystemViewport.component.html',
    styleUrls: ['./solarSystemViewport.component.scss']
})
export class SolarSystemViewportComponent implements AfterViewInit {

    //private ssView: SolarSystemView;

    private scene: Scene = new Scene();
    private renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
    private time: number;
    private startTime: number;

    @ViewChild("solarSystem") solarSystem: ElementRef;

    constructor(@Inject(MVCTokens.MVCEngineServiceToken) private mvc: MVCEngineService) {
        this.time = 0;
        this.startTime = performance.now();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.mvc.SolarSystemModel.Sun.addToScene(this.scene);        

        window.addEventListener('resize', () => {
            this.updateCanvas();
        });

        this.mvc.SolarSystemModel.onNewSatelliteCreated$.subscribe(id => {
            this.mvc.SolarSystemModel.addSatelliteToScene(id, this.scene)
        });

        this.mvc.Controller.onDeletion$.subscribe(id => {
            this.mvc.SolarSystemModel.removeSatelliteAndChildren(id, this.scene);
        });

    }

    public ngAfterViewInit() {
        this.solarSystem.nativeElement.appendChild(this.Renderer.domElement);
        this.updateCanvas();
    }

    public get Scene(): Scene {
        return this.scene;
    }

    public get Renderer(): WebGLRenderer {
        return this.renderer;
    }

    public get Canvas(): HTMLCanvasElement {
        return this.renderer.domElement;
    }

    public setAspectRatio(aspectRatio: number): void {
        this.mvc.CameraModel.setAspectRatio(aspectRatio);
    }

    // Draw the scene every time the screen is refreshed
    private animate(): void {
        requestAnimationFrame(this.animate.bind(this));
    
        this.mvc.SolarSystemModel.Sun.update(this.time);
        this.mvc.CameraModel.update(this.time);
        this.time = (performance.now() - this.startTime) * 0.001;
    
        this.renderer.render(this.scene, this.mvc.CameraModel.Camera);
    };

    private updateCanvas() {
        const contWidth = window.innerWidth;
        const contHeight = window.innerHeight;

        this.solarSystem.nativeElement.style.width=contWidth.toString()+'px';
        this.solarSystem.nativeElement.style.height=contHeight.toString()+'px';

        this.setAspectRatio(contWidth / contHeight);
        this.Renderer.setSize(contWidth, contHeight);
        this.animate();
    }

}
  