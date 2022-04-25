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

      this.hasMany(models.User)
      this.hasMany(models.Admin)

      this.hasMany(models.Department)
      this.hasMany(models.Sector)
      this.hasMany(models.Unit)

      this.hasMany(models.Folder)
      this.hasMany(models.News)
      this.hasMany(models.Event)
    }
  }
  Company.init({
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING,
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
    modelName: 'Company',
  });
  return Company;
};