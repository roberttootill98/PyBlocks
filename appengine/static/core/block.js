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
 * @fileoverview The class representing one block.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Block');

goog.require('Blockly.Blocks');
goog.require('Blockly.Comment');
goog.require('Blockly.Connection');
goog.require('Blockly.Input');
goog.require('Blockly.Mutator');
goog.require('Blockly.Warning');
goog.require('Blockly.Workspace');
goog.require('Blockly.Xml');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.math.Coordinate');
goog.require('goog.string');


/**
 * Class for one block.
 * @constructor
 */
Blockly.Block = function() {
    // We assert this here because there may be users of the previous form of
    // this constructor, which took arguments.
    goog.asserts.assert(arguments.length == 0,
        'Please use Blockly.Block.obtain.');
};

/**
 * Obtain a newly created block.
 * @param {!Blockly.Workspace} workspace The block's workspace.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 * @return {!Blockly.Block} The created block
 */
Blockly.Block.obtain = function(workspace, prototypeName) {
    if (Blockly.Realtime.isEnabled()) {
        return Blockly.Realtime.obtainBlock(workspace, prototypeName);
    } else {
        if (workspace.rendered) {
            var newBlock = new Blockly.BlockSvg();
        } else {
            var newBlock = new Blockly.Block();
        }
        newBlock.initialize(workspace, prototypeName);
        return newBlock;
    }
};

/**
 * Optional text data that round-trips beween blocks and XML.
 * Has no effect. May be used by 3rd parties for meta information.
 * @type {?string}
 */
Blockly.Block.prototype.data = null;

/**
 * Initialization for one block.
 * @param {!Blockly.Workspace} workspace The new block's workspace.
 * @param {?string} prototypeName Name of the language object containing
 *     type-specific functions for this block.
 */
Blockly.Block.prototype.initialize = function(workspace, prototypeName) {
    /** @type {string} */
    this.id = Blockly.Blocks.genUid();
    workspace.addTopBlock(this);
    this.fill(workspace, prototypeName);
};

/**
 * Fill a block with initial values.
 * @param {!Blockly.Workspace} workspace The workspace to use.
 * @param {string} prototypeName The typename of the block.
 */
Blockly.Block.prototype.fill = function(workspace, prototypeName) {
    /** @type {Blockly.Connection} */
    this.outputConnection = null;
    /** @type {Blockly.Connection} */
    this.nextConnection = null;
    /** @type {Blockly.Connection} */
    this.previousConnection = null;
    /** @type {!Array.<!Blockly.Input>} */
    this.inputList = [];
    /** @type {boolean|undefined} */
    this.inputsInline = undefined;
    /** @type {number} */
    this.numParameters = 0;
    /** type {!Array<!Array<string>} */
    this.fullTypeVecs = [];
    /** type {!Array<!Array<string>} */
    this.typeVecs = [];

    this.lhsVarOnly = false;

    this.operator = null;

    this.holesFilled = true;

    this.poisoned = false;

    this.declared = false;

    /** @type {boolean} */
    this.rendered = false;
    /** @type {boolean} */
    this.disabled = false;
    /** @type {string|!Function} */
    this.tooltip = '';
    /** @type {boolean} */
    this.contextMenu = true;

    /** @type {Blockly.Block} */
    this.parentBlock_ = null;
    /** @type {!Array.<!Blockly.Block>} */
    this.childBlocks_ = [];
    /** @type {boolean} */
    this.deletable_ = true;
    /** @type {boolean} */
    this.movable_ = true;
    /** @type {boolean} */
    this.editable_ = true;
    /** @type {boolean} */
    this.isShadow_ = false;
    /** @type {boolean} */
    this.collapsed_ = false;

    /** @type {string|Blockly.Comment} */
    this.comment = null;

    /** @type {!goog.math.Coordinate} */
    this.xy_ = new goog.math.Coordinate(0, 0);

    /** @type {!Blockly.Workspace} */
    this.workspace = workspace;
    /** @type {boolean} */
    this.isInFlyout = workspace.isFlyout;
    /** @type {boolean} */
    this.RTL = workspace.RTL;

    // Copy the type-specific functions and data from the prototype.
    if (prototypeName) {
        /** @type {string} */
        this.type = prototypeName;
        var prototype = Blockly.Blocks[prototypeName];
        goog.asserts.assertObject(prototype,
            'Error: "%s" is an unknown language block.', prototypeName);
        goog.mixin(this, prototype);
    }
    // Call an initialization function, if it exists.
    if (goog.isFunction(this.init)) {
        this.init();
    }
    // Record initial inline state.
    /** @type {boolean|undefined} */
    this.inputsInlineDefault = this.inputsInline;
};

/**
 * Get an existing block.
 * @param {string} id The block's id.
 * @param {!Blockly.Workspace} workspace The block's workspace.
 * @return {Blockly.Block} The found block, or null if not found.
 */
Blockly.Block.getById = function(id, workspace) {
    if (Blockly.Realtime.isEnabled()) {
        return Blockly.Realtime.getBlockById(id);
    } else {
        return workspace.getBlockById(id);
    }
};

/**
 * Dispose of this block.
 * @param {boolean} healStack If true, then try to heal any gap by connecting
 *     the next statement with the previous statement.  Otherwise, dispose of
 *     all children of this block.
 * @param {boolean} animate If true, show a disposal animation and sound.
 * @param {boolean=} opt_dontRemoveFromWorkspace If true, don't remove this
 *     block from the workspace's list of top blocks.
 */
Blockly.Block.prototype.dispose = function(healStack, animate,
    opt_dontRemoveFromWorkspace) {
    this.unplug(healStack, false);

    // This block is now at the top of the workspace.
    // Remove this block from the workspace's list of top-most blocks.
    if (this.workspace && !opt_dontRemoveFromWorkspace) {
        this.workspace.removeTopBlock(this);
        this.workspace = null;
    }

    // Just deleting this block from the DOM would result in a memory leak as
    // well as corruption of the connection database.  Therefore we must
    // methodically step through the blocks and carefully disassemble them.

    if (Blockly.selected == this) {
        Blockly.selected = null;
    }

    // First, dispose of all my children.
    for (var i = this.childBlocks_.length - 1; i >= 0; i--) {
        this.childBlocks_[i].dispose(false);
    }
    // Then dispose of myself.
    // Dispose of all inputs and their fields.
    for (var i = 0, input; input = this.inputList[i]; i++) {
        input.dispose();
    }
    this.inputList.length = 0;
    // Dispose of any remaining connections (next/previous/output).
    var connections = this.getConnections_(true);
    for (var i = 0; i < connections.length; i++) {
        var connection = connections[i];
        if (connection.targetConnection) {
            connection.disconnect();
        }
        connections[i].dispose();
    }
    // Remove from Realtime set of blocks.
    if (Blockly.Realtime.isEnabled() && !Blockly.Realtime.withinSync) {
        Blockly.Realtime.removeBlock(this);
    }
};

