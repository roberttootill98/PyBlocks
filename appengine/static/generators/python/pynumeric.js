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
 * @fileoverview Variable blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Python.pynumeric');

goog.require('Blockly.Python');

Blockly.Python['python_int_const'] = function(block) {
  var code = block.getFieldValue('VALUE');
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_float_const'] = function(block) {
  var code = block.getFieldValue('VALUE');
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_plus'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);
  return [block1 + ' + ' + block2, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_minus'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);
  return [block1 + ' - ' + block2, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_multiply'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);
  return [block1 + ' * ' + block2, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_divide'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);
  return [block1 + ' / ' + block2, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_pow_op'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);
  return [block1 + ' ** ' + block2, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_unary_minus'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['-' + code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_round'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['round(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_abs'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['abs(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_pow'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  return ['pow(' + block1 + ', ' + block2 + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_numeric_min'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  return ['min(' + block1 + ', ' + block2 + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_numeric_max'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  return ['max(' + block1 + ', ' + block2 + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_sum'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['sum(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};
