/* jshint -W084 */

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
 * @fileoverview Methods for graphically rendering a block as SVG.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';


goog.provide('Blockly.BlockSvg');

goog.require('Blockly.Python');
goog.require('Blockly.Block');
goog.require('Blockly.ContextMenu');
goog.require('goog.Timer');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.math.Coordinate');


/**
 * Class for a block's SVG representation.
 * @extends {Blockly.Block}
 * @constructor
 */
Blockly.BlockSvg = function() {
    // Create core elements for the block.
    /** @type {SVGElement} */
    this.svgGroup_ = Blockly.createSvgElement('g', {}, null);
    /** @type {SVGElement} */
    this.svgPathDark_ = Blockly.createSvgElement('path', {
            'class': 'blocklyPathDark',
            'transform': 'translate(4,4)'
        },
        this.svgGroup_);
    /** @type {SVGElement} */
    this.svgBlockPath_ = Blockly.createSvgElement('path', {
            'class': 'blocklyBlockPath'
        },
        this.svgGroup_);

    /** @type {Array<!SVGElement>} */
    this.svgListRects = new Array(3);
    for (var i = 0; i < 3; i++) {
        this.svgListRects[i] = Blockly.createSvgElement('rect', {}, this.svgGroup_);
    }

    //console.log("CREATING BLOCK SVG");

    /** @type {SVGElement} */
    this.svgHolePath_ = Blockly.createSvgElement('path', {
        'class': 'blocklyHolePath'
    }, this.svgGroup_);

    this.svgHoleGroup = Blockly.createSvgElement('g', {
        'class': 'blocklyHolePath'
    }, this.svgGroup_);

    this.svgIndicatorGroup = Blockly.createSvgElement('g', {}, this.svgGroup_);
    this.indicators = {};
    this.clicks = 0;
    this.dblChk = null;

    this.svgBlockPath_.tooltip = this;
    Blockly.Tooltip.bindMouseEvents(this.svgBlockPath_);
};
goog.inherits(Blockly.BlockSvg, Blockly.Block);

/**
 * Height of this block, not including any statement blocks above or below.
 */
Blockly.BlockSvg.prototype.height = 0;
/**
 * Width of this block, including any connected value blocks.
 */
Blockly.BlockSvg.prototype.width = 0;

/**
 * Original location of block being dragged.
 * @type {goog.math.Coordinate}
 * @private
 */
Blockly.BlockSvg.prototype.dragStartXY_ = null;

/**
 * Constant for identifying rows that are to be rendered inline.
 * Don't collide with Blockly.INPUT_VALUE and friends.
 * @const
 */
Blockly.BlockSvg.INLINE = -1;

/**
 * Create and initialize the SVG representation of the block.
 * May be called more than once.
 */
Blockly.BlockSvg.prototype.initSvg = function() {
    goog.asserts.assert(this.workspace.rendered, 'Workspace is headless.');
    for (var i = 0, input; input = this.inputList[i]; i++) {
        input.init();
    }
    if (this.mutator) {
        this.mutator.createIcon();
    }
    //this.updateColour();
    this.updateMovable();
    if (!this.workspace.options.readOnly && !this.eventsInit_) {
        Blockly.bindEvent_(this.getSvgRoot(), 'mousedown', this,
            this.onMouseDown_);
        var thisBlock = this;
        Blockly.bindEvent_(this.getSvgRoot(), 'touchstart', null,
            function(e) {
                Blockly.longStart_(e, thisBlock);
            });
    }
    // Bind an onchange function, if it exists.
    if (goog.isFunction(this.onchange) && !this.eventsInit_) {
        this.onchangeWrapper_ = Blockly.bindEvent_(this.workspace.getCanvas(),
            'blocklyWorkspaceChange', this, this.onchange);
    }
    this.eventsInit_ = true;

    if (!this.getSvgRoot().parentNode) {
        this.workspace.getCanvas().appendChild(this.getSvgRoot());
    }
};

/**
 * Select this block.  Highlight it visually.
 */
Blockly.BlockSvg.prototype.select = function() {
    if (Blockly.selected) {
        // Unselect any previously selected block.
        Blockly.selected.unselect();
    }
    Blockly.selected = this;
    this.addSelect();
    Blockly.fireUiEvent(this.workspace.getCanvas(), 'blocklySelectChange');
};

/**
 * Unselect this block.  Remove its highlighting.
 */
Blockly.BlockSvg.prototype.unselect = function() {
    Blockly.selected = null;
    this.removeSelect();
    Blockly.fireUiEvent(this.workspace.getCanvas(), 'blocklySelectChange');
};

/**
 * Block's mutator icon (if any).
 * @type {Blockly.Mutator}
 */
Blockly.BlockSvg.prototype.mutator = null;

/**
 * Block's comment icon (if any).
 * @type {Blockly.Comment}
 */
Blockly.BlockSvg.prototype.comment = null;

/**
 * Block's warning icon (if any).
 * @type {Blockly.Warning}
 */
Blockly.BlockSvg.prototype.warning = null;

/**
 * Returns a list of mutator, comment, and warning icons.
 * @return {!Array} List of icons.
 */
Blockly.BlockSvg.prototype.getIcons = function() {
    var icons = [];
    if (this.mutator) {
        icons.push(this.mutator);
    }
    if (this.comment) {
        icons.push(this.comment);
    }
    if (this.warning) {
        icons.push(this.warning);
    }
    return icons;
};

/**
 * Wrapper function called when a mouseUp occurs during a drag operation.
 * @type {Array.<!Array>}
 * @private
 */
Blockly.BlockSvg.onMouseUpWrapper_ = null;

/**
 * Wrapper function called when a mouseMove occurs during a drag operation.
 * @type {Array.<!Array>}
 * @private
 */
Blockly.BlockSvg.onMouseMoveWrapper_ = null;

/**
 * Stop binding to the global mouseup and mousemove events.
 * @private
 */
Blockly.BlockSvg.terminateDrag_ = function() {
    Blockly.BlockSvg.disconnectUiStop_();
    if (Blockly.BlockSvg.onMouseUpWrapper_) {
        Blockly.unbindEvent_(Blockly.BlockSvg.onMouseUpWrapper_);
        Blockly.BlockSvg.onMouseUpWrapper_ = null;
    }
    if (Blockly.BlockSvg.onMouseMoveWrapper_) {
        Blockly.unbindEvent_(Blockly.BlockSvg.onMouseMoveWrapper_);
        Blockly.BlockSvg.onMouseMoveWrapper_ = null;
    }
    var selected = Blockly.selected;
    if (Blockly.dragMode_ == 2) {
        // Terminate a drag operation.
        if (selected) {
            // Update the connection locations.
            var xy = selected.getRelativeToSurfaceXY();
            var dxy = goog.math.Coordinate.difference(xy, selected.dragStartXY_);
            selected.moveConnections_(dxy.x, dxy.y);
            delete selected.draggedBubbles_;
            selected.setDragging_(false);
            //  console.log("RENTEST - terminateDrag calls renders");
            //    selected.render();  ---- why is this here?
            //selected.updateColour();
            goog.Timer.callOnce(
                selected.snapToGrid, Blockly.BUMP_DELAY / 2, selected);
            goog.Timer.callOnce(
                selected.bumpNeighbours_, Blockly.BUMP_DELAY, selected);
            // Fire an event to allow scrollbars to resize.
            Blockly.fireUiEvent(window, 'resize');
            selected.workspace.fireChangeEvent();
        }
    }
    Blockly.dragMode_ = 0;
    Blockly.Css.setCursor(Blockly.Css.Cursor.OPEN);
};

/**
 * Set parent of this block to be a new block or null.
 * @param {Blockly.BlockSvg} newParent New parent block.
 */
Blockly.BlockSvg.prototype.setParent = function(newParent) {
    var svgRoot = this.getSvgRoot();
    if (this.parentBlock_ && svgRoot) {
        // Move this block up the DOM.  Keep track of x/y translations.
        var xy = this.getRelativeToSurfaceXY();
        this.workspace.getCanvas().appendChild(svgRoot);
        svgRoot.setAttribute('transform', 'translate(' + xy.x + ',' + xy.y + ')');
    }

    Blockly.Field.startCache();
    Blockly.BlockSvg.superClass_.setParent.call(this, newParent);
    Blockly.Field.stopCache();

    if (newParent) {
        var oldXY = this.getRelativeToSurfaceXY();
        newParent.getSvgRoot().appendChild(svgRoot);
        var newXY = this.getRelativeToSurfaceXY();
        // Move the connections to match the child's new position.
        this.moveConnections_(newXY.x - oldXY.x, newXY.y - oldXY.y);
    }
};

/**
 * Return the coordinates of the top-left corner of this block relative to the
 * drawing surface's origin (0,0).
 * @return {!goog.math.Coordinate} Object with .x and .y properties.
 */
Blockly.BlockSvg.prototype.getRelativeToSurfaceXY = function() {
    var x = 0;
    var y = 0;
    var element = this.getSvgRoot();
    if (element) {
        do {
            // Loop through this block and every parent.
            var xy = Blockly.getRelativeXY_(element);
            x += xy.x;
            y += xy.y;
            element = element.parentNode;
        } while (element && element != this.workspace.getCanvas());
    }
    return new goog.math.Coordinate(x, y);
};

/**
 * Move a block by a relative offset.
 * @param {number} dx Horizontal offset.
 * @param {number} dy Vertical offset.
 */
Blockly.BlockSvg.prototype.moveBy = function(dx, dy) {
    var xy = this.getRelativeToSurfaceXY();
    this.getSvgRoot().setAttribute('transform',
        'translate(' + (xy.x + dx) + ',' + (xy.y + dy) + ')');
    this.moveConnections_(dx, dy);
    Blockly.Realtime.blockChanged(this);
};

/**
 * Snap this block to the nearest grid point.
 */
Blockly.BlockSvg.prototype.snapToGrid = function() {
    if (!this.workspace) {
        return; // Deleted block.
    }
    if (Blockly.dragMode_ != 0) {
        return; // Don't bump blocks during a drag.
    }
    if (this.getParent()) {
        return; // Only snap top-level blocks.
    }
    if (this.isInFlyout) {
        return; // Don't move blocks around in a flyout.
    }
    if (!this.workspace.options.gridOptions ||
        !this.workspace.options.gridOptions['snap']) {
        return; // Config says no snapping.
    }
    var spacing = this.workspace.options.gridOptions['spacing'];
    var half = spacing / 2;
    var xy = this.getRelativeToSurfaceXY();
    var dx = Math.round((xy.x - half) / spacing) * spacing + half - xy.x;
    var dy = Math.round((xy.y - half) / spacing) * spacing + half - xy.y;
    dx = Math.round(dx);
    dy = Math.round(dy);
    if (dx != 0 || dy != 0) {
        this.moveBy(dx, dy);
    }
};

/**
 * Returns a bounding box describing the dimensions of this block
 * and any blocks stacked below it.
 * @return {!{height: number, width: number}} Object with height and width properties.
 */
Blockly.BlockSvg.prototype.getHeightWidth = function() {
    var height = this.height;
    var width = this.width;
    // Recursively add size of subsequent blocks.
    var nextBlock = this.getNextBlock();
    if (nextBlock) {
        var nextHeightWidth = nextBlock.getHeightWidth();
        height += nextHeightWidth.height - 4; // Height of tab.
        width = Math.max(width, nextHeightWidth.width);
    } else if (!this.nextConnection && !this.outputConnection) {
        // Add a bit of margin under blocks with no bottom tab.
        height += 2;
    }
    return {
        height: height,
        width: width
    };
};

/**
 * Set whether the block is collapsed or not.
 * @param {boolean} collapsed True if collapsed.
 */
Blockly.BlockSvg.prototype.setCollapsed = function(collapsed) {
    if (this.collapsed_ == collapsed) {
        return;
    }
    var renderList = [];
    // Show/hide the inputs.
    for (var i = 0, input; input = this.inputList[i]; i++) {
        renderList.push.apply(renderList, input.setVisible(!collapsed));
    }

    var COLLAPSED_INPUT_NAME = '_TEMP_COLLAPSED_INPUT';
    if (collapsed) {
        var icons = this.getIcons();
        for (i = 0; i < icons.length; i++) {
            icons[i].setVisible(false);
        }
        var text = this.toString(Blockly.COLLAPSE_CHARS);
        this.appendDummyInput(COLLAPSED_INPUT_NAME).appendField(text).init();
    } else {
        this.removeInput(COLLAPSED_INPUT_NAME);
        // Clear any warnings inherited from enclosed blocks.
        this.setWarningText(null);
    }
    Blockly.BlockSvg.superClass_.setCollapsed.call(this, collapsed);

    if (!renderList.length) {
        // No child blocks, just render this block.
        renderList[0] = this;
    }
    if (this.rendered) {
        for (var i = 0, block; block = renderList[i]; i++) {
            block.render();
        }
        // Don't bump neighbours.
        // Although bumping neighbours would make sense, users often collapse
        // all their functions and store them next to each other.  Expanding and
        // bumping causes all their definitions to go out of alignment.
    }
    this.workspace.fireChangeEvent();
};

