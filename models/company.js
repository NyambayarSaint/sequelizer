'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.File)
      this.belongsTo(models.Jobposting)
      this.hasMany(models.Department)
    }
  }
  Company.init({
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Company',
  });
  return Company;
};