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

goog.provide('Blockly.Blocks.pylists');

goog.require('Blockly.Blocks');

Blockly.Blocks['python_list_empty'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("[]");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching"],
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_list_const'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("[");
    this.appendDummyInput()
        .appendField("]");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["matching", "*matching"],
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_list_const2'] = {
  init: function() {
    this.appendValueInput("ARG1")
        .appendField("[");
    this.appendValueInput("ARG2")
        .appendField(", ");
    this.appendDummyInput()
        .appendField("]");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["matching", "matching", "*matching"],
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_list_const3'] = {
  init: function() {
    this.appendValueInput("ARG1")
        .appendField("[");
    this.appendValueInput("ARG2")
        .appendField(", ");
    this.appendValueInput("ARG3")
        .appendField(", ");
    this.appendDummyInput()
        .appendField("]");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["matching", "matching", "matching", "*matching"],
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};


Blockly.Blocks['python_list_concat'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" + ");
    this.setInputsInline(true);
    this.setTypeVecs([["*matching", "*matching", "*matching"]]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_list_repeat'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" * ");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "int", "*matching"],
      ["int", "*matching", "*matching"],
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_list_index'] = {
  init: function() {
    this.appendValueInput("ARG1");
    this.appendValueInput("ARG2")
        .appendField("[");
    this.appendDummyInput()
        .appendField("]");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "int", "matching"],
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_list_slice12'] = {
  init: function() {
    this.appendValueInput("ARG1");
    this.appendValueInput("ARG2")
        .appendField("[");
    this.appendValueInput("ARG3")
        .appendField(":");
    this.appendDummyInput()
        .appendField("]");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "int", "int", "*matching"],
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_list_slice1'] = {
  init: function() {
    this.appendValueInput("ARG1");
    this.appendValueInput("ARG2")
        .appendField("[");
    this.appendDummyInput()
        .appendField(":");
    this.appendDummyInput()
        .appendField("]");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "int", "*matching"],
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_list_slice2'] = {
  init: function() {
    this.appendValueInput("ARG1");
    this.appendDummyInput()
        .appendField("[");
    this.appendValueInput("ARG2")
        .appendField(":");
    this.appendDummyInput()
        .appendField("]");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "int", "*matching"],
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_list_len'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("len(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*any", "int"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_list_in'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" in ");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["matching", "*matching", "bool"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_list_min'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("min(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "matching"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_list_max'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("max(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "matching"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_sorted'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("sorted(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "*matching"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_append'] = {
  init: function() {
    this.appendValueInput("ARG1");
    this.appendValueInput("ARG2")
        .appendField(".append(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "matching", "none"]
    ]);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_extend'] = {
  init: function() {
    this.appendValueInput("ARG1");
    this.appendValueInput("ARG2")
        .appendField(".extend(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "*matching", "none"]
    ]);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_insert'] = {
  init: function() {
    this.appendValueInput("ARG1");
    this.appendValueInput("ARG2")
        .appendField(".insert(");
    this.appendValueInput("ARG3")
        .appendField(", ");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "matching", "int", "none"]
    ]);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_pop'] = {
  init: function() {
    this.appendValueInput("ARG");
    this.appendDummyInput()
        .appendField(".pop()");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "matching"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_pop_statement'] = {
  init: function() {
    this.appendValueInput("ARG");
    this.appendDummyInput()
        .appendField(".pop()");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*any", "none"]
    ]);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_remove'] = {
  init: function() {
    this.appendValueInput("ARG1");
    this.appendValueInput("ARG2")
        .appendField(".remove(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "matching", "none"]
    ]);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_reverse'] = {
  init: function() {
    this.appendValueInput("ARG");
    this.appendDummyInput()
        .appendField(".reverse()");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*any", "none"]
    ]);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_sort'] = {
  init: function() {
    this.appendValueInput("ARG");
    this.appendDummyInput()
        .appendField(".sort()");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*any", "none"]
    ]);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_list_index_method'] = {
  init: function() {
    this.appendValueInput("ARG1");
    this.appendValueInput("ARG2")
        .appendField(".index(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "matching", "int"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
