import { Component, Input, Inject, OnInit } from '@angular/core';
import { MVCTokens } from 'src/app/mvc-backbone/tokens';
import { MVCEngineService } from 'src/app/mvc-backbone/mvcEngine.service';

@Component({
    selector: 'satellite-slider',
    templateUrl: './satelliteSlider.component.html',
    styleUrls: ['./satelliteSlider.component.scss']
})
export class SatelliteSliderComponent implements OnInit {
    @Input() value: number;
    @Input() minValue: number;
    @Input() maxValue: number;
    @Input() uid: string; // Needed to send to the Controller
    @Input() notation: string;
    @Input() callback: (value: number) => void;

    public sliderVal: number;
    public sliderMin: number;
    public sliderMax: number;
    public note: string;

    constructor(@Inject(MVCTokens.MVCEngineServiceToken) private mvc: MVCEngineService) {
    }

    public get DisableSlider(): boolean {
        return this.mvc.ControlModel.SunIsSelected;
    }

    public get Value(): number {
        return Math.round(this.value);
    }

    public ngOnInit() {
        this.sliderVal = this.value;
        this.sliderMin = this.minValue;
        this.sliderMax = this.maxValue;
        this.note = this.notation;
    }

    public rangeSlide(e): void {
        this.value = Math.round(e);
        this.callback(this.value);
    }

}
