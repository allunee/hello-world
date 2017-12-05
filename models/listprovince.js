// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var ListProvince = new Schema ({
    title : String,
    province: String, 
    code: String,
    type: String,
    link: String,
    dayopen : []
});
var ListProvince = mongoose.model('ListProvince', ListProvince);
module.exports = ListProvince ;

module.exports.AddKQXS = function(item, callback){
    var kqxs = new KQXS({
        title : item.title,
        province : item.province,
        code : item.code,
        type : item.type,
        link : item.link,
        dayopen : item.dayopen
    });

    kqxs.save(function(err, result) {
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

module.exports.GetDayName = function (){
    return "fdafdas";
}