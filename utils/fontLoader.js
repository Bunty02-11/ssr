// Font loading utility for better performance
export const fontLoader = {
  // Check if fonts are loaded
  areFontsLoaded: () => {
    if (typeof document === 'undefined') return false;
    return document.fonts.check('16px Inter');
  },

  // Preload critical fonts
  preloadFonts: () => {
    if (typeof document === 'undefined') return;
    
    const fontsToPreload = [
      '/fonts/web/Inter-Regular.woff2',
      '/fonts/web/Inter-Medium.woff2',
      '/fonts/web/Inter-SemiBold.woff2',
      '/fonts/web/Inter-Bold.woff2'
    ];

    fontsToPreload.forEach(fontPath => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = fontPath;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  },

  // Font loading promise
  loadFonts: () => {
    if (typeof document === 'undefined') return Promise.resolve();
    
    return new Promise((resolve) => {
      if (fontLoader.areFontsLoaded()) {
        resolve();
        return;
      }

      document.fonts.ready.then(() => {
        // Add a class to indicate fonts are loaded
        document.documentElement.classList.add('fonts-loaded');
        resolve();
      });

      // Fallback timeout
      setTimeout(() => {
        document.documentElement.classList.add('fonts-loaded');
        resolve();
      }, 3000);
    });
  },

  // FOUT prevention
  preventFOUT: () => {
    if (typeof document === 'undefined') return;
    
    // Add CSS to prevent FOUT
    const style = document.createElement('style');
    style.textContent = `
      .fonts-loading {
        visibility: hidden;
      }
      .fonts-loaded {
        visibility: visible;
      }
    `;
    document.head.appendChild(style);
    
    // Initially hide content
    document.documentElement.classList.add('fonts-loading');
    
    fontLoader.loadFonts().then(() => {
      document.documentElement.classList.remove('fonts-loading');
      document.documentElement.classList.add('fonts-loaded');
    });
  }
};

export default fontLoader; 