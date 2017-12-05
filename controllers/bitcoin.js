var express = require('express');
var router = express.Router() ;
var User   = require('../models/user');
var Role   = require('../models/role');
var UserRole   = require('../models/userrole');
var UserAuth   = require('../models/userauth');
var jwt = require('jsonwebtoken');
var config = require('../config'); // get our config file
var secretKey = config.secret;
// router.use('/animals', require('./animals'))





router.get('/', function(req, res, next) {
    res.redirect("/api/bitcoin/index");
})
router.get('/index', function(req, res, next) {
    var data = {
        title: 'bitcoin index',
        description: 'Page Description',
        header: 'bitcoin index'
    };
    res.json( data);    
})

var btcFunctions = require('./../models/bitcoinfunctions');
router.post('/getWalletBalance', function(req, res) {
	btcFunctions.getWalletBalance(req, res);
});   
router.post('/getBalance', function(req, res) {
	btcFunctions.getBalance(req, res);
});  
router.post('/getListtransactions', function(req, res) {
	btcFunctions.getListtransactions(req, res);
});
router.post('/getAccountAddress', function(req, res) {
	btcFunctions.getAccountAddress(req, res);
});
router.post('/getReceivedByAddress', function(req, res) {
	btcFunctions.getReceivedByAddress(req, res);
});
router.post('/getAddressesByAccount', function(req, res) {
	btcFunctions.getAddressesByAccount(req, res);
});
router.post('/sendFrom', function(req, res) {
	btcFunctions.sendFrom(req, res);
});
router.post('/getTransaction', function(req, res) {
	btcFunctions.getTransaction(req, res);
});


module.exports = router