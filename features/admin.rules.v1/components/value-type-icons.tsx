/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { FunctionComponent, ReactElement, SVGProps } from "react";

/**
 * Props interface of the value type icon.
 */
type ValueTypeIconPropsInterface = SVGProps<SVGSVGElement>;

const ICON_SIZE: number = 20;

/**
 * Icon for a value read from another field: a pair of braces in a rounded square.
 *
 * @param props - Props passed to the SVG element.
 * @returns The icon.
 */
export const FieldReferenceIcon: FunctionComponent<ValueTypeIconPropsInterface> = (
    props: ValueTypeIconPropsInterface
): ReactElement => (
    <svg
        width={ ICON_SIZE }
        height={ ICON_SIZE }
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        { ...props }
    >
        <rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="2" />
        <path
            strokeWidth="1.75"
            d={ "M10 7.75c-1.1 0-1.6.55-1.6 1.6v1.15c0 .8-.45 1.2-1.15 1.5"
                + ".7.3 1.15.7 1.15 1.5v1.15c0 1.05.5 1.6 1.6 1.6"
                + "M14 7.75c1.1 0 1.6.55 1.6 1.6v1.15c0 .8.45 1.2 1.15 1.5"
                + "-.7.3-1.15.7-1.15 1.5v1.15c0 1.05-.5 1.6-1.6 1.6" }
        />
    </svg>
);
