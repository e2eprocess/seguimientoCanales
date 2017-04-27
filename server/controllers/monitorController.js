var db = require('./controllerPg').db;

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
				res.status(500).send({message: 'Error al devolver el id del monitor'});
			})
}

function getDataMonitorComparativa (req, res, next) {
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
				return [ parseInt(elem.x), parseInt(elem.y)]
			})

			//Devuelve el array si es una ejecuión correcta
			res.status(200)
				.send({
					data: array
				});
			})


			.catch(function (err) {
				res.status(500).send({Status: 'Error al obtener MonitorData',
										message: err.message});
			})
}

module.exports = {
  getMonitors,
  getDataMonitorComparativa
}