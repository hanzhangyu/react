/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type ReactNode =
  | React$Element<any>
  | ReactCall
  | ReactReturn
  | ReactPortal
  | ReactText
  | ReactFragment;

export type ReactFragment = ReactEmpty | Iterable<React$Node>;

export type ReactNodeList = ReactEmpty | React$Node;

export type ReactText = string | number;

export type ReactEmpty = null | void | boolean;

export type ReactCall = {
  $$typeof: Symbol | number,
  key: null | string,
  children: any,
  // This should be a more specific(具体的) CallHandler
  handler: (props: any, returns: Array<mixed>) => ReactNodeList,
  props: any,
};

export type ReactReturn = {
  $$typeof: Symbol | number,
  value: mixed,
};

export type ReactPortal = {
  $$typeof: Symbol | number,
  key: null | string,
  containerInfo: any,
  children: ReactNodeList,
  // TODO: figure out the API for cross-renderer(交叉渲染) implementation(安装启用).
  implementation: any,
};
