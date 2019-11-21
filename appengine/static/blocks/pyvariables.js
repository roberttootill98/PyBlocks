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

goog.provide('Blockly.Blocks.pyvariables');

goog.require('Blockly.Blocks');


/**
 * Common HSV hue for all blocks in this category.
 */
Blockly.Blocks.pyvariables.HUE = 330;

Blockly.Blocks['variables_get'] = {
    /**
     * Block for variable getter.
     * @this Blockly.Block
     */
    init: function() {
        console.log("VARS within var_get init ", this.type, this.getFieldValue("VAR"));
        this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
        this.appendDummyInput()
            .appendField(new Blockly.Field(
                "initname"), 'VAR');
        this.setOutput(true);
        this.setTypeVecs([
            ["none"]
        ]);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
        console.log("VARS at end init", this.type, this.getFieldValue("VAR"));
    },
    /**
     * Return all variables referenced by this block.
     * @return ....
     * @this Blockly.Block
     */
    getVar: function() {
        return {
            name: this.getFieldValue('VAR'),
            type: this.typeVecs[0][0]
        };
    },
    /**
     * Notification that a variable is renaming.
     * If the name matches one of this block's variables, rename it.
     * @param {string} oldName Previous name of variable.
     * @param {string} newName Renamed variable.
     * @this Blockly.Block
     */
    renameVar: function(oldName, newName) {
        if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
            this.setFieldValue(newName, 'VAR');
        }
    },
    contextMenuType_: 'variables_get',
    /**
     * Add menu option to create getter/setter block for this setter/getter.
     * @param {!Array} options List of menu options to add to.
     * @this Blockly.Block
     */
    customContextMenu: function(options) {
        var rename = {
            enabled: true
        };
        rename.text = "Rename variable ...";
        rename.callback = Blockly.Python.renameVariableCallback(this);
        options.unshift(rename);
    },
    onchange: function(ev) {
        this.setTooltip(this.getFieldValue("VAR"));
    }

};

Blockly.Blocks['variables_set'] = {
    /**
     * Block for variable setter.
     * @this Blockly.Block
     */
    init: function() {
        this.declaredVar = '';
        this.permitSetter = true;
        this.jsonInit({
            "message0": "%1 = %2",
            "args0": [{
                //"type": "field_variable",
                "type": "input_value",
                "name": "VAR",
                "variable": Blockly.Msg.VARIABLES_DEFAULT_NAME,
            }, {
                "type": "input_value",
                "name": "VALUE"
            }],
            //    "movable" : false,
            //  "typeVecs": [["none", "none", "none"]],
            //  "fullTypeVecs": [["matching", "matching", "none"]],
            "lhsVarOnly": true,
            "inputsInline": true,
            "previousStatement": null,
            "nextStatement": null,
            "tooltip": Blockly.Msg.VARIABLES_SET_TOOLTIP,
            "helpUrl": Blockly.Msg.VARIABLES_SET_HELPURL
        });
        //this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    },
    onchange: function(ev) {

        if (Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'VALUE', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
        } else {
            this.holesFilled = false;
        }

        if (this.getSurroundParent() != null && (this.getSurroundParent().type == 'python_if' || this.getSurroundParent().type == 'python_while')) {
            this.declaredVar = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_NONE) + '_CTRL';
        } else {
            this.declaredVar = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_NONE) + '_NOCTRL';
        }
    }
};

