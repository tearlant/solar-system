import { MVCEngineService } from './mvcEngine.service';
import { InjectionToken } from '@angular/core';

export class MVCTokens {
    public static readonly MVCEngineServiceToken: InjectionToken<MVCEngineService> = new InjectionToken<MVCEngineService>('mvc');
}
