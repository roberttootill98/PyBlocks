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
 * @fileoverview Variable input field.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldVariable');

goog.require('Blockly.FieldDropdown');
goog.require('Blockly.Msg');
goog.require('Blockly.Variables');
goog.require('goog.string');


/**
 * Class for a variable's dropdown field.
 * @param {?string} varname The default name for the variable.  If null,
 *     a unique variable name will be generated.
 * @param {Function=} opt_changeHandler A function that is executed when a new
 *     option is selected.  Its sole argument is the new option value.
 * @extends {Blockly.FieldDropdown}
 * @constructor
 */
Blockly.FieldVariable = function(varname, opt_changeHandler) {
    Blockly.FieldVariable.superClass_.constructor.call(this,
        Blockly.FieldVariable.dropdownCreate, null);
    this.setChangeHandler(opt_changeHandler);
    this.setValue(varname || '');
};
goog.inherits(Blockly.FieldVariable, Blockly.FieldDropdown);

/**
 * Sets a new change handler for angle field.
 * @param {Function} handler New change handler, or null.
 */
Blockly.FieldVariable.prototype.setChangeHandler = function(handler) {
    var wrappedHandler;
    if (handler) {
        // Wrap the user's change handler together with the variable rename handler.
        wrappedHandler = function(value) {
            var v1 = handler.call(this, value);
            if (v1 === null) {
                var v2 = v1;
            } else {
                if (v1 === undefined) {
                    v1 = value;
                }
                var v2 = Blockly.FieldVariable.dropdownChange.call(this, v1);
                if (v2 !== undefined) {
                    v2 = v1;
                }
            }
            return v2 === value ? undefined : v2;
        };
    } else {
        wrappedHandler = Blockly.FieldVariable.dropdownChange;
    }
    Blockly.FieldVariable.superClass_.setChangeHandler.call(this, wrappedHandler);
};

/**
 * Install this dropdown on a block.
 * @param {!Blockly.Block} block The block containing this text.
 */
Blockly.FieldVariable.prototype.init = function(block) {
    if (this.sourceBlock_) {
        // Dropdown has already been initialized once.
        return;
    }

    if (!this.getValue()) {
        // Variables without names get uniquely named for this workspace.
        if (block.isInFlyout) {
            var workspace = block.workspace.targetWorkspace;
        } else {
            var workspace = block.workspace;
        }
        this.setValue(Blockly.Variables.generateUniqueName(workspace));
    }
    Blockly.FieldVariable.superClass_.init.call(this, block);
};

/**
 * Get the variable's name (use a variableDB to convert into a real name).
 * Unline a regular dropdown, variables are literal and have no neutral value.
 * @return {string} Current text.
 */
Blockly.FieldVariable.prototype.getValue = function() {
    return this.getText();
};

/**
 * Set the variable name.
 * @param {string} text New text.
 */
Blockly.FieldVariable.prototype.setValue = function(text) {
    this.value_ = text;
    this.setText(text);
};

/**
 * Return a sorted list of variable names for variable dropdown menus.
 * Include a special option at the end for creating a new variable name.
 * @return {!Array.<string>} Array of variable names.
 * @this {!Blockly.FieldVariable}
 */
Blockly.FieldVariable.dropdownCreate = function() {
    /*  if (this.sourceBlock_ && this.sourceBlock_.workspace) {
        var variableList =
            Blockly.Variables.allVariables(this.sourceBlock_.workspace);
      } else {
        var variableList = [];
      }
      // Ensure that the currently selected variable is an option.
      var name = this.getText();
      if (name && variableList.indexOf(name) == -1) {
        variableList.push(name);
      }

      variableList.sort(goog.string.caseInsensitiveCompare);*/

    var variableList = [];
    variableList.push(Blockly.Msg.RENAME_VARIABLE);
    //  variableList.push(Blockly.Msg.NEW_VARIABLE);
    // Variables are not language-specific, use the name as both the user-facing
    // text and the internal representation.
    var options = [];
    for (var x = 0; x < variableList.length; x++) {
        options[x] = [variableList[x], variableList[x]];
    }
    return options;
};

/**
 * Event handler for a change in variable name.
 * Special case the 'New variable...' and 'Rename variable...' options.
 * In both of these special cases, prompt the user for a new name.
 * @param {string} text The selected dropdown menu option.
 * @return {null|undefined|string} An acceptable new variable name, or null if
 *     change is to be either aborted (cancel button) or has been already
 *     handled (rename), or undefined if an existing variable was chosen.
 * @this {!Blockly.FieldVariable}
 */
