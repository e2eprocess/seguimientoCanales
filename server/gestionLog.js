'use strict';

const winston = require('winston');
const common = require('winston/lib/winston/common');
const fs = require('fs');
const dateformat = require('dateformat');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

if (!fs.existsSync(logDir)){
	fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();

var logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'debug',
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/-results.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      json: false,
      formatter: (options) => {
      		var dateTime = dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      		var message = dateTime + ' - ' + options.level + ': ' + options.message;
      		return message;
      	},
      level: env === 'development' ? 'info' : 'info'
    })
  ]
});

exports.logger = logger;


/* Niveles de traza
{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }*/