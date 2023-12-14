const express = require('express');
const umkmRoutes = require('./umkmRoutes');
const placeController = require('../controllers/placeController');
const umkmController = require('../controllers/umkmController'); // Tambahkan baris ini

// Gunakan storage yang sama yang telah didefinisikan di placeController.js
const multer = require('multer');
const uploadStorage = multer.memoryStorage();
const upload = multer({ storage: uploadStorage });

const router = express.Router();
// Rute untuk mendapatkan semua tempat wisata
router.get('/places', placeController.getAllPlaces);

// Rute untuk mendapatkan detail tempat wisata berdasarkan ID
router.get('/places/:id', placeController.getPlaceById);

// Rute untuk menambah tempat wisata baru
router.post('/places', upload.single('file'), placeController.addPlace);

// Rute untuk memperbarui informasi tempat wisata berdasarkan ID
router.put('/places/:id', upload.single('file'), placeController.updatePlace);

// Rute untuk menghapus tempat wisata berdasarkan ID
router.delete('/places/:id', placeController.deletePlace);


//belumbisa untuk rute ini karna limit 5 
// Rute untuk mendapatkan tempat wisata rekomendasi
router.get('/recommended-places', placeController.getRecommendedPlaces);

// Rute untuk mendapatkan tempat wisata berdasarkan daerah
router.get('/places-by-region/:region', placeController.getPlacesByRegion);

// Rute untuk mendapatkan tempat wisata favorit
router.get('/favorite-places', placeController.getFavoritePlaces);

// Rute untuk mendapatkan tempat wisata terpopuler
router.get('/popular-places', placeController.getPopularPlaces);

// Rute untuk mendapatkan semua UMKM di tempat wisata berdasarkan ID tempat
router.get('/places/:id/umkm', umkmController.getAllUMKMByPlaceId);

// Rute untuk menambah UMKM di tempat wisata berdasarkan ID tempat
router.post('/places/:placeId/umkm', upload.single('file'), umkmController.addUMKM);

// Rute untuk memperbarui UMKM di tempat wisata berdasarkan ID UMKM
router.put('/umkm/:id', upload.single('file'), umkmController.updateUMKM);

// Rute untuk menghapus UMKM di tempat wisata berdasarkan ID UMKM
router.delete('/umkm/:id', umkmController.deleteUMKM);

router.use('/', umkmRoutes);

// ... (Tambahkan rute lain jika diperlukan)

module.exports = router;