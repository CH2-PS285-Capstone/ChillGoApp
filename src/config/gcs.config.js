const { Storage } = require('@google-cloud/storage');
require('dotenv').config();
const storage = new Storage({
    projectId: process.env.GOOGLE_PROJECT_ID,
    keyFilename: process.env.GOOGLE_KEY_FILENAME,
});

const bucketName = process.env.GOOGLE_BUCKET_NAME;

module.exports = { storage, bucketName };