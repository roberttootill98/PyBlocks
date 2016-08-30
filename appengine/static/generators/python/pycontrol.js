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
  * @fileoverview Control blocks for PythonBlocks
  * @author up649230@myport.ac.uk
  */

'use strict';

goog.provide('Blockly.Python.pycontrol');

goog.require('Blockly.Python');

Blockly.Python['python_if'] = function(block) {

  var code;
  var elifs;

  code = 'if ' + Blockly.Python.valueToCode(block, 'CONDITION0', Blockly.Python.ORDER_NONE) + ':\n' + (Blockly.Python.statementToCode(block, 'BODY0') || Blockly.Python.PASS + '\n');

  for (var i = 1, elifs = block.elifCount; i <= elifs; i++) {
    code += 'elif ' + Blockly.Python.valueToCode(block, 'COND' + i, Blockly.Python.ORDER_NONE) + ':\n' + (Blockly.Python.statementToCode(block, 'BODY' + i) || Blockly.Python.PASS + '\n');
  }

  if (block.hasElse) {
    code += 'else:\n' + (Blockly.Python.statementToCode(block, 'ELSE_BODY') || Blockly.Python.PASS + '\n');
  }

  return code;
};

Blockly.Python['python_while'] = function(block) {
  var condition = Blockly.Python.valueToCode(block, 'CONDITION', Blockly.Python.ORDER_NONE);
  var branch = Blockly.Python.statementToCode(block, 'BODY') || Blockly.Python.PASS;
  var code = 'while ' + condition + ':\n' + branch;

  return code;
};

Blockly.Python['python_for'] = function(block) {
  var loopvar = Blockly.Python.valueToCode(block, 'LOOPVAR', Blockly.Python.ORDER_NONE);
  var sequence = Blockly.Python.valueToCode(block, 'SEQUENCE', Blockly.Python.ORDER_NONE);
  var body = Blockly.Python.statementToCode(block, 'BODY') || Blockly.Python.PASS;
  var code = 'for ' + loopvar + ' in ' + sequence + ':\n' + body;

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
