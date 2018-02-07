
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , errorHandler = require('errorhandler');

var app = express();

var session = require('express-session');
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "secret"
}));

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ( 'development' == app.get('env') ) {
	
	app.use(errorHandler());

}

app.get('/', routes.index);

app.post('/login', routes.login);

app.post('/logout', routes.logout);

app.post('/miner/block', routes.nextBlock);

app.get('/blockchain/difficulty', routes.difficulty);

app.get('/blockchain/reward', routes.reward);

app.put('/blockchain/blocks/latest', routes.putBlock);

app.get('/operator/balance', routes.getBalance);

app.post('/operator/wallets/transactions', routes.addTransaction);

app.post('/operator/wallets', routes.newWallet);

app.post('/operator/wallets/:walletId/addresses', routes.addressForWallet);

http.createServer(app).listen(app.get('port'), function(){
	
	console.log('Express server listening on port ' + app.get('port'));

});
