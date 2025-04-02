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
const EuiIconBeaker = ({
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
      d="M5 2h1v4.853l-3.793 5.886-.006.01A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.299-2.25l-.006-.01L10 6.853V2h1V1H5v1Zm2 1V2h2v5.147l1.53 2.374A6.506 6.506 0 0 0 10 9.5c-.847 0-1.548.28-2.158.525l-.028.01C7.18 10.29 6.64 10.5 6 10.5c-.474 0-.828-.054-1.083-.12L7 7.147V6h1V5H7V4h1V3H7Zm-2.646 8.253L3.062 13.26A.5.5 0 0 0 3.5 14h9a.5.5 0 0 0 .438-.741l-1.664-2.583c-.258-.088-.668-.176-1.274-.176-.64 0-1.18.21-1.814.464l-.028.011c-.61.244-1.311.525-2.158.525-.737 0-1.27-.112-1.646-.247Z"
      clipRule="evenodd"
    />
  </svg>
);
export const icon = EuiIconBeaker;
