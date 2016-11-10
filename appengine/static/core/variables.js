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
 * @fileoverview Utility functions for handling variables.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Variables');

// TODO(scr): Fix circular dependencies
// goog.require('Blockly.Block');
goog.require('Blockly.Workspace');
goog.require('goog.string');


/**
 * Category to separate variable names from procedures and generated functions.
 */
Blockly.Variables.CAT_EXISTING = 'VARIABLE';
Blockly.Variables.CAT_EXISTING_LIST = 'LIST_VAR'; // unused at present
Blockly.Variables.CAT_NEW_BASIC = 'NEW_VARIABLE';
Blockly.Variables.CAT_NEW_LIST = 'NEW_LIST_VAR';
Blockly.Variables.CAT_NEW_TURTLE = 'NEW_TURTLE_VAR';

/**
 * Find user-created variables.
 * @param {!Blockly.Block|!Blockly.Workspace} root Root block or workspace.
 * @param {boolean} basic Find basic variables.
 * @param {boolean} basic Find list variables.
 * @return {!Array.<string>} Array of variable names.
 */
Blockly.Variables.allVariables = function(root, basic, list) {
    console.log("VARLISTXXX start", variable);
    var blocks;
    if (root.getDescendants) {
        // Root is Block.
        blocks = root.getDescendants();
    } else if (root.getAllBlocks) {
        // Root is Workspace.
        blocks = root.getAllBlocks();
    } else {
        throw 'Not Block or Workspace: ' + root;
    }
    var variableHash = Object.create(null);
    // Iterate through every block and add each variable to the hash.
    for (var x = 0; x < blocks.length; x++) {
        if (blocks[x].getVar) {
            var variable = blocks[x].getVar();
            console.log("VARLISTXXX found", variable);
            if (variable.type[0] == '*') {
                if (list) {
                    variableHash[variable.name] = variable.type;
                }
            } else if (basic) {
                variableHash[variable.name] = variable.type;
            }
        }
    }
    console.log("VARLISTXXX hash", variableHash);
    // Flatten the hash into a list.
    var variableList = [];
    for (var name in variableHash) {
        variableList.push({
            name: name,
            type: variableHash[name]
        });
    }
    console.log("VARLISTXXX", variableList);
    return variableList;
};

/**
 * Find all instances of the specified variable and rename them.
 * @param {string} oldName Variable to rename.
 * @param {string} newName New variable name.
 * @param {!Blockly.Workspace} workspace Workspace rename variables in.
 */
Blockly.Variables.renameVariable = function(oldName, newName, workspace) {
    var blocks = workspace.getAllBlocks();
    // Iterate through every block.
    for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].renameVar) {
            blocks[i].renameVar(oldName, newName);
        }
    }
};

Blockly.Variables.newFlyoutCategory = function(workspace) {
    return Blockly.Variables.flyoutCategory(workspace,
        Blockly.Python.NEW_VARS);
};

Blockly.Variables.newTurtleFlyoutCategory = function(workspace) {
    return Blockly.Variables.flyoutCategory(workspace,
        Blockly.Python.NEW_TURTLE_VARS);
};

Blockly.Variables.newListFlyoutCategory = function(workspace) {
    return Blockly.Variables.flyoutCategory(workspace,
        Blockly.Python.NEW_LIST_VARS);
};

Blockly.Variables.existingFlyoutCategory = function(workspace) {
    console.log("calling VARLISTXXX");
    var variableList = Blockly.Variables.allVariables(workspace, true, true);
    console.log("called VARLISTXXX");
    return Blockly.Variables.flyoutCategory(workspace,
        variableList);
};

Blockly.Variables.existingListFlyoutCategory = function(workspace) {
    var variableList = Blockly.Variables.allVariables(workspace, false, true);
    return Blockly.Variables.flyoutCategory(workspace,
        variableList, true);
};

/**
 * Construct the blocks required by the flyout for the variable category.
 * @param {!Blockly.Workspace} workspace The workspace contianing variables.
 * @param {boolean} lispOps Whether to display list indexing operations.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Blockly.Variables.flyoutCategory = function(workspace, vars, listOps) {
    var newVariableBlock = function(variable) {
        var block = goog.dom.createDom('block');
        block.setAttribute('type', 'variables_get');
        var field = goog.dom.createDom('field', null, variable.name);
        field.setAttribute('name', 'VAR');
        block.appendChild(field);
        var pyType = goog.dom.createDom('pytype', null, variable.type);
        block.appendChild(pyType);
        return block;
    };

    var xmlList = [];
    for (var i = 0; i < vars.length; i++) {
        // Create assignment block with variable on lhs.
        var block = goog.dom.createDom('block');
        block.setAttribute('type', 'variables_set');
        var value = goog.dom.createDom('value', null);
        value.setAttribute('name', 'VAR');
        block.appendChild(value);
        var pyType = goog.dom.createDom('pytype', null, vars[i].type);
        block.appendChild(pyType);
        var variable = newVariableBlock(vars[i]);
        value.appendChild(variable);
        block.setAttribute('gap', 8);
        xmlList.push(block);

        // Add list item modification for existing list variable
        //  if (listOps) {
        //    block = goog.dom.createDom('block');
        //    block.setAttribute('type', 'list_variable_index_get');
        //  }


        // Create variable value block.
        block = newVariableBlock(vars[i]);
        xmlList.push(block);

        /* Add list indexing for existing list variable
        if (listOps) {
          block.setAttribute('gap', 8);
          // Create list indexing block.
          block = goog.dom.createDom('block');
          block.setAttribute('type', 'list_variable_index_get');
          var lhsValue = goog.dom.createDom('value', null);
          lhsValue.setAttribute('name', 'ARG1');
          block.appendChild(lhsValue);
          pyType = goog.dom.createDom('pytype', null, vars[i].type);
          block.appendChild(pyType);
          var variable = newVariableBlock(vars[i]);
          lhsValue.appendChild(variable);
          xmlList.push(block);
        } */
    }
    return xmlList;
};

/**
 * Return a new variable name that is not yet being used. This will try to
 * generate single letter variable names in the range 'i' to 'z' to start with.
 * If no unique name is located it will try 'i' to 'z', 'a' to 'h',
 * then 'i2' to 'z2' etc.  Skip 'l'.
 * @param {!Blockly.Workspace} workspace The workspace to be unique in.
 * @return {string} New variable name.
 */
Blockly.Variables.generateUniqueName = function(workspace) {
    var variableList = Blockly.Variables.allVariables(workspace, true, true);
    var newName = '';
    if (variableList.length) {
        var nameSuffix = 1;
        var letters = 'ijkmnopqrstuvwxyzabcdefgh'; // No 'l'.
        var letterIndex = 0;
        var potName = letters.charAt(letterIndex);
        while (!newName) {
            var inUse = false;
            for (var i = 0; i < variableList.length; i++) {
                if (variableList[i].name == potName) {
                    // This potential name is already used.
                    inUse = true;
                    break;
                }
            }
            if (inUse) {
                // Try the next potential name.
                letterIndex++;
                if (letterIndex == letters.length) {
                    // Reached the end of the character sequence so back to 'i'.
                    // a new suffix.
                    letterIndex = 0;
                    nameSuffix++;
                }
                potName = letters.charAt(letterIndex);
                if (nameSuffix > 1) {
                    potName += nameSuffix;
                }
            } else {
                // We can use the current potential name.
                newName = potName;
            }
        }
    } else {
        newName = 'i';
    }
    return newName;
};
