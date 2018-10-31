const fileType      = require('file-type');
const imageManager  = require('../util/image-manager');

module.exports.save = (req, res) => {

    if(!req.files.file)
        return res.badRequest({
            file: i18n.__('MISSING_FILE')
        });

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


    imageManager.save(req.files.file.data, 1, {}).then(
        (response) => {
            return res.resolve({
                url: response.relativeRoute,
                showName: req.files.file.name
            });
        }
    ).catch(
        (err) => {
            console.log(err);
        }
    );


};