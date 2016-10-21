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
 * @fileoverview Functions for injecting Blockly into a web page.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.inject');

goog.require('Blockly.Css');
goog.require('Blockly.WorkspaceSvg');
goog.require('goog.dom');
goog.require('goog.ui.Component');
goog.require('goog.userAgent');


/**
 * Inject a Blockly editor into the specified container element (usually a div).
 * @param {!Element|string} container Containing element or its ID.
 * @param {Object=} opt_options Optional dictionary of options.
 * @return {!Blockly.Workspace} Newly created main workspace.
 */
Blockly.inject = function(container, opt_options) {
    if (goog.isString(container)) {
        container = document.getElementById(container);
    }
    // Verify that the container is in document.
    if (!goog.dom.contains(document, container)) {
        throw 'Error: container is not in current document.';
    }
    var options = Blockly.parseOptions_(opt_options || {});
    var workspace;
    var startUi = function() {
        var svg = Blockly.createDom_(container, options);
        workspace = Blockly.createMainWorkspace_(svg, options);
        Blockly.init_(workspace);
        workspace.markFocused();
        Blockly.bindEvent_(svg, 'focus', workspace, workspace.markFocused);
    };
    if (options.enableRealtime) {
        var realtimeElement = document.getElementById('realtime');
        if (realtimeElement) {
            realtimeElement.style.display = 'block';
        }
        Blockly.Realtime.startRealtime(startUi, container, options.realtimeOptions);
    } else {
        startUi();
    }
    return workspace;
};

/**
 * Parse the provided toolbox tree into a consistent DOM format.
 * @param {Node|string} tree DOM tree of blocks, or text representation of same.
 * @return {Node} DOM tree of blocks, or null.
 * @private
 */
Blockly.parseToolboxTree_ = function(tree) {
    if (tree) {
        if (typeof tree != 'string' && typeof XSLTProcessor == 'undefined') {
            // In this case the tree will not have been properly built by the
            // browser. The HTML will be contained in the element, but it will
            // not have the proper DOM structure since the browser doesn't support
            // XSLTProcessor (XML -> HTML). This is the case in IE 9+.
            tree = tree.outerHTML;
        }
        if (typeof tree == 'string') {
            tree = Blockly.Xml.textToDom(tree);
        }
    } else {
        tree = null;
    }
    return tree;
};

/**
 * Configure Blockly to behave according to a set of options.
 * @param {!Object} options Dictionary of options.  Specification:
 *   https://developers.google.com/blockly/installation/overview#configuration
 * @return {!Object} Dictionary of normalized options.
 * @private
 */
