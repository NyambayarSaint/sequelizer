'use strict';
const { Model } = require('sequelize');
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');
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
            this.belongsTo(models.File)
            this.belongsToMany(models.Event, { through: 'UserEventJunction' })

            this.belongsTo(models.Company)
            this.belongsTo(models.Department)
            this.belongsTo(models.Sector)
            this.belongsTo(models.Unit)

            this.hasMany(models.Post)
        }
        static async findByCredentials(username, password) {
            try {
                const base = "http://192.168.10.11:8082"
                console.log(username, password, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                const [companyid, userid] = username.split('\\')
                const { data: { access_token: access_token } } = await axios.post(base + '/api/auth-service/login', { userid, password, companyid, ipaddress: "string", macaddress: "string" })
                const { userID, EmpID, CompanyID, DepID, positionID } = jwt.decode(access_token)
                const foundUserToSend = await User.findOne({ where: { id: Number(EmpID) } })
                console.log(foundUserToSend, 'foundusertosend')
                if(!foundUserToSend) return { error: false, loadNewUsers: true, credentials: { userid, password, companyid, ipaddress: "string", macaddress: "string" }, EmpID }
                return { user: foundUserToSend, error: false }
            } catch(e) {
                console.log('findByCredentials catch', e)
                return { error: true, errorDetails: e }
            }
        }
        async generateAuthToken() {
            const user = this;
            const token = jwt.sign({ id: user.id.toString(), user: true }, JWTSECRET);
            user.tokens = user.tokens ? user.tokens.concat({ token }) : [{ token }]
            await user.save()
            return token
        }
    }
    User.init({
        // id: {
        //     type: DataTypes.UUID,
        //     defaultValue: DataTypes.UUIDV4,
        //     allowNull: false,
        //     primaryKey: true
        // },
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        greenjwt: DataTypes.TEXT,
        slogan: DataTypes.STRING,
        hobby: DataTypes.STRING,
        reward: DataTypes.STRING,
        firstname: DataTypes.STRING,
        firstname_enus: DataTypes.STRING,
        mobilephone: DataTypes.STRING,
        order: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 10
        },
        details: {
            type: DataTypes.TEXT,
            get: function () {
                return JSON.parse(this.getDataValue('details'));
            },
            set: function (val) {
                return this.setDataValue('details', JSON.stringify(val))
            }
        },
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
        // hooks: {
        //     beforeCreate: async (user, options) => {
        //         user.password = await bcrypt.hash(user.password, 8)
        //     }
        // }
    });
    return User;
};