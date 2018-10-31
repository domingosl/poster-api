const Messages = require('../models/message');
const Recipients = require('../models/recipient');
const logger = require('../util/logger');


module.exports.save = async (req, res) => {

    var recipient;

    if(req.body.recipient) {
        recipient = await Recipients.findById(req.body.recipient);


        if (recipient.user.toString() !== req.locals.user._id.toString())
            return res.forbidden("Il destinatario non è nella tua rubrica");
    }

    var message = new Messages({
        user: req.locals.user._id,
        recipient: recipient || null,
        subject: req.body.subject,
        body: req.body.body,
        attachment: []
    });

    message.save((err, message) => {

        if (err) {
            logger.error("Can't save asset to DB. %o", err);
            return res.applicationError();
        }

        return res.resolve(message);
    });

};


module.exports.update = async (req, res) => {


    var recipient;

    if(req.body.recipient) {
        recipient = await Recipients.findById(req.body.recipient);


        if (recipient.user.toString() !== req.locals.user._id.toString())
            return res.forbidden("Il destinatario non è nella tua rubrica");
    }


    var payload = {
        recipient: recipient || null,
        subject: req.body.subject,
        body: req.body.body,
        attachment: []
    };

    var message = await Messages.findOneAndUpdate({ _id: req.params.messageId, user: req.locals.user._id}, payload, {new: true});


    res.resolve(message);
};
