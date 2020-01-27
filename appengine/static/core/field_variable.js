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
Blockly.modalWindow.visible = false;

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

Blockly.modalWindow.preview = {}

Blockly.modalWindow.preview.name = 'default';
Blockly.modalWindow.preview.type = '';

Blockly.modalWindow.primitiveVariables = ['int', 'float', 'str', 'bool', 'range'];
Blockly.modalWindow.complexVariables = ['list of...', ]; // nested lists, iterables

// for selecting #1 - an existing variable or #2 creating a new one
Blockly.modalWindow.selectVariable = function() {
    Blockly.modalWindow.visible = true;

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

    function checkTypeVecs() {
        var j = Blockly.Variables.getParentInput(parent);
        for(var k = 0; k < parent.typeVecs.length; k++) {
            if(parent.typeVecs[k][j] == variables[i].type ||
                parent.typeVecs[k][j] == "any" ||
                parent.typeVecs[k][j] == "*any") {
                return true
            }
        }
    }

    for(i = 0; i < variables.length; i++) {
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

    cancel.classList.add('fancybuttons');
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
    var inputContainer = document.createElement('div');
    inputContainer.id = 'inputContainer';
    container.appendChild(inputContainer);
    // name input
    var nameContainer = document.createElement('div');
    inputContainer.appendChild(nameContainer);
    var nameLabel = document.createElement('label');
    nameLabel.classList.add('label');
    nameLabel.textContent = 'Name';
    nameContainer.appendChild(nameLabel);
    var nameInput = document.createElement('input');
    nameInput.id = 'variableName';
    nameInput.classList.add('input');
    nameInput.addEventListener('input', nameInputListener);
    nameContainer.appendChild(nameInput);

    // type input
    var typeContainer = document.createElement('div');
    inputContainer.appendChild(typeContainer);
    var typeLabel = document.createElement('label');
    typeLabel.classList.add('label');
    typeLabel.textContent = 'Type';
    typeContainer.appendChild(typeLabel);
    var typeInput = document.createElement('select');
    typeInput.id = 'variableType';
    typeInput.classList.add("input");
    typeInput.classList.add("variableTypeInput");
    setOptions(getOptions(), typeInput);
    typeInput.addEventListener('change', typeInputListener);
    typeContainer.appendChild(typeInput);

    // block preview
    var previewContainer = document.createElement('div');
    previewContainer.id = 'previewContainer';
    container.appendChild(previewContainer);

    var previewType = document.querySelectorAll(".variableTypeInput")[0].value;
    Blockly.modalWindow.preview.type = previewType;
    var block = Blockly.Variables.newVariableBlock({
        "name": Blockly.modalWindow.preview.name,
        "type": previewType
    });
    fixNesting()

    Blockly.modalWindow.preview.block = Blockly.Xml.domToBlock(workspace, block);
    var previewBlock = Blockly.modalWindow.preview.block;
    // append block to container

    // buttons
    var create = document.createElement('button');
    create.id = 'createButton';
    container.appendChild(create);
    create.classList.add('fancybuttons');
    create.classList.add('modalButtons');
    create.textContent = 'Create';
    create.onclick = Blockly.modalWindow.createVariable.create;
    create.disabled = true;

    create.addEventListener('mouseover', displayReason);

    var reason = document.createElement('p');
    reason.id = 'reason';
    create.appendChild(reason);
    reason.style.display = 'none';

    var cancel = document.createElement('button');
    container.appendChild(cancel);

    cancel.classList.add('fancybuttons');
    cancel.classList.add('modalButtons');
    cancel.textContent = 'Cancel';
    cancel.onclick = Blockly.modalWindow.cancel;
}

// NAME INPUT FUNCTIONS

// validation on input for name input
function nameInputListener(ev) {
    // get inputs
    var variableName = document.getElementById('variableName').value;
    // validate inputs
    var validity = checkIfNameValid(variableName);
    var valid = validity[0];
    var reason = validity[1];

    var createButton = document.getElementById('createButton');
    var reasonEl = document.getElementById("reason");
    // if name is invalid make warning icon visible
    if(valid) {
        // make icon invisible

        // enable create button
        createButton.disabled = false;
        // remove hover text

        // update preview
        var preview = Blockly.modalWindow.preview;

        var block = Blockly.modalWindow.preview.block;
        block.renameVar(preview.name, variableName);
        preview.name = variableName;

        createButton.reason = '';
        reasonEl.style.display = 'none';

    } else {
        // make icon visible

        // disable create button
        createButton.disabled = true;
        // add hover text
        createButton.reason = reason;
    }
}

function checkIfNameValid(name) {
    // check if name is valid
    // check there is a name
    if(!name) {
        return [false, "There must be a name"];
    }

    // check name isn't reserved
    var reservedWords = Blockly.Python.RESERVED;
    for(var i = 0; i < reservedWords.length; i++) {
        if(name == reservedWords[i]) {
            return [false, reservedWords[i] = " is a reserved word"];
        }
    }

    // check name starts with letter or _, followed by letters, numbers and _
    var re = new RegExp(`^([a-zA-Z]|_)([a-zA-Z]|[0-9]|_)*$`)
    if(!re.test(name)) {
        return [false, "Name must follow python syntax"];
    }

    // check name is unique
    if(name != Blockly.Python.makeNameUnique(name, Blockly.Variables.allVariables(workspace, true, true))) {
        return [false, "Name is not unique"];
    }

    return [true, "Valid"];
}

// display reason why create button can't be clicked on mouseover event
function displayReason(ev) {
    var createButton = document.getElementById('createButton');
    var reason = document.getElementById("reason");

    //reason.style.display = 'block';
    reason.textContent = createButton.reason;
}

// TYPE INPUT FUNCTIONS

/*
function typeInputListener(ev) {
    // construct type as object
    variableType = {};

    var variableTypeInputs = document.querySelectorAll(".variableTypeInput");

    // unpack variableType into typeVec

}
*/

function typeInputListener(ev) {
    fixNesting();

    var variableTypeInputs = document.querySelectorAll(".variableTypeInput");

    // construct typeVec
    var typeVec = "";
    for(var i = 0; i < variableTypeInputs.length; i++) {
        // for every list add * to the beginning
        if(variableTypeInputs[i].value == "list of...") {
            typeVec = "*" + typeVec;
        } else {
            // once we reach the last element of the nesting then add the actual type
            typeVec = typeVec + variableTypeInputs[i].value;
        }
        // else do stuff for other complex types
    }

    // update preview
    var preview = Blockly.modalWindow.preview;
    var previewBlock = preview.block;

    previewBlock.setTypeVecs([[typeVec]]);
    // seems kind of hacky
    if(Blockly.modalWindow.primitiveVariables.includes(typeVec)) {
        previewBlock.reType();
    } else {
        previewBlock.setOutput(true);
    }

    preview.type = typeVec;
}

function fixNesting() {
    // get initial list of inputs
    var variableTypeInputs = Array.from(document.querySelectorAll(".variableTypeInput"));

    /* invalid nesting contains;
          - the final set of inputs, not being primitive types
          - set of inputs preceding final set of inputs being primitive types
    */
    var validNesting = false; // make sure we check at least once
    while(!validNesting) {
        validNesting = true; // wait until we are proven wrong

        // amount of inputs to check depends on type preceding set of end inputs
        var size = -1; // for now
        // check final input/inputs - would need to be updated for tuple/dictionary/set
        var finalInputs = variableTypeInputs.slice(size);
        for(var i = 0; i < finalInputs.length; i++) {
            if(!Blockly.modalWindow.primitiveVariables.includes(finalInputs[i].value)) {
                validNesting = false;
                break;
            }
        }
        // check set of inputs preceding final set of inputs
        for(var i = 0; i < variableTypeInputs.length - finalInputs.length; i++) {
            if(Blockly.modalWindow.primitiveVariables.includes(variableTypeInputs[i].value)) {
                validNesting = false;
                break;
            }
        }

        // if nesting is not valid then prompt more ui
        if(!validNesting) {
            switch(variableTypeInputs[i].value) {
                case "list of...":
                    addVariableTypeInput();
                default:
                    // must be primitive type followed by complex type
                    for(i++; i < variableTypeInputs.length; i++) {
                        variableTypeInputs[i].remove();
                    }
            }
        }

        // lastly reget variableTypeInputs list as we have updated the dom
        variableTypeInputs = Array.from(document.querySelectorAll(".variableTypeInput"));
    }
}

// add a new type input element to modal window
function addVariableTypeInput() {
    // get container
    var container = document.getElementById('inputContainer');
    // create dom
    var newVariableTypeInput = document.createElement('select');
    newVariableTypeInput.classList.add("input");
    newVariableTypeInput.classList.add("variableTypeInput");
    setOptions(getOptions(), newVariableTypeInput);
    newVariableTypeInput.addEventListener('change', typeInputListener);
    // append
    container.appendChild(newVariableTypeInput);
}

// set options in dropdown for creating a variable according to parent block
function setOptions(options, selectElement) {
    for(var i = 0; i < options.length; i++) {
        var option = document.createElement('option');
        option.value = options[i];
        option.textContent = options[i];

        selectElement.add(option);
    }
}

// gets options for variable block to be
function getOptions() {
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

            /*
            // check if matching in the typeVec
            if(typeVec == "matching") {
                // then add everytime primitive type that we don't already have
                var primitiveTypes = Blockly.modalWindow.primitiveVariables;
                for(var j = 0; j < primitiveTypes.length; j++) {
                    if(options.includes(primitiveTypes[j])) {
                        options.push(primitiveTypes[j]);
                    }
                }
            }
            */

            // other is a primitive type
            if(!options.includes(typeVec)) {
                options.push(typeVec);
            }
        }

        // unpack nested types, eg. *int for list of ints

    } else {
        options = options.concat(Blockly.modalWindow.primitiveVariables);
        options = options.concat(Blockly.modalWindow.complexVariables);
    }

    // check if any/*any is in options
    // check if matching/*matching is in options
    if(options.includes('any') || options.includes('matching')) {
        if(options.includes('*any') || options.includes('*matching')) {
            // any and *any
            options = Blockly.modalWindow.primitiveVariables;
            options = options.concat(Blockly.modalWindow.complexVariables);
        } else {
            // just any
            options = Blockly.modalWindow.primitiveVariables;
        }
    } else if(options.includes('*any') || options.includes('*matching')) {
        // just *any
        options = Blockly.modalWindow.complexVariables;
    }

    return options;
}