Blockly.parseOptions_ = function(options) {
    var readOnly = !!options['readOnly'];
    if (readOnly) {
        var languageTree = null;
        var hasCategories = false;
        var hasTrashcan = false;
        var hasCollapse = false;
        var hasComments = false;
        var hasDisable = false;
        var hasSounds = false;
    } else {
        var languageTree = Blockly.parseToolboxTree_(options['toolbox']);
        var hasCategories = Boolean(languageTree &&
            languageTree.getElementsByTagName('category').length);
        var hasTrashcan = options['trashcan'];
        if (hasTrashcan === undefined) {
            hasTrashcan = hasCategories;
        }
        var hasCollapse = options['collapse'];
        if (hasCollapse === undefined) {
            hasCollapse = hasCategories;
        }
        var hasComments = options['comments'];
        if (hasComments === undefined) {
            hasComments = hasCategories;
        }
        var hasDisable = options['disable'];
        if (hasDisable === undefined) {
            hasDisable = hasCategories;
        }
        var hasSounds = options['sounds'];
        if (hasSounds === undefined) {
            hasSounds = true;
        }
    }
    var hasScrollbars = options['scrollbars'];
    if (hasScrollbars === undefined) {
        hasScrollbars = hasCategories;
    }
    var hasCss = options['css'];
    if (hasCss === undefined) {
        hasCss = true;
    }
    // See grid documentation at:
    // https://developers.google.com/blockly/installation/grid
    var grid = options['grid'] || {};
    var gridOptions = {};
    gridOptions.spacing = parseFloat(grid['spacing']) || 0;
    gridOptions.colour = grid['colour'] || '#888';
    gridOptions.length = parseFloat(grid['length']) || 1;
    gridOptions.snap = gridOptions.spacing > 0 && !!grid['snap'];
    var pathToMedia = 'https://blockly-demo.appspot.com/static/media/';
    if (options['media']) {
        pathToMedia = options['media'];
    } else if (options['path']) {
        // 'path' is a deprecated option which has been replaced by 'media'.
        pathToMedia = options['path'] + 'media/';
    }

    // See zoom documentation at:
    // https://developers.google.com/blockly/installation/zoom
    var zoom = options['zoom'] || {};
    var zoomOptions = {};
    if (zoom['controls'] === undefined) {
        zoomOptions.controls = false;
    } else {
        zoomOptions.controls = !!zoom['controls'];
    }
    if (zoom['wheel'] === undefined) {
        zoomOptions.wheel = false;
    } else {
        zoomOptions.wheel = !!zoom['wheel'];
    }
    if (zoom['startScale'] === undefined) {
        zoomOptions.startScale = 1;
    } else {
        zoomOptions.startScale = parseFloat(zoom['startScale']);
    }
    if (zoom['maxScale'] === undefined) {
        zoomOptions.maxScale = 3;
    } else {
        zoomOptions.maxScale = parseFloat(zoom['maxScale']);
    }
    if (zoom['minScale'] === undefined) {
        zoomOptions.minScale = 0.3;
    } else {
        zoomOptions.minScale = parseFloat(zoom['minScale']);
    }
    if (zoom['scaleSpeed'] === undefined) {
        zoomOptions.scaleSpeed = 1.2;
    } else {
        zoomOptions.scaleSpeed = parseFloat(zoom['scaleSpeed']);
    }

    var enableRealtime = !!options['realtime'];
    var realtimeOptions = enableRealtime ? options['realtimeOptions'] : undefined;

    return {
        RTL: !!options['rtl'],
        collapse: hasCollapse,
        comments: hasComments,
        disable: hasDisable,
        readOnly: readOnly,
        maxBlocks: options['maxBlocks'] || Infinity,
        pathToMedia: pathToMedia,
        hasCategories: hasCategories,
        hasScrollbars: hasScrollbars,
        hasTrashcan: hasTrashcan,
        hasSounds: hasSounds,
        hasCss: hasCss,
        languageTree: languageTree,
        gridOptions: gridOptions,
        zoomOptions: zoomOptions,
        enableRealtime: enableRealtime,
        realtimeOptions: realtimeOptions
    };
};

/**
 * Create the SVG image.
 * @param {!Element} container Containing element.
 * @param {Object} options Dictionary of options.
 * @return {!Element} Newly created SVG image.
 * @private
 */
