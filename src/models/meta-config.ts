export interface MetaConfig {
  /**
   * Flag to append an optional title suffix to the title.
   * Default value: false
   */
  useTitleSuffix?: boolean;
  /**
   * A dictionary of default meta tags and their values
   */
  defaults?: {
    /**
     * Meta values
     */
    meta?: {
      /**
       * The default title, used when a route does not have its own titleSuffix.
       */
      title?: string;
      /**
       * The default titleSuffix, used when useTitleSuffix is set to true
       * and a route does not have its own titleSuffix.
       */
      titleSuffix?: string;
      /**
       * Other default meta tag key/value pairs
       */
      [key: string]: string;
    },
    /**
     * Link tag values
     */
    links?: {
      /**
       * Link tag key/value pairs
       */
      [key: string]: string;
    },
    /**
     * Alternate link tag values
     */
    alternateLinks?: Array<string>;
  };
}
