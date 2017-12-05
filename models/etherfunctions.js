var Web3 = require('web3');
var util = require('ethereumjs-util');
var EthTx = require('ethereumjs-tx');
var lightwallet = require('eth-lightwallet');
var etherwallet = require("ethers-wallet");
// var prompt = require('prompt');
// prompt.start();
var txutils = lightwallet.txutils;
var express     = require('express');
var urlAPI = 'https://api.myetherapi.com/eth';

var web3 = new Web3(
    new Web3.providers.HttpProvider(urlAPI)
);

// var address = '0x72BbC56aA89fcb41cFF61cF45E8eD624Daf5bab6';
// var key = '1539751bdeba0046e4deb5c44457b8131ee4bad4dd051b97ae6c7e1bdd960c03';

// var balance = web3.eth.getBalance("0x72BbC56aA89fcb41cFF61cF45E8eD624Daf5bab6");

// console.log("Balance = " + web3.fromWei(balance, "ether"));


// Returns the current bitcoin address for receiving payments to this account. 
// If <account> does not exist, it will be created along with an associated new address that will be returned.
exports.getBalance = function (req, res) {
    // whatever	
	if(!util.isValidAddress(req.body.address))
	{
		res.json({ status: false, result: "invalid address" });
	}
	else{
		res.json({status: true, result: web3.fromWei(web3.eth.getBalance(req.body.address),"ether")})
	}
}


exports.sendRawTransaction = function (req, res) {
    //Create Buffer Encoded Class
	var pKey1x = new Buffer(req.body.privatekey, 'hex')
	//Create Raw Transaction Data Structure
	var rawTx = {
	  nonce: web3.toHex(web3.eth.getTransactionCount(req.body.fromaddress)),
	  to: req.body.toaddress,
	  gasPrice: web3.toHex(2000000000),
	  gasLimit: web3.toHex(21000),
	  value: web3.toHex(web3.toWei(req.body.value, 'ether')),
	  data: ""
	}
	//new Tx Variable and pass in rawTx
	var tx = new EthTx(rawTx)
	//Sign with Private Key
	tx.sign(pKey1x)
	//Serialize to String
	tx.serialize().toString('hex')
	//Send Raw Transaction
	web3.eth.sendRawTransaction(`0x${tx.serialize().toString('hex')}`, (error, data) => {
		if(!error) { 
			res.json({ status: true, result: data });
		}else{
			res.json({ status: false, result: error });
		}
	})
}


exports.getTransaction = function (req, res) {
    // whatever
	res.json(web3.eth.getTransaction(req.body.txid));
}

