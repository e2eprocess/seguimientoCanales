var db = require('./controllerPg').db;
var logger = require('../gestionLog').logger;

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