const { Sequelize, DataTypes } = require('sequelize');

// Inisialisasi koneksi ke database
const sequelize = new Sequelize('database_name', 'username', 'password', {
  host: 'DB_HOST',
  dialect: 'DB_Type', 
});

// Definisikan model UMKM
const UMKM = sequelize.define('UMKM', {
  UMKM_Name: DataTypes.STRING,
  UMKM_Image: DataTypes.STRING,
  UMKM_Address: DataTypes.STRING,
  UMKM_Ratings: DataTypes.FLOAT,
  Product_Description: DataTypes.TEXT,
  Category: DataTypes.STRING,
  Phone_Number: DataTypes.STRING,
  Product_Price: DataTypes.FLOAT,
  Schedule_Operational: DataTypes.STRING,
  User_Id: DataTypes.INTEGER
});

// Sinkronkan model dengan basis data
sequelize.sync()
  .then(() => {
    console.log('Model UMKM telah terhubung dengan basis data.');
  })
  .catch(err => {
    console.error('Tidak dapat menyambungkan model UMKM ke basis data:', err);
  });

module.exports = UMKM;
