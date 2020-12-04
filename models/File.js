const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const User = require("./User");

const File = sequelize.define("File", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// File.hasMany(User, {
//   foreignKey: 'userId',
//   onDelete: 'RESTRICT',
//   onUpdate: 'CASCADE'
// });

module.exports = File;

