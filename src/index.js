const express = require('express');
const cors = require('cors');
const placeRoutes = require('./routes/placeRoutes');
const gcsConfig = require('./config/gcs.config');
const { Places } = require('./models'); // Sesuaikan path ini
const { uploadImageToGCS, upload } = require('./controllers/placeController');
// Sesuaikan path ini

const umkmRoutes = require('./routes/umkmRoutes');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

// Gunakan rute-rute API
app.use('/api/places', placeRoutes);
app.use('/api/umkm', umkmRoutes);
// app.use('/api/login', loginRoutes);


app.post('/upload', upload, async(req, res) => {
    try {
        const imageUrl = req.file ? await uploadImageToGCS(req.file, gcsConfig) : null;

        // Simpan URL gambar ke basis data atau lakukan yang lain sesuai kebutuhan
        // Misalnya, menyimpan URL gambar ke tabel Places
        const { id } = req.body; // Misalnya, ID tempat dari permintaan POST
        if (id) {
            await Places.update({ image_url: imageUrl }, { where: { id } });
        }

        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Kesalahan Server Internal' });
    }
});

// Handle rute tidak ditemukan
app.use((req, res, next) => {
    res.status(404).send('Maaf Route tidak ditemukan! Coba Lagi, Jangan Menyerah :)');
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});