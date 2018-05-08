import { NgModule, ModuleWithProviders } from '@angular/core';
import { Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MetaService } from './meta.service';
import { DEFAULT_META_CONFIG, MetaConfig } from './models/meta-config';
import { META_CONFIG_TOKEN } from './models/meta-constants';
import { MetaGuard } from './meta.guard';

@NgModule({
  imports: [
    RouterModule
  ]
})
export class MetaModule {
  public static forRoot(metaConfig: MetaConfig = DEFAULT_META_CONFIG): ModuleWithProviders {
    return {
      ngModule: MetaModule,
      providers: [
        { provide: META_CONFIG_TOKEN, useValue: metaConfig },
        MetaGuard,
        MetaService
      ]
    };
  }

  public constructor(@Optional() @SkipSelf() parentModule: MetaModule) {
    if (parentModule) {
      throw new Error(
        'MetaModule is already loaded. Import it in the AppModule only');
    }
  }
}
