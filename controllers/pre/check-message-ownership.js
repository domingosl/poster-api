const Messages = require('../../models/message');
const logger = require('../../util/logger');

module.exports = async (req, res, next) => {

    let message;

    if(req.params.messageId) {

        try {
            message = await Messages.findById(req.params.messageId);
        }
        catch (e) {
            logger.error(e);
            req.applicationError();
        }

        if (message.user.toString() !== req.locals.user._id.toString()) {
            res.forbidden("Il messaggio non è tuo");
        }

        req.locals.message = message;
        next();
    }
    else {
        res.applicationError();
    }
};