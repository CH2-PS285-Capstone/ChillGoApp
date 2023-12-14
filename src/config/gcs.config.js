// gcs.config.js
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    projectId: 'capstone-project-405714', // Ganti dengan ID proyek Google Cloud Anda
    keyFilename: 'capstone-project-405714-1404ad62089b.json', // Ganti dengan path menuju berkas kunci layanan GCS Anda
});

const bucketName = 'desc285'; // Ganti dengan nama bucket GCS Anda

module.exports = { storage, bucketName };