'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
require('dotenv').config();
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  let dbName, dbUser, dbPassword, dbHost, dbPort;
  if (env === 'production') {
    dbName = process.env.DB_NAME_PROD;
    dbUser = process.env.DB_USER_PROD;
    dbPassword = process.env.DB_PASSWORD_PROD;
    dbHost = process.env.DB_HOST_PROD;
    dbPort = process.env.DB_PORT_PROD;
  } else if (env === 'test') {
    dbName = process.env.DB_NAME_TEST;
    dbUser = process.env.DB_USER;
    dbPassword = process.env.DB_PASSWORD;
    dbHost = process.env.DB_HOST;
    dbPort = process.env.DB_PORT;
  } else {
    dbName = process.env.DB_NAME;
    dbUser = process.env.DB_USER;
    dbPassword = process.env.DB_PASSWORD;
    dbHost = process.env.DB_HOST;
    dbPort = process.env.DB_PORT;
  }
  sequelize = new Sequelize(
    dbName,
    dbUser,
    dbPassword,
    {
      host: dbHost,
      port: dbPort,
      dialect: 'postgres',
      logging: false
    }
  );
}

const modelDefiners = [
  require("./favorite"),
  require("./publisher"),
  require("./style"),
  require("./viewer"),
  require("./viewerstyle"),
  require("./publishersetting")
];

modelDefiners.forEach(modelDefiner => {
  const model = modelDefiner(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
