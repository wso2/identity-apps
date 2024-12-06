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
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import Stack from "@oxygen-ui/react/Stack";
// eslint-disable-next-line max-len
import { CommonComponentPropertyFactoryPropsInterface } from "@wso2is/admin.authentication-flow-builder-core.v1/components/element-properties/common-component-property-factory";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement, useState } from "react";
import useGetSupportedProfileAttributes from "../../../api/use-get-supported-profile-attributes";
import { Attribute } from "../../../models/attributes";

/**
 * Props interface of {@link FieldExtendedProperties}
 */
export type FieldExtendedPropertiesPropsInterface = CommonComponentPropertyFactoryPropsInterface &
    IdentifiableComponentInterface;

/**
 * Extended properties for the field elements.
 *
 * @param props - Props injected to the component.
 * @returns The FieldExtendedProperties component.
 */
const FieldExtendedProperties: FunctionComponent<FieldExtendedPropertiesPropsInterface> = ({
    "data-componentid": componentId = "field-extended-properties",
    element,
    onChange
}: FieldExtendedPropertiesPropsInterface): ReactElement => {
    const { data: attributes } = useGetSupportedProfileAttributes();
    const [ selectedAttribute, setSelectedAttribute ] = useState<Attribute>(null);

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <FormControl size="small" variant="outlined">
                <Select
                    labelId="attribute-select-label"
                    id="attribute-selector"
                    value={ selectedAttribute?.claimURI }
                    label="Attribute"
                    placeholder="Select an attribute"
                    onChange={ (e: ChangeEvent<HTMLInputElement>) => {
                        const newValue: string = e?.target?.value || "";

                        onChange("name", selectedAttribute?.claimURI, newValue, element);

                        setSelectedAttribute(
                            attributes?.find((attribute: Attribute) => attribute?.claimURI === newValue)
                        );
                    } }
                >
                    { attributes?.map((attribute: Attribute) => (
                        <MenuItem key={ attribute?.claimURI } value={ attribute?.claimURI }>
                            { attribute?.displayName }
                        </MenuItem>
                    )) }
                </Select>
            </FormControl>
        </Stack>
    );
};

export default FieldExtendedProperties;