Blockly.FieldVariable.dropdownChange = function(text) {
    function promptName(promptText, defaultText) {
        Blockly.hideChaff();
        var newVar = window.prompt(promptText, defaultText);
        return newVar;
    }
    var workspace = this.sourceBlock_.workspace;
    var oldVar = this.getText();
    var newVar = promptName(Blockly.Msg.RENAME_VARIABLE_TITLE.replace('%1', oldVar),
        oldVar);
    if (!newVar || newVar == oldVar) {
        // No change to variable name.
        return null;
    }
    // Strip leading and trailing whitespace.
    newVar = newVar.replace(/^ +| +$/g, '');
    // If now empty ignore change.
    if (!newVar) {
        return null;
    }
    // Replace sequences of symbols with '_'.
    newVar = newVar.replace(/\W+/g, '_');
    // Prepend with '_' if begins with a digit.
    if ('0123456789'.indexOf(newVar[0]) != -1) {
        newVar = '_' + newVar;
    }

    var variables = Blockly.Variables.allVariables(workspace, true, true);
    newVar = Blockly.Python.makeNameUnique(newVar, variables);
    Blockly.Variables.renameVariable(oldVar, newVar, workspace);
    return newVar;
};

// custom variable pop up stuff
Blockly.modalWindow = {};

Blockly.modalWindow.backdrop = {};

Blockly.modalWindow.backdrop.create = function() {
    // create backdrop
    var backdrop = document.createElement('div');
    backdrop.id = 'backdrop';
    document.body.appendChild(backdrop);
}

Blockly.modalWindow.backdrop.get = function() {
    return document.getElementById('backdrop');
}

Blockly.modalWindow.backdrop.dispose = function() {
    Blockly.modalWindow.backdrop.get().remove();
}

// for selecting #1 - an existing variable or #2 creating a new one
Blockly.modalWindow.selectVariable = function() {
    // create a backdrop
    Blockly.modalWindow.backdrop.create();

    // create main dialog
    var container = document.createElement('div');
    container.id = 'modalWindow';
    // dynamically put container over block dragged in;
    Blockly.modalWindow.backdrop.get().appendChild(container);

    // html inside container
    var title = document.createElement('h3');
    container.appendChild(title);
    title.textContent = 'Variable Selection';

    // unorganised list of existing variables with new variable option at the bottom
    var list = document.createElement('ul');
    container.appendChild(list);

    // existing variables
    var variables = Blockly.Variables.allVariables(workspace, true, true);
    // if parent of block, then filter types based on typeVecs
    var block = Blockly.Variables.getSelectorBlock();
    for(i = 0; i < variables.length; i++) {
        function checkTypeVecs() {
            var j = Blockly.Variables.getParentInput(parent);
            for(var k = 0; k < parent.typeVecs.length; k++) {
                if(parent.typeVecs[k][j] == variables[i].type) {
                    return true
                }
            }
        }
        // skip variable if not valid for block dropped in to - not relevant to assignment
        if(block.type == "python_variable_selector") {
          var parent = block.getParent();
          if(parent) {
              if(!checkTypeVecs()) {
                  continue;
              }
          }
        }
        var item = document.createElement('li');
        list.appendChild(item);
        item.classList.add('variable');
        item.classList.add(variables[i].type);

        item.textContent = variables[i].name;
        // colour according to type

        item.onclick = Blockly.modalWindow.selectVariable.select;
    }
    // new variable
    var newVariableItem = document.createElement('li');
    list.appendChild(newVariableItem);
    newVariableItem.classList.add('variable');

    newVariableItem.textContent = 'New Variable';
    // colour as rainbow

    newVariableItem.onclick = Blockly.modalWindow.selectVariable.newVariable;

    // buttons
    var buttonContainer = document.createElement('div');
    container.appendChild(buttonContainer);

    var cancel = document.createElement('button');
    buttonContainer.appendChild(cancel);
    cancel.classList.add('modalButtons');
    cancel.textContent = 'Cancel';
    cancel.onclick = Blockly.modalWindow.cancel;
}

// for creating a new variable
Blockly.modalWindow.createVariable = function() {
    var container = document.createElement('div');
    container.id = 'modalWindow';
    // todo dynamically put container over block dragged in;
    Blockly.modalWindow.backdrop.get().appendChild(container);

    // html inside container
    var title = document.createElement('h3');
    container.appendChild(title);
    title.textContent = 'Variable Creation';

    // inputs
    var nameLabel = document.createElement('label');
    nameLabel.class = 'label';
    nameLabel.textContent = 'Name';
    container.appendChild(nameLabel);
    var nameInput = document.createElement('input');
    nameInput.id = 'variableName';
    nameInput.addEventListener('input', nameInputListener);
    container.appendChild(nameInput);

    var typeLabel = document.createElement('label');
    typeLabel.class = 'label';
    typeLabel.textContent = 'Type';
    container.appendChild(typeLabel);

    var typeInput = document.createElement('select');
    typeInput.id = 'variableType';
    setOptions(typeInput);
    container.appendChild(typeInput);

    // block preview
    /*
    var block = Blockly.Variables.newVariableBlock({
        "name": 'default',
        "type": 'int',
    });
    block = Blockly.Xml.domToBlock(workspace, block);
    */

    // buttons
    var buttonContainer = document.createElement('div');
    container.appendChild(buttonContainer);

    var create = document.createElement('button');
    buttonContainer.appendChild(create);
    create.classList.add('modalButtons');
    create.textContent = 'Create';
    create.onclick = Blockly.modalWindow.createVariable.create;

    var cancel = document.createElement('button');
    buttonContainer.appendChild(cancel);
    cancel.classList.add('modalButtons');
    cancel.textContent = 'Cancel';
    cancel.onclick = Blockly.modalWindow.cancel;
}

