'use strict';
const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@db/coderchat'
);

module.exports = {
  sequelize,
  DataTypes
};