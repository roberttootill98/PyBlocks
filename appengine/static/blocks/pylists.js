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

goog.provide('Blockly.Blocks.pylists');

goog.require('Blockly.Blocks');

Blockly.Blocks['python_list_empty'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("[]");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*matching"],
        ]);
        this.setOutput(true);
        this.setTooltip('Returns an empty list');
    }
};

Blockly.Blocks['python_list_index'] = {
    init: function() {
        this.appendValueInput("ARG1");
        this.appendValueInput("ARG2")
            .appendField("[");
        this.appendDummyInput()
            .appendField("]");
        this.setOperator(16);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*matching", "int", "matching"],
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
            this.setTooltip('Returns an element from a list from the specified index location');
        }
    }
};

Blockly.Blocks['python_list_const'] = {
    init: function() {
        this.appendDummyInput().
        appendField("[");
        this.appendValueInput("ARG1");
        this.appendDummyInput("CLOSE")
            .appendField("]");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["matching", "*matching"],
        ]);
        this.setOutput(true);
        this.parameterCount = 1;
    },

    customContextMenu: function(options) {
        var optionRemove = {
            enabled: this.parameterCount > 1
        };
        optionRemove.text = "Remove value";
        optionRemove.callback = Blockly.ContextMenu.removeInputCallback(this);
        var optionAdd = {
            enabled: true
        };
        optionAdd.text = "Add value";
        optionAdd.callback = Blockly.ContextMenu.addInputCallback(this);
        options.unshift(optionAdd, optionRemove);
    },

    mutationToDom: function() {
        var container = document.createElement('mutation');
        container.setAttribute('parameter_count', this.parameterCount);
        return container;
    },

    domToMutation: function(xmlElement) {
        var parameters = parseInt(xmlElement.getAttribute('parameter_count'));
        for (var i = 1; i < parameters; i++) {
            this.add();
        }
    },

    add: function() {
        this.parameterCount++;
        var inputName = 'ARG' + this.parameterCount;
        var input = this.appendValueInput(inputName);
        if (this.parameterCount > 1) {
            input.appendField(", ");
        }
        this.fullTypeVecs[0].splice(-1, 0, "matching");
        this.reType();
        this.moveInputBefore(inputName, "CLOSE");
        this.onchange();
    },

    remove: function() {
        this.removeInput('ARG' + this.parameterCount);
        this.parameterCount--;
        this.fullTypeVecs[0].splice(-2, 1);
        this.reType();
        this.onchange();
    },

    onchange: function(ev) {
        var filledCount;

        for (var i = 1, filledCount = 0; i <= this.parameterCount; i++) {
            if (Blockly.Python.valueToCode(this, 'ARG' + i, Blockly.Python.ORDER_NONE) != '') {
                filledCount++;
            }
        }

        if (filledCount == this.parameterCount) {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns a list of elements');
        }
        this.reType();
    }
};

Blockly.Blocks['python_list_function'] = {
    init: function() {
        this.appendDummyInput().
        appendField("list(");
        this.appendValueInput("ARG");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["str", "*str"],
            ["range", "*int"]
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
            this.setTooltip('Takes a tuple and returns a list');
        }
    }
};

Blockly.Blocks['python_list_concat'] = {
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
            ["*matching", "*matching", "*matching"]
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
            this.setTooltip('Returns the concatenation of two lists');
        }
    }
};

Blockly.Blocks['python_list_repeat'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" * ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(12);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*matching", "int", "*matching"],
            ["int", "*matching", "*matching"],
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
            this.setTooltip('Returns a list repeated n number of times');
        }
    }
};

Blockly.Blocks['python_list_slice12'] = {
    init: function() {
        this.appendValueInput("ARG1");
        this.appendValueInput("ARG2")
            .appendField("[");
        this.appendValueInput("ARG3")
            .appendField(":");
        this.appendDummyInput()
            .appendField("]");
        this.setOperator(16);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*matching", "int", "int", "*matching"],
        ]);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG1', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'ARG2', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'ARG3', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print( ' + Blockly.Python.blockToCode(this)[0] + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns sliced list from and to the specified location');
        }
    }
};

Blockly.Blocks['python_list_slice1'] = {
    init: function() {
        this.appendValueInput("ARG1");
        this.appendValueInput("ARG2")
            .appendField("[");
        this.appendDummyInput()
            .appendField(":");
        this.appendDummyInput()
            .appendField("]");
        this.setOperator(16);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*matching", "int", "*matching"],
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
            this.setTooltip('Returns sliced list from a specified location to the end');
        }
    }
};

Blockly.Blocks['python_list_slice2'] = {
    init: function() {
        this.appendValueInput("ARG1");
        this.appendDummyInput()
            .appendField("[");
        this.appendValueInput("ARG2")
            .appendField(":");
        this.appendDummyInput()
            .appendField("]");
        this.setOperator(16);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*matching", "int", "*matching"],
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
            this.setTooltip('Returns sliced list from the beginning to a specified location');
        }
    }
};

Blockly.Blocks['python_list_len'] = {
    init: function() {
        this.appendValueInput("ARG")
            .appendField("len(");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*any", "int"]
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
            this.setTooltip('Returns the length of a list');
        }
    }
};

