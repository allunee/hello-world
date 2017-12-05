var config = require('../config'); // get our config file
var crypto = require('crypto');
var serverSeed = config.serverSeed;
var clientSeed = config.clientSeed; // determined by this seeding event

function genGameHash(serverSeed) {
  return crypto.createHash('sha256').update(serverSeed).digest('hex');
}

function hmac(key , v){
    return crypto.createHmac('sha256', key).update(v).digest('hex');
}

function divisible(hash, mod) {
    // We will read in 4 hex at a time, but the first chunk might be a bit smaller
    // So ABCDEFGHIJ should be chunked like  AB CDEF GHIJ
    var val = 0;
    
    var o = hash.length % 4; 
    for (var i = o > 0 ? o - inc : 0; i < hash.length; i += 4) {
      val = ((val << 16) + parseInt(hash.substring(i, i+4), 16)) % mod;
    }

    return val === 0;
}

function crashPointFromHash(serverSeed, clientSeed) {
  // Returns an integers corresponding to the game crash. 123 = Game crashes at 1.23x
  var hash = hmac(serverSeed, clientSeed);  

  /* In 1 of 101 games the game crashes instantly. */
  if (divisible(hash, 101))
    return 0;

  /* Use the most significant 52-bit from the hash
     to calculate the crash point */
  var h = parseInt(hash.slice(0,52/4),16);
  //console.log('h : ', h);
  var e = Math.pow(2,52);
  //console.log('e : ', e);

  /* Assuming the 52-bit prefix is uniformly distributed
     then r is uniformly distributed over [0,1). */
  var r = h / e;
  //console.log('r : ', r);

  /* Perfect is the perfectly continuous distributed
     multiplier for a zero sum game. */
  var perfect    = 1 / (1 - r);
  //console.log('perfect : ', perfect);

  /* Apply a house edge to the perfect distribution. */
  var houseEdge  = (perfect-1) * 0.01;
  //console.log('houseEdge : ', houseEdge);
  var multiplier = perfect - houseEdge;
  //console.log('multiplier : ', multiplier);

  // return Math.floor(multiplier * 100);

  /* Inlining and simplifying the above yields the following version
     which is slightly more numerically stable. The multiplication
     100 * e still leaves the exactly representable integers.
  */
  //console.log(Math.floor((100 * e - h) / (e - h)));
  return Math.floor((100 * e - h) / (e - h));
}



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var Hash = new Schema ({
    hash: { type: String, unique: true, required: true },
    point: Number,
    priority : Number,
    created_at : { type : Date, default: Date.now },
    isused : Boolean
});
var Hash = mongoose.model('Hash', Hash);
module.exports = Hash ;

module.exports.Init = function(number, callback){
    var list = [];
    var abc = serverSeed;
    count = 0;
    Hash.findOne().sort({priority: -1}).exec(function(err, result) {
        if(err || result == null){
            
        }else{
            abc = result.hash;
            count = result.priority + 1;
        }
        for(var i = 0; i < number ; i++)
        {
            var newHash = genGameHash(abc);
            var point =  crashPointFromHash(newHash, clientSeed).toFixed(2);
            var item = new Hash({ 
                hash: newHash, 
                point: point,
                priority : count ++ ,
                created_at: Date.now ,
                isused : false
            });
            // item.save(function(){

            // });
            list.push(item);
            abc = newHash;
        } 
        Hash.insertMany(list, function(){
            callback('done');
        }) ;
    });
}

module.exports.ListHash = function(callback){
    Hash.find().sort({priority: -1}).exec(function(err, result) {
        if(err || result == null){
            callback(err);
        }else{
            callback(result);
        }
        
    });
}

module.exports.GetLastHashNotUsed = function(callback){
    Hash.findOne({isused:true}).sort({priority: -1}).exec(function(err, result){
        if(err || result == null){
            callback({status: false, hash:null});
        }else{
            callback({status: true, hash:result});
        }
    });
}

// var gamesToGenerate = 20; // It'll be much larger in reality

// for (var game = gamesToGenerate; game > 0; --game) {
    
//     var point =  (crashPointFromHash(serverSeed, clientSeed) / 100).toFixed(2);
//     console.log('Game ' +  game + ' has a crash point of ' + point +'x', '\t\tHash: ' + serverSeed);
//     serverSeed = genGameHash(serverSeed);
// }





