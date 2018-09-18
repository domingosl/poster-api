const AuthController = require('../controllers/auth');
const bruteforce = require('../config/brute-force');

module.exports = app => {
    app.route('/auth/signup').post(AuthController.signup);
    app.route('/auth/login').post(AuthController.login);
    app.route('/auth/restore-password/:resetId').get(AuthController.restorePassword);
    app.route('/auth/reset-password').post(bruteforce.resetPassword.prevent, AuthController.resetPassword);
};