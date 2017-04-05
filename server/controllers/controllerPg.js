'use strict'

var pg = require('pg');
global.config = require('../config');
var conString = process.env.DATABASE_URL || global.config.db.postgres;
pg.types.setTypeParser(1114, str => str);

function grafico1(req,res){
  var results = [];

  // Get a Postgres client from the connection pool
  pg.connect(conString, (err, client, done) => {

    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    // SQL Query > Select Data
    var query = client.query("select c.name, a.timedata,a.datavalue \
                                from \"E2E\".monitordata a, \"E2E\".kpi b, \"E2E\".monitor c \
                                where b.name = 'Time' \
                                and c.name = 'kyos_mult_web_posicioncuentas' \
                                and a.timedata = '2017-02-01 00:00:00' \
                                and b.idkpi = a.idkpi \
                                and c.idmonitor = a.idmonitor \
                                order by 2;");

    //Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
}

module.exports = {
  grafico1
}
