/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2013 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Python-specific colours enterDocument
 * @author matthew.j.poole@gmail.com (Matthew Poole)
 */
'use strict';

//console.log = function() {};

goog.require('Blockly.Names');

goog.provide('Blockly.PythonLang');

/*
Blockly.PythonLang.COLOUR['notype'] = '#8B7D6B';
Blockly.PythonLang.COLOUR['int'] = ;   //yellow
Blockly.PythonLang.COLOUR['float'] = '#FF1919'; // red

Blockly.PythonLang.COLOUR['range'] = '#00CC33';  // green
Blockly.PythonLang.COLOUR['bool'] = '#FF29FF'; // magenta
Blockly.PythonLang.COLOUR['str'] = '#0080FF' ; // blue
*/


var red = '#FF3010'; // '#FF4500';
//var orange = '#FFAA00';
var yellow = '#DFDF20';
var pink = '#FFC0CB';
var green = '#00CC33';
var cyan = '#00EEEE';
var blue = '#0080FF';
var magenta = '#FF29FF';

// Colour-safe colours
//var orange = "#FE9E00"; //"#E69900";
//var skyblue = "#00B5EE"; //"#59B3E6";
//var bluegreen = "#009980";
//var vermilion = "#E64D40";

// Google colours
var orange = "#FBBC05";
var skyblue = "#4285F4";
var bluegreen = '#39b55b'; //"#34A853";
var vermilion = "#EA4335";
var pink =   "#FF89F7";


/* Microsoft
var orange = "#FFB901";
var skyblue = "#01A4EF";
var bluegreen = '#7FBA00'; //"#34A853";
var vermilion = "#F25022";
var pink =   "#FF89F7";
*/


Blockly.PythonLang.COLOUR = {};
Blockly.PythonLang.COLOUR['nulltype'] = '#504a45';
Blockly.PythonLang.COLOUR['notype'] = '#afafaf'; //'#afafaf'; //'#a6a6a6'; //'#706c67';
Blockly.PythonLang.COLOUR['str'] = bluegreen;
Blockly.PythonLang.COLOUR['turtle'] = cyan;
Blockly.PythonLang.COLOUR['vec2d'] = yellow;
Blockly.PythonLang.COLOUR['screen'] = pink;
Blockly.PythonLang.COLOUR['int'] = orange;
Blockly.PythonLang.COLOUR['range'] = pink;
Blockly.PythonLang.COLOUR['float'] = skyblue;
Blockly.PythonLang.COLOUR['bool'] = vermilion;
Blockly.PythonLang.RAINBOW = [red, yellow, green, cyan, blue, magenta, red];


// Temporary colours
Blockly.PythonLang.COLOUR['nonnegint'] = orange;
Blockly.PythonLang.COLOUR['negint'] = orange;

Blockly.PythonLang.SUBTYPES = {
    'int': ['negint', 'nonnegint']
};

Blockly.PythonLang.CENTRED_SUBTYPE_SYMBOLS = {
    'nonnegint': '>=0'
};

Blockly.PythonLang.PATTERNED_SUBTYPE_SYMBOLS = {
    'negint': '-',
};

Blockly.PythonLang.SUPERTYPES = {
    'negint': 'int',
    'nonnegint': 'int'
};

Blockly.PythonLang.SUPTYPE_CHECK = {
    'negint': function(block) {
        if (block.type != 'python_int_const') {
            return false;
        }
        var value = block.getFieldValue("VALUE");
        return (Number(value) < 0);
    },

    'nonnegint': function(block) {
        if (block.type == 'python_abs') {
            return true;
        }
        if (block.type != 'python_int_const') {
            return false;
        }
        var value = block.getFieldValue("VALUE");
        return (Number(value) >= 0);
    }
};

// deal with subtypes in a list of types
Blockly.PythonLang.mergeSubtypes = function(typeList) {

    // if int is not here but both subtypes are, add int
    var intIndex = typeList.indexOf('int');
    if (intIndex == -1) {
        var allSubtypes = true;
        for (var subType in Blockly.PythonLang.SUPERTYPES) {
            if (typeList.indexOf(subType) == -1) {
                allSubtypes = false;
                break;
            }
        }
        if (allSubtypes) {
            console.log("MERGEST all subtypes so adding int");
            typeList.push('int');
        }
    }

    // if int (or *int) is here, remove the subtypes
    var intIndex = typeList.indexOf('int');
    if (intIndex != -1) {
        for (var subType in Blockly.PythonLang.SUPERTYPES) {
            var pos = typeList.indexOf(subType);
            if (pos != -1) {
                console.log("MERGEST int present so removing " + subType);
                typeList.splice(pos, 1);
            }
        }
    }
    console.log("MERGEST finished " + typeList);
    return typeList;
};


Blockly.PythonLang.NEW_VARS = [{
    name: "newIntVariable",
    type: 'int'
}, {
    name: "newFloatVariable",
    type: 'float'
}, {
    name: "newStringVariable",
    type: 'str'
}, {
    name: "newBoolVariable",
    type: 'bool'
}];

Blockly.PythonLang.NEW_TURTLE_VARS = [{
    name: "newTurtleVariable",
    type: 'turtle'
}, {
    name: "newScreenVariable",
    type: 'screen'
}];

Blockly.PythonLang.NEW_LIST_VARS = [{
    name: "newIntListVar",
    type: '*int'
}, {
    name: "newFloatListVar",
    type: '*float'
}, {
    name: "newStringListVar",
    type: '*str'
}, {
    name: "newBoolListVar",
    type: '*bool'
}];

Blockly.PythonLang.RESERVED_WORDS = ['False', 'None', 'True', 'and', 'as', 'assert',
    'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
    'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda',
    'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while',
    'with', 'yield'
];

