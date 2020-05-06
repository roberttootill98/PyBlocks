/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2011 Google Inc.
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
 * @fileoverview Modal windows for creating and selecting variables.
 * @author fraser@google.com (Neil Fraser)
 */

Blockly.modalWindow = {};
Blockly.modalWindow.visible = false;

//Blockly.modalWindow.backdrop = {};

/**
 * Creates a new backdrop
 * @constructor
 */
Blockly.modalWindow.backdrop = function() {
    // create backdrop
    var backdrop = document.createElement('div');
    backdrop.id = 'backdrop';
    document.body.appendChild(backdrop);
}

/**
 * Gets the HTML element of the backdrop
 * @return {element} backdrop div element
 */
Blockly.modalWindow.backdrop.get = function() {
    return document.getElementById('backdrop');
}

/**
 * Disposes of the backdrop HTML element
 */
Blockly.modalWindow.backdrop.dispose = function() {
    Blockly.modalWindow.backdrop.get().remove();
}

// preview properties
Blockly.modalWindow.preview = {}

Blockly.modalWindow.preview.name = 'default';
Blockly.modalWindow.preview.type = '';

Blockly.modalWindow.basicTypes = ['int', 'float', 'str', 'bool', 'range'];
Blockly.modalWindow.compositeTypes = ['list of...', ]; // expand in future
Blockly.modalWindow.allTypes = Blockly.modalWindow.basicTypes.concat(Blockly.modalWindow.compositeTypes);

Blockly.modalWindow.typeVecObject = {};

/**
 * Creates the selection modal window
 */
Blockly.modalWindow.selectVariable = function() {
    Blockly.modalWindow.type = 'select';
    Blockly.modalWindow.visible = true;

    // create a backdrop
    Blockly.modalWindow.backdrop();

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
    title.textContent = 'Select or Create a Variable';

    // table approach
    var table = document.createElement('table');
    container.appendChild(table);

    // get blocks for workspace
    var variables = Blockly.Variables.allVariables(workspace, true, true);
    var block = Blockly.Variables.getSelectorBlock();
    var parent = block.getParent();
    var blocks = [];

    function addOption() {
        // create row for these items
        var row = document.createElement('tr');
        table.appendChild(row);
        row.id = variables[i].name + '/' + variables[i].type;

        // attach button
        var selectTD = document.createElement('td');
        row.appendChild(selectTD);
        selectTD.classList.add('selectTD');
        var selectButton = document.createElement('button');
        selectTD.appendChild(selectButton);
        selectButton.classList.add('fancybuttons');
        selectButton.classList.add('selectButton');
        selectButton.textContent = 'Select:';
        selectButton.onclick = Blockly.modalWindow.selectVariable.select;

        // attach workspace
        var workspaceTD = document.createElement('td');
        row.appendChild(workspaceTD);
        var workspaceContainer = document.createElement('div');
        workspaceContainer.classList.add('workspaceContainer');
        workspaceTD.appendChild(workspaceContainer);
        var selectionWorkspace = Blockly.inject(workspaceContainer, {
            media: '../../media/',
            trashcan: false
        });

        // put block into workspace
        var block = Blockly.Variables.newVariableBlock({
            "name": variables[i].name,
            "type": variables[i].type
        });
        block = Blockly.Xml.domToBlock(selectionWorkspace, block);

        // update workspace
        selectionWorkspace.padding = 20;
        resizeWorkspaceAroundBlock(selectionWorkspace, workspaceContainer, block);
        blendWorkspace(selectionWorkspace);

        moveBlockToCenter(block, selectionWorkspace)
        makeBlockNonInteractable(block);
    }

    if(block.type != 'python_variable_selector_assignment' &&
      parent && !Blockly.Variables.unrestrictedTypeVec(block, parent)) {
        // if we have a parent, limit blocks

        // get typeVecs
        var typeVecs = parent.typeVecs;

        // get parent input
        var parentInput = block.outputConnection.targetConnection.inputNumber_;

        // check if typeVecs contains a typeVec which is unrestricted

        // iterate over variables and remove variables that are not in typeVecs
        for(var i = 0; i < variables.length; i++) {
            // iterate over typeVecs at parentInput and check if we have a match
            for(var j = 0; j < typeVecs.length; j++) {
                // if we have a match then break out
                if(variables[i].type == typeVecs[j][parentInput]) {
                    addOption();
                    break;
                }
            }
        }
    } else {
        // else all variables
        for(var i = 0; i < variables.length; i++) {
            addOption()
        }
    }

    // buttons
    var buttonContainer = document.createElement('div');
    container.appendChild(buttonContainer);
    buttonContainer.id = 'buttonContainer';

    // create new button
    var create = document.createElement('button');
    buttonContainer.appendChild(create);
    create.classList.add('fancybuttons');
    create.classList.add('modalButtons');
    create.textContent = 'Create new';
    create.onclick = Blockly.modalWindow.selectVariable.newVariable;

    // cancel button
    var cancel = document.createElement('button');
    buttonContainer.appendChild(cancel);
    cancel.classList.add('fancybuttons');
    cancel.classList.add('modalButtons');
    cancel.textContent = 'Cancel';
    cancel.onclick = Blockly.modalWindow.cancel;
}