Blockly.createDom_ = function(container, options) {
    // Sadly browsers (Chrome vs Firefox) are currently inconsistent in laying
    // out content in RTL mode.  Therefore Blockly forces the use of LTR,
    // then manually positions content in RTL as needed.
    container.setAttribute('dir', 'LTR');
    // Closure can be trusted to create HTML widgets with the proper direction.
    goog.ui.Component.setDefaultRightToLeft(options.RTL);

    // Load CSS.
    Blockly.Css.inject(options.hasCss, options.pathToMedia);

    // Build the SVG DOM.
    /*
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:html="http://www.w3.org/1999/xhtml"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      class="blocklySvg">
      ...
    </svg>
    */
    var svg = Blockly.createSvgElement('svg', {
        'xmlns': 'http://www.w3.org/2000/svg',
        'xmlns:html': 'http://www.w3.org/1999/xhtml',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        'version': '1.1',
        'class': 'blocklySvg'
    }, container);
    /*
    <defs>
      ... filters go here ...
    </defs>
    */
    var defs = Blockly.createSvgElement('defs', {}, svg);
    var rnd = String(Math.random()).substring(2);
    /*
      <filter id="blocklyEmbossFilter837493">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur"/>
        <feSpecularLighting in="blur" surfaceScale="1" specularConstant="0.5"
                            specularExponent="10" lighting-color="white"
                            result="specOut">
          <fePointLight x="-5000" y="-10000" z="20000"/>
        </feSpecularLighting>
        <feComposite in="specOut" in2="SourceAlpha" operator="in"
                     result="specOut"/>
        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic"
                     k1="0" k2="1" k3="1" k4="0"/>
      </filter>
    */
    var embossFilter = Blockly.createSvgElement('filter', {
        'id': 'blocklyEmbossFilter' + rnd
    }, defs);
    Blockly.createSvgElement('feGaussianBlur', {
        'in': 'SourceAlpha',
        'stdDeviation': 1,
        'result': 'blur'
    }, embossFilter);
    var feSpecularLighting = Blockly.createSvgElement('feSpecularLighting', {
            'in': 'blur',
            'surfaceScale': 1,
            'specularConstant': 0.5,
            'specularExponent': 10,
            'lighting-color': 'white',
            'result': 'specOut'
        },
        embossFilter);
    Blockly.createSvgElement('fePointLight', {
        'x': -5000,
        'y': -10000,
        'z': 20000
    }, feSpecularLighting);
    Blockly.createSvgElement('feComposite', {
        'in': 'specOut',
        'in2': 'SourceAlpha',
        'operator': 'in',
        'result': 'specOut'
    }, embossFilter);
    Blockly.createSvgElement('feComposite', {
        'in': 'SourceGraphic',
        'in2': 'specOut',
        'operator': 'arithmetic',
        'k1': 0,
        'k2': 1,
        'k3': 1,
        'k4': 0
    }, embossFilter);
    options.embossFilterId = embossFilter.id;
    /*
      <pattern id="blocklyDisabledPattern837493" patternUnits="userSpaceOnUse"
               width="10" height="10">
        <rect width="10" height="10" fill="#aaa" />
        <path d="M 0 0 L 10 10 M 10 0 L 0 10" stroke="#cc0" />
      </pattern>
    */
    var disabledPattern = Blockly.createSvgElement('pattern', {
        'id': 'blocklyDisabledPattern' + rnd,
        'patternUnits': 'userSpaceOnUse',
        'width': 10,
        'height': 10
    }, defs);
    Blockly.createSvgElement('rect', {
        'width': 10,
        'height': 10,
        'fill': '#aaa'
    }, disabledPattern);
    Blockly.createSvgElement('path', {
        'd': 'M 0 0 L 10 10 M 10 0 L 0 10',
        'stroke': '#cc0'
    }, disabledPattern);
    options.disabledPatternId = disabledPattern.id;
    /*
      <pattern id="blocklyGridPattern837493" patternUnits="userSpaceOnUse">
        <rect stroke="#888" />
        <rect stroke="#888" />
      </pattern>
    */
    var gridPattern = Blockly.createSvgElement('pattern', {
        'id': 'blocklyGridPattern' + rnd,
        'patternUnits': 'userSpaceOnUse'
    }, defs);
    if (options.gridOptions['length'] > 0 && options.gridOptions['spacing'] > 0) {
        Blockly.createSvgElement('line', {
                'stroke': options.gridOptions['colour']
            },
            gridPattern);
        if (options.gridOptions['length'] > 1) {
            Blockly.createSvgElement('line', {
                    'stroke': options.gridOptions['colour']
                },
                gridPattern);
        }
        // x1, y1, x1, x2 properties will be set later in updateGridPattern_.
    }
    options.gridPattern = gridPattern;

    /*
...
  */
    var anyTypeGradient = Blockly.createSvgElement('linearGradient', {
        'id': 'blocklyAnyTypeGradient' + rnd,
        'x1': 1,
        'x2': 0.5,
        'y1': 0,
        'y2': 0.5,
        'spreadMethod': 'repeat'
    }, defs);
    //var offsets = [0, 0.06, 0.14, 0.26, 0.34, 0.46, 0.54, 0.66, 0.74, 0.86, 0.94, 1.0];
    var offsets = [0, 0.167, 0.333, 0.5, 0.667, 0.833, 1.0];
    //var colours = ['float', 'range', 'bool', 'str', 'int', 'float'];
    for (var i in Blockly.Python.RAINBOW) {
        Blockly.createSvgElement('stop', {
                'stop-color': Blockly.Python.RAINBOW[i],
                'offset': offsets[i]
            },
            anyTypeGradient);
        //  Blockly.createSvgElement('stop',
        //      {'stop-color': Blockly.Python.COLOUR[Blockly.Python.RAINBOW[i]],
        //      'offset': offsets[2*i+1]}, anyTypeGradient);
    }
    options.anyTypeGradientId = anyTypeGradient.id;

    /*
    <pattern id="anyTypePatternLarge" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="90" height="90" fill="url(#anyTypeGradient)" />
    </pattern>
    */
    var anyTypePatternLarge = Blockly.createSvgElement('pattern', {
        'id': 'blocklyAnyTypePatternLarge' + rnd,
        'x': 0,
        'y': 0,
        'width': 50,
        'height': 50,
        'patternUnits': 'userSpaceOnUse'
    }, defs);
    Blockly.createSvgElement('rect', {
            'x': 0,
            'y': 0,
            'width': 50,
            'height': 50,
            'fill': 'url(#blocklyAnyTypeGradient' + rnd + ')'
        },
        anyTypePatternLarge);
    options.anyTypePatternLargeId = anyTypePatternLarge.id;

    /*
    <pattern id="anyTypePatternLarge" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="90" height="90" fill="url(#anyTypeGradient)" />
    </pattern>
    */

    var anyTypePatternSmall = Blockly.createSvgElement('pattern', {
        'id': 'blocklyAnyTypePatternSmall' + rnd,
        'x': 0,
        'y': 0,
        'width': 20,
        'height': 20,
        'patternUnits': 'userSpaceOnUse'
    }, defs);
    Blockly.createSvgElement('rect', {
            'x': 0,
            'y': 0,
            'width': 20,
            'height': 20,
            'fill': 'url(#blocklyAnyTypeGradient' + rnd + ')'
        },
        anyTypePatternSmall);
    options.anyTypePatternSmallId = anyTypePatternSmall.id;


    /*
      var createMultiTypeGradient = function(types) {
        var name = types.join('') + "TypeGradient";
        var gradient = Blockly.createSvgElement('linearGradient',
            {'id': name + rnd,
             'x1': 1, 'x2': 0, 'y1': 0, 'y2': 1,
             'spreadMethod': 'repeat'}, defs);

        var offset = 0;
        var offsetStep = 0.333333 / types.length;
        //var offsetStep = 0.5 / types.length;
        var colours = types.concat(types).concat(types[0]);

        for (i in colours) {
          var colour = colours[i];
          //console.log("CREATE: offset ", offsets[2*i], "colour", Blockly.Python.COLOUR[colours[i]] );
          Blockly.createSvgElement('stop',
              {'stop-color': Blockly.Python.COLOUR[colour],
              'offset': offset}, gradient);
          offset += i === 0 || i === colours.length - 1 ? offsetStep / 2 : offsetStep;
          Blockly.createSvgElement('stop',
              {'stop-color': Blockly.Python.COLOUR[colour],
               'offset': offset}, gradient);
          offset += offsetStep / 2;
          //offset += 0.01;
        }
        options[name + "Id"] = gradient.id;
      };

      createMultiTypeGradient(["float", "int"]);
      createMultiTypeGradient(["float", "str"]);
      createMultiTypeGradient(["range", "str"]);
      createMultiTypeGradient(["int", "str"]);
      createMultiTypeGradient(["float", "int", "str"]);

    */

    // var createMultiTypePattern = function(types, sizeStr) {
    //   var name = types.join('') + "TypePattern" + sizeStr;
    //   var dimension = types.length * (sizeStr == "Small" ? 7 : 15);
    //   var pattern = Blockly.createSvgElement('pattern',
    //       {'id': name + rnd,
    //         'x': 0, 'y': 0, 'width': dimension, 'height': dimension,
    //         'patternUnits': 'userSpaceOnUse'}, defs);
    //   Blockly.createSvgElement('rect',
    //       {'x': 0, 'y': 0, 'width': dimension, 'height': dimension,
    //         'fill': 'url(#' + types.join('') + 'TypeGradient' +  rnd + ')'},
    //         pattern);
    //   options[name + "Id"] = pattern.id;
    // };
    var createMultiTypeBlockPattern = function(types) {
        var name = types.join('') + "TypePatternLarge";
        var basicStep = 10;
        var dimension = types.length * basicStep * 2;
        var pattern = Blockly.createSvgElement('pattern', {
            'id': name + rnd,
            'x': 0,
            'y': 0,
            'width': dimension,
            'height': dimension,
            'patternUnits': 'userSpaceOnUse'
        }, defs);
        var pathStrings = [];
        if (types.length == 2) {
            pathStrings.push("M0,A C,D A,D 0,C z MA,0 C,0 D,A D,C z");
            pathStrings.push("M0,0 A,0 D,C D,D C,D 0,A z  M0,C A,D 0,D z MC,0 D,0, D,A z");
        } else {
            pathStrings.push("M0,C C,F A,F 0,E z MA,0 C,0 F,C F,E z");
            pathStrings.push("M0,0 A,0 F,E F,F E,F 0,A z  M0,E A,F 0,F z ME,0 F,0 F,A z");
            pathStrings.push("M0,A E,F C,F 0,C z MC,0 E,0 F,A F,C z");
        }

        for (var i in pathStrings) {
            console.log("PATH before ", pathStrings[i]);
            pathStrings[i] = pathStrings[i].replace(/A/g, basicStep);
            pathStrings[i] = pathStrings[i].replace(/B/g, basicStep * 2);
            pathStrings[i] = pathStrings[i].replace(/C/g, basicStep * 3);
            pathStrings[i] = pathStrings[i].replace(/D/g, basicStep * 4);
            pathStrings[i] = pathStrings[i].replace(/E/g, basicStep * 5);
            pathStrings[i] = pathStrings[i].replace(/F/g, basicStep * 6);

            var type = types[i];
            var colour = Blockly.Python.COLOUR[type];
            Blockly.createSvgElement('path', {
                    'd': pathStrings[i],
                    //'x': 0, 'y': 0, 'width': dimension, 'height': dimension,
                    'fill': colour,
                    'shape-rendering': 'crispEdges',
                    //'image-rendering': 'crispEdges'
                },
                pattern);
        }
        // currently hardcoded for '-' placement on int/float indicator
        options[name + "Id"] = pattern.id;
    };

    var createMultiTypeIndicatorPattern = function(types) {
        var basicStep = Blockly.BlockSvg.INDICATOR_HEIGHT / 6;
        var name = types.join('') + "TypePatternSmall";
        var pattern = Blockly.createSvgElement('pattern', {
            'id': name + rnd,
            'x': 0,
            'y': 0,
            'width': 12, //Blockly.BlockSvg.INDICATOR_WIDTH,
            'height': 6, //Blockly.BlockSvg.INDICATOR_HEIGHT,
            'patternUnits': 'objectBoundingBox'
        }, defs);
        var pathStrings = [];
        if (types.length == 2) {
            pathStrings.push("MA,0 C,0 H,D E,D z M0,B B,D 0,D z MF,0 H,0 H,B z");
            pathStrings.push("M0,0 A,0 E,D B,D 0,B z MC,0 F,0 H,B H,D G,D z");
            //pathStrings.push("M1,0 5,0 12,6 7,6 z M0,3 3,6 0,6 z M9,0 12,0 12,3 z");
            //pathStrings.push("M0,0 1,0 7,6 3,6 0,3 z MC,0 9,0 12,3 12,6 11,6 z");
        } else {
            //pathStrings.push("MB,0 E,0 H,C H,D F,D z M0,C A,D 0,D z");
            //pathStrings.push("M0,0 B,0 F,D C,D 0,A z MG,0 H,0 H,A z");
            //pathStrings.push("M0,A C,D A,D 0,C z ME,0 G,0 H,A H,C z");
            pathStrings.push("MA,0 C,0 G,D E,D z");
            pathStrings.push("M0,0 A,0 E,D B,D 0,B z MF,0 H,0 H,F z");
            pathStrings.push("M0,B B,D 0,D z MC,0 F,0 H,B H,D G,D z");
        }

        var subtypeSymbol = null;
        for (var i in pathStrings) {
            console.log("PATHIND ", pathStrings[i]);
            pathStrings[i] = pathStrings[i].replace(/A/g, basicStep);
            pathStrings[i] = pathStrings[i].replace(/B/g, basicStep * 3);
            pathStrings[i] = pathStrings[i].replace(/C/g, basicStep * 5);
            pathStrings[i] = pathStrings[i].replace(/D/g, basicStep * 6);
            pathStrings[i] = pathStrings[i].replace(/E/g, basicStep * 7);
            pathStrings[i] = pathStrings[i].replace(/F/g, basicStep * 9);
            pathStrings[i] = pathStrings[i].replace(/G/g, basicStep * 11);
            pathStrings[i] = pathStrings[i].replace(/H/g, basicStep * 12);
            console.log("PATHIND ", pathStrings[i]);

            var colour;
            var type = types[i];
            if (type in Blockly.Python.SUPERTYPES) {
                colour = Blockly.Python.COLOUR[Blockly.Python.SUPERTYPES[type]];
                subtypeSymbol = Blockly.Python.PATTERNED_SUBTYPE_SYMBOLS[type];
            } else {
                colour = Blockly.Python.COLOUR[type];
            }

            Blockly.createSvgElement('path', {
                    'd': pathStrings[i],
                    //'x': 0, 'y': 0, 'width': dimension, 'height': dimension,
                    'fill': colour,
                    'shape-rendering': 'crispEdges',
                    //  'image-rendering': 'crispEdges'
                },
                pattern);
        }
        // currently hardcoded for '-' placement on int/float indicator
        if (subtypeSymbol !== null) {
            var coords = [{
                x: basicStep * 2.2,
                y: basicStep * 4.5
            }, {
                x: basicStep * 9.7,
                y: basicStep * 4.3
            }];
            for (var i = 0; i < coords.length; i++) {
                var text = Blockly.createSvgElement('text', {
                        'class': 'blocklyIndicatorText',
                        'x': coords[i].x,
                        'y': coords[i].y
                    },
                    pattern);
                text.appendChild(document.createTextNode(subtypeSymbol));
            }
        }
        options[name + "Id"] = pattern.id;
    };
    //createTwoTypePatternSmall("float", "int");

    createMultiTypeIndicatorPattern(["float", "int"]);
    createMultiTypeIndicatorPattern(["float", "str"]);
    createMultiTypeIndicatorPattern(["range", "str"]);
    createMultiTypeIndicatorPattern(["int", "str"]);
    createMultiTypeIndicatorPattern(["float", "int", "str"]);

    createMultiTypeBlockPattern(["float", "int"]);
    createMultiTypeBlockPattern(["int", "str"]);
    createMultiTypeBlockPattern(["float", "int", "str"]);
    createMultiTypeBlockPattern(["range", "str"]);

    // temporary
    createMultiTypeIndicatorPattern(["float", "negint"]);
    createMultiTypeIndicatorPattern(["float", "nonnegint"]);

    //options.numericalTypeGradientId = numericalTypeGradient.id;
    console.log("CREATED: ", options);
    /*
      var numericalTypePatternLarge = Blockly.createSvgElement('pattern',
          {'id': 'blocklyNumericalTypePatternLarge' + rnd,
            'x': 0, 'y': 0, 'width': F, 'height': F,
            'patternUnits': 'userSpaceOnUse'}, defs);
      Blockly.createSvgElement('rect',
              {'x': 0, 'y': 0, 'width': F, 'height': F,
              'fill': 'url(#blocklyNumericalTypeGradient' +  rnd + ')'},
              numericalTypePatternLarge);
      options.numericalTypePatternLargeId = numericalTypePatternLarge.id;
    */
    /*
      var numericalTypePatternSmall = Blockly.createSvgElement('pattern',
          {'id': 'blocklyNumericalTypePatternSmall' + rnd,
            'x': 0, 'y': 0, 'width': 10, 'height': 10,
            'patternUnits': 'userSpaceOnUse'}, defs);
      Blockly.createSvgElement('rect',
              {'x': 0, 'y': 0, 'width': 10, 'height': 10,
              'fill': 'url(#blocklyNumericalTypeGradient' +  rnd + ')'},
              numericalTypePatternSmall);
      options.numericalTypePatternSmallId = numericalTypePatternSmall.id;*/

    /*var sequenceTypeGradient = Blockly.createSvgElement('linearGradient',
        {'id': 'blocklySequenceTypeGradient' + rnd,
         'x1': 1, 'x2': 0, 'y1': 0, 'y2': 1,
         'spreadMethod': 'repeat'}, defs);
    offsets = [0, 0.083, 0.167, 0.333, 0.416, 0.583, 0.667, 0.833, 0.917, 1];
    var colours = ['range', 'str', 'range', 'str', 'range'];
    for (i in colours) {
      Blockly.createSvgElement('stop',
          {'stop-color': Blockly.Python.COLOUR[colours[i]],
          'offset': offsets[2*i]}, sequenceTypeGradient);
      Blockly.createSvgElement('stop',
          {'stop-color': Blockly.Python.COLOUR[colours[i]],
           'offset': offsets[2*i+1]}, sequenceTypeGradient);
    }
    options.sequenceTypeGradientId = sequenceTypeGradient.id;


    var strRangePatternSmall = Blockly.createSvgElement('pattern',
        {'id': 'blocklystrRangePatternSmall' + rnd,
          'x': 0, 'y': 0, 'width': 10, 'height': 10,
          'patternUnits': 'userSpaceOnUse'}, defs);
    Blockly.createSvgElement('rect',
            {'x': 0, 'y': 0, 'width': 10, 'height': 10,
            'fill': 'url(#blocklySequenceTypeGradient' +  rnd + ')'},
            strRangePatternSmall);
    options.strRangePatternSmallId = strRangePatternSmall.id;*/

    console.log("OPTIONS", options);
    options.svg = svg;
    return svg;
};

