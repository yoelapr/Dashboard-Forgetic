/* =========================================================
   FORGETIC — MAIN APP (Router + AI Panel + Global State)
   ========================================================= */

// ── Global State ────────────────────────────────────────────
const ForgeticApp = {
  currentQuery: '',
  currentData: null,
  currentPage: 'overview',
  recentSearches: JSON.parse(localStorage.getItem('forgetic_recent') || '[]'),
  charts: {},

  saveRecent(query, data) {
    const item = {
      id: Date.now(),
      query,
      keyword: query,
      timestamp: new Date().toISOString(),
      metrics: data?.metrics || {},
      image: data?.metrics?.topItems?.[0]?.image || null
    };
    this.recentSearches = [item, ...this.recentSearches.filter(r => r.query !== query)].slice(0, 5);
    localStorage.setItem('forgetic_recent', JSON.stringify(this.recentSearches));
    this.updateRecentBadge();
  },

  updateRecentBadge() {
    const badge = document.getElementById('recent-count');
    if (badge) badge.textContent = this.recentSearches.length;
  },

  destroyCharts() {
    Object.values(this.charts).forEach(c => { try { c.destroy(); } catch (_) {} });
    this.charts = {};
  }
};
window.ForgeticApp = ForgeticApp;

// ── Toast Helper ────────────────────────────────────────────
window.showToast = function (msg, type = 'info') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3200);
};

// ── Chart defaults ───────────────────────────────────────────
if (typeof Chart !== 'undefined') {
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = '#64748b';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
  Chart.defaults.plugins.legend.labels.boxWidth = 10;
  Chart.defaults.plugins.legend.labels.padding = 14;
  Chart.defaults.plugins.tooltip.backgroundColor = '#1a2235';
  Chart.defaults.plugins.tooltip.titleColor = '#f0f4ff';
  Chart.defaults.plugins.tooltip.bodyColor = '#94a3b8';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.08)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.padding = 10;
}

// ── AI Insight Generator (Global) ───────────────────────────
/**
 * Fetch AI insights for the current page and inject into DOM.
 * Called automatically after renderPage() when data is available.
 */
async function generatePageInsights(page) {
  const data = ForgeticApp.currentData;
  const query = ForgeticApp.currentQuery;
  if (!data || !query) return;

  // Pages that handle their own AI insight loading internally
  const skipPages = ['recent', 'settings'];
  if (skipPages.includes(page)) return;

  const containerId = `ai-insight-${page}`;
  const container = document.getElementById(containerId);
  if (!container) return; // Page doesn't have an AI container

  // Show loading state
  container.innerHTML = `
    <div class="ai-insight-loading">
      <div class="spinner" style="width:18px;height:18px;border-width:2px"></div>
      <span>Generating AI insights for ${page}...</span>
    </div>`;

  try {
    const res = await window.api.ai.moduleInsights(page, query, data.metrics || {});
    if (res.success && res.data) {
      container.innerHTML = formatInsightText(res.data);
    } else {
      container.innerHTML = `<p class="text-muted" style="font-size:0.875rem">Could not generate insights. Try again.</p>`;
    }
  } catch (err) {
    console.error(`AI insight error for ${page}:`, err);
    container.innerHTML = `<p class="text-muted" style="font-size:0.875rem">AI insights unavailable. Check API key.</p>`;
  }
}
window.generatePageInsights = generatePageInsights;

/** Format AI text response — convert newlines and numbered lists to HTML */
function formatInsightText(text) {
  if (!text) return '';
  // Convert **bold** to <strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Convert numbered lists "1) " or "1. "
  html = html.replace(/^(\d+)[.)]\s+/gm, '<br><strong>$1.</strong> ');
  // Convert newlines
  html = html.replace(/\n/g, '<br>');
  // Trim leading <br>
  html = html.replace(/^(<br>)+/, '');
  return `<p style="font-size:0.875rem;line-height:1.8;color:var(--text-secondary)">${html}</p>`;
}
window.formatInsightText = formatInsightText;

