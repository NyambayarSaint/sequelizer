'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Newstype)
      this.belongsToMany(models.File, { through: 'MediaNewsImagesJunction', as: 'images' })
    }
  }
  News.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    slug: DataTypes.STRING,
    public: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'News',
  });
  return News;
};