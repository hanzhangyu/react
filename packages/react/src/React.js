/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import assign from 'object-assign'; // Object.assign 竟然没用lodash说好的非官方标准库呢？
import ReactVersion from 'shared/ReactVersion'; // 定死的版本号
import {enableReactFragment} from 'shared/ReactFeatureFlags'; // 是否启用react片段，好像是调试用的

import {Component, PureComponent, AsyncComponent} from './ReactBaseClasses'; // 三个壳
import {forEach, map, count, toArray, only} from './ReactChildren';
import ReactCurrentOwner from './ReactCurrentOwner';
import {
  createElement,
  createFactory,
  cloneElement,
  isValidElement,
} from './ReactElement';
import {
  createElementWithValidation,
  createFactoryWithValidation,
  cloneElementWithValidation,
} from './ReactElementValidator';
import ReactDebugCurrentFrame from './ReactDebugCurrentFrame';

const REACT_FRAGMENT_TYPE =
  (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.fragment')) ||
  0xeacb;

var React = {
  Children: {
    map,
    forEach,
    count,
    toArray,
    only,
  },

  Component,
  PureComponent,
  unstable_AsyncComponent: AsyncComponent,

  createElement: __DEV__ ? createElementWithValidation : createElement,
  cloneElement: __DEV__ ? cloneElementWithValidation : cloneElement,
  createFactory: __DEV__ ? createFactoryWithValidation : createFactory,
  isValidElement: isValidElement,

  version: ReactVersion,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    ReactCurrentOwner,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign,
  },
};

if (enableReactFragment) {
  React.Fragment = REACT_FRAGMENT_TYPE;
}

if (__DEV__) {
  Object.assign(React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, {
    // These should not be included in production.
    ReactDebugCurrentFrame, // 获取正确的栈帧
    // Shim for React DOM 16.0.0 which still destructured(解构) (but not used) this.
    // TODO: remove in React 17.0.
    ReactComponentTreeHook: {},
  });
}

export default React;
