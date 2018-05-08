import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, Route } from '@angular/router';

import { MetaService } from './meta.service';
import { MetaConfig } from './models/meta-config';
import { META_CONFIG_TOKEN, META_GUARD_IDENTIFIER } from './models/meta-constants';


@Injectable()
export class MetaGuard implements CanActivate {

  public static IDENTIFIER = META_GUARD_IDENTIFIER;

  public constructor(
    private router: Router,
    private metaService: MetaService,
    @Inject(META_CONFIG_TOKEN) private metaConfig: MetaConfig
  ) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this._processRouteMetaTags(route.data && route.data.meta);
    return true;
  }

  private _processRouteMetaTags(meta: any = {}) {

    if (meta.disableUpdate) {
      return;
    }

    this.metaService.setTitle(meta.title, meta.titleSuffix);

    Object.keys(meta).forEach(key => {
      if (key === 'title' || key === 'titleSuffix') {
        return;
      }
      this.metaService.setTag(key, meta[key]);
    });

    Object.keys(this.metaConfig.defaults).forEach(key => {
      if (key in meta || key === 'title' || key === 'titleSuffix') {
        return;
      }
      this.metaService.setTag(key, this.metaConfig.defaults[key]);
    });
  }
}
