require('dotenv').config();
const process = require('process');
process.title = "POSTERAPI";

require('./config/db');
require('./config/i18n');

const logger            = require('./util/logger');
const express           = require('express');
const fs                = require('fs');
const appRoot           = require('app-root-path');
const cors              = require('cors');
const compression       = require('compression');
const bodyParser        = require('body-parser');
const expressLayouts    = require('express-ejs-layouts');


const mainMiddleware = require('./middlewares/main');
const validationMiddleware = require('./middlewares/validation');

const errorController = require('./controllers/error');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/favicon.ico', (req, res) => res.status(204));

app.use(mainMiddleware);

app.use(require('./config/jwt'));
app.use(validationMiddleware);

fs.readdirSync(`${appRoot}/routes`).map(file => {
    require('./routes/' + file)(app);
});

app.use(errorController);

app.listen(process.env.SERVER_PORT, function () {
    logger.info('API server running. %o', { port: process.env.SERVER_PORT });
});