/**
 * Open the next (or previous) FieldTextInput.
 * @param {Blockly.Field|Blockly.Block} start Current location.
 * @param {boolean} forward If true go forward, otherwise backward.
 */
Blockly.BlockSvg.prototype.tab = function(start, forward) {
    // This function need not be efficient since it runs once on a keypress.
    // Create an ordered list of all text fields and connected inputs.
    var list = [];
    for (var i = 0, input; input = this.inputList[i]; i++) {
        for (var j = 0, field; field = input.fieldRow[j]; j++) {
            if (field instanceof Blockly.FieldTextInput) {
                // TODO: Also support dropdown fields.
                list.push(field);
            }
        }
        if (input.connection) {
            var block = input.connection.targetBlock();
            if (block) {
                list.push(block);
            }
        }
    }
    var i = list.indexOf(start);
    if (i == -1) {
        // No start location, start at the beginning or end.
        i = forward ? -1 : list.length;
    }
    var target = list[forward ? i + 1 : i - 1];
    if (!target) {
        // Ran off of list.
        var parent = this.getParent();
        if (parent) {
            parent.tab(this, forward);
        }
    } else if (target instanceof Blockly.Field) {
        target.showEditor_();
    } else {
        target.tab(null, forward);
    }
};

/**
 * Handle a mouse-down on an SVG block.
 * @param {!Event} e Mouse down event.
 * @private
 */

Blockly.BlockSvg.prototype.onMouseDown_ = function(e) {
    if (this.isInFlyout) {
        return;
    }

    // If no double-click eval, unfocus interpreter
    if (document.getElementById('output') === document.activeElement) {
        this.clicks++;
        e.preventDefault();

        this.dblChk = setTimeout(function() {
            if (this.clicks <= 1) {
                document.getElementById('output').blur();
                this.clicks = 0;
            } else {
                document.getElementById('output').focus(); // Just in case
                clearTimeout(this.dblChk);
                this.clicks = 0;
            }
        }.bind(this), 500);
    }

    this.workspace.markFocused();
    // Update Blockly's knowledge of its own location.
    Blockly.svgResize(this.workspace);
    Blockly.terminateDrag_();
    this.select();
    Blockly.hideChaff();
    if (Blockly.isRightButton(e)) {
        // Right-click.
        this.showContextMenu_(e);
    } else if (!this.isMovable()) {
        // Allow unmovable blocks to be selected and context menued, but not
        // dragged.  Let this event bubble up to document, so the workspace may be
        // dragged instead.
        return;
    } else {
        // Left-click (or middle click)
        Blockly.removeAllRanges();
        Blockly.Css.setCursor(Blockly.Css.Cursor.CLOSED);

        this.dragStartXY_ = this.getRelativeToSurfaceXY();
        this.workspace.startDrag(e, this.dragStartXY_.x, this.dragStartXY_.y);

        Blockly.dragMode_ = 1;
        Blockly.BlockSvg.onMouseUpWrapper_ = Blockly.bindEvent_(document,
            'mouseup', this, this.onMouseUp_);
        Blockly.BlockSvg.onMouseMoveWrapper_ = Blockly.bindEvent_(document,
            'mousemove', this, this.onMouseMove_);
        // Build a list of bubbles that need to be moved and where they started.
        this.draggedBubbles_ = [];
        var descendants = this.getDescendants();
        for (var i = 0, descendant; descendant = descendants[i]; i++) {
            var icons = descendant.getIcons();
            for (var j = 0; j < icons.length; j++) {
                var data = icons[j].getIconLocation();
                data.bubble = icons[j];
                this.draggedBubbles_.push(data);
            }
        }
    }
    // This event has been handled.  No need to bubble up to the document.
    e.stopPropagation();
};

/**
 * Handle a mouse-up anywhere in the SVG pane.  Is only registered when a
 * block is clicked.  We can't use mouseUp on the block since a fast-moving
 * cursor can briefly escape the block before it catches up.
 * @param {!Event} e Mouse up event.
 * @private
 */
Blockly.BlockSvg.prototype.onMouseUp_ = function(e) {
    var this_ = this;
    Blockly.doCommand(function() {
        Blockly.terminateDrag_();
        if (Blockly.selected && Blockly.highlightedConnection_) {
            // Connect two blocks together.
            Blockly.localConnection_.connect(Blockly.highlightedConnection_);

            // If this is a statement nested in another block which has a next
            // statement, reorder the DOM to prevent nested blocks casting an
            // incorrect shadow over the next statement block
            if (!this_.outputConnection && previousConnection != null) {
                var previousConnection = this_.previousConnection;
                var connectionX = previousConnection.x_;
                var previousBlock = previousConnection.targetBlock();
                while (previousBlock) {
                    var currentBlock = previousBlock;
                    previousConnection = currentBlock.previousConnection;
                    if (previousConnection.x_ != connectionX) {
                        // this_ is nested in currentBlock
                        var nextBlock = currentBlock.nextConnection.targetBlock();
                        if (nextBlock) {
                            var currentRoot = currentBlock.getSvgRoot();
                            var nextBlockRoot = nextBlock.getSvgRoot();
                            currentRoot.appendChild(nextBlockRoot);
                        }
                        break;
                    }
                    previousBlock = previousConnection.targetBlock();
                }
            }
            //  else { // this is an expression
            //    console.log("DROPPED INTO INPUT ", this_.outputConnection.targetConnection.inputNumber_);
            //    this_.checkParentheses();
            //    this_.reType(true);
            //  }

            if (this_.rendered) {
                // Trigger a connection animation.
                // Determine which connection is inferior (lower in the source stack).
                var inferiorConnection;
                if (Blockly.localConnection_.isSuperior()) {
                    inferiorConnection = Blockly.highlightedConnection_;
                } else {
                    inferiorConnection = Blockly.localConnection_;
                }
                inferiorConnection.sourceBlock_.connectionUiEffect();
            }
            if (this_.workspace.trashcan) {
                // Don't throw an object in the trash can if it just got connected.
                this_.workspace.trashcan.close();
            }
        } else if (!this_.getParent() && Blockly.selected.isDeletable() &&
            this_.workspace.isDeleteArea(e)) {
            var trashcan = this_.workspace.trashcan;
            if (trashcan) {
                goog.Timer.callOnce(trashcan.close, 100, trashcan);
            }
            Blockly.selected.dispose(false, true);
            // Dropping a block on the trash can will usually cause the workspace to
            // resize to contain the newly positioned block.  Force a second resize
            // now that the block has been deleted.
            Blockly.fireUiEvent(window, 'resize');
        }
        if (Blockly.highlightedConnection_) {
            Blockly.highlightedConnection_.unhighlight();
            Blockly.highlightedConnection_ = null;
        }
        Blockly.Css.setCursor(Blockly.Css.Cursor.OPEN);
    });
};

Blockly.Block.prototype.reType = function(opt_render) {
    console.log("RENTEST - Entering retype on ", this.type);
    if (!this.workspace) {
        // don't bother if not on workspace
        return;
    }
    var topLevel = this.getTopLevel();
    console.log("RENTEST - toplevel type is ", topLevel.type);
    topLevel.restoreFullTypes();
    topLevel.unifyUp();
    topLevel.unifyDown();
    if (opt_render) {
        this.renderNoColour();
    }
    topLevel.updateColourDown();
};

/**
 * Load the block's help page in a new window.
 * @private
 */
Blockly.BlockSvg.prototype.showHelp_ = function() {
    var url = goog.isFunction(this.helpUrl) ? this.helpUrl() : this.helpUrl;
    if (url) {
        window.open(url);
    }
};

/**
 * Show the context menu for this block.
 * @param {!Event} e Mouse event.
 * @private
 */
Blockly.BlockSvg.prototype.showContextMenu_ = function(e) {
    if (this.workspace.options.readOnly || !this.contextMenu) {
        return;
    }
    // Save the current block in a variable for use in closures.
    var block = this;
    var menuOptions = [];

    if (this.isDeletable() && this.isMovable() && !block.isInFlyout) {
        // Option to duplicate this block.
        var duplicateOption = {
            text: Blockly.Msg.DUPLICATE_BLOCK,
            enabled: true,
            callback: function() {
                Blockly.duplicate_(block);
            }
        };
        if (this.getDescendants().length > this.workspace.remainingCapacity()) {
            duplicateOption.enabled = false;
        }
        menuOptions.push(duplicateOption);

        var evaluateOption = {
            text: Blockly.Msg.EVAL,
            enabled: true,
            callback: function() {
                runeval(block);
            }
        };
        menuOptions.push(evaluateOption);

        /* MJP remove add comment, collapse and disable options
            if (this.isEditable() && !this.collapsed_ &&
                this.workspace.options.comments) {
              // Option to add/remove a comment.
              var commentOption = {enabled: true};
              if (this.comment) {
                commentOption.text = Blockly.Msg.REMOVE_COMMENT;
                commentOption.callback = function() {
                  block.setCommentText(null);
                };
              } else {
                commentOption.text = Blockly.Msg.ADD_COMMENT;
                commentOption.callback = function() {
                  block.setCommentText('');
                };
              }
              menuOptions.push(commentOption);
            }


            // Option to make block inline.
            if (!this.collapsed_) {
              for (var i = 1; i < this.inputList.length; i++) {
                if (this.inputList[i - 1].type != Blockly.NEXT_STATEMENT &&
                    this.inputList[i].type != Blockly.NEXT_STATEMENT) {
                  // Only display this option if there are two value or dummy inputs
                  // next to each other.
                  var inlineOption = {enabled: true};
                  var isInline = this.getInputsInline();
                  inlineOption.text = isInline ?
                      Blockly.Msg.EXTERNAL_INPUTS : Blockly.Msg.INLINE_INPUTS;
                  inlineOption.callback = function() {
                    block.setInputsInline(!isInline);
                  };
                  menuOptions.push(inlineOption);
                  break;
                }
              }
            }

            if (this.workspace.options.collapse) {
              // Option to collapse/expand block.
              if (this.collapsed_) {
                var expandOption = {enabled: true};
                expandOption.text = Blockly.Msg.EXPAND_BLOCK;
                expandOption.callback = function() {
                  block.setCollapsed(false);
                };
                menuOptions.push(expandOption);
              } else {
                var collapseOption = {enabled: true};
                collapseOption.text = Blockly.Msg.COLLAPSE_BLOCK;
                collapseOption.callback = function() {
                  block.setCollapsed(true);
                };
                menuOptions.push(collapseOption);
              }
            }

            if (this.workspace.options.disable) {
              // Option to disable/enable block.
              var disableOption = {
                text: this.disabled ?
                    Blockly.Msg.ENABLE_BLOCK : Blockly.Msg.DISABLE_BLOCK,
                enabled: !this.getInheritedDisabled(),
                callback: function() {
                  block.setDisabled(!block.disabled);
                }
              };
              menuOptions.push(disableOption);
            }
        */

        // Option to delete this block.
        // Count the number of blocks that are nested in this block.
        var descendantCount = this.getDescendants().length;
        var nextBlock = this.getNextBlock();
        if (nextBlock) {
            // Blocks in the current stack would survive this block's deletion.
            descendantCount -= nextBlock.getDescendants().length;
        }
        var deleteOption = {
            text: descendantCount == 1 ? Blockly.Msg.DELETE_BLOCK : Blockly.Msg.DELETE_X_BLOCKS.replace('%1', String(descendantCount)),
            enabled: true,
            callback: function() {
                block.dispose(true, true);
            }
        };
        menuOptions.push(deleteOption);
    }

    // Option to get help.
    // var url = goog.isFunction(this.helpUrl) ? this.helpUrl() : this.helpUrl;
    // var helpOption = {enabled: !!url};
    // helpOption.text = Blockly.Msg.HELP;
    // helpOption.callback = function() {
    //   block.showHelp_();
    // };
    // menuOptions.push(helpOption);

    // Allow the block to add or modify menuOptions.
    if (this.customContextMenu && !block.isInFlyout) {
        this.customContextMenu(menuOptions);
    }

    Blockly.ContextMenu.show(e, menuOptions, this.RTL);
    Blockly.ContextMenu.currentBlock = this;
};

