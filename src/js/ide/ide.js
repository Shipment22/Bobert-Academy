function $(q) {
    return document.querySelectorAll(q)
}

const editor = ace.edit("editor");
const consoleBody = document.querySelector('#console-body');

// set some options
editor.setOptions({     
    fontSize: '14px',
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true
});
editor.setTheme("ace/theme/monokai");

// add run shortcut
editor.commands.addCommand({ 
    name: 'Run',
    bindKey: {win: 'Ctrl-Enter',  mac: 'Command-Enter'},
    exec: function(editor) {
        startOutput();
    },
    readOnly: true, 
});

// add resize font shortcuts
editor.commands.addCommand({ 
    name: 'Bigger Font',
    bindKey: {win: 'Ctrl-=',  mac: 'Command-='},
    exec: function(editor) {
        let sz = editor.getFontSize()
        let szNum = Number(sz.split('px')[0])
        if (szNum >= 70) { return; } 
        let newSz = (szNum + 2) + 'px'
        editor.setFontSize(newSz)
    }
});
editor.commands.addCommand({ 
    name: 'Smaller Font',
    bindKey: {win: 'Ctrl--',  mac: 'Command--'},
    exec: function(editor) {
        let sz = editor.getFontSize()
        let szNum = Number(sz.split('px')[0])
        if (szNum <= 6) { return; } 
        let newSz = (szNum - 2) + 'px'
        editor.setFontSize(newSz)
    }
});

// create undo manager
var UndoManager = require("ace/undomanager").UndoManager;   
editor.commands.addCommands([   // make undo and redo shortcuts
    {
        name : 'undo',
        bindKey : { win: 'Ctrl-Z', mac: 'Command-Z' },
        exec : function(editor){
            editor.session.getUndoManager().undo();
        }
    },
    {
        name : 'redo',
        bindKey : { win: 'Ctrl-Shift-Z', mac: 'Command-Shift-Z' },
        exec : function(editor){
            editor.session.getUndoManager().redo();
        }
    }
]);


const EditSession = require("ace/edit_session").EditSession; // get EditSession

var editors = {}; // store ACE tabs corresponding to their tab name. This way, new tabs can be added and old ones can be renamed dynamically
var undoManagers = {}; // store undo managers, corresponding to their tab name aswell.

function setEditorSwitch() {
    var tabs = document.querySelectorAll(".new-tab"); // get all new tab elements. querySelectorAll returns a forEachable list

    tabs.forEach(element => {
        let name = element.dataset.tab;                 // get file name
        let extension = name.split(".").reverse()[0];   // get file extension

        const defaultHTML = `<!DOCTYPE html>
<html>
   <head>
        <meta charset="utf-8">
        <title></title>
      
        <link rel="stylesheet" type="text/css" href="style.css">
   </head>
   <body>
       
   </body>
    <script src="sketch.js"></script>
</html>`;


        // create editor for file with starter code for certain file names
        if (name === 'index.html') {
            editors[element.dataset.tab] = new EditSession(defaultHTML);
        } else {
            // create editor for file with starter code for certain file extensions
            if(extension === "html") {
                editors[element.dataset.tab] = new EditSession(defaultHTML);
            } else if(extension === "css") {
                editors[element.dataset.tab] = new EditSession(["html,body {", "\tmargin: 0;", "\tpadding: 0;",  "\t",  "\tcolor: #fff;",  "\tbackground-color: #222;",  "\t",  "\tfont-family: Sans-Serif;", "}"]);
            } else {
                editors[element.dataset.tab] = new EditSession([""]);
            }
        }
        
        undoManagers[element.dataset.tab] = new UndoManager();  // create and set undo manager
        editors[element.dataset.tab].setUndoManager(undoManagers[element.dataset.tab]);

        editors[element.dataset.tab].setMode("ace/mode/" + extension); // set language mode depending on extension
        
        element.onclick = event => {
            editor.setSession(editors[element.dataset.tab]); // change the current edtor to the tab corresponding to the element clicked
        };
        element.oncontextmenu = event => {
            event.preventDefault();
            element.setAttribute("contenteditable", "true");

            if(element.createTextRange) {
                var range = element.createTextRange();
                range.move('character', element.textContent.length);
                range.select();
            }
            else {
                if(element.selectionStart) {
                    element.focus();
                    element.setSelectionRange(element.textContent.length, element.textContent.length);
                } else {
                    element.focus();
                }
            }

            element.onkeydown = event => {
                if(event.keyCode !== 13) return;

                event.preventDefault();

                let editor = editors[element.dataset.tab];
                editors[element.value] = editor;

                delete editors[element.dataset.tab];

                element.dataset.tab = element.value;

                let selection = window.getSelection();
                selection.removeAllRanges();

                element.setAttribute("contenteditable", "false");
            };

            window.addEventListener("click", event => {
                element.value = element.dataset.tab;
                element.setAttribute("contenteditable", "false");
            }, {
                once: true
            })
        };

        element.classList.remove("new-tab"); // remove new-tab class so the file isn't created again
    });
}

