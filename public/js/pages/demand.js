/* =========================================================
   FORGETIC — DEMAND & TRENDS PAGE
   Seasonality, Trend Data, Market Saturation, AI Forecast
   ========================================================= */

const DemandPage = {
  render(container, data, query) {
    const m = data?.metrics || {};

    container.innerHTML = `
      <div class="page-header animate-up">
        <div class="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          Demand &amp; Trends
          ${data ? `<span class="live-badge"><span class="live-dot"></span>LIVE</span>` : ''}
        </div>
        <p class="page-desc">Sales trends, seasonality patterns, and demand forecasting for your product.</p>
      </div>

      ${data ? `
      <!-- Charts Row -->
      <div class="dashboard-grid-2 animate-up" style="margin-bottom:1.5rem">
        <!-- Weekly Sales Trend -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Weekly Sales Trend</span>
            <span class="badge badge-muted">📊 Estimasi</span>
          </div>
          <div class="chart-wrap" style="height:240px">
            <canvas id="weeklyTrendChart"></canvas>
          </div>
        </div>

        <!-- Market Saturation -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Market Saturation</span>
          </div>
          <div class="chart-wrap" style="height:240px;display:flex;justify-content:center">
            <canvas id="saturationChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Seasonality -->
      <div class="card animate-up" style="margin-bottom:1.5rem">
        <div class="card-header">
          <span class="card-title">Monthly Demand Seasonality</span>
          <span class="badge badge-muted">📊 Estimasi</span>
        </div>
        <div class="chart-wrap" style="height:200px">
          <canvas id="seasonalityChart"></canvas>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="dashboard-grid animate-up" style="margin-bottom:1.5rem">
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">Active Listings</span></div>
          <div class="metric-value">${m.totalItemsScanned ?? 0}</div>
          <div class="metric-trend up">Live supply level</div>
        </div>
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">New vs Used</span></div>
          <div class="metric-value" style="font-size:1.2rem">${m.newCount ?? 0} / ${m.usedCount ?? 0}</div>
          <div class="metric-trend neutral">New / Used listings</div>
        </div>
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">Free Shipping</span></div>
          <div class="metric-value">${m.freeShippingPct ?? 0}%</div>
          <div class="metric-trend ${(m.freeShippingPct ?? 0) > 50 ? 'up' : 'neutral'}">Of all listings</div>
        </div>
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">Opportunity Score</span></div>
          <div class="metric-value" style="color:${(m.opportunityScore ?? 0) >= 70 ? 'var(--success)' : (m.opportunityScore ?? 0) >= 45 ? 'var(--warning)' : 'var(--danger)'}">${m.opportunityScore ?? 0}</div>
          <div class="metric-trend neutral">/100 market score</div>
        </div>
      </div>

      <!-- AI Demand Forecast -->
      <div class="card animate-up">
        <div class="card-header">
          <span class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/></svg>
            AI Demand Forecasting
          </span>
          <span class="live-badge"><span class="live-dot"></span>AI</span>
        </div>
        <div id="ai-insight-demand">
          <div class="ai-insight-loading">
            <div class="spinner" style="width:18px;height:18px;border-width:2px"></div>
            <span>Forecasting demand trends...</span>
          </div>
        </div>
      </div>

      ` : `
      <div class="empty-state" style="height:40vh">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56" style="opacity:0.25"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
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
    // Weekly trend chart
    const ctxWeekly = document.getElementById('weeklyTrendChart')?.getContext('2d');
    if (ctxWeekly && (m.trendData || []).length > 0) {
      ForgeticApp.charts.weeklyTrend = new Chart(ctxWeekly, {
        type: 'line',
        data: {
          labels: m.trendData.map(d => d.day),
          datasets: [{
            label: 'Est. Daily Sales',
            data: m.trendData.map(d => d.sales),
            borderColor: '#6c63ff',
            backgroundColor: 'rgba(108,99,255,0.15)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#6c63ff',
            pointRadius: 4
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

    // Market Saturation doughnut
    const ctxSat = document.getElementById('saturationChart')?.getContext('2d');
    if (ctxSat) {
      const score = m.opportunityScore ?? 50;
      let unmet = 30, sat = 40, low = 30;
      if (score > 70)  { unmet = 60; sat = 20; low = 20; }
      else if (score < 40) { unmet = 10; sat = 70; low = 20; }

      ForgeticApp.charts.saturation = new Chart(ctxSat, {
        type: 'doughnut',
        data: {
          labels: ['High Demand (Unmet)', 'Saturated', 'Low Demand'],
          datasets: [{
            data: [unmet, sat, low],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          cutout: '65%',
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // Seasonality chart
    const ctxSeason = document.getElementById('seasonalityChart')?.getContext('2d');
    if (ctxSeason && (m.seasonality || []).length > 0) {
      ForgeticApp.charts.seasonality = new Chart(ctxSeason, {
        type: 'bar',
        data: {
          labels: m.seasonality.map(s => s.month),
          datasets: [{
            label: 'Demand Index',
            data: m.seasonality.map(s => s.demand),
            backgroundColor: m.seasonality.map(s =>
              s.demand > 90 ? '#10b981' : s.demand > 70 ? '#6c63ff' : s.demand > 50 ? '#3b82f6' : '#334155'
            ),
            borderRadius: 4
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

window.DemandPage = DemandPage;