/**
 * Move the connections for this block and all blocks attached under it.
 * Also update any attached bubbles.
 * @param {number} dx Horizontal offset from current location.
 * @param {number} dy Vertical offset from current location.
 * @private
 */
Blockly.BlockSvg.prototype.moveConnections_ = function(dx, dy) {
    if (!this.rendered) {
        // Rendering is required to lay out the blocks.
        // This is probably an invisible block attached to a collapsed block.
        return;
    }
    var myConnections = this.getConnections_(false);
    for (var i = 0; i < myConnections.length; i++) {
        myConnections[i].moveBy(dx, dy);
    }
    var icons = this.getIcons();
    for (var i = 0; i < icons.length; i++) {
        icons[i].computeIconLocation();
    }

    // Recurse through all blocks attached under this one.
    for (var i = 0; i < this.childBlocks_.length; i++) {
        this.childBlocks_[i].moveConnections_(dx, dy);
    }
};

/**
 * Recursively adds or removes the dragging class to this node and its children.
 * @param {boolean} adding True if adding, false if removing.
 * @private
 */
Blockly.BlockSvg.prototype.setDragging_ = function(adding) {
    if (adding) {
        this.addDragging();
    } else {
        this.removeDragging();
    }
    // Recurse through all statement blocks attached under this one.
    for (var i = 0; i < this.childBlocks_.length; i++) {
        if (!this.childBlocks_[i].outputConnection)
            this.childBlocks_[i].setDragging_(adding);
    }
};

/**
 * Drag this block to follow the mouse.
 * @param {!Event} e Mouse move event.
 * @private
 */
Blockly.BlockSvg.prototype.onMouseMove_ = function(e) {
    var this_ = this;
    var workspace_ = this.workspace;
    Blockly.doCommand(function() {
        if (e.type == 'mousemove' && e.clientX <= 1 && e.clientY == 0 &&
            e.button == 0) {
            /* HACK:
             Safari Mobile 6.0 and Chrome for Android 18.0 fire rogue mousemove
             events on certain touch actions. Ignore events with these signatures.
             This may result in a one-pixel blind spot in other browsers,
             but this shouldn't be noticeable. */
            e.stopPropagation();
            return;
        }
        Blockly.removeAllRanges();

        var oldXY = this_.getRelativeToSurfaceXY();
        var newXY = workspace_.moveDrag(e);

        var group = this_.getSvgRoot();
        if (Blockly.dragMode_ == 1) {
            // Still dragging within the sticky DRAG_RADIUS.
            var dr = goog.math.Coordinate.distance(oldXY, newXY) * workspace_.scale;
            if (dr > Blockly.DRAG_RADIUS) {
                // Switch to unrestricted dragging.
                Blockly.dragMode_ = 2;
                Blockly.longStop_();
                group.translate_ = '';
                group.skew_ = '';
                if (this_.parentBlock_) {
                    // Push this block to the very top of the stack.
                    this_.setParent(null);
                    this_.disconnectUiEffect();
                }
                this_.setDragging_(true);
                workspace_.recordDeleteAreas();
            }
        }
        if (Blockly.dragMode_ == 2) {
            // Unrestricted dragging.
            var dx = oldXY.x - this_.dragStartXY_.x;
            var dy = oldXY.y - this_.dragStartXY_.y;
            group.translate_ = 'translate(' + newXY.x + ',' + newXY.y + ')';
            group.setAttribute('transform', group.translate_ + group.skew_);
            // Drag all the nested bubbles.
            for (var i = 0; i < this_.draggedBubbles_.length; i++) {
                var commentData = this_.draggedBubbles_[i];
                commentData.bubble.setIconLocation(commentData.x + dx,
                    commentData.y + dy);
            }

            // Check to see if any of this block's connections are within range of
            // another block's connection.
            var myConnections = this_.getConnections_(false);
            var closestConnection = null;
            var localConnection = null;
            var radiusConnection = Blockly.SNAP_RADIUS;
            var connectionInput = -1;
            for (var i = 0; i < myConnections.length; i++) {
                var myConnection = myConnections[i];
                console.log("MyConnection " + i + " = ", myConnection.x_, myConnection.y_);
                console.log("Connection type " + myConnection.type)
                var neighbour = myConnection.closest(radiusConnection, dx, dy);
                if (neighbour.connection &&
                    neighbour.connection.type != Blockly.OUTPUT_VALUE) {
                    closestConnection = neighbour.connection;
                    connectionInput = i;
                    localConnection = myConnection;
                    radiusConnection = neighbour.radius;
                }
            }

            // Remove connection highlighting if needed.
            if (Blockly.highlightedConnection_ &&
                Blockly.highlightedConnection_ != closestConnection) {
                Blockly.highlightedConnection_.unhighlight();
                Blockly.highlightedConnection_ = null;
                Blockly.localConnection_ = null;
            }
            // Add connection highlighting if needed.
            if (closestConnection &&
                closestConnection != Blockly.highlightedConnection_) {

                // TODO: improve this. Shouldn't need to search and blocks' lh sides
                // shouldn't be used for search
                if (closestConnection.type == Blockly.INPUT_VALUE) {
                    var sourceBlock = closestConnection.sourceBlock_;
                    for (var j = 0, input; input = sourceBlock.inputList[j]; j++) {
                        if (input.connection == closestConnection) {
                            var inputWidth = input.renderWidth;
                            closestConnection.highlight(inputWidth);
                        }
                    }
                } else {
                    closestConnection.highlight();
                }

                Blockly.highlightedConnection_ = closestConnection;
                Blockly.localConnection_ = localConnection;
            }
            // Provide visual indication of whether the block will be deleted if
            // dropped here.
            if (this_.isDeletable()) {
                workspace_.isDeleteArea(e);
            }
        }
        // This event has been handled.  No need to bubble up to the document.
        e.stopPropagation();
    });
};

/**
 * Add or remove the UI indicating if this block is movable or not.
 */
Blockly.BlockSvg.prototype.updateMovable = function() {
    if (this.isMovable()) {
        Blockly.addClass_( /** @type {!Element} */ (this.svgGroup_),
            'blocklyDraggable');
    } else {
        Blockly.removeClass_( /** @type {!Element} */ (this.svgGroup_),
            'blocklyDraggable');
    }
};

/**
 * Set whether this block is movable or not.
 * @param {boolean} movable True if movable.
 */
Blockly.BlockSvg.prototype.setMovable = function(movable) {
    Blockly.BlockSvg.superClass_.setMovable.call(this, movable);
    this.updateMovable();
};

/**
 * Set whether this block is editable or not.
 * @param {boolean} movable True if editable.
 */
Blockly.BlockSvg.prototype.setEditable = function(editable) {
    Blockly.BlockSvg.superClass_.setEditable.call(this, editable);
    if (this.rendered) {
        for (var i = 0; i < this.icons_.length; i++) {
            this.icons_[i].updateEditable();
        }
    }
};

/**
 * Set whether this block is a shadow block or not.
 * @param {boolean} shadow True if a shadow.
 */
Blockly.BlockSvg.prototype.setShadow = function(shadow) {
    Blockly.BlockSvg.superClass_.setShadow.call(this, shadow);
    this.updateColour();
};

/**
 * Return the root node of the SVG or null if none exists.
 * @return {Element} The root SVG node (probably a group).
 */
Blockly.BlockSvg.prototype.getSvgRoot = function() {
    return this.svgGroup_;
};

// UI constants for rendering blocks.
/**
 * Horizontal space between elements.
 * @const
 */
Blockly.BlockSvg.SEP_SPACE_X = 0; // MJP
/**
 * Horizontal space for empty slots
 * @const
 */
Blockly.BlockSvg.SLOT_WIDTH = 54; // MJP
/**
 * Horizontal space for empty wide slots
 * @const
 */


Blockly.BlockSvg.SEP_SPACE_Y = 10; // MJP
/**
 * Vertical padding around inline elements.
 * @const
 */
Blockly.BlockSvg.TEXT_PADDING_TOP = 5;
/**
 * Vertical padding around inline elements.
 * @const
 */
Blockly.BlockSvg.STMT_ARGS_PADDING_TOP = 3;
/**
 * Vertical padding around inline elements.
 * @const
 */
Blockly.BlockSvg.INLINE_PADDING_BOTTOM = 8;


/**
 * Minimum height of a block.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y = 24;
/**
 * Height of horizontal puzzle tab.
 * @const
 */

/**
 * Minimum height of a statement block.
 * @const
 */
Blockly.BlockSvg.MIN_STMT_BLOCK_Y =
    Blockly.BlockSvg.STMT_ARGS_PADDING_TOP +
    Blockly.BlockSvg.MIN_BLOCK_Y +
    2 * Blockly.BlockSvg.INLINE_PADDING_BOTTOM;


/**
 * Height of type indicator.
 * @const
 */
Blockly.BlockSvg.INDICATOR_HEIGHT = 18;

/**
 * Width of type indicator.
 * @const
 */
Blockly.BlockSvg.INDICATOR_WIDTH = 36;

/**
 * Gap underneath type indicator.
 * @const
 */
Blockly.BlockSvg.INDICATOR_GAP_Y = 3;

/**
 * Gap between type indicators.
 * @const
 */
Blockly.BlockSvg.INDICATOR_GAP_X = 10;


Blockly.BlockSvg.DOUBLE_SLOT_WIDTH =
    Blockly.BlockSvg.SLOT_WIDTH +
    Blockly.BlockSvg.INDICATOR_WIDTH +
    Blockly.BlockSvg.INDICATOR_GAP_X;

/**
 * Vertical space between elements.
 * @const
 */



Blockly.BlockSvg.TAB_HEIGHT = 0;
/**
 * Width of horizontal puzzle tab.
 * @const
 */
Blockly.BlockSvg.TAB_WIDTH = 10;
/**
 * Width of vertical tab (inc left margin).
 * @const
 */
Blockly.BlockSvg.NOTCH_WIDTH = 20; // MJP
/**
 * Rounded corner radius.
 * @const
 */
Blockly.BlockSvg.CORNER_RADIUS = 0; // MJP
/**
 * Do blocks with no previous or output connections have a 'hat' on top?
 * @const
 */
Blockly.BlockSvg.START_HAT = false;
/**
 * Path of the top hat's curve.
 * @const
 */
Blockly.BlockSvg.START_HAT_PATH = 'c 30,-15 70,-15 100,0';
/**
 * Path of the top hat's curve's highlight in LTR.
 * @const
 */
Blockly.BlockSvg.START_HAT_HIGHLIGHT_LTR =
    'c 17.8,-9.2 45.3,-14.9 75,-8.7 M 100.5,0.5';
/**
 * Path of the top hat's curve's highlight in RTL.
 * @const
 */
Blockly.BlockSvg.START_HAT_HIGHLIGHT_RTL =
    'm 25,-8.7 c 29.7,-6.2 57.2,-0.5 75,8.7';
/**
 * Distance from shape edge to intersect with a curved corner at 45 degrees.
 * Applies to highlighting on around the inside of a curve.
 * @const
 */
Blockly.BlockSvg.DISTANCE_45_INSIDE = (1 - Math.SQRT1_2) *
    (Blockly.BlockSvg.CORNER_RADIUS - 0.5) + 0.5;
/**
 * Distance from shape edge to intersect with a curved corner at 45 degrees.
 * Applies to highlighting on around the outside of a curve.
 * @const
 */
Blockly.BlockSvg.DISTANCE_45_OUTSIDE = (1 - Math.SQRT1_2) *
    (Blockly.BlockSvg.CORNER_RADIUS + 0.5) - 0.5;
/**
 * SVG path for drawing next/previous notch from left to right.
 * @const
 */
Blockly.BlockSvg.NOTCH_PATH_LEFT = 'l 6,-4 3,0 6,4';
/**
 * SVG path for drawing next/previous notch from left to right with
 * highlighting.
 * @const
 */
Blockly.BlockSvg.NOTCH_PATH_LEFT_HIGHLIGHT = 'l 6,-4 3,0 6,4';
/**
 * SVG path for drawing next/previous notch from right to left.
 * @const
 */
Blockly.BlockSvg.NOTCH_PATH_RIGHT = 'l -6,-4 -3,0 -6,4';
/**
 * SVG path for drawing jagged teeth at the end of collapsed blocks.
 * @const
 */
Blockly.BlockSvg.JAGGED_TEETH = 'l 8,0 0,4 8,4 -16,8 8,4';
/**
 * Height of SVG path for jagged teeth at the end of collapsed blocks.
 * @const
 */
