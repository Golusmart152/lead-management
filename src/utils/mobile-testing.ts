/**
 * Mobile Testing Utilities
 * Helper functions for mobile development and testing
 */

// Mobile breakpoint detection
export const getDeviceInfo = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const userAgent = navigator.userAgent;
  
  return {
    width,
    height,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    deviceType: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop',
    orientation: width > height ? 'landscape' : 'portrait',
    isIOS: /iPad|iPhone|iPod/.test(userAgent),
    isAndroid: /Android/.test(userAgent),
    isChrome: /Chrome/.test(userAgent),
    isSafari: /Safari/.test(userAgent),
    pixelRatio: window.devicePixelRatio || 1,
  };
};

// Touch detection
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Safe area detection
export const getSafeArea = () => {
  const computedStyle = getComputedStyle(document.documentElement);
  return {
    top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
    right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
    bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
  };
};

// Performance testing utilities
export const measurePerformance = async (name: string, fn: () => Promise<any>) => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  console.log(`[Performance] ${name}: ${end - start}ms`);
  return result;
};

// Test mobile optimizations
export const testMobileOptimizations = () => {
  const device = getDeviceInfo();
  const issues: string[] = [];
  
  // Check if touch targets are adequate
  const buttons = document.querySelectorAll('button, [role="button"]');
  buttons.forEach((btn, index) => {
    const rect = btn.getBoundingClientRect();
    if (rect.height < 44 || rect.width < 44) {
      issues.push(`Button ${index} has touch target smaller than 44px (${rect.height}x${rect.width})`);
    }
  });
  
  // Check viewport meta tag
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    issues.push('Missing viewport meta tag');
  } else if (!viewport.getAttribute('content')?.includes('user-scalable=no')) {
    // This is actually good for accessibility, so we don't flag it as an issue
  }
  
  // Check for horizontal scrolling
  const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
  if (hasHorizontalScroll) {
    issues.push('Page has horizontal scroll - may need mobile optimization');
  }
  
  return {
    device,
    issues,
    passed: issues.length === 0,
    summary: issues.length === 0 ? 'All mobile optimizations passed' : `${issues.length} issues found`
  };
};

// Simulate different devices for testing
export const simulateDevice = (deviceType: 'mobile' | 'tablet' | 'desktop') => {
  const dimensions = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 800 }
  };
  
  const { width, height } = dimensions[deviceType];
  
  // This is for development/testing purposes
  // In production, use actual device testing
  console.log(`Simulating ${deviceType} device: ${width}x${height}`);
  
  // Apply CSS classes for testing
  document.body.className = document.body.className
    .replace(/device-\w+/g, '')
    .trim();
  document.body.classList.add(`device-${deviceType}`);
};

// Load testing helpers
export const createMobileTestSuite = () => {
  const tests = {
    navigation: () => {
      const sidebar = document.querySelector('[data-sidebar]');
      const sheet = document.querySelector('[data-sheet]');
      return {
        passed: !!(sidebar || sheet),
        message: 'Navigation component found'
      };
    },
    
    tables: () => {
      const tables = document.querySelectorAll('table, [data-mobile-table]');
      return {
        passed: tables.length > 0,
        message: `Found ${tables.length} table(s)`
      };
    },
    
    forms: () => {
      const forms = document.querySelectorAll('form, [data-form]');
      return {
        passed: forms.length > 0,
        message: `Found ${forms.length} form(s)`
      };
    },
    
    buttons: () => {
      const buttons = document.querySelectorAll('button, [role="button"]');
      const smallButtons = Array.from(buttons).filter(btn => {
        const rect = btn.getBoundingClientRect();
        return rect.height < 44 || rect.width < 44;
      });
      
      return {
        passed: smallButtons.length === 0,
        message: `${buttons.length} buttons found, ${smallButtons.length} below 44px`
      };
    },
    
    performance: () => {
      const loadTime = performance.now();
      return {
        passed: loadTime < 3000,
        message: `Page load time: ${Math.round(loadTime)}ms`
      };
    }
  };
  
  return tests;
};

// Export test results
export const runMobileTests = () => {
  console.log('🧪 Running mobile optimization tests...');
  
  const testSuite = createMobileTestSuite();
  const results = Object.entries(testSuite).map(([name, test]) => {
    try {
      const result = test();
      return { name, ...result, error: null };
    } catch (error) {
      return { name, passed: false, message: 'Test failed', error: error instanceof Error ? error.message : String(error) };
    }
  });
  
  const optimizationTest = testMobileOptimizations();
  
  console.table(results);
  console.log('📱 Mobile Optimization Results:', optimizationTest);
  
  return {
    componentTests: results,
    optimizationTest,
    overallScore: Math.round(
      (results.filter(r => r.passed).length / results.length) * 
      (optimizationTest.passed ? 1 : 0.8) * 100
    )
  };
};

// Development helper
if (typeof window !== 'undefined') {
  (window as any).mobileTesting = {
    getDeviceInfo,
    isTouchDevice,
    getSafeArea,
    testMobileOptimizations,
    simulateDevice,
    runMobileTests,
    createMobileTestSuite,
  };
}