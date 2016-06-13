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

Blockly.Blocks['python_assign_float_list'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("item"), "LHS");
    this.appendValueInput("RHS")
        .setCheck(["float"])
        .appendField(" = ");
    this.appendDummyInput()
        .appendField(" ");
    this.setTypeVecs([
      ["*float", "none"]
    ]);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_assign_num_list'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("item"), "LHS");
    this.appendValueInput("RHS")
        .setCheck(["float"])
        .appendField(" = ");
    this.appendDummyInput()
        .appendField(" ");
    this.setTypeVecs([
      ["*int", "none"], ["*float", "none"]
    ]);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};



Blockly.Blocks['python_intvar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("item"), "NAME");
    this.setOutput(true, "int");
    this.setTypeVecs([["int"]]);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_string'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("\" \""), "VALUE");
    this.setInputsInline(true);
    this.setTypeVecs([["str"]]);
    this.setOutput(true, "str");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_int'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("42"), "VALUE");
    this.setInputsInline(true);
    this.setTypeVecs([["int"]]);
    this.setOutput(true, "int");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_float'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("3.14"), "VALUE");
    this.setInputsInline(true);
    this.setTypeVecs([["float"]]);
    this.setOutput(true, "float");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_equals'] = {
  init: function() {
    this.appendValueInput("LHS")
        .setCheck(null);
    this.appendValueInput("RHS")
        .appendField(" == ")
        .setCheck(null);
    this.setInputsInline(true);
    this.setTypeVecs([
      ["any", "any", "bool"],
      ["*any", "any", "bool"],
      ["any", "*any", "bool"],
      ["*any", "*any", "bool"]
    ]);
    this.setOutput(true, "bool");
    this.setColour(232);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_plus'] = {
  init: function() {
    this.appendValueInput("LHS")
        .setCheck(null);
    this.appendValueInput("RHS")
        .appendField(" + ")
        .setCheck(null);
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int", "int"],
      ["float", "int", "float"],
      ["int", "float", "float"],
      ["float", "float", "float"]
    ]);
    this.setOutput(true, "bool");
    this.setColour(232);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};


Blockly.Blocks['python_divide'] = {
  init: function() {
    this.appendValueInput("LHS")
        .setCheck(["int", "float"]);
    this.appendValueInput("RHS")
        .appendField(" / ")
        .setCheck(["int", "float"]);
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int", "float"],
      ["float", "int", "float"],
      ["int", "float", "float"],
      ["float", "float", "float"]
    ]);
    this.setOutput(true, "float");
    this.setColour(232);
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
    this.setColour(210);
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
    this.setColour(210);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_pow'] = {
  init: function() {
    this.appendValueInput("ARG2")
        .setCheck(["int"])
        .appendField("pow(");
    this.appendValueInput("ARG2")
        .setCheck(["int"])
        .appendField(", ");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int", "int"],
      ["int", "float", "float"],
      ["float", "int", "float"],
      ["float", "float", "float"]
    ]);
    this.setOutput(true, "int");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_list_index'] = {
  init: function() {
    this.appendValueInput("ARG2")
        .setCheck(["int"]);
    this.appendValueInput("ARG2")
        .setCheck(["int"])
        .appendField("[");
    this.appendDummyInput()
        .appendField("]");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "int", "matching"],
    ]);
    this.setOutput(true, "int");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_list_const'] = {
  init: function() {
    this.appendValueInput("ARG2")
        .setCheck(["int"])
        .appendField("[");
    this.appendDummyInput()
        .appendField("]");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["matching", "*matching"],
    ]);
    this.setOutput(true, "int");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_abs'] = {
  init: function() {
    this.appendValueInput("ARG")
        .setCheck(["int"])
        .appendField("abs(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int"],
      ["float", "float"]
    ]);
    this.setOutput(true, "int");
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_print'] = {
  init: function() {
    this.appendValueInput("ARG1")
        .setCheck(null)
        .appendField("print(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["any", "none"],
      ["*any", "none"]
    ]);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_assign_int'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("item"), "LHS");
    this.appendValueInput("RHS")
        .setCheck(["int"])
        .appendField(" = ");
    this.appendDummyInput()
        .appendField(" ");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "none"]
    ]);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_assign_float'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("item"), "LHS");
    this.appendValueInput("RHS")
        .setCheck(["float"])
        .appendField(" = ");
    this.appendDummyInput()
        .appendField(" ");
    this.setTypeVecs([
      ["float", "none"]
    ]);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
