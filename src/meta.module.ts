import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MetaService } from './meta.service';

@NgModule({
  imports: [RouterModule]
})
export class MetaModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MetaModule,
      providers: [MetaService]
    };
  }
}