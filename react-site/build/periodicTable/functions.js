var Twidth, view, exit;

function group() {
  view = 'group';
  var noble = [1, 2, 10, 18, 36, 54, 86, 118];
  var hal = [9, 17, 35, 53, 85, 117];
  var alk = [3, 11, 19, 37, 55, 87];
  var earth = [4, 12, 20, 38, 56, 88];
  var other = [13, 31, 49, 50, 81, 82, 83, 113, 114, 115, 116];
  var oids = [5, 14, 32, 33, 51, 52, 84];
  var non = [6, 7, 8, 15, 16, 34];
  $('.item').each(function(i) {
    var num = parseInt($(this).find('h6').text());
    if (noble.indexOf(num) != -1) {
      $(this).css('background-color', '#E2C0FF');
    } else if (hal.indexOf(num) != -1) {
      $(this).css('background-color', '#B3FFFD');
    } else if (alk.indexOf(num) != -1) {
      $(this).css('background-color', '#FF8080');
    } else if (earth.indexOf(num) != -1) {
      $(this).css('background-color', '#FFFD9A');
    } else if (other.indexOf(num) != -1) {
      $(this).css('background-color', '#D86E6E');
    } else if (oids.indexOf(num) != -1) {
      $(this).css('background-color', '#FFB9E3');
    } else if (non.indexOf(num) != -1) {
      $(this).css('background-color', '#9FC9FF');
    } else if ((num > 56 && num < 72) || i === 56) {
      $(this).css('background-color', '#8BE3C0');
    } else if ((num > 88 && num < 104) || i === 74) {
      $(this).css('background-color', '#B6FFAE');
    } else {
      $(this).css('background-color', '#FFC481');
    }
  });
  $('.keyItem').css('display', 'none');
  $('.group').css('display', 'block');

  //lanth: (> 56 && < 72) || i = 56
  //act: (> 88 && < 104) || i = 74
}

function orbital() {
  var s = [1, 2, 3, 4, 11, 12, 19, 20, 37, 38, 55, 56, 87, 88];
  var p = [5, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 18, 31, 32, 33, 34, 35, 36, 49, 50, 51, 52, 53, 54, 81, 82, 83, 84, 85, 86, 113, 114, 115, 116, 117, 118];
  $('.item').each(function(i) {
    var num = parseInt($(this).find('h6').text());
    if (s.indexOf(num) != -1) {
      $(this).css('background-color', '#9FC9FF');
    } else if (p.indexOf(num) != -1) {
      $(this).css('background-color', '#8BE3C0');
    } else if (i > 89 || i === 56 || i === 74) {
      $(this).css('background-color', '#FFC481');
    } else {
      $(this).css('background-color', '#FF8080');
    }
  });
  $('.keyItem').css('display', 'none');
  $('.orbital').css('display', 'block');
}

function som() {
  var gas = [1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86, 118];
  $('.item').each(function(i) {
    var num = parseInt($(this).find('h6').text());
    if (gas.indexOf(num) != -1) {
      $(this).css('background-color', '#FF8080');
    } else if (i == 34 || i == 65) {
      $(this).css('background-color', '#9FC9FF');
    } else {
      $(this).css('background-color', '#FFC481');
    }
  });
  $('.keyItem').css('display', 'none');
  $('.som').css('display', 'block');
}

function radio() {
  var one = [43,92,93,94,96];
  var two = [88,90,91,95,97];
  //three = 98
  var four = [105,89,61,84,86,99,100,101];
  var five = [87,104,106,107,108,109,110,111,112,113,114,115,116,85,118,102,103];
  //unknown = 117
  $('.item').each(function(i) {
    var num = parseInt($(this).find('h6').text());
    if (one.indexOf(num) != -1) {
      $(this).css('background-color', '#FFB9E3');
    } else if (two.indexOf(num) != -1) {
      $(this).css('background-color', '#FF8080');
    } else if (num == 98) {
      $(this).css('background-color', '#FFC481');
    } else if (four.indexOf(num) != -1) {
      $(this).css('background-color', '#FFFD9A');
    } else if (five.indexOf(num) != -1) {
      $(this).css('background-color', '#B3FFFD');
    } else if (num == 117) {
      $(this).css('background-color', '#E2C0FF');
    } else {
      $(this).css('background-color', '#9FC9FF');
    }
  });
  $('.keyItem').css('display', 'none');
  $('.radio').css('display', 'block');
  $('.blank').css('background-color', 'white');
}





