var target_date = new Date("DEC 25, 2017 10:10:00").getTime();
var days, hours, minutes, seconds;

var countdown = document.getElementById("tiles");

var timeCountdown;
timeCountdown = setInterval(function () {
    getCountdown();
}, 1000);

function getCountdown() {
    var rightnow = new Date().getTime();
    if (target_date <= (rightnow - 1000)) {
        /* chay hang dong khac */

        clearInterval(timeCountdown);
        return;
    }
    var current_date = new Date().getTime();
    var seconds_left = (target_date - current_date) / 1000;

    days = pad(parseInt(seconds_left / 86400));
    seconds_left = seconds_left % 86400;

    hours = pad(parseInt(seconds_left / 3600));
    seconds_left = seconds_left % 3600;

    minutes = pad(parseInt(seconds_left / 60));
    seconds = pad(parseInt(seconds_left % 60));


    countdown.innerHTML = "<span>" + days + "</span><span>" + hours + "</span><span>" + minutes + "</span><span>" + seconds + "</span>";
}

function pad(n) {
    return (n < 10 ? '0' : '') + n;
}

