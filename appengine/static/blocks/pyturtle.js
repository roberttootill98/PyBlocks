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
  * @fileoverview Turtle blocks for PythonBlocks
  * @author up649230@myport.ac.uk
  */

'use strict';

goog.provide('Blockly.Blocks.pyturtle');

goog.require('Blockly.Blocks');


Blockly.Blocks['python_turtle_new'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("t = turtle.Turtle()");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Spawns an instance of a Turtle object');
    this.setTypeVecs([
      ["none"]
    ]);
  }
};

Blockly.Blocks['python_turtle_getscreen'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("s = t.getscreen()");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Gets the screen object corresponding to the given Turtle object');
    this.setTypeVecs([
      ["none"]
    ]);
  }
};

Blockly.Blocks['python_turtle_color'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("t.color(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Sets both the pen and fill colour of a Turtle object');
    this.setTypeVecs([
      ["str", "none"]
    ]);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
    } else {
      this.holesFilled = false;
    }
  }
};

Blockly.Blocks['python_turtle_pencolor'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("t.pencolor(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Sets the pen colour of a Turtle object');
    this.setTypeVecs([
      ["str", "none"]
    ]);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
    } else {
      this.holesFilled = false;
    }
  }
};

Blockly.Blocks['python_turtle_fillcolor'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("t.fillcolor(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Sets the fill colour of a Turtle object');
    this.setTypeVecs([
      ["str", "none"]
    ]);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
    } else {
      this.holesFilled = false;
    }
  }
};

Blockly.Blocks['python_turtle_bgcolor'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("s.bgcolor(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Sets the background colour of a Turtle object');
    this.setTypeVecs([
      ["str", "none"]
    ]);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
    } else {
      this.holesFilled = false;
    }
  }
};

Blockly.Blocks['python_turtle_fill'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("t.fill(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Sets the fill colour of a Turtle object');
    this.setTypeVecs([
      ["bool", "none"]
    ]);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
    } else {
      this.holesFilled = false;
    }
  }
};

Blockly.Blocks['python_turtle_forward'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("t.forward(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Moves the Turtle object forward');
    this.setTypeVecs([
      ["int", "none"],
      ["float", "none"]
    ]);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
    } else {
      this.holesFilled = false;
    }
  }
};

Blockly.Blocks['python_turtle_backward'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("t.backward(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Moves the Turtle object backward');
    this.setTypeVecs([
      ["int", "none"],
      ["float", "none"]
    ]);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
    } else {
      this.holesFilled = false;
    }
  }
};

Blockly.Blocks['python_turtle_left'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("t.left(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Turns the Turtle object to the left');
    this.setTypeVecs([
      ["int", "none"],
      ["float", "none"]
    ]);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
    } else {
      this.holesFilled = false;
    }
  }
};

Blockly.Blocks['python_turtle_right'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("t.right(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Turns the Turtle object to the right');
    this.setTypeVecs([
      ["int", "none"],
      ["float", "none"]
    ]);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
    } else {
      this.holesFilled = false;
    }
  }
};

Blockly.Blocks['python_turtle_circle'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("t.circle(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Draws a circle originating from the Turtle object with a specified radius');
    this.setTypeVecs([
      ["int", "none"],
      ["float", "none"]
    ]);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
    } else {
      this.holesFilled = false;
    }
  }
};

Blockly.Blocks['python_turtle_position'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("t.position()");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Returns the position of a Turtle object');
    this.setTypeVecs([
      ["none"]
    ]);
  }
};

Blockly.Blocks['python_turtle_setposition'] = {
  init: function() {
    this.appendValueInput("ARG1")
        .appendField("t.setposition(");
    this.appendValueInput("ARG2")
        .appendField(", ");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Sets the position of a Turtle object');
    this.setTypeVecs([
      ["int", "int", "none"],
      ["float", "float", "none"],
      ["float", "int", "none"],
      ["int", "float", "none"]
    ]);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG1', Blockly.Python.ORDER_NONE) != '' &&
    Blockly.Python.valueToCode(this, 'ARG2', Blockly.Python.ORDER_NONE) != '') {
      this.holesFilled = true;
    } else {
      this.holesFilled = false;
    }
  }
};

Blockly.Blocks['python_turtle_pendown'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("t.pendown()");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Sets the pen down for the Turtle object, allowing it to draw');
    this.setTypeVecs([
      ["none"]
    ]);
  }
};

Blockly.Blocks['python_turtle_penup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("t.penup()");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Brings the pen up for the Turtle object, preventing it from drawing');
    this.setTypeVecs([
      ["none"]
    ]);
  }
};

Blockly.Blocks['python_turtle_isdown'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("t.isdown()");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Returns whether or not the pen is down for a Turtle object');
    this.setTypeVecs([
      ["none"]
    ]);
  }
};
