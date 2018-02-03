const config = require('../config');
var http = require('http');

exports.index = function(req, res){
	
	res.render('index');

};

exports.login = function(req, res){
	
	req.session.wallet = req.body.wallet;
	req.session.password = req.body.password;
	res.sendStatus(200);

};

function httpRequest(type, path, callback, data=null) {
	
	  var options = {
	      host: config.NODE_ADDRESS,
	      port: config.NODE_PORT,
	      path: path,
	      method: type,
	      headers: {
	          'Content-Type': 'application/json'
	      }
	  };

	  var req = http.request(options, function(res) {
	      res.setEncoding('utf8');
	      res.on('data', function (chunk) {
	          callback(chunk);
	      });
	  });
	  
	  if (data) req.write(data);
	  req.end();

}

exports.nextBlock = function(req, res){
	
	httpRequest("GET", "/operator/wallets/" + req.session.wallet + "/addresses", function (response) {
		
		var addresses = {}
		addresses.rewardAddress = response
		addresses.feeAddress = response
		
		httpRequest("POST", "/miner/block", function(response) {
			
			res.status(200).send(response);
			
		}, JSON.stringify(addresses));
		
	});
	
};

exports.difficulty = function(req, res){
	
	httpRequest("GET", "/blockchain/difficulty", function(response) {
		
		res.status(200).send(response);
		
	});

};

exports.putBlock = function(req, res){
	
	httpRequest("PUT", "/blockchain/blocks/latest", function(response) {
		
		res.status(200).send(response);
		
	}, JSON.stringify(req.body));

};