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

goog.provide('Blockly.Python.pycontrol');

goog.require('Blockly.Python');

Blockly.Python['python_if'] = function(block) {
  var condition = Blockly.Python.valueToCode(block, 'CONDITION', Blockly.Python.ORDER_NONE);
  var branch = Blockly.Python.statementToCode(block, 'BODY') || Blockly.Python.PASS;
  var code = 'if ' + condition + ':\n' + branch;

  return code;
};

Blockly.Python['python_while'] = function(block) {
  var condition = Blockly.Python.valueToCode(block, 'CONDITION', Blockly.Python.ORDER_NONE);
  var branch = Blockly.Python.statementToCode(block, 'BODY') || Blockly.Python.PASS;
  var code = 'while ' + condition + ':\n' + branch;

  return code;
};

Blockly.Python['python_for'] = function(block) {
  var condition = Blockly.Python.valueToCode(block, 'CONDITION', Blockly.Python.ORDER_NONE);
  var branch = Blockly.Python.statementToCode(block, 'BODY') || Blockly.Python.PASS;
  var code = 'for ' + condition + ':\n' + branch;

  return code;
};

Blockly.Python['python_range1'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);

};

Blockly.Python['python_range2'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  return ['range(' + block1 + ', ' + block2 +  ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_range3'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  var block3 = Blockly.Python.valueToCode(block, 'ARG3', Blockly.Python.ORDER_NONE);
  return ['range(' + block1 + ', ' + block2 + ', ' + block3 + ')', Blockly.Python.ORDER_ATOMIC];
};
