/* =========================================================
   FORGETIC — MARKET SEGMENTATION PAGE
   Price Tiers, Market Share, Geographic, AI Niches
   ========================================================= */

const SegmentationPage = {
  render(container, data, query) {
    const m = data?.metrics || {};

    container.innerHTML = `
      <div class="page-header animate-up">
        <div class="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
          Market Segmentation
          ${data ? `<span class="live-badge"><span class="live-dot"></span>LIVE</span>` : ''}
        </div>
        <p class="page-desc">Identify price tiers, geographic segments, and profitable niches.</p>
      </div>

      ${data ? `
      <!-- Charts Row -->
      <div class="dashboard-grid-2 animate-up" style="margin-bottom:1.5rem">
        <!-- Price Tier Chart -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Price Tier Segmentation</span>
          </div>
          <div class="chart-wrap" style="height:250px">
            <canvas id="tierBandsChart"></canvas>
          </div>
        </div>

        <!-- Market Share Pie -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Top Seller Market Share</span>
          </div>
          <div class="chart-wrap" style="height:250px;display:flex;justify-content:center">
            <canvas id="segShareChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Geographic Distribution -->
      <div class="card animate-up" style="margin-bottom:1.5rem">
        <div class="card-header">
          <span class="card-title">Geographic Distribution</span>
          <span class="badge badge-muted">📊 Estimasi</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.75rem;padding-top:0.5rem">
          ${(m.geoData || []).map(g => `
            <div style="display:flex;align-items:center;gap:1rem">
              <span style="font-size:1.2rem;min-width:28px">${g.flag}</span>
              <div style="flex:1">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:0.85rem">
                  <span>${g.country}</span>
                  <strong>${g.pct}%</strong>
                </div>
                <div style="background:var(--bg-surface-2);border-radius:4px;height:5px;overflow:hidden">
                  <div style="background:var(--primary);width:${g.pct}%;height:100%;border-radius:4px;transition:width .6s"></div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Conditions Breakdown -->
      <div class="card animate-up" style="margin-bottom:1.5rem">
        <div class="card-header">
          <span class="card-title">Condition Segments</span>
        </div>
        <div style="display:flex;gap:1rem;flex-wrap:wrap">
          ${Object.entries(m.conditions || {}).map(([cond, count]) => `
            <div style="flex:1;min-width:100px;background:var(--bg-surface-2);border-radius:var(--r-md);padding:1rem;text-align:center;border:1px solid var(--border)">
              <div style="font-size:1.4rem;font-weight:700;color:var(--text-main)">${count}</div>
              <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.25rem">${cond}</div>
              <div style="font-size:0.72rem;color:var(--primary);margin-top:0.25rem">${Math.round(count / (m.totalItemsScanned || 1) * 100)}%</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- AI Niche Identification -->
      <div class="card animate-up">
        <div class="card-header">
          <span class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/></svg>
            AI Niche Identification
          </span>
          <span class="live-badge"><span class="live-dot"></span>AI</span>
        </div>
        <div id="ai-insight-segmentation">
          <div class="ai-insight-loading">
            <div class="spinner" style="width:18px;height:18px;border-width:2px"></div>
            <span>Identifying market niches...</span>
          </div>
        </div>
      </div>

      ` : `
      <div class="empty-state" style="height:40vh">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56" style="opacity:0.25"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
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
    // Price Tier (bands) bar chart
    const ctxTier = document.getElementById('tierBandsChart')?.getContext('2d');
    if (ctxTier && m.priceBands) {
      ForgeticApp.charts.tierBands = new Chart(ctxTier, {
        type: 'bar',
        data: {
          labels: Object.keys(m.priceBands),
          datasets: [{
            label: 'Listings',
            data: Object.values(m.priceBands),
            backgroundColor: ['#10b981', '#3b82f6', '#6c63ff', '#f59e0b', '#ef4444'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // Seller market share pie
    const ctxShare = document.getElementById('segShareChart')?.getContext('2d');
    if (ctxShare && (m.marketShare || []).length > 0) {
      ForgeticApp.charts.segShare = new Chart(ctxShare, {
        type: 'pie',
        data: {
          labels: m.marketShare.map(s => s.seller),
          datasets: [{
            data: m.marketShare.map(s => s.pct),
            backgroundColor: ['#6c63ff', '#3b82f6', '#10b981', '#f59e0b', '#334155'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'right' } }
        }
      });
    }
  }
};

window.SegmentationPage = SegmentationPage;
