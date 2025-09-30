# SolidJS + Vite: Secure Environment Variables Handling

## 🔒 Security Overview

When working with SolidJS and Vite, understanding how to properly handle environment variables is critical, especially when dealing with sensitive data like Supabase API keys.

### Key Security Principles

```mermaid
graph TB
    A[Environment Variables] --> B{Variable Type}
    B -->|Public| C[Safe for Client]
    B -->|Private| D[Never Expose to Client]
    
    C --> E[VITE_ Prefix]
    C --> F[Built into Bundle]
    C --> G[Visible in Browser]
    
    D --> H[Backend Only]
    D --> I[Service Role Keys]
    D --> J[Private API Keys]
    
    style C fill:#90EE90
    style D fill:#FFB6C6
    style E fill:#87CEEB
```

---

## 🎯 Solution Architecture

### Understanding Supabase Key Types

```mermaid
graph LR
    A[Supabase Keys] --> B[Anon/Public Key]
    A --> C[Service Role Key]
    
    B --> B1[✅ Safe for Client]
    B --> B2[Rate Limited]
    B --> B3[RLS Protected]
    
    C --> C1[❌ NEVER in Client]
    C --> C2[Full Admin Access]
    C --> C3[Bypasses RLS]
    
    style B fill:#90EE90
    style C fill:#FF6B6B
```

**Critical Understanding:**
- **Anon Key** = Public key, protected by Row Level Security (RLS) policies
- **Service Role Key** = Admin key that bypasses all security rules

---

## 📁 Project Structure

```
solidjs-project/
├── .env                          # ❌ Never commit
├── .env.example                  # ✅ Commit this (template)
├── .env.local                    # ❌ Never commit (local overrides)
├── .env.production               # ❌ Never commit (production values)
├── .gitignore                    # ✅ Must include .env files
├── src/
│   ├── config/
│   │   ├── env.ts               # ✅ Environment variable validation
│   │   └── constants.ts         # ✅ Non-sensitive constants
│   ├── lib/
│   │   ├── supabase.ts          # ✅ Supabase client (uses anon key)
│   │   └── supabase-admin.ts    # ❌ Admin client (backend only)
│   └── utils/
│       └── env-checker.ts       # ✅ Runtime validation
├── server/                       # Backend (if using SSR)
│   ├── .env.server              # ❌ Never commit
│   └── config/
│       └── secure-env.ts        # ✅ Server-side only variables
└── vite.config.ts               # ✅ Build configuration
```

---

## 🔧 Implementation Guide

### Step 1: Environment File Setup

#### `.env.example` (Commit This)
```bash
# Supabase Configuration
# Public keys - Safe to expose to client
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
VITE_APP_NAME=TaskBoard
VITE_APP_URL=http://localhost:3000
VITE_ENABLE_DEBUG=false

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_REALTIME=true

# ⚠️ NEVER PUT SERVICE_ROLE_KEY HERE WITH VITE_ PREFIX
# Service role keys should only be in backend/server environment
```

#### `.env` (Local Development - Never Commit)
```bash
# Copy from .env.example and fill in real values
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Local overrides
VITE_APP_URL=http://localhost:3000
VITE_ENABLE_DEBUG=true
```

#### `.gitignore` (Critical!)
```bash
# Environment variables
.env
.env.local
.env.*.local
.env.production
.env.development

# Keep example file
!.env.example

# Other sensitive files
.env.server
*.key
*.pem
secrets/
```

---

### Step 2: Type-Safe Environment Configuration

#### `src/config/env.ts`
```typescript
/**
 * Type-safe environment variable configuration
 * Validates and provides typed access to environment variables
 */

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_URL: string;
  readonly VITE_ENABLE_DEBUG: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_REALTIME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Validated and typed environment configuration
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
  private getOptional(
    key: keyof ImportMetaEnv,
    defaultValue: string
  ): string {
    return import.meta.env[key] || defaultValue;
  }

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
```

