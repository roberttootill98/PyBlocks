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
  * @fileoverview Turtle blocks for PythonBlocks
  * @author up649230@myport.ac.uk
  */

'use strict';

goog.provide('Blockly.Blocks.pyturtle');

goog.require('Blockly.Blocks');


Blockly.Blocks['python_turtle_new'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("t = turtle.Turtle()");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("dummy");
    this.setTypeVecs([
      ["none"]
    ]);
  }
};

Blockly.Blocks['python_turtle_color'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("t.color(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTypeVecs([
      ["str", "none"]
    ]);
  }
};

Blockly.Blocks['python_turtle_forward'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("t.forward(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTypeVecs([
      ["int", "none"]
    ]);
  }
};

Blockly.Blocks['python_turtle_left'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("t.left(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTypeVecs([
      ["int", "none"]
    ]);
  }
};
