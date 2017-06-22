var db = require('./controllerPg').db;
var logger = require('../gestionLog').logger;

/** @description Devuelve el idClon, el nombre y la descripción de los clones pertenecientes al canal.  
 * @param {idchannel} Indentificador del canal.
 * @param {name} Nombre de la UUAA
 * @return {data} idclon, nombre del clon y descripción del clon.
 */
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
				logger.error(err);
				res.status(500).send({message: 'Error al devolver el idclon'});
			});
}

/** @description Devuelve fecha y los valores de CPU o MEMORIA de un CLON entre las fechas indicadas.    
 * @param {idclon} Indentificador unico del CLON.
 * @param {desde} Fecha inicial de la búsqieda.
 * @param {hasta} Fecha límite de la búsqueda.
 * @param {kpi} Nombre del kpi (CPU o MEMORIA)
 * @return {data} Fecha y valor del consumo.
 */
function getDateAndDatavalueClon (req, res, next) {
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
			var datos  = data.map((elem) => {
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
				res.status(500).send({message: 'Error al obtener ClonData'});
			})
}

/** @description Devuelve los valores de CPU o MEMORIA de un CLON entre las fechas indicadas.    
 * @param {idclon} Indentificador unico del CLON.
 * @param {desde} Fecha inicial de la búsqieda.
 * @param {hasta} Fecha límite de la búsqueda.
 * @param {kpi} Nombre del kpi (CPU o MEMORIA)
 * @return {data} Valor del consumo
 */
function getDatavalueClon (req, res, next) {
	var parametros = {
		$idclon: req.params.idclon,
		$desde: req.params.desde,
		$hasta: req.params.hasta,
		$kpi: req.params.kpi,
	}
	db.any('select y from \
				(SELECT ((extract(epoch from b.timedata))::numeric)*1000 as x,  \
				b.datavalue as y \
				FROM \"E2E\".clon A, \"E2E\".clondata B, \"E2E\".kpi C \
				WHERE A.idclon = ${$idclon} \
				AND B.timedata between ${$desde} and ${$hasta} \
				AND c.name = ${$kpi} \
				AND b.idkpi = c.idkpi \
				AND a.idclon = b.idclon \
				ORDER BY 1 asc) as t1', parametros)
		.then(function(data) {
			//Lectura datos y transformación de json a Array
			var datos = data.map((elem) => {
				return parseFloat(elem.y)
			})
			//Devuelve el array si es una ejecuión correcta
			res.status(200)
				.send({
					data: datos
				});
			})
			.catch(function (err) {
				logger.error(err);
				res.status(500).send({message: 'Error al obtener ClonData'});
			})
}

/** @description Devuelve la fecha y los valores de CPU o MEMORIA de un CLON perteneciente a un host entre las fechas indicadas.    
 * @param {maquina} Indentificador unico del HOST.
 * @param {desde} Fecha inicial de la búsqieda.
 * @param {hasta} Fecha límite de la búsqueda.
 * @param {canal} Identificador del canal.
 * @param {uuaa} Nombre de la UUAA.
 * @param {kpi} Nombre del kpi (CPU o MEMORIA)
 * @return {data} Fecha formato epoch y valor del consumo.
 */
function getDateAndDatavalueClonByHost (req, res, next) {
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

/** @description Devuelve los valores de CPU o MEMORIA de un CLON perteneciente a un host entre las fechas indicadas.    
 * @param {maquina} Indentificador unico del HOST.
 * @param {desde} Fecha inicial de la búsqieda.
 * @param {hasta} Fecha límite de la búsqueda.
 * @param {canal} Identificador del canal.
 * @param {uuaa} Nombre de la UUAA.
 * @param {kpi} Nombre del kpi (CPU o MEMORIA)
 * @return {data} Valor del consumo.
 */
function getDatavalueClonByHost (req, res, next) {
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
			var datos = data.map((elem) => {
				return  parseFloat(elem.y)
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


/** @description Devuelve los valores de CPU o MEMORIA de un CLON perteneciente a un host entre las fechas indicadas.    
 * @param {maquina} Indentificador unico del HOST.
 * @param {desde} Fecha inicial de la búsqieda.
 * @param {hasta} Fecha límite de la búsqueda.
 * @param {canal} Identificador del canal.
 * @param {uuaa} Nombre de la UUAA.
 * @param {kpi} Nombre del kpi (CPU o MEMORIA)
 * @return {data} Valor del consumo.
 */
function getDataValueClonInforme (req, res, next) {
	var parametros = {
		$idclon: req.params.idclon,
		$fecha: req.params.fecha,
		$interval: req.params.interval,
		$kpi: req.params.kpi,
		$hour: 'hour'
	}
	db.any('SELECT ((extract(epoch from fecha))::numeric)*1000 as x, \
					peticiones as y \
			FROM ( \
				SELECT 	date_trunc(${$hour}, B.timedata) as fecha, \
    			     	c.name as nombre, \
              			max(B.datavalue)::DECIMAL(10,2) as peticiones\
      			FROM \"E2E\".clon A, \"E2E\".clondata B, \"E2E\".kpi C \
                  WHERE A.idclon = ${$idclon} \
  				AND 	B.timedata > (TIMESTAMP ${$fecha} - INTERVAL ${$interval})\
              	AND B.timedata <= (TIMESTAMP ${$fecha}) \
                AND C.name = ${$kpi} \
                AND B.idkpi = c.idkpi \
                AND A.idclon = B.idclon \
                GROUP BY 1,2 \
              	ORDER BY 1 asc ) as T1 ', parametros)
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





/*Módulos a exportar*/
module.exports = {
	getIdClon,
	getDateAndDatavalueClon,
	getDatavalueClon,
	getDateAndDatavalueClonByHost,
	getDatavalueClonByHost,
	getDataValueClonInforme
}