Blockly.Blocks['python_variable_selector_new'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("Variable"), 'VALUE');

        //this.getField('VALUE').setChangeHandler(Blockly.FieldTextInput.integerValidator);

        this.setInputsInline(true);
        this.setOutput(true);

        this.setTypeVecs([["any"]]);

        this.inWorkspace = false;
    },

    onchange: function(ev) {
        // if in workspace then prompt modal window
        if(this.inWorkspace) {
            var parent = this.parentBlock_;
            // if duplicated do something different (name!="Variable")

            // open modal window
            // use prompts for now
            var varName = prompt("var name", "myVar");
            // limit type options in placed directly into block
            var varType = prompt("var type", "int"); // should be dropdown

            // if cancelled out, delete block
            // otherwise set block value and type vecs
                // create new var block and replace current block with this

            // newVariableBlock func from Blockly.Variables.flyOutCategory
            var variable = {'name': varName, 'type': varType};
            var block = goog.dom.createDom('block');
            block.setAttribute('type', 'variables_get');
            var field = goog.dom.createDom('field', null, variable.name);
            field.setAttribute('name', 'VAR');
            block.appendChild(field);
            var pyType = goog.dom.createDom('pytype', null, variable.type);
            block.appendChild(pyType);

            // from flyout.js - flyout.show
            block = Blockly.Xml.domToBlock(this.workspace, block);

            if(parent) {
                 // if it was in a block then replace into that block
                 // which input to put block in to
                 var inputName = getParentInput(parent);

                 // delete current block
                 this.dispose(false, false, false);

                 // place new block into parent in same input
                 block.setParent(parent);
             } else {
                // if not in block then just place where it was before
                // get coords of block before dispose
                var coords = this.getRelativeToSurfaceXY()
                var x = coords.x;
                var y = coords.y;
                // move new block to location of old block
                block.moveBy(x, y);

                // delete current block
                this.dispose(false, false, false);
            }
        } else if(checkBlocks()) {
            // don't fire modal window event until dropped
            this.inWorkspace = true;
        }
    }
}

// check if blocks in workspace have changed
function checkBlocks() {
    var blocks = workspace.getAllBlocks();
    for(var i = 0; i < blocks.length; i++) {
        if(blocks[i].type == "python_variable_selector_new") {
            return blocks[i];
        }
    }
}

// get which parent input that a variable block was dropped in to
function getParentInput(parent) {
    for(var i = 0; i < parent.inputList.length; i++) {
        var name = parent.inputList[i]['name'];
        // if input value == 'Variable' then return name of this field
        if(Blockly.Python.valueToCode(parent, name, Blockly.Python.ORDER_NONE) == "Variable") {
            return name;
        }
    }
}

Blockly.Blocks['python_variable_selector'] = {
    /**
     * block for create news vars and selecting existing ones
     * not for assignment
     *
     */
    /** todo
     * when a new variable is created - update all instances of dropdown to include this
     */
    /** bugs
     * when there are no variables - not able to view item, should default to have create variable item
     */
    init: function() {
        this.appendDummyInput('dropDownContainer')
            updateVarList(this);

        this.setInputsInline(true);
        this.setOutput(true);

        this.setTypeVecs([[getVarTypeFromFields(this.dropdown.getText(), this)]]);

        // inside another block
        this.dropped = false;

        function getVar() {
            return {
                name: this.dropdown.getText(),
                type: this.typeVecs[0][0]
            };
        };
        this.getVar = getVar;
    },

    onchange: function(ev) {
        //var tempVarList = getVarList(this);

        if(this.dropdown.getValue() == "newVar") { // and in workspace
            // when varName is set to new variable open modal dialog
            // use alert for now
            var varName = prompt("var name", "myVar");
            var varType = prompt("var type", "int"); // should be dropdown

            // validate name
            //var valid = Blockly.Python.makeNameUnique(varName, )

            // add field to dropdown fields
            var fields = this.dropdown.fields;
            var value = fields[fields.length-2]['value'];
            fields.push({
                "name": varName,
                "type": varType,
                "value": "var" + (parseInt(value.charAt(value.length-1)) + 1)
            });
            // set var selector to var
            this.dropdown.setValue(varName, 'varName');
            this.setTypeVecs([[varType]])
        }

        // on drop - update options in dropdown
        var tempDropped = this.dropped;
        if(this.parentBlock_ != null) {
            this.dropped = true;
        } else {
            this.dropped = false;
        }
        if(tempDropped != this.dropped) {
            var varName = this.dropdown.getValue();
            // if the value of dropped has changed, update var list
            updateVarList(this);
            // maintain var selected
            this.dropdown.setValue(varName, 'varName');
        }

        // react to deleted variable
        // onchange event fires when block is still on screen
        // -- recognise deleted block beforehand?
        /*
        var varList = getVarList(this);
        for(var i = 0; i < varList.length; i++) {
            if(tempVarList[i][0] != varList[i][0]) {
                // if var deleted is one selected

                // else
                updateVarList(this);
                break;
            }
        }
        */

        //Blockly.Variables.allVariables(workspace, true, true);
        // setTypeVecs as type of block selected/created
        this.setTypeVecs([[getVarTypeFromFields(this.dropdown.getText(), this)]]);
        this.reType();

        // update tooltip
    }
};

