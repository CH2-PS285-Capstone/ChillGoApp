const { Places, UMKM } = require('../models');
const axios = require('axios');
const { Readable } = require('stream');
//middleware untuk menangani upload file 
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');
const { storage: gcsStorage, bucketName } = require('../config/gcs.config');

// Fungsi bantuan untuk mengunggah gambar ke Google Cloud Storage
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

const getAllUMKMByPlaceId = async(req, res) => {
    const placeId = parseInt(req.params.placeId, 10);
    if (isNaN(placeId)) {
        return res.status(400).json({ success: false, message: 'Invalid tourist spot ID' });
    }
    console.log('Value of placeId:', placeId);
    try {
        const umkmList = await UMKM.findAll({
            where: {
                place_id: placeId,
            },
        });

        console.log('MSMEs in Tourist Attractions with ID ${placeId}:', umkmList);
        res.status(200).json({ success: true, message: 'Successfully get a list of MSMEs', data: umkmList });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

const addUMKM = async(req, res) => {
    const placeId = parseInt(req.params.placeId, 10);
    if (isNaN(placeId)) {
        return res.status(400).json({ success: false, message: 'Invalid tourist spot ID' });
    }
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
        umkm_ratings,
    } = req.body;


    try {
        const placeData = await Places.findByPk(placeId);
        if (!placeData) {
            return res.status(404).json({ success: false, message: 'Tourist attractions not found' });
        }
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
            umkm_ratings,
            image_url: req.file ? await uploadImageToGCS(req.file) : null,
            placeId: placeId,
        });

        console.log('New MSMEs:', newUMKM);
        res.status(201).json({ success: true, message: 'MSME added successfully', data: newUMKM });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

const updateUMKM = async(req, res) => {
    const { id } = req.params;
    const {
        umkm_name,
        description,
        category,
        no_telepon,
        price,
        rating,
        coordinate,
        latitude,
        longitude,
        schedule_operational,
        image_url,
        place_id,
    } = req.body;

    try {
        const umkmData = await UMKM.findByPk(id);
        if (!umkmData) {
            return res.status(404).json({ success: false, message: 'MSMEs not found' });
        }

        await umkmData.update({
            umkm_name,
            description,
            category,
            no_telepon,
            price,
            rating,
            coordinate,
            latitude,
            longitude,
            schedule_operational,
            image_url: req.file ? await uploadImageToGCS(req.file) : umkmData.image_url,
            place_id,
        });

        console.log('MSMEs Updated:', umkmData);
        res.status(200).json({ success: true, message: 'MSME updated successfully', data: umkmData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};


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
    getAllUMKMByPlaceId,
    addUMKM,
    updateUMKM,
    deleteUMKM,
    upload,
    uploadImageToGCS,
    // ... (fungsi lain jika diperlukan)
};