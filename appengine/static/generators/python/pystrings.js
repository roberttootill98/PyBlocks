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
  * @fileoverview String blocks for PythonBlocks
  * @author up649230@myport.ac.uk
  */
  
'use strict';

goog.provide('Blockly.Python.pystrings');

goog.require('Blockly.Python');

Blockly.Python['python_string_const'] = function(block) {
  var code = "'" + block.getFieldValue('VALUE').slice(1, -1) + "'";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_string_concat'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);

  return ['(' + block1 + " + " + block2 + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_string_repeat'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);

  return [block1 + ' * ' + block2, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_string_index'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  return [block1 + '[' + block2 + ']', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_string_slice12'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  var block3 = Blockly.Python.valueToCode(block, 'ARG3', Blockly.Python.ORDER_NONE);
  return [block1 + '[' + block2 + ':' + block3 + ']', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_string_slice1'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  return [block1 + '[' + block2 + ':' + ']', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_string_slice2'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  return [block1 + '[' + ':' + block2 + ']', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_string_len'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  return ['len(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_string_in'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);
  return [block1 + ' in ' + block2, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_isdigit'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return [code + '.isdigit()', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_isalpha'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return [code + '.isalpha()', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_isspace'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return [code + '.isspace()', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_lower'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return [code + '.islower()', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_upper'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return [code + '.isupper()', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_find'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);
  return [block1 + '.find(' + block2 + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_index_method'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);
  return [block1 + '.index(' + block2 + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_string_count'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);
  return [block1 + '.count(' + block2 + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_split'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return [code + '.split()', Blockly.Python.ORDER_ATOMIC];
};
