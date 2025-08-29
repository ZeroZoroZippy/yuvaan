/**
 * Color Contrast Analyzer for WCAG Compliance
 * Analyzes color combinations and suggests improvements
 */

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculate relative luminance
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

// Check WCAG compliance
function checkWCAGCompliance(ratio) {
  return {
    AA: ratio >= 4.5,
    AAA: ratio >= 7,
    AALarge: ratio >= 3,
    AAALarge: ratio >= 4.5
  };
}

// Adjust color for better contrast
function adjustColorForContrast(foreground, background, targetRatio = 4.5) {
  const bgRgb = hexToRgb(background);
  const fgRgb = hexToRgb(foreground);
  
  if (!bgRgb || !fgRgb) return foreground;
  
  const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  
  // Determine if we need to make foreground lighter or darker
  const shouldLighten = bgLum < 0.5;
  
  let adjustedColor = { ...fgRgb };
  let currentRatio = getContrastRatio(foreground, background);
  
  // Adjust color until we meet target ratio
  while (currentRatio < targetRatio) {
    if (shouldLighten) {
      // Lighten the color
      adjustedColor.r = Math.min(255, adjustedColor.r + 5);
      adjustedColor.g = Math.min(255, adjustedColor.g + 5);
      adjustedColor.b = Math.min(255, adjustedColor.b + 5);
    } else {
      // Darken the color
      adjustedColor.r = Math.max(0, adjustedColor.r - 5);
      adjustedColor.g = Math.max(0, adjustedColor.g - 5);
      adjustedColor.b = Math.max(0, adjustedColor.b - 5);
    }
    
    const newHex = `#${adjustedColor.r.toString(16).padStart(2, '0')}${adjustedColor.g.toString(16).padStart(2, '0')}${adjustedColor.b.toString(16).padStart(2, '0')}`;
    currentRatio = getContrastRatio(newHex, background);
    
    // Prevent infinite loop
    if ((shouldLighten && adjustedColor.r >= 255) || (!shouldLighten && adjustedColor.r <= 0)) {
      break;
    }
  }
  
  return `#${adjustedColor.r.toString(16).padStart(2, '0')}${adjustedColor.g.toString(16).padStart(2, '0')}${adjustedColor.b.toString(16).padStart(2, '0')}`;
}

// Analyze current color scheme
export function analyzeColorScheme() {
  const colors = {
    background: '#45372B',
    darkBackground: '#161711',
    gold: '#A8977A',
    white: '#FFFFFF',
    black: '#000000'
  };
  
  const combinations = [
    { name: 'Gold on Dark Background', fg: colors.gold, bg: colors.darkBackground },
    { name: 'Gold on Main Background', fg: colors.gold, bg: colors.background },
    { name: 'White on Dark Background', fg: colors.white, bg: colors.darkBackground },
    { name: 'White on Main Background', fg: colors.white, bg: colors.background },
    { name: 'Black on Gold', fg: colors.black, bg: colors.gold }
  ];
  
  const results = combinations.map(combo => {
    const ratio = getContrastRatio(combo.fg, combo.bg);
    const compliance = checkWCAGCompliance(ratio);
    const suggested = !compliance.AA ? adjustColorForContrast(combo.fg, combo.bg) : combo.fg;
    
    return {
      ...combo,
      ratio: Math.round(ratio * 100) / 100,
      compliance,
      suggested,
      needsImprovement: !compliance.AA
    };
  });
  
  return results;
}

// Generate improved color palette
export function generateImprovedPalette() {
  const current = {
    background: '#45372B',
    darkBackground: '#161711',
    gold: '#A8977A'
  };
  
  const improved = {
    background: current.background,
    darkBackground: current.darkBackground,
    gold: adjustColorForContrast(current.gold, current.darkBackground, 4.5),
    goldLight: adjustColorForContrast(current.gold, current.background, 4.5),
    goldHover: adjustColorForContrast('#FFFFFF', current.darkBackground, 4.5)
  };
  
  return improved;
}

export { getContrastRatio, checkWCAGCompliance, adjustColorForContrast };