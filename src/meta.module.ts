import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MetaService } from './meta.service';

@NgModule({
  imports: [RouterModule],
  exports: [MetaService]
})
export class MetaModule { }