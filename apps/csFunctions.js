$('.toHeadlines').bind("click", function() {
    console.log("ay");
  $("body").animate({ scrollTop: $("#headlines").offset().top}, 1000);
});
$('.toProximity').bind("click", function() {
    console.log("ay");
  $("body").animate({ scrollTop: $("#proximity").offset().top}, 1000);
});
$('.toBounce').bind("click", function() {
    console.log("ay");
  $("body").animate({ scrollTop: $("#bounce").offset().top}, 1000);
});
$('.social').bind("click", function() {
    console.log("ay");
  $("body").animate({ scrollTop: $("#footer").offset().top}, 1000);
});

$(document).scroll(function() {
    var scroll = $(this).scrollTop()
   if (scroll >= $(window).height()) {
       $('#nav').css("display","block");
   } else {
       $('#nav').css("display","none");
       var max = $("img").length;
       for (var i = 0; i < max; i++) {
           console.log(i);
           var val = scroll / $(window).height();
           $('img:eq('+ i +')').css({'transform':'translateY('+ -150 * val  * (i + 1) +'%)', 'opacity':1 - val * 1.3});
       }
   }
});


$(function(){
	$("#typed").typed({
		strings: [" My name is Blake Sanie, and I make iOS apps."],
		// Optionally use an HTML element to grab strings from (must wrap each string in a <p>)
		stringsElement: null,
		// typing speed
		typeSpeed: 20,
		// time before typing starts
		startDelay: 1000,
		// backspacing speed
		backSpeed: 20,
		// time before backspacing
		backDelay: 30000,
		// loop
		loop: true,
		// false = infinite
		loopCount: false,
		// show cursor
		showCursor: false,
		// character for cursor
		cursorChar: "|",
		// attribute to type (null == text)
		attr: null,
		// either html or text
		contentType: 'html',
		// call when done callback function
		callback: function() {},
		// starting callback function before each string
		preStringTyped: function() {},
		//callback for every typed string
		onStringTyped: function() {},
		// callback for reset
		resetCallback: function() {}
	});
});

