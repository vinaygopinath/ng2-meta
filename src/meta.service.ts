import { Inject, Injectable, Optional } from '@angular/core';
import { Title, DOCUMENT } from '@angular/platform-browser';
import { Router, NavigationEnd, Event as NavigationEvent, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { META_CONFIG } from './meta.module';
import { MetaConfig } from './models/meta-config';

const isDefined = (val: any) => typeof val !== 'undefined';

@Injectable()
export class MetaService {
    private url: string;

    constructor(private router: Router, @Inject(DOCUMENT) private document: any, private titleService: Title, private activatedRoute: ActivatedRoute,
        @Inject(META_CONFIG) private metaConfig: MetaConfig) {
        this.router.events
            .filter(event => (event instanceof NavigationEnd))
            .map(() => (this.activatedRoute && this.activatedRoute.firstChild && this.activatedRoute.firstChild.snapshot && this.activatedRoute.firstChild.snapshot.data))
            .subscribe((routeData: any) => {
                this._updateMetaTags(routeData.meta);
            });
    }

    private _getOrCreateMetaTag(name: string): HTMLElement {
        let el: HTMLElement = this.document.querySelector(`meta[name='${name}']`);
        if (!el) {
            el = this.document.createElement('meta');
            el.setAttribute('name', name);
            this.document.head.appendChild(el);
        }
        return el;
    }

    private _notLoaded(): boolean {
        return this.url != this.document.location.href;
    }

    private _updateMetaTags(meta: any = {}) {

        if (meta.disableUpdate) {
            return false;
        }

        if (this._notLoaded()) {
            this.setTitle(meta.title, meta.titleSuffix);
        }

        Object.keys(meta).forEach(key => {
            if (key === 'title' || key === 'titleSuffix') {
                return;
            }
            this.setTag(key, meta[key]);
        });
        if (this._notLoaded()) {
            Object.keys(this.metaConfig.defaults).forEach(key => {
                if (key in meta || key === 'title' || key === 'titleSuffix') {
                    return;
                }
                this.setTag(key, this.metaConfig.defaults[key]);
            });
        }
    }

    setTitle(title?: string, titleSuffix?: string): MetaService {
        const titleElement = this._getOrCreateMetaTag('title');
        const ogTitleElement = this._getOrCreateMetaTag('og:title');
        let titleStr = isDefined(title) ? title : (this.metaConfig.defaults['title'] || '');
        if (this.metaConfig.useTitleSuffix) {
            titleStr += isDefined(titleSuffix) ? titleSuffix : (this.metaConfig.defaults['titleSuffix'] || '');
        }

        titleElement.setAttribute('content', titleStr);
        ogTitleElement.setAttribute('content', titleStr);
        this.titleService.setTitle(titleStr);
        this.url = this.document.location.href;
        return this;
    }

    setTag(tag: string, value: string): MetaService {
        if (tag === 'title' || tag === 'titleSuffix') {
            throw new Error(`Attempt to set ${tag} through 'setTag': 'title' and 'titleSuffix' are reserved tag names.
      Please use 'MetaService.setTitle' instead`);
        }
        const tagElement = this._getOrCreateMetaTag(tag);
        let tagStr = isDefined(value) ? value : (this.metaConfig.defaults[tag] || '');
        tagElement.setAttribute('content', tagStr);
        if (tag === 'description') {
            let ogDescElement = this._getOrCreateMetaTag('og:description');
            ogDescElement.setAttribute('content', tagStr);
        }
        this.url = this.document.location.href;
        return this;
    }
}
