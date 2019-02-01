require('dotenv').config();

const mongoose          = require('mongoose');
const logger            = require('../util/logger');
const mongooseApiError  = require('../util/mongoose-api-error-plugin');
const process           = require('process');

mongoose.Promise = global.Promise;
mongoose.plugin(mongooseApiError);

const connection = mongoose.connect(process.env.DB_SERVER, { useNewUrlParser: true });

connection
    .then(db => {
        logger.info(
            `Successfully connected to ${process.env.DB_SERVER} MongoDB cluster in ${
                process.env.ENV
                } mode.`,
        );
        return db;
    })
    .catch(err => {
        if (err.message.code === 'ETIMEDOUT') {
            logger.info('Attempting to re-establish database connection.');
            mongoose.connect(process.env.DB_SERVER);
        } else {
            logger.error('Error while attempting to connect to database.');
            process.exit();
        }
    });

module.exports = connection;