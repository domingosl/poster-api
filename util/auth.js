const paths = require('../config/public-routes');
const Users = require('../models/user');
const logger = require('./logger');
const unless = require('express-unless');

const mw = (req, res, next) => {

    logger.debug("Running auth middleware on %o", req.originalUrl, req.originalUrl);

    let token = req.headers['x-auth-token'];

    if(typeof token !== 'string' || token === "")
        return res.forbidden();

    token = Users.hash(token);

    Users.findOne({ hashToken: token }).then((user)=> {

        if(!user)
            return res.unauthorized();

        req.locals.user = user;
        next();
    }).catch((err)=>{
        logger.error(err);
        res.applicationError();
    })

};


module.exports = unless(mw, {path: paths});