---

### Step 3: Supabase Client Setup

#### `src/lib/supabase.ts` (Client-Side - Safe)
```typescript
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';
import type { Database } from '../types/database.types';

/**
 * Supabase client for client-side operations
 * Uses ANON key - safe to expose to browser
 * Protected by Row Level Security (RLS) policies
 */
export const supabase = createClient<Database>(
  env.supabase.url,
  env.supabase.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: localStorage,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    global: {
      headers: {
        'x-application-name': env.app.name,
      },
    },
  }
);

// Log initialization in development
if (env.isDevelopment) {
  console.log('✅ Supabase client initialized');
}

/**
 * Helper function to check if client is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
  try {
    return !!(env.supabase.url && env.supabase.anonKey);
  } catch {
    return false;
  }
};

/**
 * Get current session
 */
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { session } = await getCurrentSession();
  return !!session;
};
```

---

### Step 4: Runtime Environment Validation

#### `src/utils/env-checker.ts`
```typescript
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
  
  if (!env.supabase.anonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is not set');
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
      'Missing required environment variables:\n' +
      errors.map(e => `  - ${e}`).join('\n') +
      '\n\nPlease check your .env file.'
    );
  }
};

/**
 * Check for common security mistakes
 */
export const checkSecurityIssues = (): void => {
  const warnings: string[] = [];
  
  // Check if service role key is accidentally used
  if (env.supabase.anonKey.length > 500) {
    warnings.push(
      '⚠️  CRITICAL: Service Role key detected in client configuration!\n' +
      '   This is a severe security vulnerability.\n' +
      '   Use the Anon/Public key instead.'
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
    console.error(
      '🚨 SECURITY WARNINGS:\n' +
      warnings.join('\n\n')
    );
    
    if (warnings[0].includes('CRITICAL')) {
      throw new EnvironmentError(
        'Critical security issue detected. Please fix before continuing.'
      );
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
      console.log('✅ Environment validation passed');
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
```

---

### Step 5: App Initialization

#### `src/index.tsx`
```typescript
import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import { initializeEnvironment } from './utils/env-checker';
import App from './App';
import './index.css';

// Validate environment before rendering
try {
  initializeEnvironment();
  
  const root = document.getElementById('root');
  
  if (!root) {
    throw new Error('Root element not found');
  }
  
  render(
    () => (
      <Router>
        <App />
      </Router>
    ),
    root
  );
} catch (error) {
  console.error('Failed to initialize application:', error);
  
  // Error is already displayed by initializeEnvironment
  // in development mode
}
```

---

## 🏗️ Vite Configuration

### `vite.config.ts`
```typescript
import { defineConfig, loadEnv } from 'vite';
import solid from 'vite-plugin-solid';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [solid()],
    
    // Define which env variables to expose
    // Only VITE_ prefixed variables are exposed by default
    define: {
      // You can explicitly define additional variables if needed
      // But be careful not to expose secrets!
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    
    // Environment variable configuration
    envPrefix: 'VITE_', // Only expose VITE_ prefixed variables
    
    // Build configuration
    build: {
      target: 'esnext',
      minify: 'terser',
      sourcemap: mode === 'development',
      
      // Rollup options for chunking
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-solid': ['solid-js', '@solidjs/router'],
            'vendor-supabase': ['@supabase/supabase-js'],
          },
        },
      },
      
      // Security: Don't include source code in production
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: true,
        },
      },
    },
    
    // Development server configuration
    server: {
      port: 3000,
      strictPort: false,
      open: true,
      
      // CORS configuration if needed
      cors: true,
    },
    
    // Preview server configuration
    preview: {
      port: 4173,
      strictPort: false,
    },
    
    // Path aliases
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@lib': path.resolve(__dirname, './src/lib'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@config': path.resolve(__dirname, './src/config'),
      },
    },
  };
});
```