/**
 * Creates the creation modal window
 */
Blockly.modalWindow.createVariable = function(x, y) {
    Blockly.modalWindow.type = 'create';
    Blockly.modalWindow.visible = true;

    var container = document.createElement('div');
    container.id = 'modalWindow';
    // drag event listeners - allow window to be moved
    container.draggable = true;
    container.addEventListener('dragend', dragEndModalWindow);

    // set position of modal window
    if(x && y) {
        // set position as same as last
        container.style.left = x;
        container.style.top = y;
    } else {
        // start window in middle of page
        container.style.left = '50%';
        container.style.top = '5em';
    }

    // create backdrop if we don't have one
    if(!Blockly.modalWindow.backdrop.get()) {
        // create a backdrop
        Blockly.modalWindow.backdrop();
    }
    Blockly.modalWindow.backdrop.get().appendChild(container);

    // html inside container
    var title = document.createElement('h3');
    container.appendChild(title);
    title.textContent = 'Create a Variable';

    // inputs
    var inputContainer = document.createElement('div');
    inputContainer.id = 'inputContainer';
    container.appendChild(inputContainer);
    // name input
    var nameContainer = document.createElement('div');
    inputContainer.appendChild(nameContainer);
    var nameLabel = document.createElement('label');
    nameLabel.classList.add('label');
    nameLabel.textContent = 'Name:';
    nameContainer.appendChild(nameLabel);
    var nameInput = document.createElement('input');
    nameInput.id = 'variableName';
    nameInput.classList.add('input');
    nameInput.addEventListener('input', nameInputListener);
    nameContainer.appendChild(nameInput)

    // type input
    var typeContainer = document.createElement('div');
    inputContainer.appendChild(typeContainer);
    typeContainer.id = 'typeContainer';
    // label
    var typeLabel = document.createElement('label');
    typeLabel.classList.add('label');
    typeLabel.textContent = 'Type:';
    typeContainer.appendChild(typeLabel);
    // inputs
    var typeInputContainer = document.createElement('span');
    typeContainer.appendChild(typeInputContainer);
    typeInputContainer.id = 'typeInputContainer';

    initTypeInputs();

    // block preview
    // create new workspace on modal window
    // create table
    var table = document.createElement('table');
    container.appendChild(table);
    // row
    var row = document.createElement('tr');
    table.appendChild(row);
    // label
    // td
    // var labelTD = document.createElement('td');
    // labelTD.id = 'labelTD';
    // row.appendChild(labelTD);
    // // contents
    // var label = document.createElement('p');
    // labelTD.appendChild(label);
    // label.textContent = 'Preview:';
    // // workspace
    // // td
    // var workspaceTD = document.createElement('td');
    // row.appendChild(workspaceTD);
    // contents
    var previewContainer = document.createElement('div');
    previewContainer.id = 'previewContainer';
    container.appendChild(previewContainer);

    var previewWorkspace = Blockly.inject(previewContainer, {
        media: '../../media/',
        trashcan: false
    });

    Blockly.modalWindow.preview.workspace = previewWorkspace;
    Blockly.modalWindow.preview.workspace.padding = 20;

    var previewType = document.querySelectorAll(".variableTypeInput")[0].value;
    Blockly.modalWindow.preview.type = previewType;

    // if block is assignment or not
    var blockType = Blockly.Variables.getSelectorBlock().type;
    if(blockType == 'python_variable_selector') {
        var block = Blockly.Variables.newVariableBlock({
            "name": Blockly.modalWindow.preview.name,
            "type": previewType
        });
    } else if(blockType == 'python_variable_selector_assignment') {
      var block = Blockly.Variables.newVariablesAssignmentBlock({
          "name": Blockly.modalWindow.preview.name,
          "type": previewType
      });
    }

    Blockly.modalWindow.preview.block = Blockly.Xml.domToBlock(previewWorkspace, block);
    var previewBlock = Blockly.modalWindow.preview.block;

    // update workspace
    blendWorkspace(previewWorkspace);
    updatePreviewType();

    // move previewBlock to centre of workspace
    resizePreviewWorkspace();
    moveBlockToCenter(previewBlock, previewWorkspace);
    makeBlockNonInteractable(previewBlock);

    // buttons
    var buttonContainer = document.createElement('div');
    buttonContainer.id = 'buttonContainer';
    container.appendChild(buttonContainer);

    var create = document.createElement('button');
    create.id = 'createButton';
    buttonContainer.appendChild(create);
    create.classList.add('fancybuttons');
    create.classList.add('modalButtons');
    create.textContent = 'Create';
    create.onclick = Blockly.modalWindow.createVariable.create;
    create.disabled = true;

    var cancel = document.createElement('button');
    buttonContainer.appendChild(cancel);
    cancel.classList.add('fancybuttons');
    cancel.classList.add('modalButtons');
    cancel.textContent = 'Cancel';
    cancel.onclick = Blockly.modalWindow.cancel;

    var reason = document.createElement('p');
    reason.id = 'reason';
    reason.classList.add('helpText');
    container.appendChild(reason);
    reason.style.display = 'none';
}

