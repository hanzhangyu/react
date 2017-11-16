/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// TODO: Use an opaque(不透明的) type once ESLint [et al](以及其他人) support the syntax(语法)
export type ExpirationTime = number;

export const NoWork = 0;
export const Sync = 1;
export const Never = 2147483647; // Max int32: Math.pow(2, 31) - 1

const UNIT_SIZE = 10;
const MAGIC_NUMBER_OFFSET = 2; // ？ 神奇的数字偏移

// 1 unit of expiration(截至) time represents(代表) 10ms.
export function msToExpirationTime(ms: number): ExpirationTime {
  // Always add an offset so that we don't clash(冲突) with the magic number for NoWork.
  return ((ms / UNIT_SIZE) | 0) + MAGIC_NUMBER_OFFSET;
}

// 最高限度  [precision](精度)
function ceiling(num: number, precision: number): number {
  return (((num / precision) | 0) + 1) * precision;
}

// [Bucket](水桶)
export function computeExpirationBucket(
  currentTime: ExpirationTime,
  expirationInMs: number,
  bucketSizeMs: number,
): ExpirationTime {
  return ceiling(
    currentTime + expirationInMs / UNIT_SIZE,
    bucketSizeMs / UNIT_SIZE,
  );
}
