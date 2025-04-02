/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// THIS IS A GENERATED FILE. DO NOT MODIFY MANUALLY. @see scripts/compile-icons.js

import * as React from 'react';
import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const EuiIconEye = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 16 16"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM6 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="m15 8 .857.514a1 1 0 0 0 0-1.028l-.001-.003-.003-.005-.01-.015a6.147 6.147 0 0 0-.144-.227 16.043 16.043 0 0 0-1.992-2.443C12.402 3.488 10.407 2 8 2S3.598 3.488 2.293 4.793a16.04 16.04 0 0 0-2.106 2.62 6.117 6.117 0 0 0-.031.05l-.01.015-.002.005v.001S.141 7.486 1 8l-.858-.514c-.19.316-.19.712 0 1.03l.002.001.003.005.009.015a6.117 6.117 0 0 0 .145.227 16.041 16.041 0 0 0 1.992 2.443C3.598 12.512 5.593 14 8 14s4.402-1.488 5.707-2.793a16.045 16.045 0 0 0 2.105-2.62l.032-.05.009-.015.003-.005v-.001S15.858 8.514 15 8Zm0 0 .857-.514L15 8Zm0 0s-3 5-7 5-7-5-7-5 3-5 7-5 7 5 7 5ZM1 8l-.857.515L1 8Z"
      clipRule="evenodd"
    />
  </svg>
);
export const icon = EuiIconEye;
