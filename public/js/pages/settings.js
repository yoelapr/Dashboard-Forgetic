const SettingsPage = {
    render(container) {
        const userStr = localStorage.getItem('forgetic_user');
        let user = { name: 'Admin', role: 'Host' };
        if (userStr) {
            try { user = JSON.parse(userStr); } catch(e) {}
        }
        
        container.innerHTML = `
            <div class="overview-header section-title">
                <i data-lucide="settings"></i> Settings
            </div>
            
            <div class="dashboard-grid">
                <!-- User Profile -->
                <div class="metric-card card-span-2">
                    <div class="metric-header">
                        <span class="metric-title">User Profile</span>
                        <i data-lucide="user" class="metric-icon"></i>
                    </div>
                    
                    <div class="form-group">
                        <label>Display Name</label>
                        <input type="text" id="setting-name" value="${user.name}">
                    </div>
                    
                    <div class="form-group">
                        <label>Role</label>
                        <select id="setting-role" style="width: 100%; padding: 0.625rem; background: var(--bg-base); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 4px;">
                            <option value="Host" ${user.role === 'Host' ? 'selected' : ''}>Host</option>
                            <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Admin</option>
                            <option value="Guest" ${user.role === 'Guest' ? 'selected' : ''}>Guest</option>
                        </select>
                    </div>
                    
                    <button class="btn btn-primary" id="btn-save-profile">Save Changes</button>
                    <div id="save-msg" style="color: var(--success); margin-top: 1rem; display: none;">Changes saved successfully!</div>
                </div>

                <!-- API Preferences -->
                <div class="metric-card card-span-2">
                    <div class="metric-header">
                        <span class="metric-title">Application Preferences</span>
                        <i data-lucide="sliders" class="metric-icon"></i>
                    </div>
                    
                    <div class="form-group">
                        <label>Default Marketplace</label>
                        <select style="width: 100%; padding: 0.625rem; background: var(--bg-base); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 4px;">
                            <option value="EBAY_US">eBay US (Global)</option>
                            <option value="EBAY_GB">eBay UK</option>
                            <option value="EBAY_AU">eBay Australia</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Data Refresh Rate</label>
                        <select style="width: 100%; padding: 0.625rem; background: var(--bg-base); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 4px;">
                            <option value="live">Live (Real-time)</option>
                            <option value="cache">Use Cache (Faster)</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
        
        document.getElementById('btn-save-profile').addEventListener('click', () => {
            const newName = document.getElementById('setting-name').value;
            const newRole = document.getElementById('setting-role').value;
            
            user.name = newName;
            user.role = newRole;
            localStorage.setItem('forgetic_user', JSON.stringify(user));
            
            // Update UI
            const nameEl = document.getElementById('user-name');
            const roleEl = document.getElementById('user-role');
            const initEl = document.getElementById('user-initial');
            
            if (nameEl) nameEl.textContent = newName;
            if (roleEl) roleEl.textContent = newRole;
            if (initEl && newName) initEl.textContent = newName.charAt(0).toUpperCase();
            
            const msg = document.getElementById('save-msg');
            msg.style.display = 'block';
            setTimeout(() => { msg.style.display = 'none'; }, 3000);
        });
    },

    async analyzeData(query) {
        // Settings page doesn't react to search analysis
    }
};

window.SettingsPage = SettingsPage;