/**
 * Event listener for drag end event
 * checks if modal window is offscreen
 * adjusts for resolution
 * @param {eventObject} ev
 */
function dragEndModalWindow(ev) {
    var x = ev.x;
    var y = ev.y;
    var el = ev.toElement;
    var height = el.clientHeight;
    var width = el.clientWidth;

    // these constants shold scale to resolution
    var left = x - 45;
    var top = y - 40;

    // check if position will result in window going off screen and adjust
    var edgeOffset = 25;
    // off top left
    if(left <= 0) {
        left = edgeOffset;
    }
    if(top <= 0) {
        top = edgeOffset;
    }
    // off bottom right
    if(left + width >= document.body.clientWidth) {
        left = document.body.clientWidth - width - edgeOffset;
    }
    if(top + height >= document.body.clientHeight) {
        top = document.body.clientHeight - height - edgeOffset;
    }

    // adjust style
    el.style.top = top + 'px';
    el.style.left = left + 'px';
}

/**
 * Make workspace blend into modal window
 * TODO remove border
 * @param {!workspace} blockWorkspace, to be blended
 */
function blendWorkspace(blockWorkspace) {
    // set fill
    //blockWorkspace.svgBackground_.style.fill = container.style.background-color;
    blockWorkspace.svgBackground_.style.fill = '#708090';
    // remove border
}

/**
 * Resizes preview workspace according to name and type of preview block
 */
