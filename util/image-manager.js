const uuid      = require('uuid');
const fs        = require('fs');
const sharp     = require('sharp');
const logger    = require('./logger');
const appRoot   = require('app-root-path');

const storageFolder = process.env.IMAGE_LOCALSTORAGE_LOCATION.replace('#appRoot', appRoot);

if(!fs.existsSync(storageFolder)) {
    logger.info("Generating user images folder", storageFolder);
    fs.mkdirSync(storageFolder, {recursive: true});
}

const savePromise = (inputBuffer = null, storageType = 1, options = {}) => {

    return new Promise((resolve, reject) => {

        if(!inputBuffer)
            return reject('Missing data buffer');

        const image = sharp(inputBuffer);
        image.metadata()
            .then(function(metadata) {

                const name = uuid() + ".jpg";
                const filename = `${storageFolder}/${name}`;

                image
                    .resize({
                        width: metadata.width > 1000 ? 1000 : metadata.width,
                        withoutEnlargement: true
                    })
                    .jpeg({ quality: parseInt(process.env.IMAGE_QUALITY) })
                    .toFile(filename, (err, info) => {

                        if(err) {
                            logger.error('Fail trying to process user uploaded image. %o', err);
                            return reject(err);
                        }

                        const compressionRate = Math.round(100 * info.size / inputBuffer.byteLength);
                        logger.info("New image generated in filesystem storage. %o", { compression: compressionRate, filename: filename });

                        resolve({filename: filename, relativeRoute: process.env.IMAGE_URL + "/" + name });

                    } );

            })


    });
};

module.exports.save = savePromise;