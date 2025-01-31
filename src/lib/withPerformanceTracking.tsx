import React, { useEffect, useRef } from 'react';
import { performanceMonitor } from './performance';
import { logger } from './logger';
import { notificationService } from './notifications';
import { keyVaultService } from './keyVault';

interface RenderMetrics {
  mountTime: number;
  updateCount: number;
  totalRenderTime: number;
  averageRenderTime: number;
  lastRenderTime: number;
  slowRenders: number;
  memoryUsage?: number;
  interactionCount: number;
  lastInteractionTime?: number;
  fps: number;
  layoutShifts: number;
  longTasks: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
  timeToInteractive?: number;
  resourceLoadTimes: Record<string, number>;
}

export const withPerformanceTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: {
    componentName?: string;
    threshold?: number;
    logToConsole?: boolean;
    notifyOnSlowRender?: boolean;
    memoryWarningThreshold?: number;
    fpsWarningThreshold?: number;
    persistMetrics?: boolean;
    trackWebVitals?: boolean;
    trackResources?: boolean;
    trackLongTasks?: boolean;
  } = {}
) => {
  const displayName = options.componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const PerformanceTrackedComponent: React.FC<P> = (props) => {
    const renderCount = useRef(0);
    const metrics = useRef<RenderMetrics>({
      mountTime: 0,
      updateCount: 0,
      totalRenderTime: 0,
      averageRenderTime: 0,
      lastRenderTime: 0,
      slowRenders: 0,
      memoryUsage: undefined,
      interactionCount: 0,
      fps: 60,
      layoutShifts: 0,
      longTasks: 0,
      resourceLoadTimes: {}
    });
    const startTime = useRef<number>(0);
    const frameTime = useRef<number>(0);
    const lastFrameTime = useRef<number>(0);
    const frameCount = useRef<number>(0);
    const observers = useRef<{
      layout?: PerformanceObserver;
      longTask?: PerformanceObserver;
      resource?: PerformanceObserver;
      paint?: PerformanceObserver;
      interaction?: PerformanceObserver;
    }>({});

    useEffect(() => {
      // Measure initial mount time
      const mountTime = performance.now() - startTime.current;
      metrics.current.mountTime = mountTime;

      // Set up performance observers
      if (options.trackWebVitals) {
        setupWebVitalsObservers();
      }

      if (options.trackLongTasks) {
        setupLongTaskObserver();
      }

      if (options.trackResources) {
        setupResourceObserver();
      }

      // Load persisted metrics if enabled
      if (options.persistMetrics) {
        loadPersistedMetrics();
      }

      // Log mount metrics
      logger.info(`${displayName} mounted`, {
        mountTime,
        component: displayName,
        memoryUsage: metrics.current.memoryUsage
      });

      return () => {
        // Clean up observers
        Object.values(observers.current).forEach(observer => {
          observer?.disconnect();
        });

        // Persist metrics if enabled
        if (options.persistMetrics) {
          persistMetrics();
        }

        // Log final metrics on unmount
        logger.info(`${displayName} unmounted`, {
          metrics: metrics.current,
          component: displayName
        });
      };
    }, []);

    // Set up Web Vitals observers
    const setupWebVitalsObservers = () => {
      if ('PerformanceObserver' in window) {
        // Layout Shifts
        observers.current.layout = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              metrics.current.layoutShifts++;
              metrics.current.cumulativeLayoutShift = (metrics.current.cumulativeLayoutShift || 0) + entry.value;
            }
          }
        });
        observers.current.layout.observe({ entryTypes: ['layout-shift'] });

        // Paint Timing
        observers.current.paint = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              metrics.current.firstContentfulPaint = entry.startTime;
            }
            if (entry.name === 'largest-contentful-paint') {
              metrics.current.largestContentfulPaint = entry.startTime;
            }
          }
        });
        observers.current.paint.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

        // First Input Delay
        observers.current.interaction = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!metrics.current.firstInputDelay) {
              metrics.current.firstInputDelay = entry.processingStart - entry.startTime;
            }
          }
        });
        observers.current.interaction.observe({ entryTypes: ['first-input'] });
      }
    };

    // Set up Long Tasks observer
    const setupLongTaskObserver = () => {
      if ('PerformanceObserver' in window) {
        observers.current.longTask = new PerformanceObserver((list) => {
          metrics.current.longTasks += list.getEntries().length;
        });
        observers.current.longTask.observe({ entryTypes: ['longtask'] });
      }
    };

    // Set up Resource Timing observer
    const setupResourceObserver = () => {
      if ('PerformanceObserver' in window) {
        observers.current.resource = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            metrics.current.resourceLoadTimes[entry.name] = entry.duration;
          }
        });
        observers.current.resource.observe({ entryTypes: ['resource'] });
      }
    };

    // Load persisted metrics
    const loadPersistedMetrics = async () => {
      try {
        const key = `metrics_${displayName}`;
        const persistedMetrics = await keyVaultService.getSecureKey(key);
        if (persistedMetrics) {
          metrics.current = { ...metrics.current, ...JSON.parse(persistedMetrics) };
        }
      } catch (error) {
        logger.error('Failed to load persisted metrics', { error });
      }
    };

    // Persist metrics
    const persistMetrics = async () => {
      try {
        const key = `metrics_${displayName}`;
        await keyVaultService.storeSecureKey(key, JSON.stringify(metrics.current));
      } catch (error) {
        logger.error('Failed to persist metrics', { error });
      }
    };

    // Calculate FPS
    const calculateFPS = () => {
      const now = performance.now();
      const elapsed = now - lastFrameTime.current;
      frameCount.current++;

      if (elapsed >= 1000) { // Update FPS every second
        metrics.current.fps = Math.round((frameCount.current * 1000) / elapsed);
        frameCount.current = 0;
        lastFrameTime.current = now;

        // Check FPS threshold
        if (options.fpsWarningThreshold && metrics.current.fps < options.fpsWarningThreshold) {
          logger.warn(`${displayName} FPS dropped below threshold`, {
            fps: metrics.current.fps,
            threshold: options.fpsWarningThreshold
          });
        }
      }
    };

    useEffect(() => {
      // Track render completion
      const renderTime = performance.now() - startTime.current;
      const frameDuration = performance.now() - frameTime.current;
      renderCount.current++;
      calculateFPS();

      // Update metrics
      metrics.current = {
        ...metrics.current,
        updateCount: renderCount.current - 1, // Subtract initial mount
        totalRenderTime: metrics.current.totalRenderTime + renderTime,
        averageRenderTime: (metrics.current.totalRenderTime + renderTime) / renderCount.current,
        lastRenderTime: renderTime,
        slowRenders: metrics.current.slowRenders + (renderTime > (options.threshold || 16) ? 1 : 0)
      };

      // Check frame budget (16.67ms for 60fps)
      if (frameDuration > 16.67) {
        logger.warn(`${displayName} exceeded frame budget`, {
          frameDuration,
          component: displayName
        });
      }

      // Check if render time exceeds threshold
      if (renderTime > (options.threshold || 16)) { // 16ms = 60fps
        logger.warn(`${displayName} render time exceeded threshold`, {
          renderTime,
          threshold: options.threshold || 16,
          component: displayName,
          metrics: metrics.current,
          frameDuration
        });

        if (options.notifyOnSlowRender) {
          notificationService.warning({
            title: 'Performance Warning',
            message: `${displayName} is rendering slowly (${renderTime.toFixed(1)}ms)`
          });
        }
      }

      // Check memory usage if available and threshold is set
      if (performance.memory && options.memoryWarningThreshold) {
        const memoryUsage = performance.memory.usedJSHeapSize;
        if (memoryUsage > options.memoryWarningThreshold) {
          logger.warn(`${displayName} exceeded memory threshold`, {
            memoryUsage,
            threshold: options.memoryWarningThreshold,
            component: displayName
          });
        }
        metrics.current.memoryUsage = memoryUsage;
      }

      if (options.logToConsole) {
        console.log(`[Performance] ${displayName} render metrics:`, {
          renderCount: renderCount.current,
          lastRenderTime: renderTime.toFixed(2) + 'ms',
          averageRenderTime: metrics.current.averageRenderTime.toFixed(2) + 'ms',
          slowRenders: metrics.current.slowRenders,
          fps: metrics.current.fps,
          layoutShifts: metrics.current.layoutShifts,
          longTasks: metrics.current.longTasks,
          memoryUsage: metrics.current.memoryUsage ? 
            `${(metrics.current.memoryUsage / 1024 / 1024).toFixed(1)}MB` : 
            'Not available',
          webVitals: {
            fcp: metrics.current.firstContentfulPaint,
            lcp: metrics.current.largestContentfulPaint,
            fid: metrics.current.firstInputDelay,
            cls: metrics.current.cumulativeLayoutShift,
            tti: metrics.current.timeToInteractive
          }
        });
      }

      // Store metrics in performance monitor
      performanceMonitor.endMetric(`render_${displayName}`, {
        renderCount: renderCount.current,
        renderTime,
        ...metrics.current
      });
    });

    // Start timing before each render
    startTime.current = performance.now();
    frameTime.current = performance.now();
    performanceMonitor.startMetric(`render_${displayName}`);

    // Track user interactions
    const handleInteraction = () => {
      metrics.current.interactionCount++;
      metrics.current.lastInteractionTime = performance.now();
    };

    return (
      <div onClick={handleInteraction} onKeyDown={handleInteraction}>
        <WrappedComponent {...props} />
      </div>
    );
  };

  PerformanceTrackedComponent.displayName = `withPerformanceTracking(${displayName})`;

  return PerformanceTrackedComponent;
};

// Helper function to create a tracked component with options
export const createTrackedComponent = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    componentName?: string;
    threshold?: number;
    logToConsole?: boolean;
    notifyOnSlowRender?: boolean;
    memoryWarningThreshold?: number;
    fpsWarningThreshold?: number;
    persistMetrics?: boolean;
    trackWebVitals?: boolean;
    trackResources?: boolean;
    trackLongTasks?: boolean;
  }
) => withPerformanceTracking(Component, options);

// Example usage:
// const TrackedComponent = createTrackedComponent(MyComponent, {
//   componentName: 'MyComponent',
//   threshold: 100,
//   logToConsole: true
// });