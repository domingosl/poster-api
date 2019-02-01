const messageImageController = require('../controllers/message-image');
const checkMessageOwnership = require('../controllers/pre/check-message-ownership');

module.exports = app => {
    app.route('/messages/:messageId/image').post(checkMessageOwnership, messageImageController.save);
    app.route('/messages/:messageId/image/:imageId').delete(checkMessageOwnership, messageImageController.delete);
};