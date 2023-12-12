const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');

// Rute untuk mendapatkan semua tempat wisata
router.get('/places', placeController.getAllPlaces);

// Rute untuk mendapatkan detail tempat wisata berdasarkan ID
router.get('/places/:id', placeController.getPlaceById);

// Rute untuk menambah tempat wisata baru
router.post('/places', placeController.addPlace);

// Rute untuk memperbarui informasi tempat wisata berdasarkan ID
router.put('/places/:id', placeController.updatePlace);

// Rute untuk menghapus tempat wisata berdasarkan ID
router.delete('/places/:id', placeController.deletePlace);

router.get('/', (req, res) => {
    res.send('ini adalah parameter sederhana');
});

module.exports = router;