Blockly.BlockSvg.JAGGED_TEETH_HEIGHT = 20;
/**
 * Width of SVG path for jagged teeth at the end of collapsed blocks.
 * @const
 */
Blockly.BlockSvg.JAGGED_TEETH_WIDTH = 15;
/**
 * SVG path for drawing a horizontal puzzle tab from top to bottom.
 * @const
 */
Blockly.BlockSvg.TAB_PATH_DOWN = 'v 5 c 0,10 -' + Blockly.BlockSvg.TAB_WIDTH +
    ',-8 -' + Blockly.BlockSvg.TAB_WIDTH + ',7.5 s ' +
    Blockly.BlockSvg.TAB_WIDTH + ',-2.5 ' + Blockly.BlockSvg.TAB_WIDTH + ',7.5';
/**
 * SVG path for drawing a horizontal puzzle tab from top to bottom with
 * highlighting from the upper-right.
 * @const
 */
Blockly.BlockSvg.TAB_PATH_DOWN_HIGHLIGHT_RTL = 'v 6.5 m -' +
    (Blockly.BlockSvg.TAB_WIDTH * 0.97) + ',3 q -' +
    (Blockly.BlockSvg.TAB_WIDTH * 0.05) + ',10 ' +
    (Blockly.BlockSvg.TAB_WIDTH * 0.3) + ',9.5 m ' +
    (Blockly.BlockSvg.TAB_WIDTH * 0.67) + ',-1.9 v 1.4';

/**
 * SVG start point for drawing the top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER_START =
    'm 0,' + Blockly.BlockSvg.CORNER_RADIUS;
/**
 * SVG start point for drawing the top-left corner's highlight in RTL.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER_START_HIGHLIGHT_RTL =
    'm ' + Blockly.BlockSvg.DISTANCE_45_INSIDE + ',' +
    Blockly.BlockSvg.DISTANCE_45_INSIDE;
/**
 * SVG start point for drawing the top-left corner's highlight in LTR.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER_START_HIGHLIGHT_LTR =
    'm 0.5,' + (Blockly.BlockSvg.CORNER_RADIUS - 0.5);
/**
 * SVG path for drawing the rounded top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER =
    'A ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ',0';
/**
 * SVG path for drawing the highlight on the rounded top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER_HIGHLIGHT =
    'A ' + (Blockly.BlockSvg.CORNER_RADIUS - 0.5) + ',' +
    (Blockly.BlockSvg.CORNER_RADIUS - 0.5) + ' 0 0,1 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ',0.5';
/**
 * SVG path for drawing the top-left corner of a statement input.
 * Includes the top notch, a horizontal space, and the rounded inside corner.
 * @const
 */
Blockly.BlockSvg.INNER_TOP_LEFT_CORNER =
    Blockly.BlockSvg.NOTCH_PATH_RIGHT + ' h -' +
    (Blockly.BlockSvg.NOTCH_WIDTH - 15 - Blockly.BlockSvg.CORNER_RADIUS) +
    ' h -0.0 a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 -' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;
/**
 * SVG path for drawing the bottom-left corner of a statement input.
 * Includes the rounded inside corner.
 * @const
 */
Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;
/**
 * SVG path for drawing highlight on the top-left corner of a statement
 * input in RTL.
 * @const
 */
Blockly.BlockSvg.INNER_TOP_LEFT_CORNER_HIGHLIGHT_RTL =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 ' +
    (-Blockly.BlockSvg.DISTANCE_45_OUTSIDE - 0.5) + ',' +
    (Blockly.BlockSvg.CORNER_RADIUS -
        Blockly.BlockSvg.DISTANCE_45_OUTSIDE);
/**
 * SVG path for drawing highlight on the bottom-left corner of a statement
 * input in RTL.
 * @const
 */
Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER_HIGHLIGHT_RTL =
    'a ' + (Blockly.BlockSvg.CORNER_RADIUS + 0.5) + ',' +
    (Blockly.BlockSvg.CORNER_RADIUS + 0.5) + ' 0 0,0 ' +
    (Blockly.BlockSvg.CORNER_RADIUS + 0.5) + ',' +
    (Blockly.BlockSvg.CORNER_RADIUS + 0.5);
/**
 * SVG path for drawing highlight on the bottom-left corner of a statement
 * input in LTR.
 * @const
 */
Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER_HIGHLIGHT_LTR =
    'a ' + (Blockly.BlockSvg.CORNER_RADIUS + 0.5) + ',' +
    (Blockly.BlockSvg.CORNER_RADIUS + 0.5) + ' 0 0,0 ' +
    (Blockly.BlockSvg.CORNER_RADIUS -
        Blockly.BlockSvg.DISTANCE_45_OUTSIDE) + ',' +
    (Blockly.BlockSvg.DISTANCE_45_OUTSIDE + 0.5);

/**
 * Dispose of this block.
 * @param {boolean} healStack If true, then try to heal any gap by connecting
 *     the next statement with the previous statement.  Otherwise, dispose of
 *     all children of this block.
 * @param {boolean} animate If true, show a disposal animation and sound.
 * @param {boolean=} opt_dontRemoveFromWorkspace If true, don't remove this
 *     block from the workspace's list of top blocks.
 */
Blockly.BlockSvg.prototype.dispose = function(healStack, animate,
    opt_dontRemoveFromWorkspace) {
    Blockly.Field.startCache();
    // Terminate onchange event calls.
    if (this.onchangeWrapper_) {
        Blockly.unbindEvent_(this.onchangeWrapper_);
        this.onchangeWrapper_ = null;
    }
    // If this block is being dragged, unlink the mouse events.
    if (Blockly.selected == this) {
        Blockly.terminateDrag_();
    }
    // If this block has a context menu open, close it.
    if (Blockly.ContextMenu.currentBlock == this) {
        Blockly.ContextMenu.hide();
    }

    if (animate && this.rendered) {
        this.unplug(healStack, false);
        this.disposeUiEffect();
    }
    // Stop rerendering.
    this.rendered = false;

    var icons = this.getIcons();
    for (var i = 0; i < icons.length; i++) {
        icons[i].dispose();
    }

    Blockly.BlockSvg.superClass_.dispose.call(this, healStack);

    goog.dom.removeNode(this.svgGroup_);
    // Sever JavaScript to DOM connections.
    this.svgGroup_ = null;
    this.svgBlockPath_ = null;
    this.svgListRects = null;
    this.svgHolePath_ = null;
    this.svgHoleGroup = null;
    this.svgIndicatorGroup = null;
    this.indicators = {};
    //this.svgPathDark_ = null;
    Blockly.Field.stopCache();
};

/**
 * Play some UI effects (sound, animation) when disposing of a block.
 */
Blockly.BlockSvg.prototype.disposeUiEffect = function() {
    this.workspace.playAudio('delete');

    var xy = Blockly.getSvgXY_( /** @type {!Element} */ (this.svgGroup_),
        this.workspace);
    // Deeply clone the current block.
    var clone = this.svgGroup_.cloneNode(true);
    clone.translateX_ = xy.x;
    clone.translateY_ = xy.y;
    clone.setAttribute('transform',
        'translate(' + clone.translateX_ + ',' + clone.translateY_ + ')');
    this.workspace.options.svg.appendChild(clone);
    clone.bBox_ = clone.getBBox();
    // Start the animation.
    Blockly.BlockSvg.disposeUiStep_(clone, this.RTL, new Date(),
        this.workspace.scale);
};

/**
 * Animate a cloned block and eventually dispose of it.
 * This is a class method, not an instace method since the original block has
 * been destroyed and is no longer accessible.
 * @param {!Element} clone SVG element to animate and dispose of.
 * @param {boolean} rtl True if RTL, false if LTR.
 * @param {!Date} start Date of animation's start.
 * @param {number} workspaceScale Scale of workspace.
 * @private
 */
Blockly.BlockSvg.disposeUiStep_ = function(clone, rtl, start, workspaceScale) {
    var ms = (new Date()) - start;
    var percent = ms / 150;
    if (percent > 1) {
        goog.dom.removeNode(clone);
    } else {
        var x = clone.translateX_ +
            (rtl ? -1 : 1) * clone.bBox_.width * workspaceScale / 2 * percent;
        var y = clone.translateY_ + clone.bBox_.height * workspaceScale * percent;
        var scale = (1 - percent) * workspaceScale;
        clone.setAttribute('transform', 'translate(' + x + ',' + y + ')' +
            ' scale(' + scale + ')');
        var closure = function() {
            Blockly.BlockSvg.disposeUiStep_(clone, rtl, start, workspaceScale);
        };
        setTimeout(closure, 10);
    }
};

/**
 * Play some UI effects (sound, ripple) after a connection has been established.
 */
Blockly.BlockSvg.prototype.connectionUiEffect = function() {
    this.workspace.playAudio('click');
    if (this.workspace.scale < 1) {
        return; // Too small to care about visual effects.
    }
    // Determine the absolute coordinates of the inferior block.
    var xy = Blockly.getSvgXY_( /** @type {!Element} */ (this.svgGroup_),
        this.workspace);
    // Offset the coordinates based on the two connection types, fix scale.
    if (this.outputConnection) {
        xy.x += -3 * this.workspace.scale;
        xy.y += 13 * this.workspace.scale;
    } else if (this.previousConnection) {
        xy.x += 23 * this.workspace.scale;
        xy.y += 3 * this.workspace.scale;
    }
    var ripple = Blockly.createSvgElement('circle', {
            'cx': xy.x,
            'cy': xy.y,
            'r': 0,
            'fill': 'none',
            'stroke': '#888',
            'stroke-width': 10
        },
        this.workspace.options.svg);
    // Start the animation.
    Blockly.BlockSvg.connectionUiStep_(ripple, new Date(), this.workspace.scale);
};

/**
 * Expand a ripple around a connection.
 * @param {!Element} ripple Element to animate.
 * @param {!Date} start Date of animation's start.
 * @param {number} workspaceScale Scale of workspace.
 * @private
 */
Blockly.BlockSvg.connectionUiStep_ = function(ripple, start, workspaceScale) {
    var ms = (new Date()) - start;
    var percent = ms / 150;
    if (percent > 1) {
        goog.dom.removeNode(ripple);
    } else {
        ripple.setAttribute('r', percent * 25 * workspaceScale);
        ripple.style.opacity = 1 - percent;
        var closure = function() {
            Blockly.BlockSvg.connectionUiStep_(ripple, start, workspaceScale);
        };
        Blockly.BlockSvg.disconnectUiStop_.pid_ = setTimeout(closure, 10);
    }
};

/**
 * Play some UI effects (sound, animation) when disconnecting a block.
 */
Blockly.BlockSvg.prototype.disconnectUiEffect = function() {
    this.workspace.playAudio('disconnect');
    if (this.workspace.scale < 1) {
        return; // Too small to care about visual effects.
    }
    // Horizontal distance for bottom of block to wiggle.
    var DISPLACEMENT = 10;
    // Scale magnitude of skew to height of block.
    var height = this.getHeightWidth().height;
    var magnitude = -Math.atan(DISPLACEMENT / height) / Math.PI * 180;

    // Start the animation.
    Blockly.BlockSvg.disconnectUiStep_(this.svgGroup_, magnitude, new Date());
};

/**
 * Animate a brief wiggle of a disconnected block.
 * @param {!Element} group SVG element to animate.
 * @param {number} magnitude Maximum degrees skew (reversed for RTL).
 * @param {!Date} start Date of animation's start.
 * @private
 */
Blockly.BlockSvg.disconnectUiStep_ = function(group, magnitude, start) {
    var DURATION = 200; // Milliseconds.
    var WIGGLES = 3; // Half oscillations.

    var ms = (new Date()) - start;
    var percent = ms / DURATION;

    if (percent > 1) {
        group.skew_ = '';
    } else {
        var skew = Math.round(Math.sin(percent * Math.PI * WIGGLES) *
            (1 - percent) * magnitude);
        group.skew_ = 'skewX(' + skew + ')';
        var closure = function() {
            Blockly.BlockSvg.disconnectUiStep_(group, magnitude, start);
        };
        Blockly.BlockSvg.disconnectUiStop_.group = group;
        Blockly.BlockSvg.disconnectUiStop_.pid = setTimeout(closure, 10);
    }
    group.setAttribute('transform', group.translate_ + group.skew_);
};

/**
 * Stop the disconnect UI animation immediately.
 * @private
 */
