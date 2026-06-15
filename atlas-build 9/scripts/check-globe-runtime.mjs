#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const BANNED_PATTERNS = [
  /from\s+['"]globe\.gl['"]/,
  /import\s*\(\s*['"]globe\.gl['"]\s*\)/,
  /GlobeGL\s*\(\s*\)\s*\(/,
  /Globe\s*\(\s*\)\s*\(/,
  /removeChild\s*\(/,
  /appendChild\s*\(/,
  /innerHTML\s*=\s*['"`]/,
];

const BANNED_NAMES = ['removeChild', 'appendChild', 'innerHTML'];

const EXCLUDED_DIRS = [
  'node_modules',
  '.next',
  'out',
  '.git',
  'dist',
  'build',
  '.vercel',
];

let foundBanned = false;

function checkFile(filePath) {
  if (!filePath.match(/\.(ts|tsx|js|jsx|mjs)$/)) {
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Check for banned patterns
    BANNED_PATTERNS.forEach((pattern, idx) => {
      if (pattern.test(content)) {
        const lines = content.split('\n');
        lines.forEach((line, lineNum) => {
          if (pattern.test(line)) {
            console.error(
              `❌ BANNED PATTERN in ${path.relative(projectRoot, filePath)}:${lineNum + 1}`
            );
            console.error(`   Pattern: ${pattern}`);
            console.error(`   Line: ${line.trim()}`);
            foundBanned = true;
          }
        });
      }
    });
  } catch (err) {
    // Skip binary files
  }
}

function walkDir(dir) {
  if (EXCLUDED_DIRS.some((exclude) => dir.includes(exclude))) {
    return;
  }

  try {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else {
        checkFile(filePath);
      }
    });
  } catch (err) {
    // Skip permission errors
  }
}

console.log('🔍 Checking for banned globe.gl runtime patterns...\n');

// First, check package.json for direct globe.gl dependency
try {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  if (packageJson.dependencies && packageJson.dependencies['globe.gl']) {
    console.error('❌ DIRECT GLOBE.GL DEPENDENCY FOUND in package.json');
    console.error('   Direct "globe.gl" is banned. Use react-globe.gl instead.');
    console.error('   See GLOBE_RUNTIME_RULES.md for details.\n');
    process.exit(1);
  }
  console.log('✅ package.json: No direct globe.gl dependency\n');
} catch (err) {
  console.warn('⚠️  Warning: Could not check package.json');
}

// Second, check package-lock.json root dependencies
try {
  const lockPath = path.join(projectRoot, 'package-lock.json');
  const lockFile = JSON.parse(fs.readFileSync(lockPath, 'utf-8'));
  
  if (lockFile.dependencies && lockFile.dependencies['globe.gl']) {
    console.error('❌ DIRECT GLOBE.GL IN PACKAGE-LOCK ROOT DEPENDENCIES');
    console.error('   Root package must not depend on direct globe.gl.');
    console.error('   Regenerate lock file: rm package-lock.json && npm install\n');
    process.exit(1);
  }
  console.log('✅ package-lock.json: No direct globe.gl in root dependencies\n');
} catch (err) {
  // Lock file might not exist yet, that's OK
  console.log('ℹ️  package-lock.json not found yet (first npm install)\n');
}

walkDir(projectRoot);

if (foundBanned) {
  console.error(
    '\n❌ BANNED GLOBE RUNTIME PATTERN FOUND: imperative globe.gl / DOM lifecycle usage is not allowed.'
  );
  console.error('   Use react-globe.gl as a React component instead.');
  console.error('   See GLOBE_RUNTIME_RULES.md for details.\n');
  process.exit(1);
} else {
  console.log('✅ No banned patterns detected.\n');
  console.log('Allowed usage:');
  console.log('  ✓ import "react-globe.gl"');
  console.log('  ✓ Use <Globe ref={ref} ... /> as React component');
  console.log('  ✓ Safe ref methods: pointOfView(), controls()\n');
  process.exit(0);
}
