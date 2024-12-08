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
import { FunctionComponent, ReactElement } from "react";
import { Element } from "../../models/elements";

/**
 * Props interface of {@link CommonWidgetPropertyFactory}
 */
export interface CommonWidgetPropertyFactoryPropsInterface extends IdentifiableComponentInterface {
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
 * Factory to generate the common property configurator for the given widget.
 * TODO: Implement the common widgets like RE-CAPTCHA, etc.
 *
 * @param props - Props injected to the component.
 * @returns The CommonWidgetPropertyFactory component.
 */
const CommonWidgetPropertyFactory: FunctionComponent<CommonWidgetPropertyFactoryPropsInterface> = ({
    element
}: CommonWidgetPropertyFactoryPropsInterface): ReactElement | null => {
    switch (element.type) {
        default:
            return null;
    }
};

export default CommonWidgetPropertyFactory;