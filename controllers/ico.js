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




// router.get('/', function(req, res, next) {
//     res.redirect("/market/index");
// })
router.get('/', Helpers.isAuthenticated, function(req, res, next) {
    var data = {
        title: 'ICO Page',
        description: 'Page Description',
        header: 'Page Header'        
    };
    res.render('ico/index', data);    
})

router.post('/buy', Helpers.isAuthenticated, function(req, res, next) {
    if(!req.body.btcAmount){
        res.json({status : false, mes : "please enter btc amount"});
        return;
    }
    if(typeof parseFloat(req.body.btcAmount) != "number" ){
        res.json({status : false, mes : "btc amount must be number"});
        return;
    }
    if(!req.body.vncAmount){
        res.json({status : false, mes : "please enter vnc amount"});
        return;
    }
    if(typeof parseFloat(req.body.vncAmount) != "number" ){
        res.json({status : false, mes : "vnc amount must be number"});
        return;
    }
    // if(req.body.confirmPassword != req.decoded._doc.password){
    //     res.json({status : false, mes : "password is not correct"});
    //     return;
    // }

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
                    })
                    if((parseFloat(req.body.btcAmount) ) > balance){
                        callback(null, {status : false, balance : balance, mes : "Your BTC balance is not enough"});
                    }else{
                        callback(null, {status: true, balance: balance});
                    }
                }
                
            });
        }
    }, function(err, results) { 
        if(!results.checkbalance.status){
            res.json({status : false, mes : results.checkbalance.mes});
            return;
        }
        // Add transaction for sender
        var time = new Date();
        var btcTran = {
            idUser : req.decoded._doc._id,
            address : req.decoded._doc.btcAddress,           // address of btc or vnc
            walletType : "btc",        // btc or vnc
            amount : -parseFloat(req.body.btcAmount),
            type: "buy",        // buy, sell, deposit, withdraw, fee
            datecreate :  time ,
            status : 1,            //
            txid : "",
            description : 'Buy ' + req.body.vncAmount + ' vnc'
        }
        var vncTran = {
            idUser : req.decoded._doc._id,
            address : req.decoded._doc.vncAddress,           // address of btc or vnc
            walletType : "vnc",        // btc or vnc
            amount : parseFloat(req.body.vncAmount),
            type: "buy",        // buy, sell, deposit, withdraw, fee
            datecreate :  time ,
            status : 1,            //
            txid : ""
        }

        Transaction.insertMany([btcTran, vncTran], function(err, db){
            if(!err){
                var query = {
                    _id : req.decoded._doc._id,
                };
                var setField = {$set: { 
                    btcAmount: parseFloat(results.checkbalance.balance - req.body.btcAmount).toFixed(8) , 
                    free : 1
                }};
                User.update(query, setField, {upsert: true}, function(err, up){
                    // console.log(err); console.log(up);
                    res.json({status : false, mes : "Withdraw completed ..."});
                })
            }else{
                res.json({status : false, mes : "Something wrong, try again later"});
                return;
            }
            
        })

    });
    
    
})



module.exports = router