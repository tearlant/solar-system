import { Subject, Observable } from 'rxjs';
import { SolarSystemModel } from './solarSystemModel';

export class ControlModel {

    private uidOfSelected: string;
    private onSelectedBodyChanged: Subject<string> = new Subject<string>();
    private uidOfSun: string;

    constructor(private ssModel: SolarSystemModel) {
        this.uidOfSelected = this.ssModel.StartingBodyID;
        this.uidOfSun = this.ssModel.Sun.UUID;
    }

    public get onSelectedBodyChanged$(): Observable<string> {
        return this.onSelectedBodyChanged.asObservable();
    }

    public get SelectedID(): string {
        return this.uidOfSelected;
    }

    // Front end logic has some edge cases when Sun is selected. Easier to expose the check here. 
    public get SunIsSelected(): boolean {
        return this.uidOfSelected === this.uidOfSun;
    }

    public set SelectedID(value: string) {
        this.uidOfSelected = value;
        this.onSelectedBodyChanged.next(this.uidOfSelected);
    }

}