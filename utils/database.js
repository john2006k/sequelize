const Sequelize = require('sequelize')

const DB_NAME = 'test'
const USER_NAME = 'root'
const PASSWORD = 'root'

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
  host: 'localhost',
  dialect: 'mysql'
})

module.exports = sequelize