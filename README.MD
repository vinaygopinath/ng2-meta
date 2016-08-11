# ng2-meta

Update HTML meta tags for title, description and others automatically based on the route in your Angular2 app.

## Getting started

### Install
To install this library, run:

```bash
$ npm install ng2-meta --save
```

(ng2-meta works with angular2 RC4 and @angular/router 3.0.0-beta.2 and higher)

### Modify routes

Add meta tags to routes. By default, `title` and `description` values are duplicated for `og:title` and `og:description`, so there's no need to add them separately.
<pre>
<code>
<strong>import { MetaService } from 'ng2-meta';</strong>
const routes: RouterConfig = [
  {
    path: 'home',
    component: HomeComponent,
    <strong>data: {
      meta: {
        title: 'Home page',
        description: 'Description of the home page'
      }
    }</strong>
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    <strong>data: {
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

### Inject MetaService

<pre>
<code>
<strong>import { Title } from '@angular/platform-browser';</strong>
<strong>import { MetaService } from 'ng2-meta';</strong>
...
bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  ...
  Title,
  <strong>MetaService</strong>
]);
</code>
</pre>

### Update AppComponent

<pre>
<code>
<strong>import { MetaService } from 'ng2-meta';</strong>

@Component({
  ...
  providers: <strong>[MetaService]</strong>
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

let metaConfig = new MetaConfig({
  //Append a title suffix such as a site name to all titles
  //Defaults to false
  useTitleSuffix: true,
  defaults: {
    title: 'Default title for pages without meta in their route',
    titleSuffix: ' | Site Name',
    'og:image': 'http://example.com/default-image.png',
    'any other': 'arbitrary tag can be used'
  }
});

bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  ...,
  Title,
  provide('meta.config', {useValue: metaConfig}),
  MetaService
]);

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

## FAQ

#### I'm using angular-cli. How can I add ng2-meta?
After installing `ng2-meta` from npm, modify your **angular-cli-build.js**
```javascript
vendorNpmFiles: [
....
'ng2-meta/dist/meta.service.js'
]
```

Modify **system-config.ts**
```typescript
const map: any = {
  'ng2-meta': 'vendor/ng2-meta/dist/meta.service.js'
}

/** User packages configuration. */
const packages: any = {
  'ng2-meta': {
    format: 'cjs'
  }
}
```


## Development

To generate all `*.js`, `*.js.map` and `*.d.ts` files:

```bash
$ npm run tsc
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## Licence

MIT © [Vinay Gopinath](http://vinaygopinath.me)
