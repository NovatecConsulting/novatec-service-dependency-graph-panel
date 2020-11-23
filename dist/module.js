define(["@grafana/data","lodash","react"], function(__WEBPACK_EXTERNAL_MODULE__grafana_data__, __WEBPACK_EXTERNAL_MODULE_lodash__, __WEBPACK_EXTERNAL_MODULE_react__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./module.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/object-assign/index.js":
/*!**********************************************!*\
  !*** ../node_modules/object-assign/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ "../node_modules/prop-types/checkPropTypes.js":
/*!****************************************************!*\
  !*** ../node_modules/prop-types/checkPropTypes.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (true) {
  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "../node_modules/prop-types/lib/ReactPropTypesSecret.js");
  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (true) {
    loggedTypeFailures = {};
  }
}

module.exports = checkPropTypes;


/***/ }),

/***/ "../node_modules/prop-types/factoryWithTypeCheckers.js":
/*!*************************************************************!*\
  !*** ../node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactIs = __webpack_require__(/*! react-is */ "../node_modules/react-is/index.js");
var assign = __webpack_require__(/*! object-assign */ "../node_modules/object-assign/index.js");

var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ "../node_modules/prop-types/lib/ReactPropTypesSecret.js");
var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ "../node_modules/prop-types/checkPropTypes.js");

var has = Function.call.bind(Object.prototype.hasOwnProperty);
var printWarning = function() {};

if (true) {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ( true && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (true) {
        if (arguments.length > 1) {
          printWarning(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : undefined;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ "../node_modules/prop-types/index.js":
/*!*******************************************!*\
  !*** ../node_modules/prop-types/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var ReactIs = __webpack_require__(/*! react-is */ "../node_modules/react-is/index.js");

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ "../node_modules/prop-types/factoryWithTypeCheckers.js")(ReactIs.isElement, throwOnDirectAccess);
} else {}


/***/ }),

/***/ "../node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!**************************************************************!*\
  !*** ../node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ "../node_modules/react-autosuggest/dist/Autosuggest.js":
/*!*************************************************************!*\
  !*** ../node_modules/react-autosuggest/dist/Autosuggest.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));

var _arrays = _interopRequireDefault(__webpack_require__(/*! shallow-equal/arrays */ "../node_modules/shallow-equal/arrays/index.js"));

var _Autowhatever = _interopRequireDefault(__webpack_require__(/*! ./Autowhatever */ "../node_modules/react-autosuggest/dist/Autowhatever.js"));

var _theme = __webpack_require__(/*! ./theme */ "../node_modules/react-autosuggest/dist/theme.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var alwaysTrue = function alwaysTrue() {
  return true;
};

var defaultShouldRenderSuggestions = function defaultShouldRenderSuggestions(value) {
  return value.trim().length > 0;
};

var defaultRenderSuggestionsContainer = function defaultRenderSuggestionsContainer(_ref) {
  var containerProps = _ref.containerProps,
      children = _ref.children;
  return /*#__PURE__*/_react["default"].createElement("div", containerProps, children);
};

var REASON_SUGGESTIONS_REVEALED = 'suggestions-revealed';
var REASON_SUGGESTIONS_UPDATED = 'suggestions-updated';
var REASON_SUGGESTION_SELECTED = 'suggestion-selected';
var REASON_INPUT_FOCUSED = 'input-focused';
var REASON_INPUT_CHANGED = 'input-changed';
var REASON_INPUT_BLURRED = 'input-blurred';
var REASON_ESCAPE_PRESSED = 'escape-pressed';