// create a mutation observer to update the file system when a .new-tab is added
const updateEditors = new MutationObserver(setEditorSwitch);
const tabsCont = document.querySelector("#tabs");
updateEditors.observe(tabsCont, { childList: true });

// initial file setup
setEditorSwitch();
editor.setSession(editors["index.html"]); // set the current tab

function addTab(title) {
    if (title === '' || title === ' ') {
        addTab(prompt('That name does not start with a letter/number, please enter a new one.'));
        return;
    } else if (editors[title] !== undefined) {  // makes sure that you name it something different from everything else
        addTab(prompt('That filename has already been used, please enter a new one.'));
        return;
    }

    let tab = document.createElement('button');   // create tab

    tab.classList.add('tab');                   // set classes
    tab.classList.add('new-tab');

    tab.dataset.tab = title;                    // set content and dataset.tab to the title
    tab.textContent = title;

    tabsCont.appendChild(tab);                  // append to the tabs bar

    setTimeout(function(){                      // wait 10 milliseconds then set the current tab
        editor.setSession(editors[title]);      
    }, 10);
}

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

const output = document.querySelector('#output');

function stopOutput() {
    output.srcdoc = '';
}
stopOutput();


function startOutput(file = 'index.html') {
    let tabs = document.querySelectorAll('.tab');   // get tabs

    let html = editors[file].getValue();    // gets html code
    output.srcdoc = html;
    tabs.forEach(element => {
        let name = element.dataset.tab;             // get name and extension
        let extension = name.split('.').reverse()[0];

        // code shortener
        function r(replace, what) {
            output.srcdoc = output.srcdoc.replace(new RegExp(replace, "gi"), what);
        }

        // loads css and js files
        if (extension === 'css') {
            r(`<link\\s+rel\\s*=\\s*["']stylesheet["']\\s*type\\s*=\\s*["']text/css["']\\s*href\\s*=\\s*["']${name}["']\\s*>`, `<style>${editors[name].getValue()}</style>`);
            r(`<link\\s+type\\s*=\\s*["']text/css["']\\s*rel\\s*=\\s*["']stylesheet["']\\s*href\\s*=\\s*["']${name}["']\\s*>`, `<style>${editors[name].getValue()}</style>`);
            r(`<link\\s+href\\s*=\\s*["']${name}["']\\s*type\\s*=\\s*["']text/css["']\\s*rel\\s*=\\s*["']stylesheet["']\\s*>`, `<style>${editors[name].getValue()}</style>`);
            r(`<link\\s+href\\s*=\\s*["']${name}["']\\s*type\\s*=\\s*["']text/css["']\\s*rel\\s*=\\s*["']stylesheet["']\\s*href\\s*=\\s*["']${name}["']\\s*>`, `<style>${editors[name].getValue()}</style>`);
            r(`<link\\s+rel\\s*=\\s*["']stylesheet["']\\s*href\\s*=\\s*["']${name}["']\\s*type\\s*=\\s*["']text/css["']\\s*href\\s*=\\s*["']${name}["']\\s*>`, `<style>${editors[name].getValue()}</style>`);
            r(`<link\\s+type\\s*=\\s*["']text/css["']\\s*href\\s*=\\s*["']${name}["']\\s*rel\\s*=\\s*["']stylesheet["']\\s*href\\s*=\\s*["']${name}["']\\s*>`, `<style>${editors[name].getValue()}</style>`);
        } else if (extension === 'js') {
            r(`\\s*src\\s*=\\s*["']${name}["']([^<>]*)>`, `$1>${editors[name].getValue()}`);
        } else if (extension === 'html' || extension === 'htm') {
            r(`\\s*href\\s*=\\s*["']${name}`, ` href="javascript:window.sendEditorTo = '${name}'`);
        } else {
            console.error('unknown file extension');
        }
    });

    setTimeout(() => {
        document.title = 
            output.contentDocument.title.length > 1 ? 
            output.contentDocument.title + ' | Bobert IDE' : 
            'Bobert IDE'
    }, 1000)
}

