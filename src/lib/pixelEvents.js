export const trackFacebookEvent = (eventName, eventData = {}) => {
    if (typeof window !== 'undefined' && typeof window.fbq !== 'undefined') {
      window.fbq('track', eventName, eventData);
    }
  };
  
  export const trackTikTokEvent = (eventName, eventData = {}) => {
    if (typeof window !== 'undefined' && typeof window.ttq !== 'undefined') {
      if (eventName === 'PageView') {
        window.ttq.track('PageView');
      } else {
        window.ttq.track(eventName, eventData);
      }
    }
  };

  export const trackBothEvents = (eventName, eventData) => {
    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', eventName, eventData);
    }
    
    // TikTok Pixel
    if (window.ttq) {
      window.ttq.track(eventName, eventData);
    }
  };