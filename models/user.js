const mongoose = require('mongoose');
const bcrypt = require('mongoose-bcrypt');
const timestamps = require('mongoose-timestamp');
const mongooseStringQuery = require('mongoose-string-query');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const uuid = require('uuid/v1');
const crypto = require('crypto');

const logger = require('../util/logger');

const passwordMin = 8;
const passwordMax = 60;
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
            unique: i18n.__('FORM_ERROR_EMAIL_IN_USE'),
            required: [true, i18n.__('FORM_ERROR_MISSING_EMAIL')],
            validate: [validator.isEmail, i18n.__('FORM_ERROR_INVALID_EMAIL')]
        },
        password: {
            type: String,
            minlength: [passwordMin, i18n.__('FORM_ERROR_PASSWORD_TOO_SHORT', passwordMin)],
            maxlength: [passwordMax, i18n.__('FORM_ERROR_PASSWORD_TOO_LONG', passwordMax)],
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
        hashToken: {
            type: String,
            trim: true,
            default: ''
        },
        address: {
            type: String,
            trim: true,
            minlength: [lastNameMin, i18n.__('FORM_ERROR_ADDRESS_TOO_SHORT', 3)],
            maxlength: [lastNameMax, i18n.__('FORM_ERROR_ADDRESS_TOO_LONG', 120)],
            required: false
        },
        addressRegion: {
            type: String,
            trim: true,
            minlength: [lastNameMin, i18n.__('FORM_ERROR_ADDRESS_REGION_TOO_SHORT', 2)],
            maxlength: [lastNameMax, i18n.__('FORM_ERROR_ADDRESS_REGION_TOO_LONG', 30)],
            required: false
        },
        addressCode: {
            type: String,
            trim: true,
            minlength: [lastNameMin, i18n.__('FORM_ERROR_ADDRESS_CODE_TOO_SHORT', 2)],
            maxlength: [lastNameMax, i18n.__('FORM_ERROR_ADDRESS_CODE_TOO_LONG', 6)],
            required: false
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
    {collection: 'users'}
);

UserSchema.methods.getSession = function () {
    return {
        user: this.relevantData(),
        hashToken: this.hashToken
    }
};

UserSchema.methods.relevantData = function () {
    return {
        id: this._id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName
    };
};

const hash = (t) => crypto.createHash('sha512').update(t).digest('hex');

UserSchema.statics.hash = (t) => hash(t);

UserSchema.methods.refreshToken = function () {

    const me = this;

    return new Promise((resolve, reject) => {

        let newToken = uuid() + "-" + this._id;

        this.hashToken = hash(newToken);

        me.save((err, user) => {

            if (err) {
                logger.error("Can't save user after updating token. %o", err);
                return reject(err);
            }

            resolve(newToken);

        });
    });


};

UserSchema.plugin(bcrypt);
UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);
UserSchema.plugin(uniqueValidator);

UserSchema.index({email: 1});

module.exports = exports = mongoose.model('User', UserSchema);