function updateStatusbar() {
    const caretPos = editor.getCursorPosition()
    document.getElementById('caret-pos').innerHTML = `Line ${caretPos.row}, Column ${caretPos.column}`
}

window.onclick = updateStatusbar

window.onkeydown = e => {
    updateStatusbar()

    
    if(e.ctrlKey && e.keyCode == 78) {
        let name = prompt('File name:')
        if (name) addTab(name)
        e.preventDefault(); 
    }
    if(e.ctrlKey && e.keyCode == 83) { 
        // save code
        e.preventDefault(); 
    }
}

let oldLength = editor.getValue().length,
outputTimer = Date.now()
const autoUpdateCheckbox = document.getElementById('auto-update-checkbox')

let reloadPromptInitiated = false

editor.on('change', () => {
    let newLength = editor.getValue().length
    if (autoUpdateCheckbox.checked && (newLength > oldLength + 3 || newLength < oldLength - 3 || outputTimer < Date.now() - 1000)) {
        oldLength = newLength
        outputTimer = Date.now()
        startOutput()
        setTimeout(function() {
            let newLength = editor.getValue().length
            if (newLength !== oldLength) {
                oldLength = newLength
                outputTimer = Date.now()
                startOutput()
            }
        }, 700)
    }

    if (!reloadPromptInitiated) {
        reloadPromptInitiated = true
        // prevent window/tab from being closed withour confirmation
        window.onbeforeunload = function (e) {
            // Cancel the event
            e.preventDefault();

            // Chrome requires returnValue to be set
            e.returnValue = 'Please confirm that you want to leave — information you’ve entered may not be saved.';
        };
    }
})


// model stuff
document.querySelector('.bottom > button:nth-child(1)').onclick = e => openModel('settings', 'general')

const modelData = {
    settings: [
        {
            title: 'general',
            icon: '../img/bobert.ico',
            content: 'never gonna give you up'
        },
        {
            title: 'not general',
            icon: '../img/bobert.ico',
            content: 'asdlflsdfljslfj'
        }
    ],
    save: [
        {
            title: 'database',
            icon: '../img/bobert.ico',
            content: 'the database doesn\'t exist yet lol'
        },
        {
            title: 'download json',
            icon: '../img/bobert.ico',
            content: 'one sec not implemented atm but it will be very very soon'
        },
        {
            title: 'download as zip',
            icon: '../img/bobert.ico',
            content: 'not implemented'
        },
        {
            title: 'download as single html file',
            icon: '../img/bobert.ico',
            content: 'also not implemented'
        }
    ]
}

const modelSidebar = document.querySelector('#model .sidebar')
const modelContent = document.querySelector('#model .content')
let modelSection = '', modelPage = ''
function openModel(section, page) {
    document.getElementById('model-wrapper').style.display = 'flex'

    console.log(section, page)

    let sectionData = modelData[section]
    modelSidebar.innerHTML = ''
    modelContent.innerHTML = ''

    for (let i in sectionData) {
        if (sectionData[i].title === page) {
            modelContent.innerHTML = sectionData[i].content
        }

        let sidebarNavButton = document.createElement('button')
        let btnImg = document.createElement('img')
        btnImg.src = sectionData[i].icon
        sidebarNavButton.appendChild(btnImg)
        sidebarNavButton.innerHTML += sectionData[i].title
        sidebarNavButton.onclick = sectionData[i].onclick || 
        new Function(`openModel('${section}', '${sectionData[i].title}')`)
        modelSidebar.appendChild(sidebarNavButton)
    }

    modelSection = section
    modelPage = page
}
// openModel('settings', 'general')

function closeModel() {
    document.getElementById('model-wrapper').style.display = 'none'
}
closeModel()

for (o of document.querySelectorAll('.close-model')) {
    o.onclick = e => closeModel()
}
document.getElementById('model-background').onclick = e => closeModel()

function save(type) {
    
}