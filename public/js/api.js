/* =========================================================
   FORGETIC — API HELPER
   Centralised fetch wrapper + endpoint methods
   ========================================================= */

const api = {
  baseUrl: '/api',

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('forgetic_token');

    const defaultHeaders = { 'Content-Type': 'application/json' };
    if (token) defaultHeaders['Authorization'] = `Bearer ${token}`;

    const config = {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'API Request failed');
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  auth: {
    login:          (creds)  => api.request('/auth/login',           { method: 'POST', body: JSON.stringify(creds) }),
    register:       (data)   => api.request('/auth/register',        { method: 'POST', body: JSON.stringify(data) }),
    forgotPassword: (email)  => api.request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  },

  ebay: {
    /** Search eBay and get processed metrics. Pass insights=true to also get AI overview. */
    search: (query, insights = false) =>
      api.request(`/ebay/search?q=${encodeURIComponent(query)}&insights=${insights}&raw=true`),
  },

  ai: {
    /** Generic freeform chat with DeepSeek */
    chat: (prompt) =>
      api.request('/ai/chat', { method: 'POST', body: JSON.stringify({ prompt }) }),

    /**
     * Get AI insights for a specific dashboard module.
     * @param {string} module   - one of: overview, research, pricing, demand, competitive,
     *                            customer, segmentation, behavior, estimator
     * @param {string} keyword  - the search keyword
     * @param {object} metrics  - processed metrics from metricsEngine
     */
    moduleInsights: (module, keyword, metrics) =>
      api.request('/ai/module-insights', {
        method: 'POST',
        body: JSON.stringify({ module, keyword, metrics }),
      }),
  },
};

window.api = api;
