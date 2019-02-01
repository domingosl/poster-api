const fileType      = require('file-type');
const imageManager  = require('../util/image-manager');
const logger        = require('../util/logger');

module.exports.save = async (req, res) => {

    if(!req.files.file)
        return res.badRequest({
            file: i18n.__('MISSING_FILE')
        });

    if(!req.locals.message)
        return res.applicationError();

    const size = req.files.file.data.byteLength;

    if(size >= process.env.IMAGE_MAX_SIZE)
        return res.badRequest({
            file: i18n.__('FILE_SIZE_TOO_BIG', process.env.IMAGE_MAX_SIZE)
        });

    if(size < process.env.IMAGE_MIN_SIZE)
        return res.badRequest({
            file: i18n.__('FILE_SIZE_TOO_SMALL', process.env.IMAGE_MIN_SIZE)
        });


    const fileProperties = fileType(req.files.file.data);

    if(fileProperties.mime !== 'image/png' && fileProperties.mime !== 'image/jpeg')
        return res.badRequest({
            file: i18n.__('FILE_FORMAT_INCORRECT')
        });


    try {
        const image = await imageManager.save(req.files.file.data, 1, {});

        const attachment = {
            id: image._id,
            url: image.relativeRoute,
            showName: req.files.file.name
        };

        req.locals.message.attachments.push(attachment);

        await req.locals.message.save();

        return res.resolve(attachment);
    }
    catch(err) {

        logger.error(err);
        return res.applicationError();
    };


};

module.exports.delete = (req, res) => {
    res.resolve();
};