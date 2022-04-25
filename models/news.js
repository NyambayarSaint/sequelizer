'use strict';
const {
  Model
} = require('sequelize');
const slugify = require('slugify')
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
      this.belongsTo(models.Company)
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
    description: DataTypes.TEXT,
    slug: DataTypes.STRING,
    type: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'News',
    hooks: {
      beforeCreate: async (news, options) => {
        news.slug = slugify(news.title)
      },
      beforeUpdate: async (news, options) => {
        news.slug = slugify(news.title)
      }
    }
  });
  return News;
};