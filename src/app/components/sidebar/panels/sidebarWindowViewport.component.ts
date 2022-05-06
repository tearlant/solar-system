import { BufferGeometry, Material, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, TextureLoader, WebGLRenderer } from 'three';
import { Component, Input, ViewChild, ElementRef, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MVCTokens } from 'src/app/mvc-backbone/tokens';
import { MVCEngineService } from 'src/app/mvc-backbone/mvcEngine.service';

// TODO: I can't get this to properly work dynamically, so the size is hardcoded for now. (79px in SCSS)

const WIDTH = 79;
const HEIGHT = 81;

const RADIUS = 5; 
const ANGULAR_VELOCITY = 0.002;

export class SidebarWindowView {
    private scene: Scene;
    private renderer: WebGLRenderer;

    private camera: PerspectiveCamera;
    private mesh: Mesh<BufferGeometry, Material>;

    constructor(texturePath: string) {
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({ antialias: true });

        this.camera = new PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
        this.renderer.setSize(WIDTH, HEIGHT);

        const geometry = new SphereGeometry(RADIUS, 16, 16);
        const texture = new TextureLoader().load(texturePath);
        const material = new MeshBasicMaterial({ map: texture });
        this.mesh = new Mesh(geometry, material);
        this.scene.add(this.mesh);

		this.mesh.rotation.x += Math.PI / 2;
        this.mesh.position.set(0, 0, 0);
		this.camera.position.set(10, 0, 0);
		this.camera.up.set(0, 0, 1);
		this.camera.lookAt(0, 0, 0);

    }

    public get Renderer(): WebGLRenderer {
        return this.renderer;
    }

    public animate(): void {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate.bind(this));
		this.mesh.rotation.y += ANGULAR_VELOCITY;
    };

    public swapTexture(texturePath: string): void {
        const texture = new TextureLoader().load(texturePath);
        this.mesh.material = new MeshBasicMaterial({ map: texture });
    }

    public swapMaterial(material: Material): void {
        this.mesh.material = material;
    }
    
}

@Component({
    selector: 'sidebar-window-viewport',
    template: `<div style="width:${WIDTH}px;height:${HEIGHT}px" #sidebarWindow></div>`,
    //styleUrls: ['./satelliteControls.component.scss']
})
export class SidebarWindowViewportComponent implements OnInit, AfterViewInit {

    @Input() texturePath: string;
    @ViewChild('sidebarWindow') bodyWindowRef: ElementRef;

    private view: SidebarWindowView;

    constructor(@Inject(MVCTokens.MVCEngineServiceToken) private mvc: MVCEngineService) {
    }

    public ngOnInit() {
        this.view = new SidebarWindowView(this.texturePath);

        window.addEventListener('resize', () => {
            this.updateCanvas();
        });

        this.mvc.ControlModel.onSelectedBodyChanged$.subscribe(id => {
            const material = this.mvc.SolarSystemModel.getMaterialForId(id);
            this.view.swapMaterial(material);
        });

        this.view.Renderer.setSize(WIDTH, HEIGHT);
        this.view.Renderer.domElement.style.width ='85px';
        this.view.Renderer.domElement.style.height ='81px';

        this.updateCanvas();
    }

    public ngAfterViewInit() {
        this.bodyWindowRef.nativeElement.appendChild(this.view.Renderer.domElement);
    }

    public updateTexture(path: string) {
        this.view.swapTexture(path);
    }

    private updateCanvas(): void {
        this.view.animate();
    }

}
