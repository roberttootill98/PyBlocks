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

goog.provide('Blockly.Blocks.pycomparisons');

goog.require('Blockly.Blocks');

var EQUALITY_TYPE_VECS = [
    ["matching", "matching", "bool"],
    ["int", "float", "bool"],
    ["float", "int", "bool"],
    ["*matching", "*matching", "bool"],
    ["*int", "*float", "bool"],
    ["*float", "*int", "bool"],
];

var ORDERING_TYPE_VECS = [
    ["str", "str", "bool"],
    ["int", "int", "bool"],
    ["float", "float", "bool"],
    ["int", "float", "bool"],
    ["float", "int", "bool"],
    ["*str", "*str", "bool"],
    ["*int", "*int", "bool"],
    ["*float", "*float", "bool"],
    ["*int", "*float", "bool"],
    ["*float", "*int", "bool"],
];

Blockly.Blocks['python_equals'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" == ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(6);
        this.setInputsInline(true);
        this.setTypeVecs(EQUALITY_TYPE_VECS);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'LHS', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'RHS', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns whether the left side is equal to the right');
        }
    }
};

Blockly.Blocks['python_not_equals'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" != ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(6);
        this.setInputsInline(true);
        this.setTypeVecs(EQUALITY_TYPE_VECS);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'LHS', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'RHS', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns whether the left side is not equal to the right');
        }
    }
};

Blockly.Blocks['python_is'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" is ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(6);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["matching", "matching", "bool"],
            ["*matching", "*matching", "bool"]
        ]);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'LHS', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'RHS', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns whether the left side is the right');
        }
    }
};

Blockly.Blocks['python_less_than'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" < ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(6);
        this.setInputsInline(true);
        this.setTypeVecs(ORDERING_TYPE_VECS);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'LHS', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'RHS', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns whether the left side is less than the right');
        }
    }
};

Blockly.Blocks['python_less_than_or_equal'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" <= ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(6);
        this.setInputsInline(true);
        this.setTypeVecs(ORDERING_TYPE_VECS);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'LHS', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'RHS', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns whether the left side is less than or equal to the right');
        }
    }
};


Blockly.Blocks['python_greater_than'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" > ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(6);
        this.setInputsInline(true);
        this.setTypeVecs(ORDERING_TYPE_VECS);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'LHS', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'RHS', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns whether the left side is greater than the right');
        }
    }
};


Blockly.Blocks['python_greater_than_or_equal'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" >= ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(6);
        this.setInputsInline(true);
        this.setTypeVecs(ORDERING_TYPE_VECS);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'LHS', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'RHS', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns whether the left side is greater than or equal to the right');
        }
    }
};