var Autosuggest = /*#__PURE__*/function (_Component) {
  _inherits(Autosuggest, _Component);

  var _super = _createSuper(Autosuggest);

  function Autosuggest(_ref2) {
    var _this;

    var _alwaysRenderSuggestions = _ref2.alwaysRenderSuggestions;

    _classCallCheck(this, Autosuggest);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "onDocumentMouseDown", function (event) {
      _this.justClickedOnSuggestionsContainer = false;
      var node = event.detail && event.detail.target || // This is for testing only. Please show me a better way to emulate this.
      event.target;

      while (node !== null && node !== document) {
        if (node.getAttribute && node.getAttribute('data-suggestion-index') !== null) {
          // Suggestion was clicked
          return;
        }

        if (node === _this.suggestionsContainer) {
          // Something else inside suggestions container was clicked
          _this.justClickedOnSuggestionsContainer = true;
          return;
        }

        node = node.parentNode;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "storeAutowhateverRef", function (autowhatever) {
      if (autowhatever !== null) {
        _this.autowhatever = autowhatever;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onSuggestionMouseEnter", function (event, _ref3) {
      var sectionIndex = _ref3.sectionIndex,
          itemIndex = _ref3.itemIndex;

      _this.updateHighlightedSuggestion(sectionIndex, itemIndex);

      if (event.target === _this.pressedSuggestion) {
        _this.justSelectedSuggestion = true;
      }

      _this.justMouseEntered = true;
      setTimeout(function () {
        _this.justMouseEntered = false;
      });
    });

    _defineProperty(_assertThisInitialized(_this), "highlightFirstSuggestion", function () {
      _this.updateHighlightedSuggestion(_this.props.multiSection ? 0 : null, 0);
    });

    _defineProperty(_assertThisInitialized(_this), "onDocumentMouseUp", function () {
      if (_this.pressedSuggestion && !_this.justSelectedSuggestion) {
        _this.input.focus();
      }

      _this.pressedSuggestion = null;
    });

    _defineProperty(_assertThisInitialized(_this), "onSuggestionMouseDown", function (event) {
      // Checking if this.justSelectedSuggestion is already true to not duplicate touch events in chrome
      // See: https://github.com/facebook/react/issues/9809#issuecomment-413978405
      if (!_this.justSelectedSuggestion) {
        _this.justSelectedSuggestion = true;
        _this.pressedSuggestion = event.target;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onSuggestionsClearRequested", function () {
      var onSuggestionsClearRequested = _this.props.onSuggestionsClearRequested;
      onSuggestionsClearRequested && onSuggestionsClearRequested();
    });

    _defineProperty(_assertThisInitialized(_this), "onSuggestionSelected", function (event, data) {
      var _this$props = _this.props,
          alwaysRenderSuggestions = _this$props.alwaysRenderSuggestions,
          onSuggestionSelected = _this$props.onSuggestionSelected,
          onSuggestionsFetchRequested = _this$props.onSuggestionsFetchRequested;
      onSuggestionSelected && onSuggestionSelected(event, data);

      if (alwaysRenderSuggestions) {
        onSuggestionsFetchRequested({
          value: data.suggestionValue,
          reason: REASON_SUGGESTION_SELECTED
        });
      } else {
        _this.onSuggestionsClearRequested();
      }

      _this.resetHighlightedSuggestion();
    });

    _defineProperty(_assertThisInitialized(_this), "onSuggestionClick", function (event) {
      var _this$props2 = _this.props,
          alwaysRenderSuggestions = _this$props2.alwaysRenderSuggestions,
          focusInputOnSuggestionClick = _this$props2.focusInputOnSuggestionClick;

      var _this$getSuggestionIn = _this.getSuggestionIndices(_this.findSuggestionElement(event.target)),
          sectionIndex = _this$getSuggestionIn.sectionIndex,
          suggestionIndex = _this$getSuggestionIn.suggestionIndex;

      var clickedSuggestion = _this.getSuggestion(sectionIndex, suggestionIndex);

      var clickedSuggestionValue = _this.props.getSuggestionValue(clickedSuggestion);

      _this.maybeCallOnChange(event, clickedSuggestionValue, 'click');

      _this.onSuggestionSelected(event, {
        suggestion: clickedSuggestion,
        suggestionValue: clickedSuggestionValue,
        suggestionIndex: suggestionIndex,
        sectionIndex: sectionIndex,
        method: 'click'
      });

      if (!alwaysRenderSuggestions) {
        _this.closeSuggestions();
      }

      if (focusInputOnSuggestionClick === true) {
        _this.input.focus();
      } else {
        _this.onBlur();
      }

      setTimeout(function () {
        _this.justSelectedSuggestion = false;
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onBlur", function () {
      var _this$props3 = _this.props,
          inputProps = _this$props3.inputProps,
          shouldRenderSuggestions = _this$props3.shouldRenderSuggestions;
      var value = inputProps.value,
          onBlur = inputProps.onBlur;

      var highlightedSuggestion = _this.getHighlightedSuggestion();

      var shouldRender = shouldRenderSuggestions(value, REASON_INPUT_BLURRED);

      _this.setState({
        isFocused: false,
        highlightedSectionIndex: null,
        highlightedSuggestionIndex: null,
        highlightedSuggestion: null,
        valueBeforeUpDown: null,
        isCollapsed: !shouldRender
      });

      onBlur && onBlur(_this.blurEvent, {
        highlightedSuggestion: highlightedSuggestion
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onSuggestionMouseLeave", function (event) {
      _this.resetHighlightedSuggestion(false); // shouldResetValueBeforeUpDown


      if (_this.justSelectedSuggestion && event.target === _this.pressedSuggestion) {
        _this.justSelectedSuggestion = false;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onSuggestionTouchStart", function () {
      _this.justSelectedSuggestion = true; // todo: event.preventDefault when https://github.com/facebook/react/issues/2043
      // todo: gets released so onSuggestionMouseDown won't fire in chrome
    });

    _defineProperty(_assertThisInitialized(_this), "onSuggestionTouchMove", function () {
      _this.justSelectedSuggestion = false;
      _this.pressedSuggestion = null;

      _this.input.focus();
    });

    _defineProperty(_assertThisInitialized(_this), "itemProps", function (_ref4) {
      var sectionIndex = _ref4.sectionIndex,
          itemIndex = _ref4.itemIndex;
      return {
        'data-section-index': sectionIndex,
        'data-suggestion-index': itemIndex,
        onMouseEnter: _this.onSuggestionMouseEnter,
        onMouseLeave: _this.onSuggestionMouseLeave,
        onMouseDown: _this.onSuggestionMouseDown,
        onTouchStart: _this.onSuggestionTouchStart,
        onTouchMove: _this.onSuggestionTouchMove,
        onClick: _this.onSuggestionClick
      };
    });

    _defineProperty(_assertThisInitialized(_this), "renderSuggestionsContainer", function (_ref5) {
      var containerProps = _ref5.containerProps,
          children = _ref5.children;
      var renderSuggestionsContainer = _this.props.renderSuggestionsContainer;
      return renderSuggestionsContainer({
        containerProps: containerProps,
        children: children,
        query: _this.getQuery()
      });
    });

    _this.state = {
      isFocused: false,
      isCollapsed: !_alwaysRenderSuggestions,
      highlightedSectionIndex: null,
      highlightedSuggestionIndex: null,
      highlightedSuggestion: null,
      valueBeforeUpDown: null
    };
    _this.justPressedUpDown = false;
    _this.justMouseEntered = false;
    _this.pressedSuggestion = null;
    return _this;
  }

  _createClass(Autosuggest, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      document.addEventListener('mousedown', this.onDocumentMouseDown);
      document.addEventListener('mouseup', this.onDocumentMouseUp);
      this.input = this.autowhatever.input;
      this.suggestionsContainer = this.autowhatever.itemsContainer;
    } // eslint-disable-next-line camelcase, react/sort-comp

  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if ((0, _arrays["default"])(nextProps.suggestions, this.props.suggestions)) {
        if (nextProps.highlightFirstSuggestion && nextProps.suggestions.length > 0 && this.justPressedUpDown === false && this.justMouseEntered === false) {
          this.highlightFirstSuggestion();
        }
      } else {
        if (this.willRenderSuggestions(nextProps, REASON_SUGGESTIONS_UPDATED)) {
          if (this.state.isCollapsed && !this.justSelectedSuggestion) {
            this.revealSuggestions();
          }
        } else {
          this.resetHighlightedSuggestion();
        }
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$props4 = this.props,
          suggestions = _this$props4.suggestions,
          onSuggestionHighlighted = _this$props4.onSuggestionHighlighted,
          highlightFirstSuggestion = _this$props4.highlightFirstSuggestion;

      if (!(0, _arrays["default"])(suggestions, prevProps.suggestions) && suggestions.length > 0 && highlightFirstSuggestion) {
        this.highlightFirstSuggestion();
        return;
      }

      if (onSuggestionHighlighted) {
        var highlightedSuggestion = this.getHighlightedSuggestion();
        var prevHighlightedSuggestion = prevState.highlightedSuggestion;

        if (highlightedSuggestion != prevHighlightedSuggestion) {
          onSuggestionHighlighted({
            suggestion: highlightedSuggestion
          });
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('mousedown', this.onDocumentMouseDown);
      document.removeEventListener('mouseup', this.onDocumentMouseUp);
    }
  }, {
    key: "updateHighlightedSuggestion",
    value: function updateHighlightedSuggestion(sectionIndex, suggestionIndex, prevValue) {
      var _this2 = this;

      this.setState(function (state) {
        var valueBeforeUpDown = state.valueBeforeUpDown;

        if (suggestionIndex === null) {
          valueBeforeUpDown = null;
        } else if (valueBeforeUpDown === null && typeof prevValue !== 'undefined') {
          valueBeforeUpDown = prevValue;
        }

        return {
          highlightedSectionIndex: sectionIndex,
          highlightedSuggestionIndex: suggestionIndex,
          highlightedSuggestion: suggestionIndex === null ? null : _this2.getSuggestion(sectionIndex, suggestionIndex),
          valueBeforeUpDown: valueBeforeUpDown
        };
      });
    }
  }, {
    key: "resetHighlightedSuggestion",
    value: function resetHighlightedSuggestion() {
      var shouldResetValueBeforeUpDown = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.setState(function (state) {
        var valueBeforeUpDown = state.valueBeforeUpDown;
        return {
          highlightedSectionIndex: null,
          highlightedSuggestionIndex: null,
          highlightedSuggestion: null,
          valueBeforeUpDown: shouldResetValueBeforeUpDown ? null : valueBeforeUpDown
        };
      });
    }
  }, {
    key: "revealSuggestions",
    value: function revealSuggestions() {
      this.setState({
        isCollapsed: false
      });
    }
  }, {
    key: "closeSuggestions",
    value: function closeSuggestions() {
      this.setState({
        highlightedSectionIndex: null,
        highlightedSuggestionIndex: null,
        highlightedSuggestion: null,
        valueBeforeUpDown: null,
        isCollapsed: true
      });
    }
  }, {
    key: "getSuggestion",
    value: function getSuggestion(sectionIndex, suggestionIndex) {
      var _this$props5 = this.props,
          suggestions = _this$props5.suggestions,
          multiSection = _this$props5.multiSection,
          getSectionSuggestions = _this$props5.getSectionSuggestions;

      if (multiSection) {
        return getSectionSuggestions(suggestions[sectionIndex])[suggestionIndex];
      }

      return suggestions[suggestionIndex];
    }
  }, {
    key: "getHighlightedSuggestion",
    value: function getHighlightedSuggestion() {
      var _this$state = this.state,
          highlightedSectionIndex = _this$state.highlightedSectionIndex,
          highlightedSuggestionIndex = _this$state.highlightedSuggestionIndex;

      if (highlightedSuggestionIndex === null) {
        return null;
      }

      return this.getSuggestion(highlightedSectionIndex, highlightedSuggestionIndex);
    }
  }, {
    key: "getSuggestionValueByIndex",
    value: function getSuggestionValueByIndex(sectionIndex, suggestionIndex) {
      var getSuggestionValue = this.props.getSuggestionValue;
      return getSuggestionValue(this.getSuggestion(sectionIndex, suggestionIndex));
    }
  }, {
    key: "getSuggestionIndices",
    value: function getSuggestionIndices(suggestionElement) {
      var sectionIndex = suggestionElement.getAttribute('data-section-index');
      var suggestionIndex = suggestionElement.getAttribute('data-suggestion-index');
      return {
        sectionIndex: typeof sectionIndex === 'string' ? parseInt(sectionIndex, 10) : null,
        suggestionIndex: parseInt(suggestionIndex, 10)
      };
    }
  }, {
    key: "findSuggestionElement",
    value: function findSuggestionElement(startNode) {
      var node = startNode;

      do {
        if (node.getAttribute && node.getAttribute('data-suggestion-index') !== null) {
          return node;
        }

        node = node.parentNode;
      } while (node !== null);

      console.error('Clicked element:', startNode); // eslint-disable-line no-console

      throw new Error("Couldn't find suggestion element");
    }
  }, {
    key: "maybeCallOnChange",
    value: function maybeCallOnChange(event, newValue, method) {
      var _this$props$inputProp = this.props.inputProps,
          value = _this$props$inputProp.value,
          onChange = _this$props$inputProp.onChange;

      if (newValue !== value) {
        onChange(event, {
          newValue: newValue,
          method: method
        });
      }
    }
  }, {
    key: "willRenderSuggestions",
    value: function willRenderSuggestions(props, reason) {
      var suggestions = props.suggestions,
          inputProps = props.inputProps,
          shouldRenderSuggestions = props.shouldRenderSuggestions;
      var value = inputProps.value;
      return suggestions.length > 0 && shouldRenderSuggestions(value, reason);
    }
  }, {
    key: "getQuery",
    value: function getQuery() {
      var inputProps = this.props.inputProps;
      var value = inputProps.value;
      var valueBeforeUpDown = this.state.valueBeforeUpDown;
      return (valueBeforeUpDown === null ? value : valueBeforeUpDown).trim();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props6 = this.props,
          suggestions = _this$props6.suggestions,
          renderInputComponent = _this$props6.renderInputComponent,
          onSuggestionsFetchRequested = _this$props6.onSuggestionsFetchRequested,
          renderSuggestion = _this$props6.renderSuggestion,
          inputProps = _this$props6.inputProps,
          multiSection = _this$props6.multiSection,
          renderSectionTitle = _this$props6.renderSectionTitle,
          id = _this$props6.id,
          getSectionSuggestions = _this$props6.getSectionSuggestions,
          theme = _this$props6.theme,
          getSuggestionValue = _this$props6.getSuggestionValue,
          alwaysRenderSuggestions = _this$props6.alwaysRenderSuggestions,
          highlightFirstSuggestion = _this$props6.highlightFirstSuggestion;
      var _this$state2 = this.state,
          isFocused = _this$state2.isFocused,
          isCollapsed = _this$state2.isCollapsed,
          highlightedSectionIndex = _this$state2.highlightedSectionIndex,
          highlightedSuggestionIndex = _this$state2.highlightedSuggestionIndex,
          valueBeforeUpDown = _this$state2.valueBeforeUpDown;
      var shouldRenderSuggestions = alwaysRenderSuggestions ? alwaysTrue : this.props.shouldRenderSuggestions;
      var value = inputProps.value,
          _onFocus = inputProps.onFocus,
          _onKeyDown = inputProps.onKeyDown;
      var willRenderSuggestions = this.willRenderSuggestions(this.props, 'render');
      var isOpen = alwaysRenderSuggestions || isFocused && !isCollapsed && willRenderSuggestions;
      var items = isOpen ? suggestions : [];

      var autowhateverInputProps = _objectSpread({}, inputProps, {
        onFocus: function onFocus(event) {
          if (!_this3.justSelectedSuggestion && !_this3.justClickedOnSuggestionsContainer) {
            var shouldRender = shouldRenderSuggestions(value, REASON_INPUT_FOCUSED);

            _this3.setState({
              isFocused: true,
              isCollapsed: !shouldRender
            });

            _onFocus && _onFocus(event);

            if (shouldRender) {
              onSuggestionsFetchRequested({
                value: value,
                reason: REASON_INPUT_FOCUSED
              });
            }
          }
        },
        onBlur: function onBlur(event) {
          if (_this3.justClickedOnSuggestionsContainer) {
            _this3.input.focus();

            return;
          }

          _this3.blurEvent = event;

          if (!_this3.justSelectedSuggestion) {
            _this3.onBlur();

            _this3.onSuggestionsClearRequested();
          }
        },
        onChange: function onChange(event) {
          var value = event.target.value;
          var shouldRender = shouldRenderSuggestions(value, REASON_INPUT_CHANGED);

          _this3.maybeCallOnChange(event, value, 'type');

          if (_this3.suggestionsContainer) {
            _this3.suggestionsContainer.scrollTop = 0;
          }

          _this3.setState(_objectSpread({}, highlightFirstSuggestion ? {} : {
            highlightedSectionIndex: null,
            highlightedSuggestionIndex: null,
            highlightedSuggestion: null
          }, {
            valueBeforeUpDown: null,
            isCollapsed: !shouldRender
          }));

          if (shouldRender) {
            onSuggestionsFetchRequested({
              value: value,
              reason: REASON_INPUT_CHANGED
            });
          } else {
            _this3.onSuggestionsClearRequested();
          }
        },
        onKeyDown: function onKeyDown(event, data) {
          var keyCode = event.keyCode;

          switch (keyCode) {
            case 40: // ArrowDown

            case 38:
              // ArrowUp
              if (isCollapsed) {
                if (shouldRenderSuggestions(value, REASON_SUGGESTIONS_REVEALED)) {
                  onSuggestionsFetchRequested({
                    value: value,
                    reason: REASON_SUGGESTIONS_REVEALED
                  });

                  _this3.revealSuggestions();

                  event.preventDefault(); // We act on the key.
                }
              } else if (suggestions.length > 0) {
                var newHighlightedSectionIndex = data.newHighlightedSectionIndex,
                    newHighlightedItemIndex = data.newHighlightedItemIndex;
                var newValue;

                if (newHighlightedItemIndex === null) {
                  // valueBeforeUpDown can be null if, for example, user
                  // hovers on the first suggestion and then pressed Up.
                  // If that happens, use the original input value.
                  newValue = valueBeforeUpDown === null ? value : valueBeforeUpDown;
                } else {
                  newValue = _this3.getSuggestionValueByIndex(newHighlightedSectionIndex, newHighlightedItemIndex);
                }

                _this3.updateHighlightedSuggestion(newHighlightedSectionIndex, newHighlightedItemIndex, value);

                _this3.maybeCallOnChange(event, newValue, keyCode === 40 ? 'down' : 'up');

                event.preventDefault(); // We act on the key.
              }

              _this3.justPressedUpDown = true;
              setTimeout(function () {
                _this3.justPressedUpDown = false;
              });
              break;
            // Enter

            case 13:
              {
                // See #388
                if (event.keyCode === 229) {
                  break;
                }

                var highlightedSuggestion = _this3.getHighlightedSuggestion();

                if (isOpen && !alwaysRenderSuggestions) {
                  _this3.closeSuggestions();
                }

                if (highlightedSuggestion != null) {
                  var _newValue = getSuggestionValue(highlightedSuggestion);

                  _this3.maybeCallOnChange(event, _newValue, 'enter');

                  _this3.onSuggestionSelected(event, {
                    suggestion: highlightedSuggestion,
                    suggestionValue: _newValue,
                    suggestionIndex: highlightedSuggestionIndex,
                    sectionIndex: highlightedSectionIndex,
                    method: 'enter'
                  });

                  _this3.justSelectedSuggestion = true;
                  setTimeout(function () {
                    _this3.justSelectedSuggestion = false;
                  });
                }

                break;
              }
            // Escape

            case 27:
              {
                if (isOpen) {
                  // If input.type === 'search', the browser clears the input
                  // when Escape is pressed. We want to disable this default
                  // behaviour so that, when suggestions are shown, we just hide
                  // them, without clearing the input.
                  event.preventDefault();
                }

                var willCloseSuggestions = isOpen && !alwaysRenderSuggestions;

                if (valueBeforeUpDown === null) {
                  // Didn't interact with Up/Down
                  if (!willCloseSuggestions) {
                    var _newValue2 = '';

                    _this3.maybeCallOnChange(event, _newValue2, 'escape');

                    if (shouldRenderSuggestions(_newValue2, REASON_ESCAPE_PRESSED)) {
                      onSuggestionsFetchRequested({
                        value: _newValue2,
                        reason: REASON_ESCAPE_PRESSED
                      });
                    } else {
                      _this3.onSuggestionsClearRequested();
                    }
                  }
                } else {
                  // Interacted with Up/Down
                  _this3.maybeCallOnChange(event, valueBeforeUpDown, 'escape');
                }

                if (willCloseSuggestions) {
                  _this3.onSuggestionsClearRequested();

                  _this3.closeSuggestions();
                } else {
                  _this3.resetHighlightedSuggestion();
                }

                break;
              }
          }

          _onKeyDown && _onKeyDown(event);
        }
      });

      var renderSuggestionData = {
        query: this.getQuery()
      };
      return /*#__PURE__*/_react["default"].createElement(_Autowhatever["default"], {
        multiSection: multiSection,
        items: items,
        renderInputComponent: renderInputComponent,
        renderItemsContainer: this.renderSuggestionsContainer,
        renderItem: renderSuggestion,
        renderItemData: renderSuggestionData,
        renderSectionTitle: renderSectionTitle,
        getSectionItems: getSectionSuggestions,
        highlightedSectionIndex: highlightedSectionIndex,
        highlightedItemIndex: highlightedSuggestionIndex,
        inputProps: autowhateverInputProps,
        itemProps: this.itemProps,
        theme: (0, _theme.mapToAutowhateverTheme)(theme),
        id: id,
        ref: this.storeAutowhateverRef
      });
    }
  }]);

  return Autosuggest;
}(_react.Component);

exports["default"] = Autosuggest;

_defineProperty(Autosuggest, "propTypes", {
  suggestions: _propTypes["default"].array.isRequired,
  onSuggestionsFetchRequested: function onSuggestionsFetchRequested(props, propName) {
    var onSuggestionsFetchRequested = props[propName];

    if (typeof onSuggestionsFetchRequested !== 'function') {
      throw new Error("'onSuggestionsFetchRequested' must be implemented. See: https://github.com/moroshko/react-autosuggest#onSuggestionsFetchRequestedProp");
    }
  },
  onSuggestionsClearRequested: function onSuggestionsClearRequested(props, propName) {
    var onSuggestionsClearRequested = props[propName];

    if (props.alwaysRenderSuggestions === false && typeof onSuggestionsClearRequested !== 'function') {
      throw new Error("'onSuggestionsClearRequested' must be implemented. See: https://github.com/moroshko/react-autosuggest#onSuggestionsClearRequestedProp");
    }
  },
  onSuggestionSelected: _propTypes["default"].func,
  onSuggestionHighlighted: _propTypes["default"].func,
  renderInputComponent: _propTypes["default"].func,
  renderSuggestionsContainer: _propTypes["default"].func,
  getSuggestionValue: _propTypes["default"].func.isRequired,
  renderSuggestion: _propTypes["default"].func.isRequired,
  inputProps: function inputProps(props, propName) {
    var inputProps = props[propName];

    if (!inputProps) {
      throw new Error("'inputProps' must be passed.");
    }

    if (!Object.prototype.hasOwnProperty.call(inputProps, 'value')) {
      throw new Error("'inputProps' must have 'value'.");
    }

    if (!Object.prototype.hasOwnProperty.call(inputProps, 'onChange')) {
      throw new Error("'inputProps' must have 'onChange'.");
    }
  },
  shouldRenderSuggestions: _propTypes["default"].func,
  alwaysRenderSuggestions: _propTypes["default"].bool,
  multiSection: _propTypes["default"].bool,
  renderSectionTitle: function renderSectionTitle(props, propName) {
    var renderSectionTitle = props[propName];

    if (props.multiSection === true && typeof renderSectionTitle !== 'function') {
      throw new Error("'renderSectionTitle' must be implemented. See: https://github.com/moroshko/react-autosuggest#renderSectionTitleProp");
    }
  },
  getSectionSuggestions: function getSectionSuggestions(props, propName) {
    var getSectionSuggestions = props[propName];

    if (props.multiSection === true && typeof getSectionSuggestions !== 'function') {
      throw new Error("'getSectionSuggestions' must be implemented. See: https://github.com/moroshko/react-autosuggest#getSectionSuggestionsProp");
    }
  },
  focusInputOnSuggestionClick: _propTypes["default"].bool,
  highlightFirstSuggestion: _propTypes["default"].bool,
  theme: _propTypes["default"].object,
  id: _propTypes["default"].string
});

_defineProperty(Autosuggest, "defaultProps", {
  renderSuggestionsContainer: defaultRenderSuggestionsContainer,
  shouldRenderSuggestions: defaultShouldRenderSuggestions,
  alwaysRenderSuggestions: false,
  multiSection: false,
  focusInputOnSuggestionClick: true,
  highlightFirstSuggestion: false,
  theme: _theme.defaultTheme,
  id: '1'
});

/***/ }),

/***/ "../node_modules/react-autosuggest/dist/Autowhatever.js":
/*!**************************************************************!*\
  !*** ../node_modules/react-autosuggest/dist/Autowhatever.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));

var _sectionIterator = _interopRequireDefault(__webpack_require__(/*! section-iterator */ "../node_modules/section-iterator/dist/index.js"));

var _reactThemeable = _interopRequireDefault(__webpack_require__(/*! react-themeable */ "../node_modules/react-themeable/dist/index.js"));

var _SectionTitle = _interopRequireDefault(__webpack_require__(/*! ./SectionTitle */ "../node_modules/react-autosuggest/dist/SectionTitle.js"));

var _ItemList = _interopRequireDefault(__webpack_require__(/*! ./ItemList */ "../node_modules/react-autosuggest/dist/ItemList.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var emptyObject = {};

var defaultRenderInputComponent = function defaultRenderInputComponent(props) {
  return /*#__PURE__*/_react["default"].createElement("input", props);
};

var defaultRenderItemsContainer = function defaultRenderItemsContainer(_ref) {
  var containerProps = _ref.containerProps,
      children = _ref.children;
  return /*#__PURE__*/_react["default"].createElement("div", containerProps, children);
};

var defaultTheme = {
  container: 'react-autowhatever__container',
  containerOpen: 'react-autowhatever__container--open',
  input: 'react-autowhatever__input',
  inputOpen: 'react-autowhatever__input--open',
  inputFocused: 'react-autowhatever__input--focused',
  itemsContainer: 'react-autowhatever__items-container',
  itemsContainerOpen: 'react-autowhatever__items-container--open',
  itemsList: 'react-autowhatever__items-list',
  item: 'react-autowhatever__item',
  itemFirst: 'react-autowhatever__item--first',
  itemHighlighted: 'react-autowhatever__item--highlighted',
  sectionContainer: 'react-autowhatever__section-container',
  sectionContainerFirst: 'react-autowhatever__section-container--first',
  sectionTitle: 'react-autowhatever__section-title'
};

var Autowhatever = /*#__PURE__*/function (_Component) {
  _inherits(Autowhatever, _Component);

  var _super = _createSuper(Autowhatever);

  function Autowhatever(props) {
    var _this;

    _classCallCheck(this, Autowhatever);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "storeInputReference", function (input) {
      if (input !== null) {
        _this.input = input;
      }

      var userRef = _this.props.inputProps.ref;

      if (userRef) {
        if (typeof userRef === 'function') {
          userRef(input);
        } else if (_typeof(userRef) === 'object' && Object.prototype.hasOwnProperty.call(userRef, 'current')) {
          userRef.current = input;
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "storeItemsContainerReference", function (itemsContainer) {
      if (itemsContainer !== null) {
        _this.itemsContainer = itemsContainer;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onHighlightedItemChange", function (highlightedItem) {
      _this.highlightedItem = highlightedItem;
    });

    _defineProperty(_assertThisInitialized(_this), "getItemId", function (sectionIndex, itemIndex) {
      if (itemIndex === null) {
        return null;
      }

      var id = _this.props.id;
      var section = sectionIndex === null ? '' : "section-".concat(sectionIndex);
      return "react-autowhatever-".concat(id, "-").concat(section, "-item-").concat(itemIndex);
    });

    _defineProperty(_assertThisInitialized(_this), "onFocus", function (event) {
      var inputProps = _this.props.inputProps;

      _this.setState({
        isInputFocused: true
      });

      inputProps.onFocus && inputProps.onFocus(event);
    });

    _defineProperty(_assertThisInitialized(_this), "onBlur", function (event) {
      var inputProps = _this.props.inputProps;

      _this.setState({
        isInputFocused: false
      });

      inputProps.onBlur && inputProps.onBlur(event);
    });

    _defineProperty(_assertThisInitialized(_this), "onKeyDown", function (event) {
      var _this$props = _this.props,
          inputProps = _this$props.inputProps,
          highlightedSectionIndex = _this$props.highlightedSectionIndex,
          highlightedItemIndex = _this$props.highlightedItemIndex;
      var keyCode = event.keyCode;

      switch (keyCode) {
        case 40: // ArrowDown

        case 38:
          {
            // ArrowUp
            var nextPrev = keyCode === 40 ? 'next' : 'prev';

            var _this$sectionIterator = _this.sectionIterator[nextPrev]([highlightedSectionIndex, highlightedItemIndex]),
                _this$sectionIterator2 = _slicedToArray(_this$sectionIterator, 2),
                newHighlightedSectionIndex = _this$sectionIterator2[0],
                newHighlightedItemIndex = _this$sectionIterator2[1];

            inputProps.onKeyDown(event, {
              newHighlightedSectionIndex: newHighlightedSectionIndex,
              newHighlightedItemIndex: newHighlightedItemIndex
            });
            break;
          }

        default:
          inputProps.onKeyDown(event, {
            highlightedSectionIndex: highlightedSectionIndex,
            highlightedItemIndex: highlightedItemIndex
          });
      }
    });

    _this.highlightedItem = null;
    _this.state = {
      isInputFocused: false
    };

    _this.setSectionsItems(props);

    _this.setSectionIterator(props);

    _this.setTheme(props);

    return _this;
  }

  _createClass(Autowhatever, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.ensureHighlightedItemIsVisible();
    } // eslint-disable-next-line camelcase, react/sort-comp

  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.items !== this.props.items) {
        this.setSectionsItems(nextProps);
      }

      if (nextProps.items !== this.props.items || nextProps.multiSection !== this.props.multiSection) {
        this.setSectionIterator(nextProps);
      }

      if (nextProps.theme !== this.props.theme) {
        this.setTheme(nextProps);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.ensureHighlightedItemIsVisible();
    }
  }, {
    key: "setSectionsItems",
    value: function setSectionsItems(props) {
      if (props.multiSection) {
        this.sectionsItems = props.items.map(function (section) {
          return props.getSectionItems(section);
        });
        this.sectionsLengths = this.sectionsItems.map(function (items) {
          return items.length;
        });
        this.allSectionsAreEmpty = this.sectionsLengths.every(function (itemsCount) {
          return itemsCount === 0;
        });
      }
    }
  }, {
    key: "setSectionIterator",
    value: function setSectionIterator(props) {
      this.sectionIterator = (0, _sectionIterator["default"])({
        multiSection: props.multiSection,
        data: props.multiSection ? this.sectionsLengths : props.items.length
      });
    }
  }, {
    key: "setTheme",
    value: function setTheme(props) {
      this.theme = (0, _reactThemeable["default"])(props.theme);
    }
  }, {
    key: "renderSections",
    value: function renderSections() {
      var _this2 = this;

      if (this.allSectionsAreEmpty) {
        return null;
      }

      var theme = this.theme;
      var _this$props2 = this.props,
          id = _this$props2.id,
          items = _this$props2.items,
          renderItem = _this$props2.renderItem,
          renderItemData = _this$props2.renderItemData,
          renderSectionTitle = _this$props2.renderSectionTitle,
          highlightedSectionIndex = _this$props2.highlightedSectionIndex,
          highlightedItemIndex = _this$props2.highlightedItemIndex,
          itemProps = _this$props2.itemProps;
      return items.map(function (section, sectionIndex) {
        var keyPrefix = "react-autowhatever-".concat(id, "-");
        var sectionKeyPrefix = "".concat(keyPrefix, "section-").concat(sectionIndex, "-");
        var isFirstSection = sectionIndex === 0; // `key` is provided by theme()

        /* eslint-disable react/jsx-key */

        return /*#__PURE__*/_react["default"].createElement("div", theme("".concat(sectionKeyPrefix, "container"), 'sectionContainer', isFirstSection && 'sectionContainerFirst'), /*#__PURE__*/_react["default"].createElement(_SectionTitle["default"], {
          section: section,
          renderSectionTitle: renderSectionTitle,
          theme: theme,
          sectionKeyPrefix: sectionKeyPrefix
        }), /*#__PURE__*/_react["default"].createElement(_ItemList["default"], {
          items: _this2.sectionsItems[sectionIndex],
          itemProps: itemProps,
          renderItem: renderItem,
          renderItemData: renderItemData,
          sectionIndex: sectionIndex,
          highlightedItemIndex: highlightedSectionIndex === sectionIndex ? highlightedItemIndex : null,
          onHighlightedItemChange: _this2.onHighlightedItemChange,
          getItemId: _this2.getItemId,
          theme: theme,
          keyPrefix: keyPrefix,
          ref: _this2.storeItemsListReference
        }));
        /* eslint-enable react/jsx-key */
      });
    }
  }, {
    key: "renderItems",
    value: function renderItems() {
      var items = this.props.items;

      if (items.length === 0) {
        return null;
      }

      var theme = this.theme;
      var _this$props3 = this.props,
          id = _this$props3.id,
          renderItem = _this$props3.renderItem,
          renderItemData = _this$props3.renderItemData,
          highlightedSectionIndex = _this$props3.highlightedSectionIndex,
          highlightedItemIndex = _this$props3.highlightedItemIndex,
          itemProps = _this$props3.itemProps;
      return /*#__PURE__*/_react["default"].createElement(_ItemList["default"], {
        items: items,
        itemProps: itemProps,
        renderItem: renderItem,
        renderItemData: renderItemData,
        highlightedItemIndex: highlightedSectionIndex === null ? highlightedItemIndex : null,
        onHighlightedItemChange: this.onHighlightedItemChange,
        getItemId: this.getItemId,
        theme: theme,
        keyPrefix: "react-autowhatever-".concat(id, "-")
      });
    }
  }, {
    key: "ensureHighlightedItemIsVisible",
    value: function ensureHighlightedItemIsVisible() {
      var highlightedItem = this.highlightedItem;

      if (!highlightedItem) {
        return;
      }

      var itemsContainer = this.itemsContainer;
      var itemOffsetRelativeToContainer = highlightedItem.offsetParent === itemsContainer ? highlightedItem.offsetTop : highlightedItem.offsetTop - itemsContainer.offsetTop;
      var scrollTop = itemsContainer.scrollTop; // Top of the visible area

      if (itemOffsetRelativeToContainer < scrollTop) {
        // Item is off the top of the visible area
        scrollTop = itemOffsetRelativeToContainer;
      } else if (itemOffsetRelativeToContainer + highlightedItem.offsetHeight > scrollTop + itemsContainer.offsetHeight) {
        // Item is off the bottom of the visible area
        scrollTop = itemOffsetRelativeToContainer + highlightedItem.offsetHeight - itemsContainer.offsetHeight;
      }

      if (scrollTop !== itemsContainer.scrollTop) {
        itemsContainer.scrollTop = scrollTop;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var theme = this.theme;
      var _this$props4 = this.props,
          id = _this$props4.id,
          multiSection = _this$props4.multiSection,
          renderInputComponent = _this$props4.renderInputComponent,
          renderItemsContainer = _this$props4.renderItemsContainer,
          highlightedSectionIndex = _this$props4.highlightedSectionIndex,
          highlightedItemIndex = _this$props4.highlightedItemIndex;
      var isInputFocused = this.state.isInputFocused;
      var renderedItems = multiSection ? this.renderSections() : this.renderItems();
      var isOpen = renderedItems !== null;
      var ariaActivedescendant = this.getItemId(highlightedSectionIndex, highlightedItemIndex);
      var itemsContainerId = "react-autowhatever-".concat(id);

      var containerProps = _objectSpread({
        role: 'combobox',
        'aria-haspopup': 'listbox',
        'aria-owns': itemsContainerId,
        'aria-expanded': isOpen
      }, theme("react-autowhatever-".concat(id, "-container"), 'container', isOpen && 'containerOpen'), {}, this.props.containerProps);

      var inputComponent = renderInputComponent(_objectSpread({
        type: 'text',
        value: '',
        autoComplete: 'off',
        'aria-autocomplete': 'list',
        'aria-controls': itemsContainerId,
        'aria-activedescendant': ariaActivedescendant
      }, theme("react-autowhatever-".concat(id, "-input"), 'input', isOpen && 'inputOpen', isInputFocused && 'inputFocused'), {}, this.props.inputProps, {
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        onKeyDown: this.props.inputProps.onKeyDown && this.onKeyDown,
        ref: this.storeInputReference
      }));
      var itemsContainer = renderItemsContainer({
        containerProps: _objectSpread({
          id: itemsContainerId,
          role: 'listbox'
        }, theme("react-autowhatever-".concat(id, "-items-container"), 'itemsContainer', isOpen && 'itemsContainerOpen'), {
          ref: this.storeItemsContainerReference
        }),
        children: renderedItems
      });
      return /*#__PURE__*/_react["default"].createElement("div", containerProps, inputComponent, itemsContainer);
    }
  }]);

  return Autowhatever;
}(_react.Component);

exports["default"] = Autowhatever;

_defineProperty(Autowhatever, "propTypes", {
  id: _propTypes["default"].string,
  // Used in aria-* attributes. If multiple Autowhatever's are rendered on a page, they must have unique ids.
  multiSection: _propTypes["default"].bool,
  // Indicates whether a multi section layout should be rendered.
  renderInputComponent: _propTypes["default"].func,
  // When specified, it is used to render the input element.
  renderItemsContainer: _propTypes["default"].func,
  // Renders the items container.
  items: _propTypes["default"].array.isRequired,
  // Array of items or sections to render.
  renderItem: _propTypes["default"].func,
  // This function renders a single item.
  renderItemData: _propTypes["default"].object,
  // Arbitrary data that will be passed to renderItem()
  renderSectionTitle: _propTypes["default"].func,
  // This function gets a section and renders its title.
  getSectionItems: _propTypes["default"].func,
  // This function gets a section and returns its items, which will be passed into `renderItem` for rendering.
  containerProps: _propTypes["default"].object,
  // Arbitrary container props
  inputProps: _propTypes["default"].object,
  // Arbitrary input props
  itemProps: _propTypes["default"].oneOfType([// Arbitrary item props
  _propTypes["default"].object, _propTypes["default"].func]),
  highlightedSectionIndex: _propTypes["default"].number,
  // Section index of the highlighted item
  highlightedItemIndex: _propTypes["default"].number,
  // Highlighted item index (within a section)
  theme: _propTypes["default"].oneOfType([// Styles. See: https://github.com/markdalgleish/react-themeable
  _propTypes["default"].object, _propTypes["default"].array])
});

_defineProperty(Autowhatever, "defaultProps", {
  id: '1',
  multiSection: false,
  renderInputComponent: defaultRenderInputComponent,
  renderItemsContainer: defaultRenderItemsContainer,
  renderItem: function renderItem() {
    throw new Error('`renderItem` must be provided');
  },
  renderItemData: emptyObject,
  renderSectionTitle: function renderSectionTitle() {
    throw new Error('`renderSectionTitle` must be provided');
  },
  getSectionItems: function getSectionItems() {
    throw new Error('`getSectionItems` must be provided');
  },
  containerProps: emptyObject,
  inputProps: emptyObject,
  itemProps: emptyObject,
  highlightedSectionIndex: null,
  highlightedItemIndex: null,
  theme: defaultTheme
});

/***/ }),

/***/ "../node_modules/react-autosuggest/dist/Item.js":
/*!******************************************************!*\
  !*** ../node_modules/react-autosuggest/dist/Item.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));

var _compareObjects = _interopRequireDefault(__webpack_require__(/*! ./compareObjects */ "../node_modules/react-autosuggest/dist/compareObjects.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Item = /*#__PURE__*/function (_Component) {
  _inherits(Item, _Component);

  var _super = _createSuper(Item);

  function Item() {
    var _this;

    _classCallCheck(this, Item);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "storeItemReference", function (item) {
      if (item !== null) {
        _this.item = item;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseEnter", function (event) {
      var _this$props = _this.props,
          sectionIndex = _this$props.sectionIndex,
          itemIndex = _this$props.itemIndex;

      _this.props.onMouseEnter(event, {
        sectionIndex: sectionIndex,
        itemIndex: itemIndex
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseLeave", function (event) {
      var _this$props2 = _this.props,
          sectionIndex = _this$props2.sectionIndex,
          itemIndex = _this$props2.itemIndex;

      _this.props.onMouseLeave(event, {
        sectionIndex: sectionIndex,
        itemIndex: itemIndex
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseDown", function (event) {
      var _this$props3 = _this.props,
          sectionIndex = _this$props3.sectionIndex,
          itemIndex = _this$props3.itemIndex;

      _this.props.onMouseDown(event, {
        sectionIndex: sectionIndex,
        itemIndex: itemIndex
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onClick", function (event) {
      var _this$props4 = _this.props,
          sectionIndex = _this$props4.sectionIndex,
          itemIndex = _this$props4.itemIndex;

      _this.props.onClick(event, {
        sectionIndex: sectionIndex,
        itemIndex: itemIndex
      });
    });

    return _this;
  }

  _createClass(Item, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return (0, _compareObjects["default"])(nextProps, this.props, ['renderItemData']);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          isHighlighted = _this$props5.isHighlighted,
          item = _this$props5.item,
          renderItem = _this$props5.renderItem,
          renderItemData = _this$props5.renderItemData,
          restProps = _objectWithoutProperties(_this$props5, ["isHighlighted", "item", "renderItem", "renderItemData"]);

      delete restProps.sectionIndex;
      delete restProps.itemIndex;

      if (typeof restProps.onMouseEnter === 'function') {
        restProps.onMouseEnter = this.onMouseEnter;
      }

      if (typeof restProps.onMouseLeave === 'function') {
        restProps.onMouseLeave = this.onMouseLeave;
      }

      if (typeof restProps.onMouseDown === 'function') {
        restProps.onMouseDown = this.onMouseDown;
      }

      if (typeof restProps.onClick === 'function') {
        restProps.onClick = this.onClick;
      }

      return /*#__PURE__*/_react["default"].createElement("li", _extends({
        role: "option"
      }, restProps, {
        ref: this.storeItemReference
      }), renderItem(item, _objectSpread({
        isHighlighted: isHighlighted
      }, renderItemData)));
    }
  }]);

  return Item;
}(_react.Component);

exports["default"] = Item;

_defineProperty(Item, "propTypes", {
  sectionIndex: _propTypes["default"].number,
  isHighlighted: _propTypes["default"].bool.isRequired,
  itemIndex: _propTypes["default"].number.isRequired,
  item: _propTypes["default"].any.isRequired,
  renderItem: _propTypes["default"].func.isRequired,
  renderItemData: _propTypes["default"].object.isRequired,
  onMouseEnter: _propTypes["default"].func,
  onMouseLeave: _propTypes["default"].func,
  onMouseDown: _propTypes["default"].func,
  onClick: _propTypes["default"].func
});

/***/ }),

/***/ "../node_modules/react-autosuggest/dist/ItemList.js":
/*!**********************************************************!*\
  !*** ../node_modules/react-autosuggest/dist/ItemList.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));

var _Item = _interopRequireDefault(__webpack_require__(/*! ./Item */ "../node_modules/react-autosuggest/dist/Item.js"));

var _compareObjects = _interopRequireDefault(__webpack_require__(/*! ./compareObjects */ "../node_modules/react-autosuggest/dist/compareObjects.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ItemsList = /*#__PURE__*/function (_Component) {
  _inherits(ItemsList, _Component);

  var _super = _createSuper(ItemsList);

  function ItemsList() {
    var _this;

    _classCallCheck(this, ItemsList);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "storeHighlightedItemReference", function (highlightedItem) {
      _this.props.onHighlightedItemChange(highlightedItem === null ? null : highlightedItem.item);
    });

    return _this;
  }

  _createClass(ItemsList, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return (0, _compareObjects["default"])(nextProps, this.props, ['itemProps']);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          items = _this$props.items,
          itemProps = _this$props.itemProps,
          renderItem = _this$props.renderItem,
          renderItemData = _this$props.renderItemData,
          sectionIndex = _this$props.sectionIndex,
          highlightedItemIndex = _this$props.highlightedItemIndex,
          getItemId = _this$props.getItemId,
          theme = _this$props.theme,
          keyPrefix = _this$props.keyPrefix;
      var sectionPrefix = sectionIndex === null ? keyPrefix : "".concat(keyPrefix, "section-").concat(sectionIndex, "-");
      var isItemPropsFunction = typeof itemProps === 'function';
      return /*#__PURE__*/_react["default"].createElement("ul", _extends({
        role: "listbox"
      }, theme("".concat(sectionPrefix, "items-list"), 'itemsList')), items.map(function (item, itemIndex) {
        var isFirst = itemIndex === 0;
        var isHighlighted = itemIndex === highlightedItemIndex;
        var itemKey = "".concat(sectionPrefix, "item-").concat(itemIndex);
        var itemPropsObj = isItemPropsFunction ? itemProps({
          sectionIndex: sectionIndex,
          itemIndex: itemIndex
        }) : itemProps;

        var allItemProps = _objectSpread({
          id: getItemId(sectionIndex, itemIndex),
          'aria-selected': isHighlighted
        }, theme(itemKey, 'item', isFirst && 'itemFirst', isHighlighted && 'itemHighlighted'), {}, itemPropsObj);

        if (isHighlighted) {
          allItemProps.ref = _this2.storeHighlightedItemReference;
        } // `key` is provided by theme()

        /* eslint-disable react/jsx-key */


        return /*#__PURE__*/_react["default"].createElement(_Item["default"], _extends({}, allItemProps, {
          sectionIndex: sectionIndex,
          isHighlighted: isHighlighted,
          itemIndex: itemIndex,
          item: item,
          renderItem: renderItem,
          renderItemData: renderItemData
        }));
        /* eslint-enable react/jsx-key */
      }));
    }
  }]);

  return ItemsList;
}(_react.Component);

