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

import Avatar from "@oxygen-ui/react/Avatar";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { AlertLevels, Claim } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ReactFlowProvider } from "@xyflow/react";
import startCase from "lodash-es/startCase";
import React, { FunctionComponent, PropsWithChildren, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useGetMetadata from "../api/use-metadata";
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
    /**
     * The type of the flow.
     */
    flowType: FlowTypes;
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
    children,
    flowType
}: PropsWithChildren<AuthenticationFlowBuilderProviderProps>): ReactElement => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ isResourcePanelOpen, setIsResourcePanelOpen ] = useState<boolean>(true);
    const [ isResourcePropertiesPanelOpen, setIsOpenResourcePropertiesPanel ] = useState<boolean>(false);
    const [ resourcePropertiesPanelHeading, setResourcePropertiesPanelHeading ] = useState<ReactNode>(null);
    const [ lastInteractedElementInternal, setLastInteractedElementInternal ] = useState<Resource>(null);
    const [ lastInteractedStepId, setLastInteractedStepId ] = useState<string>("");
    const [ selectedAttributes, setSelectedAttributes ] = useState<{ [key: string]: Claim[] }>({});

    const { data: flowMetadata, error: flowMetadataError } = useGetMetadata(flowType, !!flowType);

    /**
     * Error handling for flow metadata fetch.
     */
    useEffect(() => {
        if (flowMetadataError) {
            dispatch(addAlert({
                description: t("flows:core.errors.flowMetadataFetch.description"),
                level: AlertLevels.ERROR,
                message: t("flows:core.errors.flowMetadataFetch.message")
            }));
        }
    }, [ flowMetadataError ]);

    const onResourceDropOnCanvas = (resource: Resource, stepId: string): void => {
        setLastInteractedResource(resource);
        setLastInteractedStepId(stepId);
    };

    const setLastInteractedResource = (resource: Resource): void => {
        // TODO: Internationalize this string and get from a mapping.
        setResourcePropertiesPanelHeading(
            <Stack direction="row" className="sub-title" gap={ 1 } alignItems="center">
                <Avatar src={ resource?.display?.image } variant="square" />
                <Typography variant="h6">{ startCase(resource?.type?.toLowerCase()) } Properties</Typography>
            </Stack>
        );
        setLastInteractedElementInternal(resource);

        // If the element is a step node, do not open the properties panel for now.
        // TODO: Figure out if there are properties for a step.
        if (
            (resource.category === ResourceTypes.Step && resource.type === StepTypes.View) ||
            resource.resourceType === ResourceTypes.Template ||
            resource.resourceType === ResourceTypes.Widget
        ) {
            setIsOpenResourcePropertiesPanel(false);

            return;
        }

        setIsOpenResourcePropertiesPanel(true);
    };

    return (
        <ReactFlowProvider>
            <AuthenticationFlowBuilderCoreContext.Provider
                value={ {
                    ElementFactory,
                    ResourceProperties,
                    isResourcePanelOpen,
                    isResourcePropertiesPanelOpen,
                    lastInteractedResource: lastInteractedElementInternal,
                    lastInteractedStepId,
                    metadata: flowMetadata,
                    onResourceDropOnCanvas,
                    resourcePropertiesPanelHeading,
                    selectedAttributes,
                    setIsOpenResourcePropertiesPanel,
                    setIsResourcePanelOpen,
                    setLastInteractedResource,
                    setLastInteractedStepId,
                    setResourcePropertiesPanelHeading,
                    setSelectedAttributes
                } }
            >
                { children }
            </AuthenticationFlowBuilderCoreContext.Provider>
        </ReactFlowProvider>
    );
};

export default AuthenticationFlowBuilderCoreProvider;
