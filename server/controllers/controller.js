var db = require('./controllerPg').db;

function getUuaa (req, res, next) {
	var name = req.params.name;
	db.one('select iduuaa, description \
			from \"E2E\".uuaa \
			where name = $1', name)
		.then(function(data) {
			res.status(200)
				.json({
					data: data
				});
			})
			.catch(function (err) {
				res.status(500).send({message: 'Error al devolver la UUAA'});
			})
}

function getIdChannel (req, res, next) {
	var channel = req.params.channel;
	db.one('select idchannel \
			from \"E2E\".channel \
			where name = $1', channel)
		.then(function(data) {
			res.status(200)
				.json({
					data: data
				});
			})
			.catch(function (err) {
				res.status(500).send({message: 'Error al devolver la UUAA'});
			})
}




module.exports = {
  getUuaa,
  getIdChannel
}