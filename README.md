# Sahu Global Private Limited — Corporate Website & Custom CMS

**Client-facing Demonstration Experience** developed by **CrossMotive Services** for **Sahu Global Private Limited**.

---

## 1. Project Overview & Business Background

- **Client**: Sahu Global Private Limited
- **Founded**: 1979 (over 45 years of continuous manufacturing & export integrity)
- **Industry**: High-Precision Apparel Manufacturing & Global Export
- **Export Markets**: United States, United Kingdom, European Union (Germany, France, Netherlands), Middle East (UAE)
- **Primary Audience**: International fashion brand sourcing directors, apparel procurement heads, buying offices, and apparel importers.
- **Strategic Positioning**: Design-forward garment engineering, 3D CAD virtual sampling (Clo3D/Optitex), lean manufacturing assembly, and strict ANSI/ASQ Z1.4 AQL 1.5/2.5 quality clearance.

---

## 2. Creative & Interaction Direction

- **Brand Palette**:
  - Deep Midnight Navy: `#080D15` / `#0B131F` / `#101C2C`
  - Refined Deep Jade / Teal Accent: `#2B8C83` / `#36A197`
  - Porcelain White & Slate: `#F8FAFC` / `#E2E8F0` / `#64748B`
  - Dark Graphite: `#121E2E` / `#162438`
- **Typography**:
  - Headings: `Playfair Display` (architectural, editorial serif)
  - Interface & Body: `Plus Jakarta Sans` (high-precision geometric sans)
  - Data & Specs: `JetBrains Mono`
- **Motion & Micro-interactions**:
  - Custom refined cursor with following ring and context tags (`EXPLORE`, `INSPECT`, `START`, `COLLECTION`)
  - Magnetic elastic CTA buttons (`.magnetic-btn`)
  - Hero architectural textile grid particle canvas (`#hero-canvas`)
  - Interactive Step-by-Step Manufacturing Journey (01 Concept & 3D Prototyping -> 02 Ethical Material Sourcing -> 03 Automated Cutting & Assembly -> 04 Testing & AQL Quality -> 05 Port Logistics)
  - Animated Global Trade Corridors map radiating from India to New York, London, Rotterdam, and Dubai
  - Interactive B2B Feasibility & MOQ Estimator calculating sampling turnarounds, bulk timelines, and AQL standards
  - IntersectionObserver scroll reveals respecting `prefers-reduced-motion`

---

## 3. Information Architecture (22 Complete Page Views)

| Route | Section / Page | Description |
|---|---|---|
| `/#home` | Homepage | Complete immersive flagship experience with all showcases |
| `/#about` | Heritage & Legacy | 1979 founding history, 4-decade timeline, corporate values |
| `/#global-presence` | Global Presence | International export network, container port logistics, transit lead times |
| `/#capabilities` | Manufacturing Overview | Capacity, vertical integration, lean assembly |
| `/#facilities` | Advanced Facilities | Spreading, CNC cutting, modular sewing floors, in-house physical lab |
| `/#product-development` | Product Development | 3D Clo3D avatar fit simulation, 1,500+ mill fabric library, tech packs |
| `/#quality-compliance` | Quality Assurance | 4-point fabric grading, in-line audits, conveyor needle detection, AQL 1.5 |
| `/#design-innovation` | Design & Eco-Finishing | Ozone water-saving washing, functional performance finishes |
| `/#products` | Apparel Categories Hub | Landing showcase for all 4 manufacturing divisions |
| `/#category-womenswear` | Women's Collection | Structured blazers, fluid wovens, dresses, linen trousers |
| `/#category-menswear` | Men's Tailoring & Casual | Dress shirts, garment-dyed utility overshirts, chinos, polo knits |
| `/#category-kidswear` | Kidswear & Essentials | Certified organic cotton babywear, school basics, OEKO-TEX Class 1 |
| `/#category-activewear` | Performance Activewear | 4-way stretch compression leggings, technical tees, flatlock seams |
| `/#sustainability` | Sustainability Roadmap | ETP water recycling, rooftop solar photovoltaic array, zero-landfill selvedge |
| `/#certifications` | Certifications & Audits | OEKO-TEX, GOTS, SMETA/Sedex 4-Pillar, amfori BSCI, WRAP |
| `/#insights` | News & Insights | Editorial articles on European sourcing, AQL standards, and 3D sampling |
| `/#careers` | Careers Portal | Culture, benefits, and open positions with direct email application |
| `/#contact` | Buyer Sourcing Portal | Dedicated B2B enquiry portal with file upload |
| `/#privacy` | Privacy Policy | Corporate data governance and NDA compliance |
| `/#terms` | Terms of Business | Commercial validity, sampling terms, and payment milestones |
| `/#cookies` | Cookie Notice | Essential & analytical cookie transparency |
| `/#thank-you` | Submission Confirmation | Post-enquiry confirmation screen with tracking ID |
| `/#admin` | Admin Dashboard & CMS | Full administrative content management & lead CRM |

