const Recipient = require('../models/recipient');
const logger = require('../util/logger');


module.exports.find = (req, res) => {

    Recipient.find({user: req.locals.user._id}).populate('jail')
        .then(recipients => {
            res.resolve(recipients);
        })
        .catch(err => {
            logger.error(err);
            return res.apiErrorResponse(err);
        });
};

module.exports.get = (req, res) => {

    Recipient.findById(req.params.recipientId).populate('jail')
        .then(recipient => {
            res.resolve(recipient);
        })
        .catch(err => {
            logger.error(err);
            return res.apiErrorResponse(err);
        });

};

module.exports.save = (req, res) => {

    let recipient = new Recipient(req.body);
    recipient.user = req.locals.user._id;

    recipient.save((err, recipient) => {

        if (err) {
            logger.error("Can't save asset to DB. %o", err);
            return res.status(500).send();
        }

        return res.resolve(recipient);

    });


};

module.exports.update = (req, res) => {


    const data = req.body || {};

    delete data.user;

    Recipient.findByIdAndUpdate({_id: req.params.recipientId, user: req.locals.user._id}, data, {new: true})
        .then(recipient => {

            if (!recipient) {
                return res.sendStatus(404);
            }

            res.resolve(recipient);
        })
        .catch(err => {
            logger.error(err);
            return res.apiErrorResponse(err);
        });

};

module.exports.delete = (req, res) => {


    Recipient.deleteOne({_id: req.params.recipientId, user: req.locals.user._id})
        .then((operation) => {
            if(operation.n === 0)
                return res.notFound();

            return res.resolve();
        })
        .catch((err) => {
            logger.error(err);
            return res.apiErrorResponse(err);
        });

};