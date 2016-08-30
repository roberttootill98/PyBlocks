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

goog.provide('Blockly.Blocks.pyio');

goog.require('Blockly.Blocks');

Blockly.Blocks['python_input'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("input(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["str", "str"],
    ]);
    this.setOutput(true);
    this.setTooltip('Prompts the user to input a message and returns it');
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
    } else {
      this.holesFilled = false;
    }
  }
};

Blockly.Blocks['python_print'] = {
  init: function() {
    this.appendDummyInput().
      appendField("print(");
    this.appendValueInput("ARG1");
    this.appendDummyInput("CLOSE")
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["any", "none"],
      ["*any", "none"]
    ]);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Prints the given argument to the interpreter');
    this.parameterCount = 1;
    this.hasEndParameter = false;
  },

  customContextMenu: function(options) {
    var optionRemove = {enabled: this.parameterCount > 0};
    optionRemove.text = "Remove parameter";
    optionRemove.callback = Blockly.ContextMenu.removeInputCallback(this);
    var optionAdd = {enabled: true};
    optionAdd.text = "Add parameter";
    optionAdd.callback = Blockly.ContextMenu.addInputCallback(this);
    var optionEnd = {enabled: true};
    optionEnd.text = this.hasEndParameter ?
        'Remove end="..."' : 'Add end="..."';
    optionEnd.callback =
        Blockly.ContextMenu.finalInputCallback(this, this.hasEndParameter);
    options.unshift(optionAdd, optionRemove, optionEnd);
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('parameter_count', this.parameterCount);
    container.setAttribute('has_end_parameter', this.hasEndParameter);
    return container;
  },

  domToMutation: function(xmlElement) {
    var parameters = parseInt(xmlElement.getAttribute('parameter_count'));
    for (var i = 1; i < parameters; i++) {
      this.add();
    }
    if (xmlElement.getAttribute('has_end_parameter') == "true") {
      this.addFinal();
    }
  },

  add: function() {
    this.parameterCount++;
    var inputName = 'ARG' + this.parameterCount;
    var input = this.appendValueInput(inputName);
    if (this.parameterCount == 1 && this.hasEndParameter) {
      this.setFieldValue(", end=", "END_KEYWORD");
    }
    else if (this.parameterCount > 1) {
      input.appendField(", ");
    }
    var length = this.fullTypeVecs.length;
    console.log("PRINTIO before", JSON.stringify(this.fullTypeVecs));
    for (var i = 0; i < length; i++) {
      this.fullTypeVecs[i].splice(this.parameterCount-1, 0, "any");
      var newRow = this.fullTypeVecs[i].slice(0);
      console.log("PRINTIO newrow before", JSON.stringify(newRow));
      newRow[this.parameterCount-1] = "*any";
      console.log("PRINTIO newrow after", JSON.stringify(newRow));
      this.fullTypeVecs.push(newRow);
    }
    console.log("PRINTIO after", JSON.stringify(this.fullTypeVecs), "\n");
    if (this.hasEndParameter) {
      this.moveInputBefore(inputName, "END");
    }
    else {
      this.moveInputBefore(inputName, "CLOSE");
    }
    this.onchange();
  },

  remove: function() {
    this.removeInput('ARG' + this.parameterCount);
    this.parameterCount--;
    if (this.parameterCount == 0 && this.hasEndParameter) {
      this.setFieldValue("end=", "END_KEYWORD");
    }
    console.log("PRINTIO before", JSON.stringify(this.fullTypeVecs));
    var half = Math.pow(2, this.parameterCount);
    this.fullTypeVecs.splice(half, half);
    for (var i = 0; i < half; i++) {
      this.fullTypeVecs[i].splice(this.parameterCount, 1);
    }
    console.log("PRINTIO after", JSON.stringify(this.fullTypeVecs), "\n");
    this.render();
    this.onchange();
  },

  addFinal: function() {
    console.log("PRINTIO before", JSON.stringify(this.fullTypeVecs));
    this.hasEndParameter = true;
    var input = this.appendValueInput("END");
    if (this.parameterCount > 0) {
      input.appendField(", end=", "END_KEYWORD");
    }
    else {
      input.appendField("end=", "END_KEYWORD");
    }
    for (var i = 0; i < this.fullTypeVecs.length; i++) {
      this.fullTypeVecs[i].splice(-1, 0, "str");
    }
    this.moveInputBefore("END", "CLOSE");
    console.log("PRINTIO after", JSON.stringify(this.fullTypeVecs), "\n");
    this.onchange();
  },

  removeFinal: function() {
    this.hasEndParameter = false;
    this.removeInput('END');
    console.log("PRINTIO before", JSON.stringify(this.fullTypeVecs));
    for (var i = 0; i < this.fullTypeVecs.length; i++) {
      this.fullTypeVecs[i].splice(-2, 1);
    }
    console.log("PRINTIO after", JSON.stringify(this.fullTypeVecs), "\n");
    this.onchange();
  },

  onchange: function(ev) {
    var filledCount;
    var filledEnd;

    for (var i = 1, filledCount = 0; i <= this.parameterCount; i++) {
      if (Blockly.Python.valueToCode(this, 'ARG' + i, Blockly.Python.ORDER_NONE) != '') {
        filledCount++;
      }
    }

    if (this.hasEndParameter && Blockly.Python.valueToCode(this, 'END', Blockly.Python.ORDER_NONE) != '') {
      filledEnd = true;
    } else if (!this.hasEndParameter) {
      filledEnd = true;
    } else {
      filledEnd = false;
    }

    if (filledCount == this.parameterCount && filledEnd) {
      this.holesFilled = true;
    } else {
      this.holesFilled = false;
    }

  }
};


