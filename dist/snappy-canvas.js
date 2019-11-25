(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SnappyCanvas = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var helpers = {
    merge: function merge(dest, src) {
        for (var prop in src) {
            dest[prop] = src[prop];
        }
        return dest;
    },
    clone: function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
};

module.exports = helpers;

},{}],2:[function(require,module,exports){
"use strict";

module.exports = require("./snappy-canvas.js");

},{"./snappy-canvas.js":3}],3:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SnappyContext2D = require("./snappy-context2d.js");

var SnappyCanvas = function SnappyCanvas(options) {
    _classCallCheck(this, SnappyCanvas);

    var canvas = options.canvas || document.createElement("canvas");
    SnappyCanvas.transformCanvas(canvas, options);
    return canvas;
};

SnappyCanvas.transformCanvas = function (canvas) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var context2d = canvas.getContext("2d");
    var snappyContext2d = new SnappyContext2D(context2d, options);
    var contentWidth = null;
    var contentHeight = null;

    canvas.getContext = function (contextType) {
        if (contextType == "snappy") {
            return snappyContext2d;
        } else {
            return HTMLCanvasElement.prototype.getContext.call(this, contextType);
        }
    };

    Object.defineProperty(canvas, "contentWidth", {
        enumerable: true,
        configurable: false,
        get: function get() {
            if (contentWidth === null) {
                return this.width / snappyContext2d.globalScale | 0;
            } else {
                return contentWidth | 0;
            }
        },
        set: function set(width) {
            contentWidth = width;
            if (options.autoResizeCanvas) {
                this.width = width * snappyContext2d.globalScale + 1 | 0;
            }
        }
    });

    Object.defineProperty(canvas, "contentHeight", {
        enumerable: true,
        configurable: false,
        get: function get() {
            if (contentHeight === null) {
                return this.height / snappyContext2d.globalScale | 0;
            } else {
                return contentHeight | 0;
            }
        },
        set: function set(height) {
            contentHeight = height | 0;
            if (options.autoResizeCanvas) {
                this.height = height * snappyContext2d.globalScale + 1 | 0;
            }
        }
    });

    if (options.width) {
        canvas.width = options.width;
    }
    if (options.height) {
        canvas.height = options.height;
    }

    if (options.contentWidth) {
        canvas.contentWidth = options.contentWidth;
    }

    if (options.contentHeight) {
        canvas.contentHeight = options.contentHeight;
    }
};

module.exports = SnappyCanvas;

},{"./snappy-context2d.js":4}],4:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var helpers = require("./helpers.js");

