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

import { Element, ElementCategories } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import ComponentPropertyFactory from "./component-property-factory";
import WidgetPropertyFactory from "./widget-property-factory";

/**
 * Props interface of {@link ElementPropertyFactory}
 */
export interface ElementPropertyFactoryPropsInterface extends IdentifiableComponentInterface {
    /**
     * The element associated with the property.
     */
    element: Element;
    /**
     * The key of the property.
     */
    propertyKey: string;
    /**
     * The value of the property.
     */
    propertyValue: any;
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
const ElementPropertyFactory: FunctionComponent<ElementPropertyFactoryPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-builder-element-property-configurator-factory",
    element,
    propertyKey,
    propertyValue,
    onChange
}: ElementPropertyFactoryPropsInterface): ReactElement | null => {
    switch (element.category) {
        case ElementCategories.Field:
        case ElementCategories.Action:
        case ElementCategories.Display:
            return (
                <ComponentPropertyFactory
                    element={ element }
                    propertyKey={ propertyKey }
                    propertyValue={ propertyValue }
                    data-componentid={ componentId }
                    onChange={ onChange }
                />
            );
        case ElementCategories.Widget:
            return (
                <WidgetPropertyFactory
                    element={ element }
                    propertyKey={ propertyKey }
                    propertyValue={ propertyValue }
                    data-componentid={ componentId }
                    onChange={ onChange }
                />
            );
        default:
            return null;
    }
};

export default ElementPropertyFactory;
