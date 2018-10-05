const JailController = require('../controllers/jail');

module.exports = app => {
    app.route('/jails').get(JailController.find);
    app.route('/jails/:jailId').get(JailController.get);
};