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
 * @fileoverview Conversion blocks for PythonBlocks
 * @author up649230@myport.ac.uk
 */

'use strict';

goog.provide('Blockly.Python.pyconversions');

goog.require('Blockly.Python');

Blockly.Python['python_int'] = function(block) {
    var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
    return ['int(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_float'] = function(block) {
    var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
    return ['float(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_str'] = function(block) {
    var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
    return ['str(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_bool'] = function(block) {
    var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
    return ['bool(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_chr'] = function(block) {
    var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
    return ['chr(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_ord'] = function(block) {
    var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
    return ['ord(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_type'] = function(block) {
    var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
    return ['type(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};
