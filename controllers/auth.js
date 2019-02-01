const User = require('../models/user');
const ResetPassword = require('../models/reset-password');
const logger = require('../util/logger');
const postman = require('../util/postman');
const validator = require('validator');

module.exports.signup = (req, res) => {

    let user = new User(req.body);

    user.save((err, user) => {

        if(err)
            return res.apiErrorResponse(err);


        user.refreshToken().then(
            function success(token) {
                postman.newSender.setTemplate('user-welcome').setData({}).sendEmail(user.email);
                return res.resolve({token: token, user: user.relevantData()});
            },
            function error(err) {
                return res.apiErrorResponse(err);
            }
        );


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

                if(!valid)
                    return res.forbidden(i18n.__("WRONG_CREDENTIALS"));

                user.refreshToken().then(
                    function success(token) {
                        res.resolve({token: token, user: user.relevantData() });
                    },
                    function error(err) {
                        res.apiErrorResponse(err);
                    }
                );


            });

        })
        .catch(err => {
            logger.error("Can't find User in DB for authentication. %o", err);
            return res.apiErrorResponse(err);
        });

};

module.exports.logout = (req, res) => {

    if(!req.locals.user)
        return res.forbidden("");

    User.findById(req.locals.user.id)
        .then((user) => {
            user.hashToken = null;
            return user.save();
        })
        .then(() => {
            return res.resolve();
        })
        .catch((err) => {
            logger.error("Fail at requesting/saving User from DB for logout. %o", err);
            return res.apiErrorResponse(err);
        })

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
            resetPassword.user.token = null;
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
                return res.apiErrorResponse(err);
            })


        })
        .catch(err => {
            logger.error("Can't find reset password on DB. %o", err);
            return res.apiErrorResponse(err);
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
                    return res.apiErrorResponse(err);
                }

                logger.debug('New reset password asset, expiration %o', resetPassword.expirationDate);

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
            res.apiErrorResponse(err);
        });


};

module.exports.changePassword = (req, res) => {

    User.findById(req.locals.user.id).then((user) => {

        user.verifyPassword(req.body.currentPassword || "", (err, valid) => {

            if (!valid)
                return res.badRequest({
                    currentPassword: i18n.__('WRONG_CURRENT_PASSWORD')
                });


            user.password = req.body.password;

            user.save((err, user)=> {

                if(err && err.name !== 'ValidationError') {
                    logger.error("Error while saving user during password change. %o", err);
                    return res.applicationError();
                }

                else if(err && err.name === 'ValidationError') {
                    let result = {};
                    Object.keys(err.errors).map(fieldName => {
                        result[fieldName] = err.errors[fieldName].message;
                    });

                    return res.badRequest(result);
                }

                return res.resolve({ token: user.jwt });

            });

        });

    }).catch((err) => {
        logger.error("Can't request user for password change. %o", err);
        return res.apiErrorResponse(err);
    });


};