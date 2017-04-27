var db = require('./controllerPg').db;

function getIdHost (req, res, next) {
	var idchannel = req.params.idchannel;
	var name = req.params.name;

	var parametros = {
		$idchannel: idchannel,
		$name: name+'%'
	}; 

	db.any('select idhost \
			from \"E2E\".clon \
			where idchannel = ${$idchannel} \
			and name::text like ${$name}\
			group by 1\
			order by 1', parametros)
		.then(function(data) {
			res.status(200)
				.json({
					data: data
				});
			})
			.catch(function (err) {
				res.status(500).send({message: 'Error al devolver el idhost'});
			})
}



module.exports = {
	getIdHost
}