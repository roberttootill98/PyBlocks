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
 * @fileoverview Boolean blocks for PythonBlocks
 * @author up649230@myport.ac.uk
 */
'use strict';

goog.provide('Blockly.Python.pybooleans');

goog.require('Blockly.Python');

Blockly.Python['python_true'] = function(block) {
    return ['True', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_false'] = function(block) {
    var code = block.getFieldValue('False');
    return ['False', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_and'] = function(block) {
    var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_LOGICAL_AND);
    var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_LOGICAL_AND);
    return [block1 + ' and ' + block2, Blockly.Python.ORDER_LOGICAL_AND];
};

Blockly.Python['python_or'] = function(block) {
    var block1 = Blockly.Python.valueToCode(block, 'LHS', Blockly.Python.ORDER_LOGICAL_OR);
    var block2 = Blockly.Python.valueToCode(block, 'RHS', Blockly.Python.ORDER_LOGICAL_OR);
    return [block1 + ' or ' + block2, Blockly.Python.ORDER_LOGICAL_OR];
};

Blockly.Python['python_not'] = function(block) {
    var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_LOGICAL_NOT);
    return ['not ' + code, Blockly.Python.ORDER_LOGICAL_NOT];
};
