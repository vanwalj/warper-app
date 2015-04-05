/**
 * Created by Jordan on 2/20/2015.
 */
'use strict';

var fs          = require('fs');
var path        = require('path');
var winston     = require('winston');
var Sequelize   = require('sequelize');

var sequelize   = new Sequelize(process.env.DB_URI || process.env.CLEARDB_DATABASE_URL, { logging: process.env.NODE_ENV === "test" ? winston.info : winston.info });
var db          = {};

fs
    .readdirSync(__dirname)
    .filter(function (fileName) {
        return (fileName !== "index.js");
    })
    .forEach(function (fileName) {
        var model = sequelize["import"](path.join(__dirname, fileName));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
