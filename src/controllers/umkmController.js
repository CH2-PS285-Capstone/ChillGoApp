const { UMKM } = require('../models');
const axios = require('axios');
const { Readable } = require('stream');

//middleware untuk menangani upload file 
//middleware untuk menangani upload file 
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

        // Ganti dengan nama bucket yang sesuai
        const bucket = gcsStorage.bucket(bucketName);
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

const getAllUMKMByPlaceId = async(req, res) => {
    const { placeId } = req.params;

    try {
        const umkmList = await UMKM.findAll({
            where: {
                placeId,
            },
        });

        console.log(`UMKM di Tempat Wisata dengan ID $ { placeId }:`, umkmList);
        res.status(200).json(umkmList);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Kesalahan Server Internal' });
    }
};

const addUMKM = async(req, res) => {
    const {
        umkm_name,
        umkm_address,
        category,
        call_number,
        product_price,
        schedule_operational,
        product_description,
        umkm_ratings,
    } = req.body;

    try {
        const newUMKM = await UMKM.create({
            umkm_name,
            umkm_address,
            category,
            call_number,
            product_price,
            schedule_operational,
            product_description,
            umkm_ratings,
            image_url: req.file ? await uploadImageToGCS(req.file) : null,
        });

        console.log('UMKM Baru:', newUMKM);
        res.status(201).json(newUMKM);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Kesalahan Server Internal' });
    }
};

const updateUMKM = async(req, res) => {
    const { id } = req.params;
    const {
        umkm_name,
        umkm_address,
        category,
        call_number,
        product_price,
        schedule_operational,
        product_description,
        umkm_ratings,
    } = req.body;

    try {
        const umkmData = await UMKM.findByPk(id);
        if (!umkmData) {
            return res.status(404).json({ error: 'UMKM tidak ditemukan' });
        }

        await umkmData.update({
            umkm_name,
            umkm_address,
            category,
            call_number,
            product_price,
            schedule_operational,
            product_description,
            umkm_ratings,
            image_url: req.file ? await uploadImageToGCS(req.file) : umkmData.image_url,
        });

        console.log('UMKM Diperbarui:', umkmData);
        res.status(200).json(umkmData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Kesalahan Server Internal' });
    }
};


const deleteUMKM = async(req, res) => {
    const { id } = req.params;

    try {
        const umkmData = await UMKM.findByPk(id);
        if (!umkmData) {
            return res.status(404).json({ error: 'UMKM tidak ditemukan' });
        }

        await umkmData.destroy();

        console.log('UMKM Dihapus:', umkmData);
        res.status(204).send();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Kesalahan Server Internal' });
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