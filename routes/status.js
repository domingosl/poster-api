const StatusController = require('../controllers/status.js');

module.exports = app => {

    app.route('/status').get(StatusController.get);

};