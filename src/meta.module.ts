import { OpaqueToken, NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MetaService } from './meta.service';
import { MetaConfig } from './models/meta-config';

export const META_CONFIG = new OpaqueToken('meta config');

@NgModule({
  imports: [RouterModule]
})
export class MetaModule {
  static forRoot(metaConfig: MetaConfig = { useTitleSuffix: false, defaults: {} }): ModuleWithProviders {
    return {
      ngModule: MetaModule,
      providers: [ 
            { provide: META_CONFIG, useValue: metaConfig},
            MetaService 
       ]
    };
  }
}