---

## 🚀 Production Deployment

### Deployment Checklist

```mermaid
graph TB
    A[Deployment Preparation] --> B[Environment Setup]
    A --> C[Security Audit]
    A --> D[Build Process]
    
    B --> B1[Set Production Variables]
    B --> B2[Verify No Secrets in Repo]
    B --> B3[Configure CI/CD]
    
    C --> C1[Audit Exposed Variables]
    C --> C2[Check RLS Policies]
    C --> C3[Verify Key Types]
    
    D --> D1[Build Application]
    D --> D2[Test Build]
    D --> D3[Deploy to Platform]
    
    style C fill:#FFE5B4
    style C1 fill:#FFB6C6
    style C2 fill:#FFB6C6
    style C3 fill:#FFB6C6
```

### Platform-Specific Guides

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Set environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_APP_URL production

# Deploy
vercel --prod
```

#### Netlify Deployment
```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

# Environment variables set in Netlify Dashboard:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
# VITE_APP_URL
```

#### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_APP_URL: ${{ secrets.VITE_APP_URL }}
        run: npm run build
      
      - name: Deploy
        run: # Your deployment command
```

---

## 🛡️ Security Best Practices

### DO's ✅

```typescript
// ✅ DO: Use VITE_ prefix for client-safe variables
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...

// ✅ DO: Validate environment variables at runtime
env.validateSupabase();

// ✅ DO: Use type-safe environment configuration
const url = env.supabase.url;

// ✅ DO: Add .env to .gitignore
// ✅ DO: Commit .env.example
// ✅ DO: Use Supabase RLS policies
// ✅ DO: Rotate keys if exposed
```

### DON'Ts ❌

```typescript
// ❌ DON'T: Use service role key in client
VITE_SUPABASE_SERVICE_ROLE_KEY=xxx // NEVER DO THIS!

// ❌ DON'T: Commit .env files
git add .env // NO!

// ❌ DON'T: Store secrets in code
const API_KEY = 'hardcoded-secret'; // NO!

// ❌ DON'T: Use non-prefixed env vars (won't work in client)
DATABASE_URL=xxx // Won't be available in browser

// ❌ DON'T: Log sensitive values
console.log(env.supabase.anonKey); // Use masking instead

// ❌ DON'T: Skip environment validation
// ❌ DON'T: Ignore security warnings
```

---

## 🔍 Testing Environment Configuration

### `src/config/__tests__/env.test.ts`
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Environment Configuration', () => {
  beforeEach(() => {
    vi.resetModules();
  });
  
  it('should throw error when required variable is missing', () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    
    expect(() => {
      // Import will trigger validation
      require('../env');
    }).toThrow('Missing required environment variable');
  });
  
  it('should validate Supabase URL format', () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'not-a-url');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'eyJ...');
    
    const { env } = require('../env');
    
    expect(() => {
      env.validateSupabase();
    }).toThrow('Invalid VITE_SUPABASE_URL');
  });
  
  it('should warn about service role key in client', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    
    vi.stubEnv('VITE_SUPABASE_URL', 'https://project.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'a'.repeat(600)); // Long key
    
    const { env } = require('../env');
    env.validateSupabase();
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Service Role key')
    );
  });
  
  it('should parse boolean environment variables correctly', () => {
    vi.stubEnv('VITE_ENABLE_DEBUG', 'true');
    vi.stubEnv('VITE_ENABLE_ANALYTICS', 'false');
    
    const { env } = require('../env');
    
    expect(env.app.debug).toBe(true);
    expect(env.features.analytics).toBe(false);
  });
});
```

---

## 📊 Environment Variable Audit Tool

### `scripts/audit-env.ts`
```typescript
#!/usr/bin/env node

/**
 * Audit environment variables for security issues
 * Run: npm run audit:env
 */

import * as fs from 'fs';
import * as path from 'path';

