const ExpressBrute = require('express-brute');
const moment = require('moment');
const logger = require('../util/logger');

moment.locale('it');

const failCallback = function (req, res, next, nextValidRequestDate) {
    logger.info("Too many request %o", { path: req.path, address: req.headers['x-forwarded-for'] || req.connection.remoteAddress });
    return res.tooManyRequests(i18n.__('TOO_MANY_REQUESTS', moment(nextValidRequestDate).fromNow()));
};

const bruteforceEmailReset = new ExpressBrute(
    new ExpressBrute.MemoryStore(),
    {
        freeRetries: 2,
        minWait: 5*60*1000, // 5 minutes
        maxWait: 60*60*1000, // 1 hour
        failCallback: failCallback
    }
);

module.exports.resetPassword = bruteforceEmailReset;