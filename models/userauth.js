// get an instance of mongoose and mongoose.Schema
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./../config'); // get our config file
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var UserAuth = new Schema ({
    idUser: String,
    username: String, 
    token: String,
    datecreate : { type : Date, default: Date.now },
    dateend : { type : Date, default: Date.now },
});
var UserAuth = mongoose.model('UserAuth', UserAuth);
module.exports = UserAuth ;

module.exports.AddUserAuth = function(item, callback){
    var userauth = new UserAuth({
        idUser : item.iduser,
        username : item.username,
        token : item.token,
        // datecreate : { type : Date, default: Date.now },
        // dateend : { type : Date, default: Date.now },
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

module.exports.CheckToken = function(str, callback){
    UserAuth.findOne({token : str}, function(err, userfinded){
		if(err){
			throw err;
		}
		if(!userfinded){
            //console.log(decoded._doc);
			callback({status: false, decoded : null});
		} else if (userfinded){
            if (jwt.decode(str).exp < Date.now() / 1000) {
                // login again!
                callback({status: false, decoded : null});
            }else{
                var decoded = jwt.verify(str, config.secret);
			    callback({status: true, decoded : decoded});
            }
            
		}
	});
}
