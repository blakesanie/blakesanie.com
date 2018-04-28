
$(function(){
	$("#typed").typed({
		strings: [" My name is Blake Sanie, and I am a web and mobile developer."],
		// Optionally use an HTML element to grab strings from (must wrap each string in a <p>)
		stringsElement: null,
		// typing speed
		typeSpeed: 10,
		// time before typing starts
		startDelay: 1000,
		// backspacing speed
		backSpeed: 10,
		// time before backspacing
		backDelay: 10000,
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

$("#top").click(function() {
   $("body").animate({ scrollTop: 0}, 1000); 
});