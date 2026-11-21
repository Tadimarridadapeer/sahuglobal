/**
 * SAHU GLOBAL — ADMIN DASHBOARD & CMS ENGINE
 * Demonstration CMS, Visual Content Editor, Lead CRM, SEO Meta Manager
 */

(function () {
  'use strict';

  // Global CMS State
  window.CMS_STATE = {
    isAuthenticated: false,
    currentUser: null,
    content: null,
    enquiries: [],
    seo: null,
    activeTab: 'overview',
    selectedEnquiry: null
  };

  // Toast Notification Utility
  window.showToast = function (message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${type === 'success' ? '#B49A75' : '#EF4444'}" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // Load Content from API or LocalStorage or Default
  async function loadInitialData() {
    // 1. Content
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const json = await res.json();
        window.CMS_STATE.content = json.data;
      }
    } catch (e) {
      console.warn('API /api/content not reachable, using local fallback.');
    }

    if (!window.CMS_STATE.content) {
      const saved = localStorage.getItem('sahu_global_content');
      if (saved) {
        try { window.CMS_STATE.content = JSON.parse(saved); } catch (e) {}
      }
      if (!window.CMS_STATE.content && window.DEFAULT_CONTENT) {
        window.CMS_STATE.content = JSON.parse(JSON.stringify(window.DEFAULT_CONTENT));
      }
    }

    // 2. Enquiries
    try {
      const res = await fetch('/api/enquiries');
      if (res.ok) {
        const json = await res.json();
        window.CMS_STATE.enquiries = json.data || [];
      }
    } catch (e) {
      console.warn('API /api/enquiries not reachable, using local fallback.');
    }

    if (!window.CMS_STATE.enquiries.length) {
      const savedEnq = localStorage.getItem('sahu_global_enquiries');
      if (savedEnq) {
        try { window.CMS_STATE.enquiries = JSON.parse(savedEnq); } catch (e) {}
      }
      if (!window.CMS_STATE.enquiries.length && window.DEFAULT_ENQUIRIES) {
        window.CMS_STATE.enquiries = JSON.parse(JSON.stringify(window.DEFAULT_ENQUIRIES));
      }
    }

    // 3. SEO
    try {
      const res = await fetch('/api/seo');
      if (res.ok) {
        const json = await res.json();
        window.CMS_STATE.seo = json.data;
      }
    } catch (e) {}

    if (!window.CMS_STATE.seo) {
      const savedSeo = localStorage.getItem('sahu_global_seo');
      if (savedSeo) {
        try { window.CMS_STATE.seo = JSON.parse(savedSeo); } catch (e) {}
      }
      if (!window.CMS_STATE.seo && window.DEFAULT_SEO) {
        window.CMS_STATE.seo = JSON.parse(JSON.stringify(window.DEFAULT_SEO));
      }
    }

    // Check saved session
    const savedUser = sessionStorage.getItem('sahu_admin_user');
    if (savedUser) {
      try {
        window.CMS_STATE.currentUser = JSON.parse(savedUser);
        window.CMS_STATE.isAuthenticated = true;
      } catch (e) {}
    }
  }

  // Save Content to Backend and LocalStorage
  async function persistContent(newContent) {
    window.CMS_STATE.content = newContent;
    localStorage.setItem('sahu_global_content', JSON.stringify(newContent));

    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      });
    } catch (e) {
      console.warn('Could not POST to /api/content, saved to localStorage only.');
    }

    // Dispatch update event so public view updates in real time
    window.dispatchEvent(new CustomEvent('sahu:content-updated', { detail: newContent }));
  }

  // Save Enquiries
  async function persistEnquiries(enquiries) {
    window.CMS_STATE.enquiries = enquiries;
    localStorage.setItem('sahu_global_enquiries', JSON.stringify(enquiries));
  }

  // Save SEO
  async function persistSeo(newSeo) {
    window.CMS_STATE.seo = newSeo;
    localStorage.setItem('sahu_global_seo', JSON.stringify(newSeo));
    try {
      await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSeo)
      });
    } catch (e) {}
  }

  // Admin Dashboard UI Rendering
  function renderAdminApp() {
    const adminWrapper = document.getElementById('admin-app-root');
    if (!adminWrapper) return;

    if (!window.CMS_STATE.isAuthenticated) {
      adminWrapper.innerHTML = renderLoginScreen();
      attachLoginEvents();
      return;
    }

    adminWrapper.innerHTML = `
      <div class="admin-view-wrapper">
        <!-- Sidebar -->
        <aside class="admin-sidebar">
          <div class="admin-sidebar-header">
            <div class="admin-logo-badge">SG</div>
            <div class="admin-sidebar-brand">
              <h3>Sahu Global</h3>
              <span>CMS & Lead Portal</span>
            </div>
          </div>

          <nav class="admin-nav-menu">
            <a class="admin-nav-item ${window.CMS_STATE.activeTab === 'overview' ? 'active' : ''}" data-tab="overview">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span>Overview</span>
            </a>
            <a class="admin-nav-item ${window.CMS_STATE.activeTab === 'cms' ? 'active' : ''}" data-tab="cms">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              <span>Visual CMS Editor</span>
            </a>
            <a class="admin-nav-item ${window.CMS_STATE.activeTab === 'enquiries' ? 'active' : ''}" data-tab="enquiries">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>Buyer Enquiries</span>
              <span class="badge-count">${window.CMS_STATE.enquiries.length}</span>
            </a>
            <a class="admin-nav-item ${window.CMS_STATE.activeTab === 'products' ? 'active' : ''}" data-tab="products">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <span>Apparel Categories</span>
            </a>
            <a class="admin-nav-item ${window.CMS_STATE.activeTab === 'seo' ? 'active' : ''}" data-tab="seo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>SEO & Metadata</span>
            </a>
            <a class="admin-nav-item ${window.CMS_STATE.activeTab === 'settings' ? 'active' : ''}" data-tab="settings">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              <span>Settings & SMTP</span>
            </a>
          </nav>

          <div class="admin-sidebar-footer">
            <div class="admin-user-pill">
              <div class="admin-avatar">SG</div>
              <div class="admin-user-info">
                <span class="admin-user-name">${window.CMS_STATE.currentUser ? window.CMS_STATE.currentUser.name : 'Simran Gupta'}</span>
                <span class="admin-user-role">Sahu Global Administrator</span>
              </div>
            </div>
            <button id="admin-logout-btn" class="btn btn-secondary btn-sm" style="width: 100%;">
              Log Out
            </button>
          </div>
        </aside>

        <!-- Main Area -->
        <main class="admin-workspace">
          <header class="admin-topbar">
            <div class="admin-breadcrumb">
              <span>Sahu Global</span>
              <span>/</span>
              <span class="current" id="admin-current-section-title">${getTabTitle(window.CMS_STATE.activeTab)}</span>
            </div>
            <div class="admin-topbar-actions">
              <a href="#home" class="btn btn-secondary btn-sm" id="btn-view-public-site">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                View Public Site
              </a>
              <a href="#home" class="btn btn-primary btn-sm" id="btn-close-admin-topbar" style="background: var(--royal-burgundy, #3B482E); color: #fff;">
                ✕ Exit Portal
              </a>
            </div>
          </header>

          <div class="admin-content-area" id="admin-tab-content">
            ${renderActiveTabContent()}
          </div>
        </main>
      </div>

      <!-- Lead Detail Modal -->
      <div class="modal-overlay" id="lead-modal-overlay">
        <div class="modal-card" id="lead-modal-content"></div>
      </div>
    `;

    attachAdminNavEvents();
    attachTabSpecificEvents();
  }

  function getTabTitle(tab) {
    switch (tab) {
      case 'overview': return 'Executive Overview';
      case 'cms': return 'Visual Content Management';
      case 'enquiries': return 'Buyer Leads & RFQs';
      case 'products': return 'Apparel Collections';
      case 'seo': return 'Search Engine Optimization';
      case 'settings': return 'System Settings & Integrations';
      default: return 'Dashboard';
    }
  }

  // Login Screen
  function renderLoginScreen() {
    return `
      <div class="admin-login-modal-overlay" id="admin-login-backdrop">
        <div class="admin-login-card" onclick="event.stopPropagation()">
          <button type="button" class="admin-close-modal-btn" id="btn-close-admin-modal" aria-label="Close Portal" title="Close Portal (Esc)">✕</button>
          <div style="text-align: center; margin-bottom: 1.75rem;">
            <div style="width: 48px; height: 48px; background: var(--royal-burgundy, #3B482E); border: 1px solid var(--royal-gold, #687A54); color: #FFFFFF; border-radius: var(--radius-xs); margin: 0 auto 1rem auto; display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: var(--font-royal, 'Plus Jakarta Sans'); font-size: 1.2rem; box-shadow: 0 4px 12px rgba(59, 72, 46, 0.25);">SG</div>
            <h2 style="font-family: var(--font-royal, 'Plus Jakarta Sans'); font-size: 1.6rem; font-weight: 800; color: var(--text-title, #1A2216); margin-bottom: 0.35rem; letter-spacing: -0.01em;">Sahu Global Client Portal</h2>
            <p style="font-size: 0.88rem; color: var(--text-muted, #5D6B57);">B2B Client Management & Lead Verification</p>
          </div>

          <div style="background: var(--color-bg-alt, #EBF1E8); border: 1px solid var(--border-strong, #D0DEC9); border-radius: var(--radius-xs); padding: 0.85rem 1rem; margin-bottom: 1.25rem; font-size: 0.82rem; color: var(--text-body, #2E382A);">
            <strong style="color: var(--royal-burgundy, #3B482E);">Client Demo Access:</strong><br>
            Email: <code style="color: var(--royal-burgundy, #3B482E); font-weight: 600;">admin@sahuglobal.com</code> &bull; Password: <code style="color: var(--royal-burgundy, #3B482E); font-weight: 600;">sahu2026</code>
          </div>

          <form id="admin-login-form" style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-title, #1A2216); margin-bottom: 0.35rem; display: block;">Administrator / Client Email</label>
              <input type="email" id="login-email" class="form-control" value="admin@sahuglobal.com" required style="width: 100%; padding: 0.65rem 0.85rem; border: 1px solid var(--border-light, #E0E8DC); border-radius: 4px; font-size: 0.9rem;">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label style="font-size: 0.82rem; font-weight: 600; color: var(--text-title, #1A2216); margin-bottom: 0.35rem; display: block;">Access Password</label>
              <input type="password" id="login-password" class="form-control" value="sahu2026" required style="width: 100%; padding: 0.65rem 0.85rem; border: 1px solid var(--border-light, #E0E8DC); border-radius: 4px; font-size: 0.9rem;">
            </div>
            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 0.5rem; padding: 0.75rem 1.25rem; font-weight: 700;">
              Sign Into Dashboard
            </button>
            <button type="button" id="btn-quick-demo-login" class="btn btn-secondary btn-sm" style="width: 100%; padding: 0.6rem 1rem;">
              Instant One-Click Demo Login
            </button>
            <a href="#home" id="btn-cancel-to-website" style="text-align: center; font-size: 0.85rem; color: var(--text-muted, #5D6B57); text-decoration: none; margin-top: 0.35rem; font-weight: 500;">
              &larr; Return to Public Website
            </a>
          </form>
        </div>
      </div>
    `;
  }

  function attachLoginEvents() {
    const form = document.getElementById('admin-login-form');
    const quickBtn = document.getElementById('btn-quick-demo-login');
    const closeBtn = document.getElementById('btn-close-admin-modal');
    const cancelLink = document.getElementById('btn-cancel-to-website');
    const backdrop = document.getElementById('admin-login-backdrop');

    const exitPortal = () => {
      window.location.hash = '#home';
    };

    if (closeBtn) closeBtn.addEventListener('click', exitPortal);
    if (cancelLink) {
      cancelLink.addEventListener('click', (e) => {
        e.preventDefault();
        exitPortal();
      });
    }
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) exitPortal();
      });
    }

    const handleLogin = (email, password) => {
      window.CMS_STATE.isAuthenticated = true;
      window.CMS_STATE.currentUser = {
        name: 'Simran Gupta',
        role: 'Senior Social Media & Content Lead',
        email: email,
        organization: 'Sahu Global Private Limited'
      };
      sessionStorage.setItem('sahu_admin_user', JSON.stringify(window.CMS_STATE.currentUser));
      window.showToast('Welcome back, Simran Gupta. CMS loaded.');
      renderAdminApp();
    };

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        handleLogin(email, pass);
      });
    }

    if (quickBtn) {
      quickBtn.addEventListener('click', () => {
        handleLogin('admin@sahuglobal.com', 'sahu2026');
      });
    }
  }

  // Active Tab Renderer
  function renderActiveTabContent() {
    switch (window.CMS_STATE.activeTab) {
      case 'overview': return renderOverviewTab();
      case 'cms': return renderCmsTab();
      case 'enquiries': return renderEnquiriesTab();
      case 'products': return renderProductsTab();
      case 'seo': return renderSeoTab();
      case 'settings': return renderSettingsTab();
      default: return renderOverviewTab();
    }
  }

  // 1. Overview Tab
  function renderOverviewTab() {
    const enqs = window.CMS_STATE.enquiries;
    const highPriority = enqs.filter(e => e.priority === 'High').length;
    const countries = [...new Set(enqs.map(e => e.country))].length;

    return `
      <div class="admin-metrics-grid">
        <div class="admin-metric-card">
          <div class="metric-header">
            <span class="metric-title">Total Buyer Inquiries</span>
            <span class="status-pill status-new">Active</span>
          </div>
          <div class="metric-number">${enqs.length}</div>
          <div class="metric-subtitle">Across North America & Europe</div>
        </div>

        <div class="admin-metric-card">
          <div class="metric-header">
            <span class="metric-title">High Priority Leads</span>
            <span class="status-pill status-sample-sent">Urgent</span>
          </div>
          <div class="metric-number">${highPriority}</div>
          <div class="metric-subtitle">Volume > 2,500 units/style</div>
        </div>

        <div class="admin-metric-card">
          <div class="metric-header">
            <span class="metric-title">Export Markets</span>
            <span class="status-pill status-in-review">Global</span>
          </div>
          <div class="metric-number">${countries}</div>
          <div class="metric-subtitle">France, UK, USA, Sweden, UAE</div>
        </div>

        <div class="admin-metric-card">
          <div class="metric-header">
            <span class="metric-title">CMS Sections</span>
            <span class="status-pill status-closed">Published</span>
          </div>
          <div class="metric-number">28</div>
          <div class="metric-subtitle">Live on www.sahuglobal.com</div>
        </div>
      </div>

      <!-- Recent Enquiries Mini Table -->
      <div class="cms-panel-card">
        <div class="cms-panel-header">
          <h3 class="cms-panel-title">Recent Buyer Sourcing Requests</h3>
          <button class="btn btn-secondary btn-sm" id="btn-goto-all-enquiries">View All Enquiries</button>
        </div>
        <div class="crm-table-wrapper">
          <table class="crm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Contact</th>
                <th>Country</th>
                <th>Category</th>
                <th>Volume</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${enqs.slice(0, 4).map(e => `
                <tr class="clickable-lead-row" data-id="${e.id}">
                  <td><code>${e.id}</code></td>
                  <td><strong>${e.companyName}</strong></td>
                  <td>${e.fullName}</td>
                  <td>${e.country}</td>
                  <td>${e.productInterest}</td>
                  <td>${e.approximateVolume}</td>
                  <td><span class="status-pill status-${e.status.toLowerCase().replace(/\s+/g, '-')}">${e.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 2. Visual CMS Editor Tab
  function renderCmsTab() {
    const c = window.CMS_STATE.content;
    return `
      <div class="cms-panel-card">
        <div class="cms-panel-header">
          <div>
            <h3 class="cms-panel-title">Live Website Content Editor</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Select a section below to update live text, banners, and credentials.</p>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-secondary btn-sm" id="cms-btn-reset">Reset to Defaults</button>
            <button class="btn btn-primary btn-sm" id="cms-btn-publish">Publish Changes Live</button>
          </div>
        </div>

        <form id="cms-edit-form" class="cms-form-grid">
          <!-- Hero Section -->
          <div class="cms-full-width" style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.75rem; margin-top: 0.5rem;">
            <h4 style="font-family: var(--font-sans); color: var(--royal-burgundy); font-size: 1rem;">Homepage Hero Section</h4>
          </div>

          <div class="form-group cms-full-width">
            <label>Hero Headline</label>
            <input type="text" id="cms-hero-headline" class="form-control" value="${escapeHtml(c.home.hero.headline)}">
          </div>

          <div class="form-group cms-full-width">
            <label>Hero Subheadline / Lead Paragraph</label>
            <textarea id="cms-hero-subheadline" class="form-control" rows="3">${escapeHtml(c.home.hero.subheadline)}</textarea>
          </div>

          <div class="form-group">
            <label>Hero Primary CTA Label</label>
            <input type="text" id="cms-hero-cta" class="form-control" value="${escapeHtml(c.home.hero.primaryCTA)}">
          </div>

          <div class="form-group">
            <label>Hero Primary Banner Image (URL)</label>
            <input type="text" id="cms-hero-img" class="form-control" value="${escapeHtml(c.home.hero.heroImage)}">
          </div>

          <!-- Company Heritage Section -->
          <div class="cms-full-width" style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.75rem; margin-top: 1.5rem;">
            <h4 style="font-family: var(--font-sans); color: var(--royal-burgundy); font-size: 1rem;">Company Heritage & Positioning</h4>
          </div>

          <div class="form-group">
            <label>Brand Tagline</label>
            <input type="text" id="cms-brand-tagline" class="form-control" value="${escapeHtml(c.company.tagline)}">
          </div>

          <div class="form-group">
            <label>Founded Year (Reference 1979)</label>
            <input type="text" id="cms-founded-year" class="form-control" value="${c.company.foundedYear}">
          </div>

          <div class="form-group cms-full-width">
            <label>Executive Corporate Bio</label>
            <textarea id="cms-company-bio" class="form-control" rows="3">${escapeHtml(c.company.shortBio)}</textarea>
          </div>

          <!-- Sustainability Targets -->
          <div class="cms-full-width" style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.75rem; margin-top: 1.5rem;">
            <h4 style="font-family: var(--font-sans); color: var(--royal-burgundy); font-size: 1rem;">Sustainability Section</h4>
          </div>

          <div class="form-group cms-full-width">
            <label>Sustainability Lead Text</label>
            <textarea id="cms-sust-lead" class="form-control" rows="2">${escapeHtml(c.sustainability.hero.lead)}</textarea>
          </div>
        </form>
      </div>
    `;
  }

  // 3. Buyer Enquiries CRM Tab
  function renderEnquiriesTab() {
    const enqs = window.CMS_STATE.enquiries;
    return `
      <div class="cms-panel-card" style="padding: 0;">
        <div class="crm-toolbar">
          <input type="text" id="crm-search-input" class="crm-search-box" placeholder="Search by company, buyer, country...">
          <div style="display: flex; gap: 0.75rem;">
            <select id="crm-status-filter" class="form-control" style="padding: 0.45rem 0.85rem; font-size: 0.82rem;">
              <option value="ALL">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Sample Sent">Sample Sent</option>
              <option value="In Review">In Review</option>
              <option value="Closed">Closed</option>
            </select>
            <button class="btn btn-secondary btn-sm" id="btn-export-csv">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export CSV
            </button>
          </div>
        </div>

        <div class="crm-table-wrapper" style="border: none;">
          <table class="crm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Received</th>
                <th>Company</th>
                <th>Buyer Name</th>
                <th>Country</th>
                <th>Product Category</th>
                <th>Approx Volume</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="crm-table-body">
              ${renderEnquiryRows(enqs)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderEnquiryRows(enqs) {
    if (!enqs.length) {
      return `<tr><td colspan="9" style="text-align: center; padding: 3rem; color: var(--text-muted);">No enquiries match the selected filter.</td></tr>`;
    }
    return enqs.map(e => `
      <tr class="clickable-lead-row" data-id="${e.id}">
        <td><code>${e.id}</code></td>
        <td>${new Date(e.createdAt).toLocaleDateString()}</td>
        <td><strong>${e.companyName}</strong></td>
        <td>${e.fullName}</td>
        <td>${e.country}</td>
        <td>${e.productInterest}</td>
        <td>${e.approximateVolume}</td>
        <td><span class="status-pill status-${e.status.toLowerCase().replace(/\s+/g, '-')}">${e.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm btn-view-lead" data-id="${e.id}" style="padding: 0.35rem 0.65rem; font-size: 0.74rem;">
            Open Lead
          </button>
        </td>
      </tr>
    `).join('');
  }

  // 4. Products Tab
  function renderProductsTab() {
    const cats = window.CMS_STATE.content.categories;
    return `
      <div class="cms-panel-card">
        <div class="cms-panel-header">
          <h3 class="cms-panel-title">Apparel Categories & Production Specs</h3>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
          ${cats.map((cat, idx) => `
            <div style="background: #0B131F; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1.5rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                <h4 style="color: #FFFFFF; font-size: 1.2rem;">${cat.name}</h4>
                <span class="status-pill status-in-review">${cat.id}</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">${cat.description}</p>
              <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--royal-burgundy); margin-bottom: 0.4rem;">
                MOQ: <strong>${cat.moq}</strong>
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-body); margin-bottom: 1rem;">
                Lead Time: ${cat.leadTime}
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
                ${cat.fabrics.map(f => `<span style="background: rgba(255,255,255,0.05); font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 4px;">${f}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 5. SEO Tab
  function renderSeoTab() {
    const seo = window.CMS_STATE.seo;
    return `
      <div class="cms-panel-card">
        <div class="cms-panel-header">
          <div>
            <h3 class="cms-panel-title">Search Engine Optimization (SEO) & Structured Data</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Manage site-wide meta titles, descriptions, and OpenGraph tags.</p>
          </div>
          <button class="btn btn-primary btn-sm" id="btn-save-seo">Save SEO Configurations</button>
        </div>

        <div class="cms-form-grid">
          <div class="form-group cms-full-width">
            <label>Canonical Production Domain</label>
            <input type="text" id="seo-site-url" class="form-control" value="${seo.siteUrl}">
          </div>

          <div class="form-group cms-full-width">
            <label>Homepage Meta Title</label>
            <input type="text" id="seo-home-title" class="form-control" value="${escapeHtml(seo.pages.home.title)}">
          </div>

          <div class="form-group cms-full-width">
            <label>Homepage Meta Description</label>
            <textarea id="seo-home-desc" class="form-control" rows="3">${escapeHtml(seo.pages.home.description)}</textarea>
          </div>

          <div class="form-group cms-full-width">
            <label>Target Keywords (Comma Separated)</label>
            <input type="text" id="seo-home-keywords" class="form-control" value="${escapeHtml(seo.pages.home.keywords)}">
          </div>
        </div>
      </div>
    `;
  }

  // 6. Settings Tab
  function renderSettingsTab() {
    const comp = window.CMS_STATE.content.company;
    return `
      <div class="cms-panel-card">
        <div class="cms-panel-header">
          <h3 class="cms-panel-title">Corporate Settings & SMTP Mail Integration</h3>
          <button class="btn btn-primary btn-sm" id="btn-save-settings">Save Settings</button>
        </div>

        <div class="cms-form-grid">
          <div class="form-group">
            <label>Corporate Legal Name</label>
            <input type="text" id="settings-company-name" class="form-control" value="${escapeHtml(comp.legalName)}">
          </div>

          <div class="form-group">
            <label>Buyer Procurement Email</label>
            <input type="email" id="settings-procurement-email" class="form-control" value="${comp.procurementEmail}">
          </div>

          <div class="form-group">
            <label>Corporate Phone Number</label>
            <input type="text" id="settings-phone" class="form-control" value="${comp.phone}">
          </div>

          <div class="form-group">
            <label>Google Analytics 4 Measurement ID</label>
            <input type="text" class="form-control" placeholder="G-XXXXXXXXXX" value="G-SAHU2026GLB">
          </div>

          <div class="form-group cms-full-width">
            <label>Demonstration SMTP Outgoing Server</label>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 1.25rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-body);">
              Status: <strong>Ready for Client SMTP Credentials</strong><br>
              Host: <code>smtp.sahuglobal.com</code> | Port: <code>587 (STARTTLS)</code><br>
              Sender: <code>procurement@sahuglobal.com</code><br>
              <em style="color: var(--text-muted);">During demonstration mode, incoming leads are securely recorded to JSON and local store.</em>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Attach Event Handlers
  function attachAdminNavEvents() {
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.getAttribute('data-tab');
        window.CMS_STATE.activeTab = tab;
        renderAdminApp();
      });
    });

    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.CMS_STATE.isAuthenticated = false;
        window.CMS_STATE.currentUser = null;
        sessionStorage.removeItem('sahu_admin_user');
        window.showToast('Logged out of Sahu Global Admin.');
        renderAdminApp();
      });
    }

    const gotoAll = document.getElementById('btn-goto-all-enquiries');
    if (gotoAll) {
      gotoAll.addEventListener('click', () => {
        window.CMS_STATE.activeTab = 'enquiries';
        renderAdminApp();
      });
    }
  }

  function attachTabSpecificEvents() {
    // 1. CMS Tab
    const btnPublish = document.getElementById('cms-btn-publish');
    if (btnPublish) {
      btnPublish.addEventListener('click', async () => {
        const c = window.CMS_STATE.content;
        c.home.hero.headline = document.getElementById('cms-hero-headline').value;
        c.home.hero.subheadline = document.getElementById('cms-hero-subheadline').value;
        c.home.hero.primaryCTA = document.getElementById('cms-hero-cta').value;
        c.home.hero.heroImage = document.getElementById('cms-hero-img').value;
        c.company.tagline = document.getElementById('cms-brand-tagline').value;
        c.company.shortBio = document.getElementById('cms-company-bio').value;
        c.sustainability.hero.lead = document.getElementById('cms-sust-lead').value;

        await persistContent(c);
        window.showToast('Content published successfully to live website!');
      });
    }

    const btnReset = document.getElementById('cms-btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', async () => {
        if (confirm('Reset content to original verified brief defaults?')) {
          localStorage.removeItem('sahu_global_content');
          window.CMS_STATE.content = JSON.parse(JSON.stringify(window.DEFAULT_CONTENT));
          await persistContent(window.CMS_STATE.content);
          window.showToast('Content restored to verified default!');
          renderAdminApp();
        }
      });
    }

    // 2. Enquiries Tab
    attachCrmEvents();

    // 3. SEO Tab
    const btnSaveSeo = document.getElementById('btn-save-seo');
    if (btnSaveSeo) {
      btnSaveSeo.addEventListener('click', async () => {
        const seo = window.CMS_STATE.seo;
        seo.siteUrl = document.getElementById('seo-site-url').value;
        seo.pages.home.title = document.getElementById('seo-home-title').value;
        seo.pages.home.description = document.getElementById('seo-home-desc').value;
        seo.pages.home.keywords = document.getElementById('seo-home-keywords').value;

        await persistSeo(seo);
        window.showToast('SEO configurations saved!');
      });
    }
  }

  function attachCrmEvents() {
    // Search
    const searchInput = document.getElementById('crm-search-input');
    const statusFilter = document.getElementById('crm-status-filter');

    function applyFilter() {
      const q = (searchInput ? searchInput.value : '').toLowerCase();
      const st = statusFilter ? statusFilter.value : 'ALL';
      let filtered = window.CMS_STATE.enquiries;

      if (st !== 'ALL') {
        filtered = filtered.filter(e => e.status === st);
      }
      if (q) {
        filtered = filtered.filter(e =>
          e.companyName.toLowerCase().includes(q) ||
          e.fullName.toLowerCase().includes(q) ||
          e.country.toLowerCase().includes(q) ||
          e.productInterest.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q)
        );
      }

      const tbody = document.getElementById('crm-table-body');
      if (tbody) tbody.innerHTML = renderEnquiryRows(filtered);
      attachLeadClickEvents();
    }

    if (searchInput) searchInput.addEventListener('input', applyFilter);
    if (statusFilter) statusFilter.addEventListener('change', applyFilter);

    attachLeadClickEvents();

    // Export CSV
    const btnCsv = document.getElementById('btn-export-csv');
    if (btnCsv) {
      btnCsv.addEventListener('click', () => {
        const rows = [
          ['ID', 'Date', 'Company', 'Contact', 'Email', 'Phone', 'Country', 'Category', 'Volume', 'Status', 'Notes']
        ];
        window.CMS_STATE.enquiries.forEach(e => {
          rows.push([
            e.id,
            e.createdAt,
            `"${e.companyName}"`,
            `"${e.fullName}"`,
            e.businessEmail,
            e.phone || '',
            e.country,
            `"${e.productInterest}"`,
            `"${e.approximateVolume}"`,
            e.status,
            `"${(e.notes || '').replace(/"/g, '""')}"`
          ]);
        });
        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `sahu_global_buyer_leads_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.showToast('Enquiry CRM data exported to CSV.');
      });
    }
  }

  function attachLeadClickEvents() {
    document.querySelectorAll('.clickable-lead-row, .btn-view-lead').forEach(el => {
      el.addEventListener('click', (e) => {
        const id = el.getAttribute('data-id');
        openLeadModal(id);
      });
    });
  }

  function openLeadModal(id) {
    const lead = window.CMS_STATE.enquiries.find(e => e.id === id);
    if (!lead) return;

    const overlay = document.getElementById('lead-modal-overlay');
    const content = document.getElementById('lead-modal-content');
    if (!overlay || !content) return;

    content.innerHTML = `
      <div class="modal-header">
        <div>
          <span style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--royal-burgundy); font-weight: 700;">${lead.id} • ${new Date(lead.createdAt).toLocaleString()}</span>
          <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--text-title); margin-top: 0.25rem;">${lead.companyName}</h3>
        </div>
        <button class="modal-close-btn" id="modal-close-btn">&times;</button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.88rem;">
        <div>
          <span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase;">Contact Person</span>
          <div style="font-weight: 600; color: var(--text-title);">${lead.fullName}</div>
        </div>
        <div>
          <span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase;">Business Email</span>
          <div><a href="mailto:${lead.businessEmail}" style="color: var(--royal-burgundy); font-weight: 600;">${lead.businessEmail}</a></div>
        </div>
        <div>
          <span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase;">Country / Destination</span>
          <div style="color: var(--text-title);">${lead.country}</div>
        </div>
        <div>
          <span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase;">Product Interest</span>
          <div style="color: var(--text-title); font-weight: 500;">${lead.productInterest}</div>
        </div>
        <div>
          <span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase;">Approximate Volume</span>
          <div style="color: var(--text-title);">${lead.approximateVolume}</div>
        </div>
        <div>
          <span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase;">Target Delivery Window</span>
          <div style="color: var(--text-title);">${lead.targetDelivery || 'Immediate'}</div>
        </div>
      </div>

      <div>
        <span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase;">Buyer Project Message</span>
        <div style="background: var(--color-bg-alt); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); padding: 1rem; margin-top: 0.4rem; font-size: 0.92rem; color: var(--text-body); line-height: 1.6;">
          ${escapeHtml(lead.message || 'No additional project notes provided.')}
        </div>
      </div>

      ${lead.techPackFile ? `
        <div>
          <span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase;">Attached Tech Pack</span>
          <div style="margin-top: 0.4rem;">
            <a href="${lead.techPackFile}" target="_blank" class="btn btn-secondary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Download Tech Pack (${lead.techPackOriginalName || 'Specification File'})
            </a>
          </div>
        </div>
      ` : ''}

      <div style="border-top: 1px solid var(--border-subtle); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
        <div class="form-group">
          <label>Lead Status</label>
          <select id="modal-lead-status" class="form-control">
            <option value="New" ${lead.status === 'New' ? 'selected' : ''}>New</option>
            <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
            <option value="Sample Sent" ${lead.status === 'Sample Sent' ? 'selected' : ''}>Sample Sent</option>
            <option value="In Review" ${lead.status === 'In Review' ? 'selected' : ''}>In Review</option>
            <option value="Closed" ${lead.status === 'Closed' ? 'selected' : ''}>Closed</option>
          </select>
        </div>

        <div class="form-group">
          <label>Internal Merchandising Notes</label>
          <textarea id="modal-lead-notes" class="form-control" rows="3">${escapeHtml(lead.notes || '')}</textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem;">
          <button class="btn btn-secondary btn-sm" id="modal-btn-cancel">Close</button>
          <button class="btn btn-primary btn-sm" id="modal-btn-save-lead">Save Lead Updates</button>
        </div>
      </div>
    `;

    overlay.classList.add('open');

    // Modal Events
    const closeModal = () => overlay.classList.remove('open');
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    document.getElementById('modal-btn-cancel').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    document.getElementById('modal-btn-save-lead').addEventListener('click', async () => {
      const newStatus = document.getElementById('modal-lead-status').value;
      const newNotes = document.getElementById('modal-lead-notes').value;

      lead.status = newStatus;
      lead.notes = newNotes;

      await persistEnquiries(window.CMS_STATE.enquiries);

      try {
        await fetch(`/api/enquiries/${lead.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, notes: newNotes })
        });
      } catch (e) {}

      window.showToast(`Lead ${lead.id} updated to ${newStatus}`);
      closeModal();
      renderAdminApp();
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Public Exposure
  window.initCmsModule = async function () {
    await loadInitialData();
  };

  window.openAdminDashboard = function () {
    const adminRoot = document.getElementById('admin-app-root');
    if (adminRoot) {
      adminRoot.style.display = 'block';
      renderAdminApp();
    }
  };

  window.closeAdminDashboard = function () {
    const adminRoot = document.getElementById('admin-app-root');
    if (adminRoot) {
      adminRoot.style.display = 'none';
      adminRoot.innerHTML = '';
    }
    document.body.style.overflow = '';
  };

  // Global Escape key listener to immediately exit portal
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && (window.location.hash === '#admin' || (window.CMS_STATE && document.getElementById('admin-app-root')?.style.display !== 'none'))) {
      window.location.hash = '#home';
    }
  });

  window.addNewBuyerEnquiry = async function (enquiryData, file) {
    let resultId = `ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newEnq = {
      id: resultId,
      createdAt: new Date().toISOString(),
      fullName: enquiryData.fullName,
      companyName: enquiryData.companyName,
      businessEmail: enquiryData.businessEmail,
      phone: enquiryData.phone || '',
      country: enquiryData.country || 'International',
      productInterest: enquiryData.productInterest,
      approximateVolume: enquiryData.approximateVolume,
      targetDelivery: enquiryData.targetDelivery || 'Immediate',
      message: enquiryData.message,
      techPackFile: null,
      techPackOriginalName: file ? file.name : null,
      status: 'New',
      priority: 'High',
      notes: 'New buyer web enquiry received from portal.'
    };

    // If server is running, use FormData
    try {
      const fd = new FormData();
      Object.keys(enquiryData).forEach(k => fd.append(k, enquiryData[k]));
      if (file) fd.append('techPack', file);

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        body: fd
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          window.CMS_STATE.enquiries.unshift(json.data);
          persistEnquiries(window.CMS_STATE.enquiries);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('API error submitting enquiry, using local storage fallback:', e.message);
    }

    // Local fallback
    window.CMS_STATE.enquiries.unshift(newEnq);
    persistEnquiries(window.CMS_STATE.enquiries);
    return newEnq;
  };
})();
