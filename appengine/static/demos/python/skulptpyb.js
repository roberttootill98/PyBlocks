Sk.python3 = true;
Sk.inputfun = function(prompt) {
  return new Promise(function (resolve) { resolve(window.prompt(prompt)); });
};

var canRetainGlobals = true;


function outf(text) {
  var mypre = document.getElementById("output");
  mypre.innerHTML = mypre.innerHTML + '>> ' + text;
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

function normaliseDate(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
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


  var interpreter = document.getElementById("output");
  initVal = 'PythonBlocks - Python 3 Interpreter\n\n';
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
  workspace.vars = '';
  workspace.imports = '';

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
    alert('Errors found! Please look for the warning symbols for more information.');
  }
  workspace.running = false;
}

function runeval(block) {

  workspace.running = true;
  workspace.generatorSuccess = true;

  var code = Blockly.Python.blockToCode(block);

  if (workspace.generatorSuccess) {

    if (code.constructor === Array) {
      code = 'print(' + code[0] + ')';
    }

    var mypre = document.getElementById("output");

    Sk.pre = "output";
    Sk.configure({output:outf, read:builtinRead, inputfunTakesPrompt: true, retainglobals: canRetainGlobals});
    var myPromise = Sk.misceval.asyncToPromise(function() {
      return Sk.importMainWithBody("<stdin>", false, code, true);
    });
    myPromise.then(function(mod) {
      console.log('success');
      canRetainGlobals = true;
    },
    function(err) {
      var mypre = document.getElementById("output");
      mypre.innerHTML = mypre.innerHTML + err.toString() + "\n";
      console.log(err.toString());
    });
    mypre.focus();
    mypre.scrollTop = mypre.scrollHeight;
  } else {
    alert('Errors found! Please look for the warning symbols for more information.');
  }
  workspace.running = false;
}

function runtooltip(code) {
  if (code.indexOf('input(') >= 0) {
    return;
  }
  document.getElementById("hiddenoutput").innerHTML = '';
  var mypre = document.getElementById("hiddenoutput");

  Sk.pre = "hiddenoutput";
  Sk.configure({output:outfhidden, read:builtinRead, retainglobals: canRetainGlobals});
  var myPromise = Sk.misceval.asyncToPromise(function() {
    // Sk.globals = savedGlobals;
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

// function runassigncheck(code) {
//   // if (code.indexOf('input(') >= 0) {
//   //   return;
//   // }
//
//   document.getElementById("hiddenoutput2").innerHTML = '';
//   var mypre = document.getElementById("hiddenoutput2");
//
//   Sk.pre = "hiddenoutput2";
//   Sk.configure({output:outfhidden2, read:builtinRead});
//   var myPromise = Sk.misceval.asyncToPromise(function() {
//     return Sk.importMainWithBody("<stdin>", false, code, true);
//   });
//   myPromise.then(function(mod) {
//     console.log('success');
//   },
//   function(err) {
//     var mypre = document.getElementById("hiddenoutput2");
//     mypre.innerHTML = mypre.innerHTML + err.toString() + "\n";
//     console.log(err.toString());
//   });
//   return mypre.innerHTML;
// }

function copyToClipboard() {
  if (generateCode()) {
    window.prompt("Press CTRL + C to copy the code to clipboard",
    document.getElementById("pycode").textContent);
  }

}

function restart() {
  canRetainGlobals = false;
  workspace.vars = '';
  initInterpreter();
}

function clr() {
  initInterpreter();
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
