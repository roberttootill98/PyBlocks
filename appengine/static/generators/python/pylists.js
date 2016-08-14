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
  * @fileoverview List blocks for PythonBlocks
  * @author up649230@myport.ac.uk
  */

'use strict';

goog.provide('Blockly.Python.pylists');

goog.require('Blockly.Python');

Blockly.Python['python_list_empty'] = function(block) {
  return ['[]', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_list_const'] = function(block) {
  var params;
  var code;

  for (var i = 1, params = block.parameterCount, code = ''; i <= params; i++) {
    if (params - i == 0) {
      code += Blockly.Python.valueToCode(block, 'ARG' + i, Blockly.Python.ORDER_MEMBER);
    } else {
      code += Blockly.Python.valueToCode(block, 'ARG' + i, Blockly.Python.ORDER_MEMBER) + ', ';
    }
  }

  return ['[' + code + ']', Blockly.Python.ORDER_MEMBER];
};


Blockly.Python['python_list_concat'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);

  return [block1 + ' + ' + block2, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_list_repeat'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_MULTIPLICATIVE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_MULTIPLICATIVE);

  return [block1 + ' * ' + block2, Blockly.Python.ORDER_MULTIPLICATIVE];
};

Blockly.Python['python_list_index'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_MEMBER);

  return [block1 + '[' + block2 + ']', Blockly.Python.ORDER_MEMBER];
};

Blockly.Python['python_list_slice12'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_MEMBER);
  var block3 = Blockly.Python.valueToCode(block, 'ARG3', Blockly.Python.ORDER_MEMBER);

  return [block1 + '[' + block2 + ':' + block3 + ']', Blockly.Python.ORDER_MEMBER];
};

Blockly.Python['python_list_slice1'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_MEMBER);

  return [block1 + '[' + block2 + ':]', Blockly.Python.ORDER_MEMBER];
};

Blockly.Python['python_list_slice2'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_MEMBER);

  return [block1 + '[:' + block2 + ']', Blockly.Python.ORDER_MEMBER];
};

Blockly.Python['python_list_len'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);

  return ['len(' + code + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['python_list_in'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_RELATIONAL);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_RELATIONAL);

  return [block1 + ' in ' + block2, Blockly.Python.ORDER_RELATIONAL];
};

Blockly.Python['python_list_min'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);

  return ['min(' + code + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['python_list_max'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);

  return ['max(' + code + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['python_sorted'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);

  return ['sorted(' + code + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['python_append'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_MEMBER);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);

  return block1 + '.append(' + block2 + ')\n';
};

Blockly.Python['python_list_item_modify'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_MEMBER);
  var block3 = Blockly.Python.valueToCode(block, 'ARG3', Blockly.Python.ORDER_NONE);

  return block1 + '[' + block2 + '] = ' + block3 + '\n';
};

Blockly.Python['python_extend'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_MEMBER);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);

  return block1 + '.extend(' + block2 + ')\n';
};

Blockly.Python['python_insert'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_MEMBER);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  var block3 = Blockly.Python.valueToCode(block, 'ARG3', Blockly.Python.ORDER_NONE);

  return block1 + '.insert(' + block2 + ', ' + block3 + ')\n';
};

Blockly.Python['python_pop'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_MEMBER);

  return [code + '.pop()', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python['python_pop_statement'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_MEMBER);

  return code + '.pop()\n';
};

Blockly.Python['python_remove'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_MEMBER);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);

  return block1 + '.remove(' + block2 + ')\n';
};

Blockly.Python['python_reverse'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_MEMBER);

  return code + '.reverse()\n';
};

Blockly.Python['python_sort'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_MEMBER);

  return code + '.sort()\n';
};

Blockly.Python['python_list_index_method'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_MEMBER);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);

  return [block1 + '.index(' + block2 + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};