/**
 * Create a main workspace and add it to the SVG.
 * @param {!Element} svg SVG element with pattern defined.
 * @param {Object} options Dictionary of options.
 * @return {!Blockly.Workspace} Newly created main workspace.
 * @private
 */
Blockly.createMainWorkspace_ = function(svg, options) {
    options.parentWorkspace = null;
    options.getMetrics = Blockly.getMainWorkspaceMetrics_;
    options.setMetrics = Blockly.setMainWorkspaceMetrics_;
    var mainWorkspace = new Blockly.WorkspaceSvg(options);
    mainWorkspace.scale = options.zoomOptions.startScale;
    svg.appendChild(mainWorkspace.createDom('blocklyMainBackground'));
    // A null translation will also apply the correct initial scale.
    mainWorkspace.translate(0, 0);
    mainWorkspace.markFocused();

    if (!options.readOnly && !options.hasScrollbars) {
        var workspaceChanged = function() {
            if (Blockly.dragMode_ == 0) {
                var metrics = mainWorkspace.getMetrics();
                var edgeLeft = metrics.viewLeft + metrics.absoluteLeft;
                var edgeTop = metrics.viewTop + metrics.absoluteTop;
                if (metrics.contentTop < edgeTop ||
                    metrics.contentTop + metrics.contentHeight >
                    metrics.viewHeight + edgeTop ||
                    metrics.contentLeft <
                    (options.RTL ? metrics.viewLeft : edgeLeft) ||
                    metrics.contentLeft + metrics.contentWidth > (options.RTL ?
                        metrics.viewWidth : metrics.viewWidth + edgeLeft)) {
                    // One or more blocks may be out of bounds.  Bump them back in.
                    var MARGIN = 25;
                    var blocks = mainWorkspace.getTopBlocks(false);
                    for (var b = 0, block; block = blocks[b]; b++) {
                        var blockXY = block.getRelativeToSurfaceXY();
                        var blockHW = block.getHeightWidth();
                        // Bump any block that's above the top back inside.
                        var overflow = edgeTop + MARGIN - blockHW.height - blockXY.y;
                        if (overflow > 0) {
                            block.moveBy(0, overflow);
                        }
                        // Bump any block that's below the bottom back inside.
                        var overflow = edgeTop + metrics.viewHeight - MARGIN - blockXY.y;
                        if (overflow < 0) {
                            block.moveBy(0, overflow);
                        }
                        // Bump any block that's off the left back inside.
                        var overflow = MARGIN + edgeLeft -
                            blockXY.x - (options.RTL ? 0 : blockHW.width);
                        if (overflow > 0) {
                            block.moveBy(overflow, 0);
                        }
                        // Bump any block that's off the right back inside.
                        var overflow = edgeLeft + metrics.viewWidth - MARGIN -
                            blockXY.x + (options.RTL ? blockHW.width : 0);
                        if (overflow < 0) {
                            block.moveBy(overflow, 0);
                        }
                    }
                }
            }
        };
        mainWorkspace.addChangeListener(workspaceChanged);
    }
    // The SVG is now fully assembled.
    Blockly.svgResize(mainWorkspace);
    Blockly.WidgetDiv.createDom();
    Blockly.Tooltip.createDom();
    return mainWorkspace;
};

