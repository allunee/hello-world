var moment = require('moment');

var dayname = {
    en :['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    vi : ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
};

var DayUtil = {};

module.exports = DayUtil ;

module.exports.GetDayNum = function (str){
    return dayname.en.indexOf(str) > 0 ? dayname.en.indexOf(str) : dayname.vi.indexOf(str);
}

module.exports.GetCurDayNum = function(){
    var curDayName = moment().format('dddd');
    return this.GetDayNum(curDayName);
}

module.exports.GetDayName = function (num, lang){
    return dayname[lang][num];
}

module.exports.GetLastLoteryDay = function (loteryNum){
    var daynum = this.GetCurDayNum();
    var subday = 0;
    if(daynum > loteryNum){
        subday = daynum - loteryNum;
    }else if(daynum < loteryNum){
        subday = 7 - (loteryNum - daynum);
    }
    return moment().subtract(subday, 'days').format('YYYY-MM-DD');
}