exports["default"] = ItemsList;

_defineProperty(ItemsList, "propTypes", {
  items: _propTypes["default"].array.isRequired,
  itemProps: _propTypes["default"].oneOfType([_propTypes["default"].object, _propTypes["default"].func]),
  renderItem: _propTypes["default"].func.isRequired,
  renderItemData: _propTypes["default"].object.isRequired,
  sectionIndex: _propTypes["default"].number,
  highlightedItemIndex: _propTypes["default"].number,
  onHighlightedItemChange: _propTypes["default"].func.isRequired,
  getItemId: _propTypes["default"].func.isRequired,
  theme: _propTypes["default"].func.isRequired,
  keyPrefix: _propTypes["default"].string.isRequired
});

_defineProperty(ItemsList, "defaultProps", {
  sectionIndex: null
});

/***/ }),

/***/ "../node_modules/react-autosuggest/dist/SectionTitle.js":
/*!**************************************************************!*\
  !*** ../node_modules/react-autosuggest/dist/SectionTitle.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../node_modules/prop-types/index.js"));

var _compareObjects = _interopRequireDefault(__webpack_require__(/*! ./compareObjects */ "../node_modules/react-autosuggest/dist/compareObjects.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SectionTitle = /*#__PURE__*/function (_Component) {
  _inherits(SectionTitle, _Component);

  var _super = _createSuper(SectionTitle);

  function SectionTitle() {
    _classCallCheck(this, SectionTitle);

    return _super.apply(this, arguments);
  }

  _createClass(SectionTitle, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return (0, _compareObjects["default"])(nextProps, this.props);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          section = _this$props.section,
          renderSectionTitle = _this$props.renderSectionTitle,
          theme = _this$props.theme,
          sectionKeyPrefix = _this$props.sectionKeyPrefix;
      var sectionTitle = renderSectionTitle(section);

      if (!sectionTitle) {
        return null;
      }

      return /*#__PURE__*/_react["default"].createElement("div", theme("".concat(sectionKeyPrefix, "title"), 'sectionTitle'), sectionTitle);
    }
  }]);

  return SectionTitle;
}(_react.Component);