/**
 * Unplug this block from its superior block.  If this block is a statement,
 * optionally reconnect the block underneath with the block on top.
 * @param {boolean} healStack Disconnect child statement and reconnect stack.
 * @param {boolean} bump Move the unplugged block sideways a short distance.
 */
Blockly.Block.prototype.unplug = function(healStack, bump) {
    bump = bump && !!this.getParent();
    if (this.outputConnection) {
        if (this.outputConnection.targetConnection) {
            // Disconnect from any superior block.
            this.setParent(null);
        }
    } else {
        var previousTarget = null;
        if (this.previousConnection && this.previousConnection.targetConnection) {
            // Remember the connection that any next statements need to connect to.
            previousTarget = this.previousConnection.targetConnection;
            // Detach this block from the parent's tree.
            this.setParent(null);
        }
        var nextBlock = this.getNextBlock();
        if (healStack && nextBlock) {
            // Disconnect the next statement.
            var nextTarget = this.nextConnection.targetConnection;
            nextBlock.setParent(null);
            if (previousTarget && previousTarget.checkType_(nextTarget)) {
                // Attach the next statement to the previous statement.
                previousTarget.connect(nextTarget);
            }
        }
    }
    if (bump) {
        // Bump the block sideways.
        var dx = Blockly.SNAP_RADIUS * (this.RTL ? -1 : 1);
        var dy = Blockly.SNAP_RADIUS * 2;
        this.moveBy(dx, dy);
    }
};

/**
 * Returns all connections originating from this block.
 * @param {boolean} all If true, return all connections even hidden ones.
 *     Otherwise return those that are visible.
 * @return {!Array.<!Blockly.Connection>} Array of connections.
 * @private
 */
Blockly.Block.prototype.getConnections_ = function(all) {
    var myConnections = [];
    if (all || this.rendered) {
        if (this.outputConnection) {
            myConnections.push(this.outputConnection);
        }
        if (this.previousConnection) {
            myConnections.push(this.previousConnection);
        }
        if (this.nextConnection) {
            myConnections.push(this.nextConnection);
        }
        if (all || !this.collapsed_) {
            for (var i = 0, input; input = this.inputList[i]; i++) {
                if (input.connection) {
                    myConnections.push(input.connection);
                }
            }
        }
    }
    return myConnections;
};

/**
 * Bump unconnected blocks out of alignment.  Two blocks which aren't actually
 * connected should not coincidentally line up on screen.
 * @private
 */
Blockly.Block.prototype.bumpNeighbours_ = function() {
    if (!this.workspace) {
        return; // Deleted block.
    }
    if (Blockly.dragMode_ != 0) {
        return; // Don't bump blocks during a drag.
    }
    var rootBlock = this.getRootBlock();
    if (rootBlock.isInFlyout) {
        return; // Don't move blocks around in a flyout.
    }
    // Loop though every connection on this block.
    var myConnections = this.getConnections_(false);
    for (var i = 0, connection; connection = myConnections[i]; i++) {
        // Spider down from this block bumping all sub-blocks.
        if (connection.targetConnection && connection.isSuperior()) {
            connection.targetBlock().bumpNeighbours_();
        }

        var neighbours = connection.neighbours_(Blockly.SNAP_RADIUS);
        for (var j = 0, otherConnection; otherConnection = neighbours[j]; j++) {
            // If both connections are connected, that's probably fine.  But if
            // either one of them is unconnected, then there could be confusion.
            if (!connection.targetConnection || !otherConnection.targetConnection) {
                // Only bump blocks if they are from different tree structures.
                if (otherConnection.sourceBlock_.getRootBlock() != rootBlock) {
                    // Always bump the inferior block.
                    if (connection.isSuperior()) {
                        otherConnection.bumpAwayFrom_(connection);
                    } else {
                        connection.bumpAwayFrom_(otherConnection);
                    }
                }
            }
        }
    }
};

/**
 * Return the parent block or null if this block is at the top level.
 * @return {Blockly.Block} The block that holds the current block.
 */
Blockly.Block.prototype.getParent = function() {
    // Look at the DOM to see if we are nested in another block.
    return this.parentBlock_;
};

/**
 * Return this blocks outermost ancestor following only slot
 * input connections (not previous statement connections); return
 * this block if it has no parent.
 * @return {Blockly.Block} The outermost block that contains the
 * current block.
 */
Blockly.Block.prototype.getTopLevel = function() {
    if (!this.outputConnection) {
        return this;
    }
    var parent = this.getParent();
    if (!parent) {
        return this;
    } else {
        return parent.getTopLevel();
    }
};


/**
 * Return the parent block that surrounds the current block, or null if this
 * block has no surrounding block.  A parent block might just be the previous
 * statement, whereas the surrounding block is an if statement, while loop, etc.
 * @return {Blockly.Block} The block that surrounds the current block.
 */
Blockly.Block.prototype.getSurroundParent = function() {
    var block = this;
    while (true) {
        do {
            var prevBlock = block;
            block = block.getParent();
            if (!block) {
                // Ran off the top.
                return null;
            }
        } while (block.getNextBlock() == prevBlock);
        // This block is an enclosing parent, not just a statement in a stack.
        return block;
    }
};

/**
 * Return the next statement block directly connected to this block.
 * @return {Blockly.Block} The next statement block or null.
 */
Blockly.Block.prototype.getNextBlock = function() {
    return this.nextConnection && this.nextConnection.targetBlock();
};

/**
 * Return the top-most block in this block's tree.
 * This will return itself if this block is at the top level.
 * @return {!Blockly.Block} The root block.
 */
Blockly.Block.prototype.getRootBlock = function() {
    var rootBlock;
    var block = this;
    do {
        rootBlock = block;
        block = rootBlock.parentBlock_;
    } while (block);
    return rootBlock;
};

Blockly.Block.prototype.findVariable = function() {
    var variableBlock;
    var block = this;
    do {
        variableBlock = block;
        block = variableBlock.parentBlock_;

        if ((variableBlock.type == 'variables_set' && this.getFieldValue("VAR") ==
                Blockly.Python.valueToCode(variableBlock, 'VAR',
                    Blockly.Python.ORDER_NONE)) && variableBlock.getSurroundParent().type != 'python_if' &&
            variableBlock.getSurroundParent().type != 'python_while' && variableBlock.getSurroundParent().type != 'python_for') {

            return 'nocontrol';

        } else if (variableBlock.type == 'variables_set' && this.getFieldValue("VAR") ==
            Blockly.Python.valueToCode(variableBlock, 'VAR',
                Blockly.Python.ORDER_NONE)) {

            return 'control';
        }
    } while (!variableBlock.poisoned && block)
    return variableBlock;
};

