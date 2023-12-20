const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
const gcsConfig = require('./config/gcs.config');
const { Places } = require('./models');
const { uploadImageToGCS, upload } = require('./controllers/placeController');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());


// Use the API routes defined in apiRoutes.js
app.use('/api', apiRoutes);

// Main (root) route that provides a simple welcome message as the response
app.get('/', (req, res) => {
    res.send('Welcome to ChillGo! Lets explore West Java together ^_^');
});

// Middleware: Handle requests that do not match any route with a 404 response
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Sorry, route not found!' });
});

// Start the server on the specified port
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});