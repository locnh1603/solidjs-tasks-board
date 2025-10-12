/// <reference types="vite/client" />
/// <reference types="solid-js" />

// CSS Modules Type Declaration
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

interface ImportMetaEnv {
  // Supabase Configuration
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;

  // App Configuration
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_URL: string;
  readonly VITE_APP_ENV?: string;

  // Feature Flags
  readonly VITE_ENABLE_DEBUG?: string;
  readonly VITE_ENABLE_ANALYTICS?: string;
  readonly VITE_ENABLE_REALTIME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
