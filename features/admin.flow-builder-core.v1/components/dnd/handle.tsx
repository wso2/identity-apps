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

import Tooltip from "@oxygen-ui/react/Tooltip";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    CSSProperties,
    ForwardRefExoticComponent,
    ForwardedRef,
    HTMLAttributes,
    ReactElement,
    ReactNode,
    Ref,
    forwardRef
} from "react";
import Action from "./action";

export interface HandleProps extends HTMLAttributes<HTMLButtonElement>, IdentifiableComponentInterface {
    cursor?: CSSProperties["cursor"];
    label: ReactNode;
    ref?: Ref<HTMLButtonElement>;
}

const Handle: ForwardRefExoticComponent<HandleProps> = forwardRef<HTMLButtonElement, HandleProps>(
    ({ children, label, cursor, ...rest }: HandleProps, ref: ForwardedRef<HTMLButtonElement>): ReactElement => (
        <Action ref={ ref } cursor={ cursor } { ...rest }>
            <Tooltip title={ label }>
                <span>{ children }</span>
            </Tooltip>
        </Action>
    )
);

export default Handle;
