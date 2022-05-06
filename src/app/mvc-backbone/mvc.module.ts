import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { MVCEngineService } from './mvcEngine.service';
import { MVCTokens } from './tokens';

@NgModule({
    imports: [],
    providers: [],
})
export class MVCModule {

    public static forRoot(): ModuleWithProviders<MVCModule> {
        return {
            ngModule: MVCModule,
            providers: [
                {
                    provide: MVCTokens.MVCEngineServiceToken,
                    useClass: MVCEngineService
                }
            ]
        };
    }

    public constructor(@Optional() @SkipSelf() parentModule: MVCModule) {
        if (parentModule) {
            throw new Error(
                'MVCModule is already loaded. Import it in the AppModule only');
        }
    }

}

