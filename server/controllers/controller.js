var db = require('./controllerPg').db;
var logger = require('../gestionLog').logger;

/** @description Devuelve el id y la descripción de la UUAA.  
 * @param {idchannel} Indentificador único del canal.
 * @param {name} Nombre de la UUAA
 * @return {data} Unico registro - id y la descripción de la UUAA.
 */
function getIdUuaa (req, res, next) {

	var parametros = {
		$idchannel: req.params.idchannel,
		$name: req.params.name
	};

	db.one('select iduuaa, description \
			from \"E2E\".uuaa \
			where name = ${$name} \
			and idchannel =${$idchannel}', parametros)
		.then(function(data) {
			res.status(200)
				.json({
					data: data
				});
			})
			.catch(function (err) {
				logger.error(err);
				res.status(500).send({message: 'Error al devolver la UUAA'});
			})
}

/** @description Devuelve el id y la descripción del canal.  
 * @param {channel} Indentificador único del canal.
 * @return {data} Unico registro - idchannel y la descripción del canal.
 */
function getIdChannel (req, res, next) {
	var channel = req.params.channel;
	db.one('select idchannel, description \
			from \"E2E\".channel \
			where name = $1', channel)
		.then(function(data) {
			res.status(200)
				.json({
					data: data
				});
			})
			.catch(function (err) {
				logger.error(err);
				res.status(500).send({message: 'Error al devolver el idChannel'});
			})
}

module.exports = {
  getIdUuaa,
  getIdChannel
}