Blockly.BlockSvg.disconnectUiStop_ = function() {
    if (Blockly.BlockSvg.disconnectUiStop_.group) {
        clearTimeout(Blockly.BlockSvg.disconnectUiStop_.pid);
        var group = Blockly.BlockSvg.disconnectUiStop_.group
        group.skew_ = '';
        group.setAttribute('transform', group.translate_);
        Blockly.BlockSvg.disconnectUiStop_.group = null;
    }
};

/**
 * PID of disconnect UI animation.  There can only be one at a time.
 * @type {number}
 */
Blockly.BlockSvg.disconnectUiStop_.pid = 0;

/**
 * SVG group of wobbling block.  There can only be one at a time.
 * @type {Element}
 */
Blockly.BlockSvg.disconnectUiStop_.group = null;

/**
 * Update the colour of a block and its expression children
 */
Blockly.BlockSvg.prototype.updateColourDown = function() {
    this.updateColour();
    for (var i = 0, child; child = this.childBlocks_[i]; i++) {
        if (child && child.outputConnection) {
            child.updateColourDown();
        }
    }
};

/**
 * Change the colour of a block.
 */
Blockly.BlockSvg.prototype.updateColour = function() {
    console.log("RENTEST - Entering updateColour on ", this.type);
    console.log("RENTEST - this.indicators ", this.indicators);
    if (this.disabled) {
        // Disabled blocks don't have colour.
        return;
    }
    //var hexColour = Blockly.makeColour(this.getColour());
    //var rgb = goog.color.hexToRgb(hexColour);

    console.log("UCOL: ", this.type, this.typeVecs);

    var fillText;
    if (this.outputConnection) {
        if (this.outputsAList()) {
            this.svgBlockPath_.setAttribute('fill', "white");
            var listTypes = this.getOutputTypesByKind().list;
            listTypes = Blockly.Python.mergeSubtypes(listTypes);
            console.log("MERGED for ", this.type, " is", listTypes);
            if (listTypes[0] == "any" || listTypes[0] == "matching") {
                fillText = 'url(#' + this.workspace.options.anyTypePatternLargeId + ')';
            } else if (listTypes.length == 1) {
                fillText = Blockly.Python.COLOUR[listTypes[0]];
            } else { // should be list of int/float
                listTypes.sort();
                var typeString = listTypes.join('');
                var fillUrl = this.workspace.options[typeString + 'TypePatternLargeId'];
                fillText = 'url(#' + fillUrl + ')';
            }
            for (var i = 0; i < 3; i++) {
                this.svgListRects[i].setAttribute('fill', fillText);
            }
        } else {
            var outputTypes = this.getOutputTypesByKind().basic;
            outputTypes = Blockly.Python.mergeSubtypes(outputTypes);

            console.log("MERGED for ", this.type, " is", outputTypes);
            if (outputTypes[0] == "any" || outputTypes[0] == "matching") {
                fillText = 'url(#' + this.workspace.options.anyTypePatternLargeId + ')';
            } else if (outputTypes.length == 1) { // should be list of int/float
                fillText = Blockly.Python.COLOUR[outputTypes[0]];
            } else {
                outputTypes.sort();
                var typeString = outputTypes.join('');
                var fillUrl = this.workspace.options[typeString + 'TypePatternLargeId'];
                console.log("FILLNUMTEXT1 " + typeString);
                fillText = 'url(#' + fillUrl + ')';
            }
            this.svgBlockPath_.setAttribute('fill', fillText);
        }
    } else {
        this.svgBlockPath_.setAttribute('fill',
            Blockly.Python.COLOUR['notype']);
        //goog.color.rgbArrayToHex(Blockly.Python.COLOUR['notype']));
    }

    //for (var i = 0, indicatorPair; indicatorPair = this.indicators[i]; i++) {
    for (var emptySlotNumber in this.indicators) {
        console.log("SLOTfill", emptySlotNumber);
        var indicatorPair = this.indicators[emptySlotNumber];
        if (indicatorPair.basic) {
            var basicTypes = this.getInputTypesByKind(emptySlotNumber).basic;
            basicTypes = Blockly.Python.mergeSubtypes(basicTypes);

            for (var type in indicatorPair.subtypeLabels) {
                if (basicTypes.length == 1 && basicTypes[0] == type) {
                    indicatorPair.subtypeLabels[type].setAttribute("display", "inline");
                } else {
                    indicatorPair.subtypeLabels[type].setAttribute("display", "none");
                }
            }

            if (basicTypes[0] == "any" || basicTypes[0] == "matching") {
                fillText = 'url(#' + this.workspace.options.anyTypePatternSmallId + ')';
            } else if (basicTypes.length == 1) {
                fillText = Blockly.Python.COLOUR[basicTypes[0]];
            } else {
                basicTypes.sort();
                var typeString = basicTypes.join('');
                var fillUrl = this.workspace.options[typeString + 'TypePatternSmallId'];
                fillText = 'url(#' + fillUrl + ')';
            }
            indicatorPair.basic.setAttribute('fill', fillText);
        }
        if (indicatorPair.list) {
            var pListTypes = this.getInputTypesByKind(emptySlotNumber).list;
            pListTypes = Blockly.Python.mergeSubtypes(pListTypes);
            if (pListTypes[0] == "any" || pListTypes[0] == "matching") {
                fillText = 'url(#' + this.workspace.options.anyTypePatternSmallId + ')';
            } else if (pListTypes.length == 3) {
                fillText = 'url(#' + this.workspace.options.floatintstrTypePatternSmallId + ')';
            } else if (pListTypes.length == 2) {
                fillText = 'url(#' + this.workspace.options.floatintTypePatternSmallId + ')';
            } else {
                // should be just one type
                fillText = Blockly.Python.COLOUR[pListTypes[0]];
            }
            // ========================
            // for (var j=1; j<4; j++) {
            var rect = indicatorPair.list[0];
            rect.setAttribute('fill', fillText);
            //}
        }
    }


    //console.log(rgb);
    //if (this.isShadow()) {
    //    rgb = goog.color.lighten(rgb, 0.6);
    //    hexColour = goog.color.rgbArrayToHex(rgb);
    //    this.svgHolePath_.style.display = 'none';
    //this.svgPathDark_.setAttribute('fill', hexColour);
    //  } else {
    //this.svgHolePath_.style.display = '';
    //var hexLight = goog.color.rgbArrayToHex(goog.color.lighten(rgb, 0.3));
    //var hexDark = goog.color.rgbArrayToHex(goog.color.darken(rgb, 0.2));
    //this.svgHolePath_.setAttribute('stroke', hexLight);
    //this.svgHolePath_.setAttribute('stroke', hexColour);
    //this.svgHolePath_.setAttribute('fill', hexLight);
    //this.svgPathDark_.setAttribute('fill', hexDark);

    var icons = this.getIcons();
    for (var i = 0; i < icons.length; i++) {
        icons[i].updateColour();
    }

    // Bump every dropdown to change its colour.
    for (var x = 0, input; input = this.inputList[x]; x++) {
        for (var y = 0, field; field = input.fieldRow[y]; y++) {
            field.setText(null);
        }
    }
};

/**
 * Enable or disable a block.
 */
Blockly.BlockSvg.prototype.updateDisabled = function() {
    var hasClass = Blockly.hasClass_( /** @type {!Element} */ (this.svgGroup_),
        'blocklyDisabled');
    if (this.disabled || this.getInheritedDisabled()) {
        if (!hasClass) {
            Blockly.addClass_( /** @type {!Element} */ (this.svgGroup_),
                'blocklyDisabled');
            this.svgBlockPath_.setAttribute('fill',
                'url(#' + this.workspace.options.disabledPatternId + ')');
        }
    } else {
        if (hasClass) {
            Blockly.removeClass_( /** @type {!Element} */ (this.svgGroup_),
                'blocklyDisabled');
            this.updateColour();
        }
    }
    var children = this.getChildren();
    for (var i = 0, child; child = children[i]; i++) {
        child.updateDisabled();
    }
};

/**
 * Returns the comment on this block (or '' if none).
 * @return {string} Block's comment.
 */
Blockly.BlockSvg.prototype.getCommentText = function() {
    if (this.comment) {
        var comment = this.comment.getText();
        // Trim off trailing whitespace.
        return comment.replace(/\s+$/, '').replace(/ +\n/g, '\n');
    }
    return '';
};

/**
 * Set this block's comment text.
 * @param {?string} text The text, or null to delete.
 */
Blockly.BlockSvg.prototype.setCommentText = function(text) {
    var changedState = false;
    if (goog.isString(text)) {
        if (!this.comment) {
            this.comment = new Blockly.Comment(this);
            changedState = true;
        }
        this.comment.setText( /** @type {string} */ (text));
    } else {
        if (this.comment) {
            this.comment.dispose();
            changedState = true;
        }
    }
    if (changedState && this.rendered) {
        this.render();
        // Adding or removing a comment icon will cause the block to change shape.
        this.bumpNeighbours_();
    }
};

/**
 * Set this block's warning text.
 * @param {?string} text The text, or null to delete.
 * @param {string=} opt_id An optional ID for the warning text to be able to
 *     maintain multiple warnings.
 */
Blockly.BlockSvg.prototype.setWarningText = function(text, opt_id) {
    if (!this.setWarningText.pid_) {
        // Create a database of warning PIDs.
        // Only runs once per block (and only those with warnings).
        this.setWarningText.pid_ = Object.create(null);
    }
    var id = opt_id || '';
    if (!id) {
        // Kill all previous pending processes, this edit supercedes them all.
        for (var n in this.setWarningText.pid_) {
            clearTimeout(this.setWarningText.pid_[n]);
            delete this.setWarningText.pid_[n];
        }
    } else if (this.setWarningText.pid_[id]) {
        // Only queue up the latest change.  Kill any earlier pending process.
        clearTimeout(this.setWarningText.pid_[id]);
        delete this.setWarningText.pid_[id];
    }
    if (Blockly.dragMode_ == 2) {
        // Don't change the warning text during a drag.
        // Wait until the drag finishes.
        var thisBlock = this;
        this.setWarningText.pid_[id] = setTimeout(function() {
            if (thisBlock.workspace) { // Check block wasn't deleted.
                delete thisBlock.setWarningText.pid_[id];
                thisBlock.setWarningText(text, id);
            }
        }, 100);
        return;
    }
    if (this.isInFlyout) {
        text = null;
    }

    // Bubble up to add a warning on top-most collapsed block.
    var parent = this.getSurroundParent();
    var collapsedParent = null;
    while (parent) {
        if (parent.isCollapsed()) {
            collapsedParent = parent;
        }
        parent = parent.getSurroundParent();
    }
    if (collapsedParent) {
        collapsedParent.setWarningText(text, 'collapsed ' + this.id + ' ' + id);
    }

    var changedState = false;
    if (goog.isString(text)) {
        if (!this.warning) {
            this.warning = new Blockly.Warning(this);
            changedState = true;
        }
        this.warning.setText( /** @type {string} */ (text), id);
    } else {
        // Dispose all warnings if no id is given.
        if (this.warning && !id) {
            this.warning.dispose();
            changedState = true;
        } else if (this.warning) {
            var oldText = this.warning.getText();
            this.warning.setText('', id);
            var newText = this.warning.getText();
            if (!newText) {
                this.warning.dispose();
            }
            changedState = oldText == newText;
        }
    }
    if (changedState && this.rendered) {
        this.render();
        // Adding or removing a warning icon will cause the block to change shape.
        this.bumpNeighbours_();
    }
};

/**
 * Give this block a mutator dialog.
 * @param {Blockly.Mutator} mutator A mutator dialog instance or null to remove.
 */
Blockly.BlockSvg.prototype.setMutator = function(mutator) {
    if (this.mutator && this.mutator !== mutator) {
        this.mutator.dispose();
    }
    if (mutator) {
        mutator.block_ = this;
        this.mutator = mutator;
        if (this.rendered) {
            mutator.createIcon();
        }
    }
};

/**
 * Set whether the block is disabled or not.
 * @param {boolean} disabled True if disabled.
 */
Blockly.BlockSvg.prototype.setDisabled = function(disabled) {
    if (this.disabled == disabled) {
        return;
    }
    Blockly.BlockSvg.superClass_.setDisabled.call(this, disabled);
    if (this.rendered) {
        this.updateDisabled();
    }
    this.workspace.fireChangeEvent();
};

/**
 * Select this block.  Highlight it visually.
 */
Blockly.BlockSvg.prototype.addSelect = function() {
    Blockly.addClass_( /** @type {!Element} */ (this.svgGroup_),
        'blocklySelected');
    // Move the selected block to the top of the stack.
    this.svgGroup_.parentNode.appendChild(this.svgGroup_);
};

