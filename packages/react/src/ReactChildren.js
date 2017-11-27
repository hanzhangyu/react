/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import emptyFunction from 'fbjs/lib/emptyFunction';
import invariant from 'fbjs/lib/invariant';
import warning from 'fbjs/lib/warning';

import {isValidElement, cloneAndReplaceKey} from './ReactElement';
import ReactDebugCurrentFrame from './ReactDebugCurrentFrame';

var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator; // 默认的迭代器，Set为values,Map为entries
var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec. // faux(人工的)，那些自定义的遍历数据结构
// The Symbol used to tag the ReactElement type. If there is no native Symbol
// nor(也不) polyfill, then a plain(普通的) number is used for performance(性能).
// 为什么这个也要到处贴而不是使用module
var REACT_ELEMENT_TYPE =
  (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) ||
  0xeac7;
// 此处只作验证是否合法的元素用
const REACT_PORTAL_TYPE =
  (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.portal')) ||
  0xeaca;
var SEPARATOR = '.'; // 分离器
var SUBSEPARATOR = ':'; // 子分离器，这个是用作多维数组遍历是的子数组，[[]]

/**
 * Escape and wrap key so it is safe to use as a reactid
 * 修改成可以安全使用的reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */
function escape(key) {
  var escapeRegex = /[=:]/g;
  // ？ 一直格式化的映射关系，暂时还是我还没有遇到过需要转化的情况，有时间研究研究
  var escaperLookup = {
    '=': '=0',
    ':': '=2',
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var didWarnAboutMaps = false;

// 修改使用者提供的KEY
var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

// ？TODO 测试生成对象的速度并设置初始值的效率很低
var POOL_SIZE = 10; // 最多缓存10个遍历上下文环境
var traverseContextPool = []; // 遍历上下文池，缓存用过的并且释放属性值的context对象
// 获取合并(pooled，我觉得应该是一个组合的对象的意思)遍历的上下文
function getPooledTraverseContext(mapResult,
                                  keyPrefix,
                                  mapFunction,
                                  mapContext,) {
  // 如果有缓存的数据对象，则使用缓存对象
  if (traverseContextPool.length) {
    var traverseContext = traverseContextPool.pop();
    traverseContext.result = mapResult;
    traverseContext.keyPrefix = keyPrefix;
    traverseContext.func = mapFunction;
    traverseContext.context = mapContext;
    traverseContext.count = 0;
    return traverseContext;
  } else {
    // 这个对象的使用方法func.call(context, child, getPooledTraverseContext().count++)
    return {
      result: mapResult,
      keyPrefix: keyPrefix, // key值前缀deep遍历(函数自调用)用
      func: mapFunction, // 元素遍历是的函数如：.map(()=>{})，里面的匿名函数
      context: mapContext, // func函数call的this对象
      count: 0,
    };
  }
}

// 释放当前使用的对象属性，并确认是否需要缓存刚使用的对象
function releaseTraverseContext(traverseContext) {
  // 清空对象
  traverseContext.result = null;
  traverseContext.keyPrefix = null;
  traverseContext.func = null;
  traverseContext.context = null;
  traverseContext.count = 0;
  if (traverseContextPool.length < POOL_SIZE) { // 如果还能缓存就缓存
    traverseContextPool.push(traverseContext);
  }
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path [so far](到目前为止).
 * @param {!function} callback Callback to invoke with each child found. 参数(traverseContext, children, name)
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree. 个数
 *
 * 获取children树的元素个数
 */
function traverseAllChildrenImpl(children,
                                 nameSoFar,
                                 callback,
                                 traverseContext,) {
  var type = typeof children;

  // 果然React认为最合理的空子元素为null
  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  // 单个子元素
  if (
    children === null ||
    type === 'string' ||
    type === 'number' ||
    // The following is inlined from ReactElement. This means we can optimize(优化)
    // some checks. React Fiber also inlines this logic(逻辑) for similar purposes.
    (type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE) ||
    (type === 'object' && children.$$typeof === REACT_PORTAL_TYPE)
  ) {
    callback(
      traverseContext,
      children,
      // If it's the only child, treat(对待) the name as if it was wrapped in an array
      // so that it's consistent(一致的) if the number of children grows(增长).
      // 就是说如果是单个的child还是传入0作为index
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar,
    );
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  // [[],{}]，遍历多维数组
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(
        child,
        nextName,
        callback,
        traverseContext,
      );
    }
  } else { // 具有迭代器的对象
    var iteratorFn =
      (ITERATOR_SYMBOL && children[ITERATOR_SYMBOL]) ||
      children[FAUX_ITERATOR_SYMBOL];
    if (typeof iteratorFn === 'function') {
      if (__DEV__) {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          warning(
            didWarnAboutMaps,
            'Using Maps as children is unsupported and will likely yield ' +
            'unexpected results. Convert it to a sequence/iterable of keyed ' +
            'ReactElements instead.%s',
            ReactDebugCurrentFrame.getStackAddendum(),
          );
          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step;
      var ii = 0;
      // 迭代器执行
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(
          child,
          nextName,
          callback,
          traverseContext,
        );
      }
    } else if (type === 'object') { // 不具有迭代器的对象
      var addendum = '';
      if (__DEV__) {
        addendum =
          ' If you meant to render a collection of children, use an array ' +
          'instead.' +
          ReactDebugCurrentFrame.getStackAddendum();
      }
      var childrenString = '' + children;
      invariant(
        false,
        'Objects are not valid as a React child (found: %s).%s',
        childrenString === '[object Object]'
          ? 'object with keys {' + Object.keys(children).join(', ') + '}'
          : childrenString,
        addendum,
      );
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically(代表性的) specified(规定的) as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional(可选的) argument that is passed through the
 * entire traversal. It can be used to store accumulations(累积物) or anything else that
 * the callback might find relevant(有关的).
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke(调用) upon(在...之上) traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree. 返回traverseAllChildrenImpl的返回值
 * 还是像是traverseAllChildrenImpl的一个过滤加curry
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

/**
 * Generate(生成) a key string that identifies(识别) a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 * 根据key值或者index值生成一个componentKey
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly(轻率地). We want to ensure
  // that we don't block potential(可能的) future ES APIs.
  if (
    typeof component === 'object' &&
    component !== null &&
    component.key != null
  ) {
    // Explicit key
    return escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36); // 0-9 和 a-z 一共36个，所以36进制吧
}

// 根据traverseAllChildrenImpl里面的调用对单元素执行遍历函数，参数(traverseContext, children, name)
function forEachSingleChild(bookKeeping, child, name) {
  var {func, context} = bookKeeping;
  func.call(context, child, bookKeeping.count++);
}

/**
 * Iterates(重复，迭代) through children that are typically(通常) specified(指定) as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#react.children.foreach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  // 获取遍历的上下文
  var traverseContext = getPooledTraverseContext(
    null,
    null,
    forEachFunc,
    forEachContext,
  );
  // 对children遍历并执行forEachFunc
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  // 释放部分内存
  releaseTraverseContext(traverseContext);
}

// 多维数组会被平铺，null值会被忽略
function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var {result, keyPrefix, func, context} = bookKeeping;

  var mappedChild = func.call(context, child, bookKeeping.count++);
  // 如果传入map函数返回值为数组，那么会对返回值进行map
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(
      mappedChild,
      result,
      childKey,
      emptyFunction.thatReturnsArgument, // 返回接受到的第一个参数child
    );
  } else if (mappedChild != null) {
    // 如果是RE元素，则需要clone一个新的元素返回
    if (isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(
        mappedChild,
        // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        keyPrefix +
        (mappedChild.key && (!child || child.key !== mappedChild.key)
          ? escapeUserProvidedKey(mappedChild.key) + '/'
          : '') +
        childKey,
      );
    }
    result.push(mappedChild);
  }
}

// 一个具有副作用的deep数组遍历
function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = getPooledTraverseContext(
    array,
    escapedPrefix,
    func,
    context,
  );
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#react.children.map
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 * 因为map需要一个返回值，所以需要一个中间函数来消化副作用
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#react.children.count
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children, context) {
  return traverseAllChildren(children, emptyFunction.thatReturnsNull, null);
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#react.children.toarray
 *
 * 多维数组会被平铺，null值会被忽略
 */
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(
    children,
    result,
    null,
    emptyFunction.thatReturnsArgument,
  );
  return result;
}

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://reactjs.org/docs/react-api.html#react.children.only
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 *
 * 简单的检查一下
 */
function onlyChild(children) {
  invariant(
    isValidElement(children),
    'React.Children.only expected to receive a single React element child.',
  );
  return children;
}

export {
  forEachChildren as forEach,
  mapChildren as map,
  countChildren as count,
  onlyChild as only,
  toArray,
};