exports["default"] = SectionTitle;

_defineProperty(SectionTitle, "propTypes", {
  section: _propTypes["default"].any.isRequired,
  renderSectionTitle: _propTypes["default"].func.isRequired,
  theme: _propTypes["default"].func.isRequired,
  sectionKeyPrefix: _propTypes["default"].string.isRequired
});

/***/ }),

/***/ "../node_modules/react-autosuggest/dist/compareObjects.js":
/*!****************************************************************!*\
  !*** ../node_modules/react-autosuggest/dist/compareObjects.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = compareObjects;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function compareObjects(objA, objB) {
  var keys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (objA === objB) {
    return false;
  }

  var aKeys = Object.keys(objA);
  var bKeys = Object.keys(objB);

  if (aKeys.length !== bKeys.length) {
    return true;
  }

  var keysMap = {};
  var i, len;

  for (i = 0, len = keys.length; i < len; i++) {
    keysMap[keys[i]] = true;
  }

  for (i = 0, len = aKeys.length; i < len; i++) {
    var key = aKeys[i];
    var aValue = objA[key];
    var bValue = objB[key];

    if (aValue === bValue) {
      continue;
    }

    if (!keysMap[key] || aValue === null || bValue === null || _typeof(aValue) !== 'object' || _typeof(bValue) !== 'object') {
      return true;
    }

    var aValueKeys = Object.keys(aValue);
    var bValueKeys = Object.keys(bValue);

    if (aValueKeys.length !== bValueKeys.length) {
      return true;
    }

    for (var n = 0, length = aValueKeys.length; n < length; n++) {
      var aValueKey = aValueKeys[n];

      if (aValue[aValueKey] !== bValue[aValueKey]) {
        return true;
      }
    }
  }

  return false;
}

/***/ }),

