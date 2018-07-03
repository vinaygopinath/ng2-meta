import { Inject, Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute, Route } from '@angular/router';

import { MetaConfig } from './models/meta-config';
import { META_CONFIG_TOKEN, META_GUARD_IDENTIFIER } from './models/meta-constants';

const isDefined = (val: any) => typeof val !== 'undefined';

@Injectable()
export class MetaService {

  public constructor(
    private router: Router,
    private meta: Meta,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    @Inject(META_CONFIG_TOKEN) private metaConfig: MetaConfig
  ) {
    this._warnMissingGuard();
  }

  public setTitle(title?: string, titleSuffix?: string): MetaService {
    let titleContent = isDefined(title) ? title : (this.metaConfig.defaults['title'] || '');
    if (this.metaConfig.useTitleSuffix) {
      titleContent += isDefined(titleSuffix) ? titleSuffix : (this.metaConfig.defaults['titleSuffix'] || '');
    }

    this._updateMetaTag('title', titleContent);
    this._updateMetaTag('og:title', titleContent);
    this.titleService.setTitle(titleContent);

    return this;
  }

  public setTag(tag: string, value: string): MetaService {
    if (tag === 'title' || tag === 'titleSuffix') {
      throw new Error(`Attempt to set ${tag} through 'setTag': 'title' and 'titleSuffix' are reserved tag names.
      Please use 'MetaService.setTitle' instead`);
    }
    let content = isDefined(value) ? value : (this.metaConfig.defaults[tag] || '');
    this._updateMetaTag(tag, content);
    if (tag === 'description') {
      this._updateMetaTag('og:description', content);
    }

    return this;
  }

  private _updateMetaTag(tag: string, value: string) {
    let prop = 'name';
    if (tag.startsWith(`og:`)) {
      prop = 'property';
    }

    this.meta.updateTag({
      [prop]: tag,
      content: value
    });
  }

  private _warnMissingGuard() {
    if (isDefined(this.metaConfig.warnMissingGuard) && !this.metaConfig.warnMissingGuard) {
      return;
    }

    const hasDefaultMeta = !!Object.keys(this.metaConfig.defaults).length;
    const hasMetaGuardInArr = (it: any) => (it && it.IDENTIFIER === META_GUARD_IDENTIFIER);
    let hasShownWarnings = false;
    this.router.config.forEach((route: Route) => {
      const hasRouteMeta = route.data && route.data.meta;
      const showWarning = !isDefined(route.redirectTo)
        && (hasDefaultMeta || hasRouteMeta)
        && !(route.canActivate || []).some(hasMetaGuardInArr);

      if (showWarning) {
        console.warn(`Route with path "${route.path}" has ${hasRouteMeta ? '' : 'default '}meta tags, but does not use MetaGuard. \
Please add MetaGuard to the canActivate array in your route configuration`);
        hasShownWarnings = true;
      }
    });

    if (hasShownWarnings) {
      console.warn(`To disable these warnings, set metaConfig.warnMissingGuard: false \
in your ng2-meta MetaConfig passed to MetaModule.forRoot()`);
    }
  }

}
