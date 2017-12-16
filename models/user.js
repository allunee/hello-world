// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Role   = require('./role');
// var UserRole   = require('./userrole');

// set up a mongoose model and pass it using module.exports
var UserSchema = new Schema ({
	username: { type: String, unique: true, required: true },
	email : { type: String, unique: true, required: true },
    password: String, 
	fullname: String, 
	phone : String,
	sponsor : String,
	idSponsor : Schema.Types.ObjectId,
	sponsorAddress : String,
	sponsorLevel : Number,
	birthday : { type : Date, default: Date.now },
	datecreate : { type : Date, default: Date.now },
	btcAmount: { type : Number, default: 0 },
	btcAddress : String,
	vncAmount: { type : Number, default: 0 },
	vncAddress : String,
	roles : [{ type: Schema.Types.ObjectId, ref: 'Role' }], 
	free : { type : Number, default: 1 },
	code : Number,
	parentCode : Number
});

UserSchema.pre('save', function(next){
	var user = this ;
	User.find({$or:[{username: user.username}, {email: user.email}]}, function(err, users){
		if(err) {
			return next(err);
		} else if(users.length > 0) {
			// if (users.find( {email: user.email})){
			// 	user.invalidate('email', 'email is already registered'); 
			// 	next( new Error("email is already registered"));
			// }
			// else if (users.find(users , {username: user.username})){
			// 	user.invalidate('username', 'username is already taken'); 
			// 	next( new Error("username is already taken"));
			// }
			//return next( new Error("username or email is already registered"));
			return next()
		}
		else{
			next();				
		}   
	})
})

var User = mongoose.model('User', UserSchema);
module.exports = User;

module.exports.addUser = function (item, role, callback) {
  	//implementation code goes here
	var con1 = false;
	var con2 = false;
	if(!item.username){
		callback({status: false, mes: "please enter username"});
		return;
	}else{
		User.checkUsername(item.username,function(check){
			if(check){
				callback({status: false, mes: 'username already exists, please choose a different login name'});
				return;
			}else{
				if(!item.email){
					callback({status: false, mes: "please enter your email"});
				}else{
					User.checkEmail(item.email,function(check){
						if(check){
							callback({status: false, mes: 'email already used, please choose a different email'});
						}else{
							var user = new User({ 
								username: item.username, 
								email : item.email,
								password: item.password,
								fullname : item.fullname,
								phone : item.phone,
								sponsor : item.sponsor,
								idSponsor : item.idSponsor,
								sponsorAddress : item.sponsorAddress,
								sponsorLevel : item.sponsorLevel,
								birthday : item.birthday,
								datecreate : item.datecreate,
								btcAddress : item.btcAddress,
								btcAmount : item.btcAmount,
								vncAddress : item.vncAddress,
								vncAmount : item.vncAmount,
								roles : [],
								code : item.code,
								parentCode : item.parentCode
							}); 
							
							for(var i = 0; i < role.length; i ++)
							{
								Role.findOne({name:role[i]}, function(err, rolefinded){
									if (err) throw err;
									if (!rolefinded) {
										console.log(' Role not found.');
									} else if (rolefinded) {
										user.roles.push(rolefinded.id);	
										// UserRole.AddUserRole({iduser:savedUser.id, idrole:rolefinded.id}, function(){
										// 	//callback({status: true, mes: "user saved"});
										// });
									}
								});
							}

							user.save(function(err, savedUser) {
								if (err) {
									throw err;
									//callback({status: false, mes: "error", err : err});
								}
								else {
									if(!savedUser){
										callback({status: false, mes: "can't save user"});
									}else{
										
										callback({status: true, mes: "user saved"});
									}
								}
							});


						}
					});
				}  	

			}
		});
	}  
	
	
	
}

module.exports.checkUsername = function(str, callback){
	User.findOne({username : str}, function(err, userfinded){
		if(err){
			throw err;
		}
		if(!userfinded){
			callback(false);
		} else if (userfinded){
			callback(true);
		}
	});
}

