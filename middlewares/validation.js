const logger = require('../util/logger');

module.exports = (req,res,next) => {

    req.locals = {};

    let AssetModel;

    if(req.path === '/auth/signup') {
        AssetModel = require('../models/user');
    }
    else {
        logger.debug("Validation skipped");
        return next();
    }

    const asset = new AssetModel(req.body);

    asset.validate((err) => {

        if(!err) {
            logger.debug("Validation passed");
            req.locals.asset = asset;
            return next();
        }

        if(err.name !== 'ValidationError')
            return res.applicationError();

        let result = {};
        Object.keys(err.errors).map(fieldName => {
            result[fieldName] = err.errors[fieldName].message;
        });

        res.badRequest(result);

    });

};