/***/ "../node_modules/react-autosuggest/dist/index.js":
/*!*******************************************************!*\
  !*** ../node_modules/react-autosuggest/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(/*! ./Autosuggest */ "../node_modules/react-autosuggest/dist/Autosuggest.js")["default"];

/***/ }),

/***/ "../node_modules/react-autosuggest/dist/theme.js":
/*!*******************************************************!*\
  !*** ../node_modules/react-autosuggest/dist/theme.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapToAutowhateverTheme = exports.defaultTheme = void 0;
var defaultTheme = {
  container: 'react-autosuggest__container',
  containerOpen: 'react-autosuggest__container--open',
  input: 'react-autosuggest__input',
  inputOpen: 'react-autosuggest__input--open',
  inputFocused: 'react-autosuggest__input--focused',
  suggestionsContainer: 'react-autosuggest__suggestions-container',
  suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
  suggestionsList: 'react-autosuggest__suggestions-list',
  suggestion: 'react-autosuggest__suggestion',
  suggestionFirst: 'react-autosuggest__suggestion--first',
  suggestionHighlighted: 'react-autosuggest__suggestion--highlighted',
  sectionContainer: 'react-autosuggest__section-container',
  sectionContainerFirst: 'react-autosuggest__section-container--first',
  sectionTitle: 'react-autosuggest__section-title'
};
exports.defaultTheme = defaultTheme;

var mapToAutowhateverTheme = function mapToAutowhateverTheme(theme) {
  var result = {};

  for (var key in theme) {
    switch (key) {
      case 'suggestionsContainer':
        result['itemsContainer'] = theme[key];
        break;

      case 'suggestionsContainerOpen':
        result['itemsContainerOpen'] = theme[key];
        break;

      case 'suggestion':
        result['item'] = theme[key];
        break;

      case 'suggestionFirst':
        result['itemFirst'] = theme[key];
        break;

      case 'suggestionHighlighted':
        result['itemHighlighted'] = theme[key];
        break;

      case 'suggestionsList':
        result['itemsList'] = theme[key];
        break;

      default:
        result[key] = theme[key];
    }
  }

  return result;
};

exports.mapToAutowhateverTheme = mapToAutowhateverTheme;

/***/ }),

