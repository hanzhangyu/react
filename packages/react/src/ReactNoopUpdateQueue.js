/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import warning from 'fbjs/lib/warning'; // 与invariant不一样的是当条件不成立是错误会被捕获并console.error

var didWarnStateUpdateForUnmountedComponent = {};

function warnNoop(publicInstance, callerName) { // 更新一个已经卸载的组件进行提示
  if (__DEV__) {
    var constructor = publicInstance.constructor;
    const componentName =
      (constructor && (constructor.displayName || constructor.name)) ||
      'ReactClass';
    const warningKey = `${componentName}.${callerName}`;
    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
      return;
    }
    warning(
      false,
      '%s(...): Can only update a mounted or mounting component. ' +
        'This usually means you called %s() on an unmounted component. ' +
        'This is a no-op.\n\nPlease check the code for the %s component.',
      callerName,
      callerName,
      componentName,
    );
    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
  }
}

/**
 * This is the abstract API for an update queue. react 等待更新队列
 */
var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted. 检查此复合组件是否安装
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function(publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.  强制更新。只有确定不在DOM事务中时，才应该调用它
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`. 不会在shouldComponentUpdate中调用，但是会在componentWillUpdate和componentDidUpdate中调用
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function(publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state. 更新所有state,经常使用这个或者setState来改变state
   * You should treat `this.state` as immutable. 你需要将state看成一个不变的元素
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function(
    publicInstance,
    completeState,
    callback,
    callerName,
  ) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function(
    publicInstance,
    partialState,
    callback,
    callerName,
  ) {
    warnNoop(publicInstance, 'setState');
  },
};

export default ReactNoopUpdateQueue;
