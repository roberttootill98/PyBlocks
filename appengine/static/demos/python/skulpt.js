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

function runit(codearea, output) {
 var prog = document.getElementById(codearea).value;
 var mypre = document.getElementById(output);

 Sk.pre = "output";
 Sk.configure({output:outf, read:builtinRead});
 var myPromise = Sk.misceval.asyncToPromise(function() {
     return Sk.importMainWithBody("<stdin>", false, prog, false);
 });
 myPromise.then(function(mod) {
     console.log('success');
 },
     function(err) {
     var mypre = document.getElementById("output");
       mypre.innerHTML = mypre.innerHTML + err.toString() + "\n";
     console.log(err.toString());
 });
}

function runfull() {
 var prog = document.getElementById("pycode").textContent;
 var mypre = document.getElementById("output");

 Sk.pre = "output";
 Sk.configure({output:outf, read:builtinRead});
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
}

function runeval(code) {
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

/*function runblock() {
 var prog = document["content_python"].text;
 var mypre = document.getElementById("output");
 //mypre.innerHTML = '';
 Sk.pre = "output";
 Sk.configure({output:outf, read:builtinRead});
 var myPromise = Sk.misceval.asyncToPromise(function() {
     return Sk.importMainWithBody("<stdin>", false, prog, true);
 });
 myPromise.then(function(mod) {
     console.log('success');
 },
     function(err) {
     console.log(err.toString());
 });
}
*/
function clr() {
var mypre = document.getElementById("output");
mypre.innerHTML = 'PyBlocks Interpreter' + '\n\n';
}
