const express = require('express');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const requestRoutes = require('./routes/requests');

const app = express();

app.set('trust proxy', 1);
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/requests', requestRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
