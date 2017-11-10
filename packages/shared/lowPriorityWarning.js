/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

// 低优先级的警告，当条件不成立是错误会被console.warn，而不像invariant一样被直接抛出
var lowPriorityWarning = function() {};

if (__DEV__) {
  /**
   * 正则打印warning
   * @param format
   * @param args
   */
  const printWarning = function(format, ...args) {
    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, () => args[argIndex++]);
    if (typeof console !== 'undefined') {
      console.warn(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack 这个错误是为了方便使用而抛出的，因此可以使用这个栈。
      // to find the callsite that caused this warning to fire. 找到引起这个warning的调用位置
      // TODO 这句话不是很理解
      throw new Error(message);
    } catch (x) {}
  };

  lowPriorityWarning = function(condition, format, ...args) {
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
          'message argument',
      );
    }
    if (!condition) {
      printWarning(format, ...args);
    }
  };
}

export default lowPriorityWarning;
