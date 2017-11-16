/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// 获取正确的栈帧
const ReactDebugCurrentFrame = {};

if (__DEV__) {
  // Component that is being worked on
  ReactDebugCurrentFrame.getCurrentStack = (null: null | (() => string | null));

  // 获取栈顶 [getStackAddendum](附录; 补遗; 附加物)
  ReactDebugCurrentFrame.getStackAddendum = function(): string | null {
    const impl = ReactDebugCurrentFrame.getCurrentStack;
    if (impl) {
      return impl();
    }
    return null;
  };
}

export default ReactDebugCurrentFrame;
