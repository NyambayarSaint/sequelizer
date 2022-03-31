'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWTSECRET = process.env.JWTSECRET;

module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // this.belongsToMany(models.AdminRole, {through: 'AdminRolesJunction'})
            this.belongsTo(models.AdminRole)
            this.belongsTo(models.File)
        }
        static async findByCredentials(username, password) {
            const admin = await Admin.findOne({ where: { username } }).catch(err => console.log('findByCredeintials - find admin', err))
            if(!admin) throw new Error("There's no such admin")
            const passwordMatch = await bcrypt.compare(password, admin.password)
            if(!passwordMatch) throw new Error("Password is wrong!");
            return admin
        }
        async generateAuthToken() {
            const admin = this;
            const token = jwt.sign({ id: admin.id.toString() }, JWTSECRET);
            admin.tokens = admin.tokens ? admin.tokens.concat({ token }) : [{ token }]
            await admin.save()
            return token
        }
    }
    Admin.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: DataTypes.STRING,
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING,
        description: DataTypes.STRING,
        tokens: {
            type: DataTypes.TEXT,
            get: function () {
                return JSON.parse(this.getDataValue('tokens'));
            },
            set: function (val) {
                return this.setDataValue('tokens', JSON.stringify(val))
            }
        }
    }, {
        sequelize,
        modelName: 'Admin',
        hooks: {
            beforeCreate: async (admin, options) => {
                admin.password = await bcrypt.hash(admin.password, 8)
            }
        }
    });
    return Admin;
};