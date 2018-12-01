var menuExpanded = false;

$("#menuIcon").click(function() {
    if (menuExpanded) {
        $("#nav").css("display","none");
        $("#menuIcon").css("transform","rotate(0)");
    } else {
        $("#nav").css("display","block");
        $("#menuIcon").css("transform","rotate(90deg)");
    }
    menuExpanded = !menuExpanded;
});


var current = 0;
var prev = 0;
var showing = true;

function positionHeader() {
    if ($(window).width() <= 800 && !menuExpanded) {
        current = $(this).scrollTop();
        var rate = current - prev; //+ = down, - = up
        if (current <= 100 && current >= 0) {
            if (!(showing && rate < 0)) {
                $("#header").css({
                    transition: "none",
                    transform: "translateY(" + -current + "px)"
                });
                showing = false;
            }
        } else {
            $("#header").css("transition", "transform 0.3s ease");
            if (rate > 0 && current >= 200) {
                $("#header").css("transform", "translateY(-100%)");
                showing = false;
            } else if (rate < -12) {
                $("#header").css("transform", "translateY(0)");
                showing = true;
            }
        }
        prev = $(this).scrollTop();
    }
}

$(window).resize(function() {
    positionHeader();
});
$(window).scroll(function() {
    positionHeader();
});