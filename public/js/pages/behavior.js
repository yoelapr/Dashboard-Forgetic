/* =========================================================
   FORGETIC — BUYER BEHAVIOR PAGE
   Shipping Preferences, Trust Signals, AI Conversion Advice
   ========================================================= */

const BehaviorPage = {
  render(container, data, query) {
    const m = data?.metrics || {};

    container.innerHTML = `
      <div class="page-header animate-up">
        <div class="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          Buyer Behavior
          ${data ? `<span class="live-badge"><span class="live-dot"></span>LIVE</span>` : ''}
        </div>
        <p class="page-desc">Analyze how shipping, format, and trust signals drive conversions.</p>
      </div>

      ${data ? `
      <!-- Charts Row -->
      <div class="dashboard-grid-2 animate-up" style="margin-bottom:1.5rem">
        <!-- Shipping Preferences -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Shipping & Return Preferences</span>
            <span class="badge badge-muted">📊 Estimasi</span>
          </div>
          <div class="chart-wrap" style="height:250px">
            <canvas id="shippingChart"></canvas>
          </div>
        </div>

        <!-- Purchase Triggers -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Primary Purchase Triggers</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:1rem;padding-top:1rem" id="triggers-list">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:0.875rem;background:var(--bg-surface-2);border-radius:8px;border:1px solid var(--border)">
              <div style="display:flex;align-items:center;gap:0.75rem">
                <span style="font-size:1.2rem">📦</span>
                <span>Free Shipping Option</span>
              </div>
              <span class="badge badge-${(m.freeShippingPct ?? 0) > 50 ? 'success' : 'warning'}">
                ${(m.freeShippingPct ?? 0) > 50 ? 'Mandatory' : 'Differentiator'}
              </span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:0.875rem;background:var(--bg-surface-2);border-radius:8px;border:1px solid var(--border)">
              <div style="display:flex;align-items:center;gap:0.75rem">
                <span style="font-size:1.2rem">⚡</span>
                <span>Buy It Now Format</span>
              </div>
              <span class="badge badge-${(m.binPct ?? 0) > 75 ? 'success' : 'warning'}">
                ${(m.binPct ?? 0) > 75 ? 'Mandatory' : 'Optional'}
              </span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:0.875rem;background:var(--bg-surface-2);border-radius:8px;border:1px solid var(--border)">
              <div style="display:flex;align-items:center;gap:0.75rem">
                <span style="font-size:1.2rem">⭐</span>
                <span>Seller Feedback &gt; 98%</span>
              </div>
              <span class="badge badge-success">High Trust Signal</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust Factors AI -->
      <div class="card animate-up">
        <div class="card-header">
          <span class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Conversion Drivers & Trust Factors (AI)
          </span>
          <span class="live-badge"><span class="live-dot"></span>AI</span>
        </div>
        <div id="ai-insight-behavior">
          <div class="ai-insight-loading">
            <div class="spinner" style="width:18px;height:18px;border-width:2px"></div>
            <span>Analyzing behavioral psychology...</span>
          </div>
        </div>
      </div>

      ` : `
      <div class="empty-state" style="height:40vh">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56" style="opacity:0.25"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        <h3>No data yet</h3>
        <p>Enter an eBay product URL or keyword above and click <strong>"Analyze Live"</strong> to get started.</p>
      </div>
      `}
    `;

    if (data) {
      setTimeout(() => this._initCharts(m), 100);
    }
  },

  _initCharts(m) {
    const ctx = document.getElementById('shippingChart')?.getContext('2d');
    if (ctx) {
      // Mocked slightly based on real freeShippingPct
      const freeShip = m.freeShippingPct ?? 40;
      const paidShip = 100 - freeShip;
      const freeRet  = Math.max(10, freeShip - 20); // estimate
      
      ForgeticApp.charts.shipping = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Free Shipping', 'Paid Shipping', 'Free Returns'],
          datasets: [{
            label: '% of Listings Offering',
            data: [freeShip, paidShip, freeRet],
            backgroundColor: ['#10b981', '#f59e0b', '#8b5cf6'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }
};

window.BehaviorPage = BehaviorPage;
