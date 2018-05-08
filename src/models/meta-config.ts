import { InjectionToken } from '@angular/core';

export const DEFAULT_META_CONFIG: MetaConfig = {
  useTitleSuffix: false,
  warnMissingGuard: true,
  defaults: {}
};
/**
 * Additional site-wide configuration of meta tags.
 *
 * Use this to enable adding a title suffix to the title of each route,
 * or to set default meta tags to be used when no equivalent meta tag
 * exists in the meta configuration of the route.
 *
 *
 * Default
 * ```
 * {
 *   useTitleSuffix: false,
 *   defaults: {}
 * }
 * ```
 */
export interface MetaConfig {
  /**
   * Flag to append an optional title suffix to the title.
   * Default value: false
   */
  useTitleSuffix?: boolean;
  /**
   * Flag to show a warning for each route that is missing MetaGuard in its `canActivate` array when
   * * the route contains `data: { meta: {} }`
   *
   * OR
   *
   * * the site-wide MetaConfig contains default meta tags
   *
   * Default value: true
   */
  warnMissingGuard?: boolean;
  /**
   * A dictionary of default meta tags and their values
   */
  defaults?: {
    /**
     * The default title, used when a route does not have its own titleSuffix.
     */
    title?: string;
    /**
     * The default titleSuffix, used when useTitleSuffix is set to true
     * and a route does not have its own titleSuffix.
     */
    titleSuffix?: string;
  } & { [key: string]: string | undefined; };
}
