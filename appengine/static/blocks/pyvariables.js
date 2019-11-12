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
    /**
     * block for create news vars and selecting existing ones
     * not for assignment
     *
     */
    /** log
     * currently initing to first existing var - seems ok
     * get blockToCode to recognise this as normal var block
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
            /* get list of exsiting vars and populate dropdown with them
            in format ["displayNameForItem", "varNameForItem"]
            .appendField(new Blockly.FieldDropdown(getVarList(this)),'varName')
            // drop down arrow
            .appendField(Blockly.FieldDropdown.ARROW_CHAR, 'arrow');
            */

        this.setInputsInline(true);
        this.setOutput(true);
    },

    onchange: function(ev) {
        /*
        if() {
            // when varName is set to new variable open model window
        }
        */
        // on drop - update options in dropdown
        if(this.parentBlock_ != null) {
            updateVarList(this);
            console.log("update dropdown");

            /*
            // bit of a hack -- doesnt even work
            // delete current dropdown - first element of array
            this.inputList[0].fieldRow.shift();
            // add new dropdown
            this.inputList[0].fieldRow.unshift(new Blockly.FieldDropdown(getVarList(this)));
            this.inputList[0].fieldRow.name = 'varName';
            */
        }

        // setTypeVecs as type of block selected/created
        this.setTypeVecs([[getVarType(this.getFieldValue('varName'))]]);
        this.reType();

        var code = Blockly.Python.valueToCode(this, 'varName', Blockly.Python.ORDER_NONE);

        // update tooltip
    }
};

// create var list according to valid blocks
function getVarList(block) {
    var variables = Blockly.Variables.allVariables(workspace, true, true);
    var varList = [];
    for(i = 0; i < variables.length; i++) {
        // limit vars
        var valid = true;

        // check parent block typeVecs
        try {
          if(this.parentBlock_ != null) {
              console.log("something");
          }
        } catch(err) {
          console.log(err);
        }

        if(valid) {
            varList.push([variables[i]["name"], variables[i]["name"]]);
        }
    }
    return varList;
}
// get type of var from var list
function getVarType(name) {
    var variables = Blockly.Variables.allVariables(workspace, true, true);
    for(i = 0; i < variables.length; i++) {
        if(name == variables[i]["name"]) {
            return variables[i]["type"];
        }
    }
    //return ['int'];
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
    var dropDownItems = getVarList(this);
    // add create var option
    //dropDownItems.unshift(['New-variable', 'rainbow']);

    input.appendField(new Blockly.FieldDropdown(dropDownItems), 'varName');
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
