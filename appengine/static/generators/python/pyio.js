/**
* @license
* Visual Blocks Editor
*
* Copyright 2012 Google Inc.
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
* @fileoverview I/O blocks for PythonBlocks
* @author up649230@myport.ac.uk
*/

'use strict';

goog.provide('Blockly.Python.pyio');

goog.require('Blockly.Python');


Blockly.Python['python_input'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['input(' + code + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['python_print'] = function(block) {

  var params;
  var code;

  for (var i = 1, params = block.parameterCount, code = ''; i <= params; i++) {
    if ((params - i == 0 && block.hasEndParameter == false)) {
      code += Blockly.Python.valueToCode(block, 'ARG' + i, Blockly.Python.ORDER_NONE);
    } else {
      code += Blockly.Python.valueToCode(block, 'ARG' + i, Blockly.Python.ORDER_NONE) + ', ';
    }
  }

  if (block.hasEndParameter == true) {
    code += 'end=' + Blockly.Python.valueToCode(block, 'END', Blockly.Python.ORDER_NONE);
  }

  return 'print(' + code + ')\n';
};

Blockly.Python['python_format'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG0', Blockly.Python.ORDER_NONE);

  var params;
  var code;

  for (var i = 1, params = block.parameterCount, code = ''; i <= params; i++) {
    if (params - i == 0) {
      code += Blockly.Python.valueToCode(block, 'ARG' + i, Blockly.Python.ORDER_NONE);
    } else {
      code += Blockly.Python.valueToCode(block, 'ARG' + i, Blockly.Python.ORDER_NONE) + ', ';
    }
  }
  return [block1 + '.format(' + code + ')', Blockly.Python.ORDER_FUNCTION_CALL];
}
