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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import {
    CommonResourcePropertiesPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import { InputVariants } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement, useMemo } from "react";
import useRegistrationFlowBuilder from "../../../hooks/use-registration-flow-builder";
import { Attribute } from "../../../models/attributes";

/**
 * Props interface of {@link FieldExtendedProperties}
 */
export type FieldExtendedPropertiesPropsInterface = CommonResourcePropertiesPropsInterface &
    IdentifiableComponentInterface;

/**
 * Extended properties for the field elements.
 *
 * @param props - Props injected to the component.
 * @returns The FieldExtendedProperties component.
 */
const FieldExtendedProperties: FunctionComponent<FieldExtendedPropertiesPropsInterface> = ({
    "data-componentid": componentId = "field-extended-properties",
    resource,
    onChange
}: FieldExtendedPropertiesPropsInterface): ReactElement => {
    const { supportedAttributes: attributes } = useRegistrationFlowBuilder();

    const selectedValue: Attribute = useMemo(() => {
        return attributes?.find((attribute: Attribute) => attribute?.claimURI === resource.config.identifier);
    }, [ resource.config.identifier, attributes ]);

    if (resource.variant === InputVariants.Password) {
        return null;
    }

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Autocomplete
                disablePortal
                key={ resource.id }
                options={ attributes || [] }
                getOptionLabel={ (attribute: Attribute) => attribute?.displayName }
                sx={ { width: "100%" } }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField { ...params } label="Attribute" placeholder="Select an attribute" />
                ) }
                value={ selectedValue }
                onChange={ (_: ChangeEvent<HTMLInputElement>, attribute: Attribute) => {
                    onChange("config.identifier", attribute?.claimURI, resource);
                } }
            />
        </Stack>
    );
};

export default FieldExtendedProperties;
