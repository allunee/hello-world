var express = require('express');
var async = require('async');
var request = require('request');
var querystring = require('querystring');
var router = express.Router() ;
var User   = require('../models/user');
var Role   = require('../models/role');
var UserRole   = require('../models/userrole');
var UserAuth   = require('../models/userauth');
var Transaction   = require('../models/transaction');
var jwt = require('jsonwebtoken');
var config = require('../config'); // get our config file
var secretKey = config.secret;
var Helpers = require('./helpers');
// router.use('/animals', require('./animals'))




// router.get('/', function(req, res, next) {
//     res.redirect("/market/index");
// })
router.get('/', Helpers.isAuthenticated, function(req, res, next) {
    var data = {
        title: 'Transation Page',
        description: 'Page Description',
        header: 'Page Header'        
    };
    res.render('transaction/index', data);    
})

router.get('/gettransaction', Helpers.isAuthenticated, function(req, res, next) {
    async.parallel({
        transactions: function(callback) {
            Transaction.GetTransactionsByIdUser(req.decoded._doc._id, function(result){
                var btc = [];
                var vnc = [];
                result.transactions.forEach(element => {
                    if(result.walletType == 'btc'){
                        btc.push(element);
                    }else{
                        vnc.push(element);
                    }
                });
                callback(null, {btc : btc, vnc : vnc});
            })
        },

    }, function(err, results) {
        res.json(results.transactions);        
    })  ;  
})

router.post('/withdrawbtc', Helpers.isAuthenticated, function(req, res, next){
    
    if(!req.body.btcAmount){
        res.json({status : false, mes : "please enter btc amount"});
        return;
    }
    if(typeof parseFloat(req.body.btcAmount) != "number" ){
        res.json({status : false, mes : "btc amount must be number"});
        return;
    }
    if(!req.body.btcAddress){
        res.json({status : false, mes : "please enter btc address"});
        return;
    }
    if(!req.body.confirmPassword){
        res.json({status : false, mes : "please enter password"});
        return;
    }
    if(req.body.confirmPassword != req.decoded._doc.password){
        res.json({status : false, mes : "password is not correct"});
        return;
    }

    // Check balance Amount
    async.parallel({
        checkbalance: function(callback) {
            User.GetUserByID(req.decoded._doc._id, function(result){
                var balance = result.user.btcAmount;
                if((parseFloat(req.body.btcAmount) + 0.005) > balance){
                    callback(null, {status : false, balance : balance});
                }else{
                    callback(null, {status: true, balance: balance});
                }
            });
        },
        checkReceiver: function(callback) {
            // CHeck if withdraw address in system or not 
            // IF in system, add transaction for receiver
            User.GetUserByBtcAddress(req.body.btcAddress, function(result){
                callback(null, result);
            })
        }
    }, function(err, results) {
        // results is now equals to: {one: 1, two: 2}
        if(!results.checkbalance.status){
                res.json({status : false, mes : "Your BTC balance is not enough"});
                return;
        }
        // Add transaction for sender
        var time = new Date();
        var t = {
            idUser : req.decoded._doc._id,
            address : req.body.btcAddress,           // address of btc or vnc
            walletType : "btc",        // btc or vnc
            amount : 0 - parseFloat(req.body.btcAmount),
            type: "withdraw",        // buy, sell, deposit, withdraw, fee
            datecreate :  time ,
            status : 1,            //
            txid : ""
        }
        var fee = {
            idUser : req.decoded._doc._id,
            address : req.body.btcAddress,           // address of btc or vnc
            walletType : "btc",        // btc or vnc
            amount : -0.005,
            type: "fee",        // buy, sell, deposit, withdraw, fee
            datecreate :  time ,
            status : 1,            //
            txid : ""
        }
        Transaction.insertMany([t, fee], function(err, db){
            if(!err){
                var query = {
                    _id : req.decoded._doc._id,
                };
                var setField = {$set: { btcAmount: (results.checkbalance.balance + t.amount + fee.amount) }};
                User.update(query, setField, {upsert: true}, function(err, up){
                    // console.log(err); console.log(up);
                })
            }else{
                res.json({status : false, mes : "Something wrong, try again later"});
                return;
            }
            
        })

        if(results.checkbalance.status && results.checkReceiver.status){
            var tReceiver = {
                idUser : results.checkReceiver.user._id,
                address : results.checkReceiver.user.btcAddress,           // address of btc or vnc
                walletType : "btc",        // btc or vnc
                amount : parseFloat(req.body.btcAmount),
                type: "deposit",        // buy, sell, deposit, withdraw, fee
                datecreate :  time ,
                status : 1,            //
                txid : ""
            }
            Transaction.Add(tReceiver, function(result){
                // console.log(result);
                var query = {
                    _id : results.checkReceiver.user._id,
                };
                var setField = {$set: { btcAmount: (results.checkReceiver.user.btcAmount + tReceiver.amount ) }};
                User.update(query, setField, {upsert: true}, function(err, up){
                    // console.log(err); console.log(up);
                })
            })
        }
        

    });


    
    
    
    


})




module.exports = router