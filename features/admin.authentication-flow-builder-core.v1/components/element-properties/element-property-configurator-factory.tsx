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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import ComponentPropertyConfiguratorFactory from "./component-property-configurator-factory";
import WidgetPropertyConfiguratorFactory from "./widget-property-configurator-factory";
import { Element, ElementCategories } from "../../models/elements";

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
}: ElementPropertyConfiguratorFactoryPropsInterface): ReactElement | null => {
    switch (element.category) {
        case ElementCategories.Component:
            return (
                <ComponentPropertyConfiguratorFactory
                    element={ element }
                    propertyKey={ propertyKey }
                    propertyValue={ propertyValue }
                    data-componentid={ componentId }
                />
            );
        case ElementCategories.Widget:
            return (
                <WidgetPropertyConfiguratorFactory
                    element={ element }
                    propertyKey={ propertyKey }
                    propertyValue={ propertyValue }
                    data-componentid={ componentId }
                />
            );
        default:
            return null;
    }
};

export default ElementPropertyConfiguratorFactory;
