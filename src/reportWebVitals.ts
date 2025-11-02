// Simple version without web-vitals dependency
const reportWebVitals = (onPerfEntry?: any) => {
  // Optional: Add performance monitoring here if needed
  if (onPerfEntry && onPerfEntry instanceof Function) {
    console.log('Performance monitoring disabled');
  }
};

export default reportWebVitals;