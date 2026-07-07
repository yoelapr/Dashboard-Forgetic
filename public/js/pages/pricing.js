/* =========================================================
   FORGETIC — PRICING INTELLIGENCE PAGE
   Price Elasticity, Distribution, Velocity, AI Strategy
   ========================================================= */

const PricingPage = {
  render(container, data, query) {
    const m = data?.metrics || {};

    container.innerHTML = `
      <div class="page-header animate-up">
        <div class="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Pricing Intelligence
          ${data ? `<span class="live-badge"><span class="live-dot"></span>LIVE</span>` : ''}
        </div>
        <p class="page-desc">Optimal price points, elasticity analysis, and AI-driven pricing strategy.</p>
      </div>

      ${data ? `
      <!-- KPI Row -->
      <div class="dashboard-grid animate-up" style="margin-bottom:1.5rem">
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">Recommended Price</span></div>
          <div class="metric-value" style="color:var(--success)">$${m.recommendedPrice ?? '—'}</div>
          <div class="metric-trend up">Optimal entry price</div>
        </div>
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">Market Average</span></div>
          <div class="metric-value">$${typeof m.averagePrice === 'number' ? m.averagePrice.toFixed(2) : '—'}</div>
          <div class="metric-trend neutral">From ${m.totalItemsScanned ?? 0} listings</div>
        </div>
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">Median Price</span></div>
          <div class="metric-value">$${m.medianPrice ?? '—'}</div>
          <div class="metric-trend neutral">50th percentile</div>
        </div>
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">Price Range</span></div>
          <div class="metric-value" style="font-size:1.2rem">$${m.minPrice ?? 0} – $${m.maxPrice ?? 0}</div>
          <div class="metric-trend neutral">Min to Max</div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="dashboard-grid-2 animate-up" style="margin-bottom:1.5rem">
        <!-- Price Distribution -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Price Band Distribution</span>
            <span class="badge badge-muted">${m.totalItemsScanned ?? 0} listings</span>
          </div>
          <div class="chart-wrap" style="height:240px">
            <canvas id="priceBandsChart"></canvas>
          </div>
        </div>

        <!-- Price Elasticity -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Price Elasticity Curve</span>
            <span class="badge badge-muted">📊 Estimasi</span>
          </div>
          <div class="chart-wrap" style="height:240px">
            <canvas id="elasticityChart"></canvas>
          </div>
        </div>
      </div>

      <!-- BIN vs Auction + Shipping -->
      <div class="dashboard-grid-2 animate-up" style="margin-bottom:1.5rem">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Listing Format</span>
          </div>
          <div style="display:flex;gap:2rem;align-items:center;padding:1rem 0">
            <div style="text-align:center;flex:1">
              <div style="font-size:2rem;font-weight:800;color:var(--primary)">${m.binPct ?? 85}%</div>
              <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.25rem">Buy It Now</div>
            </div>
            <div style="width:1px;height:60px;background:var(--border)"></div>
            <div style="text-align:center;flex:1">
              <div style="font-size:2rem;font-weight:800;color:var(--warning)">${m.auctionPct ?? 15}%</div>
              <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.25rem">Auction</div>
            </div>
          </div>
          <div class="insight-block insight-opportunity" style="margin:0.5rem 0 0">
            <div class="insight-text">${(m.binPct ?? 85) > 70 ? '✅ BIN dominates — list with fixed price for maximum visibility.' : '⚠️ Auctions are popular — consider starting bids 10–15% below market to drive bidding wars.'}</div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Shipping Strategy</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:1rem;padding-top:0.5rem">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="color:var(--text-muted);font-size:0.875rem">Free Shipping Rate</span>
              <strong style="color:var(--success)">${m.freeShippingPct ?? 0}%</strong>
            </div>
            <div style="background:var(--bg-surface-2);border-radius:4px;height:6px;overflow:hidden">
              <div style="background:var(--success);width:${m.freeShippingPct ?? 0}%;height:100%;border-radius:4px;transition:width .5s"></div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="color:var(--text-muted);font-size:0.875rem">Free Ship Avg Price</span>
              <strong>$${m.freeShipAvg ?? '—'}</strong>
            </div>
            <div class="insight-block insight-velocity" style="margin:0">
              <div class="insight-text">${(m.freeShippingPct ?? 0) > 50 ? 'Majority offer free shipping — you must match to compete.' : 'Opportunity: offer free shipping to stand out from the ' + (100 - (m.freeShippingPct ?? 0)) + '% who don\'t.'}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Pricing Insights -->
      <div class="card animate-up">
        <div class="card-header">
          <span class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/></svg>
            AI Pricing Strategy
          </span>
          <span class="live-badge"><span class="live-dot"></span>AI</span>
        </div>
        <div id="ai-insight-pricing">
          <div class="ai-insight-loading">
            <div class="spinner" style="width:18px;height:18px;border-width:2px"></div>
            <span>Generating optimal pricing strategy...</span>
          </div>
        </div>
      </div>

      ` : `
      <div class="empty-state" style="height:40vh">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56" style="opacity:0.25"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
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
    // Price Bands Chart
    const ctxBands = document.getElementById('priceBandsChart')?.getContext('2d');
    if (ctxBands && m.priceBands) {
      ForgeticApp.charts.priceBands = new Chart(ctxBands, {
        type: 'bar',
        data: {
          labels: Object.keys(m.priceBands),
          datasets: [{
            label: 'Listings',
            data: Object.values(m.priceBands),
            backgroundColor: ['#6c63ff','#3b82f6','#10b981','#f59e0b','#ef4444'],
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // Price Elasticity Chart
    const ctxElastic = document.getElementById('elasticityChart')?.getContext('2d');
    if (ctxElastic && (m.elasticity || []).length > 0) {
      ForgeticApp.charts.elasticity = new Chart(ctxElastic, {
        type: 'line',
        data: {
          labels: m.elasticity.map(e => '$' + e.price),
          datasets: [{
            label: 'Est. Sales Volume',
            data: m.elasticity.map(e => e.volume),
            borderColor: '#6c63ff',
            backgroundColor: 'rgba(108,99,255,0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#6c63ff',
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, title: { display: true, text: 'Est. Volume', color: '#64748b' } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }
};

window.PricingPage = PricingPage;
