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

import AuthenticationFlowBuilderCoreProvider
    from "@wso2is/admin.flow-builder-core.v1/providers/authentication-flow-builder-core-provider";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useReactFlow } from "@xyflow/react";
import React, { FC, PropsWithChildren, ReactElement, useState } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { FlowTypes } from "../../admin.flows.v1/models/flows";
import configureAskPasswordFlow from "../api/configure-ask-password-flow";
import updateNewAskPasswordPortalFeatureStatus from "../api/update-new-ask-password-portal-feature-status";
import useGetSupportedProfileAttributes from "../api/use-get-supported-profile-attributes";
import useNewAskPasswordPortalFeatureStatus from "../api/use-new-ask-password-portal-feature-status";
import ResourceProperties from "../components/resource-property-panel/resource-properties";
import ElementFactory from "../components/resources/elements/element-factory";
import AskPasswordFlowConstants from "../constants/ask-password-flow-constants";
import AskPasswordFlowBuilderContext from "../context/ask-password-flow-builder-context";
import { Attribute } from "../models/attributes";
import transformFlow from "../utils/transform-flow";

/**
 * Props interface of {@link AskPasswordFlowBuilderProvider}
 */
export type AskPasswordFlowBuilderProviderProps = PropsWithChildren<unknown>;

/**
 * This component provides password recovery flow builder related context to its children.
 *
 * @param props - Props injected to the component.
 * @returns The AskPasswordFlowBuilderProvider component.
 */
const AskPasswordFlowBuilderProvider: FC<AskPasswordFlowBuilderProviderProps> = ({
    children
}: PropsWithChildren<AskPasswordFlowBuilderProviderProps>): ReactElement => (
    <AuthenticationFlowBuilderCoreProvider
        ElementFactory={ ElementFactory }
        ResourceProperties={ ResourceProperties }
        flowType={ FlowTypes.INVITED_USER_REGISTRATION }
    >
        <FlowContextWrapper>{ children }</FlowContextWrapper>
    </AuthenticationFlowBuilderCoreProvider>
);

/**
 * This component wraps the flow context and provides necessary functions and state.
 *
 * @param props - Props injected to the component.
 * @returns The FlowContextWrapper component.
 */
const FlowContextWrapper: FC<AskPasswordFlowBuilderProviderProps> = ({
    children
}: PropsWithChildren<AskPasswordFlowBuilderProviderProps>): ReactElement => {
    const dispatch: Dispatch = useDispatch();

    const { toObject } = useReactFlow();
    const { data: supportedAttributes } = useGetSupportedProfileAttributes();
    const {
        data: isNewAskPasswordPortalEnabled,
        mutate: mutateNewAskPasswordPortalEnabledRequest
    } = useNewAskPasswordPortalFeatureStatus();

    const [ selectedAttributes, setSelectedAttributes ] = useState<{ [key: string]: Attribute[] }>({});
    const [ isPublishing, setIsPublishing ] = useState<boolean>(false);

    const handlePublish = async (): Promise<boolean> => {
        setIsPublishing(true);

        const flow: any = toObject();

        if (!isNewAskPasswordPortalEnabled) {
            try {
                await updateNewAskPasswordPortalFeatureStatus(true);
            } catch(error) {
                dispatch(
                    addAlert({
                        description: "Failed to enable the new password recovery flow experience.",
                        level: AlertLevels.ERROR,
                        message: "Flow Update Failure"
                    })
                );
            }

            mutateNewAskPasswordPortalEnabledRequest();
        }

        try {
            const askPasswordFlow: any = transformFlow(flow);

            askPasswordFlow.flowType = AskPasswordFlowConstants.ASK_PASSWORD_FLOW_TYPE;

            await configureAskPasswordFlow(askPasswordFlow);

            dispatch(
                addAlert({
                    description: "Invite user registration flow updated successfully.",
                    level: AlertLevels.SUCCESS,
                    message: "Flow Updated Successfully"
                })
            );

            return true;
        } catch (error) {
            dispatch(
                addAlert({
                    description: "Failed to update the invite user registration flow.",
                    level: AlertLevels.ERROR,
                    message: "Flow Update Failure"
                })
            );

            return false;
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <AskPasswordFlowBuilderContext.Provider
            value={ {
                isNewAskPasswordPortalEnabled,
                isPublishing,
                onPublish: handlePublish,
                selectedAttributes,
                setSelectedAttributes,
                supportedAttributes
            } }
        >
            { children }
        </AskPasswordFlowBuilderContext.Provider>
    );
};

export default AskPasswordFlowBuilderProvider;
