import { Inject, Injectable, Optional } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, Event as NavigationEvent, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { MetaConfig, META_CONFIG_TOKEN } from './models/meta-config';

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
    this.router.events
      .filter((event: NavigationEvent) => (event instanceof NavigationEnd))
      .map(() => this._findLastChild(this.activatedRoute))
      .subscribe((routeData: any) => {
        this._processRouteMetaTags(routeData.meta);
      });
  }

  private _findLastChild(activatedRoute: ActivatedRoute) {
    const snapshot = activatedRoute.snapshot;

    let child = snapshot.firstChild;
    while (child.firstChild !== null) {
      child = child.firstChild;
    }

    return child.data;
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

  private _processRouteMetaTags(meta: any = {}) {

    if (meta.disableUpdate) {
      return;
    }

    this.setTitle(meta.title, meta.titleSuffix);

    Object.keys(meta).forEach(key => {
      if (key === 'title' || key === 'titleSuffix') {
        return;
      }
      this.setTag(key, meta[key]);
    });

    Object.keys(this.metaConfig.defaults).forEach(key => {
      if (key in meta || key === 'title' || key === 'titleSuffix') {
        return;
      }
      this.setTag(key, this.metaConfig.defaults[key]);
    });
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
}
