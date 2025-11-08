/**
 * Performance Monitoring Utilities
 * Comprehensive performance tracking for production
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  category: 'navigation' | 'paint' | 'largest-contentful-paint' | 'cumulative-layout-shift' | 'first-input' | 'custom';
}

interface PerformanceReport {
  coreWebVitals: {
    lcp: number | null;
    fid: number | null;
    cls: number | null;
  };
  navigation: any; // Compatible with different browser APIs
  paint: PerformanceEntry[];
  custom: PerformanceMetric[];
  summary: {
    totalLoadTime: number;
    domContentLoaded: number;
    fullyLoaded: number;
    memoryUsage?: any;
    deviceInfo: {
      connection?: any;
      userAgent: string;
      viewport: { width: number; height: number };
    };
  };
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observer?: PerformanceObserver;

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Monitor Core Web Vitals
    this.observeCoreWebVitals();
    
    // Monitor navigation timing
    this.recordNavigationTiming();
    
    // Monitor paint timing
    this.observePaintTiming();
    
    // Monitor memory usage
    this.recordMemoryUsage();
    
    // Monitor network information
    this.recordNetworkInfo();
  }

  private observeCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('LCP', lastEntry.startTime, 'largest-contentful-paint');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observation not supported');
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (entry.processingStart && entry.startTime) {
              this.recordMetric('FID', entry.processingStart - entry.startTime, 'first-input');
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observation not supported');
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput && entry.value) {
              clsValue += entry.value;
            }
          });
          this.recordMetric('CLS', clsValue, 'cumulative-layout-shift');
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS observation not supported');
      }
    }
  }

  private recordNavigationTiming() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        try {
          const navigation = performance.getEntriesByType('navigation')[0] as any;
          if (navigation) {
            this.recordMetric('DNS Lookup', navigation.domainLookupEnd - navigation.domainLookupStart, 'navigation');
            this.recordMetric('TCP Connect', navigation.connectEnd - navigation.connectStart, 'navigation');
            this.recordMetric('Request', navigation.responseStart - navigation.requestStart, 'navigation');
            this.recordMetric('Response', navigation.responseEnd - navigation.responseStart, 'navigation');
            this.recordMetric('DOM Processing', (navigation.domComplete || navigation.domContentLoadedEventEnd) - (navigation.domLoading || navigation.domContentLoadedEventStart), 'navigation');
            this.recordMetric('Load Complete', navigation.loadEventEnd - navigation.loadEventStart, 'navigation');
          }
        } catch (e) {
          console.warn('Navigation timing not available');
        }
      }, 0);
    });
  }

  private observePaintTiming() {
    if ('PerformanceObserver' in window) {
      try {
        this.observer = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            this.recordMetric(entry.name, entry.startTime, 'paint');
          });
        });
        this.observer.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('Paint observation not supported');
      }
    }
  }

  private recordMemoryUsage() {
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      this.recordMetric('Used JS Heap', memory.usedJSHeapSize, 'custom');
      this.recordMetric('Total JS Heap', memory.totalJSHeapSize, 'custom');
      this.recordMetric('JS Heap Limit', memory.jsHeapSizeLimit, 'custom');
    }
  }

  private recordNetworkInfo() {
    if ((navigator as any).connection) {
      const connection = (navigator as any).connection;
      this.recordMetric('Connection Type', connection.effectiveType === '4g' ? 4 : connection.effectiveType === '3g' ? 3 : 2, 'custom');
      this.recordMetric('Downlink Speed', connection.downlink, 'custom');
    }
  }

  private recordMetric(name: string, value: number, category: PerformanceMetric['category']) {
    if (!isNaN(value) && isFinite(value)) {
      this.metrics.push({
        name,
        value,
        timestamp: performance.now(),
        category
      });
    }
  }

  // Public methods for manual metric recording
  public markStart(markName: string) {
    performance.mark(markName);
  }

  public markEnd(markName: string) {
    performance.mark(markName);
  }

  public measure(measureName: string, startMark: string, endMark?: string) {
    try {
      if (endMark) {
        performance.measure(measureName, startMark, endMark);
      } else {
        performance.measure(measureName, startMark);
      }
      
      const measure = performance.getEntriesByName(measureName, 'measure')[0];
      if (measure) {
        this.recordMetric(measureName, measure.duration, 'custom');
      }
    } catch (e) {
      console.warn('Failed to measure:', measureName, e);
    }
  }

  public generateReport(): PerformanceReport {
    const navigation = performance.getEntriesByType('navigation')[0] as any;
    const paint = performance.getEntriesByType('paint');
    
    // Extract Core Web Vitals
    const lcpMetric = this.metrics.find(m => m.name === 'LCP');
    const fidMetric = this.metrics.find(m => m.name === 'FID');
    const clsMetric = this.metrics.find(m => m.name === 'CLS');

    return {
      coreWebVitals: {
        lcp: lcpMetric?.value || null,
        fid: fidMetric?.value || null,
        cls: clsMetric?.value || null,
      },
      navigation: navigation ? {
        domainLookupEnd: navigation.domainLookupEnd - navigation.domainLookupStart,
        connectEnd: navigation.connectEnd - navigation.connectStart,
        responseEnd: navigation.responseEnd - navigation.responseStart,
        domComplete: (navigation.domComplete || navigation.domContentLoadedEventEnd) - (navigation.domLoading || navigation.domContentLoadedEventStart),
        loadEventEnd: navigation.loadEventEnd - navigation.loadEventStart,
        type: navigation.type,
        redirectCount: navigation.redirectCount
      } : {},
      paint,
      custom: this.metrics,
      summary: {
        totalLoadTime: navigation ? (navigation.loadEventEnd || navigation.loadEventStart) - (navigation.navigationStart || navigation.fetchStart) : 0,
        domContentLoaded: navigation ? (navigation.domContentLoadedEventEnd || navigation.domContentLoadedEventStart) - (navigation.navigationStart || navigation.fetchStart) : 0,
        fullyLoaded: navigation ? (navigation.loadEventEnd || navigation.loadEventStart) - (navigation.navigationStart || navigation.fetchStart) : 0,
        memoryUsage: (performance as any).memory,
        deviceInfo: {
          connection: (navigator as any).connection,
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      }
    };
  }

  public getScore(): { score: number; rating: 'poor' | 'needs-improvement' | 'good'; issues: string[] } {
    const report = this.generateReport();
    const issues: string[] = [];
    let score = 100;

    // LCP Score (should be < 2.5s)
    if (report.coreWebVitals.lcp) {
      if (report.coreWebVitals.lcp > 4000) {
        score -= 30;
        issues.push('LCP is too slow (>4s)');
      } else if (report.coreWebVitals.lcp > 2500) {
        score -= 15;
        issues.push('LCP needs improvement (2.5-4s)');
      }
    }

    // FID Score (should be < 100ms)
    if (report.coreWebVitals.fid) {
      if (report.coreWebVitals.fid > 300) {
        score -= 25;
        issues.push('FID is too slow (>300ms)');
      } else if (report.coreWebVitals.fid > 100) {
        score -= 10;
        issues.push('FID needs improvement (100-300ms)');
      }
    }

    // CLS Score (should be < 0.1)
    if (report.coreWebVitals.cls !== null && report.coreWebVitals.cls !== undefined) {
      if (report.coreWebVitals.cls > 0.25) {
        score -= 30;
        issues.push('CLS is too high (>0.25)');
      } else if (report.coreWebVitals.cls > 0.1) {
        score -= 15;
        issues.push('CLS needs improvement (0.1-0.25)');
      }
    }

    // Memory usage penalty
    if (report.summary.memoryUsage) {
      const { usedJSHeapSize, jsHeapSizeLimit } = report.summary.memoryUsage;
      if (usedJSHeapSize && jsHeapSizeLimit) {
        const usagePercent = (usedJSHeapSize / jsHeapSizeLimit) * 100;
        if (usagePercent > 80) {
          score -= 20;
          issues.push('High memory usage (>80%)');
        } else if (usagePercent > 60) {
          score -= 10;
          issues.push('Moderate memory usage (60-80%)');
        }
      }
    }

    const rating = score >= 90 ? 'good' : score >= 50 ? 'needs-improvement' : 'poor';

    return { score, rating, issues };
  }

  public exportReport(): string {
    const report = this.generateReport();
    const score = this.getScore();
    
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      report,
      score,
      userAgent: navigator.userAgent
    }, null, 2);
  }

  public logReport() {
    const report = this.generateReport();
    const score = this.getScore();
    
    console.group('📊 Performance Report');
    console.log('Score:', `${score.score}/100`, `(${score.rating})`);
    
    if (score.issues.length > 0) {
      console.group('⚠️ Issues');
      score.issues.forEach(issue => console.warn(issue));
      console.groupEnd();
    }
    
    console.log('Core Web Vitals:', report.coreWebVitals);
    console.log('Load Time:', `${report.summary.totalLoadTime.toFixed(2)}ms`);
    
    if (report.summary.memoryUsage) {
      const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = report.summary.memoryUsage;
      if (usedJSHeapSize && totalJSHeapSize && jsHeapSizeLimit) {
        console.log('Memory Usage:', {
          used: `${(usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
          total: `${(totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
          limit: `${(jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
        });
      }
    }
    
    console.groupEnd();
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-log report on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceMonitor.logReport();
  });
}

// Development helper
if (typeof window !== 'undefined') {
  (window as any).performanceMonitor = {
    monitor: performanceMonitor,
    report: () => performanceMonitor.generateReport(),
    score: () => performanceMonitor.getScore(),
    export: () => performanceMonitor.exportReport()
  };
}