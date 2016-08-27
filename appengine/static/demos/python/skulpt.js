Sk.python3 = true;
Sk.inputfun = function(prompt) {
  return new Promise(function (resolve) { resolve(window.prompt(prompt)); });
};

function outf(text) {
  var mypre = document.getElementById("output");
  mypre.innerHTML = mypre.innerHTML + text;
}

function outfhidden(text) {
  var mypre = document.getElementById("hiddenoutput");
  mypre.innerHTML = mypre.innerHTML + text;
}

function builtinRead(x) {
  if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
    throw "File not found: '" + x + "'";
  }
  var file = Sk.builtinFiles["files"][x];
  if (!file) {
    return new Promise(function (accept, reject) {
      function reqListener () {
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

function initInterpreter() {
  var interpreter = document.getElementById("output");
  initVal = 'PyBlocks Interpreter\n\n';
  interpreter.innerHTML = initVal;
  if (interpreter.innerHTML == initVal) {
    return true;
  } else {
    return false;
  }

}
function runfull() {
  workspace.running = true;
  workspace.generatorSuccess = true;
  workspace.varBlocks = [];

  if (initInterpreter() && generateCode() && workspace.generatorSuccess) {

    var prog = document.getElementById("pycode").textContent;
    var mypre = document.getElementById("output");
    Sk.pre = "output";
    Sk.configure({output:outf, read:builtinRead, inputfunTakesPrompt: true});
    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';

    var myPromise = Sk.misceval.asyncToPromise(function() {
      return Sk.importMainWithBody("<stdin>", false, prog, true);
    });

    myPromise.then(function(mod) {
      console.log('success');
    },
    function(err) {
      var mypre = document.getElementById("output");
      mypre.innerHTML = mypre.innerHTML + err.toString() + "\n";
      console.log(err.toString());
    });
    mypre.focus();
    mypre.scrollTop = mypre.scrollHeight;

  } else if (!generateCode()) {
    alert('You need to have at least one statement block attached to the start block.')
  } else {
    alert('Errors found! Please look for the warning\
    symbols for more information.');
  }
  workspace.running = false;
}

function runeval(block) {

  workspace.running = true;
  workspace.generatorSuccess = true;
  // Poison the block selected to not search for more variable setters above it
  block.poisoned = true;

  var code = workspace.varBlocks + Blockly.Python.blockToCode(block);

  if (workspace.generatorSuccess) {

    if (code.constructor === Array) {
      code = 'print(' + code[0] + ')';
    }

    var mypre = document.getElementById("output");

    Sk.pre = "output";
    Sk.configure({output:outf, read:builtinRead, inputfunTakesPrompt: true});
    var myPromise = Sk.misceval.asyncToPromise(function() {
      return Sk.importMainWithBody("<stdin>", false, code, true);
    });
    myPromise.then(function(mod) {
      console.log('success');
    },
    function(err) {
      var mypre = document.getElementById("output");
      mypre.innerHTML = mypre.innerHTML + err.toString() + "\n";
      console.log(err.toString());
    });
    mypre.focus();
    mypre.scrollTop = mypre.scrollHeight;
  } else {
    alert('Errors found! Please look for the warning\
    symbols for more information.');
  }
  workspace.running = false;
  block.poisoned = false;
}

function runtooltip(code) {
  if (code.indexOf('input(') >= 0) {
    return;
  }
  document.getElementById("hiddenoutput").innerHTML = '';
  var mypre = document.getElementById("hiddenoutput");

  Sk.pre = "hiddenoutput";
  Sk.configure({output:outfhidden, read:builtinRead});
  var myPromise = Sk.misceval.asyncToPromise(function() {
    return Sk.importMainWithBody("<stdin>", false, code, true);
  });
  myPromise.then(function(mod) {
    console.log('success');
  },
  function(err) {
    var mypre = document.getElementById("hiddenoutput");
    mypre.innerHTML = mypre.innerHTML + err.toString() + "\n";
    console.log(err.toString());
  });
}

function copyToClipboard() {
  if (generateCode()) {
    window.prompt("Press CTRL + C to copy the code to clipboard",
    document.getElementById("pycode").textContent);
  }

}

function clr() {
  var mypre = document.getElementById("output");
  mypre.innerHTML = 'PyBlocks Interpreter\n\n';
}

function generateCode(event) {
  var content = document.getElementById('pycode');

  code = Blockly.Python.workspaceToCode(workspace);
  if (code != 0){
    content.textContent = code;
    return true;
  } else {
    return false;
  }


};
