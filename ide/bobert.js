const editorDiv = document.querySelector('.editor')
const output = document.getElementById('output')

var codeDiv = document.createElement("div");
codeDiv.style.whiteSpace = "pre";
codeDiv.style.fontFamily = "monospace";
codeDiv.style.fontSize = '12px'
codeDiv.style.lineHeight = '20px'
codeDiv.style.padding = "8px";
codeDiv.classList.add('editor-text')
codeDiv.contentEditable = true;
codeDiv.spellcheck = false;
document.querySelector('.editor .code-container').appendChild(codeDiv);

var highlightDiv = document.createElement("div");
highlightDiv.style.whiteSpace = "pre";
highlightDiv.style.fontFamily = "monospace";
highlightDiv.style.fontSize = '12px'
highlightDiv.style.lineHeight = '20px'
highlightDiv.style.padding = "8px"; 
highlightDiv.classList.add('editor-highlight')
document.querySelector('.editor .code-container').appendChild(highlightDiv);

function highlight () {
    var txt = codeDiv.innerHTML

    let rep

    switch(getFile(fileEditing).type) {
        case 'html':


            let valMatch = txt.match(/['"][^"']+['"]/gi)
            for (o of valMatch) {
                txt = txt.replace(o, `<span class="html_value">${o}</span>`)
            }

            let properties = [
                'accept',
                'accept-charset',
                'accesskey',
                'action',
                'alt',
                'async',
                'autocomplete',
                'autofocus',
                'autoplay',
                'charset',
                'checked',
                'cite',
                'class',
                'cols',
                'colspan',
                'content',
                'contenteditable',
                'controls',
                'coords',
                'data',
                'data-',
                'datetime',
                'default',
                'defer',
                'dir',
                'dirname',
                'disabled',
                'download',
                'draggable',
                'encrypte',
                'for',
                'form',
                'formaction',
                'headers',
                'height',
                'hidden',
                'high',
                'href',
                'hreflang',
                'http-equiv',
                'id',
                'ismap',
                'kind',
                'label',
                'lang',
                'list',
                'loop',
                'low',
                'max',
                'maxlength',
                'media',
                'method',
                'min',
                'multiple',
                'muted',
                'name',
                'novalidate',
                'onbort',
                'onafterprint',
                'onbeforeprint',
                'onbeforeunload',
                'onblur',
                'oncanplay',
                'oncanplaythrough',
                'onchange',
                'onclick',
                'oncontextmenu',
                'oncopy',
                'oncuechange',
                'oncut',
                'ondblclick',
                'ondrag',
                'ondragend',
                'ondragenter',
                'ondragleave',
                'ondragover',
                'ondragstart',
                'ondurationchange',
                'onemptied',
                'onended',
                'onerror',
                'onfocus',
                'onhashchange',
                'oninput',
                'oninvalid',
                'onkeydown',
                'onkeypress',
                'onkeyup',
                'onload',
                'onloadeddata',
                'onloadedmetadata',
                'onloadstart',
                'onmousedown',
                'onmousemove',
                'onmouseout',
                'onmouseover',
                'onmouseup',
                'onmousewheel',
                'onoffline',
                'ononline',
                'onpagehide',
                'onpageshow',
                'onpaste',
                'onpause',
                'onplay',
                'onplaying',
                'onpopstate',
                'onprogress',
                'onratechange',
                'onreset',
                'onresize',
                'onscroll',
                'onsearch',
                'onseeked',
                'onseeking',
                'onselect',
                'onstalled',
                'onstorage',
                'onsubmit',
                'onsuspend',
                'ontimeupdate',
                'ontoggle',
                'onunload',
                'onvolumechange',
                'onwaiting',
                'onwheel',
                'open',
                'optimum',
                'pattern',
                'placeholder',
                'poster',
                'preload',
                'readonly',
                'rel',
                'require',
                'reversed',
                'rows',
                'rowspan',
                'sandbox',
                'scope',
                'selected',
                'shape',
                'size',
                'sizes',
                'span',
                'spellcheck',
                'src',
                'srcdoc',
                'srclang',
                'srcset',
                'start',
                'start',
                'step',
                'style',
                'tabindex',
                'target',
                'title',
                'translate',
                'type',
                'value',
                'width',
                'warp'
            ]

            // for (o of properties) {
            //     txt = txt.replace(new RegExp(`/span> ${o}=`, 'gi'), `/span> <span class="html_property">${o}</span>=`)
            // }

            for (o of properties) {
                let oMatches = txt.match(RegExp(`${o}=<span class="html_value">`, 'gi'))
                if (oMatches === null) continue
                for (q of oMatches) {
                    q = q.replace('<span class="html_value">', '')
                    txt = txt.replace(q, `<span class="html_property">${q}</span><span class="html_value">`)
                }
                // txt = txt.replace(new RegExp(`&lt;${o} `, 'gi'), `<span class="html_valid-tag">&lt;${o}</span> `)
                // txt = txt.replace(new RegExp(`&lt;${o}&gt;`, 'gi'), `<span class="html_valid-tag">&lt;${o}</span>&gt;`)
                // txt = txt.replace(new RegExp(`/${o}&gt;`, 'gi'), `<span class="html_valid-tag">/${o}</span>&gt;`)
            }

            let validTags = [
                'a',
                'abbr',
                'address',
                'area',
                'artacle',
                'aside',
                'audio',
                'b',
                'base',
                'bdi',
                'bdo',
                'blockquote',
                'body',
                'br',
                'button',
                'canvas',
                'cite',
                'code',
                'col',
                'colgroup',
                'data',
                'datalist',
                'dd',
                'del',
                'details',
                'dfn',
                'dialog',
                'div',
                'div',
                'dl',
                'dt',
                'em',
                'embed',
                'feildset',
                'figcaption',
                'figure',
                'footer',
                'form',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h5',
                'h6',
                'head',
                'header',
                'hr',
                'html',
                'i',
                'iframe',
                'img',
                'input',
                'ins',
                'kbd',
                'label',
                'legend',
                'li',
                'link',
                'main',
                'map',
                'mark',
                'meta',
                'nav',
                'noscript',
                'object',
                'ol',
                'optgroup',
                'option',
                'output',
                'p',
                'param',
                'picture',
                'pre',
                'progress',
                'q',
                'rp',
                'rt',
                'ruby',
                's',
                'samp',
                'script',
                'select',
                'small',
                'source',
                'span',
                'strong',
                'style',
                'sub',
                'summary',
                'sup',
                'svg',
                'table',
                'tbody',
                'td',
                'template',
                'textarea',
                'tfoot',
                'th',
                'thead',
                'time',
                'title',
                'tr',
                'track',
                'u',
                'ul',
                'var',
                'video',
                'wbr'
            ]

            for (o of validTags) {
                let oMatches = txt.match(RegExp(`(&lt;|/)${o}(\\s|&gt;)`, 'gi'))
                if (oMatches === null) continue
                for (q of oMatches) {
                    txt = txt.replace(q, `<span class="html_valid-tag">${q}</span>`)
                }
                // txt = txt.replace(new RegExp(`&lt;${o} `, 'gi'), `<span class="html_valid-tag">&lt;${o}</span> `)
                // txt = txt.replace(new RegExp(`&lt;${o}&gt;`, 'gi'), `<span class="html_valid-tag">&lt;${o}</span>&gt;`)
                // txt = txt.replace(new RegExp(`/${o}&gt;`, 'gi'), `<span class="html_valid-tag">/${o}</span>&gt;`)
            }


            rep = [
                [
                    /&lt;/g,
                    '<span class="html_angle-bracket"><</span>'
                ],
                [
                    /&gt;/g,
                    '<span class="html_angle-bracket">></span>'
                ],
                [
                    new RegExp('<span class="html_angle-bracket"><</span>!--', 'g'),
                    '<span class="html_comment">&lt;!--'
                ],
                [
                    new RegExp('--<span class="html_angle-bracket">></span>', 'g'),
                    '--&gt;</span>'
                ],
                [
                    /!DOCTYPE html/g,
                    '<span class="html_doctype">!DOCTYPE</span> <span class="html_html-doctype">html</span>'
                ],
            ]

            break
        default:
            rep = []
            break
    }

    for (i in rep) {
        txt = txt.replace(rep[i][0], rep[i][1])
    }

    highlightDiv.innerHTML = txt
}

function editorLineNums() {
    let lineNums = document.querySelector('.editor-line-nums')
    lineNums.style.lineHeight = '20px'
    
    let numOfLineNums = lineNums.innerHTML.split('<br>').length
    let numOfLines = codeDiv.innerHTML.replaceAll(/<br>/g, '\n').replaceAll(/<br\/>/g, '\n').split('\n').length

    if (numOfLineNums > numOfLines) {
        for (i = 0; i < numOfLineNums - (numOfLines - 1); i++) {
            lineNums.innerHTML = lineNums.innerHTML.replace(numOfLineNums-i+'<br>', '')
        }
        return
    }
    for (i = numOfLineNums; i < numOfLines + 1; i ++) {
        lineNums.innerHTML += `${i}<br>`
    }
}
editorLineNums()

function openSidebarSection(section) {
    try {
        const sections = document.querySelectorAll('#sidebar .content > div')
        for (i in sections) {
            if (sections[i].id !== 'sidebar-' + section || sections[i].classList.contains('open')) {
                sections[i].classList.remove('open')
            } else {
                sections[i].classList.add('open')
            }
        }
    } catch(e) {}
}



const files = []
let fileEditing = 'index.html'

function addFile(name, type, content) {
    if (!type) {
        type = name.split('.').reverse()[0]
    }
    if (!content) {
        switch (type) {
            case 'htm':
                type = 'html'
            case 'html':
                content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="style.css">
    <title>Document</title>
</head>
<body>
    Bobert
    <!-- bobert -->
    <script src="main.js"></script>
</body>
</html>`
                break
            case 'css':
                content = `* {
    margin: 0;
    padding: 0;
}

body {
    background-color: #2b2b2b;
    color: #eee;
}`
            break
            default:
                content = '\n\n\n'
                break
        }
    }

    files.push({
        name: name,
        type: type,
        content: content
    })

    const file = document.createElement('button')
    file.classList.add('file')
    file.textContent = name
    file.onclick = function() {
        setFile(name)
    }
    document.getElementById('files').append(file)
}


function getFileIndex(name) {
    for (i in files) {
        if (files[i].name === name) {
            return i
        }
    }
}

function getFile(name) {
    return files[getFileIndex(name)]
}

function setFile(name) {
    let file = getFile(name)
    codeDiv.textContent = file.content
    fileEditing = file.name
    editorLineNums()
    highlight()
}

function runFile(name) {
    let doc = getFile(name).content

    // code shortener
    function r(replace, what) {
        doc = doc.replace(new RegExp(replace, "gi"), what);
    }
    for (f of files) {
        // loads css and js files
        let n = f.name, type = f.type        
        if (type === 'css') {
            r(`<link\\s+rel\\s*=\\s*["']stylesheet["']\\s*type\\s*=\\s*["']text/css["']\\s*href\\s*=\\s*["']${n}["']\\s*>`, `<style>${getFile(n).content}</style>`);
            r(`<link\\s+type\\s*=\\s*["']text/css["']\\s*rel\\s*=\\s*["']stylesheet["']\\s*href\\s*=\\s*["']${n}["']\\s*>`, `<style>${getFile(n).content}</style>`);
            r(`<link\\s+href\\s*=\\s*["']${n}["']\\s*type\\s*=\\s*["']text/css["']\\s*rel\\s*=\\s*["']stylesheet["']\\s*>`, `<style>${getFile(n).content}</style>`);
            r(`<link\\s+href\\s*=\\s*["']${n}["']\\s*type\\s*=\\s*["']text/css["']\\s*rel\\s*=\\s*["']stylesheet["']\\s*href\\s*=\\s*["']${n}["']\\s*>`, `<style>${getFile(n).content}</style>`);
            r(`<link\\s+rel\\s*=\\s*["']stylesheet["']\\s*href\\s*=\\s*["']${n}["']\\s*type\\s*=\\s*["']text/css["']\\s*href\\s*=\\s*["']${n}["']\\s*>`, `<style>${getFile(n).content}</style>`);
            r(`<link\\s+type\\s*=\\s*["']text/css["']\\s*href\\s*=\\s*["']${n}["']\\s*rel\\s*=\\s*["']stylesheet["']\\s*href\\s*=\\s*["']${n}["']\\s*>`, `<style>${getFile(n).content}</style>`);
        } else if (type === 'js') {
            r(`\\s*src\\s*=\\s*["']${n}["']([^<>]*)>`, `$1>${getFile(n).content}`);
        }
    }

    output.srcdoc = doc
}

function updateFile(file) {
    files[getFileIndex(file.name)] = file
}

function grabFileFromEditor() {
    let file = getFile(fileEditing)
    file.content = codeDiv.textContent
    updateFile(file)
}

addFile('index.html')
setFile('index.html')

var startMS = Date.now();
highlight(codeDiv);
var endMS = Date.now();
document.getElementById("time").innerHTML = "It took " + (endMS - startMS) + " ms to highlight the code.";


addFile('style.css')
addFile('main.js')

document.getElementById('new-file').onclick = () => {
    let name = prompt('file name')
    if (name) addFile(name)
}

setInterval(highlight, 1000)

codeDiv.onkeydown = codeDiv.onkeyup = function (e) {

    const startMS = Date.now();
    highlight(codeDiv)
    const endMS = Date.now();
    
    document.getElementById("time").innerHTML = "It took " + (endMS - startMS) + " ms to highlight the code.";

    editorLineNums()
    grabFileFromEditor()
    runFile('index.html')

    highlighting = false
}