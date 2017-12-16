
var Helpers = require('./helpers');
var express = require('express');
var async = require('async');
var request = require('request');
var querystring = require('querystring');
var router = express.Router() ;
var User   = require('../models/user');
var Role   = require('../models/role');
var UserRole   = require('../models/userrole');
var UserAuth   = require('../models/userauth');
var passwordHasher = require('aspnet-identity-pw');
var jwt = require('jsonwebtoken');
var config = require('../config'); // get our config file
var Helpers = require('./helpers'); 
var secretKey = config.secret;
// router.use('/animals', require('./animals'))
router.use('/user', require('./user'));
router.use('/ico', require('./ico'));
router.use('/exchange', require('./exchange'));
router.use('/transaction', require('./transaction'));
router.use('/wallet', require('./wallet'));
router.use('/downline', require('./downline'));


function randomAddress(length, callbackA) {
    var text = "S";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    async.parallel({
        check: function(callback) {
            User.GetUserByvncAddress(text, function(result){
                callback(null, result);
            })
        }
    }, function(err, results) {
        if(results.check.status){
            //console.log("lap lai");
            randomAddress(length, callbackA);
        }else{
            //console.log(text);
            callbackA (text);
        }
        // results is now equals to: {one: 1, two: 2}
    });
    
}

router.get('/setup', function(req, res) {	
	var initdata   = require('../models/initdata'); // get our mongoose model
	initdata.Init();
});

router.get('/', function(req, res) {
    var data = {
        title: 'HeliCoin Home Page',
        description: 'Page Description',
        header: 'Page Header',
    };
    res.render("home/index", data);
})

router.get('/ico-campaign', function(req, res) {
    var data = {
        title: 'ICO page',
        description: 'Page Description',
        header: 'Page Header',
    };
    res.render("home/ico-campaign", data);
})

router.get('/roadmaps', function(req, res) {
    var data = {
        title: 'Roadmaps Page',
        description: 'Page Description',
        header: 'Page Header',
    };
    res.render("home/roadmaps", data);
})

router.get('/lending-campaign', function(req, res) {
    var data = {
        title: 'Lending Page',
        description: 'Page Description',
        header: 'Page Header',
    };
    res.render("home/lending-campaign", data);
})

router.get('/about', Helpers.isAuthenticated, function(req, res) {
    res.send('Learn about us')
})

router.get('/dashboard', Helpers.isAuthenticated, function(req, res) {
    res.redirect('/ico');
})

router.get('/register', function(req, res) {
    var data = {
        title: 'Register',
        description: 'Page Description',
        header: 'Page Header',
    };
    res.render("home/register", data);
})

