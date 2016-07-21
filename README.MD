# ng2-meta

Update HTML meta tags for title, description and others automatically based on the route in your Angular2 app.

## Getting started

### Install
To install this library, run:

```bash
$ npm install ng2-meta --save
```

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
        titleSuffix: ' | Website Name',
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
        description: 'Description of the dashboard page'
      }
    }
    </strong>
  }
];
</code>
</pre>

### Inject MetaService

<pre>
<code>
<strong>import { MetaService } from 'ng2-meta';</strong>
...
bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  ...
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
