import { NgModule } from '@angular/core';
import { MetaService } from './meta.service';

@NgModule({
  providers: [MetaService],
  exports: [MetaService]
})
export class MetaModule { }