Blockly.Blocks['python_list_in'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("", "LPAR");
        this.appendValueInput("LHS");
        this.appendValueInput("RHS")
            .appendField(" in ");
        this.appendDummyInput()
            .appendField("", "RPAR");
        this.setOperator(6);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["matching", "*matching", "bool"]
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
            this.setTooltip('Returns true if the sub-list belongs to a specified list');
        }
    }
};

Blockly.Blocks['python_list_min'] = {
    init: function() {
        this.appendValueInput("ARG")
            .appendField("min(");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*int", "int"],
            ["*float", "float"],
            ["*str", "str"]
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
            this.setTooltip('Returns the minimum value of a list');
        }
    }
};

Blockly.Blocks['python_list_max'] = {
    init: function() {
        this.appendValueInput("ARG")
            .appendField("max(");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*int", "int"],
            ["*float", "float"],
            ["*str", "str"]
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
            this.setTooltip('Returns the maximum value of a list');
        }
    }
};

Blockly.Blocks['python_sorted'] = {
    init: function() {
        this.appendValueInput("ARG")
            .appendField("sorted(");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*int", "*int"],
            ["*float", "*float"],
            ["*str", "*str"]
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
            this.setTooltip('Returns a sorted version of the specified list');
        }
    }
};

Blockly.Blocks['python_append'] = {
    init: function() {
        this.appendValueInput("ARG1");
        this.appendValueInput("ARG2")
            .appendField(".append(");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*matching", "matching", "none"]
        ]);
        this.setLhsVarOnly(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Appends an element to a list');
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG1', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'ARG2', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
        } else {
            this.holesFilled = false;
        }
    }
};

Blockly.Blocks['python_list_item_modify'] = {
    init: function() {
        this.appendValueInput("ARG1");
        this.appendValueInput("ARG2")
            .appendField("[");
        this.appendValueInput("ARG3")
            .appendField("] = ");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*matching", "int", "matching", "none"],
        ]);
        this.setLhsVarOnly(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Modifies an element in a list at the specified location index');
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG1', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'ARG2', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'ARG3', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
        } else {
            this.holesFilled = false;
        }
    }
};

Blockly.Blocks['python_extend'] = {
    init: function() {
        this.appendValueInput("ARG1");
        this.appendValueInput("ARG2")
            .appendField(".extend(");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*matching", "*matching", "none"]
        ]);
        this.setLhsVarOnly(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Adds a list to the end of another list');
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG1', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'ARG2', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
        } else {
            this.holesFilled = false;
        }
    }
};

Blockly.Blocks['python_insert'] = {
    init: function() {
        this.appendValueInput("ARG1");
        this.appendValueInput("ARG2")
            .appendField(".insert(");
        this.appendValueInput("ARG3")
            .appendField(", ");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*matching", "matching", "int", "none"]
        ]);
        this.setLhsVarOnly(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Inserts an object into a list at the specified location index');
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG1', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'ARG2', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'ARG3', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
        } else {
            this.holesFilled = false;
        }
    }
};

Blockly.Blocks['python_pop'] = {
    init: function() {
        this.appendValueInput("ARG");
        this.appendDummyInput()
            .appendField(".pop()");
        this.setOperator(16);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*matching", "matching"]
        ]);
        this.setOutput(true);
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
            runTooltip('print(' + Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) + '[-1]' + ')');
            this.setTooltip(document.getElementById("hiddenoutput").textContent);
        } else {
            this.holesFilled = false;
            this.setTooltip('Returns and removes the last element of a list');
        }
    }
};

Blockly.Blocks['python_pop_statement'] = {
    init: function() {
        this.appendValueInput("ARG");
        this.appendDummyInput()
            .appendField(".pop()");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*any", "none"]
        ]);
        this.setLhsVarOnly(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Removes the last element of a list');
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
        } else {
            this.holesFilled = false;
        }
    }
};

Blockly.Blocks['python_remove'] = {
    init: function() {
        this.appendValueInput("ARG1");
        this.appendValueInput("ARG2")
            .appendField(".remove(");
        this.appendDummyInput()
            .appendField(")");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*matching", "matching", "none"]
        ]);
        this.setLhsVarOnly(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Removes the first item from the list which matches the specified value');
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG1', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'ARG2', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
        } else {
            this.holesFilled = false;
        }
    }
};

Blockly.Blocks['python_reverse'] = {
    init: function() {
        this.appendValueInput("ARG");
        this.appendDummyInput()
            .appendField(".reverse()");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*any", "none"]
        ]);
        this.setLhsVarOnly(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Reverses the list');
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
        } else {
            this.holesFilled = false;
        }
    }
};

Blockly.Blocks['python_sort'] = {
    init: function() {
        this.appendValueInput("ARG");
        this.appendDummyInput()
            .appendField(".sort()");
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*float", "none"],
            ["*int", "none"],
            ["*str", "none"]
        ]);
        this.setLhsVarOnly(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Sorts the list');
    },
    onchange: function(ev) {
        if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
        } else {
            this.holesFilled = false;
        }
    }
};

Blockly.Blocks['python_list_index_method'] = {
    init: function() {
        this.appendValueInput("ARG1");
        this.appendValueInput("ARG2")
            .appendField(".index(");
        this.appendDummyInput()
            .appendField(")");
        this.setOperator(16);
        this.setInputsInline(true);
        this.setTypeVecs([
            ["*matching", "matching", "int"]
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
            this.setTooltip('Returns the lowest index in a list where the specified value appears');
        }
    }
};
