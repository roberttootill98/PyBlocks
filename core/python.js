/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2013 Google Inc.
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
 * @fileoverview Python-specific colours enterDocument
 * @author matthew.j.poole@gmail.com (Matthew Poole)
 */
'use strict';

goog.provide('Blockly.Python');

Blockly.Python.COLOUR = {};
Blockly.Python.COLOUR['notype'] = '#8B7D6B';
Blockly.Python.COLOUR['int'] = '#dfdf20';   //yellow
Blockly.Python.COLOUR['float'] = '#FF1919'; // red
Blockly.Python.COLOUR['str'] = '#00CC33';  // green
Blockly.Python.COLOUR['bool'] = '#FF29FF'; // magenta
Blockly.Python.COLOUR['range'] = '#0080FF' ; // blue
Blockly.Python.RAINBOW = ['str', 'int', 'float', 'bool', 'range', 'str'];
