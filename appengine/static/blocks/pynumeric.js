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

goog.provide('Blockly.Blocks.pynumeric');

goog.require('Blockly.Blocks');

Blockly.Blocks['python_int_const'] = {

    init: function() {
        var tooltip = '';
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("42"), "VALUE");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["int"],
            ["nonnegint"],
            ["negint"]
        ]);
        this.setOutput(true);
        this.getField('VALUE').setChangeHandler(
            Blockly.FieldTextInput.integerValidator);
        this.restrictTypes();
    },

    restrictTypes: function() {
        if (Number(this.getFieldValue('VALUE') >= 0)) {
            this.typeVecs = [
                ["int"],
                ["nonnegint"]
            ];
        } else {
            this.typeVecs = [
                ["int"],
                ["negint"]
            ];
        }
    },

    checkValue: function(text) {
        var currentTypes = this.getOutputTypes();
        if (currentTypes.indexOf("int") > -1) {
            //this.restrictTypes();
            return text;
        }
        var value = Number(text);
        if (value >= 0 && currentTypes.indexOf("nonnegint") > -1) {
            return text;
        }
        if (value < 0 && currentTypes.indexOf("negint") > -1) {
            return text;
        }
        return null;
    }
};

Blockly.Blocks['python_float_const'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("3.14"), "VALUE");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["float"]
        ]);
        this.setOutput(true);
        this.getField('VALUE').setChangeHandler(
            Blockly.FieldTextInput.floatValidator);
    }
};

Blockly.Blocks['python_plus'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" + ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(11);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["int", "int", "int"],
            ["float", "int", "float"],
            ["int", "float", "float"],
            ["float", "float", "float"]
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
            this.setTooltip('Returns the sum of two integers/floating point numbers');
        }
    }
};

Blockly.Blocks['python_minus'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" - ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(11);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["int", "int", "int"],
            ["float", "int", "float"],
            ["int", "float", "float"],
            ["float", "float", "float"]
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
            this.setTooltip('Returns the difference of two integers/floating point numbers');
        }
    }
};

Blockly.Blocks['python_multiply'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" * ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(12);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["int", "int", "int"],
            ["float", "int", "float"],
            ["int", "float", "float"],
            ["float", "float", "float"]
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
            this.setTooltip('Returns the product of two integers/floating point numbers');
        }
    }
};

Blockly.Blocks['python_divide'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" / ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(12);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["int", "int", "float"],
            ["float", "int", "float"],
            ["int", "float", "float"],
            ["float", "float", "float"]
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
            this.setTooltip('Returns the quotient of two integers/floating point numbers');
        }
    }
};

Blockly.Blocks['python_int_divide'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" // ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(12);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["int", "int", "int"]
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
            this.setTooltip('Returns the quotient of two integers');
        }
    }
};

Blockly.Blocks['python_int_modulo'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" % ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(12);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["int", "int", "int"]
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
            this.setTooltip('Returns the remainder of two integers after division');
        }
    }
};


Blockly.Blocks['python_pow_op'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" ** ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(14);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["int", "nonnegint", "int"],
            ["int", "negint", "float"],
            ["float", "int", "float"],
            ["int", "float", "float"],
            ["float", "float", "float"]
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
            this.setTooltip('Returns the power of two integers/floating point numbers');
        }
    }
};

Blockly.Blocks['python_unary_minus'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("ARG")
            .appendField("-");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(13);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["int", "int"],
            ["float", "float"]
        ]);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns a negative integer or floating point number');
        }
    }
};

Blockly.Blocks['python_abs'] = {
    init: function() {
        this.appendValueInput("ARG")
            .appendField("abs(");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["int", "int"],
            ["int", "nonnegint"],
            ["float", "float"]
        ]);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns the absolute value of an integer or floating point number');
        }
    }
};

Blockly.Blocks['python_round'] = {
    init: function() {
        this.appendValueInput("ARG")
            .setCheck(["int"])
            .appendField("round(");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["float", "int"]
        ]);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Rounds a floating point number to the whole integer number');
        }
    }
};

Blockly.Blocks['python_pow'] = {
    init: function() {
        this.appendValueInput("ARG1")
            .appendField("pow(");
        this.appendValueInput("ARG2")
            .appendField(", ");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["int", "nonnegint", "int"],
            ["int", "negint", "float"],
            ["float", "int", "float"],
            ["int", "float", "float"],
            ["float", "float", "float"]
        ]);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG1', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'ARG2', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns the power of two integers/floating point numbers');
        }
    }
};

Blockly.Blocks['python_numeric_min'] = {
    init: function() {
        this.appendValueInput("ARG1")
            .appendField("min(");
        this.appendValueInput("ARG2")
            .appendField(", ");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["int", "int", "int"],
            ["float", "float", "float"]
        ]);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG1', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'ARG2', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns the smallest value of two integers/floating point numbers');
        }
    }
};

Blockly.Blocks['python_numeric_max'] = {
    init: function() {
        this.appendValueInput("ARG1")
            .appendField("max(");
        this.appendValueInput("ARG2")
            .appendField(", ");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["int", "int", "int"],
            ["float", "float", "float"]
        ]);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG1', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'ARG2', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns the largest value of two integers/floating point numbers');
        }
    }
};

Blockly.Blocks['python_sum'] = {
    init: function() {
        this.appendValueInput("ARG")
            .appendField("sum(");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*int", "int"],
            ["*float", "float"]
        ]);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns the sum of a list of integers/floating point numbers');
        }
    }
};
