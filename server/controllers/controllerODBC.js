'use strict'

var odbc = require("odbc"),
	db = new odbc.Database();


db.open("DSN=NZSQL;UID=xe27219;PWD=yX5CPcdi", function(err)
{

    if (err) {
        //Something went bad
        console.log(err);

        //Let's not go any further
        return;
    }

});

exports.dbODBC = db;