function resizePreviewWorkspace() {
    var previewBlock = Blockly.modalWindow.preview.block;
    var blockWorkspace = Blockly.modalWindow.preview.workspace;
    var container = document.getElementById('previewContainer');
    resizeWorkspaceAroundBlock(blockWorkspace, container, previewBlock);
}

/**
 * Resizes a given workspace around a given block
 * @param {!workspace} blockWorkspace, contains block, to be resized around
 * @param {element} workspaceContainer, contains workspace
 * @param {block} block, workspace is resized around this
 */
function resizeWorkspaceAroundBlock(blockWorkspace, workspaceContainer, block) {
    // infer width and height from block
    var padding = blockWorkspace.padding;
    var width = Math.round(block.width) + padding;
    var height = block.height + padding;

    resizeWorkspace(blockWorkspace, workspaceContainer, width, height);
}

/**
 * Resizes the workspace based on width and height passed
 * @param {!workspace} blockWorkspace, contains block, to be resized around
 * @param {element} workspaceContainer, contains workspace
 * @param {number} width, for new workspace
 * @param {number} height, for new workspace
 */
function resizeWorkspace(blockWorkspace, workspaceContainer, width, height) {
    // set a size for the container
    workspaceContainer.style.width = width + 'px';
    workspaceContainer.style.height = height + 'px';
    // then do a resize
    Blockly.svgResize(blockWorkspace);
}

/**
 * Moves block to the center of a workspace
 * @param {block} block, to be moved
 * @param {!workspace} workspace, contains block
 */
function moveBlockToCenter(block, blockWorkspace) {
    // put in top left
    var returnX = -block.xy_.x;
    var returnY = -block.xy_.y;
    block.moveBy(returnX, returnY);

    // move from top left
    var workspaceMetrics = blockWorkspace.getMetrics();
    var moveX = workspaceMetrics.viewWidth / 2 - Math.round(block.width) / 2;
    var moveY = workspaceMetrics.viewHeight / 2 - block.height / 2;
    block.moveBy(moveX, moveY);

    // update xy_
    block.xy_.x = moveX;
    block.xy_.y = moveY;
}

/**
 * Makes a block now interactable, for preview block
 * @param {block} block, to be made non-interactable
 */
function makeBlockNonInteractable(block) {
    // make previewBlock non interactable
    block.movable_ = false;
    block.editable_ = false;
    block.deletable_ = false;
    block.contextMenu = false;
}

// NAME INPUT FUNCTIONS

/**
 * Acts on name validation
 * @param {eventObject} ev
 */
function nameInputListener(ev) {
    // get inputs
    var variableName = document.getElementById('variableName').value;
    // validate inputs
    var validity = checkIfNameValid(variableName);
    var valid = validity[0];
    var reasonText = validity[1];

    var container = document.getElementById('modalWindow');
    var createButton = document.getElementById('createButton');
    var reason = document.getElementById('reason');
    // if name is invalid make warning icon visible
    if(valid) {
        createButton.disabled = false;
        createButton.classList.remove("disabled");

        reason.style.display = 'none';

        // update preview
        var preview = Blockly.modalWindow.preview;

        var block = Blockly.modalWindow.preview.block;
        if(block.type == 'variables_set') {
            block = block.inputList[0].connection.targetConnection.sourceBlock_;
        }

        block.renameVar(preview.name, variableName);

        preview.name = variableName;

        resizePreviewWorkspace();
        moveBlockToCenter(Blockly.modalWindow.preview.block, Blockly.modalWindow.preview.workspace);
    } else {
        createButton.disabled = true;
        createButton.classList.add("disabled");

        reason.textContent = reasonText;
        reason.style.display = '';
    }
}

