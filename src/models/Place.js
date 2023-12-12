const { Sequelize, DataTypes } = require('sequelize');

// Inisialisasi koneksi ke database
const sequelize = new Sequelize('database_name', 'username', 'password', {
  host: 'DB_HOST',
  dialect: 'DB_Type', 
});

// Definisikan model Place
const Place = sequelize.define('Place', {
  Place_Name: DataTypes.STRING,
  Place_Image: DataTypes.STRING,
  City: DataTypes.STRING,
  Place_Address: DataTypes.STRING,
  Lat: DataTypes.FLOAT,
  Long: DataTypes.FLOAT,
  Description: DataTypes.TEXT,
  Ticket_Price: DataTypes.FLOAT,
  Place_Ratings: DataTypes.FLOAT,
  Schedule_Operational: DataTypes.STRING,
  Review: DataTypes.TEXT,
  User_Id: DataTypes.INTEGER
});

// Sinkronkan model dengan basis data
sequelize.sync()
  .then(() => {
    console.log('Model Place telah terhubung dengan basis data.');
  })
  .catch(err => {
    console.error('Tidak dapat menyambungkan model Place ke basis data:', err);
  });

module.exports = Place;