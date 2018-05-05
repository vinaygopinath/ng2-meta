import { NgModule, ModuleWithProviders } from '@angular/core';
import { Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MetaService } from './meta.service';
import { MetaConfig, META_CONFIG_TOKEN } from './models/meta-config';

@NgModule({
  imports: [
    RouterModule
  ]
})
export class MetaModule {
  public static forRoot(metaConfig: MetaConfig = { useTitleSuffix: false, defaults: {} }): ModuleWithProviders {
    return {
      ngModule: MetaModule,
      providers: [
        { provide: META_CONFIG_TOKEN, useValue: metaConfig },
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