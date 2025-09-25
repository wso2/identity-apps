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

import updateFlowConfig from "@wso2is/admin.flow-builder-core.v1/api/update-flow-config";
import useAuthenticationFlowBuilderCore from
    "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import AuthenticationFlowBuilderCoreProvider
    from "@wso2is/admin.flow-builder-core.v1/providers/authentication-flow-builder-core-provider";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { PreviewScreenType } from "@wso2is/common.branding.v1/models/branding-preferences";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useReactFlow } from "@xyflow/react";
import isEmpty from "lodash-es/isEmpty";
import React, { FC, PropsWithChildren, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import configureRegistrationFlow from "../api/configure-registration-flow";
import useGetSupportedProfileAttributes from "../api/use-get-supported-profile-attributes";
import ResourceProperties from "../components/resource-property-panel/resource-properties";
import ElementFactory from "../components/resources/elements/element-factory";
import RegistrationFlowConstants from "../constants/registration-flow-constants";
import RegistrationFlowBuilderContext from "../context/registration-flow-builder-context";
import { Attribute } from "../models/attributes";
import transformFlow from "../utils/transform-flow";

/**
 * Props interface of {@link RegistrationFlowBuilderProvider}
 */
export type RegistrationFlowBuilderProviderProps = PropsWithChildren<unknown>;

/**
 * This component provides registration flow builder related context to its children.
 *
 * @param props - Props injected to the component.
 * @returns The RegistrationFlowBuilderProvider component.
 */
const RegistrationFlowBuilderProvider: FC<RegistrationFlowBuilderProviderProps> = ({
    children
}: PropsWithChildren<RegistrationFlowBuilderProviderProps>): ReactElement => {

    const screensList: PreviewScreenType[] = useMemo(() => ([
        PreviewScreenType.SIGN_UP,
        PreviewScreenType.COMMON,
        PreviewScreenType.EMAIL_LINK_EXPIRY,
        PreviewScreenType.EMAIL_OTP,
        PreviewScreenType.SMS_OTP
    ]), []);

    return (
        <AuthenticationFlowBuilderCoreProvider
            ElementFactory={ ElementFactory }
            ResourceProperties={ ResourceProperties }
            flowType={ FlowTypes.REGISTRATION }
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
const FlowContextWrapper: FC<RegistrationFlowBuilderProviderProps> = ({
    children
}: PropsWithChildren<RegistrationFlowBuilderProviderProps>): ReactElement => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const { toObject } = useReactFlow();
    const { data: supportedAttributes } = useGetSupportedProfileAttributes();
    const { flowCompletionConfigs } = useAuthenticationFlowBuilderCore();

    const [ selectedAttributes, setSelectedAttributes ] = useState<{ [key: string]: Attribute[] }>({});
    const [ isPublishing, setIsPublishing ] = useState<boolean>(false);

    const handlePublish = async (): Promise<boolean> => {
        setIsPublishing(true);

        const flow: any = toObject();

        if (!isEmpty(flowCompletionConfigs)) {
            try {
                await updateFlowConfig({
                    flowCompletionConfigs,
                    flowType: FlowTypes.REGISTRATION
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
            const registrationFlow: any = transformFlow(flow) as any;

            registrationFlow.flowType = RegistrationFlowConstants.REGISTRATION_FLOW_TYPE;

            await configureRegistrationFlow(registrationFlow);

            dispatch(
                addAlert({
                    description: t("flows:registrationFlow.notifications.updateRegistrationFlow.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("flows:registrationFlow.notifications.updateRegistrationFlow.success.message")
                })
            );

            return true;
        } catch (error) {
            dispatch(
                addAlert({
                    description: t(
                        "flows:registrationFlow.notifications.updateRegistrationFlow.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t("flows:registrationFlow.notifications.updateRegistrationFlow.genericError.message")
                })
            );

            return false;
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <RegistrationFlowBuilderContext.Provider
            value={ {
                isPublishing,
                onPublish: handlePublish,
                selectedAttributes,
                setSelectedAttributes,
                supportedAttributes
            } }
        >
            { children }
        </RegistrationFlowBuilderContext.Provider>
    );
};

export default RegistrationFlowBuilderProvider;
