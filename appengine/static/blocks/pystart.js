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
    this.appendDummyInput();
    this.setNextStatement(true);
    this.setTooltip('The start block is not a true Python block and is only\
    there to indicate which blocks will be executed when "Run full" is\
    pressed.');
    this.setHelpUrl('http://www.example.com/');
    this.imports = [];
  },

  customContextMenu: function(options) {
    var optionMath = {enabled: true};
    optionMath.text = "Add/remove import math";
    optionMath.callback = Blockly.ContextMenu.modifyMathInputCallback(this);
    var optionTurtle = {enabled: true};
    optionTurtle.text = "Add/remove import turtle";
    optionTurtle.callback = Blockly.ContextMenu.modifyTurtleInputCallback(this);
    options.unshift(optionMath, optionTurtle);
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('imports', this.imports);
    return container;
  },

  domToMutation: function(xmlElement) {
    var dImports = xmlElement.getAttribute('imports').split(',')
    if (dImports[0] != '') {
      for (var i = 0; i < dImports.length; i++) {
        this.modify(dImports[i], 'add');
      }
    }
  },

  modify: function(importName, op) {

    if (op == 'add') {
      this.imports.push(importName);
      this.appendDummyInput(importName)
      .appendField('import ' + importName);

      if (this.imports.indexOf('math') > -1) {
        workspace.updateToolbox(document.getElementById('toolboxmaths'));
      }

    } else {
      this.removeInput(importName);
      this.imports.splice(this.imports.indexOf(importName), 1);

      if (this.imports.indexOf('math') == -1) {
        workspace.updateToolbox(document.getElementById('toolbox'));
      }

    }
  }

};
