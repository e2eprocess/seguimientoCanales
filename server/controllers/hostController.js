var db = require('./controllerPg').db;
var logger = require('../gestionLog').logger;

/** @description Devuelve los idhost y el nombre de los host pertenecientes al canal y la UUAA indicadas.  
 * @param {idhost} Indentificador único del host
 * @param {name} nombre de la UUAA
 * @return {data} Array de objetos (idhost y nombre)
 */
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

/** @description Devuelve los idhost y el nombre de los host pertenecientes al canal.  
 * @param {idchannel} Indentificador único del host
 * @return {data} Array de objetos (idhost, name)
 */
function getIdHostChannel (req, res, next) {
	var idchannel = req.params.idchannel
	db.any('select a.idhost, b.name \
			from \"E2E\".hostbychannel a, \"E2E\".host b \
			where a.idchannel = $1 \
			and b.description not like \'%ASO%\' \
			and b.description not like \'%APX%\' \
			and a.idhost = b.idhost \
			order by 1', idchannel)
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


/** @description Devuelve los valores de CPU o MEMORIA de un HOST hasta la fecha indicada.  
 * @param {idhost} Indentificador único del host
 * @param {kpi} Nombre del kpi (CPU o MEMORIA)
 * @param {hasta} Fecha límite de la búsqueda
 * @return {array} Array con las fechas y valor de kpi solicitados
 */
function getDateAndDatavalueHost (req, res, next) {
	var parametros = {
		$maquina: req.params.idhost,
		$kpi: req.params.kpi,
		$desde: req.params.desde,
		$hasta: req.params.hasta
	}
	db.any('select ((extract(epoch from A.timedata))::numeric)*1000 as x, \
			A.datavalue as y \
			FROM \"E2E\".hostdata A, \"E2E\".kpi B \
			WHERE A.idhost = ${$maquina} \
			AND B.name = ${$kpi} \
	        AND A.idkpi = B.idkpi \
			AND A.timedata between ${$desde} and ${$hasta} \
			order by 1', parametros)
		.then(function(data) {
			//Lectura datos y transformación de json a Array
			var datos = data.map((elem) => {
				return [ parseInt(elem.x), parseFloat(elem.y)]
			})
			//Devuelve el array si es una ejecuión correcta
			res.status(200)
				.send({
					data: datos
				});
			})
			.catch(function (err) {
				logger.error(err);
				res.status(500).send({Status: 'Error al obtener HostData',
										message: err.message});
			})
}

/** @description Devuelve los valores de CPU o MEMORIA de un HOST hasta la fecha indicada.  
 * @param {idhost} Indentificador único del host
 * @param {kpi} Nombre del kpi (CPU o MEMORIA)
 * @param {hasta} Fecha límite de la búsqueda
 * @return {array} Array con las fechas y valor de kpi solicitados
 */
function getDatavalueHost (req, res, next) {
	var parametros = {
		$maquina: req.params.idhost,
		$kpi: req.params.kpi,
		$desde: req.params.desde,
		$hasta: req.params.hasta
	}
	db.any('select  y as data from\
			(select ((extract(epoch from A.timedata))::numeric)*1000 as x, \
			A.datavalue as y \
			FROM \"E2E\".hostdata A, \"E2E\".kpi B, \"E2E\".host C \
			WHERE c.name = ${$maquina} \
			AND B.name = ${$kpi} \
	        AND A.idkpi = B.idkpi \
	        AND A.idhost = C.idhost \
			AND A.timedata between ${$desde} and ${$hasta} \
			order by 1)as t1', parametros)
		.then(function(data) {
			//Lectura datos y transformación de json a Array
			var datos = data.map((elem) => {
				return [ parseInt(elem.x), parseFloat(elem.y)]
			})
			//Devuelve el array si es una ejecuión correcta
			res.status(200)
				.send({
					data: datos
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
	getIdHostChannel,
	getDateAndDatavalueHost,
	getDatavalueHost
}