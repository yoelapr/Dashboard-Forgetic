/* =========================================================
   FORGETIC — RECENT SEARCHES PAGE
   ========================================================= */

const RecentPage = {
    render(container) {
        container.innerHTML = `
            <div class="page-header animate-up">
                <div class="page-title">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Recent Searches
                </div>
                <p class="page-desc">View your previous market intelligence queries.</p>
            </div>
            
            <div class="dashboard-grid animate-up">
                <div class="card" style="grid-column: 1 / -1">
                    <div class="card-header">
                        <span class="card-title">Search History</span>
                        <button class="btn btn-sm btn-secondary" id="btn-clear-history">Clear History</button>
                    </div>
                    <div style="overflow-x: auto; padding-top: 1rem;">
                        <table class="data-table" style="width: 100%">
                            <thead>
                                <tr>
                                    <th>Keyword / URL</th>
                                    <th>Date & Time</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="history-list">
                                <!-- Populated dynamically -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        this.loadHistory();
        
        const btnClear = document.getElementById('btn-clear-history');
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                ForgeticApp.recentSearches = [];
                localStorage.removeItem('forgetic_recent');
                ForgeticApp.updateRecentBadge();
                this.loadHistory();
            });
        }
    },

    loadHistory() {
        const tbody = document.getElementById('history-list');
        if (!tbody) return;
        
        const history = window.ForgeticApp?.recentSearches || [];
        
        if (history.length > 0) {
            tbody.innerHTML = history.map(item => `
                <tr>
                    <td style="font-weight: 600; color: var(--text-main);">
                        ${item.image ? `<img src="${item.image}" style="width:24px;height:24px;border-radius:4px;vertical-align:middle;margin-right:8px;object-fit:cover" onerror="this.style.display='none'">` : ''}
                        ${item.query}
                    </td>
                    <td style="color: var(--text-muted); font-size: 0.875rem;">${new Date(item.timestamp).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="window.analyzeKeyword('${item.query.replace(/'/g, "\\'")}')">
                            Analyze Again
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" style="padding: 2rem; text-align: center; color: var(--text-muted);">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32" style="opacity:0.3; margin-bottom: 1rem;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <div>No recent searches</div>
                    </td>
                </tr>`;
        }
    }
};

window.RecentPage = RecentPage;
