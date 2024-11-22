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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { Element } from "../../models/elements";

/**
 * Props interface of {@link CommonWidgetPropertyFactory}
 */
export interface CommonWidgetPropertyFactoryPropsInterface extends IdentifiableComponentInterface {
    element: Element;
    propertyKey: string;
    propertyValue: any;
}

/**
 * Factory to generate the property configurator for the given widget.
 *
 * @param props - Props injected to the component.
 * @returns The WidgetPropertyConfiguratorFactory component.
 */
const CommonWidgetPropertyFactory: FunctionComponent<CommonWidgetPropertyFactoryPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-builder-widget-property-factory",
    element,
    propertyKey,
    propertyValue
}: CommonWidgetPropertyFactoryPropsInterface): ReactElement | null => {
    switch (element.type) {
        default:
            return null;
    }
};

export default CommonWidgetPropertyFactory;
