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

import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { CommonElementFactoryPropsInterface } from "../../common-element-factory";

/**
 * Props interface of {@link CheckboxAdapter}
 */
export type CheckboxAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

/**
 * Adapter for the Checkbox component.
 *
 * @param props - Props injected to the component.
 * @returns The CheckboxAdapter component.
 */
export const CheckboxAdapter: FunctionComponent<CheckboxAdapterPropsInterface> = ({
    resource
}: CheckboxAdapterPropsInterface): ReactElement => (
    <FormControlLabel
        control={ <Checkbox defaultChecked /> }
        className={ resource.config?.className }
        defaultValue={ resource.config?.defaultValue }
        label={ resource.config?.label }
        placeholder={ resource.config?.placeholder || "" }
        required={ resource.config?.required }
        style={ resource.config?.styles }
    />
);

export default CheckboxAdapter;
