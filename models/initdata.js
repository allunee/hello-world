var User   = require('./user');
var Role   = require('./role');
var UserRole   = require('./userrole');

exports.Init = function(){
	Role.Init();	
	User.addUser({username : 'root', password: '123456', fullname: 'test name', birthday: "2012-08-09T05:30:28.402", datecreate: "2012-08-09T05:30:28.402", email: 'a@gmail.com', admin: false}, 'member',function(data){
		console.log(data);
	});
	
};

