const Recipients = require('../../models/recipient');
const logger = require('../../util/logger');

module.exports = async (req, res) => {

    let recipient;

    if(req.body.recipient) {

        try {
            recipient = await Recipients.findById(req.body.recipient);
        }
        catch (e) {
            logger.error(e);
            return true;
        }

        if (recipient.user.toString() !== req.locals.user._id.toString()) {
            res.forbidden("Il destinatario non è nella tua rubrica");
            return false;
        }

        req.locals.recipient = recipient;
        return true;
    }

    return true;

};