Blockly.modalWindow.createVariable.primitiveVariables = ['int', 'float', 'str', 'bool', 'range'];
Blockly.modalWindow.createVariable.complexVariables = ['list', 'dict']

// validation on input for name input
function nameInputListener(ev) {
    var name = document.getElementById('variableName').value;

    // check if name is valid
    var valid = true;
    // check there is a name
    if(!name) {
        valid = false;
    }
    // check name isn't reserved
    if(valid) { // save some time
        var reservedNames = Blockly.Python.RESERVED;
        for(var i = 0; i < reservedNames.length; i++) {
            if(name == reservedNames[i]) {
                valid = false;
            }
        }
    }
    // check name starts with letter or _, followed by letters, numbers and _
    var re = new RegExp(`^([a-zA-Z]|_)([a-zA-Z]|[0-9]|_)*$`)
    if(!re.test(name)) {
        valid = false;
    // check name is unique
    } else if(name != Blockly.Python.makeNameUnique(name, Blockly.Variables.allVariables(workspace, true, true))) {
        valid = false;
    }

    // if name is invalid make warning icon visible
    if(valid) {
        // make icon invisible
        console.log("valid");
    } else {
        // make visible
        console.log("invalid");
    }
}

// set options in dropdown for creating a variable according to parent block
function setOptions(select) {
    var block = Blockly.Variables.getSelectorBlock()
    var parent = block.getParent();

    var options = []

    // assignment statements aren't restricted by parent
    if(block.type == "python_variable_selector" && parent) {
        // get which parent input we are in
        var position = Blockly.Variables.getParentInput(parent, false);

        // loop over parent type vecs in position
        for(var i = 0; i < parent.typeVecs.length; i++) {
            var typeVec = parent.typeVecs[i][position];
            if(options.indexOf(typeVec) < 0) {
                options.push(typeVec);
            }
        }
    } else {
        options = options.concat(Blockly.modalWindow.createVariable.primitiveVariables);
        //options = options.concat(Blockly.modalWindow.createVariable.complexVariables);
    }

    // check if any/*any is in options
    if(options.indexOf('any') >= 0) {
        if(options.indexOf('*any') >= 0) {
            options = Blockly.modalWindow.createVariable.primitiveVariables;
            //options = options.concat(Blockly.modalWindow.createVariable.complexVariables);
            // any and *any
        } else {
            // just any
            options = Blockly.modalWindow.createVariable.primitiveVariables;
        }
    } else if(options.indexOf('*any') >= 0) {
        // just *any
        //options = Blockly.modalWindow.createVariable.complexVariables;
    }

    for(var i = 0; i < options.length; i++) {
        var option = document.createElement('option');
        option.value = options[i];
        option.textContent = options[i];

        select.add(option);
    }
}

Blockly.modalWindow.dispose = function() {
    document.getElementById('modalWindow').remove();
}

Blockly.modalWindow.cancel = function() {
    Blockly.modalWindow.dispose();
    Blockly.modalWindow.backdrop.dispose();
    Blockly.Variables.getSelectorBlock().dispose();
}

Blockly.modalWindow.selectVariable.select = function() {
    // returns python type from list
    function findType(classList) {
        var types = ["int", "float", "str", "bool"]; // for now
        for(i = 0; i < classList.length; i++) {
            if(types.includes(classList[i])) {
                return classList[i];
            }
        }
    }
    var block = Blockly.Variables.getSelectorBlock();

    block.varName = this.textContent;
    block.varType = findType(this.classList);

    Blockly.modalWindow.dispose();
    Blockly.modalWindow.backdrop.dispose();

    // fire onchange event
    block.onchange()
}

Blockly.modalWindow.selectVariable.newVariable = function() {
    Blockly.modalWindow.dispose();
    Blockly.modalWindow.createVariable();
}

Blockly.modalWindow.createVariable.create = function() {
    var block = Blockly.Variables.getSelectorBlock();

    // validate name
    block.varName = document.getElementById('variableName').value;
    block.varType = document.getElementById('variableType').value;

    Blockly.modalWindow.dispose();
    Blockly.modalWindow.backdrop.dispose();

    // fire onchange event
    block.onchange()
}
