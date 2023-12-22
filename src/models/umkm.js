'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UMKM extends Model {
        static associate(models) {
            this.hasOne(models.Places, { foreignKey: 'umkm_id', as: 'place' });
        }
    }

    UMKM.init({
        umkm_name: DataTypes.STRING,
        description: DataTypes.STRING,
        category: DataTypes.STRING,
        city: DataTypes.STRING,
        price: DataTypes.STRING,
        rating: DataTypes.FLOAT,
        no_telepon: DataTypes.STRING,
        coordinate: DataTypes.STRING,
        latitude: DataTypes.FLOAT,
        longitude: DataTypes.FLOAT,
        schedule_operational: DataTypes.STRING,
        image_url: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'UMKM',
    });

    return UMKM;
};