/**
 * Find all the blocks that are directly nested inside this one.
 * Includes value and block inputs, as well as any following statement.
 * Excludes any connection on an output tab or any preceding statement.
 * @return {!Array.<!Blockly.Block>} Array of blocks.
 */
Blockly.Block.prototype.getChildren = function() {
    return this.childBlocks_;
};

/**
 * Set parent of this block to be a new block or null.
 * @param {Blockly.Block} newParent New parent block.
 */
Blockly.Block.prototype.setParent = function(newParent) {
    if (this.parentBlock_) {
        // Remove this block from the old parent's child list.
        var children = this.parentBlock_.childBlocks_;
        for (var child, x = 0; child = children[x]; x++) {
            if (child == this) {
                children.splice(x, 1);
                break;
            }
        }

        // Disconnect from superior blocks.
        this.parentBlock_ = null;
        if (this.previousConnection && this.previousConnection.targetConnection) {
            this.previousConnection.disconnect();
        }
        if (this.outputConnection && this.outputConnection.targetConnection) {
            this.outputConnection.disconnect();
        }
        // This block hasn't actually moved on-screen, so there's no need to update
        // its connection locations.
    } else {
        // Remove this block from the workspace's list of top-most blocks.
        // Note that during realtime sync we sometimes create child blocks that are
        // not top level so we check first before removing.
        if (goog.array.contains(this.workspace.getTopBlocks(false), this)) {
            this.workspace.removeTopBlock(this);
        }
    }

    this.parentBlock_ = newParent;
    if (newParent) {
        // Add this block to the new parent's child list.
        newParent.childBlocks_.push(this);
    } else {
        this.workspace.addTopBlock(this);
    }
};

/**
 * Find all the blocks that are directly or indirectly nested inside this one.
 * Includes this block in the list.
 * Includes value and block inputs, as well as any following statements.
 * Excludes any connection on an output tab or any preceding statements.
 * @return {!Array.<!Blockly.Block>} Flattened array of blocks.
 */
Blockly.Block.prototype.getDescendants = function() {
    var blocks = [this];
    for (var child, x = 0; child = this.childBlocks_[x]; x++) {
        blocks.push.apply(blocks, child.getDescendants());
    }
    return blocks;
};

/**
 * Get whether this block is deletable or not.
 * @return {boolean} True if deletable.
 */
Blockly.Block.prototype.isDeletable = function() {
    return this.deletable_ && !this.isShadow_ &&
        !(this.workspace && this.workspace.options.readOnly);
};

/**
 * Set whether this block is deletable or not.
 * @param {boolean} deletable True if deletable.
 */
Blockly.Block.prototype.setDeletable = function(deletable) {
    this.deletable_ = deletable;
};

/**
 * Get whether this block is movable or not.
 * @return {boolean} True if movable.
 */
Blockly.Block.prototype.isMovable = function() {
    return this.movable_ && !this.isShadow_ &&
        !(this.workspace && this.workspace.options.readOnly);
};

/**
 * Set whether this block is movable or not.
 * @param {boolean} movable True if movable.
 */
Blockly.Block.prototype.setMovable = function(movable) {
    this.movable_ = movable;
};

/**
 * Get whether this block is a shadow block or not.
 * @return {boolean} True if a shadow.
 */
Blockly.Block.prototype.isShadow = function() {
    return this.isShadow_;
};

/**
 * Set whether this block is a shadow block or not.
 * @param {boolean} shadow True if a shadow.
 */
Blockly.Block.prototype.setShadow = function(shadow) {
    this.isShadow_ = shadow;
};

/**
 * Get whether this block is editable or not.
 * @return {boolean} True if editable.
 */
Blockly.Block.prototype.isEditable = function() {
    return this.editable_ && !(this.workspace && this.workspace.options.readOnly);
};

/**
 * Set whether this block is editable or not.
 * @param {boolean} editable True if editable.
 */
Blockly.Block.prototype.setEditable = function(editable) {
    this.editable_ = editable;
    for (var i = 0, input; input = this.inputList[i]; i++) {
        for (var j = 0, field; field = input.fieldRow[j]; j++) {
            field.updateEditable();
        }
    }
};

/**
 * Set whether the connections are hidden (not tracked in a database) or not.
 * Recursively walk down all child blocks (except collapsed blocks).
 * @param {boolean} hidden True if connections are hidden.
 */
Blockly.Block.prototype.setConnectionsHidden = function(hidden) {
    if (!hidden && this.isCollapsed()) {
        if (this.outputConnection) {
            this.outputConnection.setHidden(hidden);
        }
        if (this.previousConnection) {
            this.previousConnection.setHidden(hidden);
        }
        if (this.nextConnection) {
            this.nextConnection.setHidden(hidden);
            var child = this.nextConnection.targetBlock();
            if (child) {
                child.setConnectionsHidden(hidden);
            }
        }
    } else {
        var myConnections = this.getConnections_(true);
        for (var i = 0, connection; connection = myConnections[i]; i++) {
            connection.setHidden(hidden);
            if (connection.isSuperior()) {
                var child = connection.targetBlock();
                if (child) {
                    child.setConnectionsHidden(hidden);
                }
            }
        }
    }
};

/**
 * Set the URL of this block's help page.
 * @param {string|Function} url URL string for block help, or function that
 *     returns a URL.  Null for no help.
 */
Blockly.Block.prototype.setHelpUrl = function(url) {
    this.helpUrl = url;
};

/**
 * Change the tooltip text for a block.
 * @param {string|!Function} newTip Text for tooltip or a parent element to
 *     link to for its tooltip.  May be a function that returns a string.
 */
Blockly.Block.prototype.setTooltip = function(newTip) {
    this.tooltip = newTip;
};

/**
 * Get the colour of a block.
 * @return {number} HSV hue value.
 */

Blockly.Block.prototype.getColour = function() {
    if (this.outputConnection) {
        //console.log("COLOUR " + this.outputConnection.check_);
        //return Blockly.Block.COLOUR[this.outputConnection.check_[0]];
        console.log("Block Type: ");
        console.log(this.getOutputTypes());
        return Blockly.Python.COLOUR[this.getOutputTypes()[0]];
    } else {
        return Blockly.Python.COLOUR['notype'];
    }
};

/**
 * Change the colour of a block.
 * @param {number} colourHue HSV hue value.
 */
Blockly.Block.prototype.setColour = function(colourHue) {
    this.colourHue_ = colourHue;
    if (this.rendered) {
        this.updateColour();
    }
};

