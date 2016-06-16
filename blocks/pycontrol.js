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

goog.provide('Blockly.Blocks.pycontrol');

goog.require('Blockly.Blocks');

Blockly.Blocks['python_if'] = {
  init: function() {
    this.appendValueInput("CONDITION")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("if ")
        .setCheck(["bool"]);
    this.appendDummyInput()
        .appendField(":");
    this.appendStatementInput("BODY");
    this.setInputsInline(true);
    this.setTypeVecs([["bool", "none"]]);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_while'] = {
  init: function() {
    this.appendValueInput("CONDITION")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("while ")
        .setCheck(["bool"]);
    this.appendDummyInput()
        .appendField(":");
    this.appendStatementInput("BODY");
    this.setInputsInline(true);
    this.setTypeVecs([["bool", "none"]]);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_for'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("for ");
    this.appendValueInput("LOOPVAR")
        .setCheck(["str"])
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldVariable("item"), "SEQUENCE")
        .appendField(" in ")
        .setCheck(["str"]);
    this.appendDummyInput()
        .appendField(":");
    this.appendStatementInput("BODY");
    this.setInputsInline(true);
    this.setTypeVecs([["*any", "none"], ["range", "none"], ["str", "none"]]);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_range1'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("range(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "range"],
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_range2'] = {
  init: function() {
    this.appendValueInput("ARG1")
        .appendField("range(");
    this.appendValueInput("ARG2")
        .appendField(", ");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int", "range"],
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_range3'] = {
  init: function() {
    this.appendValueInput("ARG1")
        .appendField("range(");
    this.appendValueInput("ARG2")
        .appendField(", ");
    this.appendValueInput("ARG3")
        .appendField(", ");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int", "int", "range"],
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
