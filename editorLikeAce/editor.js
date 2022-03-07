const editorDiv = document.querySelector('.editor')
const scrollyscroll = document.querySelector('.editor .scroll-wraper')

let cursorPos = {
    line: 0,
    col: 0
}

// ^ highlighter made by vExcess

//~ Stole the sample code from Quinn, who stole it from IA
var code = 
`// edit this on line 22
var array = [];
function Obj () {}
for(var i = 0; i < 10; i ++){
  array.push(new Obj());
}

// calculates random stuff
var my_var = 4 * 7 / (2 - 7) + 2;
my_var *= 2;
println(my_var);

// does main loop
draw = function () {
  try {
    if(array[9].value === undefined){
      array[9].value = "hello";
    }
    array[9] += " there";
    println(array[9].value);
  } catch (e) {
    println("Error: " + e);
  } finally {
    // sets array to null
    array = null;
    // ends loop
    noLoop();
  }
}`;

var thing = document.createElement("div");
thing.innerHTML = code;
thing.style.whiteSpace = "pre";
thing.style.fontFamily = "monospace";
thing.style.fontSize = '12px'
thing.style.lineHeight = '20px'
thing.style.backgroundColor = "rgb(39, 40, 34)";
thing.style.color = "white";
thing.style.padding = "8px";
thing.id = "myCode";
thing.classList.add('editor-text')
thing.contentEditable = true;
thing.spellcheck = false;
scrollyscroll.appendChild(thing);

var codeDiv = document.getElementById("myCode");

