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

goog.provide('Blockly.Blocks.python');

goog.require('Blockly.Blocks');

Blockly.Blocks['python_intvar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("item"), "PYTHON_INT_VAR");
    this.setOutput(true, "int");
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_string'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("\" \""), "PYTHON_STR");
    this.setInputsInline(true);
    this.setOutput(true, "str");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_string_www'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("Wg\"wTpwW"), "PYTHON_STR");
    this.setInputsInline(true);
    this.setOutput(true, "str");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_int'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("42"), "PYTHON_INT");
    this.setInputsInline(true);
    this.setOutput(true, "int");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_equals'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck(null);
    this.appendValueInput("NAME")
        .appendField(" == ");
    this.setInputsInline(true);
    this.setOutput(true, "bool");
    this.setColour(232);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_while'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("while ");
    this.appendDummyInput()
        .appendField(":");
    this.appendStatementInput("NAME");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(210);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_wwww'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("WWW");
    this.appendDummyInput()
        .appendField("W");
    this.appendStatementInput("NAME");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(210);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_for'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("for ");
    this.appendValueInput("NAME")
        .setCheck(["String", "Array"])
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldVariable("item"), "NAME")
        .appendField(" in ");
    this.appendDummyInput()
        .appendField(":");
    this.appendStatementInput("NAME");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(210);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_pow'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("Number")
        .appendField("pow(");
    this.appendValueInput("NAME")
        .setCheck("Number")
        .appendField(", ");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setOutput(true, "float");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_abs'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("Number")
        .appendField("abs(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setOutput(true, "float");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_print'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("Number")
        .appendField("print(");
    this.appendValueInput("NAME")
        .setCheck("Number")
        .appendField(", ");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_assign'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("item"), "NAME");
    this.appendValueInput("NAME")
        .setCheck("Number")
        .appendField(" = ");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
