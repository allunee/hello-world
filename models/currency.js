// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var Currency = new Schema ({
    id: Number,
    pair: { type: String, unique: true, required: true },
    name: { type: String, required: true }, 
    datecreate :  { type : Date, default: Date.now },
});
var Currency = mongoose.model('Currency', UserRole);
module.exports = Currency ;

module.exports.Add = function(item, callback){
    var item = new Currency({
        id : item.id,
        pair : item.pair,
        name : item.name,
        datecreate : item.datecreate
    });

    item.save(function(err, result) {
		if (err) {
            callback({status: false, id: null});
			throw err;
		}
		else {
			callback({status : true, id: result.id});
		}
	});


}