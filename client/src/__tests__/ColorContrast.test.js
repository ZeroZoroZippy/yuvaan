import { analyzeColorScheme, getContrastRatio, checkWCAGCompliance } from '../utils/colorContrastAnalyzer';

describe('Color Contrast Analysis', () => {
  test('should analyze current color scheme for WCAG compliance', () => {
    const results = analyzeColorScheme();
    
    expect(results).toHaveLength(5);
    
    // Log results for manual review
    console.log('Color Contrast Analysis Results:');
    results.forEach(result => {
      console.log(`${result.name}: ${result.ratio}:1 (AA: ${result.compliance.AA ? 'PASS' : 'FAIL'})`);
      if (result.needsImprovement) {
        console.log(`  Suggested improvement: ${result.suggested}`);
      }
    });
  });

  test('should calculate contrast ratio correctly', () => {
    // Test known contrast ratios
    const whiteOnBlack = getContrastRatio('#FFFFFF', '#000000');
    expect(whiteOnBlack).toBeCloseTo(21, 0);
    
    const blackOnWhite = getContrastRatio('#000000', '#FFFFFF');
    expect(blackOnWhite).toBeCloseTo(21, 0);
  });

  test('should check WCAG compliance levels', () => {
    const highContrast = checkWCAGCompliance(7.5);
    expect(highContrast.AA).toBe(true);
    expect(highContrast.AAA).toBe(true);
    
    const mediumContrast = checkWCAGCompliance(4.5);
    expect(mediumContrast.AA).toBe(true);
    expect(mediumContrast.AAA).toBe(false);
    
    const lowContrast = checkWCAGCompliance(3.0);
    expect(lowContrast.AA).toBe(false);
    expect(lowContrast.AAA).toBe(false);
  });

  test('should identify current gold color issues', () => {
    const goldOnDark = getContrastRatio('#A8977A', '#161711');
    const compliance = checkWCAGCompliance(goldOnDark);
    
    // This test will help us understand if our current gold needs adjustment
    console.log(`Current gold (#A8977A) on dark (#161711): ${goldOnDark.toFixed(2)}:1`);
    console.log(`WCAG AA compliance: ${compliance.AA ? 'PASS' : 'FAIL'}`);
    
    if (!compliance.AA) {
      console.log('Gold color needs adjustment for WCAG AA compliance');
    }
  });
});