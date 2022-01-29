'use strict';
const {sequelize, DataTypes} = require('./sequelize-loader');

const Quiz = sequelize.define(
  'quiz',
  {
    quizid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    quizName: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tag: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdBy: {
      type: DataTypes.TEXT,
      allowNull: false
    }, 
    createUser: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    badReview: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Quiz;