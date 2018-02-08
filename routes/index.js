const config = require('../config');
var http = require('http');

function httpRequest(type, path, callback, data=null, headers={}) {
	 
	headers["Content-Type"] = "application/json"
	
	var options = {
		host: config.NODE_ADDRESS,
		port: config.NODE_PORT,
		path: path,
		method: type,
		headers: headers
	};

	var req = http.request(options, function(res) {
		
		res.setEncoding('utf8');
		
		res.on('data', function (chunk) {
		
			callback(chunk);
		
		});
	
	});
	  
	if (data) req.write(JSON.stringify(data));
	req.end();

}

function getBalance(req, res, callback) {
	
	httpRequest("GET", "/operator/" + req.session.address + "/balance", function(balance) {
		
		if (balance[0] == "N") {
			callback(0);
		} else {
			callback(JSON.parse(balance).balance);
		}
		
	});

}

function walletToAddress(wallet, req, res, callback) {
	
	httpRequest("GET", "/operator/wallets/" + wallet + "/addresses", function (address) {
		
		callback(address);
		
	});

}

exports.index = function(req, res){
	
	if ( req.session.wallet && req.session.password ) {
		
		getBalance(req, res, function(balance) {
			
			res.render('index', { balance: balance });
			
		});
		
	} else {
		
		res.render('index');
		
	}
	
};

exports.newWallet = function(req, res) {
	
	httpRequest("POST", "/operator/wallets", function(response) {
		
		res.status(200).send(response);
		
	}, req.body);
	
}

exports.addressForWallet = function(req, res) {
	
	httpRequest("POST", "/operator/wallets/" + req.params.walletId + "/addresses", function(response) {
		
		res.status(200).send(response);
		
	}, req.body, req.headers);
	
}

exports.login = function(req, res){
	
	req.session.wallet = req.body.wallet;
	req.session.password = req.body.password;
	
	walletToAddress(req.session.wallet, req, res, function(address) {
		
		req.session.address = address
		res.sendStatus(200);
		
	});
	
};

exports.logout = function(req, res){
	
	req.session.destroy();
	res.sendStatus(200);
	
};

exports.nextBlock = function(req, res){
	
	if ( typeof req.session.address != "undefined" ) {
		
		var addresses = {}
		addresses.rewardAddress = req.session.address
		addresses.feeAddress = req.session.address
		
		httpRequest("POST", "/miner/block", function(response) {
			
			res.status(200).send(response);
			
		}, addresses);
	
	} else {
		
		res.status(200).send("Not logged in.");
		
	}
	
};

exports.difficulty = function(req, res){
	
	httpRequest("GET", "/blockchain/difficulty", function(response) {
		
		res.status(200).send(response);
		
	});

};

exports.reward = function(req, res){
	
	httpRequest("GET", "/blockchain/reward", function(response) {
		
		res.status(200).send(response);
		
	});

};

exports.putBlock = function(req, res){
	
	httpRequest("PUT", "/blockchain/blocks/latest", function(response) {
		
		res.status(200).send(response);
		
	}, req.body);

};

exports.getBalance = function(req, res) {
	
	getBalance(req, res, function(balance) {
		
		res.status(200).send(balance.toString());
		
	});
	
}

exports.addTransaction = function(req, res) {
	
	var headers = {}
	headers["password"] = req.session.password;
	
	var transaction = {}
	transaction.fromAddress = req.session.address;
	walletToAddress(req.body.toWallet, req, res, function(address) {
		transaction.toAddress = address;
		
		transaction.amount = req.body.amount;
		
		httpRequest("POST", "/operator/wallets/" + req.session.wallet + "/transactions", function (response) {
			console.log(response);
			res.sendStatus(200);
		}, transaction, headers);
	});

}