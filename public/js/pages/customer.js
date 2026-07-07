/* =========================================================
   FORGETIC — CUSTOMER INSIGHT PAGE
   Buyer Persona, Pain Points, Desired Features, AI Profile
   ========================================================= */

const CustomerPage = {
  render(container, data, query) {
    const m = data?.metrics || {};

    container.innerHTML = `
      <div class="page-header animate-up">
        <div class="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Customer Insight
          ${data ? `<span class="live-badge"><span class="live-dot"></span>LIVE</span>` : ''}
        </div>
        <p class="page-desc">Deep dive into buyer psychology, pain points, and what drives purchase decisions.</p>
      </div>

      ${data ? `
      <!-- Market Context Cards -->
      <div class="dashboard-grid animate-up" style="margin-bottom:1.5rem">
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">Avg Market Price</span></div>
          <div class="metric-value">$${typeof m.averagePrice === 'number' ? m.averagePrice.toFixed(2) : '—'}</div>
          <div class="metric-trend neutral">Buyer price anchor</div>
        </div>
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">New Items</span></div>
          <div class="metric-value">${m.newCount ?? 0}</div>
          <div class="metric-trend ${(m.newCount ?? 0) > (m.usedCount ?? 0) ? 'up' : 'neutral'}">vs ${m.usedCount ?? 0} used</div>
        </div>
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">Free Shipping</span></div>
          <div class="metric-value">${m.freeShippingPct ?? 0}%</div>
          <div class="metric-trend neutral">Buyer expectation</div>
        </div>
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">Avg Seller Rating</span></div>
          <div class="metric-value">${m.feedbackScore ?? '—'}%</div>
          <div class="metric-trend up">Trust benchmark</div>
        </div>
      </div>

      <!-- AI Persona (main card) -->
      <div class="card animate-up" style="margin-bottom:1.5rem">
        <div class="card-header">
          <span class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/></svg>
            AI Buyer Persona
          </span>
          <span class="live-badge"><span class="live-dot"></span>AI</span>
        </div>
        <div id="ai-insight-customer">
          <div class="ai-insight-loading">
            <div class="spinner" style="width:18px;height:18px;border-width:2px"></div>
            <span>Building buyer persona...</span>
          </div>
        </div>
      </div>

      <!-- Pain Points & Features -->
      <div class="dashboard-grid-2 animate-up">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Common Buyer Pain Points</span>
            <span class="badge badge-danger">Watch Out</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.75rem;padding-top:0.5rem">
            ${[
              { icon: '🚚', text: 'High or unexpected shipping costs', impact: 'High' },
              { icon: '📦', text: 'Product not matching description', impact: 'High' },
              { icon: '⏱️', text: 'Slow delivery times', impact: 'Medium' },
              { icon: '🔧', text: 'Poor product durability / build quality', impact: 'Medium' },
              { icon: '↩️', text: 'Difficult or no return policy', impact: 'Medium' },
            ].map(p => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:0.65rem;background:var(--bg-surface-2);border-radius:8px">
                <div style="display:flex;align-items:center;gap:0.75rem;font-size:0.875rem">
                  <span style="font-size:1rem">${p.icon}</span>
                  <span>${p.text}</span>
                </div>
                <span class="badge badge-${p.impact === 'High' ? 'danger' : 'warning'}" style="font-size:0.65rem">${p.impact}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">Most Desired Features</span>
            <span class="badge badge-success">Sell These</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.75rem;padding-top:0.5rem">
            ${[
              { icon: '✈️', text: 'Free & fast shipping', impact: 'High' },
              { icon: '⭐', text: 'High seller feedback score (99%+)', impact: 'High' },
              { icon: '🖼️', text: 'Detailed photos (5+ angles)', impact: 'High' },
              { icon: '📋', text: 'Complete item specifics & specs', impact: 'Medium' },
              { icon: '🔄', text: 'Easy returns / money-back guarantee', impact: 'Medium' },
            ].map(f => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:0.65rem;background:var(--bg-surface-2);border-radius:8px">
                <div style="display:flex;align-items:center;gap:0.75rem;font-size:0.875rem">
                  <span style="font-size:1rem">${f.icon}</span>
                  <span>${f.text}</span>
                </div>
                <span class="badge badge-success" style="font-size:0.65rem">${f.impact}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      ` : `
      <div class="empty-state" style="height:40vh">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56" style="opacity:0.25"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        <h3>No data yet</h3>
        <p>Enter an eBay product URL or keyword above and click <strong>"Analyze Live"</strong> to get started.</p>
      </div>
      `}
    `;
  }
};

window.CustomerPage = CustomerPage;
