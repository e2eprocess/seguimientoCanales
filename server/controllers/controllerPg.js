'use strict'

var promise = require('bluebird');
global.config = require('../config');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
//var connectionString = global.config.db.postgres;
var connectionString = global.config.db.pgLocal;
var db = pgp(connectionString);
pgp.pg.types.setTypeParser(1114, str => str);


exports.db = db;
exports.pgp = pgp;