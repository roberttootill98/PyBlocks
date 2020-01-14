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

Blockly.Blocks['python_variable_selector'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("Variable"), 'VALUE');

        //this.getField('VALUE').setChangeHandler(Blockly.FieldTextInput.integerValidator);

        this.setInputsInline(true);
        this.setOutput(true);

        this.setTypeVecs([
          ["any"],
          ["*any"]
        ]);
    },

    onchange: function(ev) {
        // if we have details of variable
        if(this.varName && this.varType) {
            var parent = this.getParent();

            var block = Blockly.Variables.newVariableBlock({
                'name': this.varName,
                'type': this.varType
            });
            block = Blockly.Xml.domToBlock(this.workspace, block);

            // reshape this into variable get block
            // properties
            /*
            this.fullTypeVecs = block.fullTypeVecs;
            this.inputList = block.inputList;
            this.typeVecs = block.typeVecs;
            this.type = block.type;

            this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
            */

            /*
            this.appendDummyInput()
                .appendField(new Blockly.Field(
                    "initname"), 'VAR');
            this.setOutput(true);
            this.setTypeVecs([
                ["none"]
            ]);
            */
            /*
            this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;

            // functions
            this.init = block.init;
            this.getVar = block.getVar;
            this.renameVar = block.renameVar;
            this.contextMenuType_ = block.contextMenuType_;
            this.customContextMenu = block.customContextMenu;
            this.onchange = block.onchange;

            block.dispose(false, false, false);

            //this.init();
            */

            if(parent) {
                 // if it was in a block then replace into that block
                 // which input to put block in to
                 var i = Blockly.Variables.getParentInput(parent, true);

                 /*
                 var outputConnection = this.outputConnection;
                 var parentBlock_ = this.parentBlock_;

                 // delete current block
                 //this.dispose(false, false, false);

                 // add block connection
                 block.outputConnection = outputConnection;
                 block.parentBlock_ = parentBlock_;

                 // fix parent connection
                 var parentConnection = parent.inputList[i].connection;
                 parentConnection.targetConnection.sourceBlock_ = block;
                 */

                 // delete current block
                 this.dispose(false, false, false);

                 var parentConnection = parent.inputList[i].connection;
                 var newConnection = new Blockly.Connection(block, 2);

                 block.outputConnection.targetConnection = newConnection;

                 parentConnection.connect(newConnection);
             } else {
                // if not in block then just place where it was before
                // get coords of block before dispose
                var coords = this.getRelativeToSurfaceXY();
                var x = coords.x;
                var y = coords.y;

                // delete current block
                this.dispose(false, false, false);

                // move new block to location of old block
                block.moveBy(x, y);
            }
        } else if(this.inWorkspace && !Blockly.modalWindow.visible) {
            // if in workspace then prompt modal window
            Blockly.modalWindow.selectVariable();
        } else if(Blockly.Variables.getSelectorBlock()) {
            // don't fire modal window event until dropped
            this.inWorkspace = true;
        }
    }
}

Blockly.Blocks['python_variable_selector_assignment'] = {
    init: function() {
        this.appendValueInput('LHS');

        this.appendValueInput('RHS')
            .appendField(" = ");

        this.setInputsInline(true);
        this.setLhsVarOnly(true);

        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.setTypeVecs([
          ["any", "any", "none"],
          ["*any", "*any", "none"]
        ])

        this.inWorkspace = false;
    },

    onchange: function() {
        if(this.varName && this.varType) {
            var block = Blockly.Variables.newVariablesAssignmentBlock({
                "name": this.varName,
                "type": this.varType,
            });
            block = Blockly.Xml.domToBlock(this.workspace, block);

            var connection = checkForConnection(this);
            if(connection) {
                var connectedBlock = connection.block.targetConnection.sourceBlock_;

                this.dispose(false, false, false);

                var newConnection = new Blockly.Connection(block, 4);
                block.nextConnection.targetConnection = newConnection;

                if(connection.type == 'previous') {
                    connectedBlock.previousConnection.connect(newConnection);
                } else if(connection.type == 'next') {
                    connectedBlock.nextConnection.connect(newConnection);
                }
            } else {
                var coords = this.getRelativeToSurfaceXY();
                var x = coords.x;
                var y = coords.y;

                this.dispose(false, false, false);

                block.moveBy(x, y);
            }
        } else if(this.inWorkspace && !Blockly.modalWindow.visible) {
            // if in workspace then prompt modal window
            Blockly.modalWindow.selectVariable();
        } else if(Blockly.Variables.getSelectorBlock()) {
            // don't fire modal window event until dropped
            this.inWorkspace = true;
        }
    }
}

// check if blocks in workspace have changed
Blockly.Variables.getSelectorBlock = function() {
    var blocks = workspace.getAllBlocks();
    for(var i = 0; i < blocks.length; i++) {
        if(["python_variable_selector", "python_variable_selector_assignment"].includes(blocks[i].type)) {
            return blocks[i];
        }
    }
}

// checks if a connection is made
function checkForConnection(block) {
    if(block.previousConnection.targetConnection) {
      return {'block': block.previousConnection, 'type': 'previous'};
    } else if (block.nextConnection.targetConnection) {
      return {'block': block.nextConnection, 'type': 'next'};
    }
}

// get which parent input that a variable block was dropped in to
// absolute var, if true - ignores type of inputs that block cannot be dropped into
Blockly.Variables.getParentInput = function(parent, absolute) {
    var j = 0
    for(var i = 0; i < parent.inputList.length; i++) {
        var name = parent.inputList[i]['name'];

        if(absolute) {
            // if input value == 'Variable' then return name of this field
            if(parent.inputList[i].connection &&
              (parent.getInputTargetBlock(name)['type'] == 'python_variable_selector')) {
                return i;
            }
        } else {
            // only check for input types which can contain blocks
            if(parent.inputList[i].type == 1) {
                // if input value == 'Variable' then return name of this field
                if(parent.inputList[i].connection &&
                  (parent.getInputTargetBlock(name)['type'] == 'python_variable_selector')) {
                    return j;
                }
                j++;
            }
        }
    }
}

// checks if the selected variable is valid
function checkIfVariableValid(parent, parentInput, variable) {
    for(var i = 0; i < parent.typeVecs.length; i++) {
        if(parent.typeVecs[i][parentInput] == getVarTypeFromBlocks(variable)) {
            return true;
        }
    }
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
