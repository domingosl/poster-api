const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const mongooseStringQuery = require('mongoose-string-query');

const JailsSchema = new mongoose.Schema(
    {
        shortName: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        postalAddress: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        officeCode: {
            type: String,
            required: true,
            unique: true
        }
    },
    { collection: 'jails' }
);

JailsSchema.plugin(timestamps);
JailsSchema.plugin(mongooseStringQuery);


module.exports = exports = mongoose.model('Jail', JailsSchema);