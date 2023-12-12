const express = require('express');
const cors = require('cors');
const placeRoutes = require('./routes/placeRoutes');
const umkmRoutes = require('./routes/UMKMRoutes')
    // const loginRoutes = require('./routes/loginRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Gunakan rute-rute API
app.use('/api/places', placeRoutes);
// app.use('/api/login', loginRoutes);
app.use('/api/umkm', umkmRoutes);

// Handle rute tidak ditemukan
app.use((req, res) => {
    res.status(404).send('Maaf Route tidak ditemukan! Coba Lagi, Jangan Menyerah :)');
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});