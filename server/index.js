const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const ebayRoutes = require('./routes/ebay');
const aiRoutes = require('./routes/ai');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/ebay', ebayRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);

// Serve SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Forgetic Dashboard running at http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.EBAY_ENVIRONMENT || 'Production'}`);
  console.log(`   eBay Client ID: ${process.env.EBAY_CLIENT_ID ? '✓ Set' : '✗ Missing'}`);
  console.log(`   DeepSeek API: ${process.env.DEEPSEEK_API_KEY ? '✓ Set' : '✗ Missing'}\n`);
});
