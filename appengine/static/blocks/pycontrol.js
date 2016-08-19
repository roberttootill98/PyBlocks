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
    this.appendValueInput("CONDITION0")
        .appendField("if ");
    this.appendDummyInput()
        .appendField(":");
    this.appendStatementInput("BODY0");
    this.setInputsInline(true);
    this.setTypeVecs([["bool", "none"]]);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('If a specified boolean evaluates to true, the following code is executed. Additional if statements can be added and a catch-all else statement can be added to the end');
    this.setHelpUrl('http://www.example.com/');
    this.elifCount = 0;
    this.hasElse = false;
  },

  customContextMenu: function(options) {
    var optionRemove = {enabled: this.elifCount > 0};
    optionRemove.text = "Remove elif clause";
    optionRemove.callback = Blockly.ContextMenu.removeInputCallback(this);
    var optionAdd = {enabled: true};
    optionAdd.text = "Add elif clause";
    optionAdd.callback = Blockly.ContextMenu.addInputCallback(this);
    var optionElse = {enabled: true};
    optionElse.text = this.hasElse ?
        'Remove else clause' : 'Add else clause';
    optionElse.callback =
        Blockly.ContextMenu.finalInputCallback(this, this.hasElse);
    options.unshift(optionAdd, optionRemove, optionElse);
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('elif_count', this.elifCount);
    container.setAttribute('has_else_clause', this.hasElse);
    return container;
  },

  domToMutation: function(xmlElement) {
    var elifs = parseInt(xmlElement.getAttribute('elif_count'));
    for (var i = 0; i < elifs; i++) {
      this.add();
    }
    if (xmlElement.getAttribute('has_else_clause') == "true") {
      this.addFinal();
    }
  },

  add: function() {
    this.elifCount++;
    var conditionName = "COND" + this.elifCount;
    this.appendValueInput(conditionName)
        .appendField("elif ");
    var colonName = "COLON" + this.elifCount;
    this.appendDummyInput(colonName)
        .appendField(":");
    var bodyName = 'BODY' + this.elifCount;
    this.appendStatementInput(bodyName);
    this.fullTypeVecs[0].unshift("bool");
    console.log("IFSTMT ", this.fullTypeVecs);
    if (this.hasElse) {

      this.moveInputBefore(conditionName, "ELSE");
      this.moveInputBefore(colonName, "ELSE");
      this.moveInputBefore(bodyName, "ELSE");
    }
    this.render();
  },

  remove: function() {
    this.removeInput('COND' + this.elifCount);
    this.removeInput('COLON' + this.elifCount);
    this.removeInput('BODY' + this.elifCount);
    this.elifCount--;
    this.fullTypeVecs[0].splice(0, 1);
    this.render();
  },

  addFinal: function() {
    this.hasElse= true;
    this.appendDummyInput("ELSE")
        .appendField("else:  ");  // two space hack for nice space for notch
    this.appendStatementInput("ELSE_BODY");
  },

  removeFinal: function() {
    this.hasElse = false;
    this.removeInput('ELSE_BODY');
    this.removeInput('ELSE');
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
    this.setTooltip('While the specified boolean evaluates to true, the following code is executed in a loop');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['python_for'] = {
  init: function() {
    this.appendValueInput("LOOPVAR")
        .appendField("for ")
    this.appendValueInput("SEQUENCE")
        .appendField(" in ")
    this.appendDummyInput()
        .appendField(":");
    this.appendStatementInput("BODY");
    this.setInputsInline(true);
    this.setTypeVecs([["matching", "*matching", "none"],
                      ["int", "range", "none"],
                      ["str", "str", "none"]]);
    this.setLhsVarOnly(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('A loop used to repeat a piece of code n number of times, typically using range() to specify how many times to loop the code');
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
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG1', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
      runtooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
    this.setTooltip('Generates an iterable list of numbers from 0 to the specified integer number');
    }
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
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG1', Blockly.Python.ORDER_NONE) != '' &&  Blockly.Python.valueToCode(this, 'ARG2', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
      runtooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
    this.setTooltip('Returns an iterable list of numbers from and to the specified integer numbers');
    }
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
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG1', Blockly.Python.ORDER_NONE) != '' &&  Blockly.Python.valueToCode(this, 'ARG2', Blockly.Python.ORDER_NONE) != '' &&  Blockly.Python.valueToCode(this, 'ARG3', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
      runtooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
    this.setTooltip('Generates an iterable list of numbers from and to the specified integer numbers with a specified number of gaps inbetween');
    }
  }
};
