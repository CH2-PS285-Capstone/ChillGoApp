'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ratingusers extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Places, { foreignKey: 'place_id' });
            // define association here
        }
    }
    ratingusers.init({
        user_id: DataTypes.INTEGER,
        place_id: DataTypes.INTEGER,
        place_rating: DataTypes.INTEGER,
        place_name: DataTypes.STRING,
        category: DataTypes.STRING,
        city: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'ratingusers',
    });
    return ratingusers;
};