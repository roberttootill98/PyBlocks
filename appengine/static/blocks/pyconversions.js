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

goog.provide('Blockly.Blocks.pyconversions');

goog.require('Blockly.Blocks');

Blockly.Blocks['python_int'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("int(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["str", "int"],
      ["float", "int"]
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
      runtooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Converts a string or floating point number to an integer and returns it');
    }
  }
};

Blockly.Blocks['python_float'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("float(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["str", "float"],
      ["int", "float"]
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
      runtooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Converts a string or integer to a floating point number and returns it');
    }
  }
};

Blockly.Blocks['python_str'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("str(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "str"],
      ["float", "str"]
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
      runtooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Converts an integer or floating point number to a string and returns it');
    }
  }
};

Blockly.Blocks['python_bool'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("bool(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["any", "bool"],
      ["*any", "bool"]
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
      runtooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Converts any type to a boolean and returns it');
    }
  }
};

Blockly.Blocks['python_chr'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("chr(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["int", "str"]
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
      runtooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Returns a string of one character respective to the specified ASCII code');
    }
  }
};

Blockly.Blocks['python_ord'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("ord(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["str", "int"]
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
      runtooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('When given a string of one character, returns the characters ASCII code');
    }
  }
};
