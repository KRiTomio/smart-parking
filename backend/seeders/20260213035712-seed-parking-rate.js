'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('parking_rate', [
      {
        price_per_hour: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('parking_rate', null, {});
  }
};
