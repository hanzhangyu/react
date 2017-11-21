/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Fiber} from 'react-reconciler/src/ReactFiber';

function getComponentName(fiber: Fiber): string | null {
  const {type} = fiber;
  if (typeof type === 'string') {
    return type;
  }
  if (typeof type === 'function') {
    // [这东西兼容性不好呀，可能只是错误提示位置，要求不严格](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name)
    return type.displayName || type.name;
  }
  return null;
}

export default getComponentName;
