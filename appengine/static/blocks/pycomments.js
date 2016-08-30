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

goog.provide('Blockly.Blocks.pycomments');

goog.require('Blockly.Blocks');

Blockly.Blocks['python_linespace'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("  ");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('An empty line');
  }
};

Blockly.Blocks['python_comment'] = {
  /**
   * Block for numeric value.
   * @this Blockly.Block
   */
  init: function() {
    this.appendDummyInput("LINE1")
        .appendField("# ")
        .appendField(new Blockly.FieldTextInput('Comment here ...'), "COMMENT1")
        .appendField(" ");
    this.getField('COMMENT1').setChangeHandler(
          Blockly.FieldTextInput.commentValidator);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Comments are used to describe ambiguous code, they have no effect on execution');
    this.lineCount = 1;

  },

  customContextMenu: function(options) {
    var optionRemove = {enabled: this.lineCount > 1};
    optionRemove.text = "Remove line";
    optionRemove.callback = Blockly.ContextMenu.removeInputCallback(this);
    var optionAdd = {enabled: true};
    optionAdd.text = "Add line";
    optionAdd.callback = Blockly.ContextMenu.addInputCallback(this);
    options.unshift(optionAdd, optionRemove);
  },

  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('line_count', this.lineCount);
    return container;
  },

  domToMutation: function(xmlElement) {
    var lines = parseInt(xmlElement.getAttribute('line_count'));
    for (var i = 1; i < lines; i++) {
      this.add();
    }
  },

  add: function() {
    this.lineCount++;
    this.appendDummyInput('LINE' + this.lineCount)
        .appendField("# ")
        .appendField(new Blockly.FieldTextInput('     '),
            "COMMENT" + this.lineCount)
        .appendField(" ");
    this.getField('COMMENT' + this.lineCount).setChangeHandler(
              Blockly.FieldTextInput.commentValidator);
  },

  remove: function() {
    this.removeInput('LINE' + this.lineCount);
    this.lineCount--;
  }

};
