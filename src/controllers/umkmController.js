const { Places, UMKM } = require('../models');
const { Readable } = require('stream');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');
const { storage: gcsStorage, bucketName } = require('../config/gcs.config');


// Function to upload an image to Google Cloud Storage
const uploadImageToGCS = async(file) => {
    try {
        if (!file || !file.originalname || !file.mimetype || !file.buffer) {
            throw new Error('invalid file object. Ensure file, originalname, mimetype, and buffer are present');
        }

        const bucket = gcsStorage.bucket(bucketName);
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


// Get a paginated list of all MSMEs
const getAllUMKM = async(req, res) => {
    try {
        const { page } = req.query;
        const pageSize = 10;

        const offset = (page - 1) * pageSize;

        const umkmList = await UMKM.findAll({
            order: [
                ['id', 'ASC']
            ],
            limit: pageSize,
            offset: offset,
        });

        console.log('List of all MSMEs:', umkmList);

        const hasNextPage = umkmList.length === pageSize;
        const nextPage = hasNextPage ? parseInt(page) + 1 : null;

        res.status(200).json({
            success: true,
            message: 'Successfully get a paginated list of all MSMEs',
            data: umkmList,
            hasNextPage: hasNextPage,
            nextPage: nextPage,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};


// Get tourist spot with associated MSMEs by ID
const getAllUMKMByPlaceId = async(req, res) => {
    const placeId = parseInt(req.params.placeId, 10);
    if (isNaN(placeId)) {
        return res.status(400).json({ success: false, message: 'Invalid tourist spot ID' });
    }
    console.log('Value of placeId:', placeId);
    try {
        const touristSpot = await Places.findByPk(placeId, {
            include: [{
                model: UMKM,
                as: 'umkm',
            }, ],
        });

        if (!touristSpot) {
            return res.status(404).json({ success: false, message: 'Tourist spot not found', data: null });
        }

        console.log('Tourist Spot with MSMEs:', touristSpot);
        res.status(200).json({ success: true, message: 'Successfully get tourist spot with MSMEs', data: touristSpot });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};


// Create a new MSME
const createUMKM = async(req, res) => {
    try {
        const {
            umkm_name,
            description,
            category,
            city,
            price,
            rating,
            no_telepon,
            coordinate,
            latitude,
            longitude,
            schedule_operational,
            image_url,
        } = req.body;

        const newUMKM = await UMKM.create({
            umkm_name,
            description,
            category,
            city,
            price,
            rating,
            no_telepon,
            coordinate,
            latitude,
            longitude,
            schedule_operational,
            image_url,
        });

        res.status(201).json({
            success: true,
            message: 'UMKM created successfully',
            data: newUMKM,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};


// Update an existing MSME
const updateUMKM = async(req, res) => {
    const { id } = req.params;

    try {
        const {
            umkm_name,
            description,
            category,
            city,
            price,
            rating,
            no_telepon,
            coordinate,
            latitude,
            longitude,
            schedule_operational,
            image_url,
        } = req.body;

        const umkmData = await UMKM.findByPk(id);

        if (!umkmData) {
            return res.status(404).json({ success: false, message: 'UMKM not found' });
        }

        await umkmData.update({
            umkm_name,
            description,
            category,
            city,
            price,
            rating,
            no_telepon,
            coordinate,
            latitude,
            longitude,
            schedule_operational,
            image_url: req.file ? await uploadImageToGCS(req.file) : umkmData.image_url,
        });

        res.status(200).json({
            success: true,
            message: 'UMKM updated successfully',
            data: umkmData,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};


// Delete an existing MSME
const deleteUMKM = async(req, res) => {
    const { id } = req.params;

    try {
        const umkmData = await UMKM.findByPk(id);
        if (!umkmData) {
            return res.status(404).json({ success: false, message: 'MSMEs not found' });
        }

        await umkmData.destroy();

        console.log('MSMEs Removed:', umkmData);
        res.status(204).json({ success: true, message: 'MSME successfully deleted' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    getAllUMKM,
    getAllUMKMByPlaceId,
    createUMKM,
    updateUMKM,
    deleteUMKM,
    upload,
    uploadImageToGCS,
};