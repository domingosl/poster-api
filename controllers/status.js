const moment = require('moment');

module.exports.get = (req, res) => {
    res.resolve({

        time: moment(),
        foo: moment().add(600, 'seconds')

    });
};