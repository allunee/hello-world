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
    var data = {
        title: 'Downline',
        description: 'Page Description',
        header: 'Page Header'        
    };
    res.render('downline/index', data); 
})





module.exports = router