const { storage, bucketName } = require('../config/gcs.config');
const { Places, UMKM, ratingusers, sequelize } = require('../models');
const { Op } = require('sequelize');
const axios = require('axios');
const { Readable } = require('stream');
const multer = require('multer');
const uploadStorage = multer.memoryStorage();
const upload = multer({ storage: uploadStorage }).single('file');
require('dotenv').config();


// Function to upload an image to Google Cloud Storage
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


// Controller to get a paginated list of places
const getAllPlacesPaginated = async(req, res) => {
    const { cursor } = req.query;
    const limit = 7;

    try {
        const whereClause = cursor ? {
            id: {
                [Op.gt]: cursor
            }
        } : {};
        console.log('Where Clause:', whereClause);

        const places = await Places.findAll({
            where: whereClause,
            limit,
        });

        console.log('Places:', places);

        const nextCursor = places.length > 0 ? places[places.length - 1].id : null;
        console.log('Next Cursor:', nextCursor);

        res.status(200).json({
            error: false,
            message: 'Data retrieved successfully',
            data: places,
            nextCursor,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: true,
            message: 'Internal Server Error',
            data: null
        });
    }
};


// Controller to get details of a place by ID
const getPlaceById = async(req, res) => {
    const { id } = req.params;
    try {
        const placeData = await Places.findByPk(id, {
            include: [{ model: UMKM }],

        });
        if (!placeData) {
            return res.status(404).json({ error: true, message: 'Tourist attractions not found', data: null });
        }
        console.log('Tourist Attraction Details:', placeData);
        res.status(200).json({ error: false, message: 'Data retrieved successfully', data: placeData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error', data: null });
    }
};

// Controller to add a new place
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
        res.status(201).json({ error: false, message: 'Tourist attractions added successfully', data: newPlace });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error', data: null });
    }
};

// Controller to update an existing place by ID
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
            return res.status(404).json({ error: true, message: 'Tourist attractions not found', data: null });
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
        res.status(200).json({ error: false, message: 'Tourist attractions updated successfully', data: placeData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error', data: null });
    }
};

// Controller to delete a place by ID
const deletePlace = async(req, res) => {
    const { id } = req.params;

    try {
        const placeData = await Places.findByPk(id);
        if (!placeData) {
            return res.status(404).json({ error: true, message: 'Tourist attractions not found', data: null });
        }

        await placeData.destroy();

        console.log('Tourist Attractions Removed:', placeData);
        res.status(204).json({ error: false, message: 'Tourist attractions successfully deleted', data: null });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error', data: null });
    }
};


// Controller to get recommended places based on user ratings
const getRecommendedPlaces = async(req, res) => {
    try {
        const recommendedPlaces = await ratingusers.findAll({
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

        console.log('Recommended Tourist Attractions:', recommendedPlaces);

        const formattedRecommendedPlaces = recommendedPlaces.map(place => {
            const ratings = recommendedPlaces
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
            error: false,
            message: 'Data retrieved successfully',
            data: {
                recommendedPlaces: formattedRecommendedPlaces,
            },
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error', data: null });
    }
};


// Controller to get places in a specific region
const getPlacesByRegion = async(req, res) => {
    const { region } = req.params;
    try {
        const placesByRegion = await Places.findAll({
            where: {
                city: region,
            },
        });
        console.log(`Tourist Attractions in ${region}:`, placesByRegion);
        res.status(200).json({ error: false, message: 'Data retrieved successfully', data: placesByRegion });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error', data: null });
    }
};


// Controller to get favorite places with ratings greater than or equal to 4.5
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
        res.status(200).json({ error: false, message: 'Data retrieved successfully', data: favoritePlaces });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error', data: null });
    }
};


// Controller to get top-rated places based on place ratings
const getTopRatingPlaces = async(req, res) => {
    try {
        const topRatingPlaces = await ratingusers.findAll({
            where: {
                place_rating: {
                    [Op.gte]: 4,
                },
            },
            order: [
                ['place_rating', 'DESC'],
            ],
            limit: 5,
            include: [Places],
        });

        console.log('Top Rated Tourist Attractions:', topRatingPlaces);
        res.status(200).json({ error: false, message: 'Data retrieved successfully', data: topRatingPlaces });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Internal Server Error', data: null });
    }
};
// Export all controllers for use in routes
module.exports = {
    getAllPlacesPaginated,
    getPlaceById,
    addPlace,
    updatePlace,
    deletePlace,
    getRecommendedPlaces,
    getPlacesByRegion,
    getFavoritePlaces,
    getTopRatingPlaces,
    upload,
    uploadImageToGCS,
};