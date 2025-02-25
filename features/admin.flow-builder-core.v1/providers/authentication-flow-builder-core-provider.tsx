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

import Avatar from "@oxygen-ui/react/Avatar";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { Claim } from "@wso2is/core/models";
import capitalize from "lodash-es/capitalize";
import React, { FunctionComponent, PropsWithChildren, ReactElement, ReactNode, useState } from "react";
import AuthenticationFlowBuilderCoreContext from "../context/authentication-flow-builder-core-context";
import { Resource, ResourceTypes } from "../models/resources";
import { StepTypes } from "../models/steps";

/**
 * Props interface of {@link AuthenticationFlowBuilderCoreProvider}
 */
export interface AuthenticationFlowBuilderProviderProps {
    /**
     * The factory for creating nodes.
     */
    ElementFactory: FunctionComponent<any>;
    /**
     * The factory for creating element properties.
     */
    ResourceProperties: FunctionComponent<any>;
}

/**
 * This component provides authentication flow builder core related context to its children.
 *
 * @param props - Props injected to the component.
 * @returns The AuthenticationFlowBuilderCoreProvider component.
 */
const AuthenticationFlowBuilderCoreProvider = ({
    ElementFactory,
    ResourceProperties,
    children
}: PropsWithChildren<AuthenticationFlowBuilderProviderProps>): ReactElement => {
    const [ isResourcePanelOpen, setIsResourcePanelOpen ] = useState<boolean>(true);
    const [ isResourcePropertiesPanelOpen, setIsOpenResourcePropertiesPanel ] = useState<boolean>(false);
    const [ resourcePropertiesPanelHeading, setResourcePropertiesPanelHeading ] = useState<ReactNode>(null);
    const [ lastInteractedElementInternal, setLastInteractedElementInternal ] = useState<Resource>(null);
    const [ lastInteractedResourceId, setLastInteractedResourceId ] = useState<string>("");
    const [ selectedAttributes, setSelectedAttributes ] = useState<{ [key: string]: Claim[] }>({});

    const onResourceDropOnCanvas = (resource: Resource, resourceId: string): void => {
        setLastInteractedResource(resource);
        setLastInteractedResourceId(resourceId);
    };

    const setLastInteractedResource = (resource: Resource): void => {
        // TODO: Internationalize this string and get from a mapping.
        setResourcePropertiesPanelHeading(
            <Stack direction="row" className="sub-title" gap={ 1 } alignItems="center">
                <Avatar src={ resource?.display?.image } variant="square" />
                <Typography variant="h6">
                    { capitalize(resource.variant ?? resource.type) } Properties
                </Typography>
            </Stack>
        );
        setLastInteractedElementInternal(resource);

        // If the element is a step node, do not open the properties panel for now.
        // TODO: Figure out if there are properties for a step.
        if (resource.category === ResourceTypes.Step && resource.type === StepTypes.View) {
            setIsOpenResourcePropertiesPanel(false);

            return;
        }

        setIsOpenResourcePropertiesPanel(true);
    };

    return (
        <AuthenticationFlowBuilderCoreContext.Provider
            value={ {
                ElementFactory,
                ResourceProperties,
                isResourcePanelOpen,
                isResourcePropertiesPanelOpen,
                lastInteractedResource: lastInteractedElementInternal,
                lastInteractedResourceId,
                onResourceDropOnCanvas,
                resourcePropertiesPanelHeading,
                selectedAttributes,
                setIsOpenResourcePropertiesPanel,
                setIsResourcePanelOpen,
                setLastInteractedResource,
                setLastInteractedResourceId,
                setResourcePropertiesPanelHeading,
                setSelectedAttributes
            } }
        >
            { children }
        </AuthenticationFlowBuilderCoreContext.Provider>
    );
};

export default AuthenticationFlowBuilderCoreProvider;