Blockly.Blocks['python_format'] = {
  init: function() {
    this.appendValueInput("ARG0");
    this.appendDummyInput().
      appendField(".format(");
    this.appendValueInput("ARG1");
    this.appendDummyInput("CLOSE")
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["str", "int", "str"],
      ["str", "float", "str"],
      ["str", "str", "str"]
    ]);
    this.setOutput(true);
    this.parameterCount = 1;
  },

  customContextMenu: function(options) {
    var optionRemove = {enabled: this.parameterCount > 1};
    optionRemove.text = "Remove parameter";
    optionRemove.callback = Blockly.ContextMenu.removeInputCallback(this);
    var optionAdd = {enabled: true};
    optionAdd.text = "Add parameter";
    optionAdd.callback = Blockly.ContextMenu.addInputCallback(this);
    options.unshift(optionAdd, optionRemove);
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('parameter_count', this.parameterCount);
    return container;
  },

  domToMutation: function(xmlElement) {
    var parameters = parseInt(xmlElement.getAttribute('parameter_count'));
    for (var i = 1; i < parameters; i++) {
      this.add();
  }
},

  add: function() {
    this.parameterCount++;
    var inputName = 'ARG' + this.parameterCount;
    var input = this.appendValueInput(inputName);
    if (this.parameterCount > 1) {
      input.appendField(", ");
    }
    this.fullTypeVecs[0].splice(-1, 0, "any");
    this.moveInputBefore(inputName, "CLOSE");
    this.onchange();
  },

  remove: function() {
    this.removeInput('ARG' + this.parameterCount);
    this.parameterCount--;
    this.fullTypeVecs[0].splice(-2, 1);
    this.render();
    this.onchange();
  },

  onchange: function(ev) {
    var filledCount;

    for (var i = 1, filledCount = 0; i <= this.parameterCount; i++) {
      if (Blockly.Python.valueToCode(this, 'ARG' + i, Blockly.Python.ORDER_NONE) != '') {
        filledCount++;
      }
    }
    if (filledCount == this.parameterCount && Blockly.Python.valueToCode(this, 'ARG0', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
      runtooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Returns a list of elements');
    }

  }
};