/**
 * Returns the named field from a block.
 * @param {string} name The name of the field.
 * @return {Blockly.Field} Named field, or null if field does not exist.
 */
Blockly.Block.prototype.getField = function(name) {
    for (var i = 0, input; input = this.inputList[i]; i++) {
        for (var j = 0, field; field = input.fieldRow[j]; j++) {
            if (field.name === name) {
                return field;
            }
        }
    }
    return null;
};

/**
 * Returns the language-neutral value from the field of a block.
 * @param {string} name The name of the field.
 * @return {?string} Value from the field or null if field does not exist.
 */
Blockly.Block.prototype.getFieldValue = function(name) {
    var field = this.getField(name);
    if (field) {
        return field.getValue();
    }
    return null;
};

/**
 * Returns the language-neutral value from the field of a block.
 * @param {string} name The name of the field.
 * @return {?string} Value from the field or null if field does not exist.
 * @deprecated December 2013
 */
Blockly.Block.prototype.getTitleValue = function(name) {
    console.warn('Deprecated call to getTitleValue, use getFieldValue instead.');
    return this.getFieldValue(name);
};

/**
 * Change the field value for a block (e.g. 'CHOOSE' or 'REMOVE').
 * @param {string} newValue Value to be the new field.
 * @param {string} name The name of the field.
 */
Blockly.Block.prototype.setFieldValue = function(newValue, name) {
    var field = this.getField(name);
    goog.asserts.assertObject(field, 'Field "%s" not found.', name);
    field.setValue(newValue);
};

/**
 * Change the field value for a block (e.g. 'CHOOSE' or 'REMOVE').
 * @param {string} newValue Value to be the new field.
 * @param {string} name The name of the field.
 * @deprecated December 2013
 */
Blockly.Block.prototype.setTitleValue = function(newValue, name) {
    console.warn('Deprecated call to setTitleValue, use setFieldValue instead.');
    this.setFieldValue(newValue, name);
};

/**
 * Set whether this block can chain onto the bottom of another block.
 * @param {boolean} newBoolean True if there can be a previous statement.
 * @param {string|Array.<string>|null|undefined} opt_check Statement type or
 *     list of statement types.  Null/undefined if any type could be connected.
 */
Blockly.Block.prototype.setPreviousStatement = function(newBoolean, opt_check) {
    if (this.previousConnection) {
        goog.asserts.assert(!this.previousConnection.targetConnection,
            'Must disconnect previous statement before removing connection.');
        this.previousConnection.dispose();
        this.previousConnection = null;
    }
    if (newBoolean) {
        goog.asserts.assert(!this.outputConnection,
            'Remove output connection prior to adding previous connection.');
        if (opt_check === undefined) {
            opt_check = null;
        }
        this.previousConnection =
            new Blockly.Connection(this, Blockly.PREVIOUS_STATEMENT);
        this.previousConnection.setCheck(opt_check);
    }
    if (this.rendered) {
        this.render();
        this.bumpNeighbours_();
    }
};

/**
 * Set whether another block can chain onto the bottom of this block.
 * @param {boolean} newBoolean True if there can be a next statement.
 * @param {string|Array.<string>|null|undefined} opt_check Statement type or
 *     list of statement types.  Null/undefined if any type could be connected.
 */
Blockly.Block.prototype.setNextStatement = function(newBoolean, opt_check) {
    if (this.nextConnection) {
        goog.asserts.assert(!this.nextConnection.targetConnection,
            'Must disconnect next statement before removing connection.');
        this.nextConnection.dispose();
        this.nextConnection = null;
    }
    if (newBoolean) {
        if (opt_check === undefined) {
            opt_check = null;
        }
        this.nextConnection =
            new Blockly.Connection(this, Blockly.NEXT_STATEMENT);
        this.nextConnection.setCheck(opt_check);
    }
    if (this.rendered) {
        this.render();
        this.bumpNeighbours_();
    }
};

/**
 * Set whether this block returns a value.
 * @param {boolean} newBoolean True if there is an output.
 * @param {string|Array.<string>|null|undefined} opt_check Returned type or list
 *     of returned types.  Null or undefined if any type could be returned
 *     (e.g. variable get).
 */
Blockly.Block.prototype.setOutput = function(newBoolean, opt_check) {
    if (this.outputConnection) {
        goog.asserts.assert(!this.outputConnection.targetConnection,
            'Must disconnect output value before removing connection.');
        this.outputConnection.dispose();
        this.outputConnection = null;
    }
    if (newBoolean) {
        goog.asserts.assert(!this.previousConnection,
            'Remove previous connection prior to adding output connection.');
        if (opt_check === undefined) {
            opt_check = null;
        }
        this.outputConnection =
            new Blockly.Connection(this, Blockly.OUTPUT_VALUE);
        this.outputConnection.setCheck(opt_check);
    }
    if (this.rendered) {
        this.render();
        this.bumpNeighbours_();
    }

    this.canHaveTooltipValue = newBoolean;

};

/**
 * Set whether value inputs are arranged horizontally or vertically.
 * @param {boolean} newBoolean True if inputs are horizontal.
 */
Blockly.Block.prototype.setInputsInline = function(newBoolean) {
    this.inputsInline = newBoolean;
    if (this.rendered) {
        this.render();
        this.bumpNeighbours_();
        this.workspace.fireChangeEvent();
    }
};

/**
 * Set the Python type-vecs for this block.
 * @param {!Array{<!Array<string>>} typeVecs the new type-vecs.
 */
Blockly.Block.prototype.setTypeVecs = function(typeVecs) {
    var numTypes = typeVecs.length;
    this.fullTypeVecs = new Array(numTypes);
    this.typeVecs = new Array(numTypes);
    for (var i = 0; i < numTypes; i++) {
        this.fullTypeVecs[i] = typeVecs[i].slice(0);
    }
    var numParams = typeVecs[0].length - 1;
    this.holes = new Array(numParams);
    this.restoreFullTypes();
};

Blockly.Block.prototype.setLhsVarOnly = function(lhsVarOnly) {
    this.lhsVarOnly = lhsVarOnly;
};

Blockly.Block.prototype.setOperator = function(precedence, right) {
    this.operator = {};
    this.operator.precedence = precedence;
    this.operator.right = right;
    console.log("OPER ", this.operator);
}


/**
 * Restores the block's type-vecs to, as for a new singleton block.
 */
Blockly.Block.prototype.restoreFullTypes = function() {
    this.typeVecs = Array(this.fullTypeVecs.length);
    for (var i = 0; i < this.fullTypeVecs.length; i++) {
        this.typeVecs[i] = this.fullTypeVecs[i].slice(0);
        if (this.restrictTypes) {
            this.restrictTypes();
        }
    }
    for (var i = 0, child; child = this.childBlocks_[i]; i++) {
        if (child.outputConnection) {
            child.restoreFullTypes();
        }
    }


    //  for (i=0; i<this.holes.length; i++) {
    //    if (this.holes[i]) {
    //      this.holes[i].restoreFullTypes();
    //    }
    //}
};

