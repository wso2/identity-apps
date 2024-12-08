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

import FormControl from "@oxygen-ui/react/FormControl";
import Select from "@oxygen-ui/react/Select";
import Stack from "@oxygen-ui/react/Stack";
// eslint-disable-next-line max-len
import { CommonComponentPropertyFactoryPropsInterface } from "@wso2is/admin.flow-builder-core.v1/components/element-property-panel/common-component-property-factory";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { RegistrationFlowActionTypes } from "../../../models/actions";

/**
 * Props interface of {@link ButtonExtendedProperties}
 */
export type ButtonExtendedPropertiesPropsInterface = CommonComponentPropertyFactoryPropsInterface &
    IdentifiableComponentInterface;

/**
 * Extended properties for the field elements.
 *
 * @param props - Props injected to the component.
 * @returns The ButtonExtendedProperties component.
 */
const ButtonExtendedProperties: FunctionComponent<ButtonExtendedPropertiesPropsInterface> = ({
    "data-componentid": componentId = "button-extended-properties"
}: ButtonExtendedPropertiesPropsInterface): ReactElement => {
    const [ selectedActionType ] = useState<RegistrationFlowActionTypes>(null);

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <FormControl size="small" variant="outlined">
                <Select
                    labelId="action-type-select-label"
                    id="action-type-selector"
                    value={ selectedActionType }
                    label="Action Type"
                    placeholder="Select an action type"
                >
                </Select>
            </FormControl>
        </Stack>
    );
};

export default ButtonExtendedProperties;
