// Performance monitoring and optimization helper
export const performanceMonitor = {
  // Measure page load performance
  measurePageLoad: () => {
    if (typeof window !== "undefined" && window.performance) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domContentLoaded =
        timing.domContentLoadedEventEnd - timing.navigationStart;

      console.log(`Page Load Time: ${loadTime}ms`);
      console.log(`DOM Content Loaded: ${domContentLoaded}ms`);

      return { loadTime, domContentLoaded };
    }
  },

  // Measure component render time
  measureComponentRender: (componentName, startTime) => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
    return renderTime;
  },

  // Lazy loading observer for images
  createImageObserver: () => {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove("lazy");
                observer.unobserve(img);
              }
            }
          });
        },
        { threshold: 0.1 }
      );
      return observer;
    }
    return null;
  },

  // Debounce function to limit expensive operations
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for scroll events
  throttle: (func, limit) => {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Optimize font loading
  optimizeFonts: () => {
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: 'Bebas Neue';
        font-display: swap;
      }
      @font-face {
        font-family: 'system-ui';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  },

  // Preload critical resources
  preloadResource: (href, as, type = null) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  },
};