interface AuditResult {
  file: string;
  issues: string[];
  warnings: string[];
}

const SENSITIVE_PATTERNS = [
  /service[-_]?role/i,
  /secret[-_]?key/i,
  /private[-_]?key/i,
  /password/i,
  /auth[-_]?token/i,
];

const ENV_FILES = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
];

function auditEnvFile(filePath: string): AuditResult {
  const result: AuditResult = {
    file: filePath,
    issues: [],
    warnings: [],
  };
  
  if (!fs.existsSync(filePath)) {
    return result;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Skip comments and empty lines
    if (!line.trim() || line.trim().startsWith('#')) {
      return;
    }
    
    const [key, value] = line.split('=').map(s => s.trim());
    
    if (!key || !value) return;
    
    // Check if variable has VITE_ prefix for client variables
    if (key.startsWith('VITE_')) {
      // Check for sensitive patterns in client variables
      SENSITIVE_PATTERNS.forEach(pattern => {
        if (pattern.test(key) || pattern.test(value)) {
          result.issues.push(
            `Line ${lineNum}: Sensitive data with VITE_ prefix - ` +
            `will be exposed to client: ${key}`
          );
        }
      });
      
      // Check for long keys (possible service role key)
      if (value.length > 500) {
        result.issues.push(
          `Line ${lineNum}: Very long key detected - ` +
          `possible Service Role key: ${key}`
        );
      }
    } else {
      // Warn about non-VITE_ prefixed variables
      result.warnings.push(
        `Line ${lineNum}: Variable without VITE_ prefix ` +
        `won't be available in client: ${key}`
      );
    }
  });
  
  return result;
}

function checkGitignore(): string[] {
  const issues: string[] = [];
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  
  if (!fs.existsSync(gitignorePath)) {
    issues.push('No .gitignore file found!');
    return issues;
  }
  
  const content = fs.readFileSync(gitignorePath, 'utf-8');
  
  ENV_FILES.forEach(file => {
    if (!content.includes(file)) {
      issues.push(`${file} not found in .gitignore`);
    }
  });
  
  return issues;
}

function main() {
  console.log('🔍 Auditing environment variables...\n');
  
  let hasIssues = false;
  
  // Check .gitignore
  const gitignoreIssues = checkGitignore();
  if (gitignoreIssues.length > 0) {
    console.log('❌ .gitignore Issues:');
    gitignoreIssues.forEach(issue => console.log(`   - ${issue}`));
    console.log();
    hasIssues = true;
  }
  
  // Audit each env file
  ENV_FILES.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    const result = auditEnvFile(filePath);
    
    if (result.issues.length > 0 || result.warnings.length > 0) {
      console.log(`📄 ${file}:`);
      
      if (result.issues.length > 0) {
        console.log('  ❌ Issues:');
        result.issues.forEach(issue => console.log(`     ${issue}`));
        hasIssues = true;
      }
      
      if (result.warnings.length > 0) {
        console.log('  ⚠️  Warnings:');
        result.warnings.forEach(warning => console.log(`     ${warning}`));
      }
      
      console.log();
    }
  });
  
  if (!hasIssues) {
    console.log('✅ No security issues found!\n');
  } else {
    console.log('❌ Security issues detected. Please fix before deploying.\n');
    process.exit(1);
  }
}

main();
```

### Add to `package.json`
```json
{
  "scripts": {
    "audit:env": "tsx scripts/audit-env.ts",
    "precommit": "npm run audit:env"
  }
}
```

---

## 📚 Complete Example

### Minimal Working Setup

#### 1. Create `.env.example`
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
VITE_APP_NAME=MyApp
VITE_APP_URL=http://localhost:3000
VITE_ENABLE_DEBUG=false
```

#### 2. Create `.env` (from example)
```bash
cp .env.example .env
# Edit .env with your actual values
```

