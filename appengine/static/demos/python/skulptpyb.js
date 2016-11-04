Sk.python3 = true;
Sk.inputfun = function(prompt) {
    return new Promise(function(resolve) {
        resolve(window.prompt(prompt));
    });
};

var canRetainGlobals = true;
var initVal = ' PythonBlocks - Python 3 Interpreter\n\n';

function outf(text) {
    var mypre = document.getElementById("codearea");
    mypre.innerHTML = mypre.innerHTML + ' ' + text;
}

function outfhidden(text) {
    var mypre = document.getElementById("hiddenoutput");
    mypre.innerHTML = mypre.innerHTML + text;
}

function outfhidden2(text) {
    var mypre = document.getElementById("hiddenoutput2");
    mypre.innerHTML = mypre.innerHTML + text;
}

function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
        throw "File not found: '" + x + "'";
    }
    var file = Sk.builtinFiles["files"][x];
    if (!file) {
        return new Promise(function(accept, reject) {
            function reqListener() {
                accept(this.responseText);
            }
            var oReq = new XMLHttpRequest();
            oReq.addEventListener("load", reqListener);
            oReq.open("GET", "%(root)s" + file);
            oReq.send();
        });
    }
    return file;
}

function runfull() {

    workspace.running = true;
    workspace.generatorSuccess = true;
    workspace.vars = '';
    workspace.imports = '';

    if (initInterpreter() && generateCode() && workspace.generatorSuccess) {

        var prog = document.getElementById("pycode").textContent;
        if (prog.indexOf('turtle.Turtle()') != -1) {
            toggleTurtle('run');
        }
        var mypre = document.getElementById("codearea");
        Sk.pre = "output";
        Sk.configure({
            output: outf,
            read: builtinRead,
            inputfunTakesPrompt: true
        });
        (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'turtlecanvas';

        var myPromise = Sk.misceval.asyncToPromise(function() {
            return Sk.importMainWithBody("<stdin>", false, prog, true);
        });

        myPromise.then(function(mod) {
                console.log('success');
            },
            function(err) {
                var mypre = document.getElementById("codearea");
                mypre.innerHTML = mypre.innerHTML + err.toString() + "\n";
                console.log(err.toString());
            });


        mypre.scrollTop = mypre.scrollHeight;

    } else if (!generateCode()) {
        alert('You need to have at least one statement block attached to the start block.')
    } else {
        alert('Errors found! Please look for the warning symbols for more information.');
    }
    workspace.running = false;
    generateTypeTable();

    if (mypre.textContent != initVal && mypre.className != 'collapsed expanded') {
        toggleInterpreter();
    }
}

function runeval(block) {

    workspace.running = true;
    workspace.generatorSuccess = true;

    var code = Blockly.Python.blockToCode(block);

    if (code.indexOf('turtle.Turtle()') != -1) {
        toggleTurtle('run');
    }

    if (workspace.generatorSuccess) {

        if (code.constructor === Array) {
            code = 'print(' + code[0] + ')';
        }

        var mypre = document.getElementById("codearea");

        Sk.pre = "output";
        Sk.configure({
            output: outf,
            read: builtinRead,
            inputfunTakesPrompt: true,
            retainglobals: canRetainGlobals
        });
        (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'turtlecanvas';
        var myPromise = Sk.misceval.asyncToPromise(function() {
            return Sk.importMainWithBody("<stdin>", false, code, true);
        });
        myPromise.then(function(mod) {
                console.log('success');
                canRetainGlobals = true;
            },
            function(err) {
                var mypre = document.getElementById("codearea");
                mypre.innerHTML = mypre.innerHTML + err.toString() + "\n";
                console.log(err.toString());
            });


        mypre.scrollTop = mypre.scrollHeight;
    } else {
        alert('Errors found! Please look for the warning symbols for more information.');
    }
    workspace.running = false;
    generateTypeTable();
    if (mypre.textContent != initVal && mypre.className != 'collapsed expanded') {
        toggleInterpreter();
    }
}

function runtooltip(code) {

    if (code.indexOf('input(') >= 0) {
        return;
    }

    document.getElementById("hiddenoutput").innerHTML = '';
    var mypre = document.getElementById("hiddenoutput");

    Sk.pre = "hiddenoutput";
    Sk.configure({
        output: outfhidden,
        read: builtinRead,
        retainglobals: canRetainGlobals
    });
    var myPromise = Sk.misceval.asyncToPromise(function() {
        return Sk.importMainWithBody("<stdin>", false, code, true);
    });
    myPromise.then(function(mod) {
            canRetainGlobals = true;
            console.log('success');
        },
        function(err) {
            var mypre = document.getElementById("hiddenoutput");
            mypre.innerHTML = mypre.innerHTML + err.toString() + "\n";
            console.log(err.toString());
        });
    return mypre.innerHTML;
}


function normaliseDate(i) {
    if (i < 10) {
        i = "0" + i
    }; // add zero in front of numbers < 10
    return i;
}

function initInterpreter() {
    // var d = new Date();
    // var year = d.getFullYear();
    // var month = normaliseDate(d.getMonth());
    // var day = normaliseDate(d.getDate());
    // var hour = d.getHours();
    // var minute = normaliseDate(d.getMinutes());
    // var second = normaliseDate(d.getSeconds());


    var interpreter = document.getElementById("codearea");
    interpreter.innerHTML = initVal;
    if (interpreter.innerHTML == initVal) {
        return true;
    } else {
        return false;
    }

}

function copyToClipboard() {
    if (generateCode()) {
        window.prompt("Press CTRL + C to copy the code to clipboard",
            document.getElementById("pycode").textContent);
    }

}

function restart() {
    canRetainGlobals = false;
    workspace.imports = '';
    workspace.vars = '';
    var interpreter = document.getElementById("codearea");
    interpreter.innerHTML = interpreter.innerHTML + '\n === RESTART ====\n';
    interpreter.scrollTop = interpreter.scrollHeight;
    generateTypeTable();
}

function clr() {
    initInterpreter();
}

function toggleInterpreter() {
    var interpreter = document.getElementById("codearea");
    if (interpreter.className == 'collapsed') {
        interpreter.className += ' expanded';
    } else {
        interpreter.className = 'collapsed';
    }
}

function toggleTurtle(calledBy) {
    var turtleDiv = document.getElementById('turtlecanvas');
    if (calledBy == 'run') {
        turtleDiv.style.display = 'block';
    } else if (turtleDiv.style.display == 'block') {
        turtleDiv.style.display = 'none';
    } else {
        turtleDiv.style.display = 'block';
    }
}

function generateTypeTable() {
    var types = ['int', 'float', 'str', 'bool', 'range', 'vec2d'];
    var colours = ['#00CC33', '#0080FF', '#FF3010', '#FF29FF', '#FFAA00', '#DFDF20']
    var table = document.getElementById('typetable');
    table.innerHTML = '';
    var currRow = 0;

    if (workspace.imports.indexOf('import turtle') > -1 || startImports.indexOf('turtle') > -1) {
        types.push('turtle');
        colours.push('#00EEEE');
        types.push('screen');
        colours.push('#FFC0CB');
    }

    for (i = 0; i < types.length; i++) {

        if (table.rows.length == 0) {
            table.insertRow(currRow);
        }

        if (table.rows[currRow].cells.length >= 3) {
            currRow++;
            table.insertRow(currRow);
        }

        table.rows[currRow].insertCell(-1);
        table.rows[currRow].cells[table.rows[currRow].cells.length - 1].innerHTML = types[i];
        table.rows[currRow].cells[table.rows[currRow].cells.length - 1].style.backgroundColor = colours[i];

    }
}

function checkWorkspace(event) {
    Blockly.Python.workspaceToCode(workspace);
}


function generateCode(event) {
    var content = document.getElementById('pycode');

    code = Blockly.Python.blockToCode(workspace.getBlockById(1));
    if (code != 0) {
        content.textContent = code;
        return true;
    } else {
        return false;
    }


};
