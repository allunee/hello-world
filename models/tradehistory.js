// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var TradeHistory = new Schema ({
    idBuy : Schema.Types.ObjectId,
    idSell : Schema.Types.ObjectId,
    idBuyer : Schema.Types.ObjectId,
    idSeller : Schema.Types.ObjectId,
    btcAmount : Number,
    btcRate : Number,
    usdRate : Number,
    vncAmount : Number,
    type: { type: String,  required: true },
    datecreate :  { type : Date, default: Date.now },
});
var TradeHistory = mongoose.model('TradeHistory', UserRole);
module.exports = TradeHistory ;

module.exports.Add = function(item, callback){
    var item = new TradeHistory({
        idBuy : item.idBuy,
        idSell : item.idSell,
        idBuyer : item.idBuyer,
        idSell : item.idSeller,
        btcAmount : item.btcAmount,
        btcRate : item.btcRate,
        usdRate : item.usdRate,
        vncAmount : item.vncAmount,
        type : item.type,
        datecreate : item.datecreate
    });

    item.save(function(err, result) {
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