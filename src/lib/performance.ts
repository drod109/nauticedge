import React from 'react';
import { logger } from './logger';

interface PerformanceMetricData {
  error?: boolean;
  [key: string]: any;
}

interface PerformanceMetric {
  name: string;
  startTime: number;
  duration?: number;
  metadata?: PerformanceMetricData;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private readonly PERFORMANCE_THRESHOLD = 1000; // 1 second

  startMetric(name: string, metadata?: Record<string, any>) {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata
    });
  }

  endMetric(name: string, additionalMetadata?: PerformanceMetricData) {
    const metric = this.metrics.get(name);
    if (!metric) {
      logger.warn(`No metric found with name: ${name}`);
      return;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    // Log if duration exceeds threshold
    if (duration > this.PERFORMANCE_THRESHOLD) {
      logger.warn('Performance threshold exceeded', {
        metric: name,
        duration,
        threshold: this.PERFORMANCE_THRESHOLD,
        metadata: {
          ...metric.metadata,
          ...additionalMetadata
        }
      });
    }

    // Update metric with duration
    this.metrics.set(name, {
      ...metric,
      duration,
      metadata: {
        ...metric.metadata,
        ...additionalMetadata
      }
    });

    return duration;
  }

  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  clearMetrics() {
    this.metrics.clear();
  }

  // Measure component render time
  measureRender = <P extends object>(
    Component: React.ComponentType<P>,
    name: string
  ): React.ComponentType<P> => {
    return React.forwardRef<any, P>((props, ref) => {
      const metricName = `render_${name}`;
      
      React.useEffect(() => {
        this.startMetric(metricName);
        return () => {
          this.endMetric(metricName);
        };
      }, []);

      return React.createElement(Component, { ...props, ref });
    });
  };

  // Measure hook execution time
  measureHook<T>(hook: () => T, name: string): () => T {
    return () => {
      const metricName = `hook_${name}`;
      
      React.useEffect(() => {
        this.startMetric(metricName);
        return () => {
          this.endMetric(metricName);
        };
      }, []);

      return hook();
    };
  }

  // Measure async function execution time
  async measureAsync<T>(
    fn: () => Promise<T>,
    name: string,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startMetric(name, metadata);

    try {
      const result = await fn();
      this.endMetric(name);
      return result;
    } catch (error) {
      this.endMetric(name, { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  // Get performance report
  getReport() {
    const report = Array.from(this.metrics.values()).map(metric => ({
      name: metric.name,
      duration: metric.duration || 0,
      metadata: metric.metadata
    }));

    return {
      metrics: report,
      summary: {
        totalMetrics: report.length,
        averageDuration: report.reduce((acc, curr) => acc + curr.duration, 0) / report.length,
        slowestOperation: report.reduce((prev, curr) => 
          prev.duration > curr.duration ? prev : curr
        ),
        thresholdExceeded: report.filter(m => m.duration > this.PERFORMANCE_THRESHOLD).length
      }
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();