// create var list according to valid blocks
function getVarList(block) {
    var variables = Blockly.Variables.allVariables(workspace, true, true);
    var varList = [];
    for(i = 0; i < variables.length; i++) {
        // limit vars
        var valid = false;

        // check parent block typeVecs
        var parent = block.parentBlock_;
        if(parent != null) {
            // using 0 checks only first set of type vecs
            /**
             * also needs to check for which input is being used
             * eg. in parent block, first, second, third...
             */
            var inputIndex = 0; // for testing, means first input for type vecs
            var parentTypeVecs = parent.fullTypeVecs;
            for(var j = 0; j < parentTypeVecs.length; j++) {
                if(["any", getVarTypeFromBlocks(variables[i]['name'])].includes(parentTypeVecs[j][inputIndex])) {
                    valid = true;
                    break;
                }
            }
        } else {
            valid = true;
        }

        if(valid) {
            varList.push([variables[i]["name"], "var" + i]);
        }
    }
    return varList;
}

// get type of var from blocks in workspace
function getVarTypeFromBlocks(name) {
  var variables = Blockly.Variables.allVariables(workspace, true, true);
  for(i = 0; i < variables.length; i++) {
      if(name == variables[i]["name"]) {
          return variables[i]["type"];
      }
  }
}

// get type of var from dropdown.fields, unaffected by blocks in workspace
function getVarTypeFromFields(name, block) {
    var fields = block.dropdown.fields;
    for(i = 0; i < fields.length; i++) {
        if(name == fields[i]["name"]) {
            return fields[i]["type"];
        }
    }
}
// update varList
function updateVarList(block) {
    var input = block.inputList[0];

    // remove current dropdown
    try {
      input.removeField('varName');
      input.removeField('arrow');
    } catch(err) {
      console.log(err);
    }

    // add new dropdown
    var dropDownItems = getVarList(block);
    // add create var option at beginning of list
    // dropDownItems.unshift(['New-variable', 'newVar']);
    dropDownItems.push(['New-variable', 'newVar']); // add it at end for now

    block.dropdown = new Blockly.FieldDropdown(dropDownItems);

    // update dropdown.fields
    block.dropdown.fields = []
    var options = block.dropdown.getOptions_();
    for (var i = 0; i < options.length; i++) {
        block.dropdown.fields.push({
            "name": options[i][0],
            "type": getVarTypeFromBlocks(options[i][0]),
            "value": options[i][1]
        });
    };

    input.appendField(block.dropdown, 'varName');
    input.appendField(Blockly.FieldDropdown.ARROW_CHAR, 'arrow');
}

/* possibly leave till later
Blockly.Blocks['list_variable_index_get'] = {

  init: function() {
    this.appendValueInput("ARG1");
    this.appendValueInput("ARG2")
        .appendField("[");
    this.appendDummyInput()
        .appendField("]");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["*matching", "int", "matching"],
    ]);
    this.setOutput(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
    }
};
*/
