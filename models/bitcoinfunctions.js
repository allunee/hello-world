var bitcoin = require('bitcoin');
var express     = require('express');

// Returns the current bitcoin address for receiving payments to this account. 
// If <account> does not exist, it will be created along with an associated new address that will be returned.
exports.getAccountAddress = function (req, res) {
    // whatever
	var client = new bitcoin.Client({  host: req.body.host,	   port: req.body.port,	   user: req.body.rpcuser,	   pass: req.body.rpcpass	});
	var label = req.body.btcAccount || req.query.btcAccount ;
	if(label == '' || label == '*')
	{
		res.json({ errors: 'Failed Account' });
	}
	// this function just used with btc label ( account )	
	client.getAccountAddress(label, function(err, data) {
		if (err){
			res.json({ message: err });
		}
		else{
			res.json(data);
		}
	});
}

exports.getAddressesByAccount = function (req, res) {
    // whatever
	var client = new bitcoin.Client({  host: req.body.host,	   port: req.body.port,	   user: req.body.rpcuser,	   pass: req.body.rpcpass	});
	var label = req.body.btcAccount || req.query.btcAccount ;
	if(label == '' || label == '*')
	{
		res.json({ errors: 'Failed Account' });
	}
	// this function just used with btc label ( account )	
	client.getAddressesByAccount(label, function(err, data) {
		if (err){
			res.json({ message: err });
		}
		else{
			res.json(data);
		}
	});
}


exports.getReceivedByAddress = function (req, res) {
    // whatever
	var client = new bitcoin.Client({  host: req.body.host,	   port: req.body.port,	   user: req.body.rpcuser,	   pass: req.body.rpcpass	});
	var label = req.body.btcAddress || req.query.btcAddress ;
	if(label == '' || label == '*')
	{
		res.json({ errors: 'Failed address' });
	}
	// this function just used with btc label ( account )	
	client.getReceivedByAddress(label, parseInt(req.body.confirms), function(err, data) {
		if (err){
			res.json({ message: err });
		}
		else{
			res.json(data);
		}
	});
}

exports.getWalletBalance = function (req, res) {
    // whatever
	var client = new bitcoin.Client({  host: req.body.host,	   port: req.body.port,	   user: req.body.rpcuser,	   pass: req.body.rpcpass	});
	var label = req.body.btcAccount || req.query.btcAccount ;
	if(label == '' || label == '*')
	{
		res.json({ errors: 'Failed address' });
	}
	// this function just used with btc label ( account )	
	client.getBalance(label, parseInt(req.body.confirms), function(err, balance) {
		if (err){
			res.json({ message: err });
		}
		else{
			res.json(balance);
		}
	});
}

exports.getBalance = function (req, res) {
    // whatever
	var client = new bitcoin.Client({  host: req.body.host,	   port: req.body.port,	   user: req.body.rpcuser,	   pass: req.body.rpcpass	});
	// this function just used with btc label ( account )	
	client.getBalance('*', parseInt(req.body.confirms), function(err, balance) {
		if (err){
			res.json({ message: err });
		}
		else{
			res.json(balance);
		}
	});
}

exports.getListtransactions = function (req, res) {
    // whatever
	var client = new bitcoin.Client({  host: req.body.host,	   port: req.body.port,	   user: req.body.rpcuser,	   pass: req.body.rpcpass	});
	var label = req.body.btcAccount || req.query.btcAccount ;
	if(label == '' || label == '*')
	{
		res.json({ errors: 'Failed account' });
	}
	// this function just used with btc label ( account )	
	client.listTransactions(label, function(err, data) {
		if (err){
			res.json({ message: err });
		}
		else{
			// for (var key in data) {
				// delete data[key]['walletconflicts'];
				// delete data[key]['bip125-replaceable'];
			// }
			res.json(data);
		}
	});
}

exports.sendFrom = function (req, res) {
    // whatever
	var client = new bitcoin.Client({  host: req.body.host,	   port: req.body.port,	   user: req.body.rpcuser,	   pass: req.body.rpcpass	});
	var label = req.body.btcAccount 

	// this function just used with btc label ( account )	
	client.sendFrom(req.body.btcAccount,req.body.btcAddress, parseFloat(req.body.amount), parseInt(req.body.confirms),req.body.comment, req.body.commentto, function(err, data) {
		if (err){
			res.json({ message: err });
		}
		else{
			res.json(data);
		}
	});
}

exports.getTransaction = function (req, res) {
    // whatever
	var client = new bitcoin.Client({  host: req.body.host,	   port: req.body.port,	   user: req.body.rpcuser,	   pass: req.body.rpcpass	});
	// this function just used with btc label ( account )	
	client.getTransaction(req.body.txid, function(err, data) {
		if (err){
			res.json({ message: err });
		}
		else{
			res.json(data);
		}
	});
}

