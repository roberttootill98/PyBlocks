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

goog.provide('Blockly.Blocks.pymath');

goog.require('Blockly.Blocks');


Blockly.Blocks['python_math_ceil'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("math.ceil(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["float", "float"],
      ["int", "float"],
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '' && workspace.imports.indexOf('import math') >= 0) {
      this.holesFilled = true;
      runtooltip(workspace.imports + 'print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Returns the ceiling of a number');
    }
  }
};

// Blockly.Blocks['python_math_copysign'] = {
//   init: function() {
//     this.appendValueInput("ARG1")
//         .appendField("math.copysign(");
//     this.appendValueInput("ARG2")
//         .appendField(", ");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float", "float"],
//       ["int", "float", "float"],
//       ["float", "int", "float"],
//       ["int", "int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };

// Blockly.Blocks['python_math_fabs'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.fabs(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };

Blockly.Blocks['python_math_factorial'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("math.factorial(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["float", "float"],
      ["int", "float"],
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '' && workspace.imports.indexOf('import math') >= 0) {
      this.holesFilled = true;
      runtooltip(workspace.imports + 'print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Returns the factorial of a number');
    }
  }
};

Blockly.Blocks['python_math_floor'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("math.floor(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["float", "float"],
      ["int", "float"],
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '' && workspace.imports.indexOf('import math') >= 0) {
      this.holesFilled = true;
      runtooltip(workspace.imports + 'print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Returns the floor of a number');
    }
  }
};

// Blockly.Blocks['python_math_fmod'] = {
//   init: function() {
//     this.appendValueInput("ARG1")
//         .appendField("math.fmod(");
//     this.appendValueInput("ARG2")
//         .appendField(", ");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float", "float"],
//       ["int", "float", "float"],
//       ["float", "int", "float"],
//       ["int", "int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_frexp'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.frexp(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_fsum'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.fsum(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["*float", "float"],
//       ["*int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_isinf'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.isinf(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_isnan'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.isnan(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_ldexp'] = {
//   init: function() {
//     this.appendValueInput("ARG1")
//         .appendField("math.ldexp(");
//     this.appendValueInput("ARG2")
//         .appendField(", ");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float", "float"],
//       ["int", "float", "float"],
//       ["float", "int", "float"],
//       ["int", "int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_modf'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.modf(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// // Not finished, should only allow real numbers as input
// Blockly.Blocks['python_math_trunc'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.trunc(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "int"],
//       ["int", "int"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_exp'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.exp(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_expm1'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.expm1(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };

// Not finished, requires an option argument for base (default is e)
Blockly.Blocks['python_math_log'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("math.log(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["float", "float"],
      ["int", "float"],
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '' && workspace.imports.indexOf('import math') >= 0) {
      this.holesFilled = true;
      runtooltip(workspace.imports + 'print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Returns the logarithm of a number');
    }
  }
};

// Blockly.Blocks['python_math_log1p'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.log1p(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };

Blockly.Blocks['python_math_log10'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("math.log10(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["float", "float"],
      ["int", "float"],
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '' && workspace.imports.indexOf('import math') >= 0) {
      this.holesFilled = true;
      runtooltip(workspace.imports + 'print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Returns the log10 of a number');
    }
  }
};

Blockly.Blocks['python_math_pow'] = {
  init: function() {
    this.appendValueInput("ARG1")
        .appendField("math.pow(");
    this.appendValueInput("ARG2")
        .appendField(", ");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["float", "float", "float"],
      ["int", "float", "float"],
      ["float", "int", "float"],
      ["int", "int", "float"],
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG1', Blockly.Python.ORDER_NONE) != '' && Blockly.Python.valueToCode(this, 'ARG2', Blockly.Python.ORDER_NONE) != '' && workspace.imports.indexOf('import math') >= 0) {
      this.holesFilled = true;
      runtooltip(workspace.imports + 'print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Returns the power of two numbers');
    }
  }
};