/**
 * Checks if the name passed is valid given Python naming conventions
 * @param {string} name, the name to be validated
 */
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
            return [false, name + " is a reserved word"];
        }
    }

    // check name starts with letter or _, followed by letters, numbers and _
    var re = new RegExp(`^([a-zA-Z]|_)([a-zA-Z]|[0-9]|_)*$`)
    if(!re.test(name)) {
        return [false, "Name must follow python syntax"];
    }

    // check name is unique
    if(name != Blockly.Python.makeNameUnique(name, Blockly.Variables.allVariables(workspace, true, true))) {
        return [false, "'" + name + "' is already in use"];
    }

    return [true, "Valid"];
}

// TYPE INPUT FUNCTIONS

/**
 * Acts on type input changes
 * attached to every type input
 * @param {eventObject} ev
 */
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
    // case 4 - different complex type is selected before last input
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
        if(Blockly.modalWindow.basicTypes.includes(typeInputs[i].value)) {
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

        if(parent && !Blockly.Variables.unrestrictedTypeVec(block, parent)) {
            // move marker to typeVecObject level i;
            // should take i amount of keys to reach from base level
            var results = getCurrentLevel(typeVecObject, []);
            var currentLevel = results[0];
            var keys = results[1];

            if(!Object.keys(currentLevel).includes('unrestricted')) {
              // delete marker
              delete currentLevel['marker'];

              var level = typeVecObject;
              for(var j = 0; j < indexOfLastInput; j++) {
                  level = level[keys[j]];
              }

              level['marker'] = true;
            }
        }
    } else if(!Blockly.modalWindow.basicTypes.includes(lastInput.value)) {
        // case 3
        // prompt some more ui
        switch(lastInput.value) {
           case "list of...":
              if(parent && block.type == 'python_variable_selector' &&
                  !Blockly.Variables.unrestrictedTypeVec(block, parent)) {
                  // should be last level
                  var currentLevel = getCurrentLevel(typeVecObject, [])[0];

                  if(Object.keys(currentLevel).includes('unrestricted')) {
                      // if current level is unrestricted then don't move marker
                      createTypeInput(Blockly.modalWindow.allTypes);
                  } else if(Object.keys(currentLevel['list of...']).includes('unrestricted')) {
                      // if new level is unrestricted then don't move marker
                      createTypeInput(Blockly.modalWindow.allTypes);
                  } else {
                      // else move marker to newLevel
                      // get new level
                      var newLevel = currentLevel["list of..."];

                      // move marker to next level
                      delete currentLevel['marker'];
                      newLevel['marker'] = true;

                      // add a new input element
                      createTypeInput(Object.keys(newLevel));
                  }
              } else {
                  // add another input with all options
                  createTypeInput(Blockly.modalWindow.allTypes);
              }
              break;
           default:
              break;
        }
    }

    // update preview
    // all cases
    updatePreviewType();
    // update workspace
    resizePreviewWorkspace();
    moveBlockToCenter(Blockly.modalWindow.preview.block, Blockly.modalWindow.preview.workspace);
}


/**
 * Initialised the type inputs
 */
function initTypeInputs() {
    var block = Blockly.Variables.getSelectorBlock();
    var parent = block.getParent();

    if(parent && block.type == 'python_variable_selector' &&
        !Blockly.Variables.unrestrictedTypeVec(block, parent)) {
        var typeVecObject = constructTypeVecObject(block);
        var returnKeys = getCurrentLevel(typeVecObject, [])[1];

        // type input for each key to get to current level
        var currentLevel = typeVecObject;
        for(var i = 0; i < returnKeys.length + 1; i++) {
            // add a select element with options for all keys at current level
            if(Object.keys(currentLevel).includes('unrestricted')) {
                // add all types as options if unrestricted
                createTypeInput(Blockly.modalWindow.basicTypes.concat(Blockly.modalWindow.compositeTypes));
            } else {
                // else just add types from typeVecObject
                createTypeInput(Object.keys(currentLevel));
            }

            // move onto next level of object
            currentLevel = currentLevel[returnKeys[i]];
        }
    } else {
        var typeVecObject = {};

        createTypeInput(Blockly.modalWindow.allTypes);
    }

    Blockly.modalWindow.typeVecObject = typeVecObject;
}

