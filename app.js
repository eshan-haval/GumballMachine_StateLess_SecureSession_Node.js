var express = require('express');
var path = require('path');
var http = require('http');

var routes = require('./routes');
var func = require('./routes/index');
var users = require('./routes/user');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

/*var connection = require('./connection');
connection.connect(function(err) {
  // connected! (unless `err` is set)
});*/
//module.exports = connection;
var app = express();
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
 

// view engine setup
//app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
//app.get('/Gumball/:model/:serial/:state', routes.gumball);

//app.post('/eventName', routes.event);
//app.post('/:model/*', routes.event);
app.post('/GumballAction',routes.GumballAction);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/*http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
	});
*/


http.createServer(app).listen(server_port, server_ip_address, function () {
	  console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
	});

module.exports = app;

