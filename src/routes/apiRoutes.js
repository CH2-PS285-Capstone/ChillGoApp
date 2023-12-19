const express = require('express');
const placeController = require('../controllers/placeController');
const umkmController = require('../controllers/umkmController');
const { upload } = require('../controllers/placeController');
const multer = require('multer');
const uploadStorage = multer.memoryStorage();
const uploadMiddleware = multer({ storage: uploadStorage });
const router = express.Router();

router.get('/places', placeController.getAllPlaces);
router.get('/places/:id', placeController.getPlaceById);
router.post('/places', uploadMiddleware.single('file'), placeController.addPlace);
router.put('/places/:id', uploadMiddleware.single('file'), placeController.updatePlace);
router.delete('/places/:id', placeController.deletePlace);
router.get('/recommended-places', placeController.getRecommendedPlaces);
router.get('/places-by-region/:region', placeController.getPlacesByRegion);
router.get('/favorite-places', placeController.getFavoritePlaces);
router.get('/popular-places', placeController.getPopularPlaces);
router.get('/umkm', umkmController.getAllUMKM);
router.get('/places/:placeId/umkm', umkmController.getAllUMKMByPlaceId);
router.post('/places/:placeId/umkm', uploadMiddleware.single('file'), umkmController.addUMKM);
router.put('/umkm/:id', uploadMiddleware.single('file'), umkmController.updateUMKM);
router.delete('/umkm/:id', umkmController.deleteUMKM);


module.exports = router;