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

import useGetAllLocalClaims from "@wso2is/admin.claims.v1/api/use-get-all-local-claims";
import updateFlowConfig from "@wso2is/admin.flow-builder-core.v1/api/update-flow-config";
import useAuthenticationFlowBuilderCore
    from "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import AuthenticationFlowBuilderCoreProvider
    from "@wso2is/admin.flow-builder-core.v1/providers/authentication-flow-builder-core-provider";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { transformClaimsWithUsername } from "@wso2is/admin.flows.v1/utils/claim-utils";
import { AlertLevels, ClaimsGetParams } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useReactFlow } from "@xyflow/react";
import isEmpty from "lodash-es/isEmpty";
import React, { FC, PropsWithChildren, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { PreviewScreenType } from "../../common.branding.v1/models";
import configurePasswordRecoveryFlow from "../api/configure-password-recovery-flow";
import updateNewPasswordRecoveryPortalFeatureStatus from "../api/update-new-password-recovery-portal-feature-status";
import useNewPasswordRecoveryPortalFeatureStatus from "../api/use-new-password-recovery-portal-feature-status";
import ResourceProperties from "../components/resource-property-panel/resource-properties";
import ElementFactory from "../components/resources/elements/element-factory";
import PasswordRecoveryFlowConstants from "../constants/password-recovery-flow-constants";
import PasswordRecoveryFlowBuilderContext from "../context/password-recovery-flow-builder-context";
import { Attribute } from "../models/attributes";
import transformFlow from "../utils/transform-flow";

/**
 * Props interface of {@link PasswordRecoveryFlowBuilderProvider}
 */
export type PasswordRecoveryFlowBuilderProviderProps = PropsWithChildren<unknown>;

const params: ClaimsGetParams = {
    "exclude-hidden-claims": true,
    "exclude-identity-claims": true,
    filter: null,
    limit: null,
    offset: null,
    sort: null
};

/**
 * This component provides password recovery flow builder related context to its children.
 *
 * @param props - Props injected to the component.
 * @returns The PasswordRecoveryFlowBuilderProvider component.
 */
const PasswordRecoveryFlowBuilderProvider: FC<PasswordRecoveryFlowBuilderProviderProps> = ({
    children
}: PropsWithChildren<PasswordRecoveryFlowBuilderProviderProps>): ReactElement => {

    const screensList: PreviewScreenType[] = useMemo(() => ([
        PreviewScreenType.PASSWORD_RECOVERY,
        PreviewScreenType.COMMON,
        PreviewScreenType.PASSWORD_RESET,
        PreviewScreenType.PASSWORD_RESET_SUCCESS,
        PreviewScreenType.EMAIL_OTP,
        PreviewScreenType.SMS_OTP,
        PreviewScreenType.EMAIL_LINK_EXPIRY
    ]), []);

    return (
        <AuthenticationFlowBuilderCoreProvider
            ElementFactory={ ElementFactory }
            ResourceProperties={ ResourceProperties }
            flowType={ FlowTypes.PASSWORD_RECOVERY }
            screenTypes={ screensList }
            validationConfig={ {
                isPasswordExecutorValidationEnabled: true,
                isRecoveryFactorValidationEnabled: true
            } }
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
const FlowContextWrapper: FC<PasswordRecoveryFlowBuilderProviderProps> = ({
    children
}: PropsWithChildren<PasswordRecoveryFlowBuilderProviderProps>): ReactElement => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { toObject } = useReactFlow();
    const { flowCompletionConfigs } = useAuthenticationFlowBuilderCore();
    const { metadata } = useAuthenticationFlowBuilderCore();
    const {
        data: isNewPasswordRecoveryPortalEnabled,
        mutate: mutateNewPasswordRecoveryPortalEnabledRequest
    } = useNewPasswordRecoveryPortalFeatureStatus();

    const [ selectedAttributes, setSelectedAttributes ] = useState<{ [key: string]: Attribute[] }>({});
    const [ isPublishing, setIsPublishing ] = useState<boolean>(false);

    const shouldFetchClaims: boolean = !!metadata?.attributeProfile;

    const { data: claimsData } = useGetAllLocalClaims<Attribute[]>(
        params,
        shouldFetchClaims
    );

    /**
     * Transform the claims to ensure the username claim is always included.
     * Sort the claims by displayName alphabetically.
     */
    const getSortedAttributesWithUsername: Attribute[] = useMemo(() => {
        const claims: Attribute[] = claimsData as Attribute[];

        if (!claims || claims.length === 0) {
            // Fallback to metadata if API data is not available
            const metadataClaims: any = (metadata?.attributeMetadata ?? []).map((attr: any) => ({
                claimURI: attr.claimURI,
                displayName: attr.name
            }));

            return transformClaimsWithUsername(metadataClaims as Attribute[]);
        }

        return transformClaimsWithUsername(claims);
    }, [ claimsData, metadata?.attributeMetadata ]);

    const supportedAttributes: Attribute[] = getSortedAttributesWithUsername;


    const handlePublish = async (): Promise<boolean> => {
        setIsPublishing(true);

        const flow: any = toObject();

        if (!isNewPasswordRecoveryPortalEnabled) {
            try {
                await updateNewPasswordRecoveryPortalFeatureStatus(true);
            } catch(error) {
                dispatch(
                    addAlert({
                        description: "Failed to enable the new password recovery flow experience.",
                        level: AlertLevels.ERROR,
                        message: "Flow Update Failure"
                    })
                );
            }

            mutateNewPasswordRecoveryPortalEnabledRequest();
        }

        if (!isEmpty(flowCompletionConfigs)) {
            try {
                await updateFlowConfig({
                    flowCompletionConfigs,
                    flowType: FlowTypes.PASSWORD_RECOVERY
                });
            } catch (error) {
                dispatch(
                    addAlert({
                        description: t("flows:core.notifications.updateFlowConfig.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("flows:core.notifications.updateFlowConfig.genericError.message")
                    })
                );
            }
        }

        try {
            const passwordRecoveryFlow: any = transformFlow(flow);

            passwordRecoveryFlow.flowType = PasswordRecoveryFlowConstants.PASSWORD_RECOVERY_FLOW_TYPE;

            await configurePasswordRecoveryFlow(passwordRecoveryFlow);

            dispatch(
                addAlert({
                    description: "Password recovery flow updated successfully.",
                    level: AlertLevels.SUCCESS,
                    message: "Flow Updated Successfully"
                })
            );

            return true;
        } catch (error) {
            dispatch(
                addAlert({
                    description: "Failed to update the password recovery flow.",
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
        <PasswordRecoveryFlowBuilderContext.Provider
            value={ {
                isNewPasswordRecoveryPortalEnabled,
                isPublishing,
                onPublish: handlePublish,
                selectedAttributes,
                setSelectedAttributes,
                supportedAttributes
            } }
        >
            { children }
        </PasswordRecoveryFlowBuilderContext.Provider>
    );
};

export default PasswordRecoveryFlowBuilderProvider;
