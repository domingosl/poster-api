const mongoose              = require('mongoose');
const moment                = require('moment');
const timestamps            = require('mongoose-timestamp');
const mongooseStringQuery   = require('mongoose-string-query');

const bodyMin = 0;
const bodyMax = 5000;
const subjectMax = 250;

const attachmentSchema = new mongoose.Schema({
    url: {
        type: String,
        minlength: 5,
        maxlength: 400,
        required: true
    },
    showName: {
        type: String,
        minlength: 1,
        maxlength: 400,
        required: true
    },
    createdAt: {
        type: Date,
        default: moment()
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
            required: false
        },
        status: {
            type: Number,
            trim: true,
            default: 2 //<-- 0: deleted, 1: sent, 2: draft, 3: ready for send
        },
        attachments: [attachmentSchema]

    },
    { collection: 'messages' }
);

MessagesSchema.plugin(timestamps);
MessagesSchema.plugin(mongooseStringQuery);


module.exports = mongoose.model('Message', MessagesSchema);