/***/ "../node_modules/react-is/cjs/react-is.development.js":
/*!************************************************************!*\
  !*** ../node_modules/react-is/cjs/react-is.development.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}


/***/ }),

/***/ "../node_modules/react-is/index.js":
/*!*****************************************!*\
  !*** ../node_modules/react-is/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {} else {
  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ "../node_modules/react-is/cjs/react-is.development.js");
}


/***/ }),

/***/ "../node_modules/react-themeable/dist/index.js":
/*!*****************************************************!*\
  !*** ../node_modules/react-themeable/dist/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _objectAssign = __webpack_require__(/*! object-assign */ "../node_modules/react-themeable/node_modules/object-assign/index.js");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var truthy = function truthy(x) {
  return x;
};

exports['default'] = function (input) {
  var _ref = Array.isArray(input) && input.length === 2 ? input : [input, null];

  var _ref2 = _slicedToArray(_ref, 2);

  var theme = _ref2[0];
  var classNameDecorator = _ref2[1];

  return function (key) {
    for (var _len = arguments.length, names = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      names[_key - 1] = arguments[_key];
    }

    var styles = names.map(function (name) {
      return theme[name];
    }).filter(truthy);

    return typeof styles[0] === 'string' || typeof classNameDecorator === 'function' ? { key: key, className: classNameDecorator ? classNameDecorator.apply(undefined, _toConsumableArray(styles)) : styles.join(' ') } : { key: key, style: _objectAssign2['default'].apply(undefined, [{}].concat(_toConsumableArray(styles))) };
  };
};

