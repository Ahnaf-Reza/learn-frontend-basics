/**
 * 1. Deep Clone
 * - Recursively copy objects/arrays.
 * - Handle Date, RegExp, Map, Set.
 * - Handle Circular References using a WeakMap.
 */
function deepClone(obj, cache = new WeakMap()) {
  
  if (obj === null || typeof obj !== "object") return obj; 

  if (cache.has(obj)) return cache.get(obj);

  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  

  const clone = Array.isArray(obj) ? [] : {};

  cache.set(obj, clone);

  Object.keys(obj).forEach((key) => {
    clone[key] = deepClone(obj[key], cache);
  });

  return clone;

}

/**
 * 2. Array Polyfills
 * Extend Array.prototype with customMap, customFilter, customReduce.
 */

// Function to attach polyfills (run this in your test setup or at start)
function attachPolyfills() {
  if (!Array.prototype.customMap) {
    Array.prototype.customMap = function (callback, thisArg) {
      const result = new Array(this.length);

      for (let i = 0; i < this.length; i++) {
        if (i in this) {
          result[i] = callback.call(thisArg, this[i], i, this);
        } 
      }
      return result;
    };
  }

  if (!Array.prototype.customFilter) {
    Array.prototype.customFilter = function (callback) {
      const result = [];

      for (let i = 0; i < this.length; i++) {
        if (i in this) {
          if (callback(this[i], i, this)) {
            result.push(this[i]);
          }
        }
      }
      return result;
    };
  }

  if (!Array.prototype.customReduce) {
    Array.prototype.customReduce = function (callback, initialValue) {
      let accumulator;
      let startIndex = 0;

      if (arguments.length > 1) {
        accumulator = initialValue;
      } else {
        let found = false;
        for (let i = 0; i < this.length; i++) {
          if (i in this) {
            accumulator = this[i];
            startIndex = i + 1;
            found = true;
            break;
          }
        }

        if (!found) {
          throw new TypeError("Empty Array");
        }
      }

      for (let i = startIndex; i < this.length; i++) {
        if (i in this) {
          accumulator = callback(accumulator, this[i], i, this);
        }
      }
      return accumulator;
    };
  }
}
  
    
  

/**
 * 3. Parasitic Combination Inheritance
 * Sets up the prototype chain so that:
 * Child.prototype.__proto__ === Parent.prototype
 */
function parasiticInherit(childCtor, parentCtor) {
  childCtor.prototype = Object.create(parentCtor.prototype);
  childCtor.prototype.constructor = childCtor;
}

module.exports = { deepClone, attachPolyfills, parasiticInherit };
