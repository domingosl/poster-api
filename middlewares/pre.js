const config = require('../config/pre');
const logger = require('../util/logger');

module.exports = async (req, res, next) => {

    const _config = config.find((el) => {

        if(typeof el.path === 'string')
            return el.path === req.path && (!el.methods || el.methods.indexOf(req.method) >= 0);

        else if(typeof el.path === 'object')
            return el.path.exec(req.path) && (!el.methods || el.methods.indexOf(req.method) >= 0);

        return false;

    });

    if(!_config) return next();

    logger.debug("Executing PRE.%o", { path: req.path, method: req.method });

    if(await _config.controller(req, res, _config.options || {}))
        next();

};