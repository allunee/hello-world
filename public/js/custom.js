function copyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch (e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};




jQuery(document).ready(function ($) {

    var options = {
        $AutoPlay: 1,                                       //[Optional] Auto play or not, to enable slideshow, this option must be set to greater than 0. Default value is 0. 0: no auto play, 1: continuously, 2: stop at last slide, 4: stop on click, 8: stop on user navigation (by arrow/bullet/thumbnail/drag/arrow key navigation)
        $AutoPlaySteps: 1,                                  //[Optional] Steps to go for each navigation request (this options applys only when slideshow disabled), the default value is 1
        $Idle: 1500,                                        //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
        $PauseOnHover: 1,                                   //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, 4 freeze for desktop, 8 freeze for touch device, 12 freeze for desktop and touch device, default value is 1

        $ArrowKeyNavigation: 1,   			            //[Optional] Steps to go for each navigation request by pressing arrow key, default value is 1.
        $SlideEasing: $Jease$.$OutQuint,                    //[Optional] Specifies easing for right to left animation, default value is $Jease$.$OutQuad
        $SlideDuration: 800,                                //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
        $MinDragOffsetToSlide: 20,                          //[Optional] Minimum drag offset to trigger slide, default value is 20
        //$SlideWidth: 600,                                 //[Optional] Width of every slide in pixels, default value is width of 'slides' container
        //$SlideHeight: 300,                                //[Optional] Height of every slide in pixels, default value is height of 'slides' container
        $SlideSpacing: 0, 					                //[Optional] Space between each slide in pixels, default value is 0
        $Cols: 1,                                           //[Optional] Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
        $Align: 0,                                //[Optional] The offset position to park slide (this options applys only when slideshow disabled), default value is 0.
        $UISearchMode: 1,                                   //[Optional] The way (0 parellel, 1 recursive, default value is 1) to search UI components (slides container, loading screen, navigator container, arrow navigator container, thumbnail navigator container etc).
        $PlayOrientation: 2,                                //[Optional] Orientation to play slide (for auto play, navigation), 1 horizental, 2 vertical, 5 horizental reverse, 6 vertical reverse, default value is 1
        $DragOrientation: 2,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $Cols is greater than 1, or parking position is not 0)

        $ArrowNavigatorOptions: {                           //[Optional] Options to specify and enable arrow navigator or not
            $Class: $JssorArrowNavigator$,                  //[Requried] Class to create arrow navigator instance
            $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
            $Steps: 1                                       //[Optional] Steps to go for each navigation request, default value is 1
        },

        $BulletNavigatorOptions: {                                //[Optional] Options to specify and enable navigator or not
            $Class: $JssorBulletNavigator$,                       //[Required] Class to create navigator instance
            $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
            $Steps: 1,                                      //[Optional] Steps to go for each navigation request, default value is 1
            $Rows: 1,                                      //[Optional] Specify lanes to arrange items, default value is 1
            //$SpacingX: 12,                                   //[Optional] Horizontal space between each item in pixel, default value is 0
            //$SpacingY: 4,                                   //[Optional] Vertical space between each item in pixel, default value is 0
            $Orientation: 2                                //[Optional] The orientation of the navigator, 1 horizontal, 2 vertical, default value is 1
        }
    };

    if ($('#slider1_container').is(':visible')) {
        var jssor_slider1 = new $JssorSlider$("slider1_container", options);

        //responsive code begin
        //you can remove responsive code if you don't want the slider scales while window resizing
        function ScaleSlider() {
            var parentWidth = jssor_slider1.$Elmt.parentNode.clientWidth;
            if (parentWidth) {
                jssor_slider1.$ScaleWidth(parentWidth - 30);
            }
            else
                window.setTimeout(ScaleSlider, 30);
        }
        ScaleSlider();

        $(window).bind("load", ScaleSlider);
        $(window).bind("resize", ScaleSlider);
        $(window).bind("orientationchange", ScaleSlider);
        //responsive code end
    }
    

    if($('.site-header-wrapper').length > 0){
        var distance = $('.site-header-wrapper').eq(0).offset().top,
        $window = $(window);
    
        $window.scroll(function () {
            if ($window.scrollTop() >= distance) {
                // Your div has reached the top
                $('.site-header-wrapper').css("position", "fixed");
                $('.site-header-wrapper').css("top", "0px");
            } else {
                $('.site-header-wrapper').css("position", "relative");
                $('.site-header-wrapper').css("top", "0px");
            }
        });
    }
    

    $("#menu-toggle").click(function () {
        $("ul.sf-menu.dd-menu.pull-right").toggle();
    });


    $("#registrationForm").submit(function (e) {
        $("#registrationForm .reg-error").html("");
        var data = $(this).serialize();
        //console.log(data.g-recaptcha-response);
        $.ajax({
            url: "/register",
            data : data,
            type: "POST",
            success: function (result) {
                // console.log(result);
                grecaptcha.reset();
                for (var i = 0; i < result.mes.length ; i++) {
                    $("#registrationForm .reg-error").append("<span>" + result.mes[i] + "</span>");
                }
                if (result.status == true) {
                    $("#registrationForm")[0].reset();
                    $("#registrationForm .reg-error").html('Đăng ký thành công');
                }
            }
        });
        e.preventDefault();
    });


    $("#loginForm").submit(function (e) {
        $("#loginForm .reg-error").html("");
        var data = $(this).serialize();
        //console.log(data);
        $.ajax({
            url: "/login",
            data: data,
            type: "POST",
            success: function (result) {
                // console.log(result);
                grecaptcha.reset();
                for (var i = 0; i < result.mes.length ; i++) {
                    $("#loginForm .reg-error").append("<span>" + result.mes[i] + "</span>");
                }
                if (result.status == true) {
                    $("#loginForm .reg-error").html('Đăng nhập thành công, đang tự chuyển trang ...');
                    $("#loginForm")[0].reset();
                    var abc = getUrlParameter("redirect");
                    if (typeof abc === "undefined") {
                        abc = "/dashboard";
                    }
                    setTimeout(function () {
                        window.location.href = abc;
                    }, 1500);
                }
            }
        });
        e.preventDefault();
    });


});