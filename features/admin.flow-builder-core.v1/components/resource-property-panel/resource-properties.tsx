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

import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { useReactFlow } from "@xyflow/react";
import merge from "lodash-es/merge";
import set from "lodash-es/set";
import React, { FunctionComponent, ReactElement } from "react";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";
import { Properties } from "../../models/base";
import { Resource } from "../../models/resources";

/**
 * Props interface of {@link ResourceProperties}
 */
export type CommonResourcePropertiesPropsInterface = IdentifiableComponentInterface & {
    properties?: Properties;
    /**
     * The resource associated with the property.
     */
    resource: Resource;
    /**
     * The event handler for the property change.
     * @param propertyKey - The key of the property.
     * @param newValue - The new value of the property.
     * @param resource - The element associated with the property.
     */
    onChange: (propertyKey: string, newValue: any, resource: Resource) => void;
    /**
     * The event handler for the variant change.
     * @param variant - The variant of the element.
     * @param resource - Partial resource properties to override.
     */
    onVariantChange?: (variant: string, resource?: Partial<Resource>) => void;
};

/**
 * Component to generate the properties panel for the selected resource.
 *
 * @param props - Props injected to the component.
 * @returns The ResourceProperties component.
 */
const ResourceProperties: FunctionComponent<Partial<CommonResourcePropertiesPropsInterface>> = ({
    "data-componentid": componentId = "resource-properties"
}: Partial<CommonResourcePropertiesPropsInterface>): ReactElement => {
    const { updateNodeData } = useReactFlow();
    const {
        lastInteractedResource,
        setLastInteractedResource,
        ResourceProperties,
        lastInteractedResourceId
    } = useAuthenticationFlowBuilderCore();

    const changeSelectedVariant = (selected: string, element?: Partial<Element>) => {
        let selectedVariant: Resource = lastInteractedResource?.variants?.find(
            (resource: Resource) => resource.variant === selected
        );

        if (element) {
            selectedVariant = merge(selectedVariant, element);
        }

        updateNodeData(lastInteractedResourceId, (node: any) => {
            const components: Resource = node?.data?.components?.map((component: any) => {
                if (component.id === lastInteractedResource.id) {
                    return merge(component, selectedVariant);
                }

                return component;
            });

            setLastInteractedResource(merge(lastInteractedResource, selectedVariant));

            return {
                components
            };
        });
    };

    const handlePropertyChange = (propertyKey: string, newValue: any, resource: Resource) => {
        updateNodeData(lastInteractedResourceId, (node: any) => {
            const components: Resource[] = node?.data?.components?.map((component: any) => {
                if (component.id === resource.id) {
                    set(component, propertyKey, newValue);
                }

                return component;
            });

            return {
                components
            };
        });
    };

    return (
        <div className="flow-builder-element-properties" data-componentid={ componentId }>
            { lastInteractedResource ? (
                <Stack gap={ 1 }>
                    { lastInteractedResource && (
                        <ResourceProperties
                            resource={ lastInteractedResource }
                            properties={ lastInteractedResource?.config?.field }
                            onChange={ handlePropertyChange }
                            onVariantChange={ changeSelectedVariant }
                        />
                    ) }
                </Stack>
            ) : (
                <Typography variant="body2" color="textSecondary" sx={ { padding: 2 } }>
                    No properties available.
                </Typography>
            ) }
        </div>
    );
};

export default ResourceProperties;
