// apiRoutes.js
const express = require('express');
const placeController = require('../controllers/placeController');
const umkmController = require('../controllers/umkmController');
const { upload } = require('../controllers/placeController');
const multer = require('multer');
const uploadStorage = multer.memoryStorage();
const uploadMiddleware = multer({ storage: uploadStorage });

const router = express.Router();


// Rute-rute untuk tempat
//Mendapatkan daftar semua tempat wisata
router.get('/places', placeController.getAllPlaces);
// Mendapatkan detail tempat wisata berdasarkan ID.
router.get('/places/:id', placeController.getPlaceById);
// Menambahkan tempat wisata baru. Menggunakan middleware uploadMiddleware dari multer untuk menangani pengunggahan file gambar.
router.post('/places', uploadMiddleware.single('file'), placeController.addPlace);
// Memperbarui informasi tempat wisata berdasarkan ID. Juga menggunakan uploadMiddleware untuk mengelola unggahan gambar.
router.put('/places/:id', uploadMiddleware.single('file'), placeController.updatePlace);
// Menghapus tempat wisata berdasarkan ID.
router.delete('/places/:id', placeController.deletePlace);
// Mendapatkan daftar tempat wisata rekomendasi. (Pada kode yang diberikan, ini tidak dibatasi hingga 5, dan sebaiknya dilakukan pembatasan jumlah jika diinginkan.)
router.get('/recommended-places', placeController.getRecommendedPlaces);
// Mendapatkan daftar tempat wisata berdasarkan daerah tertentu.
router.get('/places-by-region/:region', placeController.getPlacesByRegion);
// Mendapatkan daftar tempat wisata favorit berdasarkan kriteria rating.
router.get('/favorite-places', placeController.getFavoritePlaces);
// Mendapatkan daftar tempat wisata terpopuler berdasarkan rating.
router.get('/popular-places', placeController.getPopularPlaces);


// Rute-rute untuk umkm
// Mendapatkan daftar UMKM di tempat wisata berdasarkan ID tempat.
router.get('/places/:placeId/umkm', umkmController.getAllUMKMByPlaceId);
// Menambahkan UMKM di tempat wisata berdasarkan ID tempat. Juga menggunakan uploadMiddleware untuk mengelola unggahan gambar. -- done
router.post('/places/:placeId/umkm', uploadMiddleware.single('file'), umkmController.addUMKM);
// Memperbarui informasi UMKM berdasarkan ID UMKM. Juga menggunakan uploadMiddleware untuk mengelola unggahan gambar.
router.put('/umkm/:id', uploadMiddleware.single('file'), umkmController.updateUMKM);
// Menghapus UMKM berdasarkan ID.
router.delete('/umkm/:id', umkmController.deleteUMKM);



module.exports = router;