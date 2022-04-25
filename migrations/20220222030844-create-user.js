'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      // id: {
      //   type: Sequelize.UUID,
      //   defaultValue: Sequelize.UUIDV4,
      //   allowNull: false,
      //   primaryKey: true
      // },
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true
      },
      slogan: {
        type: Sequelize.STRING
      },
      hobby: {
        type: Sequelize.STRING
      },
      reward: {
        type: Sequelize.STRING
      },
      greenjwt: {
        type: Sequelize.TEXT
      },
      order: {
        type: Sequelize.FLOAT,
        defaultValue: 10,
        allowNull: false
      },
      firstname: {
        type: Sequelize.STRING
      },
      firstname_enus: {
        type: Sequelize.STRING
      },
      mobilephone: {
        type: Sequelize.STRING
      },
      details: {
        type: Sequelize.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue('details'));
        },
        set: function (val) {
          return this.setDataValue('details', JSON.stringify(val))
        }
      },
      tokens: {
        type: Sequelize.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue('tokens'));
        },
        set: function (val) {
          return this.setDataValue('tokens', JSON.stringify(val))
        }
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
    await queryInterface.dropTable('Users');
  }
};