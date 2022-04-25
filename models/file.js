'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.News, { through: 'MediaNewsImagesJunction'})
      this.belongsToMany(models.Album, { through: 'MediaAlbumImagesJunction'})
      this.belongsToMany(models.Material, { through: 'MediaMaterialImagesJunction'})
      this.hasMany(models.Company)
      this.hasMany(models.User)
      this.hasMany(models.Admin)
      this.hasMany(models.Post)
    }
  }
  File.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: DataTypes.STRING,
    ext: DataTypes.STRING,
    size: DataTypes.INTEGER,
    url: DataTypes.STRING,
    originalname: DataTypes.STRING,
    type: DataTypes.STRING,
    systemPath: DataTypes.STRING,
    createdBy: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'File',
  });
  return File;
};