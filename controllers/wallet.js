var express = require('express');
var async = require('async');
var request = require('request');
var querystring = require('querystring');
var router = express.Router() ;
var passwordHasher = require('aspnet-identity-pw');
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
    // console.log(req.decoded._doc);
    var data = {
        title: 'Wallet Page',
        description: 'Page Description',
        header: 'Page Header'        
    };

    res.render('wallet/index', data);    
})

// router.get('/getinfo', Helpers.isAuthenticated, function(req, res, next) {
//     async.parallel({
//         btc: function(callback) {
//             if(!req.decoded._doc.btcAddress || req.decoded._doc.btcAddress == '' || typeof req.decoded._doc.btcAddress == 'undefined'){
//                 var form = {
//                     host : '210.211.109.165', 
//                     port : 8332,
//                     rpcuser : 'dark',
//                     rpcpass : 'alluneedev',
//                     account : req.body.username
//                 };
//                 var formData = querystring.stringify(form);
//                 var contentLength = formData.length;
//                 request({
//                     headers: {
//                         'Content-Length': contentLength,
//                         'Content-Type': 'application/x-www-form-urlencoded'
//                     },
//                     uri: 'http://45.77.245.205:8080/api/owncoin/getaccountaddress',
//                     body: formData,
//                     method: 'POST'
//                   }, function (err, response) {
//                     //it works!
//                         if (!err && response.statusCode === 200) {
//                             callback(null, JSON.parse(response.body));
//                         }else{
//                             callback(null, false);
//                         }
//                 });
//             }else{
//                 console.log("da co");
//                 callback(null, req.decoded._doc.btcAddress);
//             }
            
//         },

//     }, function(err, results) {
//         if(results.btc != false){
//             var query = {
//                 _id : req.decoded._doc._id,
//             };
//             var setField = {$set: { btcAddress: results.btc }};
//             User.update(query, setField, {upsert: true}, function(err, up){
//                 req.decoded._doc.btcAddress = results.btc;
//                 res.json(results);
//                 // console.log(err); console.log(up);
//             })
//         }
        
