'use strict'

/*
Gestión conexión BBDD postgreSql.
*/

var promise = require('bluebird');
var config = require('../config').config;

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = config.db.pgBBDD;
//var connectionString = global.config.db.pgLocal;
var db = pgp(connectionString);
pgp.pg.types.setTypeParser(1114, str => str);


exports.db = db;
exports.pgp = pgp;