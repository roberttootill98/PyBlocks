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

goog.provide('Blockly.Blocks.pynumeric');

goog.require('Blockly.Blocks');

Blockly.Blocks['python_int_const'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("42"), "VALUE");
    this.setInputsInline(true);
    this.setTypeVecs([["int"]]);
    this.setOutput(true);
    this.setTooltip(this.getFieldValue('VALUE'));
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_float_const'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("3.14"), "VALUE");
    this.setInputsInline(true);
    this.setTypeVecs([["float"]]);
    this.setOutput(true);
    this.setTooltip(this.getFieldValue('VALUE'));
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_plus'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" + ");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int", "int"],
      ["float", "int", "float"],
      ["int", "float", "float"],
      ["float", "float", "float"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: function(ev) {
    var test = (Blockly.Python.valueToCode(this, 'LHS', Blockly.Python.ORDER_ATOMIC) || '0') +
  (Blockly.Python.valueToCode(this, 'RHS', Blockly.Python.ORDER_ATOMIC) || '0');
    this.setTooltip(test);
  }
};

Blockly.Blocks['python_minus'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" - ");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int", "int"],
      ["float", "int", "float"],
      ["int", "float", "float"],
      ["float", "float", "float"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_multiply'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" * ");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int", "int"],
      ["float", "int", "float"],
      ["int", "float", "float"],
      ["float", "float", "float"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_divide'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" / ");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int", "float"],
      ["float", "int", "float"],
      ["int", "float", "float"],
      ["float", "float", "float"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_pow_op'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" ** ");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int", "int"],
      ["float", "int", "float"],
      ["int", "float", "float"],
      ["float", "float", "float"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_unary_minus'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("-");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int"],
      ["float", "float"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_abs'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("abs(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int"],
      ["float", "float"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_round'] = {
  init: function() {
    this.appendValueInput("ARG")
        .setCheck(["int"])
        .appendField("round(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["float", "int"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_pow'] = {
  init: function() {
    this.appendValueInput("ARG1")
        .appendField("pow(");
    this.appendValueInput("ARG2")
        .appendField(", ");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int", "int"],
      ["int", "int", "float"],
      ["float", "int", "float"],
      ["int", "float", "float"],
      ["float", "float", "float"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_numeric_min'] = {
  init: function() {
    this.appendValueInput("ARG1")
        .appendField("min(");
    this.appendValueInput("ARG2")
        .appendField(", ");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int", "int"],
      ["float", "float", "float"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_numeric_max'] = {
  init: function() {
    this.appendValueInput("ARG1")
        .appendField("max(");
    this.appendValueInput("ARG2")
        .appendField(", ");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "int", "int"],
      ["float", "float", "float"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_sum'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("sum(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*int", "int"],
      ["*float", "float"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
