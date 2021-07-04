var mousedown = false;
$("#divider").mousedown(function(e) {
  mousedown = true;
});
$("body").mousemove(function(e) {
  if (mousedown) {
    var widthPercentage = (e.pageX / $(window).width()) * 100;
    $("#editor").css({
      width: widthPercentage + "%"
    });
    editor.resize();
  }
});
$("body").mouseup(function() {
  if (mousedown) {
    mousedown = false;
  }
});

var key =
  "# Headers\n\n# Header 1\n## Header 2\n### Header 3\n#### Header 4\n##### Header 5\n###### Header 6\nparagraph\n\n# Emphasis\n\nItalicize with *asterisks* or _underscores_\n\nBold with double **asterisks** or __underscores__\n\nCombine Bold and Italics with **asterisks and _underscores_**\n\nStrikethrough with ~~two tildes~~\n\n# Lists\n\n### Ordered\n1. First item\n2. Second item\n3. Third item\n\n### Unordered\n* Create item with '*'\n+ Or '+'\n- Or '-'\n\n# Links\n\nUse plain url: <https://www.google.com>\nOr [link with title](https://www.google.com)\n\n[link with numeric reference][1]\n\n[link with text reference][link ref]\n\n[link ref] itsef\n\n[link ref]: https://www.google.com\n[1]: https://www.google.com\n\n# Images\nInline-style: ![alt text](http://www.animated-gifs.eu/category_animals/mammals-dogs/www.cellsea.com..content1.wallpaper.2008.WP48d3e0d638585.gif)\n\nReference style: ![alt text][dog]\n\n[dog]: http://www.animated-gifs.eu/category_animals/mammals-dogs/www.cellsea.com..content1.wallpaper.2008.WP48d3e0d638585.gif\n\n# Code Snippets\n\n### Javascript\n```javascript\nvar helloWorld = 'Hello World!;'\nconsole.log(helloWorld);\n```\n### Python\n```python\nhelloWorld = 'Hello World!'\nprint(helloWorld)\n```\n### Java\n```java\npublic static void main(String[] args) {\n    String helloWorld = 'Hello World!';\n    System.out.println(helloWorld);\n}\n```\n\n### All supported languages / formats:\nactionscript3, apache, applescript, asp, brainfuck, c, cfm, clojure, cmake, coffee-script / coffeescript / coffee, cpp / C++, cs, csharp, css, csv, bash, diff, elixir, erb, go, haml, http, java, javascript, json, jsx, less, lolcode, make, markdown, matlab, nginx, objectivec, pascal, PHP, Perl, python, rust, salt / saltstate, shell / sh / zsh / bash, sql, scss, svg, swift, rb / jruby / ruby, smalltalk, vim / viml, volt, vhdl, vue, xml, yaml\n# Tables\n| Tables        | Are           | Cool  |\n| ------------- |:-------------:| -----:|\n| col 3 is      | right-aligned | $1600 |\n| col 2 is      | centered      |   $12 |\n| zebra stripes | are neat      |    $1 |\n\n| Styles       | Still    | Work              |\n| ------------ |:--------:| -----------------:|\n| *italics*    | **bold** | ~~strikethrough~~ |\n\n# Blockquotes \n\n> This is a blockquote\n\n# Horizontal Lines\n\nwith asterisks\n***\nwith underscores\n___\n\n# Inline HTML\n\n<p>Html elements will appear as their markdown equivalents</p>";

var starter = "# Type markdown here!";

var editor = ace.edit("ace");
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/markdown");
if ($("#header h1").text() == "Markdown Key") {
  editor.setValue(key);
} else {
  editor.setValue(starter);
}
editor.clearSelection();
editor.session.setUseWrapMode(true);
editor.setOptions({
  fontSize: "16px",
  showGutter: false
});
editor.session.on("change", function(delta) {
  setHtml(editor.getValue());
});

function setHtml(md) {
  var html = marked(md);
  // console.log(html);
  $("#output").empty();
  $("#output").append("<img id='icon' src='./readme_small.png' />" + html);
}

setHtml(editor.getValue());
