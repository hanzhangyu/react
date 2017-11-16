/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 本文件的都是用于组件更新状态的基类辅助类，一共暴露了三个壳
 */

import emptyObject from 'fbjs/lib/emptyObject'; // {}，当为dev时使用freeze冻结
// 验证是否正确，invariant(condition, format, a, b, c, d, e, f) condition(判断条件) format(错误提示支持%s在使用replace正则替换) a...f(正则替换参数)
import invariant from 'fbjs/lib/invariant';
import lowPriorityWarning from 'shared/lowPriorityWarning'; // 低优先级的提示

import ReactNoopUpdateQueue from './ReactNoopUpdateQueue'; //  react 等待更新队列

/**
 * Base class helpers for the updating state of a component.
 * @param props
 * @param context
 * @param updater
 * @constructor
 */
function Component(props, context, updater) {
  this.props = props;
  console.log('context in the component instantiate', context);
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue; // 设置默认更新（报warn），真正的更新函数会被renderer注入
}

Component.prototype.isReactComponent = {};

/**
 * Sets a subset（子集） of the state. Always use this to mutate（突变）
 * state. You should treat（对待） `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together（可能会被收集在一起）.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously)（可能会在未来某些地方被调用）. It will be called with the up to date（最新的）
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned（分配） to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state. 部分state或者函数
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
Component.prototype.setState = function (partialState, callback) {
  invariant(
    typeof partialState === 'object' ||
    typeof partialState === 'function' ||
    partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
    'function which returns an object of state variables.',
  );
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 * 为Deprecated APIs编写getter，并警告
 */
if (__DEV__) {
  var deprecatedAPIs = {
    isMounted: [ // 以前经常在didMount中发起异步的话，你还要确认异步结束时间组件是否还在渲染，现在的建议是在willUnmount中卸载
      'isMounted',
      'Instead, make sure to clean up subscriptions and pending requests in ' +
      'componentWillUnmount to prevent memory leaks.',
    ],
    replaceState: [ // 直接替换state，参数不存在的值都会被删除
      'replaceState',
      'Refactor your code to use setState instead (see ' +
      'https://github.com/facebook/react/issues/3236).',
    ],
  };
  var defineDeprecationWarning = function (methodName, info) {
    Object.defineProperty(Component.prototype, methodName, {
      get: function () {
        lowPriorityWarning(
          false,
          '%s(...) is deprecated in plain JavaScript React classes. %s',
          info[0],
          info[1],
        );
        return undefined;
      },
    });
  };
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

/**
 * Base class helpers for the updating state of a component.
 */
function PureComponent(props, context, updater) {
  // Duplicated from Component.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

function ComponentDummy() {
}

ComponentDummy.prototype = Component.prototype;
var pureComponentPrototype = (PureComponent.prototype = new ComponentDummy()); // 暴露引用用于修改，使用Object.create不能暴露这个引用
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
Object.assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;

function AsyncComponent(props, context, updater) { // 异步组件，源码待发掘
  // Duplicated from Component.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

var asyncComponentPrototype = (AsyncComponent.prototype = new ComponentDummy());
asyncComponentPrototype.constructor = AsyncComponent;
// Avoid an extra prototype jump for these methods.
Object.assign(asyncComponentPrototype, Component.prototype);
asyncComponentPrototype.unstable_isAsyncReactComponent = true;
asyncComponentPrototype.render = function () {
  return this.props.children;
};

export {Component, PureComponent, AsyncComponent};
