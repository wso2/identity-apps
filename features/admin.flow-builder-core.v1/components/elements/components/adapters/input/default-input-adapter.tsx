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

import TextField from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { Component } from "../../../../../models/component";

/**
 * Props interface of {@link DefaultInputAdapter}
 */
export interface DefaultInputAdapterPropsInterface extends IdentifiableComponentInterface {
    /**
     * The flow id of the node.
     */
    nodeId: string;
    /**
     * The node properties.
     */
    node: Component;
}

/**
 * Fallback adapter for the inputs.
 *
 * @param props - Props injected to the component.
 * @returns The DefaultInputAdapter component.
 */
export const DefaultInputAdapter: FunctionComponent<DefaultInputAdapterPropsInterface> = ({
    node
}: DefaultInputAdapterPropsInterface): ReactElement => (
    <TextField
        fullWidth
        className={ node.config?.field?.className }
        defaultValue={ node.config?.field?.defaultValue }
        helperText={ node.config?.field?.hint }
        inputProps={ {
            maxLength: node.config?.field?.maxLength,
            minLength: node.config?.field?.minLength
        } }
        label={ node.config?.field?.label }
        multiline={ node.config?.field?.multiline }
        placeholder={ node.config?.field?.placeholder || "" }
        required={ node.config?.field?.required }
        InputLabelProps={ {
            required: node.config?.field?.required
        } }
        type={ node.config?.field?.type }
        style={ node.config?.styles }
    />
);

export default DefaultInputAdapter;
