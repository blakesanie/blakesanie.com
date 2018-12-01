/*$(".nav h3").click(function() {
    var index = $(this).index();
    var element = $(".project").eq(index).offset().top;
    console.log(index, element);
    $("#content").animate({ scrollTop: 1000}, 1000);
});*/

function styles() {
    $("iframe").css('height',$("iframe").width() / 16 * 9);
}

styles();

$(window).resize(function() {
   styles(); 
});