/**
 * Get whether value inputs are arranged horizontally or vertically.
 * @return {boolean} True if inputs are horizontal.
 */
Blockly.Block.prototype.getInputsInline = function() {
    if (this.inputsInline != undefined) {
        // Set explicitly.
        return this.inputsInline;
    }
    // Not defined explicitly.  Figure out what would look best.
    for (var i = 1; i < this.inputList.length; i++) {
        if (this.inputList[i - 1].type == Blockly.DUMMY_INPUT &&
            this.inputList[i].type == Blockly.DUMMY_INPUT) {
            // Two dummy inputs in a row.  Don't inline them.
            return false;
        }
    }
    for (var i = 1; i < this.inputList.length; i++) {
        if (this.inputList[i - 1].type == Blockly.INPUT_VALUE &&
            this.inputList[i].type == Blockly.DUMMY_INPUT) {
            // Dummy input after a value input.  Inline them.
            return true;
        }
    }
    return false;
};

/**
 * Set whether the block is disabled or not.
 * @param {boolean} disabled True if disabled.
 */
Blockly.Block.prototype.setDisabled = function(disabled) {
    this.disabled = disabled;
};

/**
 * Get whether the block is disabled or not due to parents.
 * The block's own disabled property is not considered.
 * @return {boolean} True if disabled.
 */
Blockly.Block.prototype.getInheritedDisabled = function() {
    var block = this;
    while (true) {
        block = block.getSurroundParent();
        if (!block) {
            // Ran off the top.
            return false;
        } else if (block.disabled) {
            return true;
        }
    }
};

/**
 * Get whether the block is collapsed or not.
 * @return {boolean} True if collapsed.
 */
Blockly.Block.prototype.isCollapsed = function() {
    return this.collapsed_;
};

/**
 * Set whether the block is collapsed or not.
 * @param {boolean} collapsed True if collapsed.
 */
Blockly.Block.prototype.setCollapsed = function(collapsed) {
    this.collapsed_ = collapsed;
};

/**
 * Create a human-readable text representation of this block and any children.
 * @param {number=} opt_maxLength Truncate the string to this length.
 * @return {string} Text of block.
 */
Blockly.Block.prototype.toString = function(opt_maxLength) {
    var text = [];
    if (this.collapsed_) {
        text.push(this.getInput('_TEMP_COLLAPSED_INPUT').fieldRow[0].text_);
    } else {
        for (var i = 0, input; input = this.inputList[i]; i++) {
            for (var j = 0, field; field = input.fieldRow[j]; j++) {
                text.push(field.getText());
            }
            if (input.connection) {
                var child = input.connection.targetBlock();
                if (child) {
                    text.push(child.toString());
                } else {
                    text.push('?');
                }
            }
        }
    }
    text = goog.string.trim(text.join(' ')) || '???';
    if (opt_maxLength) {
        // TODO: Improve truncation so that text from this block is given priority.
        // TODO: Handle FieldImage better.
        text = goog.string.truncate(text, opt_maxLength);
    }
    return text;
};

/**
 * Shortcut for appending a value input row.
 * @param {string} name Language-neutral identifier which may used to find this
 *     input again.  Should be unique to this block.
 * @return {!Blockly.Input} The input object created.
 */
Blockly.Block.prototype.appendValueInput = function(name) {
    var input = this.appendInput_(Blockly.INPUT_VALUE, name);
    input.connection.setInputNumber(this.numParameters);
    this.numParameters++;
    return input;
};

/**
 * Shortcut for appending a statement input row.
 * @param {string} name Language-neutral identifier which may used to find this
 *     input again.  Should be unique to this block.
 * @return {!Blockly.Input} The input object created.
 */
Blockly.Block.prototype.appendStatementInput = function(name) {
    return this.appendInput_(Blockly.NEXT_STATEMENT, name);
};

/**
 * Shortcut for appending a dummy input row.
 * @param {string=} opt_name Language-neutral identifier which may used to find
 *     this input again.  Should be unique to this block.
 * @return {!Blockly.Input} The input object created.
 */
Blockly.Block.prototype.appendDummyInput = function(opt_name) {
    return this.appendInput_(Blockly.DUMMY_INPUT, opt_name || '');
};

/**
 * Initialize this block using a cross-platform, internationalization-friendly
 * JSON description.
 * @param {!Object} json Structured data describing the block.
 */
Blockly.Block.prototype.jsonInit = function(json) {
    // Validate inputs.
    goog.asserts.assert(json['output'] == undefined ||
        json['previousStatement'] == undefined,
        'Must not have both an output and a previousStatement.');

    // Set basic properties of block.
    this.setColour(json['colour']);

    // Interpolate the message blocks.
    var i = 0;
    while (json['message' + i] !== undefined) {
        this.interpolate_(json['message' + i], json['args' + i] || [],
            json['lastDummyAlign' + i]);
        i++;
    }

    if (json['inputsInline'] !== undefined) {
        this.setInputsInline(json['inputsInline']);
    }
    if (json['typeVecs'] !== undefined) {
        this.setTypeVecs(json['typeVecs']);
    }
    // Set output and previous/next connections.
    if (json['output'] !== undefined) {
        this.setOutput(true, json['output']);
    }
    if (json['previousStatement'] !== undefined) {
        this.setPreviousStatement(true, json['previousStatement']);
    }
    if (json['nextStatement'] !== undefined) {
        this.setNextStatement(true, json['nextStatement']);
    }
    if (json['tooltip'] !== undefined) {
        this.setTooltip(json['tooltip']);
    }
    if (json['helpUrl'] !== undefined) {
        this.setHelpUrl(json['helpUrl']);
    }
};

/**
 * Interpolate a message description onto the block.
 * @param {string} message Text contains interpolation tokens (%1, %2, ...)
 *     that match with fields or inputs defined in the args array.
 * @param {!Array} args Array of arguments to be interpolated.
 * @param {=string} lastDummyAlign If a dummy input is added at the end,
 *     how should it be aligned?
 * @private
 */
