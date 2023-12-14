'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UMKM extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            UMKM.belongsTo(models.Places, { foreignKey: 'placeId', targetKey: 'id' });
            // define association here
        }
    }
    UMKM.init({
        umkm_name: DataTypes.STRING,
        umkm_address: DataTypes.STRING,
        category: DataTypes.STRING,
        call_number: DataTypes.STRING,
        product_price: DataTypes.STRING,
        schedule_operational: DataTypes.STRING,
        product_description: DataTypes.STRING,
        umkm_ratings: DataTypes.FLOAT,
        image_url: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'UMKM',
    });
    return UMKM;
};