var express = require('express');
var router = express.Router() ;
var User   = require('../models/user');
var Role   = require('../models/role');
var UserRole   = require('../models/userrole');
var UserAuth   = require('../models/userauth');
var Hash   = require('../models/hash');
var jwt = require('jsonwebtoken');
var config = require('../config'); // get our config file
var secretKey = config.secret;
var Helpers = require('./helpers');
// router.use('/animals', require('./animals'))




router.get('/', function(req, res, next) {
    res.redirect("/exchange/index");
})
router.get('/index', function(req, res, next) {
    var data = {
        title: 'Exchange Page',
        description: 'Page Description',
        header: 'Page Header'        
    };
    res.render('exchange/index', data);    
})

router.get('/createsellorder', Helpers.isAuthenticated, function(req, res, next){
    var data = {
        title: 'Loto game',
        description: 'Page Description',
        header: 'Page Header'        
    };
    res.render('play/loto', data); 
})

router.get('/createbuyorder', function(req, res, next){
    var currency = req.query.currency;
    var data = {
        title: 'Loto game',
        description: 'Page Description',
        header: 'Page Header'        
    };
    if(currency != '' && currency != null){

    }
    res.render('market/exchange', data); 
})



module.exports = router