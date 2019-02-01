const mongoose = require('mongoose');
const moment = require('moment');
const timestamps = require('mongoose-timestamp');
const mongooseStringQuery = require('mongoose-string-query');

const ResetPasswordSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        used: {
            type: Boolean,
            default: false
        },
        expirationDate: {
            type: Date,
            default: moment().add(600, 's')
        }
    },
    { collection: 'passwordReset' }
);

ResetPasswordSchema.plugin(timestamps);
ResetPasswordSchema.plugin(mongooseStringQuery);


module.exports = exports = mongoose.model('ResetPassword', ResetPasswordSchema);