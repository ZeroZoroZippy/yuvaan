#!/usr/bin/env node

/**
 * Test Runner for SEO and Accessibility Tests
 * 
 * This script provides an easy way to run specific test suites
 * for SEO and accessibility validation.
 */

const { execSync } = require('child_process');
const path = require('path');

const testSuites = {
  seo: [
    'src/components/SEO/__tests__/MetaManager.simple.test.js',
    'src/config/__tests__/metaConfigs.test.js'
  ],
  accessibility: [
    'src/components/__tests__/Navbar.accessibility.test.js',
    'src/__tests__/HeadingHierarchy.test.js'
  ],
  images: [
    'src/components/__tests__/OptimizedImage.test.js',
    'src/__tests__/ImageOptimization.integration.test.js'
  ],
  all: [
    'src/components/SEO/__tests__/MetaManager.simple.test.js',
    'src/config/__tests__/metaConfigs.test.js',
    'src/components/__tests__/Navbar.accessibility.test.js',
    'src/__tests__/HeadingHierarchy.test.js',
    'src/components/__tests__/OptimizedImage.test.js',
    'src/__tests__/ImageOptimization.integration.test.js'
  ]
};

function runTests(suite = 'all') {
  const tests = testSuites[suite];
  
  if (!tests) {
    console.error(`Unknown test suite: ${suite}`);
    console.log('Available suites:', Object.keys(testSuites).join(', '));
    process.exit(1);
  }

  console.log(`Running ${suite} tests...`);
  
  try {
    const testFiles = tests.join(' ');
    const command = `npm test -- ${testFiles} --watchAll=false --verbose`;
    
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    
    console.log(`✅ ${suite} tests completed successfully!`);
  } catch (error) {
    console.error(`❌ ${suite} tests failed:`, error.message);
    process.exit(1);
  }
}

// Parse command line arguments
const suite = process.argv[2] || 'all';
runTests(suite);