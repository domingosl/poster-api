const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const mongooseStringQuery = require('mongoose-string-query');

const firstNameMin = 2;
const firstNameMax = 80;
const lastNameMin = 2;
const lastNameMax = 80;

const RecipientsSchema = new mongoose.Schema(
    {
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
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        jail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Jail',
            required: [true, i18n.__('FORM_ERROR_JAIL_MISSING')]
        }

    },
    { collection: 'recipients' }
);

RecipientsSchema.plugin(timestamps);
RecipientsSchema.plugin(mongooseStringQuery);


module.exports = exports = mongoose.model('Recipient', RecipientsSchema);