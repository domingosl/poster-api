const UserController = require('../controllers/user');

module.exports = app => {
    app.route('/users').get(UserController.find);
    app.route('/users/:userId').get(UserController.get);
    app.route('/users/:userId').put(UserController.update);
    app.route('/users/:userId').delete(UserController.delete);
};