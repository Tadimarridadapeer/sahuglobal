const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Directories
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');
const SEO_FILE = path.join(DATA_DIR, 'seo.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `spec-${uniqueSuffix}-${safeName}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|doc|docx|png|jpg|jpeg|webp|zip|ai|psd|dxf|cad/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Supported formats: PDF, Word, Images, CAD/DXF, ZIP files.'));
    }
  }
});

// Helper functions for JSON storage
function readJson(filePath, defaultData = {}) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
  return defaultData;
}

function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
    return false;
  }
}

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOAD_DIR));

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Content API (CMS)
app.get('/api/content', (req, res) => {
  const content = readJson(CONTENT_FILE, {});
  res.json({ success: true, data: content });
});

app.post('/api/content', (req, res) => {
  const newContent = req.body;
  if (!newContent || typeof newContent !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid content payload' });
  }
  const ok = writeJson(CONTENT_FILE, newContent);
  if (ok) {
    res.json({ success: true, message: 'Website content updated and published successfully!' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to write content file' });
  }
});

// 2. Buyer Enquiries API
app.get('/api/enquiries', (req, res) => {
  const enquiries = readJson(ENQUIRIES_FILE, []);
  res.json({ success: true, count: enquiries.length, data: enquiries });
});

app.post('/api/enquiries', upload.single('techPack'), (req, res) => {
  try {
    const {
      fullName,
      companyName,
      businessEmail,
      phone,
      country,
      productInterest,
      approximateVolume,
      targetDelivery,
      message,
      honeypot
    } = req.body;

    // Spam Honeypot Check
    if (honeypot && honeypot.trim() !== '') {
      return res.status(200).json({ success: true, message: 'Enquiry received' });
    }

    // Validation
    if (!fullName || !businessEmail || !companyName) {
      return res.status(400).json({
        success: false,
        message: 'Full Name, Company Name, and Business Email are required.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(businessEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid business email address.'
      });
    }

    const enquiries = readJson(ENQUIRIES_FILE, []);
    const newId = `ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newEnquiry = {
      id: newId,
      createdAt: new Date().toISOString(),
      fullName: fullName.trim(),
      companyName: companyName.trim(),
      businessEmail: businessEmail.trim(),
      phone: (phone || '').trim(),
      country: (country || 'International').trim(),
      productInterest: productInterest || 'General Sourcing',
      approximateVolume: approximateVolume || 'To be discussed',
      targetDelivery: targetDelivery || 'Immediate',
      message: (message || '').trim(),
      techPackFile: req.file ? `/uploads/${req.file.filename}` : null,
      techPackOriginalName: req.file ? req.file.originalname : null,
      status: 'New',
      priority: 'High',
      notes: 'Initial buyer web enquiry received. Awaiting merchandising review.'
    };

    enquiries.unshift(newEnquiry);
    writeJson(ENQUIRIES_FILE, enquiries);

    console.log(`[ENQUIRY] Received new B2B Lead ${newId} from ${companyName} (${country})`);

    res.status(201).json({
      success: true,
      id: newId,
      message: 'Your production enquiry has been submitted successfully to Sahu Global Merchandising Team.',
      data: newEnquiry
    });
  } catch (err) {
    console.error('Error saving enquiry:', err);
    res.status(500).json({ success: false, message: 'Server error processing enquiry.' });
  }
});

app.patch('/api/enquiries/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const enquiries = readJson(ENQUIRIES_FILE, []);
  const index = enquiries.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Enquiry not found.' });
  }

  enquiries[index] = { ...enquiries[index], ...updates, updatedAt: new Date().toISOString() };
  writeJson(ENQUIRIES_FILE, enquiries);

  res.json({ success: true, message: 'Enquiry updated successfully.', data: enquiries[index] });
});

app.delete('/api/enquiries/:id', (req, res) => {
  const { id } = req.params;
  let enquiries = readJson(ENQUIRIES_FILE, []);
  const initialLen = enquiries.length;
  enquiries = enquiries.filter(e => e.id !== id);

  if (enquiries.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Enquiry not found.' });
  }

  writeJson(ENQUIRIES_FILE, enquiries);
  res.json({ success: true, message: 'Enquiry deleted.' });
});

// 3. SEO API
app.get('/api/seo', (req, res) => {
  const seoData = readJson(SEO_FILE, {});
  res.json({ success: true, data: seoData });
});

app.post('/api/seo', (req, res) => {
  const newSeo = req.body;
  const ok = writeJson(SEO_FILE, newSeo);
  if (ok) {
    res.json({ success: true, message: 'SEO configurations updated.' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update SEO configurations.' });
  }
});

// 4. File Upload Dedicated API
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }
  res.json({
    success: true,
    fileUrl: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// 5. Auth Demo API
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Demonstration credentials
  if ((email === 'admin@sahuglobal.com' && password === 'sahu2026') || (email === 'demo@crossmotive.com')) {
    return res.json({
      success: true,
      token: 'demo-jwt-token-sahu-' + Date.now(),
      user: {
        name: 'Simran Gupta / Lead Administrator',
        role: 'Administrator',
        email: email,
        organization: 'Sahu Global'
      }
    });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials. Demo login: admin@sahuglobal.com / sahu2026' });
});

// 6. Technical SEO Files
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

// SPA Fallback: Any unknown route serves index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  SAHU GLOBAL CORPORATE WEBSITE & CMS`);
  console.log(`  Running at: http://localhost:${PORT}`);
  console.log(`  Admin CMS:  http://localhost:${PORT}/#admin`);
  console.log(`  Built for CrossMotive Services Client Demonstration`);
  console.log(`======================================================\n`);
});
