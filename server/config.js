'use strict'

var config = {
	db: {
		//BBDD-local
		pgBBDD: 'postgres://postgres:gero3007@localhost:5432/E2Ereporting',
		//BBDD-PC Gero
		//pgBBDD: 'postgres://postgres:gero3007@15.17.167.155:5432/E2Ereporting',
		//BBDD-Producción
		//pgBBDD: 'postgres://postgres:misco444@23.1.12.88:5432/E2Ereporting'
		},
	host: {
		port: 3845
	}
};

exports.config = config;