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

goog.provide('Blockly.Python.pyvars');

goog.require('Blockly.Python');


Blockly.Python['variables_set'] = function(block) {
  var variable = Blockly.Python.getFieldValue(block, 'VAR', Blockly.Python.ORDER_NONE);
  var value = Blockly.Python.getFieldValue(block, 'VALUE', Blockly.Python.ORDER_NONE);
  return [variable + ' = ' + value, Blockly.Python.ORDER_ATOMIC];
};


// Blockly.Python['python_print2'] = function(block) {
//   var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
//   var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
//   return 'print(' + block1 + ', ' + block2 + ')';
// };
