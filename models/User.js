const { DataTypes} = require("sequelize");
const sequelize = require('../utils/database');
const File = require("./File");

const User = sequelize.define('User', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isUnique(value, done) {
          User.findOne({where:{username:value}})
          .then((username) => {            
            if (username) {
              done(new Error('error: username already exist'));
            }
            done()
          })
      }
    }
},
password: {
    type: DataTypes.STRING(64),
    is: /^[0-9a-f]{64}$/i
  },
  token: {
    type: DataTypes.STRING
  }
})


module.exports = User;