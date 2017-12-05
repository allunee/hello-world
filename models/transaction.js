// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var Transaction = new Schema ({
    idUser : Schema.Types.ObjectId,
    idTradeHistory : Schema.Types.ObjectId,
    address : String,           // address of btc or vnc
    walletType : String,        // btc or vnc
    amount : Number,
    type: { type: String,  required: true },        // buy, sell, deposit, withdraw, send, get, fee
    datecreate :  { type : Date},
    status : Number,            //
    txid : String,
    description : String
});
var Transaction = mongoose.model('Transaction', Transaction);
module.exports = Transaction ;

module.exports.Add = function(item, callback){
    var item = new Transaction({
        idUser : item.idUser,
        idTradeHistory : item.idTradeHistory,
        address : item.address,           // address of btc or vnc
        walletType : item.walletType,        // btc or vnc
        amount : item.amount,
        type: item.type,        // buy, sell, deposit, withdraw
        datecreate :  item.datecreate,
        status : item.status,
        txid : item.txid,
        description : item.description
    });

    item.save(function(err, result) {
		if (err) {
            callback({status: false, id: null});
			throw err;
		}
		else {
            //console.log(result);
			callback({status : true, id: result.id});
		}
	});

}

module.exports.GetTransactionsByIdUser = function(str, callback){
    Transaction.find({idUser : str}, function(err, listfinded){
		if(err){
			throw err;
		}
		if(!listfinded){
			callback({status: false, transactions : null});
		} else if (listfinded){
			callback({status: true, transactions : listfinded});
		}
	});
}

module.exports.GetTransactionsByIdUserOption = function(iduser, walletType, type, callback){
    Transaction.find({idUser : iduser, walletType : walletType, type : type}, function(err, listfinded){
		if(err){
			throw err;
		}
		if(!listfinded){
			callback({status: false, transactions : null});
		} else if (listfinded){
			callback({status: true, transactions : listfinded});
		}
	});
}

module.exports.GetTransactionsByTx = function(str, callback){
    Transaction.find({txid : str}, function(err, listfinded){
		if(err){
			throw err;
		}
		if(!listfinded){
			callback({status: false, transactions : null});
		} else if (listfinded){
			callback({status: true, transactions : listfinded});
		}
	});
}