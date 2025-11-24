export const API_CONFIG = {
  getBaseUrl: () => {
    // Force production URL - Updated at 12:12 PM
    const productionUrl = 'https://markwave-live-services-650581102834.asia-south1.run.app';
    
    // Debug logging
    console.log('🔗 API Base URL:', productionUrl);
    console.log('🌐 Current hostname:', window.location.hostname);
    
    return productionUrl;
    
    // TODO: Uncomment below for local development
    // const isLocalhost = window.location.hostname === 'localhost' || 
    //                    window.location.hostname === '127.0.0.1';
    // if (isLocalhost) {
    //   return 'http://localhost:8000';
    // }
    // return 'https://markwave-live-services-650581102834.asia-south1.run.app';
  }
};

export const API_ENDPOINTS = {
  getUsers: () => `${API_CONFIG.getBaseUrl()}/users/customers`,
  getReferrals: () => `${API_CONFIG.getBaseUrl()}/users/referrals`,
  createUser: () => `${API_CONFIG.getBaseUrl()}/users/`,
  getUserDetails: (mobile: string) => `${API_CONFIG.getBaseUrl()}/users/${mobile}`,
  verifyUser: () => `${API_CONFIG.getBaseUrl()}/users/verify`,
  updateUser: (mobile: string) => `${API_CONFIG.getBaseUrl()}/users/${mobile}`,
  getProducts: () => `${API_CONFIG.getBaseUrl()}/products`,
  health: () => `${API_CONFIG.getBaseUrl()}/health`
};
