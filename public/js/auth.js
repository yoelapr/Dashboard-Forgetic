/* =========================================================
   FORGETIC — AUTH MODULE
   Login, Register, Forgot Password, OTP
   ========================================================= */

(function () {
  'use strict';

  // ── Helpers ────────────────────────────────────────────────

  function showToast(msg, type = 'info') {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  function setLoading(btn, loading, text = 'Please wait...') {
    if (!btn) return;
    if (loading) {
      btn.disabled = true;
      btn._originalText = btn.innerHTML;
      btn.innerHTML = `<span class="spin-sm"></span> ${text}`;
    } else {
      btn.disabled = false;
      btn.innerHTML = btn._originalText || text;
    }
  }

  // OTP boxes: auto-focus next, handle backspace
  function initOtpBoxes(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const boxes = container.querySelectorAll('.otp-box');
    boxes.forEach((box, i) => {
      box.addEventListener('input', () => {
        if (box.value && i < boxes.length - 1) boxes[i + 1].focus();
      });
      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && i > 0) boxes[i - 1].focus();
      });
      box.addEventListener('paste', (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        [...paste].forEach((ch, j) => { if (boxes[i + j]) boxes[i + j].value = ch; });
        const next = Math.min(i + paste.length, boxes.length - 1);
        boxes[next].focus();
      });
    });
  }

  function getOtpValue(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return '';
    return [...container.querySelectorAll('.otp-box')].map(b => b.value).join('');
  }

  function togglePasswordVisibility(btn) {
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    } else {
      input.type = 'password';
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    }
  }

  // ── LOGIN PAGE ─────────────────────────────────────────────

  function initLogin() {
    // Password toggle
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', () => togglePasswordVisibility(btn));
    });

    // OTP flow
    const btnSendOtp = document.getElementById('btn-send-otp');
    const otpGroup = document.getElementById('otp-input-group');
    let otpSent = false;

    if (btnSendOtp) {
      btnSendOtp.addEventListener('click', async () => {
        const emailEl = document.getElementById('login-email-otp');
        if (!emailEl || !emailEl.value.includes('@')) {
          showToast('Please enter a valid email address', 'error');
          return;
        }
        setLoading(btnSendOtp, true, 'Sending...');
        // Mock OTP send (2s delay)
        await new Promise(r => setTimeout(r, 1500));
        setLoading(btnSendOtp, false);
        otpSent = true;
        otpGroup.style.display = '';
        initOtpBoxes('otp-boxes');
        document.querySelector('#otp-boxes .otp-box')?.focus();
        btnSendOtp.textContent = 'Resend OTP';
        showToast('OTP sent! Use code: 123456 (demo)', 'info');
      });
    }

    // Login form
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email')?.value.trim();
        const password = document.getElementById('login-password')?.value;
        const otp = otpSent ? getOtpValue('otp-boxes') : '';
        const btn = document.getElementById('btn-login');

        // Validate
        if (!email && !otp) { showToast('Enter your email or use OTP login', 'error'); return; }

        setLoading(btn, true, 'Signing in...');
        await new Promise(r => setTimeout(r, 1500));

        // Mock auth — accept any credentials
        const user = {
          name: email ? email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'User' : 'Forgetic User',
          email: email || document.getElementById('login-email-otp')?.value,
          role: 'Host'
        };
        // Capitalize name
        user.name = user.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        localStorage.setItem('forgetic_token', 'mock-token-' + Date.now());
        localStorage.setItem('forgetic_user', JSON.stringify(user));
        showToast('Welcome back! Redirecting...', 'info');
        setTimeout(() => { window.location.hash = '/dashboard/overview'; }, 800);
      });
    }
  }

  // ── REGISTER PAGE ──────────────────────────────────────────

  function initRegister() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', () => togglePasswordVisibility(btn));
    });

    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name     = document.getElementById('reg-name')?.value.trim();
      const email    = document.getElementById('reg-email')?.value.trim();
      const phone    = document.getElementById('reg-phone')?.value.trim();
      const password = document.getElementById('reg-password')?.value;
      const confirm  = document.getElementById('reg-confirm')?.value;
      const btn      = document.getElementById('btn-register');

      if (!name || !email || !password) { showToast('Please fill all required fields', 'error'); return; }
      if (password.length < 8) { showToast('Password must be at least 8 characters', 'error'); return; }
      if (password !== confirm) { showToast('Passwords do not match', 'error'); return; }

      setLoading(btn, true, 'Creating account...');
      await new Promise(r => setTimeout(r, 1500));

      const user = { name, email, phone, role: 'Host' };
      localStorage.setItem('forgetic_token', 'mock-token-' + Date.now());
      localStorage.setItem('forgetic_user', JSON.stringify(user));
      showToast('Account created! Welcome to Forgetic!', 'info');
      setTimeout(() => { window.location.hash = '/dashboard/overview'; }, 800);
    });
  }

  // ── FORGOT PASSWORD PAGE ───────────────────────────────────

  function initForgotPassword() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', () => togglePasswordVisibility(btn));
    });

    const backBtn = document.getElementById('forgot-back');
    if (backBtn) backBtn.addEventListener('click', () => { window.location.hash = '/login'; });

    let step = 1;

    function goToStep(n) {
      step = n;
      document.getElementById('forgot-step-1').style.display = n === 1 ? '' : 'none';
      document.getElementById('forgot-step-2').style.display = n === 2 ? '' : 'none';
      document.getElementById('forgot-step-3').style.display = n === 3 ? '' : 'none';
      // Update dots
      for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById(`step-${i}-dot`);
        if (!dot) continue;
        dot.classList.remove('active', 'done');
        if (i < n) dot.classList.add('done');
        else if (i === n) dot.classList.add('active');
      }
      if (n === 2) {
        initOtpBoxes('forgot-otp-boxes');
        document.querySelector('#forgot-otp-boxes .otp-box')?.focus();
      }
    }

    const emailForm = document.getElementById('forgot-email-form');
    if (emailForm) {
      emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email')?.value.trim();
        if (!email.includes('@')) { showToast('Enter a valid email address', 'error'); return; }
        const btn = emailForm.querySelector('button[type="submit"]');
        setLoading(btn, true, 'Sending...');
        await new Promise(r => setTimeout(r, 1500));
        setLoading(btn, false);
        showToast('Code sent! Use 123456 (demo)', 'info');
        goToStep(2);
      });
    }

    const otpForm = document.getElementById('forgot-otp-form');
    if (otpForm) {
      otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const otp = getOtpValue('forgot-otp-boxes');
        if (otp.length < 6) { showToast('Enter all 6 digits', 'error'); return; }
        const btn = otpForm.querySelector('button[type="submit"]');
        setLoading(btn, true, 'Verifying...');
        await new Promise(r => setTimeout(r, 1200));
        setLoading(btn, false);
        // Mock: accept 123456
        if (otp !== '123456') { showToast('Invalid OTP code. Try 123456 (demo)', 'error'); return; }
        goToStep(3);
      });
    }

    const resetForm = document.getElementById('forgot-reset-form');
    if (resetForm) {
      resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pw = document.getElementById('new-password')?.value;
        const cpw = document.getElementById('confirm-new-password')?.value;
        if (!pw || pw.length < 8) { showToast('Password must be at least 8 characters', 'error'); return; }
        if (pw !== cpw) { showToast('Passwords do not match', 'error'); return; }
        const btn = resetForm.querySelector('button[type="submit"]');
        setLoading(btn, true, 'Resetting...');
        await new Promise(r => setTimeout(r, 1500));
        showToast('Password reset! Please sign in.', 'info');
        setTimeout(() => { window.location.hash = '/login'; }, 1000);
      });
    }
  }

  // ── PUBLIC API ─────────────────────────────────────────────

  window.initAuth = function (page) {
    if (page === 'register') { initRegister(); return; }
    if (page === 'forgot')   { initForgotPassword(); return; }
    initLogin(); // default
  };

})();
