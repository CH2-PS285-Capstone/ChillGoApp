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

// Gunakan rute-rute API utama
app.use('/api', apiRoutes);

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

// Endpoint untuk pesan selamat datang
app.get('/', (req, res) => {
    res.send('Selamat datang di ChillGo! Mari jelajahi Jawa Barat Bersama ^_^');
});

// Middleware untuk menangani rute yang tidak ditemukan
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Maaf, rute tidak ditemukan!' });
});


// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});


/// api ml
app.post('/make_prediction', async(req, res) => {
    try {
        // Mengirim permintaan ke Flask API
        const flaskApiResponse = await axios.post('http://flask-api-url/predict', {
            features: req.body.features
        });

        // Mengirim hasil prediksi ke klien
        res.json({ result: flaskApiResponse.data.result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});