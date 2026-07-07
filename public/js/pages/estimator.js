/* =========================================================
   FORGETIC — PROFIT ESTIMATOR PAGE
   Calculator, Breakdown, Competitor Pricing, AI Advice
   ========================================================= */

const EstimatorPage = {
  render(container, data, query) {
    const m = data?.metrics || {};
    const avgPrice = m.averagePrice || 0;

    container.innerHTML = `
      <div class="page-header animate-up">
        <div class="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="16" y1="8" x2="16" y2="8"/><line x1="8" y1="8" x2="8" y2="8"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="16" y2="16"/></svg>
          Profit Estimator
          ${data ? `<span class="live-badge"><span class="live-dot"></span>LIVE</span>` : ''}
        </div>
        <p class="page-desc">Calculate margins, account for eBay fees, and optimize your bottom line.</p>
      </div>

      ${data ? `
      <div class="dashboard-grid-2 animate-up" style="margin-bottom:1.5rem">
        <!-- Calculator Form -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Cost & Pricing Configuration</span>
          </div>
          <div style="padding-top:0.5rem">
            <div class="form-group" style="margin-bottom:1.25rem">
              <label style="display:block;margin-bottom:0.5rem;font-size:0.875rem;color:var(--text-muted)">Target Selling Price ($)</label>
              <input type="number" id="calc-sell-price" value="${(m.recommendedPrice || avgPrice).toFixed(2)}" step="0.01" style="width:100%;padding:0.75rem;border-radius:var(--r-md);border:1px solid var(--border);background:var(--bg-surface-active);color:var(--text-main);font-size:1rem">
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.5rem">Market Avg: <strong>$${avgPrice.toFixed(2)}</strong></div>
            </div>
            
            <div class="form-group" style="margin-bottom:1.25rem">
              <label style="display:block;margin-bottom:0.5rem;font-size:0.875rem;color:var(--text-muted)">Item Cost ($)</label>
              <input type="number" id="calc-item-cost" value="${(avgPrice * 0.4).toFixed(2)}" step="0.01" style="width:100%;padding:0.75rem;border-radius:var(--r-md);border:1px solid var(--border);background:var(--bg-surface-active);color:var(--text-main);font-size:1rem">
            </div>
            
            <div class="form-group" style="margin-bottom:1.5rem">
              <label style="display:block;margin-bottom:0.5rem;font-size:0.875rem;color:var(--text-muted)">Shipping Cost to Buyer ($)</label>
              <input type="number" id="calc-shipping" value="0.00" step="0.01" style="width:100%;padding:0.75rem;border-radius:var(--r-md);border:1px solid var(--border);background:var(--bg-surface-active);color:var(--text-main);font-size:1rem">
            </div>
            
            <button class="btn btn-primary" style="width:100%" id="btn-calculate">Calculate Profit</button>
          </div>
        </div>

        <!-- Results & Breakdown -->
        <div class="card" style="background:var(--bg-surface-2);border:1px solid var(--border)">
          <div class="card-header" style="border-bottom:1px solid var(--border);padding-bottom:1rem;margin-bottom:1rem">
            <span class="card-title">Profit Breakdown</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:1.25rem">
            <div style="display:flex;justify-content:space-between">
              <span style="color:var(--text-muted)">Gross Revenue:</span>
              <strong id="res-revenue" style="color:var(--text-main)">$0.00</strong>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="color:var(--text-muted)">eBay Fees (~13.25% + $0.30):</span>
              <strong id="res-fees" style="color:var(--danger)">-$0.00</strong>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="color:var(--text-muted)">Total Costs (Item + Ship):</span>
              <strong id="res-costs" style="color:var(--danger)">-$0.00</strong>
            </div>
            <div style="height:1px;background:var(--border)"></div>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:1.2rem;font-weight:700;color:var(--text-main)">Net Profit:</span>
              <span id="res-profit" style="font-size:1.5rem;font-weight:800;color:var(--success)">$0.00</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-surface-active);padding:1rem;border-radius:8px">
              <span style="color:var(--text-muted)">Profit Margin:</span>
              <span id="res-margin" style="font-size:1.25rem;font-weight:700">0%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Competitor Pricing Curve -->
      <div class="card animate-up" style="margin-bottom:1.5rem">
        <div class="card-header">
          <span class="card-title">Market Competitor Pricing Curve</span>
        </div>
        <div class="chart-wrap" style="height:200px">
          <canvas id="competitorChart"></canvas>
        </div>
      </div>

      <!-- AI Estimator Insights -->
      <div class="card animate-up">
        <div class="card-header">
          <span class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/></svg>
            AI Profit Optimization
          </span>
          <span class="live-badge"><span class="live-dot"></span>AI</span>
        </div>
        <div id="ai-insight-estimator">
          <div class="ai-insight-loading">
            <div class="spinner" style="width:18px;height:18px;border-width:2px"></div>
            <span>Generating profit optimization strategies...</span>
          </div>
        </div>
      </div>

      ` : `
      <div class="empty-state" style="height:40vh">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56" style="opacity:0.25"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="16" y1="8" x2="16" y2="8"/><line x1="8" y1="8" x2="8" y2="8"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="16" y2="16"/></svg>
        <h3>No data yet</h3>
        <p>Enter an eBay product URL or keyword above and click <strong>"Analyze Live"</strong> to get started.</p>
      </div>
      `}
    `;

    if (data) {
      setTimeout(() => {
        this._initCharts(data.rawData);
        this.calculateProfit();
      }, 100);

      // Bind calculate button
      const btnCalc = document.getElementById('btn-calculate');
      if (btnCalc) {
        btnCalc.addEventListener('click', () => this.calculateProfit());
      }
    }
  },

  _initCharts(rawData) {
    const ctx = document.getElementById('competitorChart')?.getContext('2d');
    if (!ctx || !rawData || !rawData.itemSummaries) return;

    const prices = rawData.itemSummaries
      .map(i => parseFloat(i.price?.value))
      .filter(p => !isNaN(p))
      .sort((a, b) => a - b)
      .slice(0, 100); // Up to 100 prices

    ForgeticApp.charts.competitorCurve = new Chart(ctx, {
      type: 'line',
      data: {
        labels: prices.map((_, i) => i + 1),
        datasets: [{
          label: 'Competitor Price',
          data: prices,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 6,
          pointBackgroundColor: '#3b82f6'
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: { 
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
                return 'Price: $' + context.parsed.y.toFixed(2);
              }
            }
          }
        },
        scales: {
          y: { 
            beginAtZero: true, 
            grid: { color: 'rgba(255,255,255,0.05)' },
            title: { display: true, text: 'Price ($)', color: '#64748b' }
          },
          x: { 
            display: true,
            title: { display: true, text: 'Competitor Listings (Sorted Low to High)', color: '#64748b' },
            ticks: { display: false },
            grid: { display: false }
          }
        }
      }
    });
  },

  calculateProfit() {
    const elPrice = document.getElementById('calc-sell-price');
    const elCost  = document.getElementById('calc-item-cost');
    const elShip  = document.getElementById('calc-shipping');
    if (!elPrice || !elCost || !elShip) return;

    const sellPrice = parseFloat(elPrice.value) || 0;
    const itemCost  = parseFloat(elCost.value) || 0;
    const shipCost  = parseFloat(elShip.value) || 0;

    // Standard eBay fee: 13.25% + $0.30 (simplified for general categories)
    const ebayFees = (sellPrice * 0.1325) + 0.30;
    const totalCosts = itemCost + shipCost;
    const netProfit = sellPrice - ebayFees - totalCosts;
    const margin = sellPrice > 0 ? (netProfit / sellPrice) * 100 : 0;

    // Update UI
    document.getElementById('res-revenue').textContent = '$' + sellPrice.toFixed(2);
    document.getElementById('res-fees').textContent = '-$' + ebayFees.toFixed(2);
    document.getElementById('res-costs').textContent = '-$' + totalCosts.toFixed(2);

    const resProfit = document.getElementById('res-profit');
    resProfit.textContent = (netProfit >= 0 ? '$' : '-$') + Math.abs(netProfit).toFixed(2);
    resProfit.style.color = netProfit >= 0 ? 'var(--success)' : 'var(--danger)';

    const resMargin = document.getElementById('res-margin');
    resMargin.textContent = margin.toFixed(1) + '%';
    resMargin.style.color = margin >= 15 ? 'var(--success)' : (margin > 0 ? 'var(--warning)' : 'var(--danger)');
  }
};

window.EstimatorPage = EstimatorPage;
