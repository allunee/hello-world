
var socketIo = require('socket.io');
var socketioJwt = require('socketio-jwt');
var auth = require('./models/userauth');

var activeBetFlag = true;
var runningFlag = false;

var refreshActiveBet = null;
var refreshCashOut = null;
var refreshRunning = null;


var serverLotoNumber = [];
var listUserBet = [];
var listWinner = [];

var gameCount = {
    number : 58995000,
    datecreate : Date.now
};

module.exports.Init = function(sio){
    setTimeout(serverActiveBet, 2000, sio);
    sio.sockets
        .on('connection', function (socket) {
            console.log(socket.id);
            socket.on("type", function(type){
                if(type == 'loto'){
                    auth.CheckToken(socket.client.request._query.token, function(result){
                        if(result.status == true){    
                            socket.join('lotogroup'); // put socket in a channel  
                            //console.log(sio.sockets.adapter.rooms);              
                            var clients = sio.sockets.adapter.rooms['lotogroup'];
                            console.log(clients);
                            sio.sockets.in('lotogroup').emit('new-user', clients);
                            sio.sockets.in('lotogroup').emit('set-activebet', activeBetFlag);
                        }
                    });
                    
                    
                }
            });

            socket.on("client-do-bet-loto", function(array){
                auth.CheckToken(socket.client.request._query.token, function(result){
                    if(result.status == true){    
                        if(activeBetFlag == true){
                            listUserBet.push({
                                username : result.decoded._doc.username,
                                listnumber : array
                            });
                            
                        }
                    }
                });
                    
                    
            });

            //console.log(socket.client.request.decoded_token);
            socket.on("messenger", function( mes){  
                auth.CheckToken(socket.client.request._query.token, function(result){
                    if(result.status == true && mes != "" && mes != null){                    
                        var date = new Date();
                        
                        var data = {
                            username: result.decoded._doc.username,
                            mes: mes,
                            time: date.getHours() + ':' + date.getMinutes()
                        };
                        sio.emit('messenger', data);
                    }
                });
                //console.log(auth.Dark(socket.client.request._query.token));
            })

            socket.on('disconnect', function(socket) {
                // console.log('Got disconnect!');
                // var i = allClients.indexOf(socket);
                // allClients.splice(i, 1);
            });
    });
};

function randomNumberFromRange(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function timer(sio)
{
    var num = randomNumberFromRange(1,99);
    while(serverLotoNumber.indexOf(num) > -1){
        num = randomNumberFromRange(1,99);
    }
    serverLotoNumber.push(num);
    serverLotoNumber.sort();    
    //Do code for showing the number of seconds here
    sio.emit("gen-num", num); // watch for      spelling

    for(var i = 0; i < listUserBet.length ; i++){
        if(listUserBet[i].listnumber.indexOf(num) > -1){
            listUserBet[i].listnumber.splice( listUserBet[i].listnumber.indexOf(num), 1 );
        }
        if(listUserBet[i].listnumber.length == 0){
            listWinner.push(listUserBet[i].username);
        }
    }

    if (listWinner.length > 0)
    {
        console.log(listWinner);
        sio.emit("loto-winner", listWinner); // watch for      spelling
        refreshCashOut = setInterval(serverCashOut, 1000, sio);
        listUserBet.length = 0;
        listWinner.length = 0;
        serverLotoNumber.length = 0;
        return;
    }else{
        setTimeout(timer, 1000, sio);
    }
    
}

var count = 10;
function waitingCountdown(sio){
    sio.emit("countdown", count);
    count -- ;
    if(count > 0){
        setTimeout(waitingCountdown, 1000, sio);
    }else{
        if(listUserBet.length > 0){
            refreshRunning = setInterval(serverRunning, 1, sio);
        }else{
            count = 10;
            setTimeout(waitingCountdown, 1000, sio);
        }
        
    }
    
}

var serverRunning = function(sio){
    runningFlag = true;
    activeBetFlag = false;
    sio.sockets.in('lotogroup').emit('set-activebet', activeBetFlag);
    clearInterval(refreshRunning);
    timer(sio);
};

var serverCashOut = function(sio){
    runningFlag = false;
    clearInterval(refreshCashOut);
    refreshActiveBet = setInterval(serverActiveBet, 5000, sio);
};

var serverActiveBet = function(sio){
    activeBetFlag = true;
    sio.sockets.in('lotogroup').emit('set-activebet', activeBetFlag);
    clearInterval(refreshActiveBet);
    count = 10;
    waitingCountdown(sio);
};

// db.createUser(
//     {
//       user: "user1",
//       pwd: "admin123456",
//       roles: ["readWrite", "dbAdmin"]
//     }
// )