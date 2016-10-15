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
     * The default title, used when a route does not have its own titleSuffix.
     */
    title?: string;
    /**
     * The default titleSuffix, used when useTitleSuffix is set to true
     * and a route does not have its own titleSuffix.
     */
    titleSuffix?: string;
    [key: string]: string;
  };
}