---

## 4. Custom Demonstration Admin CMS

The application features a complete demonstration CMS accessible at `/#admin` or via the top-bar "Admin CMS Demo" badge:

### Demo Credentials
- **Email**: `admin@sahuglobal.com`
- **Password**: `sahu2026`
- **Instant One-Click Login**: Supported via button for frictionless client presentation

### Key Administrative Features
1. **Executive Overview**: Total buyer inquiries, high-priority accounts, active export markets, and live CMS section counter.
2. **Visual Content Editor**: Live section editor allowing administrators to modify Hero headlines, subheadings, CTAs, company bio, brand taglines, and banner image URLs. Features a **"Publish Changes Live"** button that immediately persists to `data/content.json` and updates the live site in real time without page reload!
3. **Buyer Enquiries CRM**: Full table of inbound B2B RFQs with search, status filters (`New`, `Contacted`, `Sample Sent`, `In Review`, `Closed`), click-to-view Lead Detail Modal, internal notes editor, status switcher, and one-click **"Export to CSV"** button.
4. **Apparel Categories Manager**: Review and update MOQs, lead times, and fabric specification tags.
5. **SEO & Metadata Manager**: Configure canonical domains, page titles, meta descriptions, and keyword tags.
6. **Settings & SMTP Integration**: Placeholder integration points for production SMTP mail servers and Google Analytics 4 (`G-SAHU2026GLB`).

---

## 5. Technical Architecture & Local Execution

### Prerequisites
- Node.js (v18+) & npm

### Starting the Server
```bash
# Install dependencies
npm install

# Start Express application
npm start
```

The application will be live at:
- **Public Website**: `http://localhost:3000`
- **Admin CMS**: `http://localhost:3000/#admin`

### Resilient Client-Side Fallback
If the frontend is served without Node (e.g., opened via static file hosting or double-clicked as `public/index.html`), the application automatically utilizes `public/js/data-default.js` and `localStorage`, ensuring the demonstration **never fails or shows blank errors**.

---

## 6. Acceptance Criteria Verification

- [x] All 22 required pages and supporting routes exist and deep-link cleanly.
- [x] Distinctive Sahu Global visual identity: Midnight Navy, Deep Jade, Porcelain White, and serif/sans typography.
- [x] Strict adherence to the business brief (Founded 1979 in India; no fabricated client names or factory locations).
- [x] Smooth 60 FPS motion design: custom cursor, particle canvas, interactive journey, and trade map.
- [x] B2B Buyer Enquiry workflow with validation, spam protection, file attachment simulation, and admin CRM visibility.
- [x] Production-ready Node/Express backend with JSON storage, REST APIs, and Vercel configuration.
- [x] SEO foundation: XML sitemap (`/sitemap.xml`), `robots.txt`, and Schema.org JSON-LD structured data.
