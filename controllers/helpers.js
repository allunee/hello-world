// var express = require('express');
// var router = express.Router() ;
// var User   = require('../models/user');
// var Role   = require('../models/role');
// var UserRole   = require('../models/userrole');
var request = require('request');
var querystring = require('querystring');
var async = require('async');
var jwt = require('jsonwebtoken');
var Transaction = require('../models/transaction');
var User = require('../models/user');
var config = require('../config'); // get our config file
var secretKey = config.secret;
var urlRole = [
    {
        link : '/user/sendpoint',        role : 'send point'
    },
    {
        link : '/user/createaccount',        role : 'create account'
    },

]


function getCookies(cookie, cname){
    if(!cookie){
        return "";
    }
    var name = cname + "=";
    var ca = cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";    
}

function checkRole(url, userRole){
    
    for(var i = 0; i < urlRole.length; i++)
    {
        if(urlRole[i].link === url){
            for(var j = 0; j < userRole.length; j++){
                if(urlRole[i].role === userRole[j].name){
                    return true;
                }
            }
            return false;
        }
    }
    return true;
}

var Helpers = {};
module.exports = Helpers;

module.exports.RegularUsername = function (str) {
    // $pattern = "/^[a-z0-9_\.]{6,32}$/";
    var pattern = /^[a-z0-9_]{6,32}$/;
    var match = pattern.test(str);
    if ( ! match) {
        return  {status: false, mes : "Tên đăng nhập từ 6 đến 32 ký tự chữ và số và '_'"};
    }
    return {status:true, mes: ""};
}

module.exports.RegularPassword = function (str) {
    //      (/^
    //     (?=.*\d)                //should contain at least one digit
    //     (?=.*[a-z])             //should contain at least one lower case
    //     (?=.*[A-Z])             //should contain at least one upper case
    //     [a-zA-Z0-9]{8,}         //should contain at least 8 from the mentioned characters
    //     $/)
    var pattern = /^(?=.{6,})/;
    var match = pattern.test(str);
    if ( ! match) {
        return  {status: false, mes : "Mật khẩu ít nhất 6 ký tự"};
    }
    return {status:true, mes: ""};
}

module.exports.getCookies = function (cookie, cname){
    if(!cookie){
        return "";
    }
    var name = cname + "=";
    var ca = cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";    
}

module.exports.isAuthenticated = function (req, res, next) {
    // do any checks you want to in here
    // check header or url parameters or post parameters for token    
    var token = req.body.token || req.query.token || getCookies(req.headers.cookie, "x-access-token");

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, secretKey, function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;    
                // if(checkRole(req.originalUrl, decoded._doc.roles) === false){
                //     res.redirect("/login?redirect="+req.originalUrl);
                // }
                next();
            }
        });

    } else {
        res.redirect("/login?redirect="+req.originalUrl);
        // if there is no token
        // return an error
        // return res.status(403).send({ 
        //     success: false, 
        //     message: 'No token provided.' 
        // });

    }
    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    //if (req.user.authenticated)
    //     return next();

    // // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    // res.redirect('/');
}

module.exports.InitWalletClient = function(str){
    var form = {
        port : 8332, 
        rpcuser : 'dark',
        rpcpass : 'alluneedev',
    };
    if(str.toLowerCase() == 'btc'){
        form.host = '210.211.109.165';
    }else{
        form.host = '125.212.253.142';
    }
    return form;
}

module.exports.DoApiRequest = function(form, urlPost, callback){
    var formData = querystring.stringify(form);
    var contentLength = formData.length;
    request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: urlPost,
        body: formData,
        method: 'POST'
      }, function (err, response) {
            if (!err && response.statusCode === 200) {
                callback(JSON.parse(response.body));
            }else{
                callback(false);
            }
    });
}

module.exports.RequestBalance = function(user, callback){
    var btcAddress = user.btcAddress;
    var formBTC = this.InitWalletClient('btc');
    formBTC.account = user.username;
    var formVNC = this.InitWalletClient('vnc');
    formVNC.account = user.username;

    async.parallel({
        // Should be set User free is 0 until Update Amount finished .
        set:function(callback){
            var query = {
                _id : user.id,
            };
            var setField = {$set: { free: 0}};
            User.update(query, setField, {upsert: true}, function(err, up){
                callback(null, true);
            })
        },
        walletVNC: function(callback) {
            Helpers.DoApiRequest(formVNC, 'http://45.77.245.205:8080/api/owncoin/listtransactions', function(result){
                callback(null, result);
            });
        },
        walletBTC: function(callback) {
            Helpers.DoApiRequest(formBTC, 'http://45.77.245.205:8080/api/owncoin/listtransactions', function(result){
                callback(null, result);
            });
        },
        dbVNC: function(callback) {
            Transaction.GetTransactionsByIdUserOption(user.id, 'vnc', 'deposit', function(result){
                callback(null, result);
            });
        },
        dbBTC: function(callback) {
            Transaction.GetTransactionsByIdUserOption(user.id, 'btc', 'deposit', function(result){
                callback(null, result);
            });
        }
    }, function(err, results) {
        var listExistVNC = [];
        var listExistBTC = [];
        results.dbVNC.transactions.forEach(ele =>{
            listExistVNC.push(ele.txid);
        });
        results.dbBTC.transactions.forEach(ele =>{
            listExistBTC.push(ele.txid);
        });
        var listAdd = [];
        var amountVNC = 0;
        var amountBTC = 0;
        if(results.walletVNC.status != false){
            results.walletVNC.forEach(ele => {
                if(ele.category == 'receive' && listExistVNC.indexOf(ele.txid) == -1){
                    var trans = {
                        idUser : user.id,
                        address : user.vncAddress,           // address of btc or vnc
                        walletType : 'vnc',        // btc or vnc
                        amount : ele.amount,
                        type: 'deposit',        // buy, sell, deposit, withdraw, fee
                        datecreate :  ele.timereceived,
                        status : 0,            //
                        txid : ele.txid,
                        description : 'deposit vnc'
                    }
                    listAdd.push(trans);
                    amountVNC += (ele.amount);
                }
            });
        } 
        if(results.walletBTC.status != false){
            results.walletBTC.forEach(ele => {
                if(ele.category == 'receive' && listExistBTC.indexOf(ele.txid) == -1){
                    var trans = {
                        idUser : user.id,
                        address : user.btcAddress,           // address of btc or vnc
                        walletType : 'btc',        // btc or vnc
                        amount : ele.amount,
                        type: 'deposit',        // buy, sell, deposit, withdraw, fee
                        datecreate :  ele.timereceived,
                        status : 0,            //
                        txid : ele.txid,
                        description : 'deposit btc'
                    }
                    listAdd.push(trans);
                    amountBTC += (ele.amount);
                }
            });
        }
        
        if(listAdd.length > 0){
            Transaction.insertMany(listAdd, function(err, added){
                if(!err){
                    var query = {
                        _id : user.id,
                    };
                    var setField = {$set: { vncAmount: parseFloat(user.vncAmount + amountVNC).toFixed(8), btcAmount: parseFloat(user.btcAmount + amountBTC).toFixed(8), free : 1}};
                    User.update(query, setField, {upsert: true}, function(err, up){
                    })
                }else{
                    // Log Error
                }
                
            });
        }else{
            var query = {
                _id : user.id,
            };
            var setField = {$set: {  free : 1}};
            User.update(query, setField, {upsert: true}, function(err, up){
            })
        }

    });

    
}