var SnappyContext2D = function () {
    function SnappyContext2D(context2d) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, SnappyContext2D);

        Object.defineProperty(this, "canvas", {
            enumerable: false,
            configurable: false,
            value: context2d.canvas
        });
        Object.defineProperty(this, "_drawing", {
            enumerable: false,
            configurable: false,
            value: []
        });
        Object.defineProperty(this, "_options", {
            enumerable: false,
            configurable: false,
            value: helpers.merge({
                globalTranslationX: 0,
                globalTranslationY: 0,
                globalScale: 1,
                scaleLineWidth: true,
                scaleDashesWidth: true,
                autoResizeCanvas: false,
                disableSnappy: false,
                minLineWidth: 1
            }, options)
        });
        Object.defineProperty(this, "_contextStatus", {
            enumerable: false,
            configurable: false,
            value: {}
        });
        Object.defineProperty(this, "_defaultContextStatus", {
            enumerable: false,
            configurable: false,
            value: {}
        });

        function _context2dMethod() {
            for (var _len = arguments.length, call = Array(_len), _key = 0; _key < _len; _key++) {
                call[_key] = arguments[_key];
            }

            this._drawing.push(call); // jshint ignore:line
        }

        function _context2dPropertyGet(property) {
            return this._contextStatus[property]; // jshint ignore:line
        }

        function _context2dPropertySet(property, value) {
            this._contextStatus[property] = value; // jshint ignore:line
            this._drawing.push([property, value]); // jshint ignore:line
        }

        for (var prop in context2d) {
            if (this[prop] !== undefined) {
                continue;
            }
            if (typeof context2d[prop] == "function") {
                this[prop] = _context2dMethod.bind(this, prop);
            } else {
                this._contextStatus[prop] = this._context2d[prop];
                this._defaultContextStatus[prop] = this._context2d[prop];
                Object.defineProperty(this, prop, {
                    enumerable: true,
                    configurable: false,
                    get: _context2dPropertyGet.bind(this, prop),
                    set: _context2dPropertySet.bind(this, prop)
                });
            }
        }
    }

    _createClass(SnappyContext2D, [{
        key: "measureText",
        value: function measureText(text) {
            var ctx = this._context2d;
            ctx.save();
            ctx.font = this._contextStatus.font;
            var textMeasure = ctx.measureText(text);
            ctx.restore();
            return textMeasure;
        }
    }, {
        key: "setSnappyOptions",
        value: function setSnappyOptions(options) {
            helpers.merge(this._options, options);
            this.render();
        }
    }, {
        key: "clear",
        value: function clear() {
            this._drawing.length = 0;
            helpers.merge(this._contextStatus, this._defaultContextStatus);
            this._context2d.clearRect(0, 0, this._context2d.canvas.width, this._context2d.canvas.height);
        }
    }, {
        key: "render",
        value: function render() {
            var ctx = this._context2d;
            var options = this._options;

            var pathStack = [];
            var contextStatusStack = [];
            var isStroke = 0;

            var contextStatus = {
                tx: options.globalTranslationX,
                ty: options.globalTranslationY,
                scale: options.globalScale,
                lw: options.scaleLineWidth ? Math.max(options.minLineWidth, options.globalScale) : 1
            };

            // Helpers

            function _contextOperationCall(ctx, operationName) {
                for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                    args[_key2 - 2] = arguments[_key2];
                }

                if (typeof ctx[operationName] == "function") {
                    return ctx[operationName].apply(ctx, args);
                } else {
                    ctx[operationName] = args[0];
                }
            }

            // Filters

            var _posx = function _posx(x, cs) {
                if (options.disableSnappy) return (x + cs.tx) * cs.scale + cs.lw * isStroke % 2 / 2;
                return ((x + cs.tx) * cs.scale | 0) + cs.lw * isStroke % 2 / 2;
            };
            var _posy = function _posy(y, cs) {
                if (options.disableSnappy) return (y + cs.ty) * cs.scale + cs.lw * isStroke % 2 / 2;
                return ((y + cs.ty) * cs.scale | 0) + cs.lw * isStroke % 2 / 2;
            };
            var _size = function _size(s, cs) {
                return options.disableSnappy ? s * cs.scale : s * cs.scale | 0;
            };
            var _nop = function _nop(v, cs) {
                return v;
            };

            // Operations

            function _operationGeneric(operation, operationName) {
                if (operation.isStroke !== undefined && operation.isStroke !== null) {
                    isStroke = operation.isStroke;
                }

                for (var _len3 = arguments.length, values = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                    values[_key3 - 2] = arguments[_key3];
                }

                if (!operation.isPath) {
                    var args = [];
                    for (var i = 0; i < values.length; i++) {
                        args[i] = operation.args[i](values[i], contextStatus);
                    }
                    _contextOperationCall.apply(undefined, [ctx, operationName].concat(args));
                } else {
                    _contextOperationCall.apply(undefined, [ctx, operationName].concat(values));
                }
            }

            function _operationPathStack(operation, operationName) {
                for (var _len4 = arguments.length, values = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                    values[_key4 - 2] = arguments[_key4];
                }

                if (operation.isPath) {
                    if (operation.isStroke !== undefined && operation.isStroke !== null) {
                        isStroke = operation.isStroke;
                    }
                    var args = [];
                    for (var i = 0; i < values.length; i++) {
                        args[i] = operation.args[i](values[i], contextStatus);
                    }
                    pathStack.push([operationName].concat(args));
                } else {
                    pathStack.push([operationName].concat(values));
                }
            }

            function _operationUnimplemented(operation, operationName) {
                throw new Error("SnappyContext2D: operation not supported: " + operationName + ".");
            }

            var operations = {

                // Drawing rectangles
                clearRect: { isStroke: 0, args: [_posx, _posy, _size, _size] },
                fillRect: { isStroke: 0, args: [_posx, _posy, _size, _size] },
                strokeRect: { isStroke: 1, args: [_posx, _posy, _size, _size] },

                // Drawing text
                fillText: { fn: function fn(operation, operationName) {
                        ctx.save();
                        ctx.scale(contextStatus.scale, contextStatus.scale);
                        ctx.translate(contextStatus.tx, contextStatus.ty);

                        for (var _len5 = arguments.length, values = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
                            values[_key5 - 2] = arguments[_key5];
                        }

                        ctx[operationName].apply(ctx, values);
                        ctx.restore();
                    } },
                strokeText: { fn: function fn(operation, operationName) {
                        ctx.save();
                        ctx.scale(contextStatus.scale, contextStatus.scale);
                        ctx.translate(contextStatus.tx, contextStatus.ty);
                        if (!options.scaleLineWidth) {
                            ctx.lineWidth = contextStatus.lw / contextStatus.scale;
                        }

                        for (var _len6 = arguments.length, values = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
                            values[_key6 - 2] = arguments[_key6];
                        }

                        ctx[operationName].apply(ctx, values);
                        ctx.restore();
                    } },
                // measureText()  -> implemented in the class

                // Line style
                lineWidth: { fn: function fn(operation, operationName) {
                        var lineWidth;
                        if (options.scaleLineWidth) {
                            lineWidth = (arguments.length <= 2 ? undefined : arguments[2]) * contextStatus.scale;
                        } else {
                            lineWidth = arguments.length <= 2 ? undefined : arguments[2];
                        }

                        if (!options.disableSnappy) lineWidth = lineWidth | 0;

                        lineWidth = Math.max(options.minLineWidth, lineWidth);
                        contextStatus.lw = lineWidth;
                        ctx.lineWidth = lineWidth;
                    } },
                lineCap: { args: [_nop] },
                lineJoin: { args: [_nop] },
                miterLimit: { args: [_nop] },
                getLineDash: { args: [] },
                setLineDash: { fn: function fn(operation, operationName) {
                        for (var _len7 = arguments.length, values = Array(_len7 > 2 ? _len7 - 2 : 0), _key7 = 2; _key7 < _len7; _key7++) {
                            values[_key7 - 2] = arguments[_key7];
                        }

                        var tmp = values[0] ? values[0].slice(0) : [];
                        if (options.scaleDashesWidth) {
                            for (var i = 0; i < tmp.length; i++) {
                                tmp[i] *= contextStatus.scale;
                            }
                        }
                        ctx.setLineDash(tmp);
                    } },
                lineDashOffset: { fn: function fn(operation, operationName) {
                        ctx.lineDashOffset = (arguments.length <= 2 ? undefined : arguments[2]) * (contextStatus.scaleDashesWidth ? contextStatus.scale : options.minLineWidth);
                        if (!options.disableSnappy) ctx.lineDashOffset = ctx.lineDashOffset | 0;
                    } },

                // Text styles
                font: { args: [_nop] },
                textAlign: { args: [_nop] },
                textBaseline: { args: [_nop] },
                direction: { args: [_nop] },

                // Fill and stroke styles
                fillStyle: { args: [_nop] },
                strokeStyle: { args: [_nop] },

                // Gradients and patterns
                // TODO createLinearGradient()
                // TODO createRadialGradient()
                // TODO createPattern()

                // Shadows
                // TODO shadowBlur
                shadowColor: { args: [_nop] },
                // TODO shadowOffsetX
                // TODO shadowOffsetY

                // Path
                beginPath: { fn: function fn(_) {
                        return pathStack = [];
                    } },
                closePath: { isPath: true },
                moveTo: { isPath: true, args: [_posx, _posy] },
                lineTo: { isPath: true, args: [_posx, _posy] },
                bezierCurveTo: { isPath: true, args: [_posx, _posy, _posx, _posy, _posx, _posy] },
                quadraticCurveTo: { isPath: true, args: [_posx, _posy, _posx, _posy] },
                arc: { isPath: true, args: [_posx, _posy, _size, _nop, _nop, _nop] },
                arcTo: { isPath: true, args: [_posx, _posy, _posx, _posy, _size] },
                ellipse: { isPath: true, args: [_posx, _posy, _size, _size, _nop, _nop, _nop, _nop] },
                rect: { args: [_posx, _posy, _size, _size] },

                // Drawing paths
                fill: { fn: function fn(_) {
                        isStroke = false;_drawStack(pathStack, false);ctx.fill();
                    } },
                stroke: { fn: function fn(_) {
                        isStroke = true;_drawStack(pathStack, false);ctx.stroke();
                    } },
                // TODO drawFocusIfNeeded()
                // TODO scrollPathIntoView()    /!\ Experimental
                // TODO clip()
                // TODO isPointInPath()
                // TODO isPointInStroke()

                // Transformation
                // currentTransform    -> not supported
                rotate: { fn: function fn(operation, operationName, angle) {
                        if (!options.disableSnappy) {
                            var tx = contextStatus.tx * contextStatus.scale | 0;
                            var ty = contextStatus.ty * contextStatus.scale | 0;
                            contextStatus.tx = 0;
                            contextStatus.ty = 0;
                            ctx.translate(tx, ty);
                        }
                        ctx.rotate(angle);
                    } },
                // scale               -> not supported
                translate: { fn: function fn(operation, operationName, tx, ty) {
                        if (!options.disableSnappy) {
                            contextStatus.tx += tx;
                            contextStatus.ty += ty;
                        } else {
                            ctx.translate(tx * contextStatus.scale, ty * contextStatus.scale);
                        }
                    } },
                // transform()         -> not supported
                // resetTransform()    -> not supported

                // Compositing
                globalAlpha: { args: [_nop] },
                globalCompositeOperation: { args: [_nop] },

                // Drawing images
                drawImage: { fn: function fn(operation, operationName) {
                        for (var _len8 = arguments.length, values = Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
                            values[_key8 - 2] = arguments[_key8];
                        }

                        switch (values.length) {
                            case 3:
                                _contextOperationCall(ctx, operationName, values[0], // Image
                                _posx(values[1], contextStatus), // dx
                                _posy(values[2], contextStatus), // dy
                                _size(values[0].width, contextStatus), // dWidth
                                _size(values[0].height, contextStatus) // dHeight
                                );
                                break;
                            case 5:
                                _contextOperationCall(ctx, operationName, values[0], // Image
                                _posx(values[1], contextStatus), // dx
                                _posy(values[2], contextStatus), // dy
                                _size(values[3], contextStatus), // dWidth
                                _size(values[4], contextStatus) // dHeight
                                );
                                break;
                            case 9:
                                _contextOperationCall(ctx, operationName, values[0], // Image
                                values[1], // sx
                                values[2], // sy
                                values[3], // sWidth
                                values[4], // sHeight
                                _posx(values[5], contextStatus), // dx
                                _posy(values[6], contextStatus), // dy
                                _size(values[7], contextStatus), // dWidth
                                _size(values[8], contextStatus) // dHeight
                                );
                                break;
                            default:
                                throw new Error("SnappyContext2D: Wrong arguments for drawImage");
                        }
                    } },

                // Pixel manipulation
                // createImageData  -> not supported
                // getImageData     -> not supported
                // putImageData     -> not supported

                // Image smoothing
                imageSmoothingEnabled: { args: [_nop] },

                // The canvas state
                save: { fn: function fn(operation, operationName) {
                        contextStatusStack.push(helpers.clone(contextStatus));
                        ctx.save();
                    } },
                restore: { fn: function fn(operation, operationName) {
                        contextStatus = contextStatusStack.pop();
                        ctx.restore();
                    } }

                // Hit regions
                // TODO addHitRegion()        /!\ Experimental
                // TODO removeHitRegion()     /!\ Experimental
                // TODO clearHitRegion()      /!\ Experimental

            };

            // Let it draw! Let it draw!

            function _drawStack(stack) {
                var skipPathOperations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                ctx.beginPath();

                for (var i = 0; i < stack.length; i++) {
                    var operationName = stack[i][0];
                    var operation = operations[operationName];
                    var operationFn = skipPathOperations && operation && operation.isPath ? _operationPathStack : _operationGeneric;

                    if (operation && operation.fn) {
                        operationFn = operation.fn;
                    } else if (!operation) {
                        operationFn = _operationUnimplemented;
                    }

                    operationFn.apply(undefined, [operation].concat(_toConsumableArray(stack[i])));
                }
            }

            ctx.save();
            ctx.lineWidth = contextStatus.lw;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            _drawStack(this._drawing);
            ctx.restore();
        }
    }, {
        key: "disableSnappy",
        get: function get() {
            return this._options.disableSnappy;
        },
        set: function set(disable) {
            this._options.disableSnappy = disable;
        }
    }, {
        key: "minLineWidth",
        set: function set(width) {
            this._options.minLineWidth = width;
        }
    }, {
        key: "_context2d",
        get: function get() {
            return this.canvas.getContext("2d");
        }
    }, {
        key: "globalTranslationX",
        get: function get() {
            return this._options.globalTranslationX;
        },
        set: function set(tx) {
            this._options.globalTranslationX = tx;
            this.render();
        }
    }, {
        key: "globalTranslationY",
        get: function get() {
            return this._options.globalTranslationY;
        },
        set: function set(ty) {
            this._options.globalTranslationY = ty;
            this.render();
        }
    }, {
        key: "globalScale",
        get: function get() {
            return this._options.globalScale;
        },
        set: function set(scale) {
            var contentWidth = this._context2d.canvas.contentWidth;
            var contentHeight = this._context2d.canvas.contentHeight;
            this._options.globalScale = Math.max(0.0001, scale);
            if (contentWidth !== undefined && contentHeight !== undefined && this._options.autoResizeCanvas) {
                this._context2d.canvas.contentWidth = contentWidth;
                this._context2d.canvas.contentHeight = contentHeight;
            }
            this.render();
        }
    }, {
        key: "scaleLineWidth",
        get: function get() {
            return this._options.scaleLineWidth;
        },
        set: function set(scaleLineWidth) {
            this._options.scaleLineWidth = scaleLineWidth;
            this.render();
        }
    }, {
        key: "scaleDashesWidth",
        get: function get() {
            return this._options.scaleDashesWidth;
        },
        set: function set(scaleDashesWidth) {
            this._options.scaleDashesWidth = scaleDashesWidth;
            this.render();
        }
    }]);

    return SnappyContext2D;
}();

module.exports = SnappyContext2D;

},{"./helpers.js":1}]},{},[2])(2)
});
