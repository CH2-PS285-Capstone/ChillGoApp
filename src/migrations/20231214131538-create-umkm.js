'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UMKMs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      umkm_name: {
        type: Sequelize.STRING
      },
      umkm_address: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      call_number: {
        type: Sequelize.STRING
      },
      product_price: {
        type: Sequelize.STRING
      },
      schedule_operational: {
        type: Sequelize.STRING
      },
      product_description: {
        type: Sequelize.STRING
      },
      umkm_ratings: {
        type: Sequelize.FLOAT
      },
      image_url: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UMKMs');
  }
};