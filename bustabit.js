
var socketIo = require('socket.io');
var socketioJwt = require('socketio-jwt');
var auth = require('./models/userauth');
var Hash = require('./models/hash');


var activeBetFlag = true;
var currentHash = null;
var runningFlag = false;
var refreshIntervalId = null;
var refreshActiveBet = null;
var refreshCashOut = null;
var refreshRunning = null;
var count = 0;
var speed = 70;
var listUserBet = [];
var gameCount = {
    number : 58995000,
    datecreate : Date.now
};

var sio;
module.exports.Init = function(server){
    sio = socketIo.listen(server);
    setTimeout(serverActiveBet, 3000);
    sio.sockets
        .on('connection', function (socket) {
            //console.log(socket.client.request.decoded_token);
            socket.on("messenger", function( mes){  
                if(mes == "stop"){
                    clearInterval(refreshIntervalId);
                    activeBetFunc(false);
                }     
                if(mes == "start"){
                    refreshIntervalId = setInterval( serverPing, 5000 );
                    activeBetFunc(true);
                }        
                auth.CheckToken(socket.client.request._query.token, function(result){
                    if(result.status == true && mes != "" && mes != null){                    
                        var date = new Date();
                        //console.log(date.getHours());
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

            socket.on("do-bet", function(data){
                auth.CheckToken(socket.client.request._query.token, function(result){
                    if(result.status == true && activeBetFlag == true){
                        var item = {
                            hash : currentHash.hash,
                            username : result.decoded._doc.username,
                            gamecount : gameCount.number,
                            datecreate : gameCount.datecreate,
                            cashout : -1
                        };
                        if(findUserInListUserBet(listUserBet, result.decoded._doc.username) == null){
                            listUserBet.push(item);
                            sio.emit('add-user-bet', result.decoded._doc.username);
                        }else{

                        }
                                          
                    }
                });
          
            });

            socket.on('user-cashout', function(data){
                auth.CheckToken(socket.client.request._query.token, function(result){
                    
                });
            });

    });
};



function findUserInListUserBet(listUserBet, str) { 
    if(listUserBet.length == 0){
        return null;
    }else{
        for(var i = 0; i < listUserBet.length ; i++)
        {
            if(listUserBet[i].username == str){
                return listUserBet[i];
            }
        }
        return null;
    }
}

var activeBetFunc = function (val){
    if(val == true){
        Hash.GetLastHashNotUsed(function(hashfinded){
            if(hashfinded.status == false){

            }else{
                currentHash = hashfinded.hash;
                gameCount.number ++;
                gameCount.datecreate = Date.now;
            }
        });
        
    }else{
        
    }
    activeBetFlag = val;
    sio.emit("active-bet", activeBetFlag);
    
    
}


var temp = 0;
function timer()
{
    temp++;
    count++;
    //Do code for showing the number of seconds here
    sio.emit("countdown", count); // watch for      spelling

    if (count >= currentHash.point)
    {
        speed = 70;
        refreshCashOut = setInterval(serverCashOut, 300);
        return;
    }
    if(temp > 0 && (temp % 50) == 0){
        
        speed = speed - 10; // or whatever
    }
    
    setTimeout(timer, speed);

}

var serverRunning = function(){
    runningFlag = true;
    clearInterval(refreshRunning);
    // refreshCashOut = setInterval(serverCashOut, 3000);
    var date = new Date();
    var data = {
        username: "server : ",
        mes: " running chart : " + currentHash.point,
        time: date.getHours() + ':' + date.getMinutes()
    };
    sio.emit('messenger', data);
    count = 100;
    timer();
};

var serverCashOut = function(){
    runningFlag = false;
    clearInterval(refreshCashOut);
    refreshActiveBet = setInterval(serverActiveBet, 3000);
    var date = new Date();
    var data = {
        username: "server : ",
        mes: " Stop bet : ",
        time: date.getHours() + ':' + date.getMinutes()
    };
    sio.emit('messenger', data);
};

var serverActiveBet = function(){
    clearInterval(refreshActiveBet);
    refreshRunning = setInterval(serverRunning, 3000);
    var date = new Date();
    var data = {
        username: "server : ",
        mes: " Start bet : ",
        time: date.getHours() + ':' + date.getMinutes()
    };
    sio.emit('messenger', data);
};

Hash.GetLastHashNotUsed(function(hashfinded){
    if(hashfinded.status == false){

    }else{
        currentHash = hashfinded.hash;
        gameCount.number ++;
        gameCount.datecreate = Date.now;
    }
});




function postUnix(){
    $.get('ico/info', {
        unx_amount: 100,
        captcha_secret: $('[name="captcha_secret"]').val(),
        captcha_key2: 0985,
        }, function (res) {
            console.log(res);
            $('#ico-form-loading').addClass('hidden');
            if (res.success) {
            $('#captcha-img').attr('src', '/img/captchas/' + res.captcha_secret + '.png')
            $('[name="captcha_secret"]').val(res.captcha_secret)
            $('[name="captcha_key2"]').val('')
            $('#ico-form-success').removeClass('hidden').html(res.success);
            getUserInfo();
            setTimeout(function () {
                getIcoInfo();
                getUserInfo();
            }, 6666)
            }     
    })
}

function postUnix(){
    $('.base-font-color').click();
    $("#ico-form button[type='submit']").click();
}

var phongle = setInterval(function(){
    var gio = $('#ico-open-hh').html();
    var phut = $('#ico-open-mm').html();
    var giay = $('#ico-open-ss').html();
    if(gio == '00' && phut == '00' && giay == '00'){
        postUnix();
        clearInterval(phongle);
    }else{
        //console.log(gio , phut,  giay);
    }
    
}, 50)