// ── Router ───────────────────────────────────────────────────
class Router {
  constructor() {
    this.currentPath = '';
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  isAuthenticated() {
    return !!localStorage.getItem('forgetic_token');
  }

  handleRoute() {
    let path = window.location.hash.slice(1) || '/';

    // Root redirect
    if (path === '/') {
      window.location.hash = this.isAuthenticated() ? '/dashboard/overview' : '/login';
      return;
    }

    // Guard
    if (path.startsWith('/dashboard') && !this.isAuthenticated()) {
      window.location.hash = '/login';
      return;
    }
    if ((path === '/login' || path === '/register' || path === '/forgot-password') && this.isAuthenticated()) {
      window.location.hash = '/dashboard/overview';
      return;
    }

    const base = path.split('/')[1];

    if (base === 'login')    { this.renderAuth('tpl-login', 'login'); return; }
    if (base === 'register') { this.renderAuth('tpl-register', 'register'); return; }
    if (base === 'forgot-password') { this.renderAuth('tpl-forgot', 'forgot'); return; }

    if (base === 'dashboard') {
      const sub = path.split('/')[2] || 'overview';
      if (!this.currentPath.startsWith('/dashboard')) {
        this.renderDashboardShell();
      }
      this.renderPage(sub);
      this.currentPath = path;
      return;
    }

    window.location.hash = '/';
  }

  renderAuth(tplId, page) {
    const tpl = document.getElementById(tplId);
    if (!tpl) return;
    const container = document.getElementById('view-container');
    container.innerHTML = '';
    container.appendChild(tpl.content.cloneNode(true));
    if (window.initAuth) window.initAuth(page);
    this.currentPath = window.location.hash.slice(1);
  }

  renderDashboardShell() {
    const tpl = document.getElementById('tpl-dashboard');
    if (!tpl) return;
    const container = document.getElementById('view-container');
    container.innerHTML = '';
    container.appendChild(tpl.content.cloneNode(true));
    this.initShell();
  }

  initShell() {
    // User info
    const userStr = localStorage.getItem('forgetic_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const initial = (user.name || 'F').charAt(0).toUpperCase();
        document.getElementById('topbar-avatar').textContent = initial;
        document.getElementById('topbar-user-name').textContent = user.name || 'Forgetic';
        document.getElementById('topbar-user-role').textContent = user.role || 'Host';
      } catch (_) {}
    }
    ForgeticApp.updateRecentBadge();

    // Logout
    document.getElementById('btn-logout')?.addEventListener('click', () => {
      localStorage.removeItem('forgetic_token');
      localStorage.removeItem('forgetic_user');
      showToast('Signed out successfully', 'info');
      setTimeout(() => { window.location.hash = '/login'; }, 500);
    });

    // Search
    this.initSearch();

    // AI Panel
    this.initAIPanel();
  }

  initSearch() {
    const input = document.getElementById('global-search');
    const btn   = document.getElementById('btn-analyze');
    const liveIndicator = document.getElementById('live-indicator');

    const doAnalyze = async () => {
      const query = input?.value.trim();
      if (!query) { showToast('Please enter a keyword or eBay URL', 'error'); return; }

      btn.disabled = true;
      btn.innerHTML = `<span class="spin-sm"></span> Analyzing...`;
      if (liveIndicator) liveIndicator.style.display = '';

      try {
        ForgeticApp.currentQuery = query;
        const response = await window.api.ebay.search(query, false);
        if (response.success && response.data) {
          ForgeticApp.currentData = response.data;
          ForgeticApp.saveRecent(query, response.data);
          // Re-render current page with new data
          this.renderPage(ForgeticApp.currentPage);
          showToast(`✓ Live data loaded for "${query}"`, 'info');
        } else {
          showToast('No data found. Try a different keyword.', 'error');
        }
      } catch (err) {
        console.error('Analysis error:', err);
        showToast('Analysis failed. Check console for details.', 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> Analyze Live`;
        setTimeout(() => { if (liveIndicator) liveIndicator.style.display = 'none'; }, 3000);
      }
    };

    btn?.addEventListener('click', doAnalyze);
    input?.addEventListener('keypress', e => { if (e.key === 'Enter') doAnalyze(); });
  }

  initAIPanel() {
    const fab = document.getElementById('ai-fab-btn');
    const panel = document.getElementById('ai-panel');
    const backdrop = document.getElementById('ai-backdrop');
    const closeBtn = document.getElementById('ai-close-btn');
    const sendBtn  = document.getElementById('ai-send-btn');
    const textInput = document.getElementById('ai-text-input');
    const messagesEl = document.getElementById('ai-messages');
    const fileInput = document.getElementById('ai-file-input');
    const attachmentsEl = document.getElementById('ai-attachments');

    let attachments = [];

    const openPanel = () => {
      panel?.classList.add('open');
      backdrop?.classList.add('active');
    };
    const closePanel = () => {
      panel?.classList.remove('open');
      backdrop?.classList.remove('active');
    };

    fab?.addEventListener('click', openPanel);
    closeBtn?.addEventListener('click', closePanel);
    backdrop?.addEventListener('click', closePanel);

    // Quick actions
    document.getElementById('ai-quick-actions')?.querySelectorAll('.ai-quick-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.dataset.prompt;
        if (textInput) textInput.value = prompt;
        openPanel();
        setTimeout(sendMessage, 100);
      });
    });

    // File attachments
    fileInput?.addEventListener('change', () => {
      [...fileInput.files].forEach(file => {
        attachments.push(file);
        const chip = document.createElement('div');
        chip.className = 'ai-attachment-chip';
        chip.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          ${file.name.length > 20 ? file.name.slice(0, 18) + '…' : file.name}
          <button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:inherit;display:flex;padding:0">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        `;
        attachmentsEl?.appendChild(chip);
      });
      fileInput.value = '';
    });

