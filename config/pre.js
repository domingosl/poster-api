module.exports = [
    // { path: /^\/messages\/[^\\/]+\/image$/gm, methods: [ 'POST' ], controller: require('../controllers/pre/check-message-ownership') },
    { path: /^\/messages\/[^\\/]+\/image\/[^\\/]+$/gm, methods: [ 'DELETE' ], controller: require('../controllers/pre/check-message-ownership') },
    { path: '/messages', methods: [ 'POST' ], controller: require('../controllers/pre/check-recipient-ownership') },
    { path: /^\/messages\/[^\\/]+\/?$/gm, methods: [ 'PUT' ], controller: require('../controllers/pre/check-recipient-ownership') }
];