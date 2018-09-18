module.exports = (err, req, res, next) => {

    if(!err)
        return next();

    if (err.name === 'UnauthorizedError') {
        res.unauthorized(i18n.__("UNAUTHORISED_API_CALL"));
    }

};