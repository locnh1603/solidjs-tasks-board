#!/usr/bin/env node
/**
 * Audit environment variables for security issues
 * Run: npm run audit:env
 */
import * as fs from 'fs';
import * as path from 'path';

// Add Node.js types for process, fs, and path
/// <reference types="node" />

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
  lines.forEach((line: string, index: number) => {
    const lineNum = index + 1;
    if (!line.trim() || line.trim().startsWith('#')) return;
    const [key, value] = line.split('=').map((s: string) => s.trim());
    if (!key || !value) return;
    if (key.startsWith('VITE_')) {
      SENSITIVE_PATTERNS.forEach((pattern: RegExp) => {
        if (pattern.test(key) || pattern.test(value)) {
          result.issues.push(
            `Line ${lineNum}: Sensitive data with VITE_ prefix - will be exposed to client: ${key}`
          );
        }
      });
      if (value.length > 500) {
        result.issues.push(
          `Line ${lineNum}: Very long key detected - possible Service Role key: ${key}`
        );
      }
    } else {
      result.warnings.push(
        `Line ${lineNum}: Variable without VITE_ prefix won't be available in client: ${key}`
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
  ENV_FILES.forEach((file: string) => {
    if (!content.includes(file)) {
      issues.push(`${file} not found in .gitignore`);
    }
  });
  return issues;
}

function main(): void {
  console.log('🔍 Auditing environment variables...\n');
  let hasIssues = false;
  const gitignoreIssues = checkGitignore();
  if (gitignoreIssues.length > 0) {
    console.log('❌ .gitignore Issues:');
    gitignoreIssues.forEach((issue: string) => console.log(`   - ${issue}`));
    console.log();
    hasIssues = true;
  }
  ENV_FILES.forEach((file: string) => {
    const filePath = path.join(process.cwd(), file);
    const result = auditEnvFile(filePath);
    if (result.issues.length > 0 || result.warnings.length > 0) {
      console.log(`📄 ${file}:`);
      if (result.issues.length > 0) {
        console.log('  ❌ Issues:');
        result.issues.forEach((issue: string) => console.log(`     ${issue}`));
        hasIssues = true;
      }
      if (result.warnings.length > 0) {
        console.log('  ⚠️  Warnings:');
        result.warnings.forEach((warning: string) => console.log(`     ${warning}`));
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