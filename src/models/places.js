'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Places extends Model {
        static associate(models) {
            this.hasMany(models.UMKM, { foreignKey: 'place_id' });
            this.hasMany(models.ratingusers, { foreignKey: 'place_id', as: 'ratings' });
        }
    }
    Places.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
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
        schedule_operational: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Places',
    });

    return Places;
};