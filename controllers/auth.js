const User = require('../models/user');
const ResetPassword = require('../models/reset-password');
const logger = require('../util/logger');
const postman = require('../util/postman');
const validator = require('validator');

module.exports.signup = (req, res) => {

    req.locals.asset.save((err, user) => {

        if(err) {
            logger.error("Can't save asset to DB %o", err);
            return res.status(500).send(err);
        }

        postman.newSender.setTemplate('user-welcome').setData({}).sendEmail(user.email);

        return res.resolve(user.getSession());
    });

};

module.exports.login = (req, res) => {

    if(!validator.isEmail(req.body.email || ""))
        return res.badRequest({
            email: i18n.__('FORM_ERROR_INVALID_EMAIL')
        });

    if(typeof req.body.password === 'undefined' || req.body.password === "")
        return res.badRequest({
            password: i18n.__('FORM_ERROR_INVALID_PASSWORD')
        });

    User.findOne({email: req.body.email })
        .then(user => {

            if(!user)
                return res.forbidden(i18n.__("WRONG_CREDENTIALS"));

            user.verifyPassword(req.body.password, (err, valid) => {

                if(valid)
                    return user.refreshToken((session) => res.resolve(user.getSession()));


                return res.forbidden(i18n.__("WRONG_CREDENTIALS"));

            });

        })
        .catch(err => {
            logger.error("Can't find User in DB for authentication. %o", err);
            res.applicationError();
        });

};

module.exports.restorePassword = (req, res) => {

    if(!validator.isMongoId(req.params.resetId || ""))
        return res.render('reset-password', { title: i18n.__("INVALID_RESET_ID_TITLE"), message: i18n.__("INVALID_RESET_ID"), result: "fail" });

    ResetPassword.findById(req.params.resetId)
        .populate('user')
        .then(resetPassword => {

            if(!resetPassword)
                return res.render('reset-password', { title: i18n.__("INVALID_RESET_ID_TITLE"), message: i18n.__("INVALID_RESET_ID"), result: "fail" });

            if(resetPassword.used === true)
                return res.render('reset-password', { title: i18n.__("USED_RESET_ID_TITLE"), message: i18n.__("USED_RESET_ID"), result: "fail" });

            if(resetPassword.expirationDate < new Date())
                return res.render('reset-password', { title: i18n.__("EXPIRED_RESET_ID_TITLE"), message: i18n.__("EXPIRED_INVALID_RESET_ID"), result: "fail" });

            const newPassword = require('password-generator')(12);
            resetPassword.user.password = newPassword;
            resetPassword.user.save().then(() => {
                resetPassword.used = true;
                return resetPassword.save();
            }).then(() =>  {
                postman.newSender.setTemplate('new-password').setData({password: newPassword}).sendEmail(resetPassword.user.email);

                return res.render('reset-password', {
                    title: i18n.__("VALID_RESET_TITLE"),
                    message: i18n.__("VALID_RESET", resetPassword.user.email),
                    result: "success" });

            }).catch(err => {
                logger.error(err);
                res.applicationError();
            })


        })
        .catch(err => {
            logger.error("Can't find reset password on DB. %o", err);
            res.applicationError();
        });

};

module.exports.resetPassword = (req, res) => {

    if(!validator.isEmail(req.body.email || ""))
        return res.badRequest({
            email: i18n.__('FORM_ERROR_INVALID_EMAIL')
        });

    User.findOne({email: req.body.email })
        .then(user => {

            if(!user)
                return res.forbidden(i18n.__("MISSING_EMAIL"));

            const resetPassword = new ResetPassword({ user: user._id });

            resetPassword.save((err, resetPassword) => {

                if(err) {
                    logger.error("Can't save password reset. %o", err);
                    return res.applicationError;
                }

                const resetLink =
                    (process.env.ENV === 'DEVELOPING') ?
                        process.env.SERVER_URI + ":" + process.env.SERVER_PORT + "/auth/restore-password/" + resetPassword._id:
                        process.env.SERVER_URI + "/auth/restore-password/" + resetPassword._id;

                postman
                    .newSender
                    .setTemplate('reset-password')
                    .setData({ resetLink: resetLink })
                    .sendEmail(user.email)
                    .then(()=>res.resolve(), (err) => {
                        logger.error("Can't send password reset email. %o", err);
                        return res.applicationError();
                    });

            });



        })
        .catch(err => {
            logger.error("Can't find User in DB for password reset. %o", err);
            res.applicationError();
        });


};