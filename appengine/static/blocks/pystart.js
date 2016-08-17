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
 * @fileoverview Start block for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.pystart');

goog.require('Blockly.Blocks');


Blockly.Blocks['python_start'] = {

  init: function() {
    Blockly.BlockSvg.START_HAT = true;
    this.appendDummyInput()
        .appendField('<<START>>')
    this.setNextStatement(true);
    this.setTooltip('The start block is not a true Python block and is only\
    there to indicate which blocks will be executed when "Run full" is\
    pressed.');
    this.setHelpUrl('http://www.example.com/');
    this.lineCount = 0;
    this.hasMath = false;
    this.hasTurtle = false;
  },

  customContextMenu: function(options) {
    var optionAddMath = {enabled: true};
    optionAddMath.text = "Add/remove import math";
    optionAddMath.callback = Blockly.ContextMenu.modifyMathInputCallback(this);
    var optionAddTurtle = {enabled: true};
    optionAddTurtle.text = "Add/remove import turtle";
    optionAddTurtle.callback = Blockly.ContextMenu.modifyTurtleInputCallback(this);
    options.unshift(optionAddMath, optionAddTurtle);
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('line_count', this.lineCount);
    container.setAttribute('has_maths', this.hasMaths);
    container.setAttribute('has_turtle', this.hasTurtle);
    return container;
  },

  domToMutation: function(xmlElement) {
    var lines = parseInt(xmlElement.getAttribute('line_count'));

    if (xmlElement.getAttribute('has_maths')) {
      this.modify('maths', 'add');
    }

    if (xmlElement.getAttribute('has_turtle')) {
      this.modify('turtle', 'add');
    }
  },

  modify: function(importName, op) {
    if (op == 'add') {
      this.lineCount++;
      this.appendDummyInput(importName)
      .appendField('import ' + importName);
    } else {
      this.lineCount--;
      this.removeInput(importName);
    }
  }

};
