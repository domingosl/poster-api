const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const mongooseStringQuery = require('mongoose-string-query');

const bodyMin = 1;
const bodyMax = 5000;
const subjectMax = 250;

const attachmentSchema = new mongoose.Schema({
    url: {
        type: String,
        minlength: [2, i18n.__('URL_TOO_SHORT', 2)],
        maxlength: [400, i18n.__('URL_TOO_LONG', 400)],
        required: [true, i18n.__('BODY_MISSING')]
    },
    id: {
        type: String
    }
});

const MessagesSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipient',
            required: false
        },
        subject: {
            type: String,
            maxlength: [subjectMax, i18n.__('SUBJECT_TOO_LONG', subjectMax)],
            required: false
        },
        body: {
            type: String,
            minlength: [bodyMin, i18n.__('BODY_TOO_SHORT', bodyMin)],
            maxlength: [bodyMax, i18n.__('BODY_TOO_LONG', bodyMax)],
            required: [true, i18n.__('BODY_MISSING')]
        },
        status: {
            type: Number,
            trim: true,
            default: 2 //<-- 0: deleted, 1: send, 2: draft
        },
        attachments: [attachmentSchema]

    },
    { collection: 'messages' }
);

MessagesSchema.plugin(timestamps);
MessagesSchema.plugin(mongooseStringQuery);


module.exports = exports = mongoose.model('message', MessagesSchema);