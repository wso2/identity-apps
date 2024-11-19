/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import startCase from "lodash-es/startCase";
import React, { FunctionComponent, ReactElement } from "react";
import { Element, ElementCategories } from "../models/elements";
import getKnownElementProperties from "../utils/get-known-element-properties";
import isTextValueWithFallback from "../utils/is-text-value-with-fallback";

/**
 * Props interface of {@link ElementPropertyConfiguratorFactory}
 */
export interface ElementPropertyConfiguratorFactoryPropsInterface extends IdentifiableComponentInterface {
    element: Element;
    propertyKey: string;
    propertyValue: any;
}

/**
 * Factory to generate the property configurator for the given element.
 *
 * @param props - Props injected to the component.
 * @returns The ElementPropertyConfiguratorFactory component.
 */
const ElementPropertyConfiguratorFactory: FunctionComponent<ElementPropertyConfiguratorFactoryPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-builder-element-property-configurator-factory",
    element,
    propertyKey,
    propertyValue
}: ElementPropertyConfiguratorFactoryPropsInterface): ReactElement => {
    if (element.category === ElementCategories.Component) {
        if (typeof propertyValue === "boolean") {
            return (
                <FormControlLabel
                    control={ <Checkbox checked={ propertyValue } /> }
                    label={ startCase(propertyKey) }
                />
            );
        }

        if (isTextValueWithFallback(propertyValue)) {
            return (
                <TextField
                    fullWidth
                    label={ startCase(propertyKey) }
                    value={ propertyValue.fallback }
                />
            );
        }

        if (propertyKey === "variant" || propertyKey === "color") {
            return (
                <FormControl size="small" variant="outlined">
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-select-small"
                        value={ propertyValue }
                        label={ startCase(propertyKey) }
                    >
                        { getKnownElementProperties(element)[propertyKey]?.map((property: string) => (
                            <MenuItem key={ property } value={ property }>
                                { property }
                            </MenuItem>
                        )) }
                    </Select>
                </FormControl>
            );
        }
    }

    return null;
};

export default ElementPropertyConfiguratorFactory;
