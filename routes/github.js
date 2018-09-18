const GithubController = require('../controllers/github');
const bruteforce = require('../config/brute-force');

module.exports = app => {
    app.route('/githook').post(GithubController);
};