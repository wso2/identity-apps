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
import { Element } from "../../../../../models/elements";

/**
 * Props interface of {@link DefaultInputAdapter}
 */
export interface DefaultInputAdapterPropsInterface extends IdentifiableComponentInterface {
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
 * Fallback adapter for the inputs.
 *
 * @param props - Props injected to the component.
 * @returns The DefaultInputAdapter component.
 */
export const DefaultInputAdapter: FunctionComponent<DefaultInputAdapterPropsInterface> = ({
    resource
}: DefaultInputAdapterPropsInterface): ReactElement => (
    <TextField
        fullWidth
        className={ resource.config?.field?.className }
        defaultValue={ resource.config?.field?.defaultValue }
        helperText={ resource.config?.field?.hint }
        inputProps={ {
            maxLength: resource.config?.field?.maxLength,
            minLength: resource.config?.field?.minLength
        } }
        label={ resource.config?.field?.label }
        multiline={ resource.config?.field?.multiline }
        placeholder={ resource.config?.field?.placeholder || "" }
        required={ resource.config?.field?.required }
        InputLabelProps={ {
            required: resource.config?.field?.required
        } }
        type={ resource.config?.field?.type }
        style={ resource.config?.styles }
    />
);

export default DefaultInputAdapter;
