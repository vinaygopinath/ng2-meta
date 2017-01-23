import { Inject, Injectable } from '@angular/core';
import { Title, DOCUMENT } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { META_CONFIG } from './meta.module';
import { MetaConfig } from './models/meta-config';

const isDefined = (val: any) => typeof val !== 'undefined';

@Injectable()
export class MetaService {
  private defaultsMeta: Object;
  private defaultsLinks: Object;
  private defaultsAlternateLinks: Array<string>;

  constructor(private router: Router, @Inject(DOCUMENT) private document: any, private titleService: Title, private activatedRoute: ActivatedRoute, @Inject(META_CONFIG) private metaConfig: MetaConfig) {
    const defaults = metaConfig.defaults || {};
    this.defaultsMeta = defaults.meta || {};
    this.defaultsLinks = defaults.links || {};
    this.defaultsAlternateLinks = defaults.alternateLinks || [];

    this.router.events
      .filter(event => (event instanceof NavigationEnd))
      .map(() => this._findLastChild(this.activatedRoute))
      .subscribe((routeData: any) => {
        this._updateMetaTags(routeData.meta, routeData.links, routeData.alternateLinks);
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

  private _createMetaElement(value: string, key: string = 'name', type: string = 'meta'): HTMLElement {
    const el = this.document.createElement(type);
    el.setAttribute(key, value);
    this.document.head.appendChild(el);
    return el;
  }

  private _getOrCreateMetaElement(value: string, key: string = 'name', type: string = 'meta'): HTMLElement {
    let el: HTMLElement = this.document.querySelector(`${type}[${key}='${value}']`);
    if (!el) {
      el = this._createMetaElement(value, key, type);
    }
    return el;
  }

  private _removeLinkElements(value: string = 'alternate', key: string = 'rel', type: string = 'link'): void {
    let linkElement: HTMLElement = this.document.querySelector(`${type}[${key}='${value}']`);
    while (linkElement) {
      linkElement.remove();
      linkElement = this.document.querySelector(`${type}[${key}='${value}']`);
    }
  }

  private _updateMetaTags(meta: any = {}, links: any = {}, alternateLinks: Array<string> = []) {
    if (meta.disableUpdate) {
      return false;
    }

    this.setTitle(meta.title, meta.titleSuffix);

    Object.keys(meta).forEach(key => {
      if (key === 'title' || key === 'titleSuffix') {
        return;
      }
      this.setMetaTag(key, meta[key]);
    });

    Object.keys(links).forEach(key => {
      this.setLinkTag(key, links[key]);
    });

    this.setAlternateLinkTags(alternateLinks);

    Object.keys(this.defaultsMeta).forEach(metaKey => {
      if (metaKey in meta || metaKey === 'title' || metaKey === 'titleSuffix') {
        return;
      }
      this.setMetaTag(metaKey, this.defaultsMeta[metaKey]);
    });

    Object.keys(this.defaultsLinks).forEach(linkKey => {
      if (linkKey in links) {
        return;
      }
      this.setMetaTag(linkKey, this.defaultsLinks[linkKey]);
    });
  }

  _setAttribute(el: HTMLElement, name: string, value: string) {
    el.setAttribute(name, value);
  }

  setTitle(title?: string, titleSuffix?: string): MetaService {
    const elements = [
      this._getOrCreateMetaElement('og:title', 'property'),
      this._getOrCreateMetaElement('twitter:title'),
    ];

    let titleStr = isDefined(title) ? title : (this.defaultsMeta['title'] || '');
    if (this.metaConfig.useTitleSuffix) {
      titleStr += isDefined(titleSuffix) ? titleSuffix : (this.defaultsMeta['titleSuffix'] || '');
    }

    elements.forEach(el => {
      this._setAttribute(el, 'content', titleStr);
    });

    this.titleService.setTitle(titleStr);

    return this;
  }

  setMetaTag(tag: string, value: string): MetaService {
    if (tag === 'title' || tag === 'titleSuffix') {
      throw new Error(`Attempt to set ${tag} through 'setTag': 'title' and 'titleSuffix' are reserved tag names.
      Please use 'MetaService.setTitle' instead`);
    }

    const elements = [this._getOrCreateMetaElement(tag, tag.startsWith('og:') ? 'property' : 'name')];

    let tagStr = isDefined(value) ? value : (this.defaultsMeta[tag] || '');

    if (tag === 'description') {
      elements.push(this._getOrCreateMetaElement('og:description', 'property'));
      elements.push(this._getOrCreateMetaElement('twitter:description'));
    }

    elements.forEach(el => {
      this._setAttribute(el, 'content', tagStr);
    });

    return this;
  }

  setLinkTag(rel: string, value: string): MetaService {
    let linkElement = rel === 'alternate' ?
        this._createMetaElement(rel, 'rel', 'link') : this._getOrCreateMetaElement(rel, 'rel', 'link');

    let linkStr = isDefined(value) ? value : (this.defaultsLinks[rel] || '');

    linkElement.setAttribute('href', linkStr);

    if (rel === 'canonical') {
      const ogUrlElement = this._getOrCreateMetaElement('og:url', 'property');
      ogUrlElement.setAttribute('content', linkStr);
    }

    return this;
  }

  setAlternateLinkTags(values: Array<string>): MetaService {
    this._removeLinkElements();

    let alternateLinksArr: Array<string> = values.length > 0 ? values : this.defaultsAlternateLinks;

    alternateLinksArr.forEach((alternate) => {
      this.setLinkTag('alternate', alternate);
    });

    return this;
  }
}
