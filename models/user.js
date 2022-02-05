'use strict';
const { DATE } = require('sequelize/types');
const {sequelize, DataTypes} = require('./sequelize-loader');

const User = sequelize.define(
  'users',
  {
    userId: {
      type: DataTypes.DECIMAL,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nickname: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = User;