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

  // 9. PHOTOREALISTIC 3D EARTH GLOBE (360° Rotating WebGL with Three.js)
  function initRotatingEarthGlobe() {
    const canvas = document.getElementById('earth-globe-canvas');
    if (!canvas) return;

    // Ensure THREE is loaded
    if (typeof THREE === 'undefined') {
      setTimeout(initRotatingEarthGlobe, 120);
      return;
    }

    const wrap = canvas.parentElement;
    const width = wrap.clientWidth || 560;
    const height = wrap.clientHeight || 560;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    if (renderer.toneMapping !== undefined) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
    }

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.2);

    // Group for 360-degree rotation and axial tilt
    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = THREE.MathUtils.degToRad(14); // Realistic Earth axial tilt
    scene.add(globeGroup);

    const GLOBE_RADIUS = 1.95;

    // Texture loading
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(
      'assets/earth-blue-marble.jpg',
      () => { renderer.render(scene, camera); },
      undefined,
      () => {
        earthTexture.image = textureLoader.load('assets/earth-dark.jpg');
      }
    );

    // Realistic Earth Sphere
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.08
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // Outer Atmospheric Fresnel Glow Layer
    const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.025, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x84986E,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Lat/Lon to 3D Cartesian coordinates
    function latLonToVector3(lat, lon, radius) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    }

    // Trade Hubs: Origin is Sahu Global Noida HQ
    const originHub = { lat: 28.6280, lon: 77.3789, name: 'India (Noida HQ)' };
    const destinationHubs = [
      { id: 'ny', lat: 40.7128, lon: -74.0060, name: 'New York, USA' },
      { id: 'ldn', lat: 51.5074, lon: -0.1278, name: 'London, UK' },
      { id: 'rdm', lat: 51.9244, lon: 4.4777, name: 'Rotterdam, EU' },
      { id: 'dxb', lat: 25.2048, lon: 55.2708, name: 'Dubai, UAE' },
      { id: 'tky', lat: 35.6762, lon: 139.6503, name: 'Tokyo, APAC' }
    ];

    // Origin Beacon at Noida / New Delhi
    const originPos = latLonToVector3(originHub.lat, originHub.lon, GLOBE_RADIUS);
    const originMarkerGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const originMarkerMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const originMarker = new THREE.Mesh(originMarkerGeo, originMarkerMat);
    originMarker.position.copy(originPos);
    globeGroup.add(originMarker);

    // Pulsing ring at Origin
    const originRingGeo = new THREE.RingGeometry(0.05, 0.09, 32);
    const originRingMat = new THREE.MeshBasicMaterial({
      color: 0xBD9057,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const originRing = new THREE.Mesh(originRingGeo, originRingMat);
    originRing.position.copy(originPos.clone().multiplyScalar(1.002));
    originRing.lookAt(originPos.clone().multiplyScalar(2));
    globeGroup.add(originRing);

    // Corridors & Animated Photon Particles
    const corridors = [];
    const photonParticles = [];

    destinationHubs.forEach(dest => {
      const destPos = latLonToVector3(dest.lat, dest.lon, GLOBE_RADIUS);

      // Destination Pin Marker
      const pinGeo = new THREE.SphereGeometry(0.035, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0x84986E });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(destPos);
      globeGroup.add(pinMesh);

      // Destination Glow Ring
      const pinRingGeo = new THREE.RingGeometry(0.04, 0.07, 24);
      const pinRingMat = new THREE.MeshBasicMaterial({
        color: 0x84986E,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const pinRing = new THREE.Mesh(pinRingGeo, pinRingMat);
      pinRing.position.copy(destPos.clone().multiplyScalar(1.002));
      pinRing.lookAt(destPos.clone().multiplyScalar(2));
      globeGroup.add(pinRing);

      // 3D Parabolic Great-Circle Arc
      const distance = originPos.distanceTo(destPos);
      const altitude = GLOBE_RADIUS + Math.min(distance * 0.38, 0.95);
      const midPoint = originPos.clone().add(destPos).multiplyScalar(0.5).normalize().multiplyScalar(altitude);
      const curve = new THREE.QuadraticBezierCurve3(originPos, midPoint, destPos);

      // Glowing Arc Tube
      const tubeGeo = new THREE.TubeGeometry(curve, 44, 0.009, 6, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0xBD9057,
        transparent: true,
        opacity: 0.65
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      globeGroup.add(tubeMesh);

      // Photon packet traveling along the curve
      const photonGeo = new THREE.SphereGeometry(0.032, 12, 12);
      const photonMat = new THREE.MeshBasicMaterial({ color: 0xFFFAF0 });
      const photon = new THREE.Mesh(photonGeo, photonMat);
      globeGroup.add(photon);

      photonParticles.push({
        photon: photon,
        curve: curve,
        progress: Math.random(),
        speed: 0.0045 + Math.random() * 0.002
      });

      corridors.push({
        id: dest.id,
        destPos: destPos,
        tagEl: document.querySelector('.tag-' + dest.id)
      });
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.92);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFFDF5, 1.15);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x84986E, 0.55);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    // 360-Degree Continuous Rotation & Interactive Drag Controls
    let autoRotate = true;
    let autoSpeed = 0.0025; // Smooth continuous 360° spin
    let isPointerDown = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let pointerVelocityX = 0;
    let pointerVelocityY = 0;

    canvas.addEventListener('pointerdown', (e) => {
      isPointerDown = true;
      autoRotate = false;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      pointerVelocityX = 0;
      pointerVelocityY = 0;
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!isPointerDown) return;
      const deltaX = e.clientX - prevPointerX;
      const deltaY = e.clientY - prevPointerY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;

      globeGroup.rotation.y += deltaX * 0.0055;
      globeGroup.rotation.x += deltaY * 0.0055;
      globeGroup.rotation.x = Math.max(-0.65, Math.min(0.65, globeGroup.rotation.x));

      pointerVelocityX = deltaX * 0.0055;
      pointerVelocityY = deltaY * 0.0055;
    });

    const onPointerUp = (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch(err) {}
      setTimeout(() => {
        if (!isPointerDown) autoRotate = true;
      }, 1500);
    };

    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      const w = wrap.clientWidth || 560;
      const h = wrap.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(wrap);

    // Animation Render Loop
    let pulseTime = 0;
    function animate() {
      requestAnimationFrame(animate);

      pulseTime += 0.04;
      const ringScale = 1 + Math.sin(pulseTime) * 0.25;
      originRing.scale.set(ringScale, ringScale, 1);
      originRing.material.opacity = 0.5 + Math.cos(pulseTime) * 0.3;

      // 360-degree rotation
      if (autoRotate) {
        globeGroup.rotation.y += autoSpeed;
      } else if (!isPointerDown) {
        globeGroup.rotation.y += pointerVelocityX;
        globeGroup.rotation.x += pointerVelocityY;
        pointerVelocityX *= 0.94;
        pointerVelocityY *= 0.94;
      }

      // Animate photon particles along trade arcs
      photonParticles.forEach(p => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;
        const pt = p.curve.getPointAt(p.progress);
        p.photon.position.copy(pt);
      });

      // Update 2D Floating Tag Callouts according to 3D orientation
      corridors.forEach(c => {
        if (!c.tagEl) return;
        const worldPos = c.destPos.clone().applyMatrix4(globeGroup.matrixWorld);
        const screenPos = worldPos.clone().project(camera);
        const isFacing = screenPos.z < 1 && worldPos.z > 0;
        c.tagEl.style.opacity = isFacing ? '1' : '0.4';
      });

      renderer.render(scene, camera);
    }

    animate();
  }

  // INNOVATION PARADIGM STEP CONTROLLER (Zero Empty Space, Auto-Cycle & Interactive Tabs)
  function initMorphStepController() {
    const stage2 = document.querySelector('.sg-morph-band');
    if (!stage2) return;

    const steps = stage2.querySelectorAll('.morph-step');
    const cards = stage2.querySelectorAll('.sg-morph-card');
    const btns = stage2.querySelectorAll('.morph-progress-step');
    if (!steps.length) return;

    let currentIdx = 0;
    let timer = null;
    const totalSteps = steps.length;
    const duration = 4500; // 4.5s auto-progression

    function setPhase(idx) {
      currentIdx = idx;
      steps.forEach((el, i) => el.classList.toggle('active', i === idx));
      cards.forEach((el, i) => el.classList.toggle('active', i === idx));
      btns.forEach((el, i) => el.classList.toggle('active', i === idx));
    }

    function startCycle() {
      stopCycle();
      timer = setInterval(() => {
        setPhase((currentIdx + 1) % totalSteps);
      }, duration);
    }

    function stopCycle() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    // Direct click on any tab button
    btns.forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        setPhase(idx);
        startCycle();
      });
    });

    // Pause on hover
    stage2.addEventListener('mouseenter', stopCycle);
    stage2.addEventListener('mouseleave', startCycle);

    // Initial phase
    setPhase(0);
    startCycle();
  }

  // Initialize all on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initAdvancedCursor();
    initHeroTilt();
    initMagneticButtons();
    initCinematicScroll();
    initMorphStepController();
    initScrollReveals();
    initManufacturingJourney();
    initEstimator();
    initHeaderScroll();
    initRotatingEarthGlobe();
  });

  window.initMotionModules = function () {
    initScrollReveals();
    initMagneticButtons();
    initMorphStepController();
    initManufacturingJourney();
    initRotatingEarthGlobe();
  };
})();