router.post('/register', function(req, res) {
    var secret = config.reCaptchaKSecrect;
    if(req.headers.host.indexOf('localhost') > -1){
        secret = config.reCaptchaKSecrectLocal;
    }
    if(!req.body.sponsor){
        res.json({status: false, mes : 'You can not register without sponsor .'});
        return;
    }
    var check = Helpers.RegularUsername(req.body.username.toLowerCase());
    if(check.status == false){
        res.json(check);
        return;
    }
    var checkpass = Helpers.RegularPassword(req.body.password);
    if(checkpass.status == false){
        res.json(checkpass);
        return;
    }
    var user = {
        username: req.body.username.toLowerCase(),
        email : req.body.email.toLowerCase(),
        password : passwordHasher.hashPassword(req.body.password),
        phone : req.body.phonenumber,
        sponsor : req.body.sponsor,
        datecreate : new Date(),
    };    
    
    async.parallel({
        checkCaptcha: function(callback){
            var form = {
                secret : secret,
                response :  req.body['g-recaptcha-response'],
            }
            var uri = 'https://www.google.com/recaptcha/api/siteverify';
            Helpers.DoApiRequest(form, uri, function(result){
                callback(null, result);
            })
        },
        getSponsor: function(callback) {
            User.GetUserByUsername(req.body.sponsor, function(result){
                callback(null, result);
            })
        },
        CountSponsorDownline: function(callback) {
            User.CountSponsorDownline(user.sponsor, function(count){
                callback(null, count);
            })
        },
        countMember: function(callback){
            User.count({},function(err, result){
                callback(null, result);
            })
        },
        btcAddress: function(callback) {
            var form = Helpers.InitWalletClient('btc');
            form.account = req.body.username;
            var uri = 'http://45.76.156.203:8080/api/owncoin/getaccountaddress';
            Helpers.DoApiRequest(form, uri, function(result){
                callback(null, result);
            })
        },
        vncAddress : function(callback){
            var form = Helpers.InitWalletClient('vnc');
            form.account = req.body.username;
            var uri = 'http://45.76.156.203:8080/api/owncoin/getaccountaddress';
            Helpers.DoApiRequest(form, uri, function(result){
                callback(null, result);
            })
        }
    }, function(err, results) {
        if(results.checkCaptcha.success == false){
            res.json({status: false, mes : 'Please verify the captcha.'});
            return;
        }
        if(results.getSponsor.status){
            user.idSponsor = results.getSponsor.user.id;
            user.sponsorAddress = results.getSponsor.user.sponsorAddress + '-' + results.CountSponsorDownline;
            user.sponsorLevel = results.getSponsor.user.sponsorLevel + 1;
            user.parentCode = results.getSponsor.user.code;
        }else{
            user.sponsorAddress =  results.CountSponsorDownline;
            user.sponsorLevel = 0;
            user.parentCode = -1;
        }
        user.code = results.countMember;
        user.btcAddress = results.btcAddress;
        user.vncAddress = results.vncAddress;
        user.btcAmount = 0;
        user.vncAmount = 0;
        User.addUser(user, ["member"], function(result){
            res.json(result);
        });
        // results is now equals to: {one: 1, two: 2}
    });
     
})

router.get('/login', function(req, res){
    var token = req.body.token || req.query.token || Helpers.getCookies(req.headers.cookie, "x-access-token");
    if(token){
        if(req.query.redirect){
            res.redirect(req.query.redirect);
        }else{
            res.redirect("/dashboard");
        }
    }
    var data = {
        title: 'Login',
        description: 'Page Description',
        header: 'Login page',
    };
    res.render('home/login', data);
});

router.post('/login', function(req, res){
    var secret = config.reCaptchaKSecrect;
    if(req.headers.host.indexOf('localhost') > -1){
        secret = config.reCaptchaKSecrectLocal;
    }
    if(!req.body.Login){
        res.json({status: false, mes: 'Please enter username or email'});
    }else if(!req.body.Password){
        res.json({status: false, mes: 'Please enter password'});
    }else{
        async.parallel({
            checkCaptcha: function(callback){
                var form = {
                    secret : secret,
                    response :  req.body['g-recaptcha-response'],
                }
                var uri = 'https://www.google.com/recaptcha/api/siteverify';
                Helpers.DoApiRequest(form, uri, function(result){
                    callback(null, result);
                })
            },
            username: function(callback) {
                User.GetUserByUsername(req.body.Login, function(result){
                    callback(null, result);
                })
            },
            email: function(callback) {
                User.GetUserByEmail(req.body.Login, function(result){
                    callback(null, result);
                })
            }
        }, function(err, results) {
            if(results.checkCaptcha.success == false){
                res.json({status: false, mes : 'Please verify the captcha.'});
                return;
            }
            if(results.username.status == false && results.email.status == false){
                res.json({status: false, mes: 'Invalid username or email'});
                return;
            }
            
            var userfinded = results.username.user;
            if(results.email.status == true){
                userfinded = results.email.user;
            }
            if(!passwordHasher.validatePassword(req.body.Password, userfinded.password)){
                res.json({status: false, mes: 'Password not correct'});
            }else{
                
                var token = jwt.sign( userfinded, secretKey, { 
                    expiresIn : 60*60*24 // expires in 24 hours
                });
                
                var item = {
                    iduser : userfinded.id,
                    username: userfinded.username,
                    token : token
                };
                UserAuth.AddUserAuth(item, function(){
                    
                });
                res.cookie('x-access-token', token, { expires: new Date(Date.now() + 1000*60*60*24)});
                //console.log(new Date(Date.now()), ' - ' ,new Date(Date.now() + 1000*60*60*24*365));
                res.json({status: true, mes: 'login success', token: token});
                
            }   
        });
    }

});

module.exports = router