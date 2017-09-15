'use strict'

/*var odbc = require('odbc'),
    //cn = "DRIVER={NZSQL};SERVER=host;UID=user;PWD=password;DATABASE=dbname"
    connectionString = "DRIVER={NZSQL};UID=xe27219;PWD=yX5CPcdi";

var con = new odbc.Connection();
var prueba = con.getInfo();

console.log(con)

con.executeQuery((res, err) => 
    {  
        if( err != null )
        {
            console.log( err );
        }
    },
    "SELECT now()"
);*/

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

    db.query("select now()", [], function (error, result, info) {
        console.log("some random parameters");
        if (error) {console.log(error); return false;}
        console.log(result);
    });

});