/**
 * Unselect this block.  Remove its highlighting.
 */
Blockly.BlockSvg.prototype.removeSelect = function() {
    Blockly.removeClass_( /** @type {!Element} */ (this.svgGroup_),
        'blocklySelected');
};

/**
 * Adds the dragging class to this block.
 * Also disables the highlights/shadows to improve performance.
 */
Blockly.BlockSvg.prototype.addDragging = function() {
    Blockly.addClass_( /** @type {!Element} */ (this.svgGroup_),
        'blocklyDragging');
};

/**
 * Removes the dragging class from this block.
 */
Blockly.BlockSvg.prototype.removeDragging = function() {
    Blockly.removeClass_( /** @type {!Element} */ (this.svgGroup_),
        'blocklyDragging');
};

Blockly.BlockSvg.prototype.render = function(opt_bubble) {
    this.renderNoColour(opt_bubble);
    this.updateColour();
};

/**
 * Render the block.
 * Lays out and reflows a block based on its contents and settings.
 * @param {boolean=} opt_bubble If false, just render this block.
 *   If true, also render block's parent, grandparent, etc.  Defaults to true.
 */
Blockly.BlockSvg.prototype.renderNoColour = function(opt_bubble) {
    console.log("RENTEST - Entering renderNoColour on ", this.type);
    Blockly.Field.startCache();
    this.rendered = true;

    var cursorX = Blockly.BlockSvg.SEP_SPACE_X;
    // Move the icons into position.
    var icons = this.getIcons();
    for (var i = 0; i < icons.length; i++) {
        cursorX = icons[i].renderIcon(cursorX);
    }
    cursorX -= Blockly.BlockSvg.SEP_SPACE_X;
    // If there are no icons, cursorX will be 0, otherwise it will be the
    // width that the first label needs to move over by.

    // MJP HACK TO GET COLOURS RIGHT
    //this.reType();

    var inputRows = this.renderCompute_(cursorX);
    this.renderDraw_(cursorX, inputRows);

    // MJP HACK TO GET COLOURS RIGHT
    //this.updateColour();

    if (opt_bubble !== false) {

        // Render all blocks above this one (propagate a reflow).
        var parentBlock = this.getParent();
        if (parentBlock) {
            //parentBlock.renderNoColour(true);
            parentBlock.render();
        } else {
            // Top-most block.  Fire an event to allow scrollbars to resize.
            Blockly.fireUiEvent(window, 'resize');
        }
    }
    Blockly.Field.stopCache();
    Blockly.Realtime.blockChanged(this);
};

/**
 * Render a list of fields starting at the specified location.
 * @param {!Array.<!Blockly.Field>} fieldList List of fields.
 * @param {number} cursorX X-coordinate to start the fields.
 * @param {number} cursorY Y-coordinate to start the fields.
 * @return {number} X-coordinate of the end of the field row (plus a gap).
 * @private
 */
Blockly.BlockSvg.prototype.renderFields_ =
    function(fieldList, cursorX, cursorY) {
        cursorY += Blockly.BlockSvg.TEXT_PADDING_TOP;
        if (!this.outputConnection) {
            cursorY += Blockly.BlockSvg.STMT_ARGS_PADDING_TOP;
        }
        for (var t = 0, field; field = fieldList[t]; t++) {
            var root = field.getSvgRoot();
            if (!root) {
                continue;
            }
            root.setAttribute('transform',
                'translate(' + (cursorX + field.renderSep) + ',' + cursorY + ')');
            if (field.renderWidth) {
                cursorX += field.renderSep + field.renderWidth +
                    Blockly.BlockSvg.SEP_SPACE_X;
            }
        }
        return cursorX;
    };

/**
 * Computes the height and widths for each row and field.
 * @param {number} iconWidth Offset of first row due to icons.
 * @return {!Array.<!Array.<!Object>>} 2D array of objects, each containing
 *     position information.
 * @private
 */
Blockly.BlockSvg.prototype.renderCompute_ = function(iconWidth) {
    var inputList = this.inputList;
    var inputRows = [];
    inputRows.rightEdge = iconWidth + Blockly.BlockSvg.SEP_SPACE_X * 2;
    if (this.previousConnection || this.nextConnection) {
        inputRows.rightEdge = Math.max(inputRows.rightEdge,
            Blockly.BlockSvg.NOTCH_WIDTH + Blockly.BlockSvg.SEP_SPACE_X);
    }
    var fieldValueWidth = 0; // Width of longest external value field.
    var fieldStatementWidth = 0; // Width of longest statement field.
    var hasValue = false;
    var hasStatement = false;
    var hasDummy = false;
    var lastType = undefined;
    var isInline = this.getInputsInline() && !this.isCollapsed();
    var slotNumber = -1;
    for (var i = 0, input; input = inputList[i]; i++) {
        if (!input.isVisible()) {
            continue;
        }
        var row;
        if (!isInline || !lastType ||
            lastType == Blockly.NEXT_STATEMENT ||
            input.type == Blockly.NEXT_STATEMENT) {
            // Create new row.
            lastType = input.type;
            row = [];
            if (isInline && input.type != Blockly.NEXT_STATEMENT) {
                row.type = Blockly.BlockSvg.INLINE;
            } else {
                row.type = input.type;
            }
            row.height = 0;
            inputRows.push(row);
        } else {
            row = inputRows[inputRows.length - 1];
        }
        row.push(input);

        // HACK check
        /*if (!this.outputConnection) {
          console.log("1 row thickness",inputRows[0].height );
        }
        else {
            console.log("2 expression row thickness",inputRows[0].height );
        }*/
        // Compute minimum input size.
        input.renderHeight = Blockly.BlockSvg.MIN_BLOCK_Y;
        // The width is currently only needed for inline value inputs.
        if (isInline && input.type == Blockly.INPUT_VALUE) {
            slotNumber++;
            console.log("SLOT ", slotNumber, " connection ", input.connection.inputNumber_);
            var kinds = this.getInputKinds(slotNumber);
            if (kinds.basic && kinds.list) {
                input.renderWidth = Blockly.BlockSvg.DOUBLE_SLOT_WIDTH;
            } else {
                input.renderWidth = //Blockly.BlockSvg.TAB_WIDTH +
                    //Blockly.BlockSvg.SEP_SPACE_X * 1.25;
                    Blockly.BlockSvg.SLOT_WIDTH; // MJP
            }
        } else {
            input.renderWidth = 0;
        }
        // Adjust input size if there is a connection.
        if (input.connection && input.connection.targetConnection) {
            var linkedBlock = input.connection.targetBlock();
            var bBox = linkedBlock.getHeightWidth();
            input.renderHeight = Math.max(input.renderHeight, bBox.height);
            input.renderWidth = bBox.width;
        }
        // Blocks have a one pixel shadow that should sometimes overhang.
        /*if (!isInline && i == inputList.length - 1) {
      // Last value input should overhang.
      input.renderHeight--;
    } else if (!isInline && input.type == Blockly.INPUT_VALUE &&
        inputList[i + 1] && inputList[i + 1].type == Blockly.NEXT_STATEMENT) {
      // Value input above statement input should overhang.
      input.renderHeight--;
  }*/
        //console.log(row.height, input.renderHeight);
        row.height = Math.max(row.height, input.renderHeight);
        //console.log(row.height);
        input.fieldWidth = 0;
        if (inputRows.length == 1) {
            // The first row gets shifted to accommodate any icons.
            input.fieldWidth += iconWidth;
        }
        var previousFieldEditable = false;
        for (var j = 0, field; field = input.fieldRow[j]; j++) {
            if (j != 0) {
                input.fieldWidth += Blockly.BlockSvg.SEP_SPACE_X;
            }
            // Get the dimensions of the field.
            var fieldSize = field.getSize();
            field.renderWidth = fieldSize.width;
            field.renderSep = (previousFieldEditable && field.EDITABLE) ?
                Blockly.BlockSvg.SEP_SPACE_X : 0;
            input.fieldWidth += field.renderWidth + field.renderSep;
            row.height = Math.max(row.height, fieldSize.height);
            previousFieldEditable = field.EDITABLE;
        }

        if (row.type != Blockly.BlockSvg.INLINE) {
            if (row.type == Blockly.NEXT_STATEMENT) {
                hasStatement = true;
                fieldStatementWidth = Math.max(fieldStatementWidth, input.fieldWidth);
            } else {
                if (row.type == Blockly.INPUT_VALUE) {
                    hasValue = true;
                } else if (row.type == Blockly.DUMMY_INPUT) {
                    hasDummy = true;
                }
                fieldValueWidth = Math.max(fieldValueWidth, input.fieldWidth);
            }
        }
    }

    // Make inline rows a bit thicker in order to enclose the values.
    for (var y = 0, row; row = inputRows[y]; y++) {
        row.thicker = false;
        if (row.type == Blockly.BlockSvg.INLINE) {
            for (var z = 0, input; input = row[z]; z++) {
                if (input.type == Blockly.INPUT_VALUE) {
                    row.height += //Blockly.BlockSvg.INLINE_PADDING_TOP +
                        Blockly.BlockSvg.INLINE_PADDING_BOTTOM;
                    // console.log("thicker");
                    row.thicker = true;
                    break;
                }
            }
        }

    }

    // HACK to adjust height of rows in statement blocks
    // Another HACK to cater for start block row height
    if (!this.outputConnection) {

        if (this.type == "python_start") {
            for (var i = 0, row; row = inputRows[i]; i++) {
                if (i == 0) {
                    inputRows[i].height = 45;
                } else {
                    inputRows[i].height = 35;
                }
            }
        }
        for (var i = 0, row; row = inputRows[i]; i++) {


            if (i % 2 == 0 || this.type == "python_comment") {
                // row with inputs
                if (inputRows[i].height < Blockly.BlockSvg.MIN_STMT_BLOCK_Y) {
                    inputRows[i].height = Blockly.BlockSvg.MIN_STMT_BLOCK_Y;
                }
            } else {
                // row with nested statements
                if (inputRows[i].height > Blockly.BlockSvg.MIN_STMT_BLOCK_Y) {
                    inputRows[i].height -= 4;
                }
            }
        }
    } else {
        //var shortfall = (inputRows[0].height - Blockly.BlockSvg.MIN_STMT_BLOCK_Y) %
        //                  Blockly.BlockSvg.INLINE_PADDING_BOTTOM;
        //console.log("shortfall0 =", shortfall)
        //inputRows[0].height += Blockly.BlockSvg.INLINE_PADDING_BOTTOM - shortfall;
    }
    //else {
    //  console.log("2 expression row thickness",inputRows[0].height );
    //}

    // Compute the statement edge.
    // This is the width of a block where statements are nested.
    inputRows.statementEdge = 2 * Blockly.BlockSvg.SEP_SPACE_X + 50 + // HACK
        fieldStatementWidth;
    // Compute the preferred right edge.  Inline blocks may extend beyond.
    // This is the width of the block where external inputs connect.
    if (hasStatement) {
        inputRows.rightEdge = Math.max(inputRows.rightEdge,
            inputRows.statementEdge + Blockly.BlockSvg.NOTCH_WIDTH);
    }
    if (hasValue) {
        inputRows.rightEdge = Math.max(inputRows.rightEdge, fieldValueWidth +
            Blockly.BlockSvg.SEP_SPACE_X * 2); // + Blockly.BlockSvg.TAB_WIDTH);
    } else if (hasDummy) {
        inputRows.rightEdge = Math.max(inputRows.rightEdge, fieldValueWidth +
            Blockly.BlockSvg.SEP_SPACE_X * 2);
    }

    inputRows.hasValue = hasValue;
    inputRows.hasStatement = hasStatement;
    inputRows.hasDummy = hasDummy;
    return inputRows;
};


/**
 * Draw the path of the block.
 * Move the fields to the correct locations.
 * @param {number} iconWidth Offset of first row due to icons.
 * @param {!Array.<!Array.<!Object>>} inputRows 2D array of objects, each
 *     containing position information.
 * @private
 */
