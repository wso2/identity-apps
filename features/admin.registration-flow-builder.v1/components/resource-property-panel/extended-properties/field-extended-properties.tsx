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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import {
    CommonResourcePropertiesPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement, useMemo, useState } from "react";
import useGetSupportedProfileAttributes from "../../../api/use-get-supported-profile-attributes";
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
    const { data: attributes } = useGetSupportedProfileAttributes();
    const [ _, setSelectedAttribute ] = useState<Attribute>(null);

    const selectedValue: Attribute = useMemo(() => {
        return attributes?.find(
            (attribute: Attribute) => attribute?.claimURI === resource.config.field.name
        );
    }, [ resource.config.field.name, attributes ]);

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Autocomplete
                disablePortal
                options={ attributes }
                getOptionLabel={ (attribute: Attribute) => attribute.displayName }
                sx={ { width: "100%" } }
                renderInput={ (params: AutocompleteRenderInputParams) => <TextField { ...params } label="Attribute" /> }
                value={ selectedValue }
                onChange={ (_: ChangeEvent<HTMLInputElement>, attribute: Attribute) => {
                    onChange("config.field.name", attribute?.claimURI, resource);

                    setSelectedAttribute(
                        attributes?.find((attribute: Attribute) => attribute?.claimURI === attribute?.claimURI)
                    );
                } }
            />
        </Stack>
    );
};

export default FieldExtendedProperties;
