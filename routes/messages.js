const MessageController = require('../controllers/message');

module.exports = app => {
    app.route('/messages').get(MessageController.find);
    app.route('/messages').post(MessageController.save);
    app.route('/messages/:messageId').put(MessageController.update);
    app.route('/messages/:messageId').get(MessageController.get);
};