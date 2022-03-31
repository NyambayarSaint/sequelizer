'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jobposting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Company)
    }
  }
  Jobposting.init({
    title: DataTypes.STRING,
    contents: {
      type: DataTypes.TEXT,
      get: function () {
          return JSON.parse(this.getDataValue('contents'));
      },
      set: function (val) {
          return this.setDataValue('contents', JSON.stringify(val))
      }
  }
  }, {
    sequelize,
    modelName: 'Jobposting',
  });
  return Jobposting;
};