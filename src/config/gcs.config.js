// gcs.config.js
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    projectId: '-', // Ganti dengan ID proyek Google Cloud Anda
    keyFilename: '-', // Ganti dengan path menuju berkas kunci layanan GCS Anda
});

const bucketName = 'bucket'; // Ganti dengan nama bucket GCS Anda

module.exports = { storage, bucketName };
