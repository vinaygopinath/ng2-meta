import { Inject, Injectable, Optional } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/platform-browser';
import {Router, NavigationEnd, ActivatedRoute, PRIMARY_OUTLET} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
const isDefined = (val: any) => typeof val !== 'undefined';

export class MetaConfig {

  useTitleSuffix: boolean = false;
  defaults: any = {};

  constructor(config?: any) {
    if (config) {
      this.useTitleSuffix = isDefined(config.useTitleSuffix) ? config.useTitleSuffix : false;
      this.defaults = config.defaults || {};
    }
  }
}

@Injectable()
export class MetaService {
  sub: Subscription;
  headElement: HTMLElement;

  constructor(private titleService: Title, @Inject(DOCUMENT) private document,
  private router: Router, private activatedRoute: ActivatedRoute,
  @Inject('meta.config') @Optional() private metaConfig: MetaConfig = new MetaConfig()) {
    this.metaConfig = metaConfig || new MetaConfig();
    this.headElement = this.document.querySelector('head');
    // Credit: https://github.com/angular/angular/issues/9662#issuecomment-229058750
    this.sub = this.router.events
    .filter(event => (event instanceof NavigationEnd))
    .map(_ => this.router.routerState)
    .map(state => {
      let route = this.activatedRoute;
      while (state.firstChild(route)) {
        route = state.firstChild(route);
      }
      return route;
    })
    .filter(route => route.outlet === PRIMARY_OUTLET)
    .flatMap(route => route.data)
    .subscribe( (data: any) => {
      this._updateMetaTags(data.meta);
    });
  }

  private _getOrCreateMetaTag(name: string): HTMLElement {
    let el: HTMLElement = this.document.querySelector('meta[name=\'' + name + '\']');
    if (!el) {
      el = this.document.createElement('meta');
      el.setAttribute('name', name);
      this.headElement.appendChild(el);
    }
    return el;
  }

  private _updateMetaTags(meta: any = {}) {

    if (meta.disableUpdate) {
      return false;
    }

    this.setTitle(meta.title, meta.titleSuffix);

    Object.keys(meta).forEach(key => {
      if (key === 'title' || key === 'titleSuffix') {
        return;
      }
      this.setTag(key, meta[key]);
    });

    Object.keys(this.metaConfig.defaults).forEach(key => {
      if ( key in meta || key === 'title' || key === 'titleSuffix') {
        return;
      }
      this.setTag(key, this.metaConfig.defaults[key]);
    });
  }

  setTitle(title?: string, titleSuffix?: string) {
    const titleElement = this._getOrCreateMetaTag('title');
    const ogTitleElement = this._getOrCreateMetaTag('og:title');
    let titleStr = isDefined(title) ? title : (this.metaConfig.defaults.title || '');
    if (this.metaConfig.useTitleSuffix) {
      titleStr += isDefined(titleSuffix) ? titleSuffix : (this.metaConfig.defaults.titleSuffix || '');
    }

    titleElement.setAttribute('content', titleStr);
    ogTitleElement.setAttribute('content', titleStr);
    this.titleService.setTitle(titleStr);
  }

  setTag(tag: string, value: any) {
    if (tag === 'title' || tag === 'titleSuffix') {
      throw new Error(`Attempt to set ${tag} through 'setTag': 'title' and 'titleSuffix' are reserved tag names. Please use 'MetaService.setTitle' instead`);
    }
    const tagElement = this._getOrCreateMetaTag(tag);
    let tagStr = isDefined(value) ? value : (this.metaConfig.defaults[tag] || '');
    tagElement.setAttribute('content', tagStr);
    if (tag === 'description') {
      let ogDescElement = this._getOrCreateMetaTag('og:description');
      ogDescElement.setAttribute('content', tagStr);
    }
  }

}