Blockly.BlockSvg.prototype.renderDraw_ = function(iconWidth, inputRows) {
    this.startHat_ = false;
    // Should the top and bottom left corners be rounded or square?
    if (this.outputConnection) {
        this.squareTopLeftCorner_ = true;
        this.squareBottomLeftCorner_ = true;
    } else {
        this.squareTopLeftCorner_ = false;
        this.squareBottomLeftCorner_ = false;
        // If this block is in the middle of a stack, square the corners.
        if (this.previousConnection) {
            var prevBlock = this.previousConnection.targetBlock();
            if (prevBlock && prevBlock.getNextBlock() == this) {
                this.squareTopLeftCorner_ = true;
            }
        } else if (Blockly.BlockSvg.START_HAT) {
            // No output or previous connection.
            this.squareTopLeftCorner_ = true;
            this.startHat_ = true;
            inputRows.rightEdge = Math.max(inputRows.rightEdge, 100);
        }
        var nextBlock = this.getNextBlock();
        if (nextBlock) {
            this.squareBottomLeftCorner_ = true;
        }
    }

    // Fetch the block's coordinates on the surface for use in anchoring
    // the connections.
    var connectionsXY = this.getRelativeToSurfaceXY();

    // Assemble the block's path.
    var steps = [];
    //var inlineSteps = [];
    // The highlighting applies to edges facing the upper-left corner.
    // Since highlighting is a two-pixel wide border, it would normally overhang
    // the edge of the block by a pixel. So undersize all measurements by a pixel.
    var holeSteps = [];
    this.indicators = {};


    // DUMMY VAR - DELETE
    var indicatorSteps = null;

    this.renderDrawTop_(steps, holeSteps, connectionsXY,
        inputRows.rightEdge);
    var cursorY = this.renderDrawRight_(steps, holeSteps,
        indicatorSteps, connectionsXY, inputRows, iconWidth);
    this.renderDrawBottom_(steps, holeSteps, connectionsXY, cursorY);
    this.renderDrawLeft_(steps, holeSteps, connectionsXY, cursorY);

    var pathString = steps.join(' '); // + '\n' + inlineSteps.join(' ');
    this.svgBlockPath_.setAttribute('d', pathString);
    this.svgPathDark_.setAttribute('d', pathString);
    pathString = holeSteps.join(' ');
    this.svgHolePath_.setAttribute('d', pathString);

    /* MJP - Could just remove group from DOM? */
    while (this.svgIndicatorGroup.lastChild) {
        this.svgIndicatorGroup.removeChild(this.svgIndicatorGroup.lastChild);
    }
    //for (var i=0, indicator; indicator=this.indicators[i]; i++) {
    for (var emptySlotNumber in this.indicators) {
        console.log("SLOT adding slot", emptySlotNumber, "to group");
        var indicatorPair = this.indicators[emptySlotNumber];
        if (indicatorPair.basic) {
            console.log("Basic indicator " + emptySlotNumber);
            this.svgIndicatorGroup.appendChild(indicatorPair.basic);
        }
        if (indicatorPair.list) {
            for (var j = 0, stripe; stripe = indicatorPair.list[j]; j++) {
                console.log("List indicator stripe" + j);
                this.svgIndicatorGroup.appendChild(stripe);
            }
        }
        if (indicatorPair.varInd) {
            for (var j = 0, ind; ind = indicatorPair.varInd[j]; j++) {
                console.log("List indicator stripe" + j);
                this.svgIndicatorGroup.appendChild(ind);
            }
        }
        if (indicatorPair.subtypeLabels) {
            for (var type in indicatorPair.subtypeLabels) {
                console.log("SUBTYPE adding to group" + indicatorPair.subtypeLabels[type]);
                this.svgIndicatorGroup.appendChild(indicatorPair.subtypeLabels[type]);
            }
        }
    }
    // =================
    if (this.outputConnection && this.outputsAList()) {
        var tempListRectWidth = 0.28 * (this.width - 1);
        var tempListGapWidth = (this.width - 1 - tempListRectWidth * 3) / 2;
        for (var i = 0; i < 3; i++) {
            this.svgListRects[i].setAttribute('x', (0.5 + i * (tempListRectWidth + tempListGapWidth)).toString());
            this.svgListRects[i].setAttribute('y', 0.5);
            this.svgListRects[i].setAttribute('width', tempListRectWidth);
            this.svgListRects[i].setAttribute('height', this.height - 1);
            // this.svgListRects[i].setAttribute('transform', 'translate('+
            //    (0.5 + i * (tempListRectWidth + tempListGapWidth)).toString() + ',0)');
        }
    }
};