/**
 * Creates and appends a select element with options passed
 * @param {!Array<string>} options, for the new type input
 */
function createTypeInput(options) {
    // add input elements to modal window
    // get container
    var container = document.getElementById('typeInputContainer');
    // create dom
    var newVariableTypeInput = document.createElement('select');
    newVariableTypeInput.classList.add("input");
    newVariableTypeInput.classList.add("variableTypeInput");
    newVariableTypeInput.style.textTransform = 'capitalize';

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

/**
 * Updates the preview type
 * includes redrawing
 */
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

    // set typeVecs differently depending on block type
    if(preview.block.type == 'variables_get') {
        preview.block.setTypeVecs([[typeVec]]);
    } else if(preview.block.type == 'variables_set') {
        // update main block
        preview.block.setTypeVecs([[typeVec, typeVec, 'none']]);
        // update var input
        var inputBlock = preview.block.inputList[0].connection.targetConnection.sourceBlock_;
        inputBlock.setTypeVecs([[typeVec]]);
        inputBlock.render();
    }
    preview.block.render();
}

/**
 * Constructs the typeVecObject given a block
 * @param {block} block, the block that the typeVecObject is built to represent
 * @return {typeVecObject} the newly constructed typeVecObject
 */
function constructTypeVecObject(block) {
    var parentInput = block.outputConnection.targetConnection.inputNumber_;

    // create object with marker at highest level
    var typeVecObject = {"marker": true};

    var typeVecs = block.getParent().typeVecs;

    // iterate over each parent typeVec
    for(var i = 0; i < typeVecs.length; i++) {
        var typeVec = typeVecs[i][parentInput];

        // iterate over string
        var sliceStart = 0;
        for(var j = 1; j < typeVec.length + 1; j++) {
            var results = getCurrentLevel(typeVecObject, []);
            var currentLevel = results[0];
            var keys = results[1];

            switch(typeVec.slice(sliceStart, j)) {
                case "*":
                    // list of

                    // check if we don't have list of already in typeVecObject at current level
                    if(!Object.keys(currentLevel).includes("list of...")) {
                        // then add a list as a key
                        currentLevel["list of..."] = {};
                    }
                    // delete marker from previous location
                    delete currentLevel['marker'];
                    // add marker to new level
                    currentLevel["list of..."]["marker"] = true;

                    // update typeVec string slice position
                    sliceStart = j;
                    break;
                case "any":
                    // add unrestricted type
                    currentLevel['unrestricted'] = {};
                    break;
                case "matching":
                    // add unrestricted type
                    currentLevel['unrestricted'] = {};
                    break;
                default:
                    // might be primitive type
                    if(Blockly.modalWindow.basicTypes.includes(typeVec.slice(sliceStart, j))) {
                        currentLevel[typeVec.slice(sliceStart, j)] = {};

                        // update typeVec string
                        sliceStart = j;
                    }
            }
        }

        // place key back at highest level
        // remove marker currently in object
        currentLevel = getCurrentLevel(typeVecObject, [])[0];
        delete currentLevel['marker'];

        // add marker at highest level
        typeVecObject['marker'] = true;
    }

    // remove marker currently in object
    currentLevel = getCurrentLevel(typeVecObject, [])[0];
    delete currentLevel['marker'];

    // add marker at highest possible level
    addMarkerAtHighestLevel(typeVecObject);
    return typeVecObject;
}

/**
 * Returns typeVecObject at level of marker and instructions on how to get there
 * instructions in form on list of keys
 * calls recursively
 * @param {typeVecObject} typeVecObject, that will be traversed
 * @param {Array} returnKeys, unless called recursively should be []
 * @return {typeVecObject} current level in typeVecObject
 */
