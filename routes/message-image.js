const messageImageController = require('../controllers/message-image');

module.exports = app => {
    app.route('/message-image').post(messageImageController.save);
};