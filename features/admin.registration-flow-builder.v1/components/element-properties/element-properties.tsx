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

import { FieldKey, FieldValue, Properties } from "@wso2is/admin.flow-builder-core.v1/models/base";
import { Element, ElementCategories } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import ElementPropertyFactory from "./element-property-factory";
import FieldExtendedProperties from "./extended-properties/field-extended-properties";

/**
 * Props interface of {@link ElementProperties}
 */
export interface ElementPropertiesPropsInterface extends IdentifiableComponentInterface {
    properties: Properties;
    /**
     * The element associated with the property.
     */
    element: Element;
    /**
     * The event handler for the property change.
     * @param propertyKey - The key of the property.
     * @param previousValue - The previous value of the property.
     * @param newValue - The new value of the property.
     * @param element - The element associated with the property.
     */
    onChange: (propertyKey: string, previousValue: any, newValue: any, element: Element) => void;
}

/**
 * Factory to generate the property configurator for the given registration flow element.
 *
 * @param props - Props injected to the component.
 * @returns The ElementPropertyConfiguratorFactory component.
 */
const ElementProperties: FunctionComponent<ElementPropertiesPropsInterface> = ({
    "data-componentid": componentId = "element-properties",
    properties,
    element,
    onChange
}: ElementPropertiesPropsInterface): ReactElement | null => {
    const renderElementPropertyFactory = () => {
        return Object.entries(properties).map(([ key, value ]: [FieldKey, FieldValue]) => (
            <ElementPropertyFactory
                key={ `${element.id}-${key}` }
                element={ element }
                propertyKey={ key }
                propertyValue={ value }
                data-componentid={ `${element.id}-${key}` }
                onChange={ onChange }
            />
        ));
    };

    switch (element.category) {
        case ElementCategories.Field:
            return (
                <>
                    <FieldExtendedProperties
                        element={ element }
                        propertyKey={ null }
                        propertyValue={ null }
                        data-componentid="field-extended-properties"
                        onChange={ onChange }
                    />
                    { renderElementPropertyFactory() }
                </>
            );
        default:
            return <>{ renderElementPropertyFactory() }</>;
    }
};

export default ElementProperties;
