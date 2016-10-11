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

goog.provide('Blockly.Python.pyturtle');

goog.require('Blockly.Python');


Blockly.Python['python_turtle_new'] = function(block) {
  return 't = turtle.Turtle()\n';
};

Blockly.Python['python_turtle_getscreen'] = function(block) {
  return 's = t.getscreen()\n';
};

Blockly.Python['python_turtle_color'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return 't.color(' + code + ')\n';
};

Blockly.Python['python_turtle_pencolor'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return 't.pencolor(' + code + ')\n';
};

Blockly.Python['python_turtle_fillcolor'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return 't.fillcolor(' + code + ')\n';
};

Blockly.Python['python_turtle_bgcolor'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return 's.bgcolor(' + code + ')\n';
};

Blockly.Python['python_turtle_fill'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return 't.fill(' + code + ')\n';
};


Blockly.Python['python_turtle_forward'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return 't.forward(' + code + ')\n';
};

Blockly.Python['python_turtle_backward'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return 't.backward(' + code + ')\n';
};

Blockly.Python['python_turtle_left'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return 't.left(' + code + ')\n';
};

Blockly.Python['python_turtle_right'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return 't.right(' + code + ')\n';
};

Blockly.Python['python_turtle_circle'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return 't.circle(' + code + ')\n';
};

Blockly.Python['python_turtle_position'] = function(block) {
  return 't.position()\n';
};

Blockly.Python['python_turtle_setposition'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  return 't.setposition(' + block1 + ', ' + block2 + ')\n';
};

Blockly.Python['python_turtle_pendown'] = function(block) {
  return 't.pendown()\n';
};

Blockly.Python['python_turtle_penup'] = function(block) {
  return 't.penup()\n';
};

Blockly.Python['python_turtle_isdown'] = function(block) {
  return 'print(t.isdown())\n';
};
