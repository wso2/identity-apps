/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Button, { ButtonProps } from "@oxygen-ui/react/Button";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Handle, Position } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";
import ButtonAdapterConstants from "../../../../constants/button-adapter-constants";
import { ButtonVariants, Element } from "../../../../models/elements";
import "./button-adapter.scss";

/**
 * Props interface of {@link ButtonAdapter}
 */
export interface ButtonAdapterPropsInterface extends IdentifiableComponentInterface {
    /**
     * The flow id of the resource.
     */
    resourceId: string;
    /**
     * The resource properties.
     */
    resource: Element;
}

/**
 * Adapter for the Button component.
 *
 * @param props - Props injected to the component.
 * @returns The ButtonAdapter component.
 */
export const ButtonAdapter: FunctionComponent<ButtonAdapterPropsInterface> = ({
    resource
}: ButtonAdapterPropsInterface): ReactElement => {
    let config: ButtonProps = {};

    if (resource.variant === ButtonVariants.Primary) {
        config = {
            ...config,
            color: "primary",
            fullWidth: true,
            variant: "contained"
        };
    } else if (resource.variant === ButtonVariants.Secondary) {
        config = {
            ...config,
            color: "secondary",
            fullWidth: true,
            variant: "contained"
        };
    } else if (resource.variant === ButtonVariants.Text) {
        config = {
            ...config,
            fullWidth: true,
            variant: "text"
        };
    } else if (resource.variant === ButtonVariants.Social) {
        config = {
            ...config,
            className: "social-button",
            fullWidth: true,
            variant: "contained"
        };
    }

    return (
        <div className="adapter button-adapter">
            <Handle
                id={ `${resource?.id}${ButtonAdapterConstants.PREVIOUS_BUTTON_HANDLE_SUFFIX}` }
                type="source"
                position={ Position.Left }
            />
            <Button sx={ resource?.config.styles } { ...config }>
                { resource?.config?.field?.text }
            </Button>
            <Handle
                id={ `${resource?.id}${ButtonAdapterConstants.NEXT_BUTTON_HANDLE_SUFFIX}` }
                type="source"
                position={ Position.Right }
            />
        </div>
    );
};

export default ButtonAdapter;