Blockly.Block.prototype.interpolate_ = function(message, args, lastDummyAlign) {
    var tokens = Blockly.tokenizeInterpolation(message);
    console.log("TOKENS ", tokens);
    // Interpolate the arguments.  Build a list of elements.
    var indexDup = [];
    var indexCount = 0;
    var elements = [];
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (typeof token == 'number') {
            goog.asserts.assert(token > 0 && token <= args.length,
                'Message index "%s" out of range.', token);
            goog.asserts.assert(!indexDup[token],
                'Message index "%s" duplicated.', token);
            indexDup[token] = true;
            indexCount++;
            elements.push(args[token - 1]);
        } else {
            //token = token.trim();  MJP hack to add space around =
            if (token) {
                elements.push(token);
            }
        }
    }
    goog.asserts.assert(indexCount == args.length,
        'Message does not reference all %s arg(s).', args.length);
    // Add last dummy input if needed.
    if (elements.length && (typeof elements[elements.length - 1] == 'string' ||
            elements[elements.length - 1]['type'].indexOf('field_') == 0)) {
        var input = {
            type: 'input_dummy'
        };
        if (lastDummyAlign) {
            input['align'] = lastDummyAlign;
        }
        elements.push(input);
    }
    // Lookup of alignment constants.
    var alignmentLookup = {
        'LEFT': Blockly.ALIGN_LEFT,
        'RIGHT': Blockly.ALIGN_RIGHT,
        'CENTRE': Blockly.ALIGN_CENTRE
    };
    // Populate block with inputs and fields.
    var fieldStack = [];
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (typeof element == 'string') {
            fieldStack.push([element, undefined]);
        } else {
            var field = null;
            var input = null;
            do {
                var altRepeat = false;
                switch (element['type']) {
                    case 'input_value':
                        input = this.appendValueInput(element['name']);
                        break;
                    case 'input_statement':
                        input = this.appendStatementInput(element['name']);
                        break;
                    case 'input_dummy':
                        input = this.appendDummyInput(element['name']);
                        break;
                    case 'field_label':
                        field = new Blockly.FieldLabel(element['text']);
                        break;
                    case 'field_input':
                        field = new Blockly.FieldTextInput(element['text']);
                        if (typeof element['spellcheck'] == 'boolean') {
                            field.setSpellcheck(element['spellcheck']);
                        }
                        break;
                    case 'field_angle':
                        field = new Blockly.FieldAngle(element['angle']);
                        break;
                    case 'field_checkbox':
                        field = new Blockly.FieldCheckbox(
                            element['checked'] ? 'TRUE' : 'FALSE');
                        break;
                    case 'field_colour':
                        field = new Blockly.FieldColour(element['colour']);
                        break;
                    case 'field_variable':
                        field = new Blockly.FieldVariable(element['variable']);
                        break;
                    case 'field_dropdown':
                        field = new Blockly.FieldDropdown(element['options']);
                        break;
                    case 'field_image':
                        field = new Blockly.FieldImage(element['src'],
                            element['width'], element['height'], element['alt']);
                        break;
                    case 'field_date':
                        if (Blockly.FieldDate) {
                            field = new Blockly.FieldDate(element['date']);
                            break;
                        }
                        // Fall through if FieldDate is not compiled in.
                    default:
                        // Unknown field.
                        if (element['alt']) {
                            element = element['alt'];
                            altRepeat = true;
                        }
                }
            } while (altRepeat);
            if (field) {
                fieldStack.push([field, element['name']]);
            } else if (input) {
                if (element['check']) {
                    input.setCheck(element['check']);
                }
                if (element['align']) {
                    input.setAlign(alignmentLookup[element['align']]);
                }
                for (var j = 0; j < fieldStack.length; j++) {
                    input.appendField(fieldStack[j][0], fieldStack[j][1]);
                }
                fieldStack.length = 0;
            }
        }
    }
};

/**
 * Add a value input, statement input or local variable to this block.
 * @param {number} type Either Blockly.INPUT_VALUE or Blockly.NEXT_STATEMENT or
 *     Blockly.DUMMY_INPUT.
 * @param {string} name Language-neutral identifier which may used to find this
 *     input again.  Should be unique to this block.
 * @return {!Blockly.Input} The input object created.
 * @private
 */
Blockly.Block.prototype.appendInput_ = function(type, name) {
    var connection = null;
    if (type == Blockly.INPUT_VALUE || type == Blockly.NEXT_STATEMENT) {
        connection = new Blockly.Connection(this, type);
    }
    var input = new Blockly.Input(type, name, this, connection);
    // Append input to list.
    this.inputList.push(input);
    if (this.rendered) {
        this.render();
        // Adding an input will cause the block to change shape.
        this.bumpNeighbours_();
    }
    return input;
};

/**
 * Move a named input to a different location on this block.
 * @param {string} name The name of the input to move.
 * @param {?string} refName Name of input that should be after the moved input,
 *   or null to be the input at the end.
 */
Blockly.Block.prototype.moveInputBefore = function(name, refName) {
    if (name == refName) {
        return;
    }
    // Find both inputs.
    var inputIndex = -1;
    var refIndex = refName ? -1 : this.inputList.length;
    for (var i = 0, input; input = this.inputList[i]; i++) {
        if (input.name == name) {
            inputIndex = i;
            if (refIndex != -1) {
                break;
            }
        } else if (refName && input.name == refName) {
            refIndex = i;
            if (inputIndex != -1) {
                break;
            }
        }
    }
    goog.asserts.assert(inputIndex != -1, 'Named input "%s" not found.', name);
    goog.asserts.assert(refIndex != -1, 'Reference input "%s" not found.',
        refName);
    this.moveNumberedInputBefore(inputIndex, refIndex);
};

// PyBlocks MJP
Blockly.Block.prototype.renumberParameterConnections = function() {
    var inputNumber = 0;
    for (var i = 0, input; input = this.inputList[i]; i++) {
        if (input.type == Blockly.INPUT_VALUE) {
            console.log("RENUM from ", input.connection.inputNumber_);
            input.connection.setInputNumber(inputNumber);
            console.log("RENUM to ", input.connection.inputNumber_);
            inputNumber++;
        }
    }
};

/**
 * Move a numbered input to a different location on this block.
 * @param {number} inputIndex Index of the input to move.
 * @param {number} refIndex Index of input that should be after the moved input.
 */
Blockly.Block.prototype.moveNumberedInputBefore = function(
    inputIndex, refIndex) {
    // Validate arguments.
    goog.asserts.assert(inputIndex != refIndex, 'Can\'t move input to itself.');
    goog.asserts.assert(inputIndex < this.inputList.length,
        'Input index ' + inputIndex + ' out of bounds.');
    goog.asserts.assert(refIndex <= this.inputList.length,
        'Reference input ' + refIndex + ' out of bounds.');
    // Remove input.
    var input = this.inputList[inputIndex];
    this.inputList.splice(inputIndex, 1);
    if (inputIndex < refIndex) {
        refIndex--;
    }
    // Reinsert input.
    this.inputList.splice(refIndex, 0, input);
    // MJP PyBlocks
    this.renumberParameterConnections();
    if (this.rendered) {
        this.render();
        // Moving an input will cause the block to change shape.
        this.bumpNeighbours_();
    }
};

