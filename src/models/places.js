'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Places extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Menambahkan relasi dengan model UMKM
            this.hasMany(models.UMKM, { foreignKey: 'placeId' });
            // define association here
        }
    }
    Places.init({
        place_name: DataTypes.STRING,
        description: DataTypes.TEXT,
        category: DataTypes.STRING,
        city: DataTypes.STRING,
        price: DataTypes.FLOAT,
        rating: DataTypes.FLOAT,
        call_number: DataTypes.STRING,
        coordinate: DataTypes.STRING,
        latitude: DataTypes.FLOAT,
        longitude: DataTypes.FLOAT,
        image_url: DataTypes.STRING,
        review: DataTypes.TEXT,
        schedule_operational: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Places',
    });
    return Places;
};