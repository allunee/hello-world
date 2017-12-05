// Freelancer Theme JavaScript
var logined = false;
var activeBet = true;
var curtoken = localStorage.getItem('token');
if (curtoken) {
  $.ajaxSetup({
    headers: {
      'x-access-token': curtoken
    }
  });
}
function setCookie(cname,cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getUrlParameter(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}




$(document).ready(function(){
    // $.getScript( "/js/action.js", function( data, textStatus, jqxhr ) {  
    // });
    var curUrl = window.location.pathname;
    //console.log(curUrl);
    $(".logined").hide();
    // $.ajax({
    //     type: 'GET',
    //     url: "/user/getrightcontent",
    //     data: {
    //         link : curUrl
    //         //token : curtoken
    //     },
    //     //dataType: "text",
    //     success: function(resultData) { 
    //         $("#right-content").html(resultData);
    //         $.getScript( "/js/action.js", function( data, textStatus, jqxhr ) {  
    //         });
    //     }
    // });

    $(".logout a").click(function(){
        setCookie("x-access-token", null, -1);
        console.log(getCookie('x-access-token'));
        localStorage.setItem("token", null);
        alert("You have logged out");     
        window.location.href = "/";
    });
    
    $("form#createaccount").submit(function(e){
        var url = "/user/createaccount"; // the script where you handle the form input.
        $.ajax({
            type: "POST",
            url: url,
            data: $(this).serialize(), // serializes the form's elements.
            success: function(data)
            {
                alert(data); // show response from the php script.
            }
        });
        e.preventDefault(); // avoid to execute the actual submit of the form.
        
    });

    $("form#registerForm").submit(function(e){
        var url = "/user/register"; // the script where you handle the form input.
        $.ajax({
            type: "POST",
            url: url,
            data: $(this).serialize(), // serializes the form's elements.
            success: function(data)
            {
                alert(data); // show response from the php script.
            }
        });
        e.preventDefault(); // avoid to execute the actual submit of the form.
        
    });

    $("form#usersendpoint").submit(function(e){
        var url = "/user/sendpoint"; // the script where you handle the form input.
        $.ajax({
            type: "POST",
            url: url,
            data: $(this).serialize(), // serializes the form's elements.
            success: function(data)
            {
                alert(data); // show response from the php script.
            }
        });
        e.preventDefault(); // avoid to execute the actual submit of the form.
        
    });

    $("form#userlotterybet").submit(function(e){
        var url = "/user/lottery"; // the script where you handle the form input.
        $.ajax({
            type: "POST",
            url: url,
            data: $(this).serialize(), // serializes the form's elements.
            success: function(data)
            {
                alert(data.mes); // show response from the php script.
            }
        });
        e.preventDefault(); // avoid to execute the actual submit of the form.
        
    });

    $(".autocompleteUser").autocomplete({
      source: function( request, response ) {
        $.ajax({
            type: "post",
          url: "/user/autocomplete",
          dataType: "json",
          data: {
            q: request.term
          },
          success: function( data ) {
                response($.map(data, function (value, key) {
                    return {
                        label: value.username,
                        value: value._id,
                    };
                }));
          }
        });
      },
      minLength: 1,
      select: function( event, ui ) {
          event.preventDefault();
          $("#username").val(ui.item.label);
          $("#idreceiver").val(ui.item.value);
        console.log( ui.item ?  "Selected: " + ui.item.label :  "Nothing selected, input was " + this.value);
      },
    //   open: function() {
    //     $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    //   },
    //   close: function() {
    //     $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    //   }
    });
    

});

