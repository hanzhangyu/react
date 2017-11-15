/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 *
 * 一些特征的配置文件
 */

import invariant from 'fbjs/lib/invariant';

export const enableAsyncSubtreeAPI = true; // ？ 启用异步子树
export const enableAsyncSchedulingByDefaultInReactDOM = false; // ？ 在reactDom中使用异步调度，避免用户界面掉帧，如果事情是在幕后，我们可以延迟任何与它相关的逻辑。如果数据到达速度比帧速率快，我们可以合并和批量更新。
// Exports React.Fragment
export const enableReactFragment = false; // ？ 这东西好像是测试用的
// Exports ReactDOM.createRoot
export const enableCreateRoot = false;// ？ 这东西好像也是测试用的
export const enableUserTimingAPI = __DEV__; // ？

// Mutating mode (React DOM, React ART, React Native):
export const enableMutatingReconciler = true; // ？突变模式
// Experimental noop mode (currently unused): 实验性 空状态（目前未使用）
export const enableNoopReconciler = false;
// Experimental persistent mode (CS): 实验性 持续状态
export const enablePersistentReconciler = false;

// Only used in www builds.
export function addUserTimingListener() {
  invariant(false, 'Not implemented.');
}
