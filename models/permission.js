'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Permission extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Endpoint)
            this.belongsToMany(models.UserRole, { through: 'UserPermissionJunction' })
            this.belongsToMany(models.AdminRole, { through: 'AdminPermissionJunction' })
        }
    }
    Permission.init({
        method: {
            type: DataTypes.STRING,
            allowNull: false
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: 'Permission',
    });
    return Permission;
};