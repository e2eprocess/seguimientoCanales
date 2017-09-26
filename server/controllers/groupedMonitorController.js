var db = require('./controllerPg').db;
var logger = require('../gestionLog').logger;

function getGroupedWaterMark(req, res, next){
	
	var monitor = req.params.monitor,
		 fecha = req.params.fecha;

	var parametros = {
		$monitor: monitor,
		$fecha: fecha
	};

	db.one('SELECT to_char(date(gd.datemark),\'DD-MM-YYYY\') AS fechatitulo \
					, gd.datemark AS fecha \
					, gd.valuemark AS valor \
			FROM \"E2E\".groupedwatermark gd, \"E2E\".groupedmonitor gm \
			WHERE gm.name = ${$monitor} \
			AND gm.idmonitor = gd.idmonitor \
			AND gd.datemark <> ${$fecha} \
			ORDER BY 2 DESC \
			LIMIT 1', parametros)
		.then(function(data) {
				res.status(200)
					.json({
						date: data.fecha,
						dateTitle: data.fechatitulo,
						datavalue: parseFloat(data.valor)
					});
				})
		.catch(function (err) {
			logger.error(err);
			res.status(500).send({message: 'Error al devolver el watermark'});
		});
}

function getDateAndThroughputGrouped(req, res, next){
	var tipo = req.params.tipo,
		canal = req.params.canal,
		fecha = req.params.fecha;
	
	var parametros = {
		$tipo: tipo,
		$canal: canal,
		$fecha: fecha
	};

	db.one('SELECT to_char(date(gd.timedata),\'DD-MM-YYYY\') as fecha, \
				gd.datavalue as valor\
			FROM \"E2E\".groupedmonitordata gd, \"E2E\".groupedmonitor gm \
			WHERE gd.type = ${$tipo} \
			AND gm.name = ${$canal} \
			AND gd.idmonitor = gm.idmonitor \
			AND gd.timedata = ${$fecha}', parametros)
		.then(function(data) {
				res.status(200)
					.json({
						date: data.fecha,
						datavalue: parseFloat(data.valor)
					});
				})
		.catch(function (err) {
			logger.error(err);
			res.status(500).send({message: 'Error al devolver el watermark'});
		});
}

function getDataGrouped(req,res,next){
	var monitor = req.params.monitor,
		tipo = req.params.tipo,
		kpi = req.params.kpi,
		fechaDesde = req.params.fechaDesde,
		fechaHasta = req.params.fechaHasta;

	var parametros = {
		$monitor: monitor,
		$tipo: tipo,
		$kpi: kpi,
		$fechaDesde: fechaDesde,
		$fechaHasta: fechaHasta
	};

	console.log(parametros);
	
	db.any('SELECT gd.datavalue as y \
			FROM \"E2E\".groupedmonitordata gd, \"E2E\".groupedmonitor gm, \"E2E\".kpi kp \
			WHERE gm.name = ${$monitor} \
			AND gm.idmonitor = gd.idmonitor \
			AND gd.type =${$tipo} \
			AND kp.name = ${$kpi} \
			AND gd.idkpi = kp.idkpi \
			AND gd.timedata BETWEEN ${$fechaDesde} AND ${$fechaHasta} \
			ORDER BY timedata', parametros)
		.then((data)=>{

			var array = data.map((elem)=>{
				return parseFloat(elem.y)
			})
			res.status(200)
			.json({
				data : array
			});
		})
		.catch((err)=>{
			logger.error(err);
			res.status(500).send({message: 'Error en el servidor al devolver datos desdegroupedmonitordata '});
		});

}

module.exports = {
	getGroupedWaterMark,
	getDateAndThroughputGrouped,
	getDataGrouped
}