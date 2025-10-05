import { env } from '../config/env';

/**
 * Environment validation errors
 */
export class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

/**
 * Check if all required environment variables are present
 */
export const checkEnvironment = (): void => {
  const errors: string[] = [];
  // Check Supabase configuration
  if (!env.supabase.url) {
    errors.push('VITE_SUPABASE_URL is not set');
  }
  if (!env.supabase.publishableKey) {
    errors.push('VITE_SUPABASE_PUBLISHABLE_KEY is not set');
  }
  // Check app configuration
  if (!env.app.name) {
    errors.push('VITE_APP_NAME is not set');
  }
  if (!env.app.url) {
    errors.push('VITE_APP_URL is not set');
  }
  if (errors.length > 0) {
    throw new EnvironmentError(
      `Missing required environment variables:\n${errors
        .map((e) => `  - ${e}`)
        .join('\n')}\n\nPlease check your .env file.`
    );
  }
};

/**
 * Check for common security mistakes
 */
export const checkSecurityIssues = (): void => {
  const warnings: string[] = [];
  // Check if service role key or legacy JWT is accidentally used
  if (
    env.supabase.publishableKey.length > 500 ||
    env.supabase.publishableKey.startsWith('sb_secret_') ||
    env.supabase.publishableKey.startsWith('eyJ')
  ) {
    warnings.push(
      '⚠️  CRITICAL: Invalid key detected in client configuration!\n' +
        '   - Service Role keys (sb_secret_*) are a severe security vulnerability\n' +
        '   - Legacy JWT keys (eyJ*) are deprecated and no longer supported\n' +
        '   Use the Publishable key (sb_publishable_*) instead.'
    );
  }
  // Check if debug mode is enabled in production
  if (env.isProduction && env.app.debug) {
    warnings.push(
      '⚠️  WARNING: Debug mode is enabled in production.\n' +
        '   This may expose sensitive information.'
    );
  }
  // Check if localhost URL is used in production
  if (env.isProduction && env.app.url.includes('localhost')) {
    warnings.push(
      '⚠️  WARNING: Localhost URL detected in production.\n' +
        '   Update VITE_APP_URL to your production domain.'
    );
  }
  if (warnings.length > 0) {
    console.error(`🚨 SECURITY WARNINGS:\n${warnings.join('\n\n')}`);
    if (warnings[0].includes('CRITICAL')) {
      throw new EnvironmentError('Critical security issue detected. Please fix before continuing.');
    }
  }
};

/**
 * Validate environment on app initialization
 */
export const initializeEnvironment = (): void => {
  try {
    checkEnvironment();
    checkSecurityIssues();
    if (env.isDevelopment) {
      console.info('✅ Environment validation passed');
    }
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    // Show user-friendly error in development
    if (env.isDevelopment) {
      document.body.innerHTML = `
        <div style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-family: system-ui;
          background: #1a1a1a;
          color: #fff;
          padding: 20px;
        ">
          <div style="max-width: 600px;">
            <h1 style="color: #ff6b6b; margin-bottom: 20px;">
              ⚠️ Configuration Error
            </h1>
            <pre style="
              background: #2a2a2a;
              padding: 20px;
              border-radius: 8px;
              overflow-x: auto;
              line-height: 1.5;
            ">${error instanceof Error ? error.message : String(error)}</pre>
            <p style="margin-top: 20px; color: #aaa;">
              Please check your <code>.env</code> file and restart the development server.
            </p>
          </div>
        </div>
      `;
    }
    throw error;
  }
};
