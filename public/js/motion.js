/**
 * SAHU GLOBAL PRIVATE LIMITED — BESPOKE MOTION & INTERACTION ENGINE
 * Human-Crafted Luxury • Silky Cursor Lerp • 3D Tilt • Cinematic Scroll Storytelling
 * Zero Artifact Lines • Zero Blurry Particle Trails
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = x => x * x * (3 - 2 * x);

  // 1. REFINED LUXURY CURSOR (Dot, Ring, Dynamic Label)
  function initAdvancedCursor() {
    if (!isFinePointer || prefersReducedMotion) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    const label = document.querySelector('.cursor-label');

    if (!dot || !ring || !label) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;

      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      label.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    window.addEventListener('mousedown', () => {
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(0.85)`;
    });

    window.addEventListener('mouseup', () => {
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(1)`;
    });

    function renderCursorFrame() {
      // Butter-smooth lerp for the outer ring
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursorFrame);
    }
    requestAnimationFrame(renderCursorFrame);

    // Context Hover Events
    function attachCursorContextEvents() {
      document.querySelectorAll('a, button, .btn, .journey-step-btn, .capability-card, .cat-showcase-card, .dark-cap-card, input, select, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-hover');
          const customLabel = el.getAttribute('data-cursor');
          if (customLabel) {
            label.textContent = customLabel;
            document.body.classList.add('cursor-has-label');
          }
        });
        el.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-hover');
          document.body.classList.remove('cursor-has-label');
          label.textContent = '';
        });
      });
    }

    attachCursorContextEvents();
    window.refreshCursorListeners = attachCursorContextEvents;
  }

  // 2. HERO IMAGE 3D PERSPECTIVE TILT
  function initHeroTilt() {
    const heroCard = document.querySelector('.hero-tilt-target');
    if (!heroCard || !isFinePointer || prefersReducedMotion) return;

    window.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = (e.clientX - centerX) / (window.innerWidth / 2);
      const distY = (e.clientY - centerY) / (window.innerHeight / 2);

      heroCard.style.transform = `rotateY(${distX * 8}deg) rotateX(${-distY * 8}deg)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  // 3. MAGNETIC BUTTONS
  function initMagneticButtons() {
    if (!isFinePointer || prefersReducedMotion) return;

    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // 4. CINEMATIC STICKY SCROLL STORYTELLING LOOPS (Stage 1, Stage 2, Stage 3)
  function initCinematicScroll() {
    if (prefersReducedMotion) return;

    let y = window.scrollY;
    let cur = y;

    function scrollRenderLoop() {
      y = window.scrollY;
      cur += (y - cur) * 0.1;

      const vh = window.innerHeight;

      // STAGE 1: "THE ART OF APPAREL MANUFACTURING"
      const stage1 = document.querySelector('.sg-scroll-stage');
      const s1Img = document.querySelector('.sg-scroll-bg-image');
      const s1Title = document.querySelector('.sg-scroll-title');
      const s1Sub = document.querySelector('.sg-scroll-sub');

      if (stage1 && s1Img && s1Title && s1Sub) {
        const p = clamp((cur - stage1.offsetTop) / (stage1.offsetHeight - vh));
        const q = ease(p);

        s1Img.style.transform = `scale(${1.02 + q * 0.25}) translate3d(0, ${(p - 0.5) * -20}px, 0)`;
        s1Img.style.clipPath = `inset(${p * 6}% ${p * 4}% ${p * 6}% ${p * 4}% round ${p * 16}px)`;

        s1Title.style.transform = `translate3d(0, ${-p * 120}px, 0) scale(${1 + p * 0.35})`;
        s1Title.style.opacity = 1 - p * 0.85;

        s1Sub.style.transform = `translate3d(0, ${-p * 50}px, 0)`;
        s1Sub.style.opacity = 1 - p * 1.1;
      }

      // STAGE 2: MORPH BAND ("ENGINEERED FROM FIBER TO FIT")
      const stage2 = document.querySelector('.sg-morph-band');
      const marquee = document.querySelector('.sg-morph-marquee');
      const morphCard = document.querySelector('.sg-morph-card');

      if (stage2) {
        const p = clamp((cur - stage2.offsetTop) / (stage2.offsetHeight - vh));
        const q = ease(p);

        if (marquee) {
          marquee.style.transform = `translate3d(${-p * 35}vw, -50%, 0)`;
        }

        document.querySelectorAll('.sg-morph-copy .line').forEach((line, idx) => {
          const z = clamp(p * 1.6 - idx * 0.2);
          const lineEase = ease(z);
          line.style.transform = `translate3d(${(1 - lineEase) * (-60 + idx * 15)}px, ${(1 - lineEase) * (40 - idx * 10)}px, 0)`;
          line.style.opacity = clamp(z * 1.8);
        });

        if (morphCard) {
          morphCard.style.transform = `scale(${0.94 + q * 0.12})`;
          morphCard.style.clipPath = `inset(${(1 - q) * 4}% round ${(1 - q) * 16}px)`;
        }
      }

      requestAnimationFrame(scrollRenderLoop);
    }
    requestAnimationFrame(scrollRenderLoop);
  }

  // 5. SCROLL REVEALS
  function initScrollReveals() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
  }

  // 6. MANUFACTURING JOURNEY SWITCHER
  function initManufacturingJourney() {
    const stepBtns = document.querySelectorAll('.journey-step-btn');
    const viewerImg = document.getElementById('journey-current-img');
    const leadBadge = document.getElementById('journey-lead-badge');
    const specsContainer = document.getElementById('journey-specs-container');

    if (!stepBtns.length || !viewerImg) return;

    stepBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        stepBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const imgUrl = btn.getAttribute('data-img');
        const lead = btn.getAttribute('data-lead');
        const rawSpecs = btn.getAttribute('data-specs');

        if (imgUrl) {
          viewerImg.style.opacity = '0.3';
          setTimeout(() => {
            viewerImg.src = imgUrl;
            viewerImg.style.opacity = '1';
          }, 140);
        }
        if (lead && leadBadge) leadBadge.textContent = lead;
        if (rawSpecs && specsContainer) {
          try {
            const specs = JSON.parse(rawSpecs);
            specsContainer.innerHTML = specs.map(s => `<span class="journey-spec-tag">${s}</span>`).join('');
          } catch (e) {}
        }
      });
    });
  }

  // 7. B2B FEASIBILITY ESTIMATOR
  function initEstimator() {
    const categorySelect = document.getElementById('est-category');
    const volumeSlider = document.getElementById('est-volume');
    const volumeVal = document.getElementById('est-volume-val');
    const fabricSelect = document.getElementById('est-fabric');

    const resSampling = document.getElementById('est-res-sampling');
    const resBulk = document.getElementById('est-res-bulk');
    const resAql = document.getElementById('est-res-aql');
    const resFob = document.getElementById('est-res-fob');
    const btnPrefill = document.getElementById('est-btn-prefill');

    if (!categorySelect || !volumeSlider) return;

    function recalculate() {
      const cat = categorySelect.value;
      const vol = parseInt(volumeSlider.value, 10);
      volumeVal.textContent = vol.toLocaleString() + ' pcs';

      let sampleDays = '5–7 Days (Clo3D: 48h)';
      let bulkDays = '45–55 Days';
      let aql = 'AQL 1.5 Level II (Critical: 0, Major: 1.5)';
      let fobPort = 'Nhava Sheva / Mundra / Delhi Air Cargo';

      if (vol < 1000) {
        bulkDays = '35–45 Days';
        aql = 'AQL 2.5 Standard';
      } else if (vol > 8000) {
        bulkDays = '60–75 Days (Phased Dispatch)';
        aql = 'AQL 1.5 Level II + 100% Inline Audit';
      }

      if (cat.includes('activewear')) {
        sampleDays = '7–10 Days (Technical Stretch)';
      }

      if (resSampling) resSampling.textContent = sampleDays;
      if (resBulk) resBulk.textContent = bulkDays;
      if (resAql) resAql.textContent = aql;
      if (resFob) resFob.textContent = fobPort;
    }

    categorySelect.addEventListener('change', recalculate);
    volumeSlider.addEventListener('input', recalculate);
    if (fabricSelect) fabricSelect.addEventListener('change', recalculate);
    recalculate();

    if (btnPrefill) {
      btnPrefill.addEventListener('click', () => {
        const cat = categorySelect.value;
        const vol = volumeSlider.value;
        window.location.hash = '#contact';

        setTimeout(() => {
          const productSelect = document.getElementById('enq-product');
          const volSelect = document.getElementById('enq-volume');
          const msgBox = document.getElementById('enq-message');

          if (productSelect) productSelect.value = cat;
          if (volSelect) {
            if (vol < 2500) volSelect.value = '1,000 – 2,500 units';
            else if (vol < 5000) volSelect.value = '2,500 – 5,000 units';
            else if (vol < 10000) volSelect.value = '5,000 – 10,000 units';
            else volSelect.value = '10,000+ units';
          }
          if (msgBox) {
            msgBox.value = `Feasibility Request from Estimator:\nCategory: ${cat}\nEstimated Volume: ${vol} pcs\nPlease provide formal FOB costing and sample turnaround.`;
          }
          if (window.showToast) {
            window.showToast('Production specifications pre-filled into Buyer Enquiry!');
          }
        }, 100);
      });
    }
  }

  // 8. STICKY HEADER
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 9. ROTATING 3D EARTH GLOBE ANIMATION (Worldwide Apparel Exports)
  function initRotatingEarthGlobe() {
    const canvas = document.getElementById('earth-globe-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 560;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const R = 210; // Globe radius
    const tilt = 0.26; // Earth axial tilt (~15 degrees)

    let rotation = 0; // Current longitude rotation in radians
    let isDragging = false;
    let startX = 0;
    let dragVelocity = 0;

    // Major global trade hub coordinates: [lat, lon, name, code]
    const hubs = [
      { lat: 28.6139, lon: 77.2090, name: 'India (New Delhi NCR)', isOrigin: true },
      { lat: 40.7128, lon: -74.0060, name: 'New York (USA)', isOrigin: false },
      { lat: 51.5074, lon: -0.1278, name: 'London (UK)', isOrigin: false },
      { lat: 51.9244, lon: 4.4777, name: 'Rotterdam (EU)', isOrigin: false },
      { lat: 25.2048, lon: 55.2708, name: 'Dubai (UAE)', isOrigin: false },
      { lat: 35.6762, lon: 139.6503, name: 'Tokyo (APAC)', isOrigin: false }
    ];

    // Simplified Continent Polygons (lat/lon coordinates)
    const continents = [
      // North America
      [
        [65, -145], [70, -120], [60, -80], [52, -58], [42, -68],
        [30, -82], [24, -80], [18, -96], [15, -90], [28, -112],
        [38, -122], [48, -125], [58, -140], [65, -145]
      ],
      // South America
      [
        [10, -75], [6, -52], [-10, -36], [-22, -42], [-35, -55],
        [-52, -68], [-42, -74], [-18, -72], [-4, -80], [10, -75]
      ],
      // Europe
      [
        [70, 25], [62, 32], [55, 20], [45, 12], [36, -5],
        [44, -1], [50, 4], [58, 6], [68, 14], [70, 25]
      ],
      // Africa
      [
        [36, -5], [37, 10], [32, 32], [12, 44], [-4, 40],
        [-25, 32], [-34, 18], [-20, 12], [5, 8], [12, -16],
        [28, -12], [36, -5]
      ],
      // Asia & India
      [
        [70, 80], [60, 140], [40, 140], [35, 120], [22, 115],
        [15, 105], [22, 88], [8, 77], [22, 69], [25, 60],
        [30, 48], [40, 50], [55, 60], [65, 75], [70, 80]
      ],
      // Australia
      [
        [-12, 132], [-16, 146], [-28, 153], [-38, 145],
        [-35, 118], [-22, 114], [-12, 132]
      ]
    ];

    // Mouse drag handlers
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      dragVelocity = 0;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      startX = e.clientX;
      rotation += dx * 0.006;
      dragVelocity = dx * 0.006;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support for mobile
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        dragVelocity = 0;
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      startX = e.touches[0].clientX;
      rotation += dx * 0.006;
      dragVelocity = dx * 0.006;
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // 3D Spherical Coordinate Projection
    function project(latDeg, lonDeg) {
      const lat = (latDeg * Math.PI) / 180;
      const lon = (lonDeg * Math.PI) / 180 + rotation;

      const x3 = R * Math.cos(lat) * Math.sin(lon);
      const y3 = R * Math.sin(lat);
      const z3 = R * Math.cos(lat) * Math.cos(lon);

      // Apply axial tilt
      const yTilted = y3 * Math.cos(tilt) - z3 * Math.sin(tilt);
      const zTilted = y3 * Math.sin(tilt) + z3 * Math.cos(tilt);

      return {
        x: cx + x3,
        y: cy - yTilted,
        z: zTilted,
        visible: zTilted > 0
      };
    }

    let pulseStep = 0;

    function renderGlobe() {
      ctx.clearRect(0, 0, size, size);

      if (!isDragging) {
        dragVelocity *= 0.94;
        rotation += 0.005 + dragVelocity;
      }
      pulseStep += 0.035;

      // 1. Base Dark Luxury Sphere
      const sphereGrad = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.1, cx, cy, R);
      sphereGrad.addColorStop(0, '#2C221F');
      sphereGrad.addColorStop(0.7, '#1E1715');
      sphereGrad.addColorStop(1, '#120D0C');

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // Outer metallic antique gold ring
      ctx.strokeStyle = 'rgba(189, 144, 87, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 2. Latitude Parallels
      ctx.strokeStyle = 'rgba(163, 119, 69, 0.18)';
      ctx.lineWidth = 1;
      [-60, -30, 0, 30, 60].forEach(lat => {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 5) {
          const pt = project(lat, lon);
          if (pt.visible) {
            if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
            else ctx.lineTo(pt.x, pt.y);
          } else {
            started = false;
          }
        }
        ctx.stroke();
      });

      // 3. Longitude Meridians
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -80; lat <= 80; lat += 4) {
          const pt = project(lat, lon);
          if (pt.visible) {
            if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
            else ctx.lineTo(pt.x, pt.y);
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // 4. Rotating Continent Polygons
      continents.forEach(poly => {
        ctx.beginPath();
        let anyVisible = false;
        let started = false;

        poly.forEach(([lat, lon]) => {
          const pt = project(lat, lon);
          if (pt.visible) {
            anyVisible = true;
            if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
            else ctx.lineTo(pt.x, pt.y);
          } else {
            started = false;
          }
        });

        if (anyVisible) {
          ctx.fillStyle = 'rgba(189, 144, 87, 0.24)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(189, 144, 87, 0.6)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      // 5. Export Shipping Arcs from India
      const origin = project(hubs[0].lat, hubs[0].lon);

      hubs.slice(1).forEach((destHub, idx) => {
        const dest = project(destHub.lat, destHub.lon);

        if (origin.visible || dest.visible) {
          const midX = (origin.x + dest.x) / 2;
          const midY = (origin.y + dest.y) / 2 - 36;

          ctx.beginPath();
          ctx.moveTo(origin.x, origin.y);
          ctx.quadraticCurveTo(midX, midY, dest.x, dest.y);
          ctx.strokeStyle = 'rgba(189, 144, 87, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Moving export shipment photon
          const t = ((pulseStep + idx * 0.25) % 1);
          const px = (1 - t) * (1 - t) * origin.x + 2 * (1 - t) * t * midX + t * t * dest.x;
          const py = (1 - t) * (1 - t) * origin.y + 2 * (1 - t) * t * midY + t * t * dest.y;

          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        }
      });

      // 6. Global Trade Hubs
      hubs.forEach(hub => {
        const pt = project(hub.lat, hub.lon);
        if (!pt.visible) return;

        if (hub.isOrigin) {
          // India Origin Beacon (Imperial Burgundy & Radiant Gold)
          const ringRad = 7 + (Math.sin(pulseStep * 3) + 1) * 5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, ringRad, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(189, 144, 87, 0.85)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 5.5, 0, Math.PI * 2);
          ctx.fillStyle = '#5C1324';
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          // Destination Hubs
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#BD9057';
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      requestAnimationFrame(renderGlobe);
    }

    requestAnimationFrame(renderGlobe);
  }

  // Initialize all on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initAdvancedCursor();
    initHeroTilt();
    initMagneticButtons();
    initCinematicScroll();
    initScrollReveals();
    initManufacturingJourney();
    initEstimator();
    initHeaderScroll();
    initRotatingEarthGlobe();
  });

  window.initMotionModules = function () {
    initScrollReveals();
    initMagneticButtons();
    initManufacturingJourney();
    initRotatingEarthGlobe();
  };
})();
