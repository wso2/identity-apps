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

import { Resource, ResourceTypes } from "@wso2is/admin.flow-builder-core.v1/models/resources";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import ElementPropertyFactory from "./element-property-factory";
import StepPropertyFactory from "./step-property-factory";
import WidgetPropertyFactory from "./widget-property-factory";

/**
 * Props interface of {@link ResourcePropertyFactory}
 */
export interface ResourcePropertyFactoryPropsInterface extends IdentifiableComponentInterface {
    /**
     * The resource associated with the property.
     */
    resource: Resource;
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
     * @param newValue - The new value of the property.
     * @param resource - The resource associated with the property.
     */
    onChange: (propertyKey: string, newValue: any, resource: Resource) => void;
    /**
     * Additional props.
     */
    [ key: string ]: any;
}

/**
 * Factory to generate the property configurator for the given password recovery flow resource.
 *
 * @param props - Props injected to the component.
 * @returns The ResourcePropertyFactory component.
 */
const ResourcePropertyFactory: FunctionComponent<ResourcePropertyFactoryPropsInterface> = ({
    "data-componentid": componentId = "resource-property-factory",
    resource,
    propertyKey,
    propertyValue,
    onChange,
    ...rest
}: ResourcePropertyFactoryPropsInterface): ReactElement | null => {
    switch (resource.resourceType) {
        case ResourceTypes.Element:
            return (
                <ElementPropertyFactory
                    resource={ resource }
                    propertyKey={ propertyKey }
                    propertyValue={ propertyValue }
                    data-componentid={ componentId }
                    onChange={ onChange }
                    { ...rest }
                />
            );
        case ResourceTypes.Step:
            return (
                <StepPropertyFactory
                    resource={ resource }
                    propertyKey={ propertyKey }
                    propertyValue={ propertyValue }
                    data-componentid={ componentId }
                    onChange={ onChange }
                    { ...rest }
                />
            );
        case ResourceTypes.Widget:
            return (
                <WidgetPropertyFactory
                    resource={ resource }
                    propertyKey={ propertyKey }
                    propertyValue={ propertyValue }
                    data-componentid={ componentId }
                    onChange={ onChange }
                    { ...rest }
                />
            );
        default:
            return null;
    }
};

export default ResourcePropertyFactory;