#### 3. Create `src/config/env.ts`
```typescript
interface Env {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

const getEnv = (key: keyof Env): string => {
  const value = import.meta.env[key];
  if (!value) throw new Error(`Missing ${key}`);
  return value;
};

export const env = {
  supabase: {
    url: getEnv('VITE_SUPABASE_URL'),
    anonKey: getEnv('VITE_SUPABASE_ANON_KEY'),
  },
  isDev: import.meta.env.DEV,
};
```

#### 4. Create `src/lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

export const supabase = createClient(
  env.supabase.url,
  env.supabase.anonKey
);
```

#### 5. Use in Components
```typescript
import { createSignal, onMount } from 'solid-js';
import { supabase } from './lib/supabase';

export default function App() {
  const [user, setUser] = createSignal(null);
  
  onMount(async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  });
  
  return <div>Hello {user()?.email}</div>;
}
```

---

## 🔐 Advanced: Server-Side Variables (SSR)

For applications using SolidStart or other SSR solutions:

### Server Environment Configuration

#### `server/.env.server` (Never commit)
```bash
# Server-side only - NEVER expose to client
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://user:pass@host:5432/db
STRIPE_SECRET_KEY=sk_live_...
SMTP_PASSWORD=secret123

# These are fine - will be used on server only
SERVER_PORT=3000
NODE_ENV=production
```

#### `server/config/server-env.ts`
```typescript
/**
 * Server-side environment configuration
 * These variables are NEVER sent to the client
 */

interface ServerEnv {
  SUPABASE_SERVICE_ROLE_KEY: string;
  DATABASE_URL: string;
  STRIPE_SECRET_KEY: string;
  SMTP_PASSWORD: string;
  SERVER_PORT: string;
  NODE_ENV: string;
}

class ServerEnvironment {
  private getServerEnv(key: keyof ServerEnv): string {
    // On server, use process.env (Node.js environment)
    const value = process.env[key];
    
    if (!value) {
      throw new Error(
        `Missing required server environment variable: ${key}\n` +
        `This should be set in your server environment or .env.server file`
      );
    }
    
    return value;
  }
  
  readonly supabase = {
    serviceRoleKey: this.getServerEnv('SUPABASE_SERVICE_ROLE_KEY'),
  };
  
  readonly database = {
    url: this.getServerEnv('DATABASE_URL'),
  };
  
  readonly stripe = {
    secretKey: this.getServerEnv('STRIPE_SECRET_KEY'),
  };
  
  readonly smtp = {
    password: this.getServerEnv('SMTP_PASSWORD'),
  };
  
  readonly server = {
    port: parseInt(this.getServerEnv('SERVER_PORT'), 10),
    nodeEnv: this.getServerEnv('NODE_ENV'),
  };
  
  readonly isProduction = this.server.nodeEnv === 'production';
}

export const serverEnv = new ServerEnvironment();

// Validate service role key format
if (serverEnv.supabase.serviceRoleKey.length < 100) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY appears invalid. ' +
    'Make sure you are using the Service Role key, not the Anon key.'
  );
}
```

#### `server/lib/supabase-admin.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import { serverEnv } from '../config/server-env';

/**
 * Admin Supabase client - SERVER SIDE ONLY
 * Uses Service Role key - bypasses RLS
 * NEVER expose this to the client!
 */
export const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!, // Safe to use public URL
  serverEnv.supabase.serviceRoleKey, // Service role key - SERVER ONLY
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Example: Admin function to delete user (bypasses RLS)
 */
export async function deleteUserAsAdmin(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  return { error };
}

/**
 * Example: Query data as admin (bypasses RLS)
 */
export async function getAllUsersAsAdmin() {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*');
  
  return { data, error };
}
```

#### `server/api/admin.ts` (API Route Example)
```typescript
import { json } from '@solidjs/router';
import { supabaseAdmin } from '../lib/supabase-admin';

/**
 * Server-side API endpoint
 * This code runs on the server, never sent to client
 */