function getCurrentLevel(typeVecObject, returnKeys) {
    var iterateKeys = Object.keys(typeVecObject);

    // iterate over keys
    for(var i = 0; i < iterateKeys.length; i++) {
        var key = iterateKeys[i];

        if(Blockly.modalWindow.basicTypes.includes(key)) {
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

/**
 * Find highest level with a primitive type in
 * and add a marker there
 * if there are multiple highest layers it just add marker to first key
 * @param {typeVecObject} typeVecObject, to add marker in
 */
function addMarkerAtHighestLevel(typeVecObject) {
    var keys = Object.keys(typeVecObject);

    // iterate through object until we find a primitive type
    for(var i = 0; i < keys.length; i++) {
        var key = keys[i];

        if(Blockly.modalWindow.basicTypes.includes(key) ||
          key == 'unrestricted') {
            typeVecObject["marker"] = true;
            return;
        } else if(key == "items") {
            // contains items as key, therefore complex type contents about to follow
            // so check contents of complex type
            var items = typeVecObject[key];
            if(Array.isArray) {
                // is a list
                for(var j = 0; j < items.length; j++) {
                    if(Blockly.modalWindow.basicTypes.includes(items[j]) ||
                        items[j] == 'unrestricted') {
                        // we've found a primitive type or unrestricted
                        // so add marker and return
                        typeVecObject["marker"] = true;
                        return;
                    } else {
                        // we have another complex type
                        return addMarkerAtHighestLevel(typeVecObject[key]);
                    }
                }
            }
        } else {
            return addMarkerAtHighestLevel(typeVecObject[key]);
        }
    }
}

/**
 * Disposes of modal window
 */
Blockly.modalWindow.dispose = function() {
    document.getElementById('modalWindow').remove();
}

/**
 * Disposes of the preview block
 */
Blockly.modalWindow.preview.dispose = function() {
    if(Blockly.modalWindow.preview.block) {
        Blockly.modalWindow.preview.block.dispose();
        Blockly.modalWindow.preview.name = 'default';
        Blockly.modalWindow.preview.type = 'int';
        Blockly.modalWindow.preview.block = undefined;
    }
}

/**
 * onclick event for cancel button on both modal windows
 */
Blockly.modalWindow.cancel = function() {
    Blockly.modalWindow.dispose();
    Blockly.modalWindow.backdrop.dispose();
    Blockly.modalWindow.preview.dispose()
    Blockly.Variables.getSelectorBlock().dispose();

    Blockly.modalWindow.type = null;
    Blockly.modalWindow.visible = false;
}

/**
 * onclick event for select button on selection window
 */
Blockly.modalWindow.selectVariable.select = function() {
    var block = Blockly.Variables.getSelectorBlock();

    // get block from container structure
    var id = this.parentElement.parentElement.id.split('/');
    block.varName = id[0];
    block.varType = id[1];

    Blockly.modalWindow.dispose();
    Blockly.modalWindow.backdrop.dispose();

    Blockly.modalWindow.type = null;
    Blockly.modalWindow.visible = false;

    // fire onchange event
    block.onchange();
}

/**
 * onclick event for new variable button on selection window
 */
Blockly.modalWindow.selectVariable.newVariable = function() {
    var modalWindow = document.getElementById('modalWindow');
    Blockly.modalWindow.dispose();
    Blockly.modalWindow.createVariable(modalWindow.style.left, modalWindow.style.top);
}

/**
 * onclick event for create button on creation window
 */
Blockly.modalWindow.createVariable.create = function() {
    var block = Blockly.Variables.getSelectorBlock();

    // use preview to build block
    var preview = Blockly.modalWindow.preview;
    block.varName = preview.name;
    block.varType = preview.type;

    Blockly.modalWindow.dispose();
    Blockly.modalWindow.backdrop.dispose();
    Blockly.modalWindow.preview.dispose();

    Blockly.modalWindow.type = null;
    Blockly.modalWindow.visible = false;

    // fire onchange event
    block.onchange();
}
