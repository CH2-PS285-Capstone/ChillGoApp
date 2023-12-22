'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Places extends Model {
        static associate(models) {
            this.hasMany(models.ratingusers, { foreignKey: 'place_id', as: 'ratings' });
            this.belongsTo(models.UMKM, { foreignKey: 'umkm_id', as: 'umkm' });

        }
    }
    Places.init({
        place_name: DataTypes.STRING,
        umkm_id: DataTypes.INTEGER,
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