Blockly.Blocks['python_math_sqrt'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("math.sqrt(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["float", "float"],
      ["int", "float"],
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '' && workspace.imports.indexOf('import math') >= 0) {
      this.holesFilled = true;
      runtooltip(workspace.imports + 'print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Returns the square root of a number');
    }
  }
};

// Blockly.Blocks['python_math_acos'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.acos(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_asin'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.asin(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_atan'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.atan(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_atan2'] = {
//   init: function() {
//     this.appendValueInput("ARG1")
//         .appendField("math.pow(");
//     this.appendValueInput("ARG2")
//         .appendField(", ");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float", "float"],
//       ["int", "float", "float"],
//       ["float", "int", "float"],
//       ["int", "int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };

Blockly.Blocks['python_math_cos'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("math.cos(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["float", "float"],
      ["int", "float"],
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '' && workspace.imports.indexOf('import math') >= 0) {
      this.holesFilled = true;
      runtooltip(workspace.imports + 'print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Returns the cosine of the specified radians');
    }
  }
};

// Blockly.Blocks['python_math_hypot'] = {
//   init: function() {
//     this.appendValueInput("ARG1")
//         .appendField("math.hypot(");
//     this.appendValueInput("ARG2")
//         .appendField(", ");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float", "float"],
//       ["int", "float", "float"],
//       ["float", "int", "float"],
//       ["int", "int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };

Blockly.Blocks['python_math_sin'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("math.sin(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["float", "float"],
      ["int", "float"],
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '' && workspace.imports.indexOf('import math') >= 0) {
      this.holesFilled = true;
      runtooltip(workspace.imports + 'print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Returns the sine of the specified radians');
    }
  }
};

Blockly.Blocks['python_math_tan'] = {
  init: function() {
    this.appendValueInput("ARG")
        .appendField("math.tan(");
    this.appendDummyInput()
        .appendField(")");
    this.setInputsInline(true);
    this.setTypeVecs([
      ["float", "float"],
      ["int", "float"],
    ]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (Blockly.Python.valueToCode(this, 'ARG', Blockly.Python.ORDER_NONE) != '' && workspace.imports.indexOf('import math') >= 0) {
      this.holesFilled = true;
      runtooltip(workspace.imports + 'print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.holesFilled = false;
      this.setTooltip('Returns the tangent of the specified radians');
    }
  }
};

// Blockly.Blocks['python_math_degrees'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.degrees(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_radians'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.radians(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_acosh'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.acosh(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_asinh'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.asinh(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_atanh'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.atanh(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_cosh'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.cosh(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_sinh'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.sinh(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_tanh'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.tanh(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_erf'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.erf(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_erfc'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.erfc(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_gamma'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.gamma(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };
//
// Blockly.Blocks['python_math_lgamma'] = {
//   init: function() {
//     this.appendValueInput("ARG")
//         .appendField("math.lgamma(");
//     this.appendDummyInput()
//         .appendField(")");
//     this.setInputsInline(true);
//     this.setTypeVecs([
//       ["float", "float"],
//       ["int", "float"],
//     ]);
//     this.setOutput(true);
//     this.setTooltip('');
//     this.setHelpUrl('http://www.example.com/');
//   }
// };

Blockly.Blocks['python_math_pi'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("math.pi");
    this.setInputsInline(true);
    this.setTypeVecs([["float"]]);
    this.setOutput(true);
  },
  onchange: function(ev) {
    if (workspace.imports.indexOf('import math') >= 0) {
      runtooltip(workspace.imports + 'print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.setTooltip('Returns the pi mathematical constant');
    }
  }
};

Blockly.Blocks['python_math_e'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("math.e");
    this.setInputsInline(true);
    this.setTypeVecs([["float"]]);
    this.setOutput(true);

  },
  onchange: function(ev) {
    if (workspace.imports.indexOf('import math') >= 0) {
      runtooltip(workspace.imports + 'print( ' + Blockly.Python.blockToCode(this)[0] + ')');
      this.setTooltip(document.getElementById("hiddenoutput").textContent);
    } else {
      this.setTooltip('Returns the e mathematical constant');
    }
  }
};
