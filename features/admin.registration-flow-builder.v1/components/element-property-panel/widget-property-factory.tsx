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

import CommonWidgetPropertyFactory, {
    CommonWidgetPropertyFactoryPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/element-property-panel/common-widget-property-factory";
import { WidgetTypes } from "@wso2is/admin.flow-builder-core.v1/models/widget";
import React, { FunctionComponent, ReactElement } from "react";
import AttributeCollectorProperties from "./widgets/attribute-collector-properties";

/**
 * Props interface of {@link WidgetPropertyFactory}
 */
export type WidgetPropertyFactoryPropsInterface = CommonWidgetPropertyFactoryPropsInterface;

/**
 * Factory to generate the property configurator for the given registration flow widget.
 *
 * @param props - Props injected to the component.
 * @returns The WidgetPropertyConfiguratorFactory component.
 */
const WidgetPropertyFactory: FunctionComponent<WidgetPropertyFactoryPropsInterface> = ({
    element,
    propertyKey,
    propertyValue,
    onChange
}: WidgetPropertyFactoryPropsInterface): ReactElement | null => {
    switch (element.type) {
        case WidgetTypes.AttributeCollector:
            return <AttributeCollectorProperties />;
        default:
            return (
                <CommonWidgetPropertyFactory
                    element={ element }
                    propertyKey={ propertyKey }
                    propertyValue={ propertyValue }
                    onChange={ onChange }
                />
            );
    }
};

export default WidgetPropertyFactory;