/**
 * Render the top edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Array.<string>} holeSteps Path of block highlights.
 * @param {!Object} connectionsXY Location of block.
 * @param {number} rightEdge Minimum width of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawTop_ =
    function(steps, holeSteps, connectionsXY, rightEdge) {
        // Position the cursor at the top-left starting point.
        if (this.squareTopLeftCorner_) {
            steps.push('m 0,0');
            //holeSteps.push('m 0.5,0.5');
            if (this.startHat_) {
                steps.push(Blockly.BlockSvg.START_HAT_PATH);
                //holeSteps.push(Blockly.BlockSvg.START_HAT_HIGHLIGHT_LTR);
            }
        } else {
            steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER_START);
            //holeSteps.push(Blockly.BlockSvg.TOP_LEFT_CORNER_START_HIGHLIGHT_LTR);
            // Top-left rounded corner.
            steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER);
            //holeSteps.push(Blockly.BlockSvg.TOP_LEFT_CORNER_HIGHLIGHT);
        }

        // Top edge.
        if (this.previousConnection) {
            steps.push('H', Blockly.BlockSvg.NOTCH_WIDTH - 15);
            //holeSteps.push('H', Blockly.BlockSvg.NOTCH_WIDTH - 15);
            steps.push(Blockly.BlockSvg.NOTCH_PATH_LEFT);
            //holeSteps.push(Blockly.BlockSvg.NOTCH_PATH_LEFT_HIGHLIGHT);
            // Create previous block connection.
            var connectionX = connectionsXY.x + (Blockly.BlockSvg.NOTCH_WIDTH);
            var connectionY = connectionsXY.y;
            this.previousConnection.moveTo(connectionX, connectionY);
            // This connection will be tightened when the parent renders.
        }
        steps.push('H', rightEdge);
        //holeSteps.push('H', rightEdge - 0.5);
        this.width = rightEdge;
    };

Blockly.BlockSvg.addIndicatorLabel = function(x, y, label) {
    var text = Blockly.createSvgElement('text', {});
    text.setAttribute('class', 'blocklyIndicatorText');
    text.setAttribute('x', x + Blockly.BlockSvg.INDICATOR_WIDTH / 2);
    text.setAttribute('y', y + Blockly.BlockSvg.INDICATOR_HEIGHT - 3);
    text.appendChild(document.createTextNode(label));
    return text;
};

/**
 * Render the right edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Array.<string>} holeSteps Path of block highlights.
 * @param {!Array.<string>} indicatorSteps Inline block highlights.
 * @param {!Object} connectionsXY Location of block.
 * @param {!Array.<!Array.<!Object>>} inputRows 2D array of objects, each
 *     containing position information.
 * @param {number} iconWidth Offset of first row due to icons.
 * @return {number} Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawRight_ = function(steps, holeSteps,
    indicatorSteps, connectionsXY, inputRows, iconWidth) {

    var cursorX;
    var cursorY = 0;

    if (!this.outputConnection) {
        console.log("statement cursor first", cursorY);
    }
    var connectionX, connectionY;
    var slotNumber = -1;
    for (var y = 0, row; row = inputRows[y]; y++) {
        cursorX = Blockly.BlockSvg.SEP_SPACE_X;
        if (y == 0) {
            cursorX += iconWidth;
        }
        //holeSteps.push('M', (inputRows.rightEdge - 0.5) + ',' +
        //    (cursorY + 0.5));
        if (this.isCollapsed()) {
            // Jagged right edge.
            var input = row[0];
            var fieldX = cursorX;
            var fieldY = cursorY;
            this.renderFields_(input.fieldRow, fieldX, fieldY);
            steps.push(Blockly.BlockSvg.JAGGED_TEETH);
            //holeSteps.push('h 8');
            var remainder = row.height - Blockly.BlockSvg.JAGGED_TEETH_HEIGHT;
            steps.push('v', remainder);
            this.width += Blockly.BlockSvg.JAGGED_TEETH_WIDTH;
        } else if (row.type == Blockly.BlockSvg.INLINE) {
            //  if (row.height < Blockly.BlockSvg.MIN_STMT_BLOCK_Y) {
            //     row.height = Blockly.BlockSvg.MIN_STMT_BLOCK_Y;
            //  }
            // Inline inputs.
            for (var x = 0, input; input = row[x]; x++) {
                var fieldX = cursorX;
                var fieldY = cursorY;
                //if (row.thicker) {
                // Lower the field slightly.
                //fieldY += Blockly.BlockSvg.INLINE_PADDING_TOP;
                //}
                // TODO: Align inline field rows (left/right/centre).
                cursorX = this.renderFields_(input.fieldRow, fieldX, fieldY);
                if (input.type != Blockly.DUMMY_INPUT) {
                    cursorX += input.renderWidth + Blockly.BlockSvg.SEP_SPACE_X;
                }
                if (input.type == Blockly.INPUT_VALUE) {
                    slotNumber++;
                    //   inlineSteps.push('M', (cursorX - Blockly.BlockSvg.SEP_SPACE_X) +
                    //                    ',' + (cursorY + Blockly.BlockSvg.INLINE_PADDING_TOP));
                    //   inlineSteps.push('h', /*Blockly.BlockSvg.TAB_WIDTH*/ - 0 -
                    //                    input.renderWidth);
                    //  // inlineSteps.push(Blockly.BlockSvg.TAB_PATH_DOWN);
                    //   inlineSteps.push('v', input.renderHeight + 1); // -
                    //                         //Blockly.BlockSvg.TAB_HEIGHT);
                    //   inlineSteps.push('h', input.renderWidth + 0);// -
                    //                  //  Blockly.BlockSvg.TAB_WIDTH);
                    //   inlineSteps.push('z');


                    // Highlight right edge, bottom.
                    holeSteps.push('M',
                        (cursorX - Blockly.BlockSvg.SEP_SPACE_X) + ',' +
                        (cursorY /*Blockly.BlockSvg.INLINE_PADDING_TOP + */ ));

                    if (!this.outputConnection) {
                        holeSteps.push('m', 0, Blockly.BlockSvg.STMT_ARGS_PADDING_TOP);
                    }

                    holeSteps.push('v', input.renderHeight); //  + 1);
                    holeSteps.push('h', /*Blockly.BlockSvg.TAB_WIDTH*/ -0 -
                        input.renderWidth);

                    // HACK
                    holeSteps.push('v', -input.renderHeight); // - 1);
                    holeSteps.push('z');
                    // ENDHACK


                    if (!input.connection.targetConnection) {
                        console.log("XYZVAR ", this.type, this.typeVecs);
                        var params = this.getInputKinds(slotNumber);
                        console.log("XYZVAR ", params);

                        var indicatorX = cursorX;
                        if (params.basic && params.list) {
                            indicatorX -= Blockly.BlockSvg.INDICATOR_WIDTH +
                                (input.renderWidth + Blockly.BlockSvg.INDICATOR_GAP_X) / 2;
                        } else {
                            indicatorX -=
                                (input.renderWidth + Blockly.BlockSvg.INDICATOR_WIDTH) / 2;
                        }
                        var indicatorY = cursorY + input.renderHeight -
                            Blockly.BlockSvg.INDICATOR_HEIGHT -
                            Blockly.BlockSvg.INDICATOR_GAP_Y;
                        if (!this.outputConnection) {
                            indicatorY += Blockly.BlockSvg.STMT_ARGS_PADDING_TOP;
                        }

                        var indicatorPair = {
                            'basic': null,
                            'list': null,
                            'varInd': [],
                            'subtypeLabels': {},
                        };
                        // Draw basic type indicator

                        var createBasicIndicator = function(x, y) {
                            var indicator = Blockly.createSvgElement('rect', {});
                            indicator.setAttribute('transform',
                                'translate(' + indicatorX + ',' + indicatorY + ')');
                            indicator.setAttribute('x', 0);
                            indicator.setAttribute('y', 0);
                            indicator.setAttribute('width',
                                Blockly.BlockSvg.INDICATOR_WIDTH);
                            indicator.setAttribute('height',
                                Blockly.BlockSvg.INDICATOR_HEIGHT);
                            return indicator;
                        };

                        if (params.basic) {
                            console.log("XYZVAR basic");
                            var indicator = createBasicIndicator(indicatorX, indicatorY);
                            indicatorPair.basic = indicator;

                            if (slotNumber === 0 && this.lhsVarOnly) {
                                var varInd = Blockly.BlockSvg.addIndicatorLabel(indicatorX, indicatorY, "var");
                                indicatorPair.varInd.push(varInd);
                            }
                            var types = this.getInputTypes(slotNumber);
                            console.log("SUBTYPE checking " + JSON.stringify(types));
                            for (var subtype in Blockly.Python.CENTRED_SUBTYPE_SYMBOLS) {
                                if (goog.array.contains(types, subtype)) {
                                    console.log("SUBTYPE found", subtype);
                                    var subtypeLabel =
                                        Blockly.BlockSvg.addIndicatorLabel(indicatorX, indicatorY,
                                            Blockly.Python.CENTRED_SUBTYPE_SYMBOLS[subtype]);
                                    console.log("SUBTYPE symbol added", Blockly.Python.CENTRED_SUBTYPE_SYMBOLS[subtype]);

                                    subtypeLabel.setAttribute("display", "none");
                                    indicatorPair.subtypeLabels[subtype] = subtypeLabel;
                                }
                            }

                            indicatorX += Blockly.BlockSvg.INDICATOR_WIDTH +
                                Blockly.BlockSvg.INDICATOR_GAP_X;
                        }

                        // draw list type indicator
                        if (params.list) {
                            var background = createBasicIndicator(indicatorX, indicatorY);
                            //background.setAttribute('fill', 'white');
                            indicatorPair.list = [background];
                            //var group = Blockly.createSvgElement('g',{});
                            var tempListRectWidth = 0.30 *
                                (Blockly.BlockSvg.INDICATOR_WIDTH);
                            var tempListGapWidth = (Blockly.BlockSvg.INDICATOR_WIDTH -
                                tempListRectWidth * 3) / 2;
                            for (var i = 0; i < 2; i++) {
                                var stripe = Blockly.createSvgElement('rect', {},
                                    this.svgGroup_);
                                //this.indicatorGroup);
                                //stripe.setAttribute('x', i * (tempListRectWidth + tempListGapWidth));
                                stripe.setAttribute('x', (indicatorX + tempListRectWidth + i *
                                    (tempListRectWidth + tempListGapWidth)));
                                stripe.setAttribute('y', indicatorY);
                                stripe.setAttribute('width', tempListGapWidth);
                                stripe.setAttribute('height', Blockly.BlockSvg.INDICATOR_HEIGHT);
                                stripe.setAttribute("fill", "white");
                                // stripe.setAttribute('transform', 'translate('+
                                //     (indicatorX + i * (tempListRectWidth + tempListGapWidth))
                                //        + ', '  + indicatorY + ')');
                                //stripe.setAttribute('transform', 'translate('+
                                //    (0.5 + indicatorX) + ', '  + indicatorY + ')');
                                indicatorPair.list.push(stripe);
                            }
                            if (slotNumber === 0 && this.lhsVarOnly) {
                                var varInd = Blockly.BlockSvg.addIndicatorLabel(indicatorX, indicatorY, "var");
                                indicatorPair.varInd.push(varInd);
                            }
                            //indicatorPair.list = ;
                        }
                        //this.indicators.push(indicatorPair);
                        this.indicators[slotNumber] = indicatorPair;
                        console.log("SLOT ", slotNumber, " assigned ", indicatorPair);
                        console.log("SLOT ", this.indicators);
                    }

                    // Create inline input connection.
                    connectionX = connectionsXY.x + cursorX //+
                        /*Blockly.BlockSvg.TAB_WIDTH*/
                        - Blockly.BlockSvg.SEP_SPACE_X -
                        input.renderWidth - 1;

                    connectionY = connectionsXY.y + cursorY
                        /*Blockly.BlockSvg.INLINE_PADDING_TOP */
                    ;

                    if (!this.outputConnection) {
                        connectionY += Blockly.BlockSvg.STMT_ARGS_PADDING_TOP;
                    }

                    input.connection.moveTo(connectionX, connectionY);
                    if (input.connection.targetConnection) {
                        input.connection.tighten_();
                    }
                }
            }

            cursorX = Math.max(cursorX, inputRows.rightEdge);
            this.width = Math.max(this.width, cursorX);
            steps.push('H', cursorX);
            //holeSteps.push('H', cursorX - 0.5);
            steps.push('v', row.height);
        } else if (row.type == Blockly.INPUT_VALUE) {
            // External input.
            var input = row[0];
            var fieldX = cursorX;
            var fieldY = cursorY;
            if (input.align != Blockly.ALIGN_LEFT) {
                var fieldRightX = inputRows.rightEdge - input.fieldWidth -
                    Blockly.BlockSvg.TAB_WIDTH - 2 * Blockly.BlockSvg.SEP_SPACE_X;
                if (input.align == Blockly.ALIGN_RIGHT) {
                    fieldX += fieldRightX;
                } else if (input.align == Blockly.ALIGN_CENTRE) {
                    fieldX += fieldRightX / 2;
                }
            }
            this.renderFields_(input.fieldRow, fieldX, fieldY);
            steps.push(Blockly.BlockSvg.TAB_PATH_DOWN);
            var v = row.height - Blockly.BlockSvg.TAB_HEIGHT;
            steps.push('v', v);

            // Create external input connection.
            connectionX = connectionsXY.x + inputRows.rightEdge + 1;
            connectionY = connectionsXY.y + cursorY;
            input.connection.moveTo(connectionX, connectionY);
            if (input.connection.targetConnection) {
                input.connection.tighten_();
                this.width = Math.max(this.width, inputRows.rightEdge +
                    input.connection.targetBlock().getHeightWidth().width -
                    Blockly.BlockSvg.TAB_WIDTH + 1);
            }
        } else if (row.type == Blockly.DUMMY_INPUT) {
            // External naked field.
            var input = row[0];
            var fieldX = cursorX;
            var fieldY = cursorY;
            if (input.align != Blockly.ALIGN_LEFT) {
                var fieldRightX = inputRows.rightEdge - input.fieldWidth -
                    2 * Blockly.BlockSvg.SEP_SPACE_X;
                if (inputRows.hasValue) {
                    fieldRightX -= Blockly.BlockSvg.TAB_WIDTH;
                }
                if (input.align == Blockly.ALIGN_RIGHT) {
                    fieldX += fieldRightX;
                } else if (input.align == Blockly.ALIGN_CENTRE) {
                    fieldX += fieldRightX / 2;
                }
            }
            this.renderFields_(input.fieldRow, fieldX, fieldY);
            steps.push('v', row.height);
        } else if (row.type == Blockly.NEXT_STATEMENT) {
            // Nested statement.
            var input = row[0];
            if (y == 0) {
                // If the first input is a statement stack, add a small row on top.
                steps.push('v', Blockly.BlockSvg.SEP_SPACE_Y);
                cursorY += Blockly.BlockSvg.SEP_SPACE_Y;
            }
            var fieldX = cursorX;
            var fieldY = cursorY;
            if (input.align != Blockly.ALIGN_LEFT) {
                var fieldRightX = inputRows.statementEdge - input.fieldWidth -
                    2 * Blockly.BlockSvg.SEP_SPACE_X;
                if (input.align == Blockly.ALIGN_RIGHT) {
                    fieldX += fieldRightX;
                } else if (input.align == Blockly.ALIGN_CENTRE) {
                    fieldX += fieldRightX / 2;
                }
            }
            this.renderFields_(input.fieldRow, fieldX, fieldY);
            cursorX = inputRows.statementEdge + Blockly.BlockSvg.NOTCH_WIDTH;

            //var dropHeight = 0;//Blockly.BlockSvg.MIN_STMT_BLOCK_Y;
            if (row.height < Blockly.BlockSvg.MIN_STMT_BLOCK_Y) {
                row.height = Blockly.BlockSvg.MIN_STMT_BLOCK_Y;
            }
            //else row.height = 86;
            steps.push('H', cursorX - 0.5);
            steps.push(Blockly.BlockSvg.INNER_TOP_LEFT_CORNER);
            //steps.push('h', 0.5);
            //steps.push('v', dropHeight - 2 * Blockly.BlockSvg.CORNER_RADIUS);
            steps.push('v', row.height - 2 * Blockly.BlockSvg.CORNER_RADIUS);
            steps.push(Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER);
            // MJP removed
            //steps.push('H', inputRows.rightEdge);

            /*holeSteps.push('M',
                 (cursorX - Blockly.BlockSvg.NOTCH_WIDTH +
                  Blockly.BlockSvg.DISTANCE_45_OUTSIDE) + ',' +
                 (cursorY + row.height - Blockly.BlockSvg.DISTANCE_45_OUTSIDE));
             holeSteps.push(
                 Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER_HIGHLIGHT_LTR);
             holeSteps.push('H', inputRows.rightEdge - 0.5);*/

            // Create statement connection.
            connectionX = connectionsXY.x + cursorX - 0.5;
            connectionY = connectionsXY.y + cursorY;
            input.connection.moveTo(connectionX, connectionY);
            if (input.connection.targetConnection) {
                input.connection.tighten_();
                this.width = Math.max(this.width, inputRows.statementEdge +
                    input.connection.targetBlock().getHeightWidth().width);
            }
            if (y == inputRows.length - 1 ||
                inputRows[y + 1].type == Blockly.NEXT_STATEMENT) {
                // If the final input is a statement stack, add a small row underneath.
                // Consecutive statement stacks are also separated by a small divider.
                //steps.push('v', Blockly.BlockSvg.SEP_SPACE_Y);
                //cursorY += Blockly.BlockSvg.SEP_SPACE_Y;
            }
        }

        cursorY += row.height;
    }
    if (!inputRows.length) {
        cursorY = Blockly.BlockSvg.MIN_BLOCK_Y;
        steps.push('V', cursorY);
    }
    //console.log("cy", cursorY)
    if (!this.outputConnection) {
        console.log("statement cursor finally", cursorY);
    }
    return cursorY;
};

/**
 * Render the bottom edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Array.<string>} holeSteps Path of block highlights.
 * @param {!Object} connectionsXY Location of block.
 * @param {number} cursorY Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawBottom_ =
    function(steps, holeSteps, connectionsXY, cursorY) {
        this.height = cursorY
        if (this.nextConnection) {
            steps.push('H', (Blockly.BlockSvg.NOTCH_WIDTH + 0.0) +
                ' ' + Blockly.BlockSvg.NOTCH_PATH_RIGHT);
            // Create next block connection.
            var connectionX = connectionsXY.x + Blockly.BlockSvg.NOTCH_WIDTH;
            var connectionY = connectionsXY.y + cursorY;
            this.nextConnection.moveTo(connectionX, connectionY);
            if (this.nextConnection.targetConnection) {
                this.nextConnection.tighten_();
            }
            this.height += 4; // Height of tab.
        }

        steps.push('H 0');
        //holeSteps.push('M', '0.5,' + (cursorY - 0.5));
    };

/**
 * Render the left edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Array.<string>} holeSteps Path of block highlights.
 * @param {!Object} connectionsXY Location of block.
 * @param {number} cursorY Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawLeft_ =
    function(steps, holeSteps, connectionsXY, cursorY) {
        if (this.outputConnection) {
            // Create output connection.
            this.outputConnection.moveTo(connectionsXY.x - 1, connectionsXY.y); // ?
            //holeSteps.push('V', 0.5);
        } else {
            if (this.squareTopLeftCorner_) {
                // Statement block in a stack.
                ; //holeSteps.push('V', 0.5);
            } else {; // holeSteps.push('V', Blockly.BlockSvg.CORNER_RADIUS);
            }
        }
        //holeSteps.push('z')
        steps.push('z');
    };

// returns true if parameters added or deleted
Blockly.Block.prototype.checkParentheses = function() {
    var operator = this.operator;
    if (operator) {
        var parent = this.getParent();
        if (parent) {
            var parentOp = parent.operator;
            if (!parentOp) {
                return;
            }
            var position = this.outputConnection.getInputNumber();
            if (parentOp.precedence < operator.precedence) {
                return;
            } else if (parentOp.precedence == operator.precedence) {
                if (position == 1 && this.type == 'python_pow_op') {
                    return;
                }
                if (position == 0 && this.type != 'python_pow_op') {
                    return;
                }
            } else {
                if (position == 1 && parent.type == 'python_pow_op' &&
                    this.type == "python_unary_minus") {
                    return;
                }
            }
            // highest precedence operators don't have LPAR and RPAR fields
            var lpar = this.getField("LPAR");
            var rpar = this.getField("RPAR");
            // add parentheses
            // add parentheses if not present
            if (lpar && lpar.getValue() == "") {
                lpar.setValue("(");
                rpar.setValue(")");
                return true;
            }
        } else {
            // remove parentheses if present
            var lpar = this.getField("LPAR");
            var rpar = this.getField("RPAR");
            if (lpar && lpar.getValue() == "(") {
                lpar.setValue("");
                rpar.setValue("");
                return true;
            }
        }
    }
};
