// Fungsi bantuan untuk mengunggah gambar ke Google Cloud Storage
const { storage, bucketName } = require('../config/gcs.config');
const { Places } = require('../models');
const { Op } = require('sequelize');
const axios = require('axios');
const { Readable } = require('stream');

// Middleware untuk menangani upload file
const multer = require('multer');
const uploadStorage = multer.memoryStorage();
const upload = multer({ storage: uploadStorage }).single('file');


// Fungsi bantuan untuk mengunggah gambar ke Google Cloud Storage
const uploadImageToGCS = async(file) => {
    try {
        if (!file || !file.originalname || !file.mimetype || !file.buffer) {
            throw new Error('invalid file object. Ensure file, originalname, mimetype, and buffer are present');
        }

        // Ganti dengan nama bucket yang sesuai
        const bucket = storage.bucket(bucketName);
        const fileUpload = bucket.file(file.originalname);

        // Ganti file.buffer dengan Readable stream dari Buffer
        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null); // Signal the end of the stream

        // Pipe bufferStream ke writeStream
        const writeStream = fileUpload.createWriteStream();
        bufferStream.pipe(writeStream);

        // Tambahkan event listener untuk menangani penyelesaian unggahan
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        const imageUrl = `https://storage.googleapis.com/${bucketName}/${file.originalname}`;

        return imageUrl;
    } catch (error) {
        console.error('Error mengunggah ke Google Cloud Storage:', error);
        throw error;
    }
};

const getAllPlaces = async(req, res) => {
    try {
        const placeList = await Places.findAll();
        console.log('Daftar Tempat Wisata:', placeList);
        res.status(200).json(placeList);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Kesalahan Server Internal' });
    }
};

const getPlaceById = async(req, res) => {
    const { id } = req.params;
    try {
        const placeData = await Places.findByPk(id);
        if (!placeData) {
            return res.status(404).json({ error: 'Tempat wisata tidak ditemukan' });
        }
        console.log('Detail Tempat Wisata:', placeData);
        res.status(200).json(placeData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Kesalahan Server Internal' });
    }
};

const addPlace = async(req, res, next) => {
    const {
        place_name,
        description,
        category,
        city,
        price,
        rating,
        call_number,
        coordinate,
        latitude,
        longitude,
        image_url,
        review, // tambahan field pada tabel
        schedule_operational // tambahan field pada tabel
    } = req.body;

    try {
        const imageUrl = req.file ? await uploadImageToGCS(req.file) : null;

        const newPlace = await Places.create({
            place_name,
            description,
            category,
            city,
            price,
            rating,
            call_number,
            coordinate,
            latitude,
            longitude,
            image_url: imageUrl,
            review,
            schedule_operational
        });

        console.log('Tempat Wisata Baru:', newPlace);
        res.status(201).json(newPlace);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Kesalahan Server Internal' });
    }
};

const updatePlace = async(req, res) => {
    const { id } = req.params;
    const {
        place_name,
        description,
        category,
        city,
        price,
        rating,
        call_number,
        coordinate,
        latitude,
        longitude,
        review, // tambahan field pada tabel
        schedule_operational // tambahan field pada tabel
    } = req.body;

    try {
        const placeData = await Places.findByPk(id);
        if (!placeData) {
            return res.status(404).json({ error: 'Tempat wisata tidak ditemukan' });
        }

        const imageUrl = req.file ? await uploadImageToGCS(req.file) : placeData.image_url;

        await placeData.update({
            place_name,
            description,
            category,
            city,
            price,
            rating,
            call_number,
            coordinate,
            latitude,
            longitude,
            image_url: imageUrl,
            review,
            schedule_operational
        });

        console.log('Tempat Wisata Diperbarui:', placeData);
        res.status(200).json(placeData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Kesalahan Server Internal' });
    }
};

const deletePlace = async(req, res) => {
    const { id } = req.params;

    try {
        const placeData = await Places.findByPk(id);
        if (!placeData) {
            return res.status(404).json({ error: 'Tempat wisata tidak ditemukan' });
        }

        await placeData.destroy();

        console.log('Tempat Wisata Dihapus:', placeData);
        res.status(204).send();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Kesalahan Server Internal' });
    }
};

const getRecommendedPlaces = async(req, res) => {
    try {
        const recommendedPlaces = await Places.findAll({
            order: [
                ['rating', 'DESC']
            ],
            limit: 5,
        });

        console.log('Tempat Wisata Rekomendasi:', recommendedPlaces);
        res.status(200).json(recommendedPlaces);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Kesalahan Server Internal' });
    }
};

const getPlacesByRegion = async(req, res) => {
    const { region } = req.params;
    try {
        const placesByRegion = await Places.findAll({
            where: {
                city: region,
            },
        });
        console.log('Tempat Wisata di Daerah $ { region }:', placesByRegion);
        res.status(200).json(placesByRegion);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Kesalahan Server Internal' });
    }
};

const getFavoritePlaces = async(req, res) => {
    try {
        const favoritePlaces = await Places.findAll({
            where: {
                rating: {
                    [Op.gte]: 4.5,
                },
            },
        });

        console.log('Tempat Wisata Favorit:', favoritePlaces);
        res.status(200).json(favoritePlaces);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Kesalahan Server Internal' });
    }
};

const getPopularPlaces = async(req, res) => {
    try {
        const popularPlaces = await Places.findAll({
            order: [
                ['rating', 'DESC']
            ],
            limit: 5,
        });

        console.log('Tempat Wisata Terpopuler:', popularPlaces);
        res.status(200).json(popularPlaces);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Kesalahan Server Internal' });
    }
};


module.exports = {
    getAllPlaces,
    getPlaceById,
    addPlace,
    updatePlace,
    deletePlace,
    getRecommendedPlaces,
    getPlacesByRegion,
    getFavoritePlaces,
    getPopularPlaces,
    upload,
    uploadImageToGCS,
    // ... (eksport fungsi lainnya)
};