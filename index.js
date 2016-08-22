'use strict';

var express = require('express'),
    kraken = require('kraken-js'),
    compression = require('compression'),
    useragent = require('express-useragent'),
    bodyParser = require('body-parser'),
    providerRouters = require('./lib/providerRouters'),
    logger = require('./lib/logger'),
    app,
    // Some OS requires root access for running an app listening on the port who is less than 1024.
    port = process.env.PORT || 8000;


app = module.exports = express();

// Used for checking browser compatibility.
app.use(useragent.express());
app.use(kraken());

// Enlarge the body size since insert / update a record
// may have a very large http body.
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

// serve static files that are provided by the main frame and the data source providers.
providerRouters.serveStaticFiles(app);
providerRouters.registerRoutes(app);

// For http response gzip compression.
app.use(compression());

app.on('start', function () {
    logger.info('KV Store Admin ready to serve requests.');

    // For how env variable works, please refer to http://expressjs.com/en/api.html and search for NODE_ENV.
    // If environment variable NODE_ENV is not specified or specified with 'development',
    // it is in development mode. In this case the static JS files won't be minified and
    // Dust templates won't be compiled.
    // If NODE_ENV is specified with other values, the static JS files will be minified and Dust templates
    // will be compiled to server-side JS files.
    // These features are all set from the configuration files in the config folder.
    logger.info('Environment: %s', app.kraken.get('env:env'));
});

app.listen(port, function (err) {
    if (err) {
        logger.error(err.stack);
    } else {
        logger.info('[%s] Listening on http://localhost:%d', app.settings.env.toUpperCase(), port);
    }
});
