/**
 * Type-safe environment variable configuration
 * Validates and provides typed access to environment variables
 */

class EnvironmentConfig {
  // Supabase Configuration
  readonly supabase = {
    url: this.getRequired('VITE_SUPABASE_URL'),
    publishableKey: this.getRequired('VITE_SUPABASE_PUBLISHABLE_KEY'),
  };

  // App Configuration
  readonly app = {
    name: this.getRequired('VITE_APP_NAME'),
    url: this.getRequired('VITE_APP_URL'),
    debug: this.getBoolean('VITE_ENABLE_DEBUG', false),
  };

  // Feature Flags
  readonly features = {
    analytics: this.getBoolean('VITE_ENABLE_ANALYTICS', true),
    realtime: this.getBoolean('VITE_ENABLE_REALTIME', true),
  };

  // Runtime environment
  readonly isDevelopment = import.meta.env.DEV;
  readonly isProduction = import.meta.env.PROD;

  /**
   * Get required environment variable or throw error
   */
  private getRequired(key: keyof ImportMetaEnv): string {
    const value = import.meta.env[key];
    if (!value) {
      throw new Error(
        `Missing required environment variable: ${key}\n` +
          `Please check your .env file and ensure ${key} is set.`
      );
    }
    return value;
  }

  /**
   * Get optional environment variable with default
   */
  // private getOptional(
  //   key: keyof ImportMetaEnv,
  //   defaultValue: string
  // ): string {
  //   return import.meta.env[key] || defaultValue;
  // }

  /**
   * Parse boolean environment variable
   */
  private getBoolean(key: keyof ImportMetaEnv, defaultValue: boolean): boolean {
    const value = import.meta.env[key];
    if (value === undefined || value === '') {
      return defaultValue;
    }
    return value === 'true' || value === '1';
  }

  /**
   * Validate Supabase configuration
   */
  validateSupabase(): void {
    const { url, publishableKey } = this.supabase;
    // Validate URL format
    try {
      new URL(url);
    } catch {
      throw new Error(
        `Invalid VITE_SUPABASE_URL: ${url}\n` +
          `Must be a valid URL (e.g., https://your-project.supabase.co)`
      );
    }
    // Validate URL is Supabase domain
    if (!url.includes('supabase.co') && !url.includes('supabase.in')) {
      console.warn(`Warning: VITE_SUPABASE_URL doesn't appear to be a Supabase URL: ${url}`);
    }

    // Validate publishable key format (new format only)
    const isPublishableKey = publishableKey.startsWith('sb_publishable_');
    const isAnonKey = publishableKey.startsWith('anon_');

    if (!isPublishableKey && !isAnonKey) {
      throw new Error(
        `Invalid VITE_SUPABASE_PUBLISHABLE_KEY format\n` +
          `Should start with "sb_publishable_" (recommended) or "anon_"\n` +
          `Legacy JWT keys (starting with "eyJ") are no longer supported.\n` +
          `Please migrate to new publishable keys from your Supabase dashboard.`
      );
    }

    // Log which key type is being used
    if (this.isDevelopment) {
      if (isPublishableKey) {
        console.info('✅ Using new publishable key (recommended)');
      } else if (isAnonKey) {
        console.info('📌 Using anon key');
      }
    }

    // Warn if using service role key (common mistake!)
    if (
      publishableKey.length > 500 ||
      publishableKey.startsWith('sb_secret_') ||
      publishableKey.startsWith('eyJ')
    ) {
      console.error(
        '⚠️  CRITICAL SECURITY WARNING ⚠️\n' +
          'Your VITE_SUPABASE_PUBLISHABLE_KEY appears to be invalid!\n' +
          '- Service Role/Secret keys (sb_secret_*) should NEVER be exposed to the client\n' +
          '- Legacy JWT keys (eyJ*) are deprecated and no longer supported\n' +
          'Please use the Publishable key (sb_publishable_*) from your Supabase dashboard.'
      );
    }
  }

  /**
   * Print configuration (safe for debugging)
   */
  printConfig(): void {
    if (!this.app.debug) {
      return;
    }
    /* eslint-disable no-console */
    console.group('🔧 Environment Configuration');
    console.log('Environment:', this.isProduction ? 'Production' : 'Development');
    console.log('App Name:', this.app.name);
    console.log('App URL:', this.app.url);
    console.log('Supabase URL:', this.supabase.url);
    console.log('Supabase Key:', this.maskKey(this.supabase.publishableKey));
    console.log('Features:', this.features);
    console.groupEnd();
    /* eslint-enable no-console */
  }

  /**
   * Mask sensitive values for logging
   */
  private maskKey(key: string): string {
    if (key.length < 20) {
      return '***';
    }
    return `${key.substring(0, 10)}...${key.substring(key.length - 10)}`;
  }
}

// Export singleton instance
export const env = new EnvironmentConfig();

// Validate on initialization
if (import.meta.env.DEV) {
  try {
    env.validateSupabase();
    env.printConfig();
  } catch (error) {
    console.error('❌ Environment Configuration Error:', error);
    throw error;
  }
}
