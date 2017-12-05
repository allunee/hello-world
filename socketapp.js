
var socketIo = require('socket.io');
var socketioJwt = require('socketio-jwt');
var auth = require('./models/userauth');
var lotolisten = require('./lotolisten.js');

var sio;
module.exports.Init = function(server){
    sio = socketIo.listen(server);
    lotolisten.Init(sio);
};

