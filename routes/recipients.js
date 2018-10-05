const RecipientController = require('../controllers/recipient');

module.exports = app => {
    app.route('/recipients').get(RecipientController.find);
    app.route('/recipients/:recipientId').get(RecipientController.get);
    app.route('/recipients').post(RecipientController.save);
    app.route('/recipients/:recipientId').put(RecipientController.update);
    app.route('/recipients/:recipientId').delete(RecipientController.delete);
};