// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var async = require('async');
var Schema = mongoose.Schema;
var UserRole   = require('./userrole');
var ObjectId = mongoose.Types.ObjectId;

// set up a mongoose model and pass it using module.exports
var Role = new Schema ({
    name: { type: String, unique: true, required: true },
    des: String, 
    priority: Number
});
var Role = mongoose.model('Role', Role);
module.exports = Role ;

module.exports.Init = function(){
	Role.findOne({name:'member'}, function(err, rolefinded){
		if (err)throw err;

		if (!rolefinded) {
			var member = new Role({ 
				name: 'member', 
				des: 'member basic',
				priority: 1 
			});
			// save the sample user
			member.save(function(err) {
				if (err) throw err;
				console.log('Role member saved successfully');
			});
		} else if (rolefinded) {	
			console.log(' Role member is existed.');
		}
	});
	
	Role.findOne({name:'admin'}, function(err, rolefinded){
		if (err)throw err;

		if (!rolefinded) {
			var admin = new Role({ 
				name: 'admin', 
				des: 'admin basic',
				priority: 0
			});
			// save the sample user
			admin.save(function(err) {
				if (err) throw err;
				console.log('Role admin saved successfully');
			});
		} else if (rolefinded) {	
			console.log(' Role admin is existed.');
		}
	});
	
	
}

