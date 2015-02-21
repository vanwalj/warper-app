/**
 * Created by Jordan on 2/20/2015.
 */
"use strict";

var fs          = require('fs'),
    path        = require('path'),
    winston     = require('winston'),
    parameters  = require('../parameters'),
    Sequelize   = require('sequelize'),
    sequelize   = new Sequelize(parameters.db.sql.uri, { logging: winston.info }),
    db          = {};

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
