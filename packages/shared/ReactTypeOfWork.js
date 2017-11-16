/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type TypeOfWork = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const IndeterminateComponent = 0; // Before we know whether it is functional or class，不确定的组件
export const FunctionalComponent = 1; // 功能性成分
export const ClassComponent = 2; // 类组件

// ？这四个可能是不同类型的树
export const HostRoot = 3; // Root of a host tree. Could be nested(嵌套的) inside another node.
export const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
export const HostComponent = 5;
export const HostText = 6;

// ？
export const CallComponent = 7;
export const CallHandlerPhase = 8;
export const ReturnComponent = 9;
export const Fragment = 10; // ？ 碎片
