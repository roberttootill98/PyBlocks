Sk.python3 = true;

function outf(text) {
  var mypre = document.getElementById("output");
  mypre.innerHTML = mypre.innerHTML + text;
}

function outfhidden(text) {
  var mypre = document.getElementById("hiddenoutput");
  mypre.innerHTML = mypre.innerHTML + text;
}

function builtinRead(x) {
  if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
          throw "File not found: '" + x + "'";
  return Sk.builtinFiles["files"][x];
}

function runfull() {

workspace.running = true;
workspace.generatorSuccess = true;

if (generateCode() && workspace.generatorSuccess) {

 var prog = document.getElementById("pycode").textContent;
 var mypre = document.getElementById("output");
 Sk.pre = "output";
 Sk.configure({output:outf, read:builtinRead});
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
 document.getElementById("output").focus();
 } else {
   alert('Errors found! Please look for the blue warning\
   triangles for more information.');
 }
   workspace.running = false;
}

function runeval(block) {

  workspace.running = true;
  workspace.generatorSuccess = true;
  // Poison the block selected to not search for more variable setters above it
  block.poisoned = true;

  var code = Blockly.Python.blockToCode(block);

  if (workspace.generatorSuccess) {

  if (code.constructor === Array) {
    code = 'print(' + code[0] + ')';
  }

  var mypre = document.getElementById("output");

  Sk.pre = "output";
  Sk.configure({output:outf, read:builtinRead});
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

  document.getElementById("output").focus();
} else {
  alert('Errors found! Please look for the blue warning\
  triangles for more information.');
}
workspace.running = false;
block.poisoned = false;
}

function runtooltip(code) {
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
  window.prompt("Press CTRL + C to copy the code to clipboard", document.getElementById("pycode").textContent);
}

function clr() {
var mypre = document.getElementById("output");
mypre.innerHTML = 'PyBlocks Interpreter' + '\n\n';
}

function generateCode(event) {
  var content = document.getElementById('pycode');

  code = Blockly.Python.workspaceToCode(workspace);
  content.textContent = code;
  return true;
};
