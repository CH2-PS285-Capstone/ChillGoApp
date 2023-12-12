const express = require('express');
const router = express.Router();
const umkmController = require('../controllers/UMKMController');

// Rute untuk mendapatkan semua UMKM
router.get('/umkm', umkmController.getAllUMKM);

// Rute untuk mendapatkan detail UMKM berdasarkan ID
router.get('/umkm/:id', umkmController.getUMKMById);

// Rute untuk menambah UMKM baru
router.post('/umkm', umkmController.addUMKM);

// Rute untuk memperbarui informasi UMKM berdasarkan ID
router.put('/umkm/:id', umkmController.updateUMKM);

// Rute untuk menghapus UMKM berdasarkan ID
router.delete('/umkm/:id', umkmController.deleteUMKM);

module.exports = router;