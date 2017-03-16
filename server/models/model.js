'use strict'

const pg = require('pg');
var conString = process.env.DATABASE_URL || 'postgres://e2e:e2e@15.17.162.173:5432/E2Ereporting';
pg.types.setTypeParser(1114, str => str);

function getTiempo_respuesta() {

  const query = client.query("select c.name, a.timedata,a.datavalue \
                              from \"E2E\".monitordata a, \"E2E\".kpi b, \"E2E\".monitor c \
                              where b.name = 'Time' \
                              and c.name = 'kyos_mult_web_posicioncuentas' \
                              and a.timedata = '2017-02-01 00:00:00' \
                              and b.idkpi = a.idkpi \
                              and c.idmonitor = a.idmonitor \
                              order by 2;");

}
