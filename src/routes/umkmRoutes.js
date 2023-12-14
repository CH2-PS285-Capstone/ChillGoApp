const express = require('express');
const umkmController = require('../controllers/umkmController');

const multer = require('multer');
const umkmStorage = multer.memoryStorage();
const upload = multer({ storage: umkmStorage });
const router = express.Router();

// Rute untuk mendapatkan semua UMKM di tempat wisata berdasarkan ID tempat
router.get('/places/:placeId/umkm', umkmController.getAllUMKMByPlaceId);

// Rute untuk menambah UMKM di tempat wisata berdasarkan ID tempat
router.post('/places/:placeId/umkm', upload.single('file'), umkmController.addUMKM);

// Rute untuk memperbarui UMKM di tempat wisata berdasarkan ID UMKM
router.put('/umkm/:id', upload.single('file'), umkmController.updateUMKM);

// Rute untuk menghapus UMKM di tempat wisata berdasarkan ID UMKM
router.delete('/umkm/:id', umkmController.deleteUMKM);

// ... (Tambahkan rute lain jika diperlukan)

module.exports = router;