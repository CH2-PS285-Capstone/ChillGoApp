const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ratingusers extends Model {
        static associate(models) {
            this.belongsTo(models.Places, { foreignKey: 'place_id' });
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