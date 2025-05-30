
export function getBaseUrls() {
    if (typeof window === 'undefined') return null;
  
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
  
    // const baseDomain = 'parfumderoman.reselluae.com'; // always use this base domain
    // const baseDomain = 'dxb.recomdoors.com'; // always use this base domain
    const baseDomain = 'dxb.reselluae.com'; // always use this base domain
    // const baseDomain = '96613.ecomdoors.com'; // always use this base domain
    // const baseDomain = 'codnetwork.reselluae.com'; // always use this base domain
    // const baseDomain = 'ecomdoors.com'; // for pushed time 
  
    // Handle localhost case
      // if (
      //   hostname === 'localhost' ||
      //   hostname.startsWith('127.') ||
      //   hostname.startsWith('192.')
      // ) {
      //   const pathParts = pathname.split('/').filter(Boolean);
      //   const subdomain = pathParts[0] || ''; // e.g., 'dxb'
    
      //   return {
      //     API_BASE_URL: `https://${subdomain ? subdomain + '.' : ''}${baseDomain}/api/rest`,
      //     IMAGE_BASE_URL: `https://${subdomain ? subdomain + '.' : ''}${baseDomain}/`,
      //     LOGO_BASE_URL: `https://${subdomain ? subdomain + '.' : ''}${baseDomain}/tenancy/assets/`,
      //   };
      // }
  
    // Extract subdomain from any host (e.g., dxb.resalegcc.com or dxb.reselluae.com)
    const parts = hostname.split('.');
    const subdomain = parts.length > 2 ? parts[0] : '';
  
    return {
      API_BASE_URL: `https://${subdomain ? subdomain + '.' : ''}${baseDomain}/api/rest`,
      IMAGE_BASE_URL: `https://${subdomain ? subdomain + '.' : ''}${baseDomain}/`,
      LOGO_BASE_URL: `https://${subdomain ? subdomain + '.' : ''}${baseDomain}/tenancy/assets/`,
    };
  }
  