function highlight (contentDiv) {
    try { var txt = contentDiv.innerText; } catch(e) { return; }
    contentDiv.innerHTML = "";
    
    var allowedVarChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,_$";
    
    var colors = {
        white: "rgb(248, 248, 242)",
        red: "rgb(249, 38, 88)",
        yellow: "rgb(230, 219, 116)",
        teal: "rgb(92, 217, 239)",
        green: "rgb(166, 226, 46)",
        purple: "rgb(144, 129, 255)",
        brown: "rgb(117, 113, 94)",
        comment: {
            default: 'rgb(117, 113, 94)',
            red: "red",
            purple: "purple",
            yellow: "yellow",
            blue: "blue",
            pink: "pink",
            green: "green"
        }
    };
    
    var spans = [];
    
    var currTok = "";
    var is = function(i1, i2) {
        return i1 === i2;
    };
    var has = function(i1, i2) {
        return i1.includes(i2);
    };
    
    var idx = 0;
    
    while (idx < txt.length) {
        var currChar = txt.charAt(idx);
        currTok += currChar;
        var done = false;
        var clr = colors.white;
        var didString = false;
    
        // ---------- yellow ----------
        if (is(currChar, '"') || is(currChar, "'") || is(currChar, "`")) {
            var s = document.createElement("span");
            s.innerText = currTok.slice(0, currTok.length - 1);
            s.style.color = clr;
            spans.push(s);
            currTok = currChar;
    
            idx++;
            while (txt.charAt(idx) !== currChar && idx < txt.length) {
                if (txt.charAt(idx) === "\\") {
                    currTok += "\\";
                    idx++;
                }
    
                currTok += txt.charAt(idx);
                idx++;
            }
    
            currTok += currChar;
            idx++;
    
            didString = true;
            done = true;
            clr = colors.yellow;
        }
    
        // ---------- brown ----------
        if (!didString) {
            if (has(currTok, "//")) {
                idx++;
                
                while (idx < txt.length && txt.charAt(idx) !== "\n") {
                    currTok += txt.charAt(idx);
                    idx++;
                }
                
                done = true;
                didString = true;
                clr = colors.comment.default;
                if (has(currTok, "// ")) {
                } else if (has(currTok, "//\!")) {
                    clr = colors.comment.red;
                } else if (has(currTok, "//\~")) {
                    clr = colors.comment.purple;
                } else if (has(currTok, "//\^")) {
                    clr = colors.comment.yellow;
                } else if (has(currTok, "//\&")) {
                    clr = colors.comment.pink;
                } else if (has(currTok, "//\*")) {
                    clr = colors.comment.green;
                } else if (has(currTok, "//\?")) {
                    clr = colors.comment.blue;
                }
            }
        }
        
        // ---------- red ----------
        if (!didString) {
            if (has(currTok, "++") || has(currTok, "--")) {
                var s = document.createElement("span");
                s.innerText = currTok.slice(0, currTok.length - 2);
                s.style.color = clr;
                spans.push(s);
                currTok = "++";
    
                done = true;
                clr = colors.red;
            }
            if (is(currTok, "+") ||
                is(currTok, "-") ||
                is(currTok, "*") ||
                (is(currTok, "/") && txt.charAt(idx + 1) !== "/") ||
                is(currTok, ">") ||
                is(currTok, "<") ||
                is(currTok, "=") ||
                is(currTok, "==") ||
                is(currTok, "===") ||
                is(currTok, "!==") ||
                is(currTok, "if") ||
                is(currTok, "while") ||
                is(currTok, "for") ||
                is(currTok, "try") ||
                is(currTok, "catch") ||
                is(currTok, "finally") ||
                is(currTok, "new") ||
                is(currTok, "throw") ||
                is(currTok, "switch") ||
                is(currTok, "case") ||
                is(currTok, "break") ||
                is(currTok, "extends") ||
                is(currTok, "await") ||
                is(currTok, "typeof")) {
                done = true;
                clr = colors.red;
            }
        }

        // ---------- green ----------
        if (!didString) {
            if (has(currTok, "style")) {
                var s = document.createElement("span");
                s.innerText = currTok.slice(0, currTok.length - 5);
                s.style.color = clr;
                spans.push(s);
                currTok = "style";
    
                done = true;
                clr = colors.green;
            }
            if (has(currTok, "this") || 
                has(currTok, ":") || 
                has(currTok, "Math") || 
                has(currTok, "Number") || 
                has(currTok, "String") || 
                has(currTok, "JSON")) {
                done = true;
                clr = colors.green;
            }
        }

        // ---------- blue ----------
        if (!didString) {
            if (has(currTok, "length")) {
                var s = document.createElement("span");
                s.innerText = currTok.slice(0, currTok.length - 6);
                s.style.color = clr;
                spans.push(s);
                currTok = "length";
    
                done = true;
                clr = colors.teal;
            }
            if (has(currTok, "push")) {
                var s = document.createElement("span");
                s.innerText = currTok.slice(0, currTok.length - 4);
                s.style.color = clr;
                spans.push(s);
                currTok = "push";
    
                done = true;
                clr = colors.teal;
            }
            if (is(currTok, "function") 
                || is(currTok, "class")) {
                var startIdx = idx;
                
                var name = "";
                while (idx < txt.length 
                    && txt.charAt(idx) !== "(" 
                    && txt.charAt(idx) !== "{") {
                    idx++;
                    name += txt.charAt(idx);
                }
                
                var s = document.createElement("span");
                s.innerText = currTok;
                s.style.color = colors.teal;
                spans.push(s);
                
                var s = document.createElement("span");
                s.innerText = name.slice(0, name.length - 1);
                s.style.color = colors.green;
                spans.push(s);
                
                name = name.replaceAll(" ", "");
                
                if (name.length === 1) {
                    startIdx = idx;
                    name = "";
                    
                    idx -= 9;
                    
                    while (idx > 0 && txt.charAt(idx) !== "=") {
                        idx--;
                    }
                    
                    idx--;
                    
                    if (txt.charAt(idx) === " ") {
                        idx--;
                    }
                    
                    while (idx > 0 && allowedVarChars.includes(txt.charAt(idx))) {
                        name += txt.charAt(idx);
                        idx--;
                    }
                    
                    name = name.split("").reverse().join("") + " ";
                    
                    for (var i = spans.length - 4; i > 0; i--) {
                        if (spans[i].innerText === name) {
                            spans[i].style.color = colors.green;
                        }
                    }
                    
                    idx = startIdx;
                }
                
                done = true;
                currTok = "(";
            }
            if (is(currTok, "var") || 
                is(currTok, "let") || 
                is(currTok, "const") || 
                is(currTok, "console") ||
                is(currTok, "println") ||
                is(currTok, "eval")) {
                done = true;
                clr = colors.teal;
            }
        }

        // ---------- purple ----------
        if (!didString) {
            if (!isNaN(parseFloat(currTok)) || 
                is(currTok, "true") || 
                is(currTok, "false") || 
                is(currTok, "null") || 
                is(currTok, "undefined")) {
                done = true;
                clr = colors.purple;
            }
        }

        // ---------- white ----------
        if (!didString) {
            if (has(currTok, " ") || 
                has(currTok, "(") || 
                has(currTok, ")") || has(currTok, "{") 
                || has(currTok, "}") || has(currTok, "[") 
                || has(currTok, "]") || has(currTok, ";")) {
                done = true;
                clr = colors.white;
            }
        }
        
        if (currChar === "\n") {
            done = true;
        }
        
        if (done) {
            var s = document.createElement("span");
            s.innerText = currTok;
            s.style.color = clr;
            spans.push(s);
            currTok = "";
        }
    
        if (!didString) {
            idx++;
        }
    }
    
    for (var i = 0; i < spans.length; i++) {
        contentDiv.appendChild(spans[i]);
    }
}

