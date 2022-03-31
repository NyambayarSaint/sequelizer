'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
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
            this.belongsTo(models.Department)
        }
        static async findByCredentials(username, password) {
            const base = "http://192.168.10.11:8082"
            const [companyid, userid] = username.split('\\')
            const {data: {access_token: access_token}} = await axios.post(base+'/api/auth-service/login', {
                userid,
                password,
                companyid,
                ipaddress: "string",
                macaddress: "string"
            })
            const headers = { 'Authorization': 'Bearer ' + access_token }
            const { userID, EmpID, CompanyID, DepID, positionID } = jwt.decode(access_token)
            const {data: {retdata: detail}} = await axios(`${base}/api/hrms/hr/employee/get?EmployeeID=${EmpID}`, {headers})
            console.log(detail, 'detail')

            // const user = await User.findOne({ where: { username } }).catch(err => console.log('findByCredeintials - find user', err))
            // if(!user) throw new Error("There's no such user")
            // const passwordMatch = await bcrypt.compare(password, user.password)
            // if(!passwordMatch) throw new Error("Password is wrong!");
            // return user
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
        description: DataTypes.STRING,
        code: DataTypes.STRING,
        fullname: DataTypes.STRING,
        posname: DataTypes.STRING,
        initialized: DataTypes.BOOLEAN,
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