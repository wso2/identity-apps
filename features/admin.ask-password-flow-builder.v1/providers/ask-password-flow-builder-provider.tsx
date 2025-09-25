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
import {
    GovernanceConnectorInterface,
    GovernanceConnectorUtils,
    UpdateGovernanceConnectorConfigInterface,
    updateGovernanceConnector
} from "@wso2is/admin.server-configurations.v1";
import {
    AskPasswordFormUpdatableConfigsInterface
} from "@wso2is/admin.server-configurations.v1/models/ask-password";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useReactFlow } from "@xyflow/react";
import { AxiosError } from "axios";
import React, { FC, PropsWithChildren, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { serverConfigurationConfig } from "../../admin.extensions.v1/configs/server-configuration";
import { FlowTypes } from "../../admin.flows.v1/models/flows";
import { PreviewScreenType } from "../../common.branding.v1/models";
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
}: PropsWithChildren<AskPasswordFlowBuilderProviderProps>): ReactElement => {

    const screensList: PreviewScreenType[] = useMemo(() => ([
        PreviewScreenType.SIGN_UP,
        PreviewScreenType.COMMON,
        PreviewScreenType.EMAIL_LINK_EXPIRY,
        PreviewScreenType.SMS_OTP,
        PreviewScreenType.EMAIL_OTP
    ]), []);

    return (
        <AuthenticationFlowBuilderCoreProvider
            ElementFactory={ ElementFactory }
            ResourceProperties={ ResourceProperties }
            flowType={ FlowTypes.INVITED_USER_REGISTRATION }
            screenTypes={ screensList }
        >
            <FlowContextWrapper>{ children }</FlowContextWrapper>
        </AuthenticationFlowBuilderCoreProvider>
    );
};

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

    const { t } = useTranslation();

    const { toObject } = useReactFlow();
    const { data: supportedAttributes } = useGetSupportedProfileAttributes();
    const {
        data: isNewAskPasswordPortalEnabled,
        mutate: mutateNewAskPasswordPortalEnabledRequest
    } = useNewAskPasswordPortalFeatureStatus();

    const [ selectedAttributes, setSelectedAttributes ] = useState<{ [key: string]: Attribute[] }>({});
    const [ isPublishing, setIsPublishing ] = useState<boolean>(false);
    const [ invitedUserRegistrationConfig , setInvitedUserRegistrationConfig ]
    = useState<null | AskPasswordFormUpdatableConfigsInterface>(null);
    const [ isInvitedUserRegistrationConfigUpdated, setIsInvitedUserRegistrationConfigUpdated ]
    = useState<boolean>(false);
    const [ connector, setConnector ] = useState<GovernanceConnectorInterface | undefined>(undefined);


    const handleUpdateError = (error: AxiosError) => {
        if (error.response && error.response.data && error.response.data.detail) {
            dispatch(
                addAlert({
                    description: t(
                        "governanceConnectors:notifications.updateConnector.error.description",
                        { description: error.response.data.description }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "governanceConnectors:notifications.updateConnector.error.message"
                    )
                })
            );
        } else {
            // Generic error message
            dispatch(
                addAlert({
                    description: t(
                        "governanceConnectors:notifications." +
                        "updateConnector.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "governanceConnectors:notifications." +
                        "updateConnector.genericError.message"
                    )
                })
            );
        }
    };

    const handleUpdateSuccess = () => {
        dispatch(
            addAlert({
                description: t(
                    "extensions:manage.serverConfigurations.userOnboarding.inviteUserToSetPassword." +
                    "notification.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "governanceConnectors:notifications." + "updateConnector.success.message"
                )
            })
        );
    };

    /**
     * Handles the confirmation code step publish action.
     *
     * @returns A promise that resolves to a boolean indicating the success of the publish action.
     */

    const handleSubmit = (values: AskPasswordFormUpdatableConfigsInterface) => {
        const data: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: []
        };

        for (const key in values) {
            data.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(key),
                value: values[ key ]
            });
        }

        // Special case for password recovery notification based enable since the connector state
        // depends on the state of recovery options.
        if (
            serverConfigurationConfig.connectorToggleName[ connector?.name ] &&
            serverConfigurationConfig.autoEnableConnectorToggleProperty &&
            connector?.name !== "account-recovery"
        ) {
            data.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(
                    serverConfigurationConfig.connectorToggleName[ connector?.name ]
                ),
                value: "true"
            });
        }

        updateGovernanceConnector(data, connector?.categoryId, connector?.id)
            .then(() => {
                handleUpdateSuccess();
            })
            .catch((error: AxiosError) => {
                handleUpdateError(error);
            });
    };

    /**
     * Handles the publish action.
     *
     * @returns A promise that resolves to a boolean indicating the success of the publish action.
     */
    const handlePublish = async (): Promise<boolean> => {

        // Proceed to update the flow.
        setIsPublishing(true);

        // Update invite user registration configurations if updated.
        if (isInvitedUserRegistrationConfigUpdated && invitedUserRegistrationConfig) {

            handleSubmit(invitedUserRegistrationConfig);
        }

        // Update the flow.
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
                    description: "Invited user registration flow updated successfully.",
                    level: AlertLevels.SUCCESS,
                    message: "Flow Updated Successfully"
                })
            );

            return true;
        } catch (error) {
            dispatch(
                addAlert({
                    description: "Failed to update the invited user registration flow.",
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
                connector: connector,
                invitedUserRegistrationConfig: invitedUserRegistrationConfig,
                isInvitedUserRegistrationConfigUpdated: isInvitedUserRegistrationConfigUpdated,
                isNewAskPasswordPortalEnabled,
                isPublishing,
                onPublish: handlePublish,
                selectedAttributes,
                setConnector: setConnector,
                setInvitedUserRegistrationConfig: setInvitedUserRegistrationConfig,
                setIsInvitedUserRegistrationConfigUpdated: setIsInvitedUserRegistrationConfigUpdated,
                setSelectedAttributes,
                supportedAttributes
            } }
        >
            { children }
        </AskPasswordFlowBuilderContext.Provider>
    );
};

export default AskPasswordFlowBuilderProvider;