module.exports = exports['default'];

/***/ }),

/***/ "../node_modules/react-themeable/node_modules/object-assign/index.js":
/*!***************************************************************************!*\
  !*** ../node_modules/react-themeable/node_modules/object-assign/index.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function ownEnumerableKeys(obj) {
	var keys = Object.getOwnPropertyNames(obj);

	if (Object.getOwnPropertySymbols) {
		keys = keys.concat(Object.getOwnPropertySymbols(obj));
	}

	return keys.filter(function (key) {
		return propIsEnumerable.call(obj, key);
	});
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = ownEnumerableKeys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};


/***/ }),

/***/ "../node_modules/section-iterator/dist/index.js":
/*!******************************************************!*\
  !*** ../node_modules/section-iterator/dist/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

module.exports = function (_ref) {
  var data = _ref.data;
  var multiSection = _ref.multiSection;

  function nextNonEmptySectionIndex(sectionIndex) {
    if (sectionIndex === null) {
      sectionIndex = 0;
    } else {
      sectionIndex++;
    }

    while (sectionIndex < data.length && data[sectionIndex] === 0) {
      sectionIndex++;
    }

    return sectionIndex === data.length ? null : sectionIndex;
  }

  function prevNonEmptySectionIndex(sectionIndex) {
    if (sectionIndex === null) {
      sectionIndex = data.length - 1;
    } else {
      sectionIndex--;
    }

    while (sectionIndex >= 0 && data[sectionIndex] === 0) {
      sectionIndex--;
    }

    return sectionIndex === -1 ? null : sectionIndex;
  }

  function next(position) {
    var _position = _slicedToArray(position, 2);

    var sectionIndex = _position[0];
    var itemIndex = _position[1];


    if (multiSection) {
      if (itemIndex === null || itemIndex === data[sectionIndex] - 1) {
        sectionIndex = nextNonEmptySectionIndex(sectionIndex);

        if (sectionIndex === null) {
          return [null, null];
        }

        return [sectionIndex, 0];
      }

      return [sectionIndex, itemIndex + 1];
    }

    if (data === 0 || itemIndex === data - 1) {
      return [null, null];
    }

    if (itemIndex === null) {
      return [null, 0];
    }

    return [null, itemIndex + 1];
  }

  function prev(position) {
    var _position2 = _slicedToArray(position, 2);

    var sectionIndex = _position2[0];
    var itemIndex = _position2[1];


    if (multiSection) {
      if (itemIndex === null || itemIndex === 0) {
        sectionIndex = prevNonEmptySectionIndex(sectionIndex);

        if (sectionIndex === null) {
          return [null, null];
        }

        return [sectionIndex, data[sectionIndex] - 1];
      }

      return [sectionIndex, itemIndex - 1];
    }

    if (data === 0 || itemIndex === 0) {
      return [null, null];
    }

    if (itemIndex === null) {
      return [null, data - 1];
    }

    return [null, itemIndex - 1];
  }

  function isLast(position) {
    return next(position)[1] === null;
  }

  return {
    next: next,
    prev: prev,
    isLast: isLast
  };
};


/***/ }),

/***/ "../node_modules/shallow-equal/arrays/index.js":
/*!*****************************************************!*\
  !*** ../node_modules/shallow-equal/arrays/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function shallowEqualArrays(arrA, arrB) {
  if (arrA === arrB) {
    return true;
  }

  if (!arrA || !arrB) {
    return false;
  }

  var len = arrA.length;

  if (arrB.length !== len) {
    return false;
  }

  for (var i = 0; i < len; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }

  return true;
}

module.exports = shallowEqualArrays;


/***/ }),

/***/ "../node_modules/tslib/tslib.es6.js":
/*!******************************************!*\
  !*** ../node_modules/tslib/tslib.es6.js ***!
  \******************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__createBinding", function() { return __createBinding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ "./ServiceDependencyGraphPanel.tsx":
/*!*****************************************!*\
  !*** ./ServiceDependencyGraphPanel.tsx ***!
  \*****************************************/
/*! exports provided: ServiceDependencyGraphPanel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServiceDependencyGraphPanel", function() { return ServiceDependencyGraphPanel; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);




var ServiceDependencyGraphPanel =
/** @class */
function (_super) {
  Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(ServiceDependencyGraphPanel, _super);

  function ServiceDependencyGraphPanel() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  ServiceDependencyGraphPanel.prototype.getColumnNames = function () {
    /*if (data) {
      return sortBy(this.props..series[0].fields.map((field: any) => field));
    }*/
    console.log(this.props.data.series[0].fields);
    return [];
  };

  ServiceDependencyGraphPanel.prototype.render = function () {
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h1", null, " HI!"));
  };

  return ServiceDependencyGraphPanel;
}(react__WEBPACK_IMPORTED_MODULE_1__["PureComponent"]);



/***/ }),

/***/ "./module.ts":
/*!*******************!*\
  !*** ./module.ts ***!
  \*******************/
/*! exports provided: plugin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "plugin", function() { return plugin; });
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @grafana/data */ "@grafana/data");
/* harmony import */ var _grafana_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_grafana_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ServiceDependencyGraphPanel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ServiceDependencyGraphPanel */ "./ServiceDependencyGraphPanel.tsx");
/* harmony import */ var _options_TypeaheadTextfield__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./options/TypeaheadTextfield */ "./options/TypeaheadTextfield.tsx");
/* harmony import */ var options_serviceIconMapping_ServiceIconMapping__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! options/serviceIconMapping/ServiceIconMapping */ "./options/serviceIconMapping/ServiceIconMapping.tsx");



 //import { ExternalIconMapping } from 'options/externalIconMapping/ExternalIconMapping';

