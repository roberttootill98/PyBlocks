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
  * @fileoverview Comparison blocks for PythonBlocks
  * @author up649230@myport.ac.uk
  */

'use strict';

goog.provide('Blockly.Python.pycomparisons');

goog.require('Blockly.Python');

Blockly.Python['python_equals'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);

  return [block1 + " == " + block2, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_not_equals'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);

  return [block1 + " != " + block2, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_is'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);

  return [block1 + " is " + block2, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_less_than'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);

  return [block1 + " < " + block2, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_less_than_or_equal'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);

  return [block1 + " <= " + block2, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_greater_than'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);

  return [block1 + " > " + block2, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_greater_than_or_equal'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_NONE);

  return [block1 + " > " + block2, Blockly.Python.ORDER_ATOMIC];
};
