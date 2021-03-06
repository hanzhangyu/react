/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type Source = {
  fileName: string,
  lineNumber: number,
};

export type ReactElement = { // 基本格式 <div></div> -> React.createElement('div') -> React Element
  $$typeof: any,
  type: any,
  key: any,
  ref: any,
  props: any,
  _owner: any, // ReactInstance or ReactFiber  // ？ 我又看见可爱的fiber了

  // __DEV__
  _store: {
    validated: boolean,
  },
  _self: React$Element<any>,
  _shadowChildren: any,
  _source: Source,
};