/**
 * Remove an input from this block.
 * @param {string} name The name of the input.
 * @param {boolean=} opt_quiet True to prevent error if input is not present.
 * @throws {goog.asserts.AssertionError} if the input is not present and
 *     opt_quiet is not true.
 */
Blockly.Block.prototype.removeInput = function(name, opt_quiet) {
    for (var i = 0, input; input = this.inputList[i]; i++) {
        if (input.name == name) {

            if (input.connection && input.connection.targetConnection) {
                // Disconnect any attached block.
                input.connection.targetBlock().setParent(null);
            }
            input.dispose();
            this.inputList.splice(i, 1);
            if (this.rendered) {
                this.render();
                // Removing an input will cause the block to change shape.
                this.bumpNeighbours_();
            }
            // MJP Pyblocks
            if (input.type == Blockly.INPUT_VALUE) {
                this.numParameters--;
                this.renumberParameterConnections();
            }
            return;
        }
    }
    if (!opt_quiet) {
        goog.asserts.fail('Input "%s" not found.', name);
    }
};

/**
 * Fetches the named input object.
 * @param {string} name The name of the input.
 * @return {Blockly.Input} The input object, or null of the input does not exist.
 */
Blockly.Block.prototype.getInput = function(name) {
    for (var i = 0, input; input = this.inputList[i]; i++) {
        if (input.name == name) {
            return input;
        }
    }
    // This input does not exist.
    return null;
};

/**
 * Fetches the block attached to the named input.
 * @param {string} name The name of the input.
 * @return {Blockly.Block} The attached value block, or null if the input is
 *     either disconnected or if the input does not exist.
 */
Blockly.Block.prototype.getInputTargetBlock = function(name) {
    var input = this.getInput(name);
    return input && input.connection && input.connection.targetBlock();
};

/**
 * Returns the comment on this block (or '' if none).
 * @return {string} Block's comment.
 */
Blockly.Block.prototype.getCommentText = function() {
    return this.comment || '';
};

/**
 * Set this block's comment text.
 * @param {?string} text The text, or null to delete.
 */
Blockly.Block.prototype.setCommentText = function(text) {
    this.comment = text;
};

/**
 * Set this block's warning text.
 * @param {?string} text The text, or null to delete.
 */
Blockly.Block.prototype.setWarningText = function(text) {
    // NOP.
};

/**
 * Give this block a mutator dialog.
 * @param {Blockly.Mutator} mutator A mutator dialog instance or null to remove.
 */
Blockly.Block.prototype.setMutator = function(mutator) {
    // NOP.
};

/**
 * Return the coordinates of the top-left corner of this block relative to the
 * drawing surface's origin (0,0).
 * @return {!goog.math.Coordinate} Object with .x and .y properties.
 */
Blockly.Block.prototype.getRelativeToSurfaceXY = function() {
    return this.xy_;
};

/**
 * Move a block by a relative offset.
 * @param {number} dx Horizontal offset.
 * @param {number} dy Vertical offset.
 */
Blockly.Block.prototype.moveBy = function(dx, dy) {
    this.xy_.translate(dx, dy);
};


Blockly.Block.prototype.getInputTypesByKind = function(index) {
    var paramTypes = {
        'basic': [],
        'list': []
    };
    var typeVecs = this.typeVecs;
    for (var i = 0; i < typeVecs.length; i++) {
        var type = typeVecs[i].slice(index)[0];
        var kind = 'basic';
        if (type[0] == "*") {
            type = type.slice(1);
            kind = 'list';
        }
        if (paramTypes[kind].indexOf(type) == -1) {
            paramTypes[kind].push(type);
        }
    }
    return paramTypes;
};

Blockly.Block.prototype.getInputKinds = function(index) {
    var types = this.getInputTypesByKind(index);
    return {
        'basic': types.basic.length > 0,
        'list': types.list.length > 0
    };
};


Blockly.Block.prototype.getInputTypes = function(index) {
    var paramTypes = [];
    var typeVecs = this.typeVecs;
    for (var i = 0; i < typeVecs.length; i++) {
        var outputType = typeVecs[i].slice(index)[0];
        if (paramTypes.indexOf(outputType) == -1) {
            paramTypes.push(outputType);
        }
    }
    return paramTypes;
};

/*
Blockly.Block.prototype.getParameterTypes = function(index, kind) {
  var paramTypes = [];
  var typeVecs = this.typeVecs;
  for (var i=0; i < typeVecs.length; i++) {
    var found = false;
    var outputType = typeVecs[i].slice(index)[0];
    if (kind == "list" && outputType[0] == "*") {
      outputType = outputType.slice(1);
      found = true;
    }
    else if (kind == "basic" && outputType[0] != "*") {
      found = true;
    }
    else if (!kind) {
      found = true;
    }
    if (found && paramTypes.indexOf(outputType) == -1) {
        paramTypes.push(outputType);
    }
  }
  return paramTypes;
};
*/

/*Blockly.Block.prototype.getOutputTypes = function(kind) {
  return this.getInputTypesByKind(-1, kind);
};*/

Blockly.Block.prototype.getOutputTypes = function() {
    return this.getInputTypes(-1);
};

Blockly.Block.prototype.getOutputTypesByKind = function() {
    return this.getInputTypesByKind(-1);
};

Blockly.Block.prototype.outputsAList = function() {
    var outputTypes = this.getInputTypesByKind(-1);
    return (outputTypes.list.length > 0);
};



/**
 * Is it legal to drop this block into an empty hole with type indicators
 * given by holeTypes?
 * @param {!Array<string} holeTypes types indicated in hole.
 * @return {bool} true if the drop is legal, false otherwise.
 */
