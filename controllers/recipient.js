const validator = require('validator');
const Recipient = require('../models/recipient');
const logger = require('../util/logger');


module.exports.find = (req, res) => {

    Recipient.find({user: req.locals.user._id}).populate('jail')
        .then(recipients => {
            res.resolve(recipients);
        })
        .catch(err => {
            logger.error(err);
            res.applicationError();
        });
};

module.exports.get = (req, res) => {

    Recipient.findById(req.params.recipientId).populate('jail')
        .then(recipient => {
            res.resolve(recipient);
        })
        .catch(err => {
            logger.error(err);
            res.applicationError();
        });

};

module.exports.save = (req, res) => {

    req.locals.asset.user = req.locals.user._id;

    req.locals.asset.save((err, recipient) => {

        if (err) {
            logger.error("Can't save asset to DB. %o", err);
            return res.status(500).send(err);
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
            res.applicationError();
        });

};

module.exports.delete = (req, res) => {


    Recipient.deleteOne({_id: req.params.recipientId, user: req.locals.user._id})
        .then((operation) => {
            if(operation.n === 0)
                return res.notFound();

            return res.resolve();
        })
        .catch((e) => {
            logger.error(e);
            return res.applicationError();
        });

};