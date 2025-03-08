/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ForwardRefExoticComponent, ForwardedRef, HTMLAttributes, ReactElement, Ref, forwardRef } from "react";
import Action from "./action";

export interface HandleProps extends HTMLAttributes<HTMLButtonElement>, IdentifiableComponentInterface {
    ref?: Ref<HTMLButtonElement>;
}

const Handle: ForwardRefExoticComponent<HandleProps> = forwardRef<HTMLButtonElement, HandleProps>(
    ({ children, ...rest }: HandleProps, ref: ForwardedRef<HTMLButtonElement>): ReactElement => (
        <Action ref={ ref } cursor="grab" { ...rest }>
            <svg viewBox="0 0 20 20" width="12">
                { /* eslint-disable-next-line max-len */ }
                <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
            </svg>
            { children }
        </Action>
    )
);

export default Handle;
