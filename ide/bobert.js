const editorDiv = document.querySelector('.editor')
const scrollyscroll = document.querySelector('.editor .scroll-wraper')
const output = document.getElementById('output')

var thing = document.createElement("div");
// thing.innerHTML = code;
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

const codeDiv = document.getElementById("myCode");

function editorLineNums() {
    let lineNums = document.querySelector('.editor-line-nums')
    lineNums.style.lineHeight = '20px'
    
    let numOfLineNums = lineNums.innerHTML.split('<br>').length
    let numOfLines = codeDiv.innerHTML.replaceAll(/<br>/g, '\n').split('\n').length

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

codeDiv.onkeydown = e => editorLineNums()

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

function addFile(name, type, content) {
    if (!type) {
        type = name.split('.').reverse()[0]
    }
    if (!content) {
        switch (type) {
            case 'htm':
                type = 'html'
                content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`
                break
            case 'html':
                content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    hello
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

function setFile(name) {
    for (o of files) {
        if (o.name === name) {
            codeDiv.textContent = o.content
        }
    }
    editorLineNums()
}

function getFile(name) {
    for (o of files) {
        if (o.name === name) {
            return o
        }
    }
}

function runFile(name) {
    let file = getFile(name)
    output.srcdoc = file.content
}

addFile('index.html')
setFile('index.html')
addFile('style.css')
addFile('main.js')
