/* =========================================================
   FORGETIC — POST-LISTING OPTIMIZER PAGE
   Automated suggestions, offer rules, and next actions.
   ========================================================= */

const OptimizerPage = {
  render(container, data, query) {
    container.innerHTML = `
      <div class="page-header animate-up">
        <div class="page-title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
          Post-Listing Optimizer
          ${data ? `<span class="live-badge"><span class="live-dot"></span>LIVE</span>` : ''}
        </div>
        <p class="page-desc">Automated suggestions and next actions when items sell or receive offers.</p>
      </div>

      ${data ? `
      <div class="dashboard-grid-2 animate-up" style="margin-bottom:1.5rem">
        <!-- Automation Rules -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Offer Management</span>
          </div>
          <div style="padding-top:0.5rem">
            <div class="form-group" style="margin-bottom:1.25rem">
              <label style="display:block;margin-bottom:0.5rem;font-size:0.875rem;color:var(--text-muted)">Auto-Accept Offers Above ($)</label>
              <input type="number" id="opt-auto-accept" value="${(data.metrics?.averagePrice * 0.9 || 0).toFixed(2)}" step="0.01" style="width:100%;padding:0.75rem;border-radius:var(--r-md);border:1px solid var(--border);background:var(--bg-surface-active);color:var(--text-main);font-size:1rem">
            </div>
            <div class="form-group" style="margin-bottom:1.25rem">
              <label style="display:block;margin-bottom:0.5rem;font-size:0.875rem;color:var(--text-muted)">Auto-Decline Offers Below ($)</label>
              <input type="number" id="opt-auto-decline" value="${(data.metrics?.averagePrice * 0.7 || 0).toFixed(2)}" step="0.01" style="width:100%;padding:0.75rem;border-radius:var(--r-md);border:1px solid var(--border);background:var(--bg-surface-active);color:var(--text-main);font-size:1rem">
            </div>
            <button class="btn btn-primary" style="width:100%" id="btn-save-rules">Save Rules</button>
          </div>
        </div>

        <!-- Next Actions AI -->
        <div class="card" style="background:var(--bg-surface-2);border:1px solid var(--border)">
          <div class="card-header">
            <span class="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.5rem"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M20.88 9a10 10 0 0 0-5.88-5.88"/></svg>
              AI Action Suggestions
            </span>
          </div>
          <div style="padding-top:1rem;display:flex;flex-direction:column;gap:1rem">
            <div style="padding:1rem;background:rgba(255,184,0,0.1);border:1px solid rgba(255,184,0,0.3);border-radius:var(--r-md)">
              <div style="font-weight:600;color:#ffb800;margin-bottom:0.25rem">When Item Sells</div>
              <p style="font-size:0.875rem;color:var(--text-muted);margin:0">Send a "Thank You" message and request feedback after 3 days. Recommend related products to the buyer.</p>
              <button class="btn btn-outline btn-automation" data-action="send_thank_you" style="margin-top:0.75rem;font-size:0.75rem;padding:0.25rem 0.5rem">Enable Automation</button>
            </div>
            <div style="padding:1rem;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.3);border-radius:var(--r-md)">
              <div style="font-weight:600;color:#a855f7;margin-bottom:0.25rem">When Offer Received</div>
              <p style="font-size:0.875rem;color:var(--text-muted);margin:0">Counter-offer with a 5% discount if the offer is between the decline and accept thresholds.</p>
              <button class="btn btn-outline btn-automation" data-action="counter_offer" style="margin-top:0.75rem;font-size:0.75rem;padding:0.25rem 0.5rem">Enable Automation</button>
            </div>
          </div>
        </div>
      </div>
      ` : `
      <div class="empty-state" style="height:100%">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
        <h3>No Data to Optimize</h3>
        <p>Analyze a product to view post-listing action suggestions.</p>
      </div>
      `}
    `;

    if (data) {
      // 1. Save Rules logic
      const saveBtn = container.querySelector('#btn-save-rules');
      if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
          const autoAccept = document.getElementById('opt-auto-accept').value;
          const autoDecline = document.getElementById('opt-auto-decline').value;
          
          const origText = saveBtn.innerText;
          saveBtn.innerText = 'Saving to eBay...';
          saveBtn.disabled = true;

          try {
            const res = await fetch('/api/ebay/update-rules', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ autoAccept: Number(autoAccept), autoDecline: Number(autoDecline) })
            });
            const result = await res.json();
            
            if (result.success) {
              saveBtn.innerText = 'Saved Successfully!';
              saveBtn.style.background = '#10b981'; // Green
              saveBtn.style.borderColor = '#10b981';
            } else {
              saveBtn.innerText = 'Error Saving';
            }
          } catch (err) {
            saveBtn.innerText = 'Failed';
            console.error('Error:', err);
          } finally {
            setTimeout(() => {
              saveBtn.innerText = origText;
              saveBtn.disabled = false;
              saveBtn.style.background = '';
              saveBtn.style.borderColor = '';
            }, 3000);
          }
        });
      }

      // 2. Enable Automation logic
      const automationBtns = container.querySelectorAll('.btn-automation');
      automationBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
          const actionType = btn.dataset.action;
          const origText = btn.innerText;
          
          btn.innerText = 'Activating...';
          btn.disabled = true;

          try {
            const res = await fetch('/api/ebay/enable-automation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ actionType })
            });
            const result = await res.json();
            
            if (result.success) {
              btn.innerText = 'Active';
              btn.style.color = '#10b981';
              btn.style.borderColor = '#10b981';
              btn.style.background = 'rgba(16,185,129,0.1)';
            } else {
              btn.innerText = 'Error';
            }
          } catch (err) {
            btn.innerText = 'Failed';
            console.error('Error:', err);
          }
        });
      });
    }
  }
};

window.OptimizerPage = OptimizerPage;
