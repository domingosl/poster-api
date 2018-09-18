const jwt = require('express-jwt');

const paths = [
    '/',
    '/auth/signup',
    '/auth/login',
    /\/auth\/restore-password\/*/,
    '/auth/reset-password',
    '/githook'
];

module.exports = jwt({ secret: process.env.JWT_SECRET }).unless({
    path: paths
});