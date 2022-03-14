'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AdminRole extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Admin)
            // this.belongsToMany(models.Admin, { through: 'AdminRolesJunction' })
            this.belongsToMany(models.Permission, { through: 'AdminPermissionJunction' })
        }
    }
    AdminRole.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
        },
        isSuper: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'AdminRole',
        timestamps: false
    });
    return AdminRole;
};