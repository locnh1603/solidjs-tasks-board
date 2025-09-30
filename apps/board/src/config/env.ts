/**
 * Type-safe environment variable configuration
 * Validates and provides typed access to environment variables
 */



class EnvironmentConfig {
  // Supabase Configuration
  readonly supabase = {
    url: this.getRequired('VITE_SUPABASE_URL'),
    anonKey: this.getRequired('VITE_SUPABASE_ANON_KEY'),
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
  private getBoolean(
    key: keyof ImportMetaEnv,
    defaultValue: boolean
  ): boolean {
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
    const { url, anonKey } = this.supabase;
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
      console.warn(
        `Warning: VITE_SUPABASE_URL doesn't appear to be a Supabase URL: ${url}`
      );
    }
    // Validate anon key format (JWT)
    if (!anonKey.startsWith('eyJ')) {
      throw new Error(
        `Invalid VITE_SUPABASE_ANON_KEY format\n` +
        `Should start with "eyJ" (JWT format)`
      );
    }
    // Warn if using service role key (common mistake!)
    if (anonKey.length > 500) {
      console.error(
        '⚠️  CRITICAL SECURITY WARNING ⚠️\n' +
        'Your VITE_SUPABASE_ANON_KEY appears to be a Service Role key!\n' +
        'Service Role keys should NEVER be exposed to the client.\n' +
        'Please use the Anon/Public key instead.'
      );
    }
  }

  /**
   * Print configuration (safe for debugging)
   */
  printConfig(): void {
    if (!this.app.debug) return;
    console.group('🔧 Environment Configuration');
    console.log('Environment:', this.isProduction ? 'Production' : 'Development');
    console.log('App Name:', this.app.name);
    console.log('App URL:', this.app.url);
    console.log('Supabase URL:', this.supabase.url);
    console.log('Supabase Key:', this.maskKey(this.supabase.anonKey));
    console.log('Features:', this.features);
    console.groupEnd();
  }

  /**
   * Mask sensitive values for logging
   */
  private maskKey(key: string): string {
    if (key.length < 20) return '***';
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