export async function GET() {
  try {
    // Use admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('admin_stats')
      .select('*');
    
    if (error) throw error;
    
    return json({ data });
  } catch (error) {
    return json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
```

---

## 🎯 Environment Variable Hierarchy

Understanding the precedence of environment variables:

```mermaid
graph TD
    A[Environment Variable Sources] --> B[1. System Environment]
    A --> C[2. .env.local]
    A --> D[3. .env.mode]
    A --> E[4. .env]
    
    B --> F[Highest Priority]
    C --> G[Development Override]
    D --> H[Mode-Specific]
    E --> I[Base Configuration]
    
    F --> J[Final Value]
    G --> J
    H --> J
    I --> J
    
    style B fill:#90EE90
    style C fill:#FFE5B4
    style D fill:#87CEEB
    style E fill:#DDA0DD
```

### Loading Order
```bash
# Vite loads env files in this order (later overrides earlier):
1. .env                          # Base for all environments
2. .env.local                    # Local overrides (gitignored)
3. .env.[mode]                   # Mode specific (development/production)
4. .env.[mode].local             # Mode + local overrides
5. process.env / system env      # System environment variables (highest priority)
```

### Example Setup
```bash
# .env (committed)
VITE_API_URL=https://api.example.com
VITE_FEATURE_X=false

# .env.local (not committed - your local overrides)
VITE_API_URL=http://localhost:3001
VITE_ENABLE_DEBUG=true

# .env.production (committed)
VITE_FEATURE_X=true
VITE_ENABLE_ANALYTICS=true

# .env.development (committed)
VITE_ENABLE_DEBUG=true
VITE_MOCK_API=true
```

---

## 🚨 Emergency Response: Key Exposure

If you accidentally expose a sensitive key:

### Immediate Actions

```mermaid
graph TD
    A[Key Exposed!] --> B[1. Revoke Immediately]
    B --> C[2. Generate New Key]
    C --> D[3. Update All Deployments]
    D --> E[4. Audit Access Logs]
    E --> F[5. Notify Team]
    F --> G[6. Document Incident]
    
    style A fill:#FF6B6B
    style B fill:#FFE5B4
```

### Step-by-Step Recovery

#### 1. Revoke Exposed Keys (Supabase)
```bash
# Go to Supabase Dashboard
# Project Settings > API
# Click "Reset" next to the exposed key
# Save the new key
```

#### 2. Update Environment Variables
```bash
# Update .env files
VITE_SUPABASE_ANON_KEY=new-key-here

# Update deployment platforms
vercel env rm VITE_SUPABASE_ANON_KEY production
vercel env add VITE_SUPABASE_ANON_KEY production
# Enter new key when prompted

# Or for Netlify
netlify env:set VITE_SUPABASE_ANON_KEY new-key-here
```

#### 3. Clean Git History (if committed)
```bash
# Install git-filter-repo
pip install git-filter-repo

# Remove sensitive data from history
git filter-repo --path .env --invert-paths

# Force push (WARNING: destructive)
git push origin --force --all

# Notify team to re-clone repository
```

#### 4. Rotate All Related Credentials
```bash
# Update all related services that use the exposed key
# Check Supabase Access Logs for suspicious activity
# Review and update RLS policies
# Consider implementing IP allowlisting
```

---

## 📋 Security Checklist

### Pre-Deployment Checklist

```markdown
- [ ] All `.env` files in `.gitignore`
- [ ] `.env.example` created and committed
- [ ] Only VITE_ prefixed variables in client
- [ ] No Service Role keys in client code
- [ ] Environment validation implemented
- [ ] Anon key used (not Service Role)
- [ ] RLS policies properly configured
- [ ] Security audit script run
- [ ] All secrets rotated from dev
- [ ] CI/CD secrets properly configured
- [ ] Production URLs configured
- [ ] Debug mode disabled in production
- [ ] Console logs removed/disabled
- [ ] Source maps disabled or secured
- [ ] CSP headers configured
- [ ] HTTPS enforced
```

### Regular Security Audits

```bash
# Run before every deployment
npm run audit:env

# Check for exposed secrets in git history
git log -p | grep -i "supabase_key"

# Verify .gitignore
git check-ignore .env

# Test environment validation
npm run test:env
```

---

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### Issue 1: Variables Not Loading

```typescript
// ❌ Problem
console.log(import.meta.env.MY_VAR); // undefined

// ✅ Solutions:
// 1. Add VITE_ prefix
VITE_MY_VAR=value

// 2. Restart dev server after adding new variables
npm run dev

// 3. Check variable name spelling
console.log(import.meta.env.VITE_MY_VAR);
```

#### Issue 2: Variables Not Available in Production

```bash
# ❌ Problem: Forgot to set in deployment platform

# ✅ Solution: Set in platform dashboard or CLI
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Or use deployment config file
# vercel.json
{
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

#### Issue 3: TypeScript Errors

```typescript
// ❌ Problem: TypeScript doesn't recognize import.meta.env

// ✅ Solution: Add type definitions
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_NAME: string;
  // Add all your VITE_ variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

#### Issue 4: Service Role Key Accidentally Used

```typescript
// ❌ Problem: Using service role key in client
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (very long)

// ✅ Solution:
// 1. IMMEDIATELY revoke the key in Supabase dashboard
// 2. Use anon/public key instead
VITE_SUPABASE_ANON_KEY=eyJhbGc... (shorter, different key)

// 3. Add validation to catch this
if (env.supabase.anonKey.length > 500) {
  throw new Error('Service role key detected! Use anon key.');
}
```

#### Issue 5: Environment Not Validated

```typescript
// ❌ Problem: App crashes at runtime due to missing variables

// ✅ Solution: Add initialization validation
// src/index.tsx
import { initializeEnvironment } from './utils/env-checker';

initializeEnvironment(); // Validates before app starts

render(() => <App />, document.getElementById('root')!);
```

---

## 🎓 Best Practices Summary

### Golden Rules

1. **Never commit secrets** - Use `.gitignore` religiously
2. **Use VITE_ prefix** - Only way to expose variables to client
3. **Anon key only** - Service role keys are for backend only
4. **Validate early** - Check environment on app initialization
5. **Rotate regularly** - Change keys periodically
6. **Audit frequently** - Run security checks before deployment
7. **Document everything** - Maintain `.env.example`
8. **Test thoroughly** - Verify environment in all environments

### Environment Variable Types

| Type | Prefix | Location | Purpose | Example |
|------|--------|----------|---------|---------|
| Public Client | `VITE_` | Client bundle | Public config | `VITE_SUPABASE_URL` |
| Public Key | `VITE_` | Client bundle | Anon/Public key | `VITE_SUPABASE_ANON_KEY` |
| Server Only | None | Server only | Admin operations | `SUPABASE_SERVICE_ROLE_KEY` |
| Build Time | `VITE_` | Build process | App metadata | `VITE_APP_VERSION` |

### Security Levels

```mermaid
graph LR
    A[Security Levels] --> B[🟢 Safe for Client]
    A --> C[🟡 Careful Handling]
    A --> D[🔴 Never in Client]
    
    B --> B1[Anon Keys]
    B --> B2[Public URLs]
    B --> B3[App Names]
    
    C --> C1[API Endpoints]
    C --> C2[Feature Flags]
    C --> C3[Debug Settings]
    
    D --> D1[Service Role Keys]
    D --> D2[Private Keys]
    D --> D3[Passwords]
    
    style B fill:#90EE90
    style C fill:#FFE5B4
    style D fill:#FFB6C6
```

---

## 📖 Additional Resources

### Official Documentation
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase Client Keys](https://supabase.com/docs/guides/api/api-keys)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [SolidJS Deployment](https://www.solidjs.com/guides/deployment)

### Security Tools
- [git-secrets](https://github.com/awslabs/git-secrets) - Prevent committing secrets
- [truffleHog](https://github.com/trufflesecurity/trufflehog) - Find secrets in git history
- [dotenv-linter](https://github.com/dotenv-linter/dotenv-linter) - Lint .env files

### Example Projects
```bash
# Clone example with proper environment setup
git clone https://github.com/solidjs/solid-start
cd solid-start/examples/with-supabase

# Review the environment configuration
cat .env.example
cat src/lib/supabase.ts
```

---

## 🎬 Quick Start Script

Save this as `setup-env.sh`:

```bash
#!/bin/bash

echo "🔧 Setting up environment variables..."

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env already exists. Backup created as .env.backup"
    cp .env .env.backup
fi

# Copy from example
if [ -f .env.example ]; then
    cp .env.example .env
    echo "✅ Created .env from .env.example"
else
    echo "❌ .env.example not found!"
    exit 1
fi

# Check .gitignore
if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo ".env" >> .gitignore
    echo "✅ Added .env to .gitignore"
fi

echo ""
echo "📝 Next steps:"
echo "1. Edit .env with your actual values"
echo "2. Get your Supabase keys from: https://app.supabase.com/project/_/settings/api"
echo "3. Use ANON key (not Service Role key!)"
echo "4. Run: npm run dev"
echo ""
echo "🔒 Security reminders:"
echo "- Never commit .env files"
echo "- Only use anon/public keys in client"
echo "- Keep service role keys on server only"
```

Make executable:
```bash
chmod +x setup-env.sh
./setup-env.sh
```

---

## 💡 Key Takeaways

1. **VITE_ Prefix Required**: Only `VITE_` prefixed variables are exposed to client
2. **Anon Key is Safe**: Supabase anon keys are designed for client use (with RLS)
3. **Service Role = Danger**: Never expose service role keys to the client
4. **Validate Early**: Check environment variables at app initialization
5. **Git History Matters**: Even deleted files can be recovered from git history
6. **Platform Secrets**: Use deployment platform's secret management
7. **Audit Regularly**: Run security checks before every deployment
8. **Document Everything**: Maintain `.env.example` for team members

---

## ✅ Final Checklist

Before deploying your SolidJS + Vite + Supabase application:

```markdown
### Pre-Deployment Security Audit

#### Git & Version Control
- [ ] `.env` in `.gitignore`
- [ ] No secrets in git history
- [ ] `.env.example` committed
- [ ] No commented-out secrets in code

#### Environment Configuration
- [ ] Only `VITE_` prefixed variables in client
- [ ] Anon key used (not Service Role)
- [ ] All required variables defined
- [ ] Type definitions created
- [ ] Validation implemented

#### Supabase Configuration
- [ ] RLS policies enabled on all tables
- [ ] Anon key permissions verified
- [ ] Service role key secured (backend only)
- [ ] Database backups enabled

#### Security Measures
- [ ] CSP headers configured
- [ ] HTTPS enforced
- [ ] Debug mode disabled in production
- [ ] Console logs removed/minimized
- [ ] Error tracking configured

#### Deployment Platform
- [ ] Environment variables set in platform
- [ ] Build succeeds with production env
- [ ] Secrets not in build logs
- [ ] Domain configured correctly

#### Testing
- [ ] Environment validation runs
- [ ] Security audit passes
- [ ] Manual testing completed
- [ ] Error scenarios tested

#### Documentation
- [ ] README updated
- [ ] Environment setup documented
- [ ] Team notified of changes
- [ ] Incident response plan ready
```

---

**Remember**: The anon/public key is SAFE for client use when properly protected by Row Level Security policies. The real danger is exposing service role keys or other admin credentials.

Stay secure! 🔒