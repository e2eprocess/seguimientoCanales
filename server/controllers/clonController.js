var db = require('./controllerPg').db;

function getIdClon (req, res, next) {

	var parametros = {
		$idchannel: req.params.idchannel,
		$name: req.params.name+'%'
	};

	db.any('select idclon, name, description \
			from \"E2E\".clon \
			where idchannel = ${$idchannel} \
			and name::TEXT LIKE ${$name}', parametros)
		.then(function(data) {
			res.status(200)
				.json({
					data: data
				});
			})
			.catch(function (err) {
				console.log(err);
				res.status(500).send({message: 'Error al devolver el idclon'});
			});
}

function getClonDataComparativa (req, res, next) {

	var parametros = {
		$idclon: req.params.idclon,
		$desde: req.params.desde,
		$hasta: req.params.hasta,
		$kpi: req.params.kpi,
	}

	db.any('SELECT ((extract(epoch from b.timedata))::numeric)*1000 as x, \
				b.datavalue as y \
			FROM \"E2E\".clon A, \"E2E\".clondata B, \"E2E\".kpi C \
			WHERE A.idclon = ${$idclon} \
			AND B.timedata between ${$desde} and ${$hasta} \
			AND c.name = ${$kpi} \
			AND b.idkpi = c.idkpi \
			AND a.idclon = b.idclon \
			ORDER BY 1 asc', parametros)
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
				console.log(err);
				res.status(500).send({Status: 'Error al obtener ClonData',
										message: err.message});
			})
}

module.exports = {
	getIdClon,
	getClonDataComparativa
}