module.exports.GetUserByUsername = function(str, callback){
	User.findOne({username : str}, function(err, userfinded){
		if(err){
			throw err;
		}
		if(!userfinded){
			callback({status: false, user : null});
		} else if (userfinded){
			callback({status: true, user : userfinded});
		}
	}).populate("roles");
}

module.exports.GetUserByEmail = function(str, callback){
	User.findOne({email : str}, function(err, userfinded){
		if(err){
			throw err;
		}
		if(!userfinded){
			callback({status: false, user : null});
		} else if (userfinded){
			callback({status: true, user : userfinded});
		}
	}).populate("roles");
}

module.exports.GetUserByID = function(str, callback){
	// console.log("id", str);
	User.findOne({_id : str}, function(err, userfinded){
		if(err){
			throw err;
		}
		if(!userfinded){
			callback({status: false, user : null});
		} else if (userfinded){
			callback({status: true, user : userfinded});
		}
	}).populate("roles");
}

module.exports.GetUserByBtcAddress = function(str, callback){
	// console.log("id", str);
	User.findOne({btcAddress : str}, function(err, userfinded){
		if(err){
			throw err;
		}
		if(!userfinded){
			callback({status: false, user : null});
		} else if (userfinded){
			callback({status: true, user : userfinded});
		}
	}).populate("roles");
}

module.exports.GetUserByVncAddress = function(str, callback){
	User.findOne({vncAddress : str}, function(err, userfinded){
		if(err){
			throw err;
		}
		if(!userfinded){
			callback({status: false, user : null});
		} else if (userfinded){
			callback({status: true, user : userfinded});
		}
	}).populate("roles");
}

module.exports.CountSponsorDownline = function(str, callback){
	User.count({sponsor : str}, function(err, count){
		if(err){
			throw err;
		}
		callback(count);
	});
}

//db.users.find({name: /a/})  //like '%a%'
//db.users.find({name: /^pa/}) //like 'pa%' 
//db.users.find({name: /ro$/}) //like '%ro'
module.exports.ListSponsorDownline = function(str, callback){
	User.find({sponsorAddress : { $regex : '^' + str + '-'}}).sort({sponsorAddress : 1}).exec(function(err, userfinded){
		if(err){
			throw err;
		}
		if(!userfinded){
			callback({status: false, listuser : null});
		} else if (userfinded){
			callback({status: true, listuser : userfinded});
		}
	});
}

module.exports.ListF1 = function(str, callback){
	User.find({sponsor : str}, function(err, userfinded){
		if(err){
			throw err;
		}
		if(!userfinded){
			callback({status: false, listuser : null});
		} else if (userfinded){
			// for(var i = 0; i < userfinded.length; i ++){
			// 	userfinded[i].phone = '907095482059';
			// }
			callback({status: true, listuser : userfinded});
		}
	});
}

module.exports.checkEmail = function(str, callback){
	User.findOne({email : str}, function(err, emailfinded){
		if(err){
			throw err;
		}
		if(!emailfinded){
			callback(false);
		} else if (emailfinded){
			callback(true);
		}
	});
}

module.exports.AutoComplete = function(str, callback){
	//User.find({username : {'$regex' : str, '$options' : 'i'}}, function(err, listfinded){
	User.find({username : new RegExp(str, 'i')}, function(err, listfinded){
		if(err){
			throw err;
		}
		if(!listfinded){
			callback(null);
		} else if (listfinded){
			callback(listfinded);
		}
	}).select('username');
}

module.exports.GetPoint = function(iduser, callback){
	//User.find({username : {'$regex' : str, '$options' : 'i'}}, function(err, listfinded){
	User.findOne({_id : iduser}, function(err, finded){
		if(err){
			throw err;
		}
		if(!finded){
			callback(0);
		} else if (finded){
			callback(finded.point);
		}
	}).select('point');
}

