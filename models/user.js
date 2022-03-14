'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWTSECRET = process.env.JWTSECRET;

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // this.belongsToMany(models.UserRole, {through: 'UserRolesJunction'})
            this.belongsTo(models.UserRole)
        }
        static async findByCredentials(username, password) {
            const user = await User.findOne({ where: { username } }).catch(err => console.log('findByCredeintials - find user', err))
            if(!user) throw new Error("There's no such user")
            const passwordMatch = await bcrypt.compare(password, user.password)
            if(!passwordMatch) throw new Error("Password is wrong!");
            return user
        }
        async generateAuthToken() {
            const user = this;
            const token = jwt.sign({ id: user.id.toString() }, JWTSECRET);
            user.tokens = user.tokens ? user.tokens.concat({ token }) : [{ token }]
            await user.save()
            return token
        }
    }
    User.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        title: DataTypes.STRING,
        birthday: DataTypes.DATE,
        birthplace: DataTypes.STRING,
        sex: DataTypes.STRING,
        education: DataTypes.STRING,
        phone: DataTypes.INTEGER,
        hobby: DataTypes.STRING,
        employeed_at: DataTypes.DATE,
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
        modelName: 'User',
        hooks: {
            beforeCreate: async (user, options) => {
                user.password = await bcrypt.hash(user.password, 8)
            }
        }
    });
    return User;
};