const mongoose = require('mongoose');
const bcrypt = require('mongoose-bcrypt');
const timestamps = require('mongoose-timestamp');
const mongooseStringQuery = require('mongoose-string-query');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const process = require('process');

const logger = require('../util/logger');

const firstNameMin = 2;
const firstNameMax = 80;
const lastNameMin = 2;
const lastNameMax = 80;

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            lowercase: true,
            trim: true,
            index: true,
            unique: true,
            required: [true, i18n.__('FORM_ERROR_MISSING_EMAIL')],
            validate: [validator.isEmail, i18n.__('FORM_ERROR_INVALID_EMAIL')]
        },
        password: {
            type: String,
            required: [true, i18n.__('FORM_ERROR_INVALID_PASSWORD')],
            bcrypt: true
        },
        firstName: {
            type: String,
            trim: true,
            minlength: [firstNameMin, i18n.__('FORM_ERROR_FIRST_NAME_TOO_SHORT', firstNameMin)],
            maxlength: [firstNameMax, i18n.__('FORM_ERROR_FIRST_NAME_TOO_LONG', firstNameMax)],
            required: [true, i18n.__('FORM_ERROR_FIRST_NAME_MISSING')]
        },
        lastName: {
            type: String,
            trim: true,
            minlength: [lastNameMin, i18n.__('FORM_ERROR_LAST_NAME_TOO_SHORT', lastNameMin)],
            maxlength: [lastNameMax, i18n.__('FORM_ERROR_LAST_NAME_TOO_LONG', lastNameMax)],
            required: [true, i18n.__('FORM_ERROR_LAST_NAME_MISSING')]
        },
        recoveryCode: {
            type: String,
            trim: true,
            default: ''
        },
        jwt: {
            type: String,
            trim: true,
            default: ''
        },
        active: {
            type: Boolean,
            default: true
        },
        admin: {
            type: Boolean,
            default: false
        }
    },
    { collection: 'users' }
);

UserSchema.methods.getSession = function () {
    return {
        user: this.userRelevantData(),
        jwt: this.jwt
    }
};

UserSchema.methods.userRelevantData = function () {
    return {
        id: this._id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName
    };
};

UserSchema.methods.refreshToken = function (cb) {

    const me = this;

    jwt.sign({ data: this.userRelevantData() }, process.env.JWT_SECRET, { expiresIn: 3600 * 24 * 30 } , function(err, token) {
        me.jwt = token;
        if(typeof cb === 'function') cb();
    });

};

UserSchema.pre('save', function (next) {
    if(this.isNew)
        this.refreshToken(next);
    else
        next();
});

UserSchema.plugin(bcrypt);
UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);
UserSchema.plugin(uniqueValidator, { message: i18n.__('FORM_ERROR_EMAIL_IN_USE') });

UserSchema.index({ email: 1 });

module.exports = exports = mongoose.model('User', UserSchema);