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

goog.provide('Blockly.Blocks.pybooleans');

goog.require('Blockly.Blocks');

Blockly.Blocks['python_true'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("True");
        this.setTypeVecs([
            ["bool"]
        ]);
        this.setOutput(true);
    }
};

Blockly.Blocks['python_false'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("False");
        this.setTypeVecs([
            ["bool"]
        ]);
        this.setOutput(true);
    }
};

Blockly.Blocks['python_and'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" and ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(4);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["bool", "bool", "bool"],
        ]);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'LHS', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'RHS', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runtooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns true if both sides are true');
        }
    }
};

Blockly.Blocks['python_or'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" or ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(3);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["bool", "bool", "bool"],
        ]);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'LHS', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'RHS', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runtooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns true if either side is true');
        }
    }
};

Blockly.Blocks['python_not'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("ARG")
            .appendField("not ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(5);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["bool", "bool"]
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
            this.setTooltip('Returns the inverse of the boolean value');
        }
    }
};
