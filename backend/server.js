const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { loadPoems, getPoems } = require('./data/loadPoems');
const { recommendPoems } = require('./data/recommend');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://the-poets-corner-six.vercel.app',
  'https://the-poets-corner-git-main-tishas-projects-4bb556cb.vercel.app',
  'https://the-poets-corner-h0n4nbslr-tishas-projects-4bb556cb.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: "The Poet's Corner backend is running!" });
});

// Route to check dataset loaded correctly
app.get('/api/poems/count', (req, res) => {
  res.json({ totalPoems: getPoems().length });
});
// Route to search/recommend poems by mood/theme
   app.get('/api/poems/recommend', (req, res) => {
     const query = req.query.mood;

     if (!query) {
       return res.status(400).json({ error: 'Please provide a mood or theme using ?mood=' });
     }

     const results = recommendPoems(query, 10);
     res.json({
       query,
       count: results.length,
       poems: results
     });
   });

// Start server only after poems are loaded
loadPoems()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to load poems dataset:', err);
  });