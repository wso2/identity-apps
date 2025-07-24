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

import Button, { ButtonProps } from "@oxygen-ui/react/Button";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Handle, Position } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import { ButtonVariants } from "../../../../models/elements";
import { CommonElementFactoryPropsInterface } from "../common-element-factory";
import "./button-adapter.scss";

/**
 * Props interface of {@link ButtonAdapter}
 */
export type ButtonAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

/**
 * Adapter for the Button component.
 *
 * @param props - Props injected to the component.
 * @returns The ButtonAdapter component.
 */
const ButtonAdapter: FunctionComponent<ButtonAdapterPropsInterface> = ({
    resource
}: ButtonAdapterPropsInterface): ReactElement => {
    let config: ButtonProps = {};
    let image: string = "";

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
        // TODO: Figure out a way to identify the social connection from the next step.
        image = "https://www.svgrepo.com/show/475656/google-color.svg";

        config = {
            ...config,
            className: "social-button",
            fullWidth: true,
            variant: "contained"
        };
    }

    return (
        <div className="adapter button-adapter">
            <Button
                sx={ resource?.config.styles }
                startIcon={ resource?.config?.image
                    ? <img src={ resource?.config?.image } height={ 20 } />
                    : image && <img src={ image } height={ 20 } />
                }
                { ...config }
            >
                { resource?.config?.text }
            </Button>
            <Handle
                id={ `${resource?.id}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}` }
                type="source"
                position={ Position.Right }
            />
        </div>
    );
};

export default ButtonAdapter;
