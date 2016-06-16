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

goog.provide('Blockly.Blocks.pycomparisons');

goog.require('Blockly.Blocks');

Blockly.Blocks['python_equals'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" == ") ;
    this.setInputsInline(true);
    this.setTypeVecs([
      ["any", "any", "bool"],
      ["*any", "any", "bool"],
      ["any", "*any", "bool"],
      ["*any", "*any", "bool"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_less_than'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" < ") ;
    this.setInputsInline(true);
    this.setTypeVecs([
      ["any", "any", "bool"],
      ["*any", "any", "bool"],
      ["any", "*any", "bool"],
      ["*any", "*any", "bool"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_less_than_or_equal'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" <= ") ;
    this.setInputsInline(true);
    this.setTypeVecs([
      ["any", "any", "bool"],
      ["*any", "any", "bool"],
      ["any", "*any", "bool"],
      ["*any", "*any", "bool"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_greater_than'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" > ") ;
    this.setInputsInline(true);
    this.setTypeVecs([
      ["any", "any", "bool"],
      ["*any", "any", "bool"],
      ["any", "*any", "bool"],
      ["*any", "*any", "bool"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_greater_than_or_equal'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" >= ") ;
    this.setInputsInline(true);
    this.setTypeVecs([
      ["any", "any", "bool"],
      ["*any", "any", "bool"],
      ["any", "*any", "bool"],
      ["*any", "*any", "bool"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_is'] = {
  init: function() {
    this.appendValueInput("LHS");
    this.appendValueInput("RHS")
        .appendField(" is ") ;
    this.setInputsInline(true);
    this.setTypeVecs([
      ["any", "any", "bool"],
      ["*any", "any", "bool"],
      ["any", "*any", "bool"],
      ["*any", "*any", "bool"]
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
