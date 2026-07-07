/* =========================================================
   FORGETIC — COMPETITIVE INTELLIGENCE PAGE
   Top Sellers, Market Share, Defensibility, AI Strategy
   ========================================================= */

const CompetitivePage = {
  render(container, data, query) {
    const m = data?.metrics || {};

    container.innerHTML = `
      <div class="page-header animate-up">
        <div class="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Competitive Intel
          ${data ? `<span class="live-badge"><span class="live-dot"></span>LIVE</span>` : ''}
        </div>
        <p class="page-desc">Understand who dominates this market and how to outmaneuver them.</p>
      </div>

      ${data ? `
      <!-- KPI Row -->
      <div class="dashboard-grid animate-up" style="margin-bottom:1.5rem">
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">Total Competitors</span></div>
          <div class="metric-value">${m.totalSellers ?? 0}</div>
          <div class="metric-trend neutral">Active sellers</div>
        </div>
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">Top 3 Dominance</span></div>
          <div class="metric-value" style="color:${(m.top3SharePct ?? 0) > 60 ? 'var(--danger)' : 'var(--success)'}">${m.top3SharePct ?? 0}%</div>
          <div class="metric-trend ${(m.top3SharePct ?? 0) > 60 ? 'down' : 'up'}">Of all listings</div>
        </div>
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">Entry Barrier</span></div>
          <div class="metric-value" style="font-size:1.4rem;color:${m.entryBarrier === 'Low' ? 'var(--success)' : m.entryBarrier === 'Medium' ? 'var(--warning)' : 'var(--danger)'}">${m.entryBarrier ?? '—'}</div>
          <div class="metric-trend neutral">Market difficulty</div>
        </div>
        <div class="metric-card">
          <div class="metric-header"><span class="metric-label">Avg Seller Feedback</span></div>
          <div class="metric-value">${m.feedbackScore ?? '—'}%</div>
          <div class="metric-trend ${(m.feedbackScore ?? 0) > 97 ? 'up' : 'neutral'}">Avg rating score</div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="dashboard-grid-2 animate-up" style="margin-bottom:1.5rem">
        <!-- Market Share Chart -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Seller Market Share</span>
          </div>
          <div class="chart-wrap" style="height:250px;display:flex;justify-content:center">
            <canvas id="competitorShareChart"></canvas>
          </div>
        </div>

        <!-- Top Sellers Table -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Top Sellers</span>
            <span class="badge badge-primary">${(m.sellerList || []).length} tracked</span>
          </div>
          <div style="overflow-x:auto">
            <table class="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Seller</th>
                  <th>Listings</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                ${(m.sellerList || []).slice(0, 8).map((s, i) => `
                  <tr>
                    <td style="color:var(--text-faint)">${i + 1}</td>
                    <td style="font-weight:600;color:var(--primary)">${s.name}</td>
                    <td>${s.count}</td>
                    <td>
                      <div style="display:flex;align-items:center;gap:0.5rem">
                        <div style="background:var(--bg-surface-2);border-radius:4px;height:4px;width:60px;overflow:hidden">
                          <div style="background:var(--primary);width:${Math.round(s.count / (m.totalItemsScanned || 1) * 100)}%;height:100%"></div>
                        </div>
                        <span style="font-size:0.8rem">${Math.round(s.count / (m.totalItemsScanned || 1) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Concentration Warning -->
      ${(m.isConcentrated) ? `
      <div class="insight-block insight-warning animate-up" style="margin-bottom:1.5rem">
        <div class="insight-label">⚠️ High Concentration Alert</div>
        <div class="insight-text">Top 3 sellers control ${m.top3SharePct ?? 0}% of all listings. This is a concentrated market. New sellers must offer bundles, unique value, or niche targeting to break through.</div>
      </div>` : `
      <div class="insight-block insight-opportunity animate-up" style="margin-bottom:1.5rem">
        <div class="insight-label">✅ Fragmented Market</div>
        <div class="insight-text">Market is fragmented with ${m.totalSellers ?? 0} sellers. No single seller dominates — this is a great entry opportunity with the right listing strategy.</div>
      </div>`}

      <!-- AI Competitive Strategy -->
      <div class="card animate-up">
        <div class="card-header">
          <span class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/></svg>
            AI Competitive Strategy
          </span>
          <span class="live-badge"><span class="live-dot"></span>AI</span>
        </div>
        <div id="ai-insight-competitive">
          <div class="ai-insight-loading">
            <div class="spinner" style="width:18px;height:18px;border-width:2px"></div>
            <span>Analyzing competitive landscape...</span>
          </div>
        </div>
      </div>

      ` : `
      <div class="empty-state" style="height:40vh">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56" style="opacity:0.25"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
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
    const ctxShare = document.getElementById('competitorShareChart')?.getContext('2d');
    if (ctxShare && (m.marketShare || []).length > 0) {
      ForgeticApp.charts.compShare = new Chart(ctxShare, {
        type: 'doughnut',
        data: {
          labels: m.marketShare.map(s => s.seller),
          datasets: [{
            data: m.marketShare.map(s => s.pct),
            backgroundColor: ['#6c63ff', '#3b82f6', '#10b981', '#f59e0b', '#334155'],
            borderWidth: 0,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          cutout: '65%',
          plugins: { legend: { position: 'right' } }
        }
      });
    }
  }
};

window.CompetitivePage = CompetitivePage;
