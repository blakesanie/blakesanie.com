function star() {
    $("span").each(function() {
        $("span").each(function() {
            var y = Math.random() * ($(window).height() - $(window).width() * 0.003);
            var x = Math.random() * ($(window).width() * 0.997);
            $(this).css({
                top: y + "px",
                left: x + "px"
            });
        });
    });
}

$(window).resize(function restar() {
    star();
});

star();

$(".planetHolder:nth-child(1)").hover(
    function() {
        $("#mercury").css({
            height: "10vw",
            width: "10vw"
        });
    },
    function() {
        $("#mercury").css({
            height: "1vw",
            width: "1vw"
        });
    }
);

$(".planetHolder:nth-child(2)").hover(
    function() {
        $("#venus").css({
            height: "11vw",
            width: "11vw"
        });
    },
    function() {
        $("#venus").css({
            height: "1.5vw",
            width: "1.5vw"
        });
    }
);

$(".planetHolder:nth-child(3)").hover(
    function() {
        $("#earth").css({
            height: "11vw",
            width: "11vw"
        });
    },
    function() {
        $("#earth").css({
            height: "2vw",
            width: "2vw"
        });
    }
);

$(".planetHolder:nth-child(4)").hover(
    function() {
        $("#mars").css({
            height: "10vw",
            width: "10vw"
        });
    },
    function() {
        $("#mars").css({
            height: "1.8vw",
            width: "1.8vw"
        });
    }
);

$(".planetHolder").hover(
    function() {
        $(this)
            .find("p")
            .css({
            opacity: "1"
        });
        $(this)
            .find(".text")
            .css("overflow", "scroll");
    },
    function() {
        $(this)
            .find("p")
            .css({
            opacity: "0"
        });
        $(this)
            .find(".text")
            .css("overflow", "hidden");
    }
);