    // Send message
    function addUserMsg(text) {
      const userStr = localStorage.getItem('forgetic_user');
      let initial = 'U';
      try { initial = (JSON.parse(userStr).name || 'U').charAt(0).toUpperCase(); } catch(_) {}
      const msg = document.createElement('div');
      msg.className = 'ai-msg user';
      msg.innerHTML = `
        <div class="ai-msg-avatar user-av">${initial}</div>
        <div class="ai-msg-bubble">${text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')}</div>
      `;
      messagesEl?.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addTyping() {
      const typing = document.createElement('div');
      typing.className = 'ai-msg bot';
      typing.id = 'ai-typing-indicator';
      typing.innerHTML = `
        <div class="ai-msg-avatar bot">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/></svg>
        </div>
        <div class="ai-msg-bubble" style="padding:0.75rem 1rem">
          <div class="ai-typing"><span></span><span></span><span></span></div>
        </div>
      `;
      messagesEl?.appendChild(typing);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeTyping() {
      document.getElementById('ai-typing-indicator')?.remove();
    }

    function addBotMsg(text) {
      const msg = document.createElement('div');
      msg.className = 'ai-msg bot';
      msg.innerHTML = `
        <div class="ai-msg-avatar bot">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/></svg>
        </div>
        <div class="ai-msg-bubble">${text}</div>
      `;
      messagesEl?.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    async function sendMessage() {
      const text = textInput?.value.trim();
      if (!text) return;
      textInput.value = '';
      attachments = [];
      attachmentsEl.innerHTML = '';

      addUserMsg(text);
      addTyping();

      try {
        const contextData = ForgeticApp.currentData;
        const contextStr = contextData
          ? `\n\nContext: Currently analyzing keyword "${ForgeticApp.currentQuery}". Metrics: avg price $${contextData.metrics?.averagePrice || 'N/A'}, opportunity score ${contextData.metrics?.opportunityScore || 'N/A'}/100, total sellers ${contextData.metrics?.totalSellers || 'N/A'}.`
          : '';

        const response = await window.api.ai.chat(text + contextStr);
        removeTyping();
        addBotMsg(response.success ? response.data.replace(/\n/g, '<br>') : 'Sorry, I couldn\'t generate a response. Please try again.');
      } catch (err) {
        removeTyping();
        addBotMsg('Sorry, an error occurred. Please check your API connection and try again.');
      }
    }

    sendBtn?.addEventListener('click', sendMessage);
    textInput?.addEventListener('keypress', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
  }

  renderPage(page) {
    ForgeticApp.currentPage = page;
    ForgeticApp.destroyCharts();

    // Update nav active state
    document.querySelectorAll('.nav-item[data-page]').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });

    const content = document.getElementById('page-content');
    if (!content) return;

    const pages = {
      overview:     window.OverviewPage,
      research:     window.ResearchPage,
      estimator:    window.EstimatorPage,
      optimizer:    window.OptimizerPage,
      demand:       window.DemandPage,
      pricing:      window.PricingPage,
      customer:     window.CustomerPage,
      segmentation: window.SegmentationPage,
      competitive:  window.CompetitivePage,
      behavior:     window.BehaviorPage,
      recent:       window.RecentPage,
      settings:     window.SettingsPage,
    };

    const pageObj = pages[page];
    if (pageObj) {
      pageObj.render(content, ForgeticApp.currentData, ForgeticApp.currentQuery);

      // Expose analyzeKeyword globally for search chips
      window.analyzeKeyword = (query) => {
        ForgeticApp.currentQuery = query;
        const input = document.getElementById('global-search');
        if (input) input.value = query;
        document.getElementById('btn-analyze')?.click();
      };

      // Auto-generate AI insights for this page (non-blocking)
      if (ForgeticApp.currentData) {
        setTimeout(() => generatePageInsights(page), 150);
      }
    } else {
      content.innerHTML = `
        <div class="empty-state" style="height:60vh">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56" style="opacity:0.25"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <h3>${page.charAt(0).toUpperCase() + page.slice(1)}</h3>
          <p>Module coming soon.</p>
        </div>`;
    }
  }
}

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  window.appRouter = new Router();
});