//     })  ;  
// })

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

    // Check balance Amount
    async.parallel({
        checkbalance: function(callback) {
            User.GetUserByID(req.decoded._doc._id, function(result){
                if(result.user.free == 0){
                    callback(null, {status : false, balance : balance, mes : 'Please watting process ...'});
                }else{
                    var balance = result.user.btcAmount;
                    var query = {
                        _id : req.decoded._doc._id,
                    };
                    var setField = {$set: { free: 0}};
                    User.update(query, setField, {upsert: true}, function(err, up){
                        //  console.log(setField, up);
                    })
                    if((parseFloat(req.body.btcAmount) + 0.005) > balance){
                        callback(null, {status : false, balance : balance, mes : "Your BTC balance is not enough", pass : result.user.password});
                    }else{
                        callback(null, {status: true, balance: balance, pass : result.user.password});
                    }
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
        if(!passwordHasher.validatePassword(req.body.confirmPassword, results.checkbalance.pass)){
            res.json({status: false, mes: 'Password not correct'});
            return;
        }   
        if(!results.checkbalance.status){
            res.json({status : false, mes : results.checkbalance.mes});
            return;
        }
        var type = 'send';
        var status = 1;
        if(results.checkReceiver.status == false){
            type = 'withdraw'; status = 0;
        }
        // Add transaction for sender
        var listTrans = [];
        var time = new Date();
        var t = {
            idUser : req.decoded._doc._id,
            address : req.body.btcAddress,           // address of btc or vnc
            walletType : "btc",        // btc or vnc
            amount : -parseFloat(req.body.btcAmount),
            type: type,        // buy, sell, deposit, withdraw, send, get, fee
            datecreate :  time ,
            status : status,            //
            txid : ""
        }
        listTrans.push(t);
        var fee = {
            idUser : req.decoded._doc._id,
            address : req.body.btcAddress,           // address of btc or vnc
            walletType : "btc",        // btc or vnc
            amount : -0.0005,
            type: "fee",        // buy, sell, deposit, withdraw, send, get, fee
            datecreate :  time ,
            status : 1,            //
            txid : ""
        }
        listTrans.push(fee);
        if(results.checkReceiver.status){
            var tReceiver = {
                idUser : results.checkReceiver.user._id,
                address : results.checkReceiver.user.btcAddress,           // address of btc or vnc
                walletType : "btc",        // btc or vnc
                amount : parseFloat(req.body.btcAmount),
                type: "get",        // buy, sell, deposit, withdraw, send, get, fee
                datecreate :  time ,
                status : 1,            //
                txid : ""
            };
            listTrans.push(tReceiver);
        }
        Transaction.insertMany(listTrans, function(err, db){
            if(!err){
                var query = {
                    _id : req.decoded._doc._id,
                };
                var setField = {$set: { btcAmount: parseFloat(results.checkbalance.balance - req.body.btcAmount - 0.0005 ).toFixed(8) , free : 1}};
                // Update Amount of sender
                User.update(query, setField, {upsert: true}, function(err, up){
                    if(results.checkReceiver.status){
                        // Update Amount of reveiver
                        var query = {
                            _id : results.checkReceiver.user._id,
                        };
                        var setField = {$set: { btcAmount: (results.checkReceiver.user.btcAmount + parseFloat(req.body.btcAmount) ) }};
                        User.update(query, setField, {upsert: true}, function(err, up){
                            // console.log(err); console.log(up);
                        })
                    }
                    res.json({status : false, mes : "Withdraw completed ..."});
                })
            }else{
                res.json({status : false, mes : "Something wrong, try again later"});
                return;
            }
            
        })

    });

})


router.post('/withdrawvnc', Helpers.isAuthenticated, function(req, res, next){
    
    if(!req.body.vncAmount){
        res.json({status : false, mes : "please enter vnc amount"});
        return;
    }
    if(typeof parseFloat(req.body.vncAmount) != "number" ){
        res.json({status : false, mes : "vnc amount must be number"});
        return;
    }
    if(!req.body.vncAddress){
        res.json({status : false, mes : "please enter vnc address"});
        return;
    }
    if(!req.body.confirmPassword){
        res.json({status : false, mes : "please enter password"});
        return;
    }
    
    async.parallel({
        // Check balance Amount
        checkbalance: function(callback) {  
            User.GetUserByID(req.decoded._doc._id, function(result){
                if(result.user.free == 0){
                    callback(null, {status : false, balance : balance, mes : 'Please watting process ...'});
                }else{
                    var balance = result.user.vncAmount;
                    var query = {
                        _id : req.decoded._doc._id,
                    };
                    var setField = {$set: { free: 0}};
                    User.update(query, setField, {upsert: true}, function(err, up){
                        //  console.log(setField, up);
                    })
                    if((parseFloat(req.body.vncAmount) + 0.005) > balance){
                        callback(null, {status : false, balance : balance, mes : "Your VNC balance is not enough", pass : result.user.password});
                    }else{
                        callback(null, {status: true, balance: balance, pass : result.user.password});
                    }
                }
                
            });
        },
        checkReceiver: function(callback) {
            // CHeck if withdraw address in system or not 
            // IF in system, add transaction for receiver
            User.GetUserByVncAddress(req.body.vncAddress, function(result){
                callback(null, result);
            })
        }
    }, function(err, results) {      
        console.log(req.body.confirmPassword, results.checkbalance);
        if(!passwordHasher.validatePassword(req.body.confirmPassword, results.checkbalance.pass)){
            res.json({status: false, mes: 'Password not correct'});
            return;
        }
        if(!results.checkbalance.status){
            res.json({status : false, mes : results.checkbalance.mes});
            return;
        }
        var type = 'send';
        var status = 1;
        if(results.checkReceiver.status == false){
            type = 'withdraw'; status = 0;
        }
        // Add transaction for sender
        var listTrans = [];
        var time = new Date();
        var t = {
            idUser : req.decoded._doc._id,
            address : req.body.vncAddress,           // address of btc or vnc
            walletType : "vnc",        // btc or vnc
            amount : -parseFloat(req.body.vncAmount),
            type: type,        // buy, sell, deposit, withdraw, send, get, fee
            datecreate :  time ,
            status : status,            //
            txid : ""
        }
        listTrans.push(t);
        var fee = {
            idUser : req.decoded._doc._id,
            address : req.body.vncAddress,           // address of btc or vnc
            walletType : "vnc",        // btc or vnc
            amount : -0.0005,
            type: "fee",        // buy, sell, deposit, withdraw, send, get, fee
            datecreate :  time ,
            status : 1,            //
            txid : ""
        }
        listTrans.push(fee);
        if(results.checkReceiver.status){
            var tReceiver = {
                idUser : results.checkReceiver.user._id,
                address : results.checkReceiver.user.vncAddress,           // address of btc or vnc
                walletType : "vnc",        // btc or vnc
                amount : parseFloat(req.body.vncAmount),
                type: "get",        // buy, sell, deposit, withdraw, send, get, fee
                datecreate :  time ,
                status : 1,            //
                txid : ""
            };
            listTrans.push(tReceiver);
        }
        console.log(listTrans);
        Transaction.insertMany(listTrans, function(err, db){
            if(!err){
                var query = {
                    _id : req.decoded._doc._id,
                };
                var setField = {$set: { vncAmount: parseFloat(results.checkbalance.balance - req.body.vncAmount - 0.0005 ).toFixed(8) , free : 1}};
                // Update Amount of sender
                User.update(query, setField, {upsert: true}, function(err, up){
                    if(results.checkReceiver.status){
                        // Update Amount of reveiver
                        var query = {
                            _id : results.checkReceiver.user._id,
                        };
                        var setField = {$set: { vncAmount: (results.checkReceiver.user.vncAmount + parseFloat(req.body.vncAmount) ) }};
                        User.update(query, setField, {upsert: true}, function(err, up){
                            // console.log(err); console.log(up);
                        })
                    }
                    res.json({status : false, mes : "Withdraw completed ..."});
                })
            }else{
                res.json({status : false, mes : "Something wrong, try again later"});
                return;
            }
            
        })

    });

});


module.exports = router