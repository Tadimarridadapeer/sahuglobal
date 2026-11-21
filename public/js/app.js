/**
 * SAHU GLOBAL — CLIENT-SIDE APPLICATION & ROUTER
 * Handles page views, dynamic content rendering, form submission, and route changes
 */

(function () {
  'use strict';

  // Available routes
  const VALID_ROUTES = [
    'home',
    'about',
    'global-presence',
    'capabilities',
    'facilities',
    'product-development',
    'quality-compliance',
    'design-innovation',
    'products',
    'category-womenswear',
    'category-menswear',
    'category-kidswear',
    'category-activewear',
    'sustainability',
    'certifications',
    'insights',
    'careers',
    'contact',
    'privacy',
    'terms',
    'cookies',
    'thank-you',
    'admin'
  ];

  let currentRoute = 'home';

  // 1. Router Navigation
  function navigateTo(route) {
    if (!VALID_ROUTES.includes(route)) {
      route = 'home';
    }
    currentRoute = route;

    // Handle Admin view
    if (route === 'admin') {
      if (window.openAdminDashboard) window.openAdminDashboard();
      document.body.style.overflow = 'hidden';
      return;
    } else {
      if (window.closeAdminDashboard) window.closeAdminDashboard();
      document.body.style.overflow = 'auto';
    }

    // Hide all page containers
    document.querySelectorAll('.page-view-container').forEach(el => {
      el.classList.remove('active-page');
    });

    // Show active page container
    const targetPage = document.getElementById(`page-${route}`);
    if (targetPage) {
      targetPage.classList.add('active-page');
    } else {
      // If no standalone page element, fallback to home
      const homePage = document.getElementById('page-home');
      if (homePage) homePage.classList.add('active-page');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update Nav Active State
    document.querySelectorAll('.nav-link, .dropdown-link, .drawer-nav-list a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${route}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close Mobile Drawer if open
    closeMobileDrawer();

    // Update SEO Meta
    updateSeoForRoute(route);

    // Re-trigger scroll reveals
    setTimeout(() => {
      if (window.initMotionModules) window.initMotionModules();
      if (window.refreshCursorListeners) window.refreshCursorListeners();
    }, 50);
  }

  // Update Document Meta for SEO
  function updateSeoForRoute(route) {
    if (!window.CMS_STATE || !window.CMS_STATE.seo) return;
    const pages = window.CMS_STATE.seo.pages;
    const pageSeo = pages[route] || pages.home;

    if (pageSeo) {
      document.title = pageSeo.title;
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) descMeta.setAttribute('content', pageSeo.description);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', pageSeo.title);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', pageSeo.description);
    }
  }

  // 2. Hash Change Listener
  function handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash);
  }

  // 3. Dynamic Content Rendering from CMS State
  function renderPublicContent() {
    if (!window.CMS_STATE || !window.CMS_STATE.content) return;
    const c = window.CMS_STATE.content;

    // Hero Section
    const elHeroEyebrow = document.getElementById('dyn-hero-eyebrow');
    const elHeroHeadline = document.getElementById('dyn-hero-headline');
    const elHeroSubheadline = document.getElementById('dyn-hero-subheadline');
    const elHeroCTA = document.getElementById('dyn-hero-cta');
    const elHeroImg = document.getElementById('dyn-hero-img');

    if (elHeroEyebrow) elHeroEyebrow.textContent = c.home.hero.eyebrow;
    if (elHeroHeadline) elHeroHeadline.innerHTML = c.home.hero.headline;
    if (elHeroSubheadline) elHeroSubheadline.textContent = c.home.hero.subheadline;
    if (elHeroCTA) {
      const span = elHeroCTA.querySelector('span');
      if (span) span.textContent = c.home.hero.primaryCTA;
      else elHeroCTA.textContent = c.home.hero.primaryCTA;
    }
    if (elHeroImg && c.home.hero.heroImage) elHeroImg.src = c.home.hero.heroImage;

    // Company Taglines
    document.querySelectorAll('.dyn-brand-tagline').forEach(el => {
      el.textContent = c.company.tagline;
    });
    document.querySelectorAll('.dyn-company-phone').forEach(el => {
      el.textContent = c.company.phone;
    });
    document.querySelectorAll('.dyn-company-email').forEach(el => {
      el.textContent = c.company.email;
      if (el.tagName === 'A') el.href = `mailto:${c.company.email}`;
    });
    document.querySelectorAll('.dyn-company-address').forEach(el => {
      el.textContent = c.company.address;
    });
  }

  // 4. Buyer Enquiry Form Submission
  function initEnquiryForm() {
    const form = document.getElementById('buyer-enquiry-form');
    const fileInput = document.getElementById('enq-techpack');
    const fileNameDisplay = document.getElementById('file-chosen-name');

    if (fileInput && fileNameDisplay) {
      fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
          fileNameDisplay.textContent = `Selected: ${fileInput.files[0].name} (${(fileInput.files[0].size / 1024 / 1024).toFixed(2)} MB)`;
        } else {
          fileNameDisplay.textContent = '';
        }
      });
    }

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnSubmit = form.querySelector('button[type="submit"]');
      const originalBtnText = btnSubmit.innerHTML;

      // Extract form fields
      const fullName = document.getElementById('enq-name').value;
      const companyName = document.getElementById('enq-company').value;
      const businessEmail = document.getElementById('enq-email').value;
      const phone = document.getElementById('enq-phone').value;
      const country = document.getElementById('enq-country').value;
      const productInterest = document.getElementById('enq-product').value;
      const approximateVolume = document.getElementById('enq-volume').value;
      const message = document.getElementById('enq-message').value;
      const consent = document.getElementById('enq-consent').checked;
      const honeypot = document.getElementById('enq-hp') ? document.getElementById('enq-hp').value : '';

      if (!consent) {
        alert('Please accept the verification terms and privacy consent.');
        return;
      }

      // Show submitting state
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Securing & Submitting Enquiry...</span>
      `;

      try {
        const file = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;
        const newLead = await window.addNewBuyerEnquiry({
          fullName,
          companyName,
          businessEmail,
          phone,
          country,
          productInterest,
          approximateVolume,
          message,
          honeypot
        }, file);

        // Update Thank-you page details
        const confirmName = document.getElementById('confirm-lead-company');
        const confirmId = document.getElementById('confirm-lead-id');
        if (confirmName) confirmName.textContent = companyName;
        if (confirmId) confirmId.textContent = newLead.id;

        form.reset();
        if (fileNameDisplay) fileNameDisplay.textContent = '';

        if (window.showToast) {
          window.showToast(`Enquiry ${newLead.id} logged. Redirecting...`);
        }

        setTimeout(() => {
          window.location.hash = '#thank-you';
        }, 600);
      } catch (err) {
        alert('An error occurred submitting your enquiry. Please email procurement@sahuglobal.com directly.');
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalBtnText;
      }
    });
  }

  // 5. Mobile Drawer Toggle Handlers
  function initMobileDrawer() {
    const toggleBtn = document.getElementById('menu-toggle-btn');
    const closeBtn = document.getElementById('drawer-close-btn');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');

    if (toggleBtn && drawer && backdrop) {
      toggleBtn.addEventListener('click', () => {
        drawer.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeBtn && drawer && backdrop) {
      closeBtn.addEventListener('click', closeMobileDrawer);
      backdrop.addEventListener('click', closeMobileDrawer);
    }
  }

  function closeMobileDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    if (currentRoute !== 'admin') {
      document.body.style.overflow = 'auto';
    }
  }

  // 6. Bootstrap Application
  document.addEventListener('DOMContentLoaded', async () => {
    // Initialize CMS Module & Data
    if (window.initCmsModule) {
      await window.initCmsModule();
    }

    // Render Initial Dynamic Data
    renderPublicContent();

    // Listen to updates from CMS
    window.addEventListener('sahu:content-updated', () => {
      renderPublicContent();
    });

    // Form and Navigation
    initEnquiryForm();
    initMobileDrawer();

    // Handle Route
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
  });
})();
