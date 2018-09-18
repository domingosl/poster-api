const appRoot = require('app-root-path');

global.i18n = require("i18n");

i18n.configure({
    locales:['it'],
    defaultLocale: 'it',
    directory: appRoot + '/locales'
});