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
        title: 'ether index',
        description: 'Page Description',
        header: 'ether index'
    };
    res.json( data);    
})

var ethFunctions = require('./../models/etherfunctions');

router.post('/getBalance', function(req, res) {
	ethFunctions.getBalance(req, res);
});  
router.post('/sendRawTransaction', function(req, res) {
	ethFunctions.sendRawTransaction(req, res);
});  
router.post('/getTransaction', function(req, res) {
	ethFunctions.getTransaction(req, res);
});  

module.exports = router