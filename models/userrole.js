// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var UserRole = new Schema ({
    idUser: Schema.Types.ObjectId, 
    idRole: Schema.Types.ObjectId
});
var UserRole = mongoose.model('UserRole', UserRole);
module.exports = UserRole ;

module.exports.AddUserRole = function(item, callback){
    var userrole = new UserRole({
        idUser : item.iduser,
        idRole : item.idrole
    });

    userrole.save(function(err, result) {
		if (err) {
            callback({status: false, id: null});
			throw err;
		}
		else {
            console.log(result);
			callback({status : true, id: result.id});
		}
	});


}