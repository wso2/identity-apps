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
import classNames from "classnames";
import React, {
    CSSProperties,
    ForwardRefExoticComponent,
    ForwardedRef,
    HTMLAttributes,
    ReactElement,
    forwardRef
} from "react";
import "./action.scss";

/**
 * Props interface for the Action component.
 */
export interface ActionProps extends HTMLAttributes<HTMLButtonElement>, IdentifiableComponentInterface {
    /**
     * Variant of the action button.
     */
    variant?: "light" | "dark" | "destructive";
    /**
     * Cursor style for the action button.
     */
    cursor?: CSSProperties["cursor"];
}

/**
 * Action component.
 *
 * @param props - Props injected to the component.
 * @param ref - Reference to the button element.
 * @returns The Action component.
 */
const Action: ForwardRefExoticComponent<ActionProps> = forwardRef<HTMLButtonElement, ActionProps>(
    (
        {
            className,
            cursor,
            "data-componentid": componentId = "draggable",
            style,
            ...rest
        }: ActionProps,
        ref: ForwardedRef<HTMLButtonElement>
    ): ReactElement => (
        <button
            ref={ ref }
            className={ classNames("flow-builder-dnd-action", className) }
            style={
                    {
                        ...style,
                        cursor
                    } as CSSProperties
            }
            data-componentid={ componentId }
            { ...rest }
        />
    )
);

export default Action;
