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

import CommonWidgetPropertyFactory, {
    CommonWidgetPropertyFactoryPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/common-widget-property-factory";
import React, { FunctionComponent, ReactElement } from "react";

/**
 * Props interface of {@link WidgetPropertyFactory}
 */
export type WidgetPropertyFactoryPropsInterface = CommonWidgetPropertyFactoryPropsInterface;

/**
 * Factory to generate the property configurator for the given registration flow widget.
 *
 * @param props - Props injected to the component.
 * @returns The WidgetPropertyFactory component.
 */
const WidgetPropertyFactory: FunctionComponent<WidgetPropertyFactoryPropsInterface> = ({
    resource,
    propertyKey,
    propertyValue,
    onChange,
    ...rest
}: WidgetPropertyFactoryPropsInterface): ReactElement | null => {
    switch (resource.type) {
        default:
            return (
                <CommonWidgetPropertyFactory
                    resource={ resource }
                    propertyKey={ propertyKey }
                    propertyValue={ propertyValue }
                    onChange={ onChange }
                    { ...rest }
                />
            );
    }
};

export default WidgetPropertyFactory;
