# SEO and Accessibility Test Suite

This directory contains comprehensive automated tests for SEO and accessibility compliance, covering the requirements specified in the SEO accessibility improvements specification.

## Test Structure

### 1. SEO Meta Tag Tests (`/components/SEO/__tests__/`)

#### MetaManager.test.js
- **Purpose**: Validates meta tag generation and management
- **Coverage**:
  - Basic meta tags (title, description, keywords, author)
  - Character limit validation (titles ≤60 chars, descriptions ≤160 chars)
  - Open Graph meta tags for social media
  - Twitter Card meta tags
  - Structured data (JSON-LD) validation
  - Canonical URL handling

#### metaConfigs.test.js (`/config/__tests__/`)
- **Purpose**: Tests page-specific meta configurations
- **Coverage**:
  - Static page configurations (home, about, blog, projects)
  - Dynamic page configurations (project details, blog posts)
  - Character limit compliance across all pages
  - Required keyword presence
  - URL formatting validation

### 2. Accessibility Tests

#### Navbar.accessibility.test.js (`/components/__tests__/`)
- **Purpose**: Comprehensive navbar accessibility testing
- **Coverage**:
  - ARIA labels and attributes
  - Keyboard navigation support
  - Focus management and indicators
  - Screen reader compatibility
  - Mobile menu accessibility
  - Color contrast compliance
  - Automated axe-core testing

#### HeadingHierarchy.test.js (`/__tests__/`)
- **Purpose**: Validates proper heading structure across pages
- **Coverage**:
  - Single H1 per page validation
  - Proper heading hierarchy (no skipped levels)
  - Semantic HTML structure
  - Screen reader navigation support
  - Dynamic content heading management

### 3. Image Optimization Tests

#### OptimizedImage.test.js (`/components/__tests__/`)
- **Purpose**: Tests the OptimizedImage component functionality
- **Coverage**:
  - Basic image rendering
  - Lazy loading implementation
  - Alt text validation and quality
  - WebP format support with fallbacks
  - Performance optimization
  - Accessibility compliance
  - Error handling
  - Responsive behavior

#### ImageOptimization.integration.test.js (`/__tests__/`)
- **Purpose**: Integration tests for image optimization across the application
- **Coverage**:
  - WebP format usage throughout the app
  - Alt text quality assessment
  - Lazy loading implementation
  - Performance optimization
  - SEO image optimization
  - Accessibility integration

## Running Tests

### Prerequisites
```bash
cd client
npm install
```

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites

#### SEO Tests Only
```bash
npm test -- src/components/SEO/__tests__/ src/config/__tests__/ --watchAll=false
```

#### Accessibility Tests Only
```bash
npm test -- src/components/__tests__/Navbar.accessibility.test.js src/__tests__/HeadingHierarchy.test.js --watchAll=false
```

#### Image Optimization Tests Only
```bash
npm test -- src/components/__tests__/OptimizedImage.test.js src/__tests__/ImageOptimization.integration.test.js --watchAll=false
```

#### Using the Test Runner Script
```bash
node src/test-runner.js seo          # Run SEO tests
node src/test-runner.js accessibility # Run accessibility tests
node src/test-runner.js images       # Run image optimization tests
node src/test-runner.js all          # Run all tests (default)
```

### Coverage Reports
```bash
npm test -- --coverage --watchAll=false
```

## Test Requirements Mapping

### Requirements 1.1-1.4, 2.1-2.3 (Meta Tags)
- ✅ `MetaManager.test.js` - Tests meta tag generation
- ✅ `metaConfigs.test.js` - Tests page-specific configurations
- ✅ Character limit validation
- ✅ Route-specific meta tag updates

### Requirements 3.1-3.2 (Heading Hierarchy)
- ✅ `HeadingHierarchy.test.js` - Tests H1 uniqueness per page
- ✅ Proper H2/H3 structure validation
- ✅ No skipped heading levels

### Requirements 4.1-4.2, 8.1-8.2 (Accessibility)
- ✅ `Navbar.accessibility.test.js` - ARIA label testing
- ✅ Keyboard navigation functionality
- ✅ Focus indicator validation
- ✅ Screen reader compatibility

### Requirements 5.1-5.3 (Image Optimization)
- ✅ `OptimizedImage.test.js` - Alt text presence and quality
- ✅ `ImageOptimization.integration.test.js` - Lazy loading validation
- ✅ WebP format usage and fallbacks
- ✅ Performance optimization testing

## Continuous Integration

These tests are designed to run in CI/CD pipelines to ensure ongoing compliance with SEO and accessibility standards.

### GitHub Actions Example
```yaml
- name: Run SEO and Accessibility Tests
  run: |
    cd client
    npm ci
    npm test -- --watchAll=false --coverage
```

### Pre-commit Hook Example
```bash
#!/bin/sh
cd client && npm test -- --watchAll=false --passWithNoTests
```

## Test Maintenance

### Adding New Tests
1. Follow the existing naming convention: `ComponentName.test.js`
2. Include comprehensive test descriptions
3. Map tests to specific requirements
4. Update this README with new test coverage

### Updating Tests
1. Ensure backward compatibility
2. Update requirement mappings if needed
3. Maintain test performance (avoid slow tests)
4. Keep tests focused and atomic

## Troubleshooting

### Common Issues

#### Tests Failing Due to Missing Dependencies
```bash
npm install --save-dev @axe-core/react jest-axe
```

#### Mock Issues
- Ensure all external dependencies are properly mocked
- Check that React Router and context providers are wrapped correctly

#### Performance Issues
- Use `--watchAll=false` for CI environments
- Consider splitting large test files if they become slow

### Debug Mode
```bash
npm test -- --verbose --no-cache
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: Test names should clearly describe what is being tested
3. **Requirement Mapping**: Always map tests to specific requirements
4. **Performance**: Keep tests fast and focused
5. **Accessibility**: Use axe-core for automated accessibility testing
6. **Coverage**: Aim for high coverage but focus on quality over quantity

## Contributing

When adding new SEO or accessibility features:

1. Write tests first (TDD approach)
2. Ensure tests cover both positive and negative cases
3. Include integration tests for complex features
4. Update documentation and requirement mappings
5. Run the full test suite before submitting changes