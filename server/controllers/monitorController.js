var db = require('./controllerPg').db;
var logger = require('../gestionLog').logger;

function getMonitors (req, res, next) {
	var iduuaa = req.params.iduuaa;
	db.any('select idmonitor, name \
			from \"E2E\".monitor \
			where iduuaa = $1', iduuaa)
		.then(function(data) {
			res.status(200)
				.json({
					data: data
				});
			})
			.catch(function (err) {
				logger.error(err);
				res.status(500).send({message: 'Error al devolver el id del monitor'});
			})
}

function getDateAndDataValueMonitor (req, res, next) {
	var idmonitor = req.params.idmonitor;
	var namekpi = req.params.namekpi;
	var desde = req.params.desde;
	var hasta = req.params.hasta;

	var parametros = {
		$idmonitor: idmonitor,
		$namekpi: namekpi,
		$desde: desde,
		$hasta: hasta,

	};

	db.any('select ((extract(epoch from a.timedata))::numeric)*1000 as x, \
			a.datavalue as y\
			from \"E2E\".monitordata a, \"E2E\".kpi b \
			where a.idmonitor = ${$idmonitor} \
			and b.name = ${$namekpi} \
			and a.idkpi = b.idkpi \
			and a.timedata between ${$desde} and ${$hasta} \
			order by 1', parametros)
		.then(function(data) {

			//Lectura datos y transformación de json a Array
			var array = data.map((elem) => {
				return [ parseInt(elem.x), parseFloat(elem.y)]
			})

			//Devuelve el array si es una ejecuión correcta
			res.status(200)
				.send({
					data: array
				});
			})


			.catch(function (err) {
				logger.error(err);
				res.status(500).send({Status: 'Error al obtener MonitorData'});
			})
}


function getDataValueMonitor (req, res, next) {
	var idmonitor = req.params.idmonitor;
	var namekpi = req.params.namekpi;
	var desde = req.params.desde;
	var hasta = req.params.hasta;

	var parametros = {
		$idmonitor: idmonitor,
		$namekpi: namekpi,
		$desde: desde,
		$hasta: hasta,

	};

	db.any('select y \
				from(select ((extract(epoch from a.timedata))::numeric)*1000 as x, \
					a.datavalue as y\
					from \"E2E\".monitordata a, \"E2E\".kpi b \
					where a.idmonitor = ${$idmonitor} \
					and b.name = ${$namekpi} \
					and a.idkpi = b.idkpi \
					and a.timedata between ${$desde} and ${$hasta} \
					order by 1)as T1', parametros)
		.then(function(data) {

			//Lectura datos y transformación de json a Array
			var array = data.map((elem) => {
				return parseFloat(elem.y)
			})

			//Devuelve el array si es una ejecuión correcta
			res.status(200)
				.send({
					data: array
				});
			})


			.catch(function (err) {
				logger.error(err);
				res.status(500).send({Status: 'Error al obtener MonitorData'});
			})
}


function getWaterMark(req, res, next){
	
	var arr = req.params.monitors;
	arr = arr.split(',');

	var params = [];
	arr.forEach((elemto, index)=>{
		params.push('$' + (index+1));
	})

	//db.one('SELECT ((extract(epoch from a.datemark))::numeric)*1000 as fecha, \
	db.one('SELECT a.datemark as fecha, \
          a.valuemark as max_peticiones \
          FROM \"E2E\".watermark a \
          WHERE a.idmonitor IN (' + params.join(',') + ') \
          ORDER BY 2 DESC \
          LIMIT 1', arr)
		.then(function(data) {
				res.status(200)
					.json({
						data: data
					});
				})
				.catch(function (err) {
					logger.error(err);
					res.status(500).send({message: 'Error al devolver el watermark'});
				})
}


module.exports = {
  getMonitors,
  getDateAndDataValueMonitor,
  getDataValueMonitor,
  getWaterMark
}