var startMS = Date.now();
highlight(codeDiv);
var endMS = Date.now();

document.getElementById("time").innerHTML = "It took " + (endMS - startMS) + " ms to highlight the code.";

function get_text_nodes_in(node) {
  var text_nodes = [];
  if (node.nodeType === 3) {
    text_nodes.push(node);
  } else {
    var children = node.childNodes;
    for (var i = 0, len = children.length; i < len; i++) {
      text_nodes.push.apply(text_nodes, get_text_nodes_in(children[i]));
    }
  }
  return text_nodes;
}

function set_cursor(position, element) {
  var range = document.createRange();
  range.selectNodeContents(element);
  var text_nodes = get_text_nodes_in(element);
  var char_count = 0, end_char_count;

  for (var i = 0, text_node; text_node = text_nodes[i++];) {
    end_char_count = char_count + text_node.length;
    
    if (position >= char_count && (position < end_char_count || (position === end_char_count && i < text_nodes.length))) {
      range.setStart(text_node, position - char_count);
      if (position <= end_char_count) {
        range.setEnd(text_node, position - char_count);
        break;
      }
    }
    
    char_count = end_char_count;
  }

  var selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}


function editorLineNums() {
    let lineNums = document.querySelector('.editor-line-nums')
    lineNums.style.lineHeight = '20px'
    
    let numOfLineNums = lineNums.innerHTML.split('<br>').length
    let numOfLines = codeDiv.innerHTML.split('<br>').length

    if (numOfLineNums > numOfLines) {
        for (i = 0; i < numOfLineNums - numOfLines; i++) {
            lineNums.innerHTML = lineNums.innerHTML.replace(numOfLineNums-i+'<br>', '')
        }
        return
    }
    for (i = numOfLineNums; i < numOfLines; i ++) {
        lineNums.innerHTML += `${i}<br>`
    }
}
editorLineNums()

let keyUpTimer = 0, highlighting = false

setInterval(() => {
    keyUpTimer ++
}, 50)

setInterval(highlight, 1000)

codeDiv.onkeydown = e => editorLineNums()

codeDiv.onkeyup = function (e) {
    if (keyUpTimer < 2 && !highlighting) return
    else keyUpTimer = 0; highlighting = true

    if (e.key.replace(/[a-zA-Z'";:,.<>/?]/, '') !== '') {
        return
    }

    var range = window.getSelection().getRangeAt(0);
    var end_node = range.endContainer;
    var end = range.endOffset;
    if (end_node !== this) {
        var text_nodes = get_text_nodes_in(this);
        for (var i = 0; i < text_nodes.length; ++i) {
        if (text_nodes[i] === end_node) {
            break;
        }
        end += text_nodes[i].length;
        }
    }

    var startMS = Date.now();
    highlight(codeDiv);
    var endMS = Date.now();
    
    document.getElementById("time").innerHTML = "It took " + (endMS - startMS) + " ms to highlight the code.";
    
    set_cursor(end, this);

    editorLineNums()

    highlighting = false
}
