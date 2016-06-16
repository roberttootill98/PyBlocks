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

goog.provide('Blockly.Blocks.pybooleans');

goog.require('Blockly.Blocks');

Blockly.Blocks['python_true'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("True");
    this.setTypeVecs([
      ["bool"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_false'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("False");
    this.setTypeVecs([
      ["bool"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_and'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" and ");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["bool", "bool", "bool"],
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_or'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" or ");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["bool", "bool", "bool"],
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_not'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("not ");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["bool", "bool"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
