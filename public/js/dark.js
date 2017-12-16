$(function() {
	//----- OPEN
	$('[data-popup-open]').on('click', function (e) {
			var targeted_popup_class = jQuery(this).attr('data-popup-open');
			$('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

			e.preventDefault();
	});

	//----- CLOSE
	$('[data-popup-close]').on('click', function(e)  {
			var targeted_popup_class = jQuery(this).attr('data-popup-close');
			$('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);

			e.preventDefault();
	});

	$(document).on('click', '.popup', function(e) {
			if ($(e.target).hasClass('popup')) {
					var targeted_popup_class = $(e.target).attr("data-popup");
					$('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
					e.preventDefault();
			}
	});

});

// Get Google ReCaptcha
if(location.hostname == "localhost"){
	$(".g-recaptcha").attr("data-sitekey","6LfXNjsUAAAAAOPfroYZRzkZTlhKhjTxMQWC3ykd");
}else{
	$(".g-recaptcha").attr("data-sitekey","6LeQNjsUAAAAAODIAq8fxuXiLHwtLuAoIuy2LnfT");
}

// Transactions page events
$('.transactionTitle li').click(function(){
	$('.transactionTitle li').removeClass('active');
	$(this).addClass('active');
	$('.trans').removeClass('active');
	var abc = $(this).attr('trans-name');
	$('.'+abc).addClass('active');
})

// Wallet event
$("#copyButton").click(function (e) {
	copyToClipboard(document.getElementById("copyTarget"));
	$("#link-copied-message").show();
	setTimeout(function() {
			$("#link-copied-message").hide();
	}, 1500);

});

$("#btcQRcode").qrcode({
	text	:  $("#btcQRcode").attr("code"),
	size : 100
});

$("#vncQRcode").qrcode({
	text	:  $("#vncQRcode").attr("code"),
	size : 100
});

$("#copyBtcAddress").click(function (e) {
	copyToClipboard(document.getElementById("copyBtcTarget"));
	$("#btc-copied-message").show();
	setTimeout(function () {
			$("#btc-copied-message").hide();
	}, 1500);

});

$("#copyCoinAddress").click(function (e) {
	copyToClipboard(document.getElementById("copyCoinTarget"));
	$("#coin-copied-message").show();
	setTimeout(function () {
			$("#coin-copied-message").hide();
	}, 1500);

});

$("#transferBTCForm").submit(function(e){
	$("#transferBTCForm .reg-error").html("");
	var data = $(this).serialize();
	$.ajax({
		url: "/wallet/withdrawbtc",
		data: data,
		type: "POST",
		success: function (result) {
			// for (var i = 0; i < result.mes.length ; i++) {
			// 	$("#transferBTCForm .reg-error").append("<span>" + result.mes[i] + "</span>");
			// }
			alert(result.mes);
		}
	});
	e.preventDefault();
});

$("#transferVNCForm").submit(function(e){
	$("#transferVNCForm .reg-error").html("");
	var data = $(this).serialize();
	//console.log(data);
	$.ajax({
		url: "/wallet/withdrawvnc",
		data: data,
		type: "POST",
		success: function (result) {
			// console.log(result);
			// for (var i = 0; i < result.mes.length ; i++) {
			// 	$("#transferVNCForm .reg-error").append("<span>" + result.mes[i] + "</span>");
			// }
			alert(result.mes);
		}
	});
	e.preventDefault();
});
// User Info Page events

$("#changePasswordForm").submit(function(e){
	$("#changePasswordForm .reg-error").html("");
	var data = $(this).serialize();
	//console.log(data);
	$.ajax({
		url: "/user/changepass",
		data: data,
		type: "POST",
		success: function (result) {
			console.log(result);
			for (var i = 0; i < result.mes.length ; i++) {
				$("#changePasswordForm .reg-error").append("<span>" + result.mes[i] + "</span>");
			}

		}
	});
	e.preventDefault();
});



























var projectTask = [];
// projectTask.push(new HierarchialTask(0, "Project Plan", "6/2/2014", "8/22/2014", "60d", "32%", []));
// projectTask.push(new HierarchialTask(1, "Planning", "6/2/2014", "6/4/2014", "3d", "100%", []));
// projectTask.push(new HierarchialTask(2, "Write a specification", "6/5/2014", "6/6/2014", "2d", "100%", []));
// projectTask.push(new HierarchialTask(3, "Create a demo application", "6/9/2014", "6/11/2014", "3d", "100%", []));
// projectTask.push(new HierarchialTask(4, "Collect a feedback", "6/12/2014", "6/12/2014", "1d", "100%", []));
// projectTask.push(designMainTask);
// projectTask.push(devMainTask);
// projectTask.push(new HierarchialTask(7, "Project Complete", "8/21/2014", "8/22/2014", "2d", "0%", []));
$(function () {
	var option = {
        width: "100%",
		dataSource: projectTask, //bound to flat data source,
		autoGenerateColumns: false,
		primaryKey: "code",
		foreignKey: "parentCode",
		initialExpandDepth: -1,
        columns: [
			{ headerText: "code", key: "code", width: "25%", dataType: "number" , hidden : true},
            { headerText: "Username", key: "username", width: "35%", dataType: "string" },
			{ headerText: "Start", key: "datecreate", width: "25%", dataType: "string" },
        ],
        features: [
            {
				name: "Paging",
				mode: "allLevels",
				pageSize: 10,
				currentPageIndex: 0,
				contextRowMode: "parent"
			}
        ]
	};

	$.ajax({
		url: "/user/getlistdownline",
		type: "get"
	  }).done(function(data) {
			// for(var i = 0; i < data.length; i++){
			// }
			option.dataSource = data;	
			$("#treegridDownline").igTreeGrid(option);
	  });






});