/**
 * Initialize Blockly with various handlers.
 * @param {!Blockly.Workspace} mainWorkspace Newly created main workspace.
 * @private
 */
Blockly.init_ = function(mainWorkspace) {
    var options = mainWorkspace.options;
    var svg = mainWorkspace.options.svg;
    // Supress the browser's context menu.
    Blockly.bindEvent_(svg, 'contextmenu', null,
        function(e) {
            if (!Blockly.isTargetInput_(e)) {
                e.preventDefault();
            }
        });
    Blockly.bindEvent_(Blockly.WidgetDiv.DIV, 'contextmenu', null,
        function(e) {
            if (!Blockly.isTargetInput_(e)) {
                e.preventDefault();
            }
        });
    // Bind events for scrolling the workspace.
    // Most of these events should be bound to the SVG's surface.
    // However, 'mouseup' has to be on the whole document so that a block dragged
    // out of bounds and released will know that it has been released.
    // Also, 'keydown' has to be on the whole document since the browser doesn't
    // understand a concept of focus on the SVG image.

    Blockly.bindEvent_(window, 'resize', null,
        function() {
            Blockly.svgResize(mainWorkspace);
        });

    if (!Blockly.documentEventsBound_) {
        // Only bind the window/document events once.
        // Destroying and reinjecting Blockly should not bind again.
        Blockly.bindEvent_(document, 'keydown', null, Blockly.onKeyDown_);
        Blockly.bindEvent_(document, 'touchend', null, Blockly.longStop_);
        Blockly.bindEvent_(document, 'touchcancel', null, Blockly.longStop_);
        // Don't use bindEvent_ for document's mouseup since that would create a
        // corresponding touch handler that would squeltch the ability to interact
        // with non-Blockly elements.
        document.addEventListener('mouseup', Blockly.onMouseUp_, false);
        // Some iPad versions don't fire resize after portrait to landscape change.
        if (goog.userAgent.IPAD) {
            Blockly.bindEvent_(window, 'orientationchange', document, function() {
                Blockly.fireUiEvent(window, 'resize');
            });
        }
        Blockly.documentEventsBound_ = true;
    }

    if (options.languageTree) {
        if (mainWorkspace.toolbox_) {
            mainWorkspace.toolbox_.init(mainWorkspace);
        } else if (mainWorkspace.flyout_) {
            // Build a fixed flyout with the root blocks.
            mainWorkspace.flyout_.init(mainWorkspace);
            mainWorkspace.flyout_.show(options.languageTree.childNodes);
            // Translate the workspace sideways to avoid the fixed flyout.
            mainWorkspace.scrollX = mainWorkspace.flyout_.width_;
            if (options.RTL) {
                mainWorkspace.scrollX *= -1;
            }
            var translation = 'translate(' + mainWorkspace.scrollX + ',0)';
            mainWorkspace.getCanvas().setAttribute('transform', translation);
            mainWorkspace.getBubbleCanvas().setAttribute('transform', translation);
        }
    }
    if (options.hasScrollbars) {
        mainWorkspace.scrollbar = new Blockly.ScrollbarPair(mainWorkspace);
        mainWorkspace.scrollbar.resize();
    }

    // Load the sounds.
    if (options.hasSounds) {
        mainWorkspace.loadAudio_(
            [options.pathToMedia + 'click.mp3',
                options.pathToMedia + 'click.wav',
                options.pathToMedia + 'click.ogg'
            ], 'click');
        mainWorkspace.loadAudio_(
            [options.pathToMedia + 'disconnect.wav',
                options.pathToMedia + 'disconnect.mp3',
                options.pathToMedia + 'disconnect.ogg'
            ], 'disconnect');
        mainWorkspace.loadAudio_(
            [options.pathToMedia + 'delete.mp3',
                options.pathToMedia + 'delete.ogg',
                options.pathToMedia + 'delete.wav'
            ], 'delete');

        // Bind temporary hooks that preload the sounds.
        var soundBinds = [];
        var unbindSounds = function() {
            while (soundBinds.length) {
                Blockly.unbindEvent_(soundBinds.pop());
            }
            mainWorkspace.preloadAudio_();
        };
        // Android ignores any sound not loaded as a result of a user action.
        soundBinds.push(
            Blockly.bindEvent_(document, 'mousemove', null, unbindSounds));
        soundBinds.push(
            Blockly.bindEvent_(document, 'touchstart', null, unbindSounds));
    }
};

/**
 * Modify the block tree on the existing toolbox.
 * @param {Node|string} tree DOM tree of blocks, or text representation of same.
 */
Blockly.updateToolbox = function(tree) {
    console.warn('Deprecated call to Blockly.updateToolbox, ' +
        'use workspace.updateToolbox instead.');
    Blockly.getMainWorkspace().updateToolbox(tree);
};
