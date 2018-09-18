const crypto                = require('crypto');
const process               = require('process');
const github                = require('simple-git')();
const logger                = require('../util/logger');
const child_process         = require('child_process');

module.exports = (req, res) => {

    const sign = req.headers['x-hub-signature'];
    const key  = process.env.GITHUB_HOOK_SECRET;
    const hash = "sha1=" + crypto.createHmac('sha1', key).update(JSON.stringify(req.body)).digest('hex');

    if(hash !== sign) {
        logger.info("Unable to pull, hash and signature do not match", { hash: hash, signature: sign });
        return res.send("KO");
    }

    res.send("OK");

    logger.info("Pulling git!");

    github.pull((err, response) => {
        if (err)
            throw err;

        logger.info("Pull completed", response.summary);

        const exec = child_process.exec;
        const options = {
            timeout: 60000,
            killSignal: 'SIGKILL'
        };

        exec('grunt build', options, function(err, stdout, stderr) {

            if (err)
                logger.error('Child process exited with error code', { errorCode: err.code });
            else
                logger.info('Grunt build done!');

        });

    });

};