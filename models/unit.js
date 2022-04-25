'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.User)

      this.belongsTo(models.Company)
      this.belongsTo(models.Department)
      this.belongsTo(models.Sector)
    }
  }
  Unit.init({
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING,
    depid: DataTypes.STRING,
    depcode: DataTypes.STRING,
    order: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 10
    },
    isShow: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Unit',
  });
  return Unit;
};