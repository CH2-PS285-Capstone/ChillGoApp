const { storage, bucketName } = require('../config/gcs.config');
const { Places, UMKM, ratingusers, sequelize } = require('../models');
const { Op } = require('sequelize');
const axios = require('axios');
const { Readable } = require('stream');
const multer = require('multer');
const uploadStorage = multer.memoryStorage();
const upload = multer({ storage: uploadStorage }).single('file');
require('dotenv').config();

const uploadImageToGCS = async(file) => {
    try {
        if (!file || !file.originalname || !file.mimetype || !file.buffer) {
            throw new Error('invalid file object. Ensure file, originalname, mimetype, and buffer are present');
        }

        const bucket = storage.bucket(bucketName);
        const fileUpload = bucket.file(file.originalname);

        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null);
        const writeStream = fileUpload.createWriteStream();
        bufferStream.pipe(writeStream);

        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        const imageUrl = `https://storage.googleapis.com/${bucketName}/${file.originalname}`;

        return imageUrl;
    } catch (error) {
        console.error('Error uploading to Google Cloud Storage:', error);
        throw error;
    }
};

const getAllPlaces = async(req, res) => {
    try {
        const placeList = await Places.findAll();
        console.log('DList of Tourist Attractions:', placeList);
        res.status(200).json({ success: true, message: 'Successfully get a list of tourist attractions', data: placeList });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

const getPlaceById = async(req, res) => {
    const { id } = req.params;
    try {
        const placeData = await Places.findByPk(id, {
            include: [{ model: UMKM }],

        });
        if (!placeData) {
            return res.status(404).json({ status: 'error', message: 'Tourist attractions not found' });
        }
        console.log('Tourist Attraction Details:', placeData);
        res.status(200).json({ status: 'success', data: placeData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
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
        review,
        schedule_operational
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

        console.log('New Tourist Attractions:', newPlace);
        res.status(201).json({ status: 'success', message: 'Tourist attractions added successfully', data: newPlace });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
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
        review,
        schedule_operational
    } = req.body;

    try {
        const placeData = await Places.findByPk(id);
        if (!placeData) {
            return res.status(404).json({ status: 'error', message: 'Tourist attractions not found' });
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

        console.log('Tourist Attractions Updated:', placeData);
        res.status(200).json({ status: 'success', message: 'Tourist attractions updated successfully', data: placeData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
    }
};

const deletePlace = async(req, res) => {
    const { id } = req.params;

    try {
        const placeData = await Places.findByPk(id);
        if (!placeData) {
            return res.status(404).json({ status: 'error', message: 'Tourist attractions not found' });
        }

        await placeData.destroy();

        console.log('Tourist Attractions Removed:', placeData);
        res.status(204).json({ status: 'success', message: 'Tourist attractions successfully deleted' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
    }
};


const getRecommendedPlaces = async(req, res) => {
    try {
        const favoritePlaces = await ratingusers.findAll({
            attributes: ['place_id', 'place_name', 'place_rating'],
            where: {
                place_rating: {
                    [Op.gte]: 4,
                },
            },
            include: [{
                model: Places,
                attributes: ['rating'],
                where: {
                    id: sequelize.col('ratingusers.place_id'),
                },
            }, ],
        });

        console.log('Recommended Tourist Attractions:', favoritePlaces);
        const formattedFavoritePlaces = favoritePlaces.map(place => {
            const ratings = favoritePlaces
                .filter(fp => fp.place_id === place.place_id)
                .map(fp => ({
                    user_id: fp.user_id,
                    rating: fp.Place.rating,
                }));

            return {
                place_id: place.place_id,
                place_name: place.place_name,
                place_rating: place.place_rating,
                rating: ratings,
            };
        });

        res.status(200).json({
            status: 'success',
            data: {
                favoritePlaces: formattedFavoritePlaces,
            },
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
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
        console.log('Tourist Attractions in ${region}:', placesByRegion);
        res.status(200).json({ status: 'success', data: placesByRegion });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
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

        console.log('Favorite Tourist Attractions:', favoritePlaces);
        res.status(200).json({ status: 'success', data: favoritePlaces });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
    }
};


const getPopularPlaces = async(req, res) => {
    try {
        const popularPlaces = await ratingusers.findAll({
            order: [
                ['place_rating', 'DESC'],
            ],
            limit: 5,
            include: [Places],
        });

        console.log('Most Popular Tourist Attractions:', popularPlaces);
        res.status(200).json({ status: 'success', data: popularPlaces });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
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
};