Blockly.Block.prototype.legalDrop = function(holeTypes, requiresVariable) {
    var includesListType = function(types) {
        for (var i = 0; i < types.length; i++) {
            if (types[i][0] == "*") {
                return true;
            }
        }
        return false;
    };
    // do types include at least one non-list type?
    var includesBasicType = function(types) {
        for (var i = 0; i < types.length; i++) {
            if (types[i][0] != "*") {
                return true;
            }
        }
        return false;
    };
    // do types include a grey basic type?
    var includesGreyBasic = function(types) {
        console.log("IGB: ", types);
        return (types.indexOf("any") != -1 ||
            types.indexOf("matching") != -1);
    };
    // do types include a grey list type?
    var includesGreyList = function(types) {
        return (types.indexOf("*any") != -1 ||
            types.indexOf("*matching") != -1);
    };

    if (requiresVariable && this.type != 'variables_get') {
        return false;
    }

    if (includesGreyBasic(holeTypes) && !this.outputsAList()) {
        return true;
    }
    if (includesGreyList(holeTypes) && this.outputsAList()) {
        return true;
    }
    var outputTypes = this.getOutputTypes();
    console.log("OTS: ", this.type, outputTypes);
    if (includesGreyBasic(outputTypes) && includesBasicType(holeTypes)) {
        return true;
    }
    if (includesGreyList(outputTypes) && includesListType(holeTypes)) {
        return true;
    }
    for (var i = 0; i < outputTypes.length; i++) {
        var elem = outputTypes[i];
        console.log("SUBTC holetypes " + holeTypes);
        for (var j = 0; j < holeTypes.length; j++) {
            var holeType = holeTypes[j];
            console.log("SUBTC Checking block type " + elem + " against hole " + holeType);
            if (holeType == elem) {
                return true;
            }
            //  if () {
            //    return true;
            //  }
            //  if (Blockly.Python.SUPERTYPES[holeType] == elem) {
            //    console.log("SUBTC checking its a subtype");
            //    if (Blockly.Python.SUPTYPE_CHECK[holeType](this)) {
            //      return true;
            //    }
            console.log("SUBTC its not!");
            //  }
        }
    }
    return false;
};

Blockly.Block.prototype.unifyUp = function() {
    for (var i = 0, child; child = this.childBlocks_[i]; i++) {
        if (child.outputConnection) {
            console.log("UNIFY child type: " + child.type);
            var position = child.outputConnection.targetConnection.inputNumber_;
            var position2 = child.outputConnection.getInputNumber();
            console.log("POSY ", position, position2);
            console.log("UNIFY UP", position, child.type);
            child.unifyUp();
            this.unify(child, position, -1);
        }
    }
};

Blockly.Block.prototype.unifyDown = function() {
    for (var i = 0, child; child = this.childBlocks_[i]; i++) {
        if (child.outputConnection) {
            var position = child.outputConnection.targetConnection.inputNumber_;
            var position2 = child.outputConnection.getInputNumber();
            console.log("POSY ", position, position2);
            console.log("UNIFY DOWN ", position, child.type);
            child.unify(this, -1, position);
            child.unifyDown();
        }
    }
};

/**
 * Unifies (restricts) the type-vecs of this block to make them all compatible
 * with the type-vecs of a parent or child block.
 * @param {!Block} other the other block.
 * @param {number} selfPos the hole of the other (parent) block in which this
 * block is, or -1 if this block is the parent.XXXXXXXXXXXXX OTHER!!!!
 * @param {number} otherPos the hole of this (parent) block in which the other
 * block is, or -1 if this block is the child.XXXXXXXXXXXXXXX OTHER!!!!
 */
Blockly.Block.prototype.unify = function(other, selfPos, otherPos) {
    // return a type-vec like typeVec but with all occurences of
    // "matched" ( *matched") replaced by newType (*newType)
    var subsMatched = function(typeVec, newType) {
        console.log("RENAME: ", JSON.stringify(typeVec), " with ", newType);
        //  if (newType = "any") {
        //    return typeVec;
        //  }
        var newTypeVec = Array(typeVec.length);
        for (var i = 0; i < typeVec.length; i++) {
            if (typeVec[i] == "matching") {
                newTypeVec[i] = newType; // == "any" ? "matching" : newType;
            } else if (typeVec[i] == "*matching") {
                newTypeVec[i] = "*" + newType; // == "*any" ? "*matching" : "*" + newType;
            } else {
                newTypeVec[i] = typeVec[i];
            }
        }
        console.log("RENAME: ", JSON.stringify(newTypeVec));
        return newTypeVec;
    };
    // does typeVecs include typeVec?
    var typesInclude = function(typeVecs, typeVec) {
        console.log("TYPESINC " + " checking if ", JSON.stringify(typeVecs),
            "includes ", JSON.stringify(typeVec));
        for (var i = 0; i < typeVecs.length; i++) {
            var currentType = typeVecs[i];
            console.log("TYPESINC i", i, " currentType ", currentType);
            var matched = true;
            var j = 0;
            while (matched && j < typeVec.length) {
                console.log("TYPESINC j", j, " currentType[j] ", currentType[j]);
                if (currentType[j] != typeVec[j]) {
                    console.log("TYPESINC not matched");
                    matched = false;
                }
                j++;
            }
            if (matched) {
                console.log("TYPESINC true");
                return true;
            }
        }
        console.log("TYPESINC false");
        return false;
    };

    console.log("UNIFY typeVecs at start: ", this.typeVecs);
    var newTypeVecs = [];
    for (var i = 0; i < this.typeVecs.length; i++) {
        var thisTypeVec = this.typeVecs[i];
        console.log("UNIFY considering thisTypeVec: ", thisTypeVec);
        var thisType = thisTypeVec.slice(selfPos)[0];
        console.log("UNIFY Considering thisType at position",
            selfPos, ": ", thisType);
        for (var j = 0; j < other.typeVecs.length; j++) {
            var otherTypeVec = other.typeVecs[j];
            var otherType = otherTypeVec.slice(otherPos)[0];
            console.log("UNIFY considering otherType at position",
                otherPos, ": ", otherType);
            if (thisType == otherType ||
                (otherType == "any" && thisType[0] != "*") ||
                (otherType == "matching" && thisType[0] != "*") ||
                (otherType == "*any" && thisType[0] == "*") ||
                (otherType == "*matching" && thisType[0] == "*")) {
                if (!typesInclude(newTypeVecs, thisTypeVec)) {
                    console.log("UNIFY matching 1 - keeping: ", thisTypeVec);
                    newTypeVecs.push(thisTypeVec);
                }
            } else if (thisType == "matching" && otherType[0] != "*") {
                var renamed = subsMatched(thisTypeVec, otherType);
                if (!typesInclude(newTypeVecs, renamed)) {
                    console.log("UNIFY matching 2 - renamed: ", renamed);
                    newTypeVecs.push(renamed);
                }
            } else if (thisType == "*matching" && otherType[0] == "*") {
                var renamedList = subsMatched(thisTypeVec, otherType.slice(1));
                if (!typesInclude(newTypeVecs, renamedList)) {
                    console.log("UNIFY matching 3 - renamed: ", renamedList);
                    newTypeVecs.push(renamedList);
                }
            } else if ((thisType == "any" && otherType[0] != "*") ||
                (thisType == "*any" && otherType[0] == "*")) {
                if (!typesInclude(newTypeVecs, thisTypeVec)) {
                    console.log("UNIFY matching 4 - keeping: ", thisTypeVec);
                    newTypeVecs.push(thisTypeVec);
                }
            }
        }
    }
    this.typeVecs = newTypeVecs;
    console.log("UNIFY " + this.type + " typeVecs at end: ",
        JSON.stringify(this.typeVecs));
};
