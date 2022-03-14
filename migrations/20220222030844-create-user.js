'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      birthday: {
        type: Sequelize.DATE
      },
      birthplace: {
        type: Sequelize.STRING
      },
      sex: {
        type: Sequelize.STRING
      },
      education: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.INTEGER
      },
      hobby: {
        type: Sequelize.STRING
      },
      employeed_at: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      tokens: {
        type: Sequelize.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue('tokens'));
        },
        set: function (val) {
          return this.setDataValue('tokens', JSON.stringify(val))
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};