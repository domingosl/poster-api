const appRoot                               = require('app-root-path');
const { createLogger, format, transports }  = require('winston');
const { combine, timestamp, label, printf } = format;
const process                               = require('process');
const chalk                                 = require('chalk');

const cFormat = printf(info => {

    const level = (info.level === 'debug') ?
            chalk.yellow((info.level).toUpperCase()) :
        info.level === 'info' ?
            chalk.green((info.level).toUpperCase()) :
        info.level === 'error' ?
            chalk.red((info.level).toUpperCase()) :
            chalk.magenta((info.level).toUpperCase());

    const space = info.level.length > 4 ? " " : "";

    return chalk.blue(process.title) + `(${process.pid}) [` + level + `] ${space}${info.timestamp}: ${info.message}`;
});

const options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        format: combine( timestamp(), format.splat(), cFormat )
    },
};

let logger = createLogger({
    transports: [
        new transports.File(options.file),
        new transports.Console(options.console)
    ],
    exitOnError: false
});


logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;