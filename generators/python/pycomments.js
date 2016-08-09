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

goog.provide('Blockly.Python.pycomments');

goog.require('Blockly.Python');


Blockly.Python['python_linespace'] = function(block) {
  return ['\n', Blockly.Python.ORDER_ATOMIC];
};

// Blockly.Python['python_print'] = function(block) {
//   var code = Blockly.Python.getFieldValue(block, 'ARG1');
//   //for (i = 1, params = block.parameterCount; i > params; i++) {
//     //code += Blockly.Python.valueToCode(block, 'ARG' + i, Blockly.Python.ORDER_NONE);
//
//   //  console.log()
// //  }
// //console.log(block.parameterCount + ' parameter');
//   return ['print(' + code + ')', Blockly.Python.ORDER_ATOMIC];
// };