function period() {
  $('.item').each(function(i) {
    var num = parseInt($(this).find('h6').text());
    if (i == 0 || i == 1) {
      $(this).css('background-color', '#B6FFAE');
    } else if (num > 2 && num < 11) {
      $(this).css('background-color', '#8BE3C0');
    } else if (num > 10 && num < 19) {
      $(this).css('background-color', '#FFFD9A');
    } else if (num > 18 && num < 37) {
      $(this).css('background-color', '#9FC9FF');
    } else if (num > 36 && num < 55) {
      $(this).css('background-color', '#FFB9E3');
    } else if (num > 54 && num < 87) {
      $(this).css('background-color', '#FF8080');
    } else {
      $(this).css('background-color', '#FFC481');
    }
  });
  $('.keyItem').css('display', 'none');
  $('.per').css('display', 'block');
}

function font() {
  $('h6').css('font-size', 0.01 * $('input').val() + 'px');
  $('h1:not(#modeHolder h1)').css('font-size', 0.03 * $('input').val() + 'px');
  $('h2').css('font-size', 0.01 * $('#table').width() + 'px');
  $('h3').css('font-size', 0.008 * $('#table').width() + 'px');
  $('h5').css('font-size', Math.min(40, 0.05 * $(window).width()) + 'px');
}

function topLeft() {
  if ($('#table').width() > $('#cont').width()) {
    $('#table').css({
      'top': '0'
    });
  }
  if ($('#table').width() > $('#cont').width()) {
    $('#table').css({
      'left': '0',
      'transform': 'translateX(0)'
    });
  } else {
    $('#table').css({
      'left': '50%',
      'transform': 'translateX(-50%)'
    });
  }
}

function size() {
  Twidth = $('#cont').height() * 1.5;
  $('input').attr('min', $('#cont').height() * 1.5);
  $('input').attr('max', $('#cont').width() * 4.5);
  if ($('#cont').height() > $('#table').height()) {
    $('#table').css({
      'height': $('#cont').height() + 'px',
      'width': $('#cont').height() * 1.5 + 'px'
    });
    $('span').css('min-width', $('#table').width() / 18 + 'px');
  }
  $('#percent').html(Math.floor($('input').val() / Twidth * 100) + '%');
  if (exit === true) {
    $('#modeHolder').css({
      'width': '220px',
      'height': Math.min(300, $(window).height() - 274) + 'px',
      'opacity': '1'
    });
  }
  font();
  topLeft();
}

function reSize() {
  $('#table').css({
    'height': Twidth * 2 / 3 + 'px',
    'width': Twidth + 'px'
  });
}

function change() {
  $('#table').css({
    'width': $('input').val() + 'px',
    'height': $('input').val() * 2 / 3 + 'px'
  });
  $('span').css('min-width', $('#table').width() / 18 + 'px');
  topLeft();
  $('#percent').html(Math.floor(Math.max(100, $('input').val() / Twidth * 100)) + '%');
  font();
}

$(document).ready(function() {
  var database;
  exit = false;
  size();
  reSize();
  $.ajax({
      url: 'https://cdn.rawgit.com/Bowserinator/Periodic-Table-JSON/95619cf4/PeriodicTableJSON.json',
      dataType: 'json',
      method: 'GET',
      success: function(data) {
        $('.item').each(function(i) {
            var num = 0;
            if (i < 56) {
              num = i + 1;
            }
            if (i > 56 && i < 74) {
              num = i + 15;
            }
            if (i > 89 && i < 105) {
              num = i - 33;
            }
            if (i > 104 && i < 120) {
              num = i - 16;
            }
            if (i > 74 && i < 90) {
              num = i + 29;
            }
            if (i != 56 && i != 74) {
              $(this).append('<div id="num"><h6>' + num + '</h6></div>');
              $(this).append('<h1>' + data.elements[num - 1].symbol + '</h1>');
              if (i != 65) {
                $(this).append('<h3>' + data.elements[num - 1].name + '</h3>');
              } else {
                $(this).append('<h3>Mercury</h3>');
              }
              if ((data.elements[num - 1].atomic_mass).toString().length <= (data.elements[num - 1].atomic_mass).toFixed(4).toString().length) {
                if ((data.elements[num - 1].atomic_mass).toString().indexOf('.') == -1 || num > 83) {
                  $(this).append('<h2>' + '(' + data.elements[num - 1].atomic_mass + ')' + '</h2>');
              } else {
                $(this).append('<h2>' + data.elements[num - 1].atomic_mass + '</h2>');
              }
            } else {
              if ((data.elements[num - 1].atomic_mass).toString().indexOf('.') == -1 || num > 83) {
                  $(this).append('<h2>' + '(' + data.elements[num - 1].atomic_mass.toFixed(4) + ')' + '</h2>');
              } else {
                $(this).append('<h2>' + data.elements[num - 1].atomic_mass.toFixed(4) + '</h2>');
              }
            }
          }
        });
      font();
      group();
    }
  });
});

