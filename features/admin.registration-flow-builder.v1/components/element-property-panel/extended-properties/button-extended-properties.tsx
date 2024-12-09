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

import Box from "@oxygen-ui/react/Box";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
// eslint-disable-next-line max-len
import { CommonComponentPropertyFactoryPropsInterface } from "@wso2is/admin.flow-builder-core.v1/components/element-property-panel/common-component-property-factory";
import { Action } from "@wso2is/admin.flow-builder-core.v1/models/actions";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import capitalize from "lodash-es/capitalize";
import React, { FunctionComponent, ReactElement } from "react";
import useGetRegistrationFlowCoreActions from "../../../api/use-get-registration-flow-builder-actions";

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
    const { data: actions } = useGetRegistrationFlowCoreActions();

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            { actions?.map((action: Action, index: number) => (
                <Box key={ index }>
                    <Typography variant="h6">{ capitalize(action?.category) }</Typography>
                </Box>
            )) }
        </Stack>
    );
};

export default ButtonExtendedProperties;
