/**
 * Sahu Global - Realistic Global Export & Maritime Logistics Map
 * Built with Leaflet.js, Carto Voyager & Esri Photorealistic Satellite Imagery.
 * Developed for Sahu Global Private Limited by CrossMotive Services.
 */

(function () {
  'use strict';

  function initRealisticMap() {
    const mapContainer = document.getElementById('realistic-trade-map');
    if (!mapContainer || typeof L === 'undefined') return;

    // Origin: Sahu Global Manufacturing Hub & Nhava Sheva (JNPT) / Delhi
    const originCoords = [18.95, 72.95]; // Nhava Sheva Port, India
    const delhiCoords = [28.6139, 77.2090]; // Delhi NCR Manufacturing Units

    // Global Destination Hub Ports
    const destinations = [
      {
        id: 'usa-east',
        region: 'NORTH AMERICA',
        name: 'Port of New York & New Jersey',
        country: 'United States',
        locode: 'USNYC',
        coords: [40.684, -74.024],
        seaLead: '22–26 Days',
        airLead: '3–5 Days (JFK Cargo)',
        categories: 'Tailored Suits, Fluid Wovens, Premium Outerwear',
        volume: '45,000+ pcs/month',
        customs: 'C-TPAT Verified Direct Entry',
        waypoints: [
          [18.95, 72.95],
          [12.5, 52.0],
          [27.8, 34.2],
          [31.2, 32.3], // Suez Canal
          [36.5, 14.5], // Mediterranean
          [36.0, -5.5], // Gibraltar
          [38.0, -35.0],
          [40.684, -74.024] // NYC
        ]
      },
      {
        id: 'usa-west',
        region: 'NORTH AMERICA',
        name: 'Port of Los Angeles / Long Beach',
        country: 'United States',
        locode: 'USLAX',
        coords: [33.743, -118.267],
        seaLead: '26–30 Days',
        airLead: '4–5 Days (LAX Cargo)',
        categories: 'Performance Activewear, Denim & Casuals',
        volume: '30,000+ pcs/month',
        customs: 'US Customs Automated Broker Interface',
        waypoints: [
          [18.95, 72.95],
          [5.9, 80.5], // Sri Lanka
          [1.2, 103.8], // Malacca
          [12.0, 114.0],
          [20.0, 130.0],
          [30.0, 160.0],
          [32.0, -160.0],
          [33.743, -118.267] // LAX
        ]
      },
      {
        id: 'uk',
        region: 'UNITED KINGDOM',
        name: 'Port of London & Southampton',
        country: 'United Kingdom',
        locode: 'GBLON / GBSOU',
        coords: [51.507, -0.128],
        seaLead: '20–24 Days',
        airLead: '3–4 Days (LHR Heathrow)',
        categories: 'Womenswear Dresses, Formal Shirts, Kidswear',
        volume: '55,000+ pcs/month',
        customs: 'HMRC CDS Simplified Declaration',
        waypoints: [
          [18.95, 72.95],
          [12.5, 52.0],
          [27.8, 34.2],
          [31.2, 32.3], // Suez
          [36.5, 14.5], // Mediterranean
          [36.0, -5.5], // Gibraltar
          [48.5, -5.0], // Bay of Biscay
          [50.9, -1.4], // Southampton
          [51.507, -0.128] // London
        ]
      },
      {
        id: 'eu-rotterdam',
        region: 'EUROPEAN UNION',
        name: 'Port of Rotterdam',
        country: 'Netherlands / EU Hub',
        locode: 'NLRTM',
        coords: [51.905, 4.466],
        seaLead: '18–22 Days',
        airLead: '3–4 Days (AMS Schiphol)',
        categories: 'Sustainable GOTS Cottons, Flax Linen, Outerwear',
        volume: '60,000+ pcs/month',
        customs: 'EU REACH Compliance, Bonded Hub Storage',
        waypoints: [
          [18.95, 72.95],
          [12.5, 52.0],
          [27.8, 34.2],
          [31.2, 32.3], // Suez
          [36.5, 14.5],
          [36.0, -5.5],
          [48.5, -5.0],
          [51.905, 4.466] // Rotterdam
        ]
      },
      {
        id: 'eu-hamburg',
        region: 'EUROPEAN UNION',
        name: 'Port of Hamburg',
        country: 'Germany',
        locode: 'DEHAM',
        coords: [53.532, 9.967],
        seaLead: '20–24 Days',
        airLead: '3–4 Days (FRA Cargo)',
        categories: 'Organic Kidswear, Technical Blazers',
        volume: '35,000+ pcs/month',
        customs: 'German Zoll Direct Clearance',
        waypoints: [
          [18.95, 72.95],
          [12.5, 52.0],
          [27.8, 34.2],
          [31.2, 32.3],
          [36.5, 14.5],
          [36.0, -5.5],
          [48.5, -5.0],
          [51.9, 4.5],
          [53.532, 9.967]
        ]
      },
      {
        id: 'uae',
        region: 'MIDDLE EAST',
        name: 'Jebel Ali Port / Dubai',
        country: 'United Arab Emirates',
        locode: 'AEDXB',
        coords: [25.011, 55.061],
        seaLead: '5–8 Days',
        airLead: '1–2 Days (DXB DWC)',
        categories: 'Fast-Fashion Drops, Hospitality Uniforms',
        volume: '25,000+ pcs/month',
        customs: 'Dubai Customs Fast-Track GCC Corridor',
        waypoints: [
          [18.95, 72.95],
          [22.5, 65.0],
          [24.5, 59.0],
          [25.011, 55.061]
        ]
      },
      {
        id: 'australia',
        region: 'OCEANIA',
        name: 'Port of Melbourne & Sydney',
        country: 'Australia',
        locode: 'AUMEL',
        coords: [-37.813, 144.963],
        seaLead: '18–22 Days',
        airLead: '3–4 Days (SYD Cargo)',
        categories: 'Resortwear, Organic Cottons, Shirting',
        volume: '20,000+ pcs/month',
        customs: 'Australian Biosecurity Compliant',
        waypoints: [
          [18.95, 72.95],
          [5.9, 80.5],
          [-5.0, 95.0],
          [-20.0, 110.0],
          [-34.0, 120.0],
          [-37.813, 144.963]
        ]
      }
    ];

    // Initialize Map with Global View
    const defaultCenter = [26, 30];
    const defaultZoom = window.innerWidth < 768 ? 2 : 2.6;

    const map = L.map('realistic-trade-map', {
      center: defaultCenter,
      zoom: defaultZoom,
      minZoom: 2,
      maxZoom: 9,
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: true
    });

    // Custom Zoom Control at Top-Right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Realistic Tile Layers
    // 1. Editorial Atlas (Carto Voyager)
    const atlasLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }
    );

    // 2. Photorealistic Satellite Imagery (Esri World Imagery)
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18
      }
    );

    // Add Satellite by default as requested by user
    satelliteLayer.addTo(map);

    // Layer Toggle Handlers
    const layerButtons = document.querySelectorAll('.btn-map-layer');
    layerButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        layerButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.getAttribute('data-layer');
        if (mode === 'atlas') {
          map.removeLayer(satelliteLayer);
          atlasLayer.addTo(map);
          routePolylines.forEach(l => l.setStyle({ color: '#5C1324', opacity: 0.85 }));
        } else {
          map.removeLayer(atlasLayer);
          satelliteLayer.addTo(map);
          routePolylines.forEach(l => l.setStyle({ color: '#E5A93C', opacity: 0.9 }));
        }
      });
    });

    // Reset View Button
    const resetBtn = document.getElementById('btn-map-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        map.flyTo(defaultCenter, defaultZoom, { duration: 1.2 });
      });
    }

    // Custom Origin Icon (Sahu Global India Hub)
    const originIcon = L.divIcon({
      className: 'sg-custom-marker-wrapper',
      html: `
        <div class="sg-map-marker-origin" title="Sahu Global Manufacturing & Export Hub (India)">
          <div class="sg-origin-pulse"></div>
          <div class="sg-origin-core">✦</div>
          <div class="sg-origin-tag">SAHU GLOBAL (INDIA)</div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20]
    });

    const originMarker = L.marker(originCoords, { icon: originIcon }).addTo(map);
    originMarker.bindPopup(`
      <div class="map-popup-card">
        <div class="map-popup-badge">PRIMARY EXPORT DISPATCH HUB</div>
        <h3 class="map-popup-title">Nhava Sheva (JNPT) & Delhi NCR</h3>
        <p style="font-size: 0.84rem; color: #554A43; margin-bottom: 0.5rem; line-height: 1.5;">
          Direct customs-bonded factory stuffing, high-volume container consolidation, and rapid transit via Delhi Air Cargo & Nhava Sheva.
        </p>
        <div class="map-popup-meta">
          <div>UN/LOCODE: <strong>INNSA (Seaport) / INDEL (Air)</strong></div>
          <div>Annual Export Volume: <strong>Millions of Garments</strong></div>
          <div>Quality Protocol: <strong>Pre-Shipment AQL 1.5 Audited</strong></div>
        </div>
        <div class="map-popup-transit">HEADQUARTERS & MANUFACTURING FACILITIES</div>
      </div>
    `);

    // Destination Markers & Route Polylines
    const destMarkers = {};
    const routePolylines = [];

    destinations.forEach(dest => {
      // Custom Pin Icon
      const destIcon = L.divIcon({
        className: 'sg-custom-marker-wrapper',
        html: `
          <div class="sg-map-marker-dest" data-dest="${dest.id}">
            <div class="sg-dest-pin"></div>
            <div class="sg-dest-tag">${dest.name.split('/')[0].trim()}</div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -14]
      });

      const marker = L.marker(dest.coords, { icon: destIcon }).addTo(map);
      destMarkers[dest.id] = marker;

      marker.bindPopup(`
        <div class="map-popup-card">
          <div class="map-popup-badge">${dest.region} • ${dest.country.toUpperCase()}</div>
          <h3 class="map-popup-title">${dest.name}</h3>
          <div class="map-popup-meta">
            <div>UN/LOCODE: <strong>${dest.locode}</strong></div>
            <div>Core Product Lines: <strong>${dest.categories}</strong></div>
            <div>Handling Capacity: <strong>${dest.volume}</strong></div>
            <div>Customs Regime: <strong>${dest.customs}</strong></div>
          </div>
          <div class="map-popup-transit">
            🚢 Sea Freight: <strong>${dest.seaLead}</strong> &nbsp;|&nbsp; ✈️ Air Cargo: <strong>${dest.airLead}</strong>
          </div>
        </div>
      `);

      // Maritime Trade Route Polyline (Radiant Gold for Satellite Realism)
      const routeLine = L.polyline(dest.waypoints, {
        color: '#E5A93C',
        weight: 2.4,
        opacity: 0.88,
        dashArray: '5, 8',
        lineCap: 'round',
        lineJoin: 'round',
        className: 'maritime-corridor-line'
      }).addTo(map);

      // Hover / Click Effects on Route
      routeLine.on('mouseover', function () {
        this.setStyle({ color: '#FFFFFF', weight: 3.5, opacity: 1.0 });
      });
      routeLine.on('mouseout', function () {
        const isAtlas = document.querySelector('.btn-map-layer[data-layer="atlas"].active');
        this.setStyle({ color: isAtlas ? '#5C1324' : '#E5A93C', weight: 2.4, opacity: 0.88 });
      });
      routeLine.on('click', function () {
        marker.openPopup();
        map.flyTo(dest.coords, 5, { duration: 1.0 });
      });

      routePolylines.push(routeLine);
    });

    // Market Card Clicks to Pan Map
    const marketCards = document.querySelectorAll('.market-card');
    const regionMap = {
      'NORTH AMERICA': 'usa-east',
      'EUROPEAN UNION': 'eu-rotterdam',
      'UNITED KINGDOM': 'uk',
      'MIDDLE EAST': 'uae'
    };

    marketCards.forEach(card => {
      card.style.cursor = 'pointer';
      card.setAttribute('title', 'Click to view port on interactive map');

      card.addEventListener('click', () => {
        const regElem = card.querySelector('.market-region');
        if (!regElem) return;
        const regName = regElem.textContent.trim();
        const targetId = regionMap[regName];

        if (targetId && destMarkers[targetId]) {
          const targetMarker = destMarkers[targetId];
          const destData = destinations.find(d => d.id === targetId);

          // Smooth scroll to map if not in view
          const mapEl = document.getElementById('realistic-trade-map');
          if (mapEl) {
            const rect = mapEl.getBoundingClientRect();
            if (rect.top < 0 || rect.bottom > window.innerHeight) {
              mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }

          map.flyTo(destData.coords, 4.8, { duration: 1.3 });
          setTimeout(() => {
            targetMarker.openPopup();
          }, 1400);
        }
      });
    });

    // Handle Window Resize
    window.addEventListener('resize', () => {
      map.invalidateSize();
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRealisticMap);
  } else {
    initRealisticMap();
  }
})();
