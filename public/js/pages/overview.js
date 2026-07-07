/* =========================================================
   FORGETIC — OVERVIEW PAGE
   Market Summary, KPIs, Insights, Strategies
   ========================================================= */

const OverviewPage = {
  render(container, data, query) {
    // Guard: safely access metrics
    const m = data?.metrics || {};

    container.innerHTML = `
      <div class="page-header animate-up">
        <div class="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Overview
          ${data ? `<span class="live-badge"><span class="live-dot"></span>LIVE</span>` : ''}
        </div>
        <p class="page-desc">${data ? `Showing real-time analysis for: <strong style="color:var(--primary)">"${query}"</strong>` : 'Enter a keyword or eBay URL above to get live market insights.'}</p>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar animate-up">
        <div class="filter-group">
          <label>Condition</label>
          <select id="filter-condition">
            <option value="all">All Conditions</option>
            <option value="new">New Only</option>
            <option value="used">Used Only</option>
          </select>
        </div>
        <div class="filter-divider"></div>
        <div class="filter-group">
          <label>Market</label>
          <select id="filter-market">
            <option value="EBAY_US">🇺🇸 United States</option>
            <option value="EBAY_GB">🇬🇧 United Kingdom</option>
            <option value="EBAY_AU">🇦🇺 Australia</option>
          </select>
        </div>
        <div class="filter-divider"></div>
        <div class="filter-group" style="flex:1;flex-wrap:wrap">
          <label>Quick Suggestions</label>
          <div class="chip-group" id="quick-chips">
            ${['Skipping Rope','Push Up Bar','Dumbbell 5kg','Resistance Band','Yoga Mat','Jump Rope','Pull Up Bar','Kettlebell'].map(s =>
              `<span class="chip" data-q="${s}">${s}</span>`
            ).join('')}
          </div>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="dashboard-grid animate-up" id="kpi-grid">
        ${data ? this._renderKPIs(m) : this._renderEmptyKPIs()}
      </div>

      ${data ? `
      <!-- Price Rec + Entry Barrier -->
      <div class="dashboard-grid-2 animate-up" style="margin-bottom:1.5rem">
        <div class="price-rec-card">
          <div class="price-rec-label">✦ AI Recommended Price</div>
          <div class="price-rec-value">$${m.recommendedPrice ?? '—'}</div>
          <div class="price-rec-sub">Based on market average &amp; competition analysis</div>
        </div>
        <div class="card" style="display:flex;flex-direction:column;gap:1rem">
          <div class="card-header" style="margin-bottom:0">
            <span class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Entry Barrier
            </span>
            <span class="badge badge-${m.entryBarrier === 'Low' ? 'success' : m.entryBarrier === 'Medium' ? 'warning' : 'danger'}">
              ${m.entryBarrier ?? '—'}
            </span>
          </div>
          <p style="font-size:0.82rem;color:var(--text-muted)">
            ${m.entryBarrier === 'Low'
              ? '✅ Easy to enter. Low seller concentration and moderate competition make this a good opportunity.'
              : m.entryBarrier === 'Medium'
              ? '⚠️ Moderate competition. Build a unique value proposition to stand out from existing sellers.'
              : '🔴 High barrier. Top 3 sellers dominate 60%+ of listings. Differentiation is critical.'}
          </p>
          <div style="display:flex;gap:1.5rem;margin-top:auto">
            <div>
              <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em">Top 3 Share</div>
              <div style="font-size:1.1rem;font-weight:700;color:var(--text-main)">${m.top3SharePct ?? 0}%</div>
            </div>
            <div>
              <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em">Total Sellers</div>
              <div style="font-size:1.1rem;font-weight:700;color:var(--text-main)">${m.totalSellers ?? 0}</div>
            </div>
            <div>
              <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em">Items Scanned</div>
              <div style="font-size:1.1rem;font-weight:700;color:var(--text-main)">${m.totalItemsScanned ?? 0}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Color-coded Insights -->
      <div class="card animate-up" style="margin-bottom:1.5rem">
        <div class="card-header">
          <span class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Color-coded Market Insights
          </span>
        </div>
        <div class="grid grid-2 gap-grid" style="gap:0.75rem">
          <div class="insight-block insight-price">
            <div class="insight-label">💰 Price Insight</div>
            <div class="insight-text">Average market price is <strong>$${m.averagePrice ?? 0}</strong>. Range: $${m.minPrice ?? 0} – $${m.maxPrice ?? 0}. Median sits at $${m.medianPrice ?? 0}.</div>
          </div>
          <div class="insight-block insight-velocity">
            <div class="insight-label">⚡ Sales Velocity</div>
            <div class="insight-text">${m.totalItemsScanned ?? 0} active listings with ${m.totalSellers ?? 0} unique sellers. ${m.freeShippingPct ?? 0}% offer free shipping.</div>
          </div>
          <div class="insight-block insight-competition">
            <div class="insight-label">⚔️ Competition</div>
            <div class="insight-text">${m.isConcentrated ? 'Market is concentrated — top 3 sellers hold ' + (m.top3SharePct ?? 0) + '% of listings.' : 'Market is fragmented — opportunities exist for new entrants.'}</div>
          </div>
          <div class="insight-block insight-opportunity">
            <div class="insight-label">✦ Opportunity</div>
            <div class="insight-text">Score: <strong>${m.opportunityScore ?? 0}/100</strong>. ${(m.opportunityScore ?? 0) >= 70 ? 'Excellent market gap. Highly recommended to enter.' : (m.opportunityScore ?? 0) >= 45 ? 'Moderate opportunity. Research differentiation first.' : 'High competition. Consider adjacent niches.'}</div>
          </div>
          <div class="insight-block insight-timing">
            <div class="insight-label">📅 Market Timing</div>
            <div class="insight-text">Peak demand expected in Q4 (Nov–Dec). ${(m.newCount ?? 0) > (m.usedCount ?? 0) ? 'New products dominate' : 'Used/refurbished items are popular'}. Plan inventory 6–8 weeks ahead.</div>
          </div>
          <div class="insight-block insight-warning" style="display:${m.entryBarrier === 'High' ? '' : 'none'}">
            <div class="insight-label">⚠️ Risk Warning</div>
            <div class="insight-text">High seller concentration detected. Entering without differentiation may result in low visibility. Consider bundles or unique variants.</div>
          </div>
        </div>
      </div>

      <!-- AI Market Summary (async loaded) -->
      <div class="card animate-up" style="margin-bottom:1.5rem" id="ai-market-summary">
        <div class="card-header">
          <span class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/></svg>
            AI Market Summary
          </span>
          <span class="live-badge"><span class="live-dot"></span>AI</span>
        </div>
        <!-- AI insight injected here by generatePageInsights('overview') -->
        <div id="ai-insight-overview">
          <div class="ai-insight-loading">
            <div class="spinner" style="width:18px;height:18px;border-width:2px"></div>
            <span>Generating AI insights...</span>
          </div>
        </div>
      </div>

      <!-- 3 Strategies -->
      <div class="animate-up" style="margin-bottom:1.5rem">
        <div class="section-header">
          <div>
            <div class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              3 Actionable Strategies
            </div>
            <div class="section-subtitle">Based on live market data for: "${query}"</div>
          </div>
        </div>
        <div class="grid grid-3 gap-grid" style="gap:1rem">
          ${this._renderStrategies(m, query)}
        </div>
      </div>

      <!-- Similar Products Trending -->
      <div class="card animate-up">
        <div class="card-header">
          <span class="card-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            Similar Products Trending
          </span>
          <span class="badge badge-muted">${(m.topItems || []).length} items</span>
        </div>
        <div id="top-products-list">
          ${(m.topItems || []).map((item, i) => `
            <div class="product-row">
              <span style="font-size:0.8rem;font-weight:700;color:var(--text-faint);min-width:20px">#${i+1}</span>
              ${item.image ? `<img src="${item.image}" class="product-thumb" loading="lazy" onerror="this.style.display='none'">` : `<div class="product-thumb"></div>`}
              <div class="product-info">
                <div class="product-title" title="${item.title}">${item.title}</div>
                <div class="product-meta">${item.condition || 'Unknown'} · Seller: ${item.seller || 'N/A'}</div>
              </div>
              <div class="product-price">$${parseFloat(item.price || 0).toFixed(2)}</div>
              <a href="${item.url}" target="_blank" class="btn btn-sm btn-ghost" style="flex-shrink:0">View</a>
            </div>
          `).join('')}
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

    // Quick chips
    container.querySelectorAll('.chip[data-q]').forEach(chip => {
      chip.addEventListener('click', () => {
        if (window.analyzeKeyword) window.analyzeKeyword(chip.dataset.q);
      });
    });
  },

  _renderKPIs(m) {
    const score = m.opportunityScore ?? 0;
    const avg   = typeof m.averagePrice === 'number' ? m.averagePrice.toFixed(2) : '0.00';
    const scoreColor = score >= 70 ? 'var(--success)' : score >= 45 ? 'var(--warning)' : 'var(--danger)';
    return `
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">Opportunity Score</span>
          <div class="metric-icon-wrap" style="background:rgba(108,99,255,0.15)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
          </div>
        </div>
        <div class="metric-value" style="background:none;-webkit-text-fill-color:${scoreColor};color:${scoreColor}">${score}<span style="font-size:1rem;font-weight:500;color:var(--text-muted)">/100</span></div>
        <div class="metric-trend ${score >= 70 ? 'up' : score >= 45 ? 'neutral' : 'down'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><${score >= 70 ? 'polyline points="23 6 13.5 15.5 8.5 10.5 1 18"' : score >= 45 ? 'line x1="5" y1="12" x2="19" y2="12"' : 'polyline points="23 18 13.5 8.5 8.5 13.5 1 6"'}/></svg>
          ${score >= 70 ? 'Excellent Opportunity' : score >= 45 ? 'Moderate Opportunity' : 'Low Opportunity'}
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">Avg Sold Price</span>
          <div class="metric-icon-wrap" style="background:rgba(16,185,129,0.15)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
        </div>
        <div class="metric-value">$${avg}</div>
        <div class="metric-trend neutral">Range: $${m.minPrice ?? 0} – $${m.maxPrice ?? 0}</div>
      </div>
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">Total Sellers</span>
          <div class="metric-icon-wrap" style="background:rgba(59,130,246,0.15)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--info)" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
        </div>
        <div class="metric-value">${m.totalSellers ?? 0}</div>
        <div class="metric-trend neutral">Unique active sellers</div>
      </div>
      <div class="metric-card">
        <div class="metric-header">
          <span class="metric-label">Items Scanned</span>
          <div class="metric-icon-wrap" style="background:rgba(245,158,11,0.15)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
        <div class="metric-value">${m.totalItemsScanned ?? 0}</div>
        <div class="metric-trend up">
          <span class="live-badge" style="font-size:0.6rem"><span class="live-dot"></span>LIVE</span>
        </div>
      </div>
    `;
  },

  _renderEmptyKPIs() {
    return ['Opportunity Score', 'Avg Sold Price', 'Total Sellers', 'Items Scanned'].map(label => `
      <div class="metric-card">
        <div class="metric-header"><span class="metric-label">${label}</span></div>
        <div class="skeleton" style="height:2rem;width:70%;margin:0.5rem 0"></div>
        <div class="skeleton" style="height:0.75rem;width:50%"></div>
      </div>
    `).join('');
  },

  _renderStrategies(m, query) {
    const rec = m.recommendedPrice ?? m.averagePrice ?? 0;
    const avg = m.averagePrice ?? 0;
    const freePct = m.freeShippingPct ?? 0;
    const top3 = m.top3SharePct ?? 0;
    const sellers = m.totalSellers ?? 0;

    const strategies = [
      {
        title: 'Optimize Listing Price',
        desc: `List at $${rec} — ${avg > rec ? '5% below market average' : 'aligned with market'} to attract buyers while maintaining margin. Use '${query}' keywords in the first 80 characters of your title.`
      },
      {
        title: freePct > 50 ? 'Offer Free Shipping' : 'Strategic Shipping Pricing',
        desc: freePct > 50
          ? `${freePct}% of sellers offer free shipping. Match this to stay competitive. Build shipping cost into your listing price.`
          : `Only ${freePct}% offer free shipping. You can differentiate by offering free shipping on orders above a minimum value.`
      },
      {
        title: m.isConcentrated ? 'Bundle & Differentiate' : 'Volume & Variety Strategy',
        desc: m.isConcentrated
          ? `Market is concentrated (top 3 sellers = ${top3}%). Create product bundles or offer unique variants (colors, sizes, kits) to avoid direct price competition.`
          : `Fragmented market with ${sellers} sellers. Stock multiple variants and use promoted listings to capture more searches across price ranges.`
      }
    ];
    return strategies.map((s, i) => `
      <div class="strategy-card">
        <div class="strategy-num">${i + 1}</div>
        <div class="strategy-content">
          <div class="strategy-title">${s.title}</div>
          <div class="strategy-desc">${s.desc}</div>
        </div>
      </div>
    `).join('');
  }
};

window.OverviewPage = OverviewPage;