$(window).resize(function() {
  size();
});

$('#zoom').hover(function() {
  $(this).css({
    'width': '200px',
    'height': '90px'
  });
  $('input').css('opacity', '1');
  $('#percent').css('opacity', '1');
  $('#fit').css('opacity', '1');
  $('#label').css('opacity', '0')
}, function() {
  $(this).css({
    'width': '60px',
    'height': '25px'
  });
  $('input').css('opacity', '0');
  $('#percent').css('opacity', '0');
  $('#fit').css('opacity', '0');
  $('#label').css('opacity', '1')
});

$('#key').hover(function() {
  $(this).css({
    'width': '250px',
    'height': Math.min(188, $(window).height() - 270) + 'px'
  });
  $('#keyHolder').css('overflow', 'scroll');
  $('.keyItem').css('opacity', '1');
  $(this).find('#label').css('opacity', '0');
}, function() {
  $(this).css({
    'width': '60px',
    'height': '25px'
  });
  $('#keyHolder').css('overflow', 'hidden');
  $(this).find('#label').css('opacity', '1');
  $('.keyItem').css('opacity', '0');
});

$('#fit').click(function() {
  $('input').val(0);
  change();
});

$('.item:not(.blank)').click(function() {
  $('#click').css('display', 'none');
  $('iframe').css('display', 'block');
  $('iframe').attr('src', 'https://en.wikipedia.org/wiki/' + $(this).find('h3').text() + '')
})

$('iframe').hover(function() {
  $('#cont').css('opacity', '0.3');
}, function() {
  $('#cont').css('opacity', '1');
});

$('#icon').click(function() {
  if (exit === false) {
    $('#line:nth-of-type(2)').css('opacity', '0');
    $('#line:nth-of-type(1)').css(
      'transform', 'rotate(45deg)'
    );
    $('#line:nth-of-type(3)').css(
      'transform', 'rotate(-45deg)'
    );
    $('#modeHolder').css({
      'width': '220px',
      'height': Math.min(300, $(window).height() - 274) + 'px',
      'opacity': '1'
    });
    exit = true;
  } else {
    $('#line:nth-of-type(2)').css('opacity', '1');
    $('#line:nth-of-type(1)').css(
      'transform', 'rotate(0)'
    );
    $('#line:nth-of-type(3)').css(
      'transform', 'rotate(0)'
    );
    $('#modeHolder').css({
      'width': '120px',
      'height': '0',
      'opacity': '0'
    });
    exit = false;
  }
});

$('#modeHolder p').click(function() {
  $('#modeHolder p').css('background-color', 'rgba(255,255,255,0.95)');
  $(this).css('background-color', 'rgba(230,230,230,0.8)');
  $('#mode p').html($(this).text());
  if ($(this).text() == 'State of matter' || $(this).text() == 'Radioactivity') {
    $('#mode').css('width', '170px');
    $('#mode p').css('width', '138px');
     if ($(this).text() == 'State of matter') {
       som();
     } else {
       radio();
     }
  } else {
    $('#mode').css('width', '120px');
    $('#mode p').css('width', '88px');
  }
  if ($(this).text() == 'Group') {
    group();
  }
  if ($(this).text() == 'Orbital') {
    orbital();
  }
  if ($(this).text() == 'Period') {
    period();
  }
});

//modes: group, orbital, state of matter, radioactivity;