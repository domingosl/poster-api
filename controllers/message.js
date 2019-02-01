const Messages = require('../models/message');
const logger = require('../util/logger');

const userModifiableFields = ['subject', 'body', 'recipient'];


module.exports.find = (req, res) => {

    let query = { user: req.locals.user._id };

    if(req.query.status && req.query.status > 0 && req.query.status < 4)
        query.status = req.query.status;

    Messages.find(query).populate('recipient')
        .then(messages => {
            res.resolve(messages);
        })
        .catch(err => {
            logger.error(err);
            return res.apiErrorResponse(err);
        });

};

module.exports.get = (req, res) => {

    Messages.findOne({_id: req.params.messageId, user: req.locals.user._id, status: { $gt: 0 } }).populate('recipient')
        .then(message => {
            res.resolve(message);
        })
        .catch(err => {
            logger.error(err);
            return res.apiErrorResponse(err);
        });

};

module.exports.save = async (req, res) => {


    const message = new Messages({
        user: req.locals.user._id,
        recipient: req.locals.recipient || null,
        subject: req.body.subject,
        body: req.body.body,
        attachment: []
    });

    message.save((err, message) => {

        if (err)
            return res.apiErrorResponse(err);

        return res.resolve(message);
    });

};


module.exports.update = async (req, res) => {


    const payload = Object.keys(req.body)
        .filter(key => userModifiableFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = req.body[key];
            return obj;
        }, {});

    try {
        const message = await Messages.findOneAndUpdate({
            _id: req.params.messageId,
            user: req.locals.user._id
        }, payload, {new: true, runValidators: true});

        return res.resolve(message);
    }
    catch (err) {
        res.apiErrorResponse(err);
    }


};
