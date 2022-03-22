'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Newstype extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.News)
    }
  }
  Newstype.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Newstype',
  });
  return Newstype;
};