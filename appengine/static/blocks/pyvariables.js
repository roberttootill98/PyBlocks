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
        this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
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
        // this.vn = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_NONE);
        // console.log('TRAXIS', this.vn);

        if (Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'VALUE', Blockly.Python.ORDER_NONE) != '') {
            this.holesFilled = true;
        } else {
            this.holesFilled = false;
        }

        if (this.getSurroundParent() != null && (this.getSurroundParent().type == 'python_if' || this.getSurroundParent().type == 'python_while' || this.getSurroundParent().type == 'python_for')) {
            this.declaredVar = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_NONE) + '_CTRL';
        } else {
            this.declaredVar = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_NONE) + '_NOCTRL';
        }
        //console.log('DECVAR', this.declaredVar);
    }
};

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
