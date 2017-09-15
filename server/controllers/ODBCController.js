var db = require('./controllerODBC').dbODBC;
var logger = require('../gestionLog').logger;

function getPeticionesDia(req, res, next){

	var fecha = req.params.fecha;

	db.query("SELECT DATE as Fecha\
              , SUM(EMH_TRANSACTIONS)+SUM(MSGQ_TRANSACTIONS) AS ejecuciones \
              FROM CFSC.XAKGUTMOD1E.IMS_TRAN_H \
              WHERE DATE = ? \
              AND IMS_SYSTEM_ID IN ('IMSEXT01', 'IMSEXT02', 'IMSEXT03', 'IMSEXT04') \
              AND TRANSACTION_NAME NOT LIKE '$%' \
              GROUP BY DATE \
              order by 1,2", [fecha], (error, result, info) => {
        if (error) {
        	logger.error(error);
			res.status(500).send({message: 'Error al devolver el número de ejecuciones Host'});
        	
        	return false;
        } else {
        	res.status(200)
				.json({
					data: result
				});
        }  
    });
}

function getMaxEjecuciones(req, res, next){
	
	var fecha = req.params.fecha;
      //hoy = req.params.hoy;

	db.query("SELECT * \
            FROM ( \
              SELECT FECHA, EJECS \
              FROM ( \
                SELECT DATE AS FECHA, SUM(MSGQ_TRANSACTIONS+EMH_TRANSACTIONS) AS EJECS \
                FROM CFSC..IMS_TRAN_H \
                WHERE DATE BETWEEN '2016-11-01' AND NOW()\
                AND IMS_SYSTEM_ID IN ('IMSEXT01', 'IMSEXT02', 'IMSEXT03', 'IMSEXT04') \
                AND TRANSACTION_NAME NOT LIKE '$%' \
                GROUP BY DATE \
              ) AS H01 \
              ORDER BY EJECS DESC \
              LIMIT 2) AS H02 \
            WHERE FECHA <> ? \
            LIMIT 1", [fecha], (error, result, info) => {
        if (error) {
        	logger.error(error);
			res.status(500).send({message: 'Error al devolver el número de ejecuciones Host'});
        	
        	return false;
        } else {
        	res.status(200)
				.json({
					data: result
				});
        }  
    });	
}

module.exports = {
	getPeticionesDia,
	getMaxEjecuciones
}