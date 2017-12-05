// get an instance of mongoose and mongoose.Schema
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./../config'); // get our config file
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var UserBet = new Schema ({
    hash: String,
    username: String, 
    gamecount: Number,
    datecreate : { type : Date, default: Date.now },
    cashout : Number,
});
var UserBet = mongoose.model('UserBet', UserBet);
module.exports = UserBet ;

module.exports.AddUserBet = function(item, callback){
    var userauth = new UserAuth({
        hash : item.hash,
        username : item.username,
        gamecount : item.gamecount,
        datecreate : item.datecreate,
        cashout : item.cashout,
    });

    userauth.save(function(err, result) {
		if (err) {
            callback({status: false, id: null});
			throw err;
		}
		else {
            //console.log(result);
			//callback({status : true, id: result.id});
		}
	});
}

