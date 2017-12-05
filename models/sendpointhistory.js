// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var SendPointHistory = new Schema ({
    sender: { type: Schema.Types.ObjectId, ref: 'User' }, 
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    point: Number,
    type: String,
    daycreate : { type : Date, default: Date.now }
});
var SendPointHistory = mongoose.model('SendPointHistory', SendPointHistory);
module.exports = SendPointHistory ;

module.exports.AddSendPoint = function(item, callback){
    var sendpoint = new SendPointHistory({
        sender : item.sender,
        receiver : item.receiver,
        point : item.point,
        type : item.type,
        daycreate : item.daycreate
    });

    sendpoint.save(function(err, saved) {
		if (err) {
           // throw err;
            callback({status: false, result : null});
			
		}
		if(!saved){
            callback({status: false, result : null});
        }else{
            callback({status: true, result : saved.id});
        }
	});
}
