var workspace;
var workspaceVar;
var varBlock;

Sk.python3 = true;

Sk.inputfun = function(prompt) {
    return new Promise(function(resolve) {
        resolve(window.prompt(prompt));
    });
};

var canRetainGlobals = true;
var initVal = ' Python 3 Interpreter\n\n';

function outf(text) {
    var mypre = document.getElementById("codeArea");
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

function runFull() {


    workspace.running = true;
    workspace.generatorSuccess = true;
    workspace.vars = '';
    workspace.imports = '';

    if (generateCode() && workspace.generatorSuccess) {

        initInterpreter();
        setTimeout(function() {
            var mypre = document.getElementById("codeArea");
            var prog = document.getElementById("pycode").textContent;
            var turtleBtn = document.getElementById("turtleButton");

            if (mypre.className != 'collapsed expanded') {
                toggleInterpreter();
                mypre.scrollTop = mypre.scrollHeight;
            } else {
                mypre.scrollTop = mypre.scrollHeight;
            }

            if (prog.indexOf('turtle.Turtle()') != -1) {
                toggleTurtle('run');
            } else {
                turtleBtn.innerHTML = '';
                turtleBtn.style.display = 'none';
            }

            Sk.pre = "output";
            Sk.configure({
                output: outf,
                read: builtinRead,
                inputfunTakesPrompt: true
            });
            (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'turtleCanvas';

            var myPromise = Sk.misceval.asyncToPromise(function() {
                return Sk.importMainWithBody("<stdin>", false, prog, true);
            });

            myPromise.then(function(mod) {
                    console.log('success');
                    if (mypre.textContent != initVal && mypre.className != 'collapsed expanded') {
                        toggleInterpreter();
                        mypre.scrollTop = mypre.scrollHeight;
                    } else {
                        mypre.scrollTop = mypre.scrollHeight;
                    }
                },
                function(err) {
                    var mypre = document.getElementById("codeArea");
                    mypre.innerHTML = mypre.innerHTML + err.toString() + "\n";
                    console.log(err.toString());
                });


        }, 500);
    } else if (!generateCode()) {
        alert('You need to have at least one statement block attached to the start block.')
    } else {
        alert('Errors found! Please look for the warning symbols for more information.');
    }

    workspace.running = false;
    generateTypeTable();
}

function runEval(block) {

    workspace.running = true;
    workspace.generatorSuccess = true;

    var code = Blockly.Python.blockToCode(block);
    var prog = document.getElementById("pycode").textContent;
    var turtleBtn = document.getElementById("turtleButton");

    if (prog.indexOf('turtle.Turtle()') != -1) {
        toggleTurtle('run');
    } else {
        turtleBtn.innerHTML = '';
        turtleBtn.style.display = 'none';
    }

    if (workspace.generatorSuccess) {

        if (code.constructor === Array) {
            code = 'print(' + code[0] + ')';
        }

        var mypre = document.getElementById("codeArea");

        Sk.pre = "output";
        Sk.configure({
            output: outf,
            read: builtinRead,
            inputfunTakesPrompt: true,
            retainglobals: canRetainGlobals
        });
        (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'turtleCanvas';
        var myPromise = Sk.misceval.asyncToPromise(function() {
            return Sk.importMainWithBody("<stdin>", false, code, true);
        });
        myPromise.then(function(mod) {
                console.log('success');
                if (mypre.textContent != initVal && mypre.className != 'collapsed expanded') {
                    toggleInterpreter();
                    mypre.scrollTop = mypre.scrollHeight;
                } else {
                    mypre.scrollTop = mypre.scrollHeight;
                }
                canRetainGlobals = true;
            },
            function(err) {
                var mypre = document.getElementById("codeArea");
                mypre.innerHTML = mypre.innerHTML + err.toString() + "\n";
                console.log(err.toString());
            });


    } else {
        alert('Errors found! Please look for the warning symbols for more information.');
    }

    workspace.running = false;
    generateTypeTable();
}

function runTooltip(code) {

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

function initInterpreter() {

    var interpreter = document.getElementById("codeArea");
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
    var interpreter = document.getElementById("codeArea");

    interpreter.innerHTML = interpreter.innerHTML + '\n ==== RESTART ====\n';
    interpreter.scrollTop = interpreter.scrollHeight;
    interpreter.className = 'collapsed expanded';
    generateTypeTable();

    setTimeout(function() {
        initInterpreter();
        setTimeout(function() {
            toggleInterpreter();
        }, 350);
    }, 750);

    return true;
}

function clr() {
    initInterpreter();
}

function toggleInterpreter() {
    var interpreter = document.getElementById("codeArea");
    var interpreterButton = document.getElementById("interpreter");

    if (interpreter.className == 'collapsed') {
        interpreter.className += ' expanded';
        interpreter.scrollTop = interpreter.scrollHeight;
        interpreterButton.innerHTML = 'Hide';
    } else {
        interpreter.className = 'collapsed';
        interpreter.scrollTop = 0;
        interpreterButton.innerHTML = 'Show';
    }
}

function toggleTurtle(calledBy) {
    var turtleDiv = document.getElementById('turtleCanvas');
    var turtleBtn = document.getElementById('turtleButton');

    if (calledBy == 'run') {
        turtleDiv.style.display = 'block';
        turtleBtn.innerHTML = 'Hide Turtle';
        turtleBtn.style.display = 'inline';
    } else if (turtleDiv.style.display == 'block') {
        turtleDiv.style.display = 'none';
        turtleBtn.innerHTML = 'Show Turtle';
    } else {
        turtleDiv.style.display = 'block';
        turtleBtn.innerHTML = 'Hide Turtle';
    }
}

function generateTypeTable() {
    var types = ['int', 'float', 'str', 'bool', 'range'];
    var colours = ['#FBBC05', '#4285F4', '#39b55b', '#EA4335', '#FF89F7'];
    var table = document.getElementById('typeTable');
    table.innerHTML = '';
    var currRow = 0;

    if (workspace.imports.indexOf('import turtle') > -1 || startImports.indexOf('turtle') > -1) {
        types.push('turtle');
        colours.push('#00EEEE');
        types.push('screen');
        colours.push('#FFC0CB');
        types.push('vec2d');
        colours.push('#DFDF20');
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

function popupWindow(url, title, win, w, h) {
    var y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
    var x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);

    return window.open(url, title,
        'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
        w + ', height=' + h + ', top=' + y + ', left=' + x);
}


function checkWorkspace(event) {
    Blockly.Python.workspaceToCode(workspace);
}

function setDifficulty() {
    workspace.difficulty = document.getElementById("difficulty").value;
    console.log(workspace.difficulty);
    console.log(workspace);
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

var block;
var constBlock;
var varBlock;

function setModalVar() {
    var varType;
    var varMod;
    var varBool;
    var varName;


    modalSet = document.getElementById("modalSet");
    modalVarName = document.getElementById("modalVarName");
    modalValue = document.getElementById("modalValue");
    modalType = document.getElementById("modalType");

    dropdownVar = document.getElementById("dropdownVar");

    radioStd = document.getElementById("radioStd");
    radioList = document.getElementById("radioList");
    radioTuple = document.getElementById("radioTuple");
    varText = document.getElementById("varText");
    varType = dropdownVar.value;

    if (radioStd.checked) {
        varMod = radioStd.value;
    } else if (radioList.checked) {
        varMod = radioList.value;
    } else if (radioTuple.checked) {
        varMod = radioTuple.value;
    }

    varName = varText.value;
    
    newVar = varName;

    newVar = newVar.replace(/^ +| +$/g, '');
    newVar = newVar.replace(/\W+/g, '_');
    if ('0123456789'.indexOf(newVar[0]) != -1) {
        newVar = '_' + newVar;
    }

    var variables = Blockly.Variables.allVariables(workspace, true, true);
    varName = Blockly.Python.makeNameUnique(newVar, variables);
    
    workspaceVar.clear();

    var newVariableBlock = function() {
        varBlock = goog.dom.createDom('block');
        varBlock.setAttribute('id', 'varBlock');
        varBlock.setAttribute('type', 'variables_get');
        varBlock.setAttribute('deletable', 'false');
        varBlock.setAttribute('movable', 'false');
        var field = goog.dom.createDom('field', null, varName);
        field.setAttribute('name', 'VAR');
        varBlock.appendChild(field);
        var pyType = goog.dom.createDom('pytype', null, varType);
        varBlock.appendChild(pyType);
        return varBlock;
    };

    /*var newConstBlock = function() {
        constBlock = goog.dom.createDom('block');
        var field;
        constBlock.setAttribute('id', 'constBlock');
        switch (varType) {

            case 'int':
                constBlock.setAttribute('type', 'python_int_const');
                field = goog.dom.createDom('field', null, '0');
                field.setAttribute('name', 'VALUE');
                constBlock.setAttribute('deletable', 'false');
                constBlock.setAttribute('movable', 'false');
                break;
            case 'float':
                constBlock.setAttribute('type', 'python_float_const');
                field = goog.dom.createDom('field', null, '0.0');
                field.setAttribute('name', 'VALUE');
                constBlock.setAttribute('deletable', 'false');
                constBlock.setAttribute('movable', 'false');
                break;
            case 'str':
                constBlock.setAttribute('type', 'python_string_const');
                field = goog.dom.createDom('field', null, '"a string"');
                field.setAttribute('name', 'VALUE');
                constBlock.setAttribute('deletable', 'false');
                constBlock.setAttribute('movable', 'false');
                break;
            case 'bool':
                switch (varBool) {
                    case 'true':
                        constBlock.setAttribute('type', 'python_true');
                        field = goog.dom.createDom('field', null, 'True');
                        constBlock.setAttribute('deletable', 'false');
                        constBlock.setAttribute('movable', 'false');
                        break;
                    case 'false':
                        constBlock.setAttribute('type', 'python_false');
                        field = goog.dom.createDom('field', null, 'False');
                        constBlock.setAttribute('deletable', 'false');
                        constBlock.setAttribute('movable', 'false');
                        break;
                }
                break;

        }

        constBlock.appendChild(field);
        return constBlock;
    };

    */

    block = goog.dom.createDom('block');
    block.setAttribute('id', 'setterBlock');
    block.setAttribute('type', 'variables_set');
    block.setAttribute('editable', 'false');
    block.setAttribute('deletable', 'false');
    block.setAttribute('movable', 'false');

    var varValue = goog.dom.createDom('value', null);
    varValue.setAttribute('type', 'input_value');
    varValue.setAttribute('name', 'VAR');
    block.appendChild(varValue);

    var pyType = goog.dom.createDom('pytype', null, varType);
    block.appendChild(pyType);

    var varConstVal = goog.dom.createDom('value', null);
    varConstVal.setAttribute('name', 'VALUE');
    block.appendChild(varConstVal);

    var variable = newVariableBlock();
    varValue.appendChild(variable);

    /*if (!(varType == 'bool' && varBool == 'empty')) {
        var valValue = newConstBlock();
        varConstVal.appendChild(valValue);
    }*/

    Blockly.Xml.domToBlock(workspaceVar, variable);

    var blocks = workspaceVar.getAllBlocks();
    blocks[0].moveBy(15, 15);
}


function spawnVar() {

    dropdownVar = document.getElementById("dropdownVar").value;

    if (dropdownVar != 'nulltype') {
        var modal = document.getElementById('modalBG');

        workspaceVar.clear();
        Blockly.Xml.domToBlock(workspaceVar, block);

        var blocks = workspaceVar.getAllBlocks();

        blocks[0].moveBy(300, 4);


        for (i = 0; i < blocks.length; i++) {
            blocks[i].movable_ = true;
            blocks[i].editable_ = true;
            blocks[i].deletable_ = true;
        }

        var finalBlock = Blockly.Xml.workspaceToDom(workspaceVar);

        modal.style.display = 'none';

        Blockly.Xml.domToWorkspace(workspace, finalBlock);
        console.log("trc", finalBlock);

    } else {
        window.alert("Pick a variable type");
    }


}

function closeModal() {

    var modal = document.getElementById('modalBG');
    modal.style.display = 'none';
}

window.onbeforeunload = function() {
    return 'Are you sure?';

}

function init() {

    var blocklyArea = document.getElementById('blocklyArea');
    var blocklyVarArea = document.getElementById('blocklyVarArea');
    var blocklyDiv = document.getElementById('blocklyDiv');
    var blocklyVarDiv = document.getElementById('blocklyVarDiv');
    var output = document.getElementById('codeArea');

    xmlHttp = new XMLHttpRequest();

    xmlHttp.open("GET", "toolbox.xml", false);
    xmlHttp.send();
    xmlDoc = xmlHttp.responseText;

    blocklyDiv.insertAdjacentHTML('afterend', xmlDoc);
    
    workspaceVar = Blockly.inject(blocklyVarDiv, {
        media: '../../media/',
        trashcan: false
    });

    workspace = Blockly.inject(blocklyDiv, {
        media: '../../media/',
        trashcan: false,
        toolbox: document.getElementById('toolbox')
    });


    var onResizeVar = function(e) {
        var elementVar = blocklyVarArea;
        var xVar = 0;
        var yVar = 0;
        do {
            xVar += elementVar.offsetLeft;
            yVar += elementVar.offsetTop;
            elementVar = elementVar.offsetParent;
        } while (elementVar);

        blocklyVarDiv.style.left = xVar + 'px';
        blocklyVarDiv.style.top = yVar + 'px';
        blocklyVarDiv.style.width = blocklyVarArea.offsetWidth + 'px';
        blocklyVarDiv.style.height = blocklyVarArea.offsetHeight + 'px';
        Blockly.svgResize(workspaceVar);
    };

    var onResize = function(e) {
        // Compute the absolute coordinates and dimensions of blocklyArea.
        var element = blocklyArea;
        var x = 0;
        var y = 0;
        do {
            x += element.offsetLeft;
            y += element.offsetTop;
            element = element.offsetParent;
        } while (element);
        // Position blocklyDiv over blocklyArea.
        blocklyDiv.style.left = x + 'px';
        blocklyDiv.style.top = y + 'px';
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
        blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
        Blockly.svgResize(workspace);
    };


    window.addEventListener('resize', onResize, false);
    window.addEventListener('resize', onResizeVar, false);
    output.addEventListener('transitionend', onResize);

    if ('BlocklyStorage' in window && window.location.hash.length > 1) {
        BlocklyStorage.retrieveXml(window.location.hash.substring(1));
    } else {
        var xml =
            '<xml><block id="startBlock" type="python_start" deletable="false" movable="false" x="2" y="17"></block></xml>';
        Blockly.Xml.domToWorkspace(workspace, Blockly.Xml.textToDom(xml));

    }

    goog.events.listen(document.getElementById('blocklyDiv'),
        'dblclick',
        function() {
            if (Blockly.selected != null && Blockly.selected.type !=
                'python_start') {
                runEval(Blockly.selected)
            }
        });

    var modal;
    var modalBtn;
    var modalSpan;

    window.onload = function() {
        var mypre = document.getElementById("codeArea");
        var modal = document.getElementById('modalBG');
        var modalBtn = document.getElementById('modalBtn');
        var modalSpan = document.getElementsByClassName('close')[0];

        var interpreter = document.getElementById("codeArea");
        
        setTimeout(function() {
            document.getElementById('startIcon').innerHTML = document.getElementById('startIcon').innerHTML + '<span id="startIconSpan">test</span>';
        }, 150);

        modalBtn.onclick = function() {
            modal.style.display = 'block';
            if (mypre.className == 'collapsed expanded') {
                toggleInterpreter();
                mypre.scrollTop = mypre.scrollHeight;
            }
            setTimeout(function() {
                setModalVar();
                onResizeVar();
            }, 100);

        }

        modalSpan.onclick = function() {
            modal.style.display = 'none';
        }
    }




    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    initInterpreter();
    //checkWorkspace();
    generateTypeTable();
    onResize();
    onResizeVar();

}