Blockly.modalWindow.dispose = function() {
    document.getElementById('modalWindow').remove();
}

Blockly.modalWindow.preview.dispose = function() {
    if(Blockly.modalWindow.preview.block) {
        Blockly.modalWindow.preview.block.dispose();
        Blockly.modalWindow.preview.name = 'default';
        Blockly.modalWindow.preview.type = 'int';
        Blockly.modalWindow.preview.block = undefined;
    }
}

Blockly.modalWindow.cancel = function() {
    Blockly.modalWindow.dispose();
    Blockly.modalWindow.backdrop.dispose();
    Blockly.modalWindow.preview.dispose()
    Blockly.Variables.getSelectorBlock().dispose();

    Blockly.modalWindow.visible = false;
}

Blockly.modalWindow.selectVariable.select = function() {
    // returns python type from list
    function findType(classList) {
        var types = ["int", "float", "str", "bool", "range"]; // for now
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

    Blockly.modalWindow.visible = false;

    // fire onchange event
    block.onchange();
}

Blockly.modalWindow.selectVariable.newVariable = function() {
    Blockly.modalWindow.dispose();
    Blockly.modalWindow.createVariable();
}

Blockly.modalWindow.createVariable.create = function() {
    var block = Blockly.Variables.getSelectorBlock();

    // use preview to build block
    var preview = Blockly.modalWindow.preview;
    block.varName = preview.name;
    block.varType = preview.type;

    Blockly.modalWindow.dispose();
    Blockly.modalWindow.backdrop.dispose();
    Blockly.modalWindow.preview.dispose();

    Blockly.modalWindow.visible = false;

    // fire onchange event
    block.onchange();
}
