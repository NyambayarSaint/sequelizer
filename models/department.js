'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.User)
      this.belongsTo(models.Company)
    }
  }
  Department.init({
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING,
    depid: DataTypes.STRING,
    depcode: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Department',
  });
  return Department;
};