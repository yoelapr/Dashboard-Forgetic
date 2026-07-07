/* =========================================================
   FORGETIC — PRODUCT RESEARCH PAGE
   Variant Performance, Comparison, Bundle, Market Share, Keywords
   ========================================================= */

const ResearchPage = {
  render(container, data, query) {
    const m = data?.metrics || {};

    container.innerHTML = `
      <div class="page-header animate-up">
        <div class="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Product Research
          ${data ? `<span class="live-badge"><span class="live-dot"></span>LIVE</span>` : ''}
        </div>
        <p class="page-desc">Analyze variants, compare products side-by-side, and find keyword opportunities.</p>
      </div>

      ${data ? `
      <!-- AI Research Insight -->
      <div class="card animate-up" style="margin-bottom:1.5rem">
        <div class="card-header">
          <span class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/></svg>
            AI Research Insights
          </span>
          <span class="live-badge"><span class="live-dot"></span>AI</span>
        </div>
        <div id="ai-insight-research">
          <div class="ai-insight-loading">
            <div class="spinner" style="width:18px;height:18px;border-width:2px"></div>
            <span>Analyzing research opportunities...</span>
          </div>
        </div>
      </div>

      <!-- Row 1: Variants & Market Share -->
      <div class="dashboard-grid-2 animate-up">
        <!-- Variant Performance -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Product Variant Performance</span>
          </div>
          <div class="chart-wrap" style="height:250px">
            <canvas id="variantChart"></canvas>
          </div>
        </div>

        <!-- Market Share -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Market Share (Top Sellers)</span>
          </div>
          <div class="chart-wrap" style="height:250px; display:flex; justify-content:center">
            <canvas id="marketShareChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Row 2: Product Comparison (Side by Side) -->
      <div class="card animate-up" style="margin-bottom:1.5rem">
        <div class="card-header">
          <span class="card-title">Top Product Comparison</span>
        </div>
        <div class="compare-grid">
          ${this._renderComparison(m.topItems)}
        </div>
      </div>

      <!-- Row 3: Keyword & Bundle -->
      <div class="dashboard-grid-2 animate-up">
        <!-- Keyword Recommendation -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Keyword Recommendation</span>
            <span class="badge badge-primary">Impact on Price</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Frequency</th>
                <th>Price Lift Est.</th>
              </tr>
            </thead>
            <tbody>
              ${(m.topKeywords || []).slice(0, 8).map(k => `
                <tr>
                  <td style="font-weight:600;color:var(--text-main)">${k.word}</td>
                  <td>${k.count} listings</td>
                  <td class="${k.priceLift > 0 ? 'text-success' : 'text-danger'}">${k.priceLift > 0 ? '+' : ''}$${k.priceLift}
                    <span class="badge badge-muted" style="font-size:0.6rem;margin-left:4px">est.</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Bundle Opportunity -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Bundle Opportunities</span>
            <span class="badge badge-success">AI Suggested</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:1rem">
            <div class="insight-block insight-opportunity" style="margin:0">
              <div class="insight-label">Why Bundle?</div>
              <div class="insight-text">Bundling increases Average Order Value (AOV) and helps you stand out from sellers offering single items. Top 3 sellers control ${m.top3SharePct ?? 0}% — bundling is your differentiation edge.</div>
            </div>
            <div style="background:var(--bg-surface-2);border-radius:var(--r-md);padding:1rem;border:1px solid var(--border)">
              <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:.05em">Frequently Bought Together</div>
              <div style="display:flex;align-items:center;gap:0.5rem;font-weight:600">
                <span style="color:var(--primary)">${query || 'Main Product'}</span>
                <span style="color:var(--text-muted)">+</span>
                <span>Accessories / Add-ons</span>
              </div>
              <ul style="margin-top:0.75rem;padding-left:1.5rem;color:var(--text-secondary);font-size:0.875rem;display:flex;flex-direction:column;gap:0.25rem">
                <li>Travel/Carry Bag</li>
                <li>Extra Replacement Parts</li>
                <li>Care/Maintenance Kit</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      ` : `
      <div class="empty-state" style="height:40vh">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56" style="opacity:0.25"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <h3>No data yet</h3>
        <p>Enter an eBay product URL or keyword above and click <strong>"Analyze Live"</strong> to get started.</p>
      </div>
      `}
    `;

    if (data) {
      setTimeout(() => this._initCharts(m), 100);
    }
  },

  _renderComparison(items) {
    if (!items || items.length === 0) return '<div class="text-muted" style="grid-column:span 3;text-align:center">Not enough data to compare.</div>';
    const compareItems = items.slice(0, 3);
    return compareItems.map((item, index) => `
      <div class="compare-card ${index === 0 ? 'winner' : ''}">
        ${index === 0 ? '<div style="text-align:center;margin-bottom:-10px"><span class="badge badge-success" style="position:relative;top:-15px">Best Seller</span></div>' : ''}
        <img src="${item.image || ''}" class="compare-thumb" onerror="this.style.display='none'">
        <div class="compare-title" title="${item.title}">${item.title.length > 50 ? item.title.slice(0, 50) + '...' : item.title}</div>
        <div style="margin-top:1.5rem">
          <div class="compare-metric">
            <span class="compare-metric-label">Price</span>
            <span class="compare-metric-value text-success">$${parseFloat(item.price || 0).toFixed(2)}</span>
          </div>
          <div class="compare-metric">
            <span class="compare-metric-label">Condition</span>
            <span class="compare-metric-value">${item.condition || 'Unknown'}</span>
          </div>
          <div class="compare-metric">
            <span class="compare-metric-label">Seller</span>
            <span class="compare-metric-value" style="font-size:0.75rem">${item.seller || 'N/A'}</span>
          </div>
          <div class="compare-metric">
            <span class="compare-metric-label">Feedback</span>
            <span class="compare-metric-value">${item.feedback ? item.feedback + '%' : 'N/A'}</span>
          </div>
        </div>
        <a href="${item.url}" target="_blank" class="btn btn-secondary btn-block mt-4" style="font-size:0.8rem">View Listing</a>
      </div>
    `).join('');
  },

  _initCharts(m) {
    // Variant Chart
    const ctxVar = document.getElementById('variantChart')?.getContext('2d');
    if (ctxVar && (m.variants || []).length > 0) {
      ForgeticApp.charts.variant = new Chart(ctxVar, {
        type: 'bar',
        data: {
          labels: m.variants.slice(0, 5).map(v => v.name),
          datasets: [{
            label: 'Listings Count',
            data: m.variants.slice(0, 5).map(v => v.count),
            backgroundColor: 'rgba(108, 99, 255, 0.7)',
            borderRadius: 4,
            yAxisID: 'y'
          }, {
            label: 'Avg Price ($)',
            data: m.variants.slice(0, 5).map(v => parseFloat(v.avgPrice)),
            type: 'line',
            borderColor: '#10b981',
            backgroundColor: '#10b981',
            borderWidth: 2,
            tension: 0.3,
            yAxisID: 'y1'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y:  { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
            y1: { position: 'right', grid: { display: false } },
            x:  { grid: { display: false } }
          }
        }
      });
    }

    // Market Share Chart
    const ctxShare = document.getElementById('marketShareChart')?.getContext('2d');
    if (ctxShare && (m.marketShare || []).length > 0) {
      ForgeticApp.charts.share = new Chart(ctxShare, {
        type: 'doughnut',
        data: {
          labels: m.marketShare.map(s => s.seller),
          datasets: [{
            data: m.marketShare.map(s => s.pct),
            backgroundColor: ['#6c63ff', '#3b82f6', '#10b981', '#f59e0b', '#334155'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: { legend: { position: 'right' } }
        }
      });
    }
  }
};

window.ResearchPage = ResearchPage;
