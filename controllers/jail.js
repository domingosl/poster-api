const Jail = require('../models/jail');
const logger = require('../util/logger');


module.exports.find = (req, res) => {

    Jail.find({})
        .then(jails => {
            res.resolve(jails);
        })
        .catch(err => {
            logger.error(err);
            res.applicationError();
        });
};

module.exports.get = (req, res) => {

    Jail.findById(req.params.jailId)
        .then(jail => {
            res.resolve(jail);
        })
        .catch(err => {
            logger.error(err);
            res.applicationError();
        });

};