Blockly.PythonLang.BUILTIN_MODULES = ['_ast', '_bisect', '_codecs', '_collections',
    '_datetime', '_elementtree', '_functools', '_heapq', '_imp', '_io', '_locale',
    '_md5', '_operator', '_pickle', '_posixsubprocess', '_random', '_sha1',
    '_sha256', '_sha512', '_socket', '_sre', '_stat', '_string', '_struct',
    '_symtable', '_thread', '_tracemalloc', '_warnings', '_weakref', 'array',
    'atexit', 'binascii', 'builtins', 'errno', 'faulthandler', 'fcntl', 'gc',
    'grp', 'itertools', 'marshal', 'math', 'posix', 'pwd', 'pyexpat',
    'select', 'signal', 'spwd', 'sys', 'syslog', 'time', 'unicodedata',
    'xxsubtype', 'zipimport', 'zlib'
];

Blockly.PythonLang.BUILIN_FUNCTIONS = ['ArithmeticError', 'AssertionError',
    'AttributeError', 'BaseException', 'BlockingIOError', 'BrokenPipeError',
    'BufferError', 'BytesWarning', 'ChildProcessError',
    'ConnectionAbortedError', 'ConnectionError', 'ConnectionRefusedError',
    'ConnectionResetError', 'DeprecationWarning', 'EOFError', 'Ellipsis',
    'EnvironmentError', 'Exception', 'False', 'FileExistsError',
    'FileNotFoundError', 'FloatingPointError', 'FutureWarning', 'GeneratorExit',
    'IOError', 'ImportError', 'ImportWarning', 'IndentationError', 'IndexError',
    'InterruptedError', 'IsADirectoryError', 'KeyError', 'KeyboardInterrupt',
    'LookupError', 'MemoryError', 'NameError', 'None', 'NotADirectoryError',
    'NotImplemented', 'NotImplementedError', 'OSError', 'OverflowError',
    'PendingDeprecationWarning', 'PermissionError', 'ProcessLookupError',
    'ReferenceError', 'ResourceWarning', 'RuntimeError', 'RuntimeWarning',
    'StopIteration', 'SyntaxError', 'SyntaxWarning', 'SystemError',
    'SystemExit', 'TabError', 'TimeoutError', 'True', 'TypeError',
    'UnboundLocalError', 'UnicodeDecodeError', 'UnicodeEncodeError',
    'UnicodeError', 'UnicodeTranslateError', 'UnicodeWarning', 'UserWarning',
    'ValueError', 'Warning', 'ZeroDivisionError', '_', '__build_class__',
    '__debug__', '__doc__', '__import__', '__loader__', '__name__',
    '__package__', '__spec__', 'abs', 'all', 'any', 'ascii', 'bin', 'bool',
    'bytearray', 'bytes', 'callable', 'chr', 'classmethod', 'compile',
    'complex', 'copyright', 'credits', 'delattr', 'dict', 'dir', 'divmod',
    'enumerate', 'eval', 'exec', 'exit', 'filter', 'float', 'format',
    'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex',
    'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'license',
    'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object',
    'oct', 'open', 'ord', 'pow', 'print', 'property', 'quit', 'range', 'repr',
    'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod',
    'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'
];


Blockly.PythonLang.RESERVED = Blockly.PythonLang.RESERVED_WORDS.concat(
    Blockly.PythonLang.BUILTIN_MODULES).concat(
    Blockly.PythonLang.BUILIN_FUNCTIONS);

Blockly.PythonLang.variableIn = function(variable, variableList) {
    for (var i = 0; i < variableList.length; i++) {
        if (variable == variableList[i].name) {
            return true;
        }
    }
    return false;
};

Blockly.PythonLang.makeNameUnique = function(name, variableList) {
    // Only need to look at new and reserved words once.
    var newName = name;
    if ((Blockly.PythonLang.RESERVED.indexOf(newName) > -1) ||
        (Blockly.PythonLang.variableIn(newName, variableList)) ||
        (Blockly.PythonLang.variableIn(newName, Blockly.PythonLang.NEW_VARS))) {
        var i = 2;
        newName = name + i;
        console.log("NEWNAME adding a ", i, newName);
        while (Blockly.PythonLang.variableIn(newName, variableList)) {
            i = i + 1;
            newName = name + i;
            console.log("NEWNAME adding a", i, newName);
        }
    }
    return newName;
};

Blockly.PythonLang.renameVariableCallback = function(block) {
    return function() {
        Blockly.PythonLang.renameVariable(block.getField("VAR"));
    };
};

Blockly.PythonLang.renameVariable = function(field) {
    function promptName(promptText, defaultText) {
        Blockly.hideChaff();
        var newVar = window.prompt(promptText, defaultText);
        return newVar;
    }
    var workspace = field.sourceBlock_.workspace;
    var oldVar = field.getText();
    var newVar = promptName(Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldVar),
        oldVar);
    if (!newVar || newVar == oldVar) {
        // No change to variable name.
        return null;
    }
    // Strip leading and trailing whitespace.
    newVar = newVar.replace(/^ +| +$/g, '');
    // If now empty ignore change.
    if (!newVar) {
        return null;
    }
    // Replace sequences of symbols with '_'.
    newVar = newVar.replace(/\W+/g, '_');
    // Prepend with '_' if begins with a digit.
    if ('0123456789'.indexOf(newVar[0]) != -1) {
        newVar = '_' + newVar;
    }

    var variables = Blockly.Variables.allVariables(workspace, true, true);
    newVar = Blockly.PythonLang.makeNameUnique(newVar, variables);
    Blockly.Variables.renameVariable(oldVar, newVar, workspace);
    return newVar;
};
