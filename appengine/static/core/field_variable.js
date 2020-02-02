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
Blockly.modalWindow.allTypes = Blockly.modalWindow.primitiveVariables.concat(Blockly.modalWindow.complexVariables);

Blockly.modalWindow.typeVecObject = {};

// for selecting #1 - an existing variable or #2 creating a new one
Blockly.modalWindow.selectVariable = function() {
    Blockly.modalWindow.visible = true;

    // create a backdrop
    Blockly.modalWindow.backdrop.create();

    // create main dialog
    var container = document.createElement('div');
    container.id = 'modalWindow';
    // drag event listeners - allow window to be moved
    container.draggable = true;
    container.addEventListener('dragend', dragEndModalWindow);

    // start window in middle of page
    container.style.left = '50%';
    container.style.top = '5em';

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
Blockly.modalWindow.createVariable = function(x, y) {
    var container = document.createElement('div');
    container.id = 'modalWindow';
    // drag event listeners - allow window to be moved
    container.draggable = true;
    container.addEventListener('dragend', dragEndModalWindow);

    // set position as same as last
    container.style.left = x;
    container.style.top = y;

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

    initTypeInputs();

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

    Blockly.modalWindow.preview.block = Blockly.Xml.domToBlock(workspace, block);
    var previewBlock = Blockly.modalWindow.preview.block;
    updatePreviewType();
    // append block to container
    // maybe we have to create a workspace to put the block in?
    // create a blockly block canvas
    var myCanvas = Blockly.createSvgElement('g', {'class': 'blocklyBlockCanvas'}, this.svgGroup_, this);

    // apply translation
    var x = 200;
    var y = 100;
    var scale = 1;
    var translation = 'translate(' + x + ',' + y + ') ' + 'scale(' + scale + ')';
    myCanvas.setAttribute('transform', translation);

    /*
    Blockly.Workspace();
    Blockly.Workspace.prototype.addTopBlock(previewBlock);
    */

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

function dragEndModalWindow(ev) {
    var x = ev.screenX;
    var y = ev.screenY;

    var el = ev.toElement;
    var height = el.clientHeight;
    var width = el.clientWidth;
    el.style.top = (y - height/2) + 'px';
    el.style.left = x + 'px';
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

function typeInputListener(ev) {
    // react to type inputs being used
    // case 1 - primitive type is selected at last input
    //    update preview
    // case 2 - primitive type is selected before last input
    //    delete inputs after input
    //    if we have a parent
    //        move marker to correct level
    //    update preview
    // case 3 - complex type is selected at last input
    //    prompt new ui after last input
    //    if we have a parent
    //        move marker to next level
    //    update preview
    // case 4 - different complex type is selected before last input (shouldn't be possible yet)
    //    delete inputs after input
    //    prompt new ui after input
    //    if we have a parent
    //        move marker to next level
    //    update preview

    // get block
    var block = Blockly.Variables.getSelectorBlock();
    // get parent
    var parent = block.getParent();

    // get type inputs
    var typeInputs = document.querySelectorAll(".variableTypeInput");

    var typeVecObject = Blockly.modalWindow.typeVecObject;

    // case 2
    var primitiveBeforeLast = false;
    // loop through type inputs to check if we have a
    for(var i = 0; i < typeInputs.length - 1; i++) {
        if(Blockly.modalWindow.primitiveVariables.includes(typeInputs[i].value)) {
            // we have primitive before end
            primitiveBeforeLast = true;
            break;
        }
    }

    // case 3
    var lastInput = typeInputs[typeInputs.length - 1];

    if(primitiveBeforeLast) {
        // delete all inputs after index i
        var indexOfLastInput = i;
        for(i++; i < typeInputs.length; i++) {
            typeInputs[i].remove();
        }

        if(parent) {
            // move marker to typeVecObject level i;
            // should take i amount of keys to reach from base level
            var results = getCurrentLevel(typeVecObject, []);
            var currentLevel = results[0];
            var keys = results[1];

            // delete marker
            delete currentLevel['marker'];

            var level = typeVecObject;
            for(var j = 0; j < indexOfLastInput; j++) {
                level = level[keys[j]];
            }

            level['marker'] = true;
        }
    } else if(!Blockly.modalWindow.primitiveVariables.includes(lastInput)) {
        // case 3
        // prompt some more ui
        switch(lastInput.value) {
           case "list of...":
              if(parent) {
                  // should be last level
                  var currentLevel = getCurrentLevel(typeVecObject, [])[0];

                  // get new level
                  var newLevel = currentLevel["list of..."];

                  // move marker to next level
                  delete currentLevel['marker'];
                  newLevel['marker'] = true;

                  // add a new input element
                  createTypeInput(Object.keys(newLevel));
              } else {
                  // add another input with all options
                  createTypeInput(Blockly.modalWindow.allTypes);
              }
              break;
           default:
              console.log();
        }
    }

    // update preview
    // all cases
    updatePreviewType();
}

// init modalWindow type inputs
function initTypeInputs() {
    var block = Blockly.Variables.getSelectorBlock();
    var parent = block.getParent();

    if(parent) {
        var typeVecObject = constructTypeVecObject(parent);
        var returnKeys = getCurrentLevel(typeVecObject, [])[1];

        // type input for each key to get to current level
        var currentLevel = typeVecObject;
        for(var i = 0; i < returnKeys.length + 1; i++) {
            // add a select element with options for all keys at current level
            createTypeInput(Object.keys(currentLevel));

            // move onto next level of object
            currentLevel = currentLevel[returnKeys[i]];
        }
    } else {
        var typeVecObject = {};

        createTypeInput(Blockly.modalWindow.allTypes);
    }

    Blockly.modalWindow.typeVecObject = typeVecObject;
}

// creates and appends a select element with options passed
function createTypeInput(options) {
    // add input elements to modal window
    // get container
    var container = document.getElementById('inputContainer');
    // create dom
    var newVariableTypeInput = document.createElement('select');
    newVariableTypeInput.classList.add("input");
    newVariableTypeInput.classList.add("variableTypeInput");

    for(var i = 0; i < options.length; i++) {
        if(options[i] == "marker") {
            continue;
        }

        var option = document.createElement('option');
        option.value = options[i];
        option.textContent = options[i];

        newVariableTypeInput.add(option);
    }
    newVariableTypeInput.addEventListener('change', typeInputListener);
    // append
    container.appendChild(newVariableTypeInput);
}

function updatePreviewType() {
    // get typeVec
    var typeVec = "";

    // use input list
    var typeInputs = document.querySelectorAll(".variableTypeInput");
    for(var i = 0; i < typeInputs.length; i++) {
        switch(typeInputs[i].value) {
          case "list of...":
              typeVec = typeVec + "*";
              break;
          default:
              typeVec = typeVec + typeInputs[i].value;
              break;
        }
    }

    var preview = Blockly.modalWindow.preview;
    preview.type = typeVec;

    preview.block.setTypeVecs([[typeVec]]);
    preview.block.render();
}

function constructTypeVecObject(block) {
    var parentInput = Blockly.Variables.getParentInput(block, false);

    // create object with marker at lowest level
    var typeVecObject = {"marker": true};

    var typeVecs = block.typeVecs;

    // iterate over each parent typeVec
    for(var i = 0; i < typeVecs.length; i++) {
        var typeVec = typeVecs[i][parentInput];

        // iterate over string
        for(var j = 1; j < typeVec.length + 1; j++) {
            var results = getCurrentLevel(typeVecObject, []);
            var currentLevel = results[0];
            var keys = results[1];

            switch(typeVec.slice(0, j)) {
                case "*":
                    // list of

                    // check if we don't have list of already in typeVecObject at current level
                    if(!Object.keys(currentLevel).includes("list of...")) {
                        // then add a list as a key
                        // use keys to place new key at right place
                        //var item = typeVecObject;

                        if(keys.length > 0) {
                            // eg. list of tuple or list of list of

                            // use key to place object
                            item[keys[keys.length - 1]] = "something";
                            // delete marker from previous location
                            delete currentLevel['marker'];
                            // add marker to new level
                            // do something
                        } else {
                            currentLevel["list of..."] = {};
                            // delete marker from previous location
                            delete currentLevel['marker'];
                            // add marker to new level
                            currentLevel["list of..."]["marker"] = true;
                        }
                        // move marker to this level
                    } else {
                        // still move marker to next level
                        // delete marker from previous location
                        delete currentLevel['marker'];
                        // add marker to new level
                        currentLevel["list of..."]["marker"] = true;
                    }

                    // since this isn't a primitive type then move marker to next level

                    // update typeVec string
                    typeVec = typeVec.slice(j, typeVec.length);
                    break;
                case "any":
                    // add all primitive types
                    for(var k = 0; k < Blockly.modalWindow.primitiveVariables.length; k++) {
                        currentLevel[Blockly.modalWindow.primitiveVariables[k]] = {};
                        typeVec = typeVec.slice(j, typeVec.length);
                    }
                    break;
                case "matching":
                    // add all primitive types
                    for(var k = 0; k < Blockly.modalWindow.primitiveVariables.length; k++) {
                        currentLevel[Blockly.modalWindow.primitiveVariables[k]] = {};
                        typeVec = typeVec.slice(j, typeVec.length);
                    }
                    break;
                default:
                    // might be primitive type
                    if(Blockly.modalWindow.primitiveVariables.includes(typeVec.slice(0, j))) {
                        currentLevel[typeVec.slice(0, j)] = {};

                        // update typeVec string
                        typeVec = typeVec.slice(j, typeVec.length);
                    }
            }
        }

        // place key back at lowest level
        // remove marker currently in object
        currentLevel = getCurrentLevel(typeVecObject, [])[0];
        delete currentLevel['marker'];

        // add marker at lowest level
        typeVecObject['marker'] = true;
    }

    // remove marker currently in object
    currentLevel = getCurrentLevel(typeVecObject, [])[0];
    delete currentLevel['marker'];

    // add marker at lowest possible level
    addMarkerAtLowestLevel(typeVecObject);
    return typeVecObject;
}

// gets current level in typeVecObject
// returns typeVecObject at level of marker and instructions on how to get there
// instructions in form on list of keys
function getCurrentLevel(typeVecObject, returnKeys) {
    var iterateKeys = Object.keys(typeVecObject);

    // iterate over keys
    for(var i = 0; i < iterateKeys.length; i++) {
        var key = iterateKeys[i];

        if(Blockly.modalWindow.primitiveVariables.includes(key)) {
            // if key is primitive then we ignore it
            continue;
        } else if(key == "marker") {
            // success!
            // don't push current key
            return [typeVecObject, returnKeys];
        // check that another object exists within our key so we can traverse it
        } else if(typeVecObject[key] instanceof Array) {
            // so if array then ignore
            continue;
        } else {
            // make recursive call with current level
            returnKeys.push(key);
            var results = getCurrentLevel(typeVecObject[key], returnKeys);
            if(results) {
                // only return if we get something
                return results;
            } else {
                returnKeys.pop();
                continue;
            }
        }
    }
}

// find lowest level with a primitive type in
// and add a marker there
// if there are multiple lowest layers it just add marker to first key
function addMarkerAtLowestLevel(typeVecObject) {
    var keys = Object.keys(typeVecObject);

    // iterate through object until we find a primitive type
    for(var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if(Blockly.modalWindow.primitiveVariables.includes(key)) {
            typeVecObject["marker"] = true;
            return;
        } else if(key == "items") {
            // contains items as key, therefore complex type contents about to follow
            // so check contents of complex type
            var items = typeVecObject[key];
            if(Array.isArray) {
                // is a list
                for(var j = 0; j < items.length; j++) {
                    if(Blockly.modalWindow.primitiveVariables.includes(items[j])) {
                        // we've found a primitive type
                        // so add marker and return
                        typeVecObject["marker"] = true;
                        return;
                    } else {
                        // we have another complex type
                        return addMarkerAtLowestLevel(typeVecObject[key]);
                    }
                }
            }
        } else {
            return addMarkerAtLowestLevel(typeVecObject[key]);
        }
    }
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
    var modalWindow = document.getElementById('modalWindow');
    Blockly.modalWindow.dispose();
    Blockly.modalWindow.createVariable(modalWindow.style.left, modalWindow.style.top);
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
