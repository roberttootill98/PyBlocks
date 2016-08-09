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
  * @fileoverview Conversion blocks for PythonBlocks
  * @author up649230@myport.ac.uk
  */

'use strict';

goog.provide('Blockly.Python.pymath');

goog.require('Blockly.Python');


Blockly.Python['python_math_ceil'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.ceil(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_copysign'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  return ['math.copysign(' + block1 + ', ' + block2 + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_fabs'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.fabs(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_factorial'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.factorial(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_floor'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.floor(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_fmod'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.fmod(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_frexp'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.frexp(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_fsum'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.fsum(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_isinf'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.isinf(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_isnan'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.isnan(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_ldexp'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  return ['math.ldexp(' + block1 + ', ' + block2 + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_modf'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.modf(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_trunc'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.trunc(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_exp'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.exp(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_expm1'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.expm1(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_log'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.log(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_log1p'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.log1p(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_log10'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.log10(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_pow'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  return ['math.pow(' + block1 + ', ' + block2 + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_sqrt'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.sqrt(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_acos'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.acos(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_asin'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.asin(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_atan'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.atan(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_atan2'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  return ['math.atan2(' + block1 + ', ' + block2 + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_cos'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.cos(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_hypot'] = function(block) {
  var block1 = Blockly.Python.valueToCode(block, 'ARG1', Blockly.Python.ORDER_NONE);
  var block2 = Blockly.Python.valueToCode(block, 'ARG2', Blockly.Python.ORDER_NONE);
  return ['math.hypot(' + block1 + ', ' + block2 + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_sin'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.sin(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_tan'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.tan(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_degrees'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.degrees(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_radians'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.radians(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_acosh'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.acosh(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_asinh'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.asinh(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_atanh'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.atanh(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_cosh'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.cosh(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_sinh'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.sinh(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_tanh'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.tanh(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_erf'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.erf(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_erfc'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.erfc(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_gamma'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.gamma(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_lgamma'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'ARG', Blockly.Python.ORDER_NONE);
  return ['math.lgamma(' + code + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_pi'] = function(block) {
  return ['math.pi', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['python_math_e'] = function(block) {
  return ['math.e', Blockly.Python.ORDER_ATOMIC];
};
