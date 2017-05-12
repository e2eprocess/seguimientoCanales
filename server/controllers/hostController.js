var db = require('./controllerPg').db;
var logger = require('../gestionLog').logger;

function getIdHost (req, res, next) {

	var parametros = {
		$idchannel: req.params.idchannel,
		$name: req.params.name+'%'
	};

	db.any('select a.idhost, \
					b.name\
			from \"E2E\".clon a, \"E2E\".host b \
			where idchannel = ${$idchannel} \
			and a.name::text like ${$name} \
			and a.idhost = b.idhost \
			group by 1,2 \
			order by 1', parametros)
		.then(function(data) {
			res.status(200)
				.json({
					data: data
				});
			})
			.catch(function (err) {
				logger.error(err);
				res.status(500).send({message: 'Error al devolver el idhost'});
			});
}

function getDateAndDatavalueHost (req, res, next) {

	var parametros = {
		$maquina: req.params.idhost,
		$desde: req.params.desde,
		$hasta: req.params.hasta,
		$canal: req.params.channel,
		$uuaa: req.params.uuaa+'%',
		$kpi: req.params.kpi,
	}

	db.any('select ((extract(epoch from a.timedata))::numeric)*1000 as x, \
			sum(a.datavalue) as y \
			FROM \"E2E\".clondata a, \"E2E\".clon B, \"E2E\".host c, \"E2E\".channel d, \"E2E\".kpi e \
	          WHERE a.idclon = b.idclon \
	          AND b.idhost = c.idhost \
	          AND b.idchannel = d.idchannel \
	          AND a.idkpi = e.idkpi \
	          AND c.idhost = ${$maquina} \
	          AND a.timedata between ${$desde} and ${$hasta} \
	          AND d.idchannel = ${$canal} \
	          AND b.name::text like ${$uuaa} \
	          AND e.name = ${$kpi} \
	          GROUP BY 1 \
	          ORDER BY 1  \
			', parametros)
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
				res.status(500).send({Status: 'Error al obtener HostData',
										message: err.message});
			})
}

function getDatavalueHost (req, res, next) {

	var parametros = {
		$maquina: req.params.idhost,
		$desde: req.params.desde,
		$hasta: req.params.hasta,
		$canal: req.params.channel,
		$uuaa: req.params.uuaa+'%',
		$kpi: req.params.kpi,
	}

	db.any('SELECT y FROM \
			(select ((extract(epoch from a.timedata))::numeric)*1000 as x, \
				sum(a.datavalue) as y \
				FROM \"E2E\".clondata a, \"E2E\".clon B, \"E2E\".host c, \"E2E\".channel d, \"E2E\".kpi e \
		          WHERE a.idclon = b.idclon \
		          AND b.idhost = c.idhost \
		          AND b.idchannel = d.idchannel \
		          AND a.idkpi = e.idkpi \
		          AND c.idhost = ${$maquina} \
		          AND a.timedata between ${$desde} and ${$hasta} \
		          AND d.idchannel = ${$canal} \
		          AND b.name::text like ${$uuaa} \
		          AND e.name = ${$kpi} \
		          GROUP BY 1 \
		          ORDER BY 1)as T1  \
				', parametros)
		.then(function(data) {

			//Lectura datos y transformación de json a Array
			var array = data.map((elem) => {
				return  parseFloat(elem.y)
			})

			//Devuelve el array si es una ejecuión correcta
			res.status(200)
				.send({
					data: array
				});
			})


			.catch(function (err) {
				logger.error(err);
				res.status(500).send({Status: 'Error al obtener HostData',
										message: err.message});
			})
}


module.exports = {
	getIdHost,
	getDateAndDatavalueHost,
	getDatavalueHost
}