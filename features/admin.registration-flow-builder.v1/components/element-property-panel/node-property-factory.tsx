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

import CommonNodePropertyFactory, {
    CommonNodePropertyFactoryPropsInterface
// eslint-disable-next-line max-len
} from "@wso2is/admin.flow-builder-core.v1/components/element-property-panel/common-node-property-factory";
import { NodeTypes } from "@wso2is/admin.flow-builder-core.v1/models/node";
import React, { FunctionComponent, ReactElement } from "react";
import RulesProperties from "./nodes/rules-properties";

/**
 * Props interface of {@link ComponentPropertyFactory}
 */
export type NodePropertyFactoryPropsInterface = CommonNodePropertyFactoryPropsInterface;

/**
 * Factory to generate the property configurator for the given component.
 *
 * @param props - Props injected to the component.
 * @returns The NodePropertyConfiguratorFactory component.
 */
const ComponentPropertyFactory: FunctionComponent<NodePropertyFactoryPropsInterface> = ({
    element,
    propertyKey,
    propertyValue,
    onChange
}: NodePropertyFactoryPropsInterface): ReactElement | null => {
    switch (element.type) {
        case NodeTypes.Rule:
            return <RulesProperties />;
        default:
            return (
                <CommonNodePropertyFactory
                    element={ element }
                    propertyKey={ propertyKey }
                    propertyValue={ propertyValue }
                    onChange={ onChange }
                />
            );
    }
};

export default ComponentPropertyFactory;
