/*jslint nomen: true*/
/*global console, require, process, __dirname */

var express = require('express'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    app = express();

var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            'use strict';
            if (!this._sections) {
                this._sections = {};
            }
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);

//body-parser is needed to read the post data
app.use(bodyParser.urlencoded({
    extended: true
}));

// add routes
require('./routes.js')(app);

// add support for auto views
var autoViews = {};

app.use(function (req, res, next) {
    var path = req.path.toLowerCase();
    // check cache; if it's there, render the view
    if (autoViews[path]) return res.render(autoViews[path]);
    // if it's not in the cache, see if there's
    // a .handlebars file that matches
    if (fs.existsSync(__dirname + '/views' + path + '.handlebars')) {
        autoViews[path] = path.replace(/^\//, '');
        return res.render(autoViews[path]);
    }
    // no view found; pass on to 404 handler
    next();
});

// custom 404 page
app.use(function (req, res) {
    'use strict';
    res.status(404);
    res.render('404');
});

// custom 500 page
app.use(function (err, req, res, next) {
    'use strict';
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

function startServer() {
    'use strict';
    app.listen(app.get('port'), function () {
        console.log('Express started in ' + app.get('env') +
            ' mode on http://localhost:' + app.get('port') +
            '; press Ctrl-C to terminate.');
    });
}

startServer();