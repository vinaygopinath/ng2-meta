# ng2-meta

[![Join the chat at https://gitter.im/ng2-meta/Lobby](https://badges.gitter.im/ng2-meta/Lobby.svg)](https://gitter.im/ng2-meta/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Update HTML meta tags for title, description and others automatically based on the route in your Angular app.

ng2-meta v5.0.0+ requires **Angular 6**.
On **Angular 5** or lower, use ng2-meta v4.0.0 (`npm install ng2-meta@4.0.0`)

For the AngularJS (1.x) module, check out [ngMeta](https://github.com/vinaygopinath/ngMeta)

## Getting started

### Install
To install this library, run:

```bash
$ npm install ng2-meta --save
```

### Modify routes

Add meta tags and `MetaGuard` to routes. By default, `title` and `description` values are duplicated for `og:title` and `og:description`, so there's no need to add them separately.
<pre>
<code>
<strong>import { MetaGuard } from 'ng2-meta';</strong>

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    <strong>canActivate: [MetaGuard],
    data: {
      meta: {
        title: 'Home page',
        description: 'Description of the home page'
      }
    }</strong>
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    <strong>canActivate: [MetaGuard],
    data: {
      meta: {
        title: 'Dashboard',
        description: 'Description of the dashboard page',
        'og:image': 'http://example.com/dashboard-image.png'
      }
    }</strong>
  }
];
</code>
</pre>

### Import MetaModule

<pre>
<code>
...
<strong>import { MetaModule } from 'ng2-meta';</strong>

@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    <strong>MetaModule.forRoot()</strong>
  ],
  bootstrap: [AppComponent]
})
</code>
</pre>

### Update AppComponent

<pre>
<code>
<strong>import { MetaService } from 'ng2-meta';</strong>

@Component({
  ...
})
export class AppComponent {
  constructor(<strong>private metaService: MetaService</strong>) {}
}
</code>
</pre>

You're all set! ng2-meta will update the meta tags whenever the route changes.

## Options

### Set defaults

Set default values for tags. These values are used when routes without `meta: {}` information are encountered.
```typescript
import { MetaConfig, MetaService } from 'ng2-meta';

const metaConfig: MetaConfig = {
  //Append a title suffix such as a site name to all titles
  //Defaults to false
  useTitleSuffix: true,
  defaults: {
    title: 'Default title for pages without meta in their route',
    titleSuffix: ' | Site Name',
    'og:image': 'http://example.com/default-image.png',
    'any other': 'arbitrary tag can be used'
  }
};

@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  imports: [
    ...,
    MetaModule.forRoot(metaConfig)
  ],
  bootstrap: [AppComponent]
})

```

### Change meta tags programmatically
```typescript
import { Component, OnInit } from '@angular/core';

class ProductComponent implements OnInit {
  ...
  constructor(private metaService: MetaService) {}

  ngOnInit() {
    this.product = //HTTP GET for product in catalogue
    this.metaService.setTitle('Product page for '+this.product.name);
    this.metaService.setTag('og:image',this.product.imageURL);
  }
}
```

### Define fallback meta content in HTML
While Google executes Javascript and extracts meta tags set by ng2-meta, many bots (like Facebook and Twitter) do not execute Javascript. Consider defining fallback meta tags in your HTML for such bots. The fallback content is overridden by ng2-meta in Javascript-enabled environments.

```html
<html>
  <head>
    <meta name="title" content="Website Name">
    <meta name="og:title" content="Website Name">
    <meta name="description" content="General description of your site">
    <meta name="og:description" content="General description of your site">
    <meta name="og:image" content="http://example.com/fallback-image.png">
  </head>
</html>
```

## Contribute

If you wish to contribute to this repo, please check out the [open issues](https://github.com/vinaygopinath/ng2-meta/issues).

If you notice a bug that has not already been reported or would like to make a feature request, please create a [new issue](https://github.com/vinaygopinath/ng2-meta/issues/new). This helps to start a discussion with the community and avoid duplication of effort before you make any changes.

## Licence

MIT © [Vinay Gopinath](http://vinaygopinath.me)
