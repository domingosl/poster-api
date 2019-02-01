const logger = require('../util/logger');


module.exports = (req, res, next) => {

    if(!req.locals)
        req.locals = {};

    function getForm(code, payload, message) {

        if(typeof payload !== 'object') payload = {};
        if(typeof message !== 'string') message = "";

        let response = {
            code: code
        };

        if(payload)
            response.data = payload;
        if(message)
            response.message = message;

        return res.status(code).json(response);

    }

    res.resolve = (payload) => getForm(200, payload);
    res.badRequest = (payload) => getForm(400, payload);
    res.unauthorized = (message) => getForm(401, null, message);
    res.forbidden = (message) => getForm(403, null, message);
    res.notFound = () => getForm(404, null, null);
    res.applicationError = () => getForm(500, null, null);
    res.tooManyRequests = (message) => getForm(429, null, message);

    res.apiErrorResponse = (err) => {
        if(err.name==='ValidationError')
            return getForm(400, err.data);
        else {
            logger.error('Mongoose error.%o', err);
            return getForm(500, null, null);
        }
    };

    next();
};


