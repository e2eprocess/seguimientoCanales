var db = require('./controllerPg').db;
var logger = require('../gestionLog').logger;

function getNameDescriptionMonitor (req, res, next) {
	var idmonitor = req.params.idmonitor;
	db.one('select name, description \
			from \"E2E\".monitor \
			where idmonitor = $1', idmonitor)
		.then((data)=>{
			res.status(200)
				.json({
					data: data
				});
		})
		.catch(function (err) {
				logger.error(err);
				res.status(500).send({message: 'Error al devolver el nombre y la descripción del monitor'});
		})
}

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

function getDate(req, res, next) {
	var idmonitor = req.params.idmonitor,
		 desde = req.params.desde,
		 hasta = req.params.hasta;

	var parametros = {
		$idmonitor: idmonitor,
		$desde: desde,
		$hasta: hasta
	}

	db.any('select distinct(((extract(epoch from timedata))::numeric)*1000) as x \
		from \"E2E\".monitordata \
		where idmonitor = ${$idmonitor} \
		and timedata between ${$desde} and ${$hasta} \
		order by 1', parametros)
		.then((data) => {
			var datos = data.map((elem) => {
				return [parseInt(elem.x)]
			})
			res.status(200).send({data: datos});
		})
		.catch(function (err) {
				logger.error(err);
				res.status(500).send({Status: 'Error al obtener la fecha'});
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

function getDataMonitorInforme(req, res, next){
	var idmonitor = req.params.idmonitor;
	var fecha = req.params.fecha;
	var interval = req.params.interval;
	var kpi = req.params.kpi;
	var hour = 'hour';

	var parametros = {
		$idmonitor: idmonitor,
		$fecha: fecha,
		$interval: interval,
		$kpi: kpi,
		$hour: hour

	};

	db.any('SELECT ((extract(epoch from fecha))::numeric)*1000 as x, \
					peticiones as y \
			FROM ( \
				SELECT 	date_trunc(${$hour}, B.timedata) as fecha, \
    			     	c.name as nombre, \
              			sum(B.datavalue)::DECIMAL(10,2) as peticiones\
      			FROM \"E2E\".monitor A, \"E2E\".monitordata B, \"E2E\".kpi C \
      			WHERE A.idmonitor = ${$idmonitor} \
  				AND 	B.timedata > (TIMESTAMP ${$fecha} - INTERVAL ${$interval})\
              	AND B.timedata <= (TIMESTAMP ${$fecha}) \
                AND C.name = ${$kpi} \
                AND B.idkpi = c.idkpi \
                AND A.idmonitor = B.idmonitor \
                GROUP BY 1,2 \
              	ORDER BY 1 asc ) as T1 ', parametros)
		.then((data)=>{
			res.status(200).json({data:data});
		}).catch((err)=>{
			logger.error(err);
			res.status(500).send({message: 'Error al devolver los datos del monitor para el Informe'});
		});
}


module.exports = {
  getMonitors,
  getDateAndDataValueMonitor,
  getDataValueMonitor,
  getWaterMark,
  getNameDescriptionMonitor,
  getDate,
  getDataMonitorInforme
}