var plugin = new _grafana_data__WEBPACK_IMPORTED_MODULE_0__["PanelPlugin"](_ServiceDependencyGraphPanel__WEBPACK_IMPORTED_MODULE_1__["ServiceDependencyGraphPanel"]).setPanelOptions(function (builder) {
  return builder //Connection Mapping
  .addCustomEditor({
    path: 'dataMapping.sourceComponentPrefix',
    id: 'sourceComponentPrefix',
    editor: _options_TypeaheadTextfield__WEBPACK_IMPORTED_MODULE_2__["TypeaheadTextField"],
    name: 'Source Component Column Prefix',
    category: ['Connection Mapping']
  }).addCustomEditor({
    path: 'dataMapping.targetComponentPrefix',
    id: 'targetComponentPrefix',
    name: 'Target Component Column Prefix',
    category: ['Connection Mapping'],
    editor: _options_TypeaheadTextfield__WEBPACK_IMPORTED_MODULE_2__["TypeaheadTextField"]
  }).addCustomEditor({
    path: 'dataMapping.type',
    id: 'type',
    name: 'Type',
    category: ['Connection Mapping'],
    editor: _options_TypeaheadTextfield__WEBPACK_IMPORTED_MODULE_2__["TypeaheadTextField"]
  }).addCustomEditor({
    path: 'dataMapping.extOrigin',
    id: 'externalOrigin',
    name: 'External Origin',
    category: ['Connection Mapping'],
    editor: _options_TypeaheadTextfield__WEBPACK_IMPORTED_MODULE_2__["TypeaheadTextField"]
  }).addCustomEditor({
    path: 'dataMapping.extTarget',
    id: 'externalTarget',
    name: 'External Target',
    category: ['Connection Mapping'],
    editor: _options_TypeaheadTextfield__WEBPACK_IMPORTED_MODULE_2__["TypeaheadTextField"]
  }) //Data Mapping
  .addCustomEditor({
    id: 'responseTime',
    path: 'dataMapping.responseTimeColumn',
    name: 'Response Time Column',
    editor: _options_TypeaheadTextfield__WEBPACK_IMPORTED_MODULE_2__["TypeaheadTextField"],
    category: ['Data Mapping']
  }).addCustomEditor({
    id: 'requestRateColumn',
    path: 'dataMapping.requestRateColumn',
    name: 'Request Rate Column',
    editor: _options_TypeaheadTextfield__WEBPACK_IMPORTED_MODULE_2__["TypeaheadTextField"],
    category: ['Data Mapping']
  }).addCustomEditor({
    id: 'errorRateColumn',
    path: 'dataMapping.errorRateColumn',
    name: 'Error Rate Column',
    editor: _options_TypeaheadTextfield__WEBPACK_IMPORTED_MODULE_2__["TypeaheadTextField"],
    category: ['Data Mapping']
  }).addCustomEditor({
    id: 'responseTimeOutgoingColumn',
    path: 'dataMapping.responseTimeOutgoingColumn',
    name: 'Response Time Column (Outgoing)',
    editor: _options_TypeaheadTextfield__WEBPACK_IMPORTED_MODULE_2__["TypeaheadTextField"],
    category: ['Data Mapping']
  }).addCustomEditor({
    id: 'requestRateOutgoingColumn',
    path: 'dataMapping.requestRateOutgoingColumn',
    name: 'Request Rate Column (Outgoing)',
    editor: _options_TypeaheadTextfield__WEBPACK_IMPORTED_MODULE_2__["TypeaheadTextField"],
    category: ['Data Mapping']
  }).addCustomEditor({
    id: 'errorRateOutgoingColumn',
    path: 'dataMapping.errorRateOutgoingColumn',
    name: 'Error Rate Column (Outgoing)',
    editor: _options_TypeaheadTextfield__WEBPACK_IMPORTED_MODULE_2__["TypeaheadTextField"],
    category: ['Data Mapping']
  }).addCustomEditor({
    id: 'baselineRtUpper',
    path: 'dataMapping.baselineRtUpper',
    name: 'Response Time Baseline (Upper)',
    editor: _options_TypeaheadTextfield__WEBPACK_IMPORTED_MODULE_2__["TypeaheadTextField"],
    category: ['Data Mapping']
  }) //General Settings
  .addBooleanSwitch({
    path: 'showConnectionStats',
    description: "This is a field you can use!",
    name: 'Show Connection Statistics',
    category: ['General Settings']
  }).addBooleanSwitch({
    path: 'sumTimings',
    name: 'Handle Timings as Sums',
    category: ['General Settings']
  }).addBooleanSwitch({
    path: 'filterEmptyConnections',
    name: 'Filter Empty Data',
    category: ['General Settings']
  }).addBooleanSwitch({
    path: 'showDebugInformation',
    name: 'Show Debug Information',
    category: ['General Settings']
  }).addBooleanSwitch({
    path: 'showDummyData',
    name: 'Show Dummy Data',
    category: ['General Settings']
  }).addBooleanSwitch({
    path: 'showBaselines',
    name: 'Show Baselines',
    category: ['General Settings']
  }) //Appearance
  .addColorPicker({
    path: 'style.healthyColor',
    name: 'Healthy Color',
    category: ['Appearance'],
    defaultValue: "rgb(87, 148, 242)"
  }).addColorPicker({
    path: 'style.dangerColor',
    name: 'Danger Color',
    category: ['Appearance'],
    defaultValue: "#C4162A"
  }).addColorPicker({
    path: 'style.noDataColor',
    name: 'No Data Color',
    category: ['Appearance'],
    defaultValue: "rgb(123, 123, 138)"
  }) //Service Icon Mapping
  .addCustomEditor({
    path: 'adws',
    id: 'serviceIconMapping',
    editor: options_serviceIconMapping_ServiceIconMapping__WEBPACK_IMPORTED_MODULE_3__["ServiceIconMapping"],
    name: '',
    category: ['Service Icon Mapping']
  }) // External Service Icon Mapping
  //Tracing Drilldown  
  .addTextInput({
    path: 'drillDownLink',
    name: 'Backend URL',
    category: ['Tracing Drilldown']
  });
});

/***/ }),

/***/ "./options/TypeaheadTextfield.tsx":
/*!****************************************!*\
  !*** ./options/TypeaheadTextfield.tsx ***!
  \****************************************/
/*! exports provided: TypeaheadTextField */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TypeaheadTextField", function() { return TypeaheadTextField; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_autosuggest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-autosuggest */ "../node_modules/react-autosuggest/dist/index.js");
/* harmony import */ var react_autosuggest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_autosuggest__WEBPACK_IMPORTED_MODULE_2__);




var TypeaheadTextField =
/** @class */
function (_super) {
  Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(TypeaheadTextField, _super);

  function TypeaheadTextField() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.onSuggestionsClearRequested = function () {
      _this.setState({
        suggestions: []
      });
    };

    return _this;
  }

  TypeaheadTextField.prototype.renderSuggestion = function (suggestion) {
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, suggestion);
  };

  TypeaheadTextField.prototype.getColumns = function () {
    return ["a", "b", "c"];
  };

  TypeaheadTextField.prototype.onChange = function () {
    console.log("change");
  };

  TypeaheadTextField.prototype.getSuggestions = function (value) {
    var inputValue = value.trim().toLowerCase();
    var inputLength = inputValue.length;
    return inputLength === 0 ? [] : this.getColumns().filter(function (column) {
      return column.toLowerCase().slice(0, inputLength) === inputValue;
    });
  };

  ;

  TypeaheadTextField.prototype.onSuggestionsFetchRequested = function (value) {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  ;

  TypeaheadTextField.prototype.getSuggestionValue = function (suggestion) {
    return suggestion;
  };

  TypeaheadTextField.prototype.render = function () {
    var value = "a";
    var suggestions = this.getSuggestions(value);
    var inputProps = {
      placeholder: 'Type a programming language',
      value: value,
      onChange: this.onChange
    };
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_autosuggest__WEBPACK_IMPORTED_MODULE_2___default.a, {
      suggestions: suggestions,
      onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.onSuggestionsClearRequested,
      getSuggestionValue: this.getSuggestionValue,
      renderSuggestion: this.renderSuggestion,
      inputProps: inputProps
    });
  };

  return TypeaheadTextField;
}(react__WEBPACK_IMPORTED_MODULE_1___default.a.PureComponent);


/*
import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { PanelSettings } from '../types';
import Autosuggest from 'react-autosuggest';

interface Props extends StandardEditorProps<string, PanelSettings> {}

export const TypeaheadTextfield: React.FC<Props> = ({ item, value, onChange, context }) => {
    const test = ["a","b","c"]
    return (
        <div className="gf-form">
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
      />
        </div>
    )
}

function handle(a: any, onChange: any, value: any, context:any, item: any) {
    console.log(context)
    console.log(item)
    console.log(value)
    console.log(a)
    onChange.call(a)
}

const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0 ? [] : languages.filter((lang: { name: string; }) =>
      lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );*/

/***/ }),

/***/ "./options/serviceIconMapping/ServiceIconMapping.tsx":
/*!***********************************************************!*\
  !*** ./options/serviceIconMapping/ServiceIconMapping.tsx ***!
  \***********************************************************/
/*! exports provided: ServiceIconMapping */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServiceIconMapping", function() { return ServiceIconMapping; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);




function addMapping(context, onChange) {
  context.options.serviceIcons.push({
    pattern: 'my-type',
    filename: 'default'
  });
}

function removeMapping(context, index, onChange) {
  Object(lodash__WEBPACK_IMPORTED_MODULE_2__["remove"])(context.options.serviceIcons, function (n) {
    return context.options.serviceIcons.indexOf(n) == index;
  });
}

function setPatternValue(context, event, index, onChange) {
  context.options.serviceIcons[index].pattern = event.currentTarget.value;
}

var ServiceIconMapping = function ServiceIconMapping(_a) {
  var e_1, _b;

  var item = _a.item,
      value = _a.value,
      _onChange = _a.onChange,
      context = _a.context;

  if (!value || value === undefined) {
    context.options.serviceIcons = [{
      pattern: 'my-type',
      filename: 'default'
    }];
  }

  var componentList = [];

  var _loop_1 = function _loop_1(index) {
    componentList.push(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "gf-form"
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("input", {
      type: "text",
      className: "input-small gf-form-input width-10",
      defaultValue: context.options.serviceIcons[index].pattern,
      onChange: function onChange(e) {
        return setPatternValue(context, e, index, _onChange(context.options.serviceIcons));
      }
    }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("select", {
      className: "input-small gf-form-input width-10",
      defaultValue: context.options.serviceIcons[index].fileName
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("option", {
      "ng-repeat": "variable in editor.getServiceIconOptions()",
      value: "{{variable}}"
    })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("a", {
      className: "gf-form-label tight-form-func",
      onClick: function onClick(e) {
        return removeMapping(context, index, _onChange());
      }
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("i", {
      className: "fa fa-trash"
    })))));
  };

  try {
    for (var _c = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(context.options.serviceIcons.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
      var _e = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__read"])(_d.value, 1),
          index = _e[0];

      _loop_1(index);
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (_d && !_d.done && (_b = _c["return"])) _b.call(_c);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "gf-form-inline"
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "gf-form"
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("label", {
    className: "gf-form-label width-10"
  }, "Target Name (RegEx)"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("label", {
    className: "gf-form-label width-10"
  }, "Icon"))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, componentList), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("button", {
    className: "btn navbar-button navbar-button--primary",
    onClick: function onClick(e) {
      return addMapping(context, _onChange());
    }
  }, "Add Service Icon Mapping"));
};

/***/ }),

/***/ "@grafana/data":
/*!********************************!*\
  !*** external "@grafana/data" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__grafana_data__;

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_lodash__;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_react__;

/***/